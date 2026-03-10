const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const { createNoise2D } = require("simplex-noise");

const noise2D = createNoise2D();

const CONFIG = {
  input:  "scripts/figure.png",
  svgOut: "public/figure-ultra.svg",
  jsonOut: "public/figure-dots.json",  // overwrites previous

  background:    "#000000",
  particleColor: "#32FF87",
  accentColor:   "#F4F4F4",

  spacing: 7,

  minRadius: 1.4,
  maxRadius: 3.8,
  outlineStrokeWidth: 1,

  greenThreshold:   120,
  redMaxThreshold:  140,
  blueMaxThreshold: 180,
  alphaThreshold:   10,

  bodyFillProbability:    0.75,
  edgeFillProbability:    0.35,
  bodyOutlineProbability: 0.15,
  edgeOutlineProbability: 0.90,

  noiseScale:           0.03,
  displacement:         0.8,
  radiusNoiseInfluence: 1.1,

  edgeDetectionStrength: 28,

  ambientParticleCount: 90,
  ambientDistanceMin:   10,
  ambientDistanceMax:   90,

  enableGlow:       true,
  glowStdDeviation: 4.5,

  padding: 30,
};

// ── Helpers ────────────────────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function rand(min = 0, max = 1) { return Math.random() * (max - min) + min; }
function chance(p) { return Math.random() < p; }
function map(v, i0, i1, o0, o1) {
  return o0 + clamp((v - i0) / (i1 - i0 || 1), 0, 1) * (o1 - o0);
}
function getPixel(data, width, x, y) {
  const i = (y * width + x) * 4;
  return { r: data[i], g: data[i+1], b: data[i+2], a: data[i+3] };
}
function isSubject(px) {
  return px.a > CONFIG.alphaThreshold &&
    px.g >= CONFIG.greenThreshold &&
    px.r <= CONFIG.redMaxThreshold &&
    px.b <= CONFIG.blueMaxThreshold;
}
function luminance(px) { return 0.2126*px.r + 0.7152*px.g + 0.0722*px.b; }

function detectEdge(data, width, height, x, y) {
  const center = getPixel(data, width, x, y);
  if (!isSubject(center)) return 0;
  const dirs = [[0,-1],[1,0],[0,1],[-1,0],[-1,-1],[1,-1],[1,1],[-1,1]];
  let contrast = 0;
  const cLum = luminance(center);
  for (const [dx, dy] of dirs) {
    const nx = clamp(x+dx, 0, width-1);
    const ny = clamp(y+dy, 0, height-1);
    const nb = getPixel(data, width, nx, ny);
    contrast += isSubject(nb) ? Math.abs(cLum - luminance(nb)) : 255;
  }
  return contrast / dirs.length;
}

function buildBBox(mask, width, height) {
  let minX=width, minY=height, maxX=0, maxY=0, found=false;
  for (let y=0; y<height; y++)
    for (let x=0; x<width; x++)
      if (mask[y*width+x]) {
        found=true;
        if (x<minX) minX=x; if (y<minY) minY=y;
        if (x>maxX) maxX=x; if (y>maxY) maxY=y;
      }
  return found ? {minX,minY,maxX,maxY} : {minX:0,minY:0,maxX:width-1,maxY:height-1};
}

function buildDistField(mask, width, height) {
  const field = new Float32Array(width*height).fill(Infinity);
  const queue = [];
  const dirs  = [[0,-1],[1,0],[0,1],[-1,0]];
  for (let y=0; y<height; y++)
    for (let x=0; x<width; x++) {
      if (!mask[y*width+x]) continue;
      let border = false;
      for (const [dx,dy] of dirs) {
        const nx=x+dx, ny=y+dy;
        if (nx<0||ny<0||nx>=width||ny>=height||!mask[ny*width+nx]) { border=true; break; }
      }
      if (border) { field[y*width+x]=0; queue.push([x,y]); }
    }
  let head=0;
  while (head<queue.length) {
    const [x,y]=queue[head++];
    const base=field[y*width+x];
    for (const [dx,dy] of dirs) {
      const nx=x+dx, ny=y+dy;
      if (nx<0||ny<0||nx>=width||ny>=height||!mask[ny*width+nx]) continue;
      const next=base+1;
      if (next<field[ny*width+nx]) { field[ny*width+nx]=next; queue.push([nx,ny]); }
    }
  }
  return field;
}

