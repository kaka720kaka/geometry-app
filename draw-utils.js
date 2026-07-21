// ===== Canvas Drawing Utilities =====

// Color palette
const C = {
  primary:   '#4f46e5', // indigo
  secondary: '#2563eb', // blue
  accent:    '#f59e0b', // amber
  danger:    '#dc2626', // red
  success:   '#16a34a', // green
  purple:    '#9333ea',
  pink:      '#db2777',
  orange:    '#ea580c',
  teal:      '#0d9488',
  gray:      '#6b7280',
  lightGray: '#d1d5db',
  dark:      '#1f2937',
};

function hexToRGBA(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// Draw a labeled point
function drawPoint(ctx, x, y, label='', color=C.primary, r=5) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
  if (label) {
    ctx.fillStyle = C.dark;
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, y - 14);
  }
}

// Draw a line segment
function drawLine(ctx, x1, y1, x2, y2, color=C.dark, width=2, dash=[]) {
  ctx.beginPath();
  ctx.setLineDash(dash);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.setLineDash([]);
}

// Draw a polygon with optional fill
function drawPolygon(ctx, points, fillColor=null, strokeColor=C.dark, lineWidth=2) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

// Draw angle arc
function drawAngle(ctx, vertex, p1, p2, color=C.accent, radius=30, label='', fill=false) {
  const ang1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const ang2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);

  ctx.beginPath();
  ctx.moveTo(vertex.x, vertex.y);
  ctx.arc(vertex.x, vertex.y, radius, ang1, ang2, false);
  ctx.lineTo(vertex.x, vertex.y);

  if (fill) {
    ctx.fillStyle = hexToRGBA(color, 0.25);
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(vertex.x, vertex.y, radius, ang1, ang2, false);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  if (label) {
    const midAng = (ang1 + ang2) / 2;
    // Adjust for arc direction
    let labelAng = midAng;
    const lx = vertex.x + (radius + 16) * Math.cos(labelAng);
    const ly = vertex.y + (radius + 16) * Math.sin(labelAng);
    ctx.fillStyle = color;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, lx, ly);
  }
}

// Draw right angle marker
function drawRightAngle(ctx, vertex, p1, p2, size=15, color=C.dark) {
  const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
  const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
  const x1 = vertex.x + size * Math.cos(a1);
  const y1 = vertex.y + size * Math.sin(a1);
  const x2 = vertex.x + size * Math.cos(a2);
  const y2 = vertex.y + size * Math.sin(a2);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + (x2 - vertex.x), y1 + (y2 - vertex.y));
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

// Draw parallel marks on a line
function drawParallelMarks(ctx, p1, p2, count=2, color=C.dark, gap=8) {
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI/2;
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  for (let i = 0; i < count; i++) {
    const offset = gap * (i - (count-1)/2);
    const cx = mx + offset * Math.cos(ang);
    const cy = my + offset * Math.sin(ang);

    const len = 10;
    const dx = len * Math.cos(ang + Math.PI/2);
    const dy = len * Math.sin(ang + Math.PI/2);

    ctx.beginPath();
    ctx.moveTo(cx - dx/2, cy - dy/2);
    ctx.lineTo(cx + dx/2, cy + dy/2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// Draw equal-length marks on a segment
function drawEqualMark(ctx, p1, p2, count=1, color=C.dark) {
  const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) + Math.PI/2;
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const len = 10;
  for (let i = 0; i < count; i++) {
    const offset = 6 * (i - (count-1)/2);
    const cx = mx + offset * Math.cos(ang + Math.PI/2);
    const cy = my + offset * Math.sin(ang + Math.PI/2);

    ctx.beginPath();
    ctx.moveTo(cx - len * Math.cos(ang), cy - len * Math.sin(ang));
    ctx.lineTo(cx + len * Math.cos(ang), cy + len * Math.sin(ang));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
}

// Draw a dashed segment between two points
function drawDashed(ctx, x1, y1, x2, y2, color=C.gray) {
  drawLine(ctx, x1, y1, x2, y2, color, 1.5, [6, 4]);
}

// Draw arrow from p1 to p2
function drawArrow(ctx, from, to, color=C.dark, width=2) {
  const ang = Math.atan2(to.y - from.y, to.x - from.x);
  const headLen = 12;
  const p1 = { x: to.x - headLen * Math.cos(ang - 0.4), y: to.y - headLen * Math.sin(ang - 0.4) };
  const p2 = { x: to.x - headLen * Math.cos(ang + 0.4), y: to.y - headLen * Math.sin(ang + 0.4) };

  drawLine(ctx, from.x, from.y, to.x, to.y, color, width);
  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Draw label at position with optional background
function drawLabel(ctx, x, y, text, color=C.dark, fontSize=14, bold=false) {
  ctx.fillStyle = color;
  ctx.font = `${bold ? 'bold ' : ''}${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

// Fill background
function drawBackground(ctx, w, h) {
  ctx.fillStyle = '#fafbfc';
  ctx.fillRect(0, 0, w, h);
  // subtle grid
  ctx.strokeStyle = '#e8eaed';
  ctx.lineWidth = 0.5;
  const step = 30;
  for (let x = step; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = step; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
}

// lerp
function lerp(a, b, t) { return a + (b - a) * t; }

// Distance
function dist(p1, p2) {
  const dx = p1.x - p2.x, dy = p1.y - p2.y;
  return Math.sqrt(dx*dx + dy*dy);
}

// Rotate point around origin
function rotate(p, origin, angle) {
  const dx = p.x - origin.x;
  const dy = p.y - origin.y;
  return {
    x: origin.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: origin.y + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
}

// Get perpendicular foot from point to line
function footOfPerp(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx*dx + dy*dy);
  return { x: a.x + t * dx, y: a.y + t * dy };
}
