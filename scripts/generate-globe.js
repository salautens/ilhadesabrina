const fs = require("fs")
const { createCanvas, loadImage } = require("canvas")

// Output canvas (globe will be circular inside this)
const SIZE    = 280
const SPACING = 7
const RADIUS  = 5   // SVG dot radius for preview

// Orthographic projection center: lon0=-20° (Atlantic view), lat0=15°
const LON0 = -20 * Math.PI / 180
const LAT0 =  15 * Math.PI / 180

// Source flat map resolution for accurate sampling
const SRC_W = 1200
const SRC_H = 600

async function generate() {
  const img = await loadImage("scripts/world-map.png")

  // Draw source map at high resolution for accurate pixel sampling
  const srcCanvas = createCanvas(SRC_W, SRC_H)
  const srcCtx    = srcCanvas.getContext("2d")
  srcCtx.drawImage(img, 0, 0, SRC_W, SRC_H)
  const srcData = srcCtx.getImageData(0, 0, SRC_W, SRC_H).data

  function sampleMap(lat, lon) {
    // Normalize lon to [-π, π]
    lon = ((lon + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI
    const mx = Math.floor((lon / Math.PI + 1) * 0.5 * (SRC_W - 1))
    const my = Math.floor((0.5 - lat / Math.PI) * (SRC_H - 1))
    const cx = Math.max(0, Math.min(SRC_W - 1, mx))
    const cy = Math.max(0, Math.min(SRC_H - 1, my))
    return srcData[(cy * SRC_W + cx) * 4 + 3] // alpha channel
  }

  // Inverse orthographic projection: canvas (px, py) → (lat, lon)
  // Globe circle center and radius in output canvas
  const globeCx = SIZE / 2
  const globeCy = SIZE / 2
  const globeR  = SIZE / 2 - SPACING

  const dots = []
  let svg = `<svg width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" xmlns="http://www.w3.org/2000/svg">
<circle cx="${globeCx}" cy="${globeCy}" r="${globeR}" fill="#2962FF"/>
`

  for (let y = SPACING / 2; y < SIZE; y += SPACING) {
    for (let x = SPACING / 2; x < SIZE; x += SPACING) {
      // Relative to globe center, normalized (radius = 1)
      const nx =  (x - globeCx) / globeR
      const ny = -(y - globeCy) / globeR  // flip: canvas-y down = south

      const rho2 = nx * nx + ny * ny
      if (rho2 > 1) continue  // outside globe circle

      // Inverse orthographic: z = sqrt(1 - rho²)
      const nz = Math.sqrt(1 - rho2)

      // Geographic coordinates
      const lat = Math.asin(nz * Math.sin(LAT0) + ny * Math.cos(LAT0))
      const lon  = LON0 + Math.atan2(nx, nz * Math.cos(LAT0) - ny * Math.sin(LAT0))

      const alpha = sampleMap(lat, lon)
      if (alpha > 80) {
        const filled = Math.random() > 0.6
        // Geographic sphere coordinates (independent of view angle)
        const gx = Math.cos(lat) * Math.sin(lon)
        const gy = Math.sin(lat)
        const gz = Math.cos(lat) * Math.cos(lon)
        dots.push({ x, y, filled, gx, gy, gz })

        if (filled) {
          svg += `<circle cx="${x}" cy="${y}" r="${RADIUS}" fill="white"/>\n`
        } else {
          svg += `<circle cx="${x}" cy="${y}" r="${RADIUS}" fill="none" stroke="white" stroke-width="1"/>\n`
        }
      }
    }
  }

  svg += `</svg>`

  fs.writeFileSync("public/globe.svg", svg)
  fs.writeFileSync("public/globe-dots.json", JSON.stringify(dots))

  console.log(`globo criado — ${dots.length} dots`)
  console.log("→ public/globe.svg")
  console.log("→ public/globe-dots.json")
}

generate()
