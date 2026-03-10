// Creates a white horse silhouette on black background
const fs = require("fs");
const { createCanvas } = require("canvas");

const W = 400, H = 300;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, W, H);

ctx.fillStyle = "#ffffff";
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 2;

// ── Horse silhouette (facing right, galloping pose) ──────────────
ctx.beginPath();

// Body
ctx.ellipse(200, 160, 110, 55, -0.1, 0, Math.PI * 2);
ctx.fill();

// Neck
ctx.beginPath();
ctx.moveTo(285, 120);
ctx.bezierCurveTo(300, 90, 320, 70, 310, 50);
ctx.bezierCurveTo(300, 30, 280, 40, 270, 60);
ctx.bezierCurveTo(260, 80, 265, 110, 275, 130);
ctx.closePath();
ctx.fill();

// Head
ctx.beginPath();
ctx.ellipse(318, 44, 28, 18, -0.3, 0, Math.PI * 2);
ctx.fill();

// Snout extension
ctx.beginPath();
ctx.ellipse(338, 52, 16, 10, 0.3, 0, Math.PI * 2);
ctx.fill();

// Ear
ctx.beginPath();
ctx.moveTo(308, 28);
ctx.lineTo(315, 14);
ctx.lineTo(322, 26);
ctx.closePath();
ctx.fill();

// Mane
ctx.beginPath();
ctx.moveTo(285, 55);
ctx.bezierCurveTo(275, 48, 268, 60, 272, 72);
ctx.bezierCurveTo(266, 65, 260, 75, 265, 86);
ctx.bezierCurveTo(258, 80, 255, 90, 260, 100);
ctx.lineWidth = 8;
ctx.stroke();

// Tail
ctx.beginPath();
ctx.moveTo(92, 150);
ctx.bezierCurveTo(70, 140, 50, 120, 40, 100);
ctx.bezierCurveTo(35, 88, 38, 76, 48, 80);
ctx.bezierCurveTo(38, 90, 44, 108, 55, 118);
ctx.bezierCurveTo(65, 130, 80, 145, 90, 158);
ctx.lineWidth = 10;
ctx.stroke();

// Front right leg (extended forward)
ctx.lineWidth = 2;
ctx.beginPath();
ctx.moveTo(275, 205);
ctx.bezierCurveTo(285, 225, 295, 245, 290, 268);
ctx.bezierCurveTo(288, 275, 296, 278, 298, 272);
ctx.bezierCurveTo(300, 250, 290, 228, 280, 210);
ctx.closePath();
ctx.fill();

// Front left leg (slightly back)
ctx.beginPath();
ctx.moveTo(255, 205);
ctx.bezierCurveTo(258, 228, 252, 250, 250, 270);
ctx.bezierCurveTo(248, 276, 256, 278, 258, 272);
ctx.bezierCurveTo(262, 252, 266, 228, 264, 208);
ctx.closePath();
ctx.fill();

// Back right leg (extended back)
ctx.beginPath();
ctx.moveTo(130, 205);
ctx.bezierCurveTo(118, 228, 112, 250, 115, 270);
ctx.bezierCurveTo(113, 276, 121, 278, 123, 272);
ctx.bezierCurveTo(122, 250, 128, 228, 138, 208);
ctx.closePath();
ctx.fill();

// Back left leg
ctx.beginPath();
ctx.moveTo(150, 208);
ctx.bezierCurveTo(148, 230, 145, 252, 148, 270);
ctx.bezierCurveTo(146, 276, 154, 278, 156, 272);
ctx.bezierCurveTo(158, 252, 158, 230, 160, 210);
ctx.closePath();
ctx.fill();

// Hooves
[[290, 272, 12, 6], [252, 272, 12, 6], [117, 272, 12, 6], [148, 272, 12, 6]].forEach(([x, y, rx, ry]) => {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
});

const buf = canvas.toBuffer("image/png");
fs.writeFileSync("scripts/horse.png", buf);
console.log(`horse.png criado — ${W}x${H}px`);