// ── Main ───────────────────────────────────────────────────────────
async function run() {
  const img    = await loadImage(CONFIG.input);
  const W      = img.width, H = img.height;
  const canvas = createCanvas(W, H);
  const ctx    = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const data = ctx.getImageData(0, 0, W, H).data;

  const mask = new Uint8Array(W*H);
  for (let y=0; y<H; y++)
    for (let x=0; x<W; x++)
      mask[y*W+x] = isSubject(getPixel(data, W, x, y)) ? 1 : 0;

  const bbox  = buildBBox(mask, W, H);
  const dist  = buildDistField(mask, W, H);

  const svgW  = W + CONFIG.padding*2;
  const svgH  = H + CONFIG.padding*2;

  const particles = [];

  // Main pass
  for (let y=0; y<H; y+=CONFIG.spacing)
    for (let x=0; x<W; x+=CONFIG.spacing) {
      if (!mask[y*W+x]) continue;

      const edge   = detectEdge(data, W, H, x, y);
      const eFact  = clamp(edge / CONFIG.edgeDetectionStrength, 0, 1);
      const dist0  = dist[y*W+x];
      const iFact  = clamp(map(dist0, 0, 12, 0, 1), 0, 1);

      const n   = noise2D(x*CONFIG.noiseScale, y*CONFIG.noiseScale);
      const dStr = map(eFact, 0, 1, 0.5, 1.2) * CONFIG.displacement;
      const dx  = n * dStr;
      const dy  = noise2D((x+1000)*CONFIG.noiseScale, (y-1000)*CONFIG.noiseScale) * dStr;

      const rBase   = map(iFact, 0, 1, CONFIG.minRadius, CONFIG.maxRadius);
      const r       = clamp(rBase + Math.abs(n)*CONFIG.radiusNoiseInfluence, CONFIG.minRadius, CONFIG.maxRadius+0.8);

      const px      = getPixel(data, W, x, y);
      const isWhite = px.r>200 && px.g>200 && px.b>200;
      const color   = isWhite ? CONFIG.accentColor : CONFIG.particleColor;
      const opacity = clamp(map(iFact, 0, 1, 0.72, 0.98)+rand(-0.05,0.05), 0.35, 1);

      const pX = x + dx + CONFIG.padding;
      const pY = y + dy + CONFIG.padding;

      const fillP    = eFact>0.45 ? CONFIG.edgeFillProbability    : CONFIG.bodyFillProbability;
      const outlineP = eFact>0.45 ? CONFIG.edgeOutlineProbability : CONFIG.bodyOutlineProbability;

      if (chance(fillP))
        particles.push({ type:"fill", x:pX, y:pY, r, color, opacity,
          filter: CONFIG.enableGlow && !isWhite ? "glowGreen" : null });

      if (chance(outlineP))
        particles.push({ type:"outline", x:pX, y:pY, r:r+rand(0.1,0.8), color,
          opacity: clamp(opacity-rand(0.08,0.22),0.18,0.9),
          sw: CONFIG.outlineStrokeWidth+rand(-0.2,0.35), filter:null });
    }

  // Ambient
  const cX = (bbox.minX+bbox.maxX)/2 + CONFIG.padding;
  const cY = (bbox.minY+bbox.maxY)/2 + CONFIG.padding;
  const rEnv = Math.max(bbox.maxX-bbox.minX, bbox.maxY-bbox.minY)*0.5;
  for (let i=0; i<CONFIG.ambientParticleCount; i++) {
    const angle = rand(0, Math.PI*2);
    const ring  = rand(CONFIG.ambientDistanceMin, CONFIG.ambientDistanceMax);
    const x = cX + Math.cos(angle)*(rEnv*0.55+ring) + noise2D(i*0.3,1.1)*8;
    const y = cY + Math.sin(angle)*(rEnv*0.75+ring*0.7) + noise2D(i*0.21,7.7)*8;
    const r = rand(1.1, 3.6);
    const isFill   = chance(0.42);
    const useWhite = chance(0.15);
    const color    = useWhite ? CONFIG.accentColor : CONFIG.particleColor;
    particles.push(isFill
      ? { type:"fill",    x, y, r, color, opacity:rand(0.55,0.9),  filter: !useWhite&&CONFIG.enableGlow?"glowGreen":null }
      : { type:"outline", x, y, r, color, opacity:rand(0.18,0.7),  sw:rand(0.8,1.3), filter:null });
  }

  particles.sort((a,b) => (a.type==="fill"?1:0)-(b.type==="fill"?1:0));

  // ── SVG output ───────────────────────────────────────────────────
  const toCircle = p => p.type==="fill"
    ? `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${p.r.toFixed(2)}" fill="${p.color}" opacity="${p.opacity.toFixed(3)}"${p.filter?` filter="url(#${p.filter})"`:""}/>`
    : `<circle cx="${p.x.toFixed(2)}" cy="${p.y.toFixed(2)}" r="${p.r.toFixed(2)}" fill="none" stroke="${p.color}" stroke-width="${p.sw.toFixed(2)}" opacity="${p.opacity.toFixed(3)}"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <defs>
    <filter id="glowGreen" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${CONFIG.glowStdDeviation}" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="${CONFIG.background}"/>
  ${particles.map(toCircle).join("\n  ")}
</svg>`;

  // ── JSON output (for canvas animation) ──────────────────────────
  const json = {
    srcW: svgW,
    srcH: svgH,
    particles: particles.map(p => ({
      type:    p.type,
      x:       +p.x.toFixed(2),
      y:       +p.y.toFixed(2),
      r:       +p.r.toFixed(2),
      opacity: +p.opacity.toFixed(3),
    })),
  };

  fs.writeFileSync(CONFIG.svgOut,  svg,                    "utf8");
  fs.writeFileSync(CONFIG.jsonOut, JSON.stringify(json),   "utf8");

  console.log(`figura criada — ${particles.length} partículas`);
  console.log(`→ ${CONFIG.svgOut}`);
  console.log(`→ ${CONFIG.jsonOut}`);
}

run().catch(console.error);
