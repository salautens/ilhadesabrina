const fs = require("fs")
const { createCanvas, loadImage } = require("canvas")

const OUT_W    = 160  // output width (scaled to shape at runtime)
const OUT_H    = 200  // output height
const SPACING  = 6   // px between dots
const DOT_R    = 3   // SVG preview dot radius

async function generate() {
  const img = await loadImage("scripts/figure.png")

  const canvas = createCanvas(OUT_W, OUT_H)
  const ctx    = canvas.getContext("2d")
  ctx.drawImage(img, 0, 0, OUT_W, OUT_H)

  const data = ctx.getImageData(0, 0, OUT_W, OUT_H).data

  const dots = []
  let svg = `<svg width="${OUT_W}" height="${OUT_H}" viewBox="0 0 ${OUT_W} ${OUT_H}" xmlns="http://www.w3.org/2000/svg">
<rect width="100%" height="100%" fill="black"/>
`

  for (let y = 0; y < OUT_H; y += SPACING) {
    for (let x = 0; x < OUT_W; x += SPACING) {
      const i  = (y * OUT_W + x) * 4
      const r  = data[i]
      const g  = data[i + 1]
      const b  = data[i + 2]
      const brightness = (r + g + b) / 3

      if (brightness > 60) {
        dots.push({ x, y })
        svg += `<circle cx="${x}" cy="${y}" r="${DOT_R}" fill="#3ACFFF"/>\n`
      }
    }
  }

  svg += `</svg>`

  fs.writeFileSync("public/figure.svg", svg)
  fs.writeFileSync("public/figure-dots.json", JSON.stringify(dots))

  console.log(`figura criada — ${dots.length} dots`)
  console.log("→ public/figure.svg")
  console.log("→ public/figure-dots.json")
}

generate()
