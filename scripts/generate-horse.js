const fs = require("fs")
const { createCanvas, loadImage } = require("canvas")
const { createNoise2D } = require("simplex-noise")

const noise2D = createNoise2D()

const CONFIG = {
  input:   "scripts/horse.png",
  svgOut:  "public/horse.svg",
  jsonOut: "public/horse-dots.json",

  spacing:    5,
  minRadius:  1,
  maxRadius:  2.5,

  brightnessThreshold: 90,
  displacement:        1.2,

  particleColor: "#C04DFF",   // shape 4 neon
  background:    "#0D0D0D",
}

async function generate() {
  const img    = await loadImage(CONFIG.input)
  const W      = img.width
  const H      = img.height
  const canvas = createCanvas(W, H)
  const ctx    = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0)
  const pixels = ctx.getImageData(0, 0, W, H).data

  const particles = []
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="100%" height="100%" fill="${CONFIG.background}"/>
`

  for (let y = 0; y < H; y += CONFIG.spacing) {
    for (let x = 0; x < W; x += CONFIG.spacing) {
      const i          = (y * W + x) * 4
      const brightness = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3

      if (brightness > CONFIG.brightnessThreshold) {
        const n  = noise2D(x * 0.03, y * 0.03)
        const ox = n * CONFIG.displacement
        const oy = n * CONFIG.displacement
        const r  = CONFIG.minRadius + Math.abs(n) * (CONFIG.maxRadius - CONFIG.minRadius)

        particles.push({ x: x + ox, y: y + oy, r })

        svg += `<circle cx="${(x+ox).toFixed(2)}" cy="${(y+oy).toFixed(2)}" r="${r.toFixed(2)}" fill="${CONFIG.particleColor}"/>\n`
      }
    }
  }

  svg += `</svg>`

  // JSON: normalize positions to 0–1 so Footer can scale to any size
  const json = {
    srcW: W,
    srcH: H,
    particles: particles.map(p => ({
      x: +p.x.toFixed(2),
      y: +p.y.toFixed(2),
      r: +p.r.toFixed(2),
    })),
  }

  fs.writeFileSync(CONFIG.svgOut,  svg,                  "utf8")
  fs.writeFileSync(CONFIG.jsonOut, JSON.stringify(json), "utf8")

  console.log(`cavalo criado — ${particles.length} partículas`)
  console.log(`→ ${CONFIG.svgOut}`)
  console.log(`→ ${CONFIG.jsonOut}`)
}

generate().catch(console.error)
