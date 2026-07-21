// ===== Geometry Models Registry =====

const models = [
  { id: 'hand-in-hand', name: '手拉手模型',     draw: drawHandInHand,    params: [{name:'旋转角度', key:'angle', min:0, max:90,  step:1, default:45}] },
  { id: 'k-model',      name: '一线三等角',      draw: drawKModel,        params: [{name:'角度',     key:'angle', min:10,max:80, step:1, default:40}] },
  { id: 'double-median',name: '倍长中线',        draw: drawDoubleMedian,  params: [{name:'三角形形状',key:'shape', min:-30,max:80, step:1, default:20}] },
  { id: 'bisector',     name: '角平分线模型',     draw: drawBisector,     params: [{name:'角度',     key:'angle', min:20,max:140,step:1, default:60},{name:'点的位置',key:'pos',  min:20,max:80, step:1, default:55}] },
  { id: 'shortest-path',name: '将军饮马',        draw: drawShortestPath,  params: [{name:'路径展示', key:'t',    min:0, max:1,   step:0.01,default:0.5}] },
  { id: 'dart',         name: '飞镖模型',        draw: drawDart,          params: [{name:'调整形状', key:'shape', min:-30,max:40, step:1, default:0}] },
  { id: 'figure-8',     name: '八字模型',        draw: drawFigure8,       params: [{name:'调整角度', key:'angle', min:20,max:80, step:1, default:45}] },
  { id: 'half-angle',   name: '半角模型',        draw: drawHalfAngle,     params: [{name:'半角角度', key:'angle', min:5, max:40, step:1, default:22}] },
  { id: 'cut-supp',     name: '截长补短',        draw: drawCutSupp,       params: [{name:'展示阶段', key:'stage', min:0, max:1,  step:0.01,default:0.5}] },
  { id: 'pythagorean',  name: '勾股定理',        draw: drawPythagorean,   params: [{name:'直角三角形',key:'ratio',min:0.3,max:2, step:0.01,default:0.75}] },
];

// ============================================================
// 1. 手拉手模型 (Hand-in-Hand)
// ============================================================
function drawHandInHand(ctx, w, h, p, frame) {
  const cx = w/2, cy = h/2;

  // Two isosceles triangles sharing vertex A
  const A = { x: cx - 80, y: cy + 30 };
  const len = 110;
  const baseAng = -Math.PI/3;

  const B = { x: A.x + len * Math.cos(baseAng), y: A.y + len * Math.sin(baseAng) };
  const C = { x: A.x + len * Math.cos(baseAng + Math.PI/3), y: A.y + len * Math.sin(baseAng + Math.PI/3) };

  const rotAng = -p.angle * Math.PI / 180;
  const D = { x: A.x + len * Math.cos(baseAng + rotAng), y: A.y + len * Math.sin(baseAng + rotAng) };
  const E = { x: A.x + len * Math.cos(baseAng + Math.PI/3 + rotAng), y: A.y + len * Math.sin(baseAng + Math.PI/3 + rotAng) };

  // Triangle 1 - raw canvas
  ctx.beginPath();
  ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath();
  ctx.fillStyle = 'rgba(37,99,235,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 2.5; ctx.stroke();

  // Triangle 2 - raw canvas
  ctx.beginPath();
  ctx.moveTo(A.x, A.y); ctx.lineTo(D.x, D.y); ctx.lineTo(E.x, E.y); ctx.closePath();
  ctx.fillStyle = 'rgba(22,163,74,0.15)';
  ctx.fill();
  ctx.strokeStyle = '#16a34a'; ctx.lineWidth = 2.5; ctx.stroke();

  // BD and CE lines
  ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.lineTo(D.x, D.y);
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.lineTo(E.x, E.y);
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 2.5; ctx.stroke();

  // Points
  [A,B,C,D,E].forEach((pt, i) => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI*2);
    ctx.fillStyle = '#1f2937';
    ctx.fill();
  });

  // Labels
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A', A.x, A.y - 14);
  ctx.fillText('B', B.x, B.y - 14);
  ctx.fillText('C', C.x, C.y - 14);
  ctx.fillText('D', D.x, D.y - 14);
  ctx.fillText('E', E.x, E.y - 14);

  // Theorem
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('△ABC ≅ △ADE (SAS) → BD = CE', cx, h - 28);
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px sans-serif';
  ctx.fillText('手拉手：两等腰三角形共顶点旋转，拉手线相等', cx, h - 52);
}

// ============================================================
// 2. 一线三等角 (K-Model)
// ============================================================
function drawKModel(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 5;

  const angle = p.angle * Math.PI / 180;
  // Horizontal base line: B--C--D
  const baseY = cy + 60;
  const B = { x: cx - 140, y: baseY };
  const C = { x: cx, y: baseY };
  const D = { x: cx + 140, y: baseY };

  // Draw base line
  drawLine(ctx, B.x - 30, baseY, D.x + 30, baseY, C.gray, 1.5);

  // Points above the line forming equal angles
  const len = 100;
  const A = { x: B.x, y: B.y - len };
  // From C, go up at angle (π/2 - angle)
  const midLen = len * 0.7;
  const E = { x: C.x + midLen * Math.sin(angle), y: C.y - midLen * Math.cos(angle) };
  // From D, go up
  const F = { x: D.x, y: D.y - len * 1.2 };

  // Draw lines forming the angles
  drawLine(ctx, B.x, B.y, A.x, A.y, C.primary, 2);
  drawLine(ctx, C.x, C.y, E.x, E.y, C.primary, 2);
  drawLine(ctx, D.x, D.y, F.x, F.y, C.primary, 2);

  // Draw the triangles
  drawPolygon(ctx, [A, B, E], hexToRGBA(C.secondary, 0.15), C.secondary, 2);
  drawPolygon(ctx, [E, D, F], hexToRGBA(C.success, 0.15), C.success, 2);

  // Connect E to C and C to D etc
  drawDashed(ctx, C.x, C.y, B.x, B.y);
  drawDashed(ctx, C.x, C.y, D.x, D.y);

  // Angle arcs
  drawAngle(ctx, B, C, A, C.accent, 30, 'α', true);
  drawAngle(ctx, C, B, A, C.accent, 30, 'α', true);
  // Third equal angle at D-C-E or similar
  drawAngle(ctx, D, C, E, C.accent, 30, 'α', true);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.primary);
  drawPoint(ctx, B.x, B.y, 'B', C.primary);
  drawPoint(ctx, C.x, C.y, 'C', C.primary);
  drawPoint(ctx, D.x, D.y, 'D', C.primary);
  drawPoint(ctx, E.x, E.y, 'E', C.primary);
  drawPoint(ctx, F.x, F.y, 'F', C.primary);

  // Theorem
  drawLabel(ctx, cx, h - 28, '∠B = ∠ACE = ∠D → △ABC ∽ △CDE', C.dark, 14, true);
  drawLabel(ctx, cx, h - 52, '一线三等角：同侧三个等角导出相似三角形', C.gray, 12);
}

// ============================================================
// 3. 倍长中线 (Double Median)
// ============================================================
function drawDoubleMedian(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 15;

  const baseY = cy + 80;
  const B = { x: cx - 100, y: baseY };
  const C = { x: cx + 100, y: baseY };
  const A = { x: cx + p.shape, y: cy - 70 };

  // Midpoint of BC
  const D = { x: (B.x + C.x)/2, y: baseY };
  // Extend AD to E such that AD = DE
  const E = { x: A.x + 2*(D.x - A.x), y: A.y + 2*(D.y - A.y) };

  // Original triangle
  drawPolygon(ctx, [A, B, C], hexToRGBA(C.secondary, 0.08), C.secondary, 2);

  // Median
  drawLine(ctx, A.x, A.y, D.x, D.y, C.primary, 2.5);
  // Extended
  drawDashed(ctx, D.x, D.y, (A.x+D.x)/2, (A.y+D.y)/2);
  drawLine(ctx, D.x, D.y, E.x, E.y, C.danger, 2.5);

  // Equal marks on median
  drawEqualMark(ctx, A, D, 2, C.primary);
  drawEqualMark(ctx, D, E, 2, C.danger);

  // Connect to form parallelogram
  drawDashed(ctx, B.x, B.y, E.x, E.y, C.gray);
  drawDashed(ctx, C.x, C.y, E.x, E.y, C.gray);
  drawEqualMark(ctx, B, E, 1, C.gray);
  drawEqualMark(ctx, A, C, 1, C.gray);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, C.x, C.y, 'C', C.dark);
  drawPoint(ctx, D.x, D.y, 'D', C.primary);
  drawPoint(ctx, E.x, E.y, 'E', C.danger);

  // Theorem
  drawLabel(ctx, cx, h - 28, 'AD = DE → ABEC 为平行四边形 → AB = CE', C.dark, 14, true);
  drawLabel(ctx, cx, h - 52, '倍长中线：延长中线一倍构造全等三角形', C.gray, 12);
}

// ============================================================
// 4. 角平分线模型
// ============================================================
function drawBisector(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 10;

  const O = { x: cx, y: cy + 80 };
  const halfAng = p.angle / 2 * Math.PI / 180;
  const lineLen = 200;

  // Two rays
  const A = { x: O.x - lineLen * Math.cos(halfAng), y: O.y - lineLen * Math.sin(halfAng) };
  const B = { x: O.x + lineLen * Math.cos(halfAng), y: O.y - lineLen * Math.sin(halfAng) };

  drawLine(ctx, O.x, O.y, A.x, A.y, C.dark, 2.5);
  drawLine(ctx, O.x, O.y, B.x, B.y, C.dark, 2.5);

  // Bisector (vertical up)
  const C = { x: O.x, y: O.y - lineLen * 0.85 };

  // Point P on bisector
  const P = { x: O.x, y: O.y - lineLen * p.pos / 100 };
  drawLine(ctx, O.x, O.y, C.x, C.y, C.accent, 3);

  // Perpendicular from P to OA and OB
  const footA = footOfPerp(P, O, A);
  const footB = footOfPerp(P, O, B);

  drawDashed(ctx, P.x, P.y, footA.x, footA.y, C.danger);
  drawDashed(ctx, P.x, P.y, footB.x, footB.y, C.danger);
  drawRightAngle(ctx, footA, O, P);
  drawRightAngle(ctx, footB, O, P);

  // Equal marks on perpendiculars
  drawEqualMark(ctx, P, footA, 2, C.danger);
  drawEqualMark(ctx, P, footB, 2, C.danger);

  // Angle marks
  drawAngle(ctx, O, A, P, C.accent, 35, '', true);
  drawAngle(ctx, O, P, B, C.accent, 35, '', true);

  // Angle label
  const midAng = 0;
  const labelX = O.x;
  const labelY = O.y - 50;
  ctx.fillStyle = C.accent;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('∠1=∠2', labelX, labelY);

  // Points
  drawPoint(ctx, O.x, O.y, 'O', C.dark);
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, P.x, P.y, 'P', C.accent);
  drawPoint(ctx, footA.x, footA.y, 'D', C.danger, 4);
  drawPoint(ctx, footB.x, footB.y, 'E', C.danger, 4);

  // Theorem
  drawLabel(ctx, cx, h - 28, '角平分线上的点到角两边距离相等 → PD = PE', C.dark, 14, true);
  drawLabel(ctx, cx, h - 52, '角平分线性质：PD ⊥ OA，PE ⊥ OB', C.gray, 12);
}

// ============================================================
// 5. 将军饮马 (Shortest Path)
// ============================================================
function drawShortestPath(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 15;

  // River line
  const riverY = cy + 50;
  drawLine(ctx, 30, riverY, w - 30, riverY, C.secondary, 3);

  // Points A and B above river
  const A = { x: cx - 120, y: cy - 30 };
  const B = { x: cx + 120, y: cy - 30 };

  // Reflect B across river
  const B2 = { x: B.x, y: riverY + (riverY - B.y) };

  // Intersection of A-B2 with river
  const t = (riverY - A.y) / (B2.y - A.y);
  const P = { x: A.x + t * (B2.x - A.x), y: riverY };

  // Draw construction
  drawDashed(ctx, B.x, B.y, B2.x, B2.y, C.gray);
  drawLabel(ctx, B2.x, B2.y + 18, "B'", C.gray, 13);

  // Draw A to P to B (the optimal path)
  if (p.t >= 0.01) {
    const pathLen = dist(A, P) + dist(P, B);
    const totalDirect = (p.t >= 0.99) ? 1 : p.t;
    const currentP = { x: A.x + totalDirect * (B2.x - A.x), y: A.y + totalDirect * (B2.y - A.y) };
    const riverHit = { x: A.x + t * (B2.x - A.x), y: riverY };

    if (totalDirect <= t) {
      drawLine(ctx, A.x, A.y, currentP.x, currentP.y, C.danger, 3);
    } else {
      drawLine(ctx, A.x, A.y, riverHit.x, riverHit.y, C.danger, 3);
      const postRiver = totalDirect - t;
      const postLen = dist(B2, riverHit);
      const currentB = { x: riverHit.x + (postRiver / postLen) * (B.x - riverHit.x), y: riverY + (postRiver / postLen) * (B.y - riverY) };
      if (currentB.y > riverY) {
        // reflected path
        const reflected = lerp(riverHit.y, B.y, Math.min(1, postRiver / (B.y - riverY)));
        const realY = Math.min(B.y, riverY + postRiver * (B.y - riverY) / (B.y - riverY));
        const progress = Math.min(1, totalDirect);
        const ry = riverY + progress * (B.y - riverY)*(B.y - riverY)/(B.y - riverY);
        // Simplify: just draw path A->P->current on segment PB
        const segProgress = Math.min(1, (totalDirect - t) / (1 - t));
        const segX = riverHit.x + segProgress * (B.x - riverHit.x);
        const segY = riverHit.y + segProgress * (B.y - riverHit.y);
        drawLine(ctx, riverHit.x, riverHit.y, segX, segY, C.danger, 3);
      }
    }
  }
  drawLine(ctx, A.x, A.y, P.x, P.y, C.danger, 3);
  drawLine(ctx, P.x, P.y, B.x, B.y, C.danger, 3);

  // Dashed A to B'
  drawDashed(ctx, A.x, A.y, B2.x, B2.y, C.gray);
  drawDashed(ctx, B.x, B.y, B2.x, B2.y, C.gray);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, B2.x, B2.y, "B'", C.gray, 4);
  drawPoint(ctx, P.x, P.y, 'P', C.danger);

  // River label
  drawLabel(ctx, 50, riverY - 14, '河岸 L', C.secondary, 13, true);

  // Theorem
  drawLabel(ctx, cx, h - 32, '作 B 关于 L 的对称点 B\', 连接 AB\' 交 L 于 P → AP+PB 最短', C.dark, 13, true);
  drawLabel(ctx, cx, h - 55, '将军饮马：轴对称求最短路径（AP+PB = AB\'）', C.gray, 12);
}

// ============================================================
// 6. 飞镖模型 (Dart)
// ============================================================
function drawDart(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 15;

  const A = { x: cx + p.shape, y: cy - 70 };
  const B = { x: cx - 120, y: cy + 70 };
  const C = { x: cx, y: cy + 30 };
  const D = { x: cx + 120, y: cy + 70 };

  // Draw the concave quadrilateral
  drawPolygon(ctx, [A, B, C, D], hexToRGBA(C.purple, 0.1), C.purple, 2.5);

  // Connect A-C (internal line)
  drawDashed(ctx, A.x, A.y, C.x, C.y, C.gray);

  // Angles
  const BA = { x: B.x - A.x, y: B.y - A.y };
  const CA = { x: C.x - A.x, y: C.y - A.y };
  const DA = { x: D.x - A.x, y: D.y - A.y };
  const AB = { x: A.x - B.x, y: A.y - B.y };
  const CB = { x: C.x - B.x, y: C.y - B.y };
  const AC = { x: A.x - C.x, y: A.y - C.y };
  const BC = { x: B.x - C.x, y: B.y - C.y };
  const DC = { x: D.x - C.x, y: D.y - C.y };
  const AD = { x: A.x - D.x, y: A.y - D.y };
  const CD = { x: C.x - D.x, y: C.y - D.y };

  // Draw angle arcs at A (the concave angle - large)
  drawAngle(ctx, A, B, D, C.danger, 45, '∠A', true);

  // At B
  const B_AB = { x: A.x, y: A.y };
  const B_CB = { x: C.x, y: C.y };
  drawAngle(ctx, B, A, C, C.accent, 28, '∠B', true);

  // At C
  drawAngle(ctx, C, B, D, C.success, 28, '∠C', true);

  // At D
  drawAngle(ctx, D, A, C, C.secondary, 28, '∠D', true);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, C.x, C.y, 'C', C.dark);
  drawPoint(ctx, D.x, D.y, 'D', C.dark);

  // Theorem
  drawLabel(ctx, cx, h - 28, '∠A = ∠B + ∠C + ∠D', C.dark, 15, true);
  drawLabel(ctx, cx, h - 52, '飞镖定理：凹角等于三个内角之和', C.gray, 12);
}

// ============================================================
// 7. 八字模型 (Figure 8)
// ============================================================
function drawFigure8(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 15;

  const angle = p.angle * Math.PI / 180;
  const len = 130;

  // Two lines crossing
  const O = { x: cx, y: cy };
  const A = { x: cx - len * Math.cos(angle), y: cy - len * Math.sin(angle) };
  const B = { x: cx + len * Math.cos(angle), y: cy + len * Math.sin(angle) };
  const C = { x: cx + len * Math.cos(angle), y: cy - len * Math.sin(angle) };
  const D = { x: cx - len * Math.cos(angle), y: cy + len * Math.sin(angle) };

  // Draw intersecting lines
  drawLine(ctx, A.x, A.y, B.x, B.y, C.primary, 2);
  drawLine(ctx, C.x, C.y, D.x, D.y, C.primary, 2);

  // Angles at intersection
  drawAngle(ctx, O, A, C, C.danger, 30, '∠1', true);
  drawAngle(ctx, O, C, B, C.danger, 30, '∠2', true);
  drawAngle(ctx, O, B, D, C.success, 30, '∠3', true);
  drawAngle(ctx, O, D, A, C.success, 30, '∠4', true);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, C.x, C.y, 'C', C.dark);
  drawPoint(ctx, D.x, D.y, 'D', C.dark);
  drawPoint(ctx, O.x, O.y, 'O', C.dark, 5);

  // Theorem
  drawLabel(ctx, cx, h - 28, '∠1 = ∠2 (对顶角)， ∠A+∠D = ∠B+∠C', C.dark, 14, true);
  drawLabel(ctx, cx, h - 52, '八字模型：对顶三角形角度关系 / 相似八字形', C.gray, 12);
}

// ============================================================
// 8. 半角模型 (Half-Angle)
// ============================================================
function drawHalfAngle(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 20;

  // Square
  const size = 160;
  const S = { x: cx - size/2, y: cy + size/2 };
  const A = { x: S.x, y: S.y - size }; // top-left
  const B = { x: S.x + size, y: S.y - size }; // top-right
  const C = { x: S.x + size, y: S.y }; // bottom-right
  const D = { x: S.x, y: S.y }; // bottom-left

  drawPolygon(ctx, [A, B, C, D], hexToRGBA(C.primary, 0.05), C.primary, 2.5);

  // Half angle ray from A
  const halfAng = p.angle * Math.PI / 180;
  const totalAngle = Math.PI / 2; // 90°
  // First ray at angle (from vertical)
  const rayDir1 = -Math.PI/2 + halfAng;
  const rayDir2 = -Math.PI/2; // straight down (right angle side)
  const rayDir3 = 0; // to the right

  // Ray at 45°-ish (the half-angle ray)
  // In the model: ∠EAF = 45° where E on BC, F on CD
  // Actually in the half-angle model, from A we draw a line inside the right angle
  // The key is that ∠EAF = 45° where the whole angle is 90°

  // Let's simplify: Draw two rays from A: one at angle 'halfAng' from AB, another at 45° from the first
  const baselineAngle = 0; // direction of AB (to the right)
  const ray1Angle = baselineAngle + halfAng;
  const ray2Angle = baselineAngle + halfAng + Math.PI/4; // 45° from ray1

  // Intersection points
  const ray1End = { x: A.x + size * 1.5 * Math.cos(ray1Angle), y: A.y + size * 1.5 * Math.sin(ray1Angle) };
  const ray2End = { x: A.x + size * 1.5 * Math.cos(ray2Angle), y: A.y + size * 1.5 * Math.sin(ray2Angle) };

  // Find intersection with BC (right edge) or CD (bottom edge)
  // Ray1 intersects BC or CD
  const E = lineIntersection(A, ray1End, B, C); // BC
  const F = lineIntersection(A, ray2End, D, C); // CD

  drawLine(ctx, A.x, A.y, E.x, E.y, C.danger, 2.5);
  drawLine(ctx, A.x, A.y, F.x, F.y, C.danger, 2.5);
  drawLine(ctx, E.x, E.y, F.x, F.y, C.accent, 2.5);

  // Angle mark at A (45°)
  drawAngle(ctx, A, E, F, C.accent, 35, '45°', true);

  // Right angle at corner
  drawRightAngle(ctx, A, B, D, 20, C.primary);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.primary);
  drawPoint(ctx, C.x, C.y, 'C', C.primary);
  drawPoint(ctx, D.x, D.y, 'D', C.primary);
  drawPoint(ctx, E.x, E.y, 'E', C.danger);
  drawPoint(ctx, F.x, F.y, 'F', C.danger);

  // Theorem
  drawLabel(ctx, cx, h - 28, '正方形中 ∠EAF = 45° → EF = BE + DF', C.dark, 14, true);
  drawLabel(ctx, cx, h - 52, '半角模型：将△ADF旋转90°至△ABG，证△AEG≅△AEF', C.gray, 12);
}

function lineIntersection(p1, p2, p3, p4) {
  const d = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
  if (Math.abs(d) < 1e-8) return { x: p1.x, y: p1.y };
  const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / d;
  return { x: p1.x + t * (p2.x - p1.x), y: p1.y + t * (p2.y - p1.y) };
}

// ============================================================
// 9. 截长补短 (Cut-Long / Supplement-Short)
// ============================================================
function drawCutSupp(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 30;

  // Three segments to compare: a + b = c
  // "截长"：在长线段 c 上截取一段等于 a，证明剩余等 b
  // "补短"：延长短线段 a 增加 b，证明等于 c

  const aLen = 80, bLen = 60, cLen = aLen + bLen;
  const segY1 = cy - 20, segY2 = cy + 30, segY3 = cy + 70;

  // Segment a (top)
  const aStart = { x: cx - 150, y: segY1 };
  const aEnd = { x: aStart.x + aLen, y: segY1 };
  drawLine(ctx, aStart.x, aStart.y, aEnd.x, aEnd.y, C.secondary, 5);
  drawPoint(ctx, aStart.x, aStart.y, '', C.secondary, 4);
  drawPoint(ctx, aEnd.x, aEnd.y, '', C.secondary, 4);
  drawLabel(ctx, aStart.x + aLen/2, segY1 - 18, 'a', C.secondary, 15, true);

  // Segment b (middle)
  const bStart = { x: cx - 150, y: segY2 };
  const bEnd = { x: bStart.x + bLen, y: segY2 };
  drawLine(ctx, bStart.x, bStart.y, bEnd.x, bEnd.y, C.success, 5);
  drawPoint(ctx, bStart.x, bStart.y, '', C.success, 4);
  drawPoint(ctx, bEnd.x, bEnd.y, '', C.success, 4);
  drawLabel(ctx, bStart.x + bLen/2, segY2 - 18, 'b', C.success, 15, true);

  // Segment c = a + b (bottom)
  const cStart = { x: cx - 150, y: segY3 };
  const cEnd = { x: cStart.x + cLen, y: segY3 };
  drawLine(ctx, cStart.x, cStart.y, cEnd.x, cEnd.y, C.primary, 5);
  drawPoint(ctx, cStart.x, cStart.y, '', C.primary, 4);
  drawPoint(ctx, cEnd.x, cEnd.y, '', C.primary, 4);
  drawLabel(ctx, cStart.x + cLen/2, segY3 - 18, 'c = a + b', C.primary, 15, true);

  // Animation: show "cut" or "supplement"
  const stage = p.stage;
  if (stage < 0.5) {
    // Show "截长" - cut segment c
    const cutX = cStart.x + aLen;
    // Dashed line on c showing the cut point
    drawDashed(ctx, cutX, segY3 - 25, cutX, segY3 + 10, C.danger);
    drawLabel(ctx, cStart.x + aLen/2, segY3 + 20, 'a', C.secondary, 13, true);
    drawLabel(ctx, cutX + bLen/2, segY3 + 20, '剩余 = b', C.success, 13, true);

    // Arrow bracket
    const arrowY = segY1;
    drawArrow(ctx, {x: aEnd.x + 10, y: segY1}, {x: cStart.x + aLen + 10, y: segY3}, C.danger, 2);
    drawLabel(ctx, cx + 80, cy, '截长法：在c上截a', C.dark, 13, true);
  } else {
    // Show "补短"
    const extEnd = { x: aEnd.x + bLen, y: segY1 };
    drawDashed(ctx, aEnd.x, aEnd.y, extEnd.x, extEnd.y, C.danger);
    drawLabel(ctx, aEnd.x + bLen/2, segY1 + 20, '补 b', C.success, 13, true);
    drawLabel(ctx, cx + 80, cy, '补短法：延长a加b', C.dark, 13, true);
  }

  // Theorem
  drawLabel(ctx, cx, h - 20, '已知 a + b = c，证明线段关系：截长补短法', C.dark, 14, true);
}

// ============================================================
// 10. 勾股定理 (Pythagorean)
// ============================================================
function drawPythagorean(ctx, w, h, p, frame) {
  drawBackground(ctx, w, h);
  const cx = w/2, cy = h/2 - 10;

  // Right triangle with adjustable ratio
  const ratio = p.ratio;
  const scale = 50;
  const legA = scale; // vertical leg
  const legB = scale * ratio; // horizontal leg
  const hyp = Math.sqrt(legA*legA + legB*legB);

  // Triangle vertices
  const triOrigin = { x: cx - legB/2, y: cy + legA/2 };
  const A = { x: triOrigin.x, y: triOrigin.y };
  const B = { x: triOrigin.x + legB, y: triOrigin.y };
  const C = { x: triOrigin.x, y: triOrigin.y - legA };

  // Right triangle
  drawPolygon(ctx, [A, B, C], hexToRGBA(C.primary, 0.1), C.primary, 2.5);
  drawRightAngle(ctx, A, B, C);

  // Squares on each side
  // Square on leg BC (horizontal leg)
  const sqA1 = [
    A,
    B,
    { x: B.x, y: B.y + legB },
    { x: A.x, y: A.y + legB },
  ];
  drawPolygon(ctx, sqA1, hexToRGBA(C.secondary, 0.12), C.secondary, 2);
  drawLabel(ctx, (sqA1[0].x+sqA1[1].x)/2, (sqA1[0].y+sqA1[2].y)/2 + 5,
    'a²', C.secondary, 13, true);

  // Square on leg AC (vertical leg)
  const sqB1 = [
    A,
    { x: A.x - legA, y: A.y },
    { x: A.x - legA, y: C.y },
    C,
  ];
  drawPolygon(ctx, sqB1, hexToRGBA(C.success, 0.12), C.success, 2);
  drawLabel(ctx, (sqB1[1].x+sqB1[2].x)/2 - 3, (A.y+C.y)/2,
    'b²', C.success, 13, true);

  // Square on hypotenuse AB
  const dx = C.x - B.x;
  const dy = C.y - B.y;
  const sqC1 = [
    B,
    C,
    { x: C.x - dy, y: C.y + dx },
    { x: B.x - dy, y: B.y + dx },
  ];
  drawPolygon(ctx, sqC1, hexToRGBA(C.accent, 0.12), C.accent, 2);
  const sqCcenter = {
    x: (sqC1[0].x + sqC1[2].x) / 2,
    y: (sqC1[0].y + sqC1[2].y) / 2,
  };
  drawLabel(ctx, sqCcenter.x, sqCcenter.y, 'c²', C.accent, 13, true);

  // Labels for sides
  const midAB = { x: (A.x+B.x)/2, y: A.y + 20 };
  drawLabel(ctx, midAB.x, midAB.y, 'a', C.secondary, 13, true);
  const midAC = { x: A.x - 20, y: (A.y+C.y)/2 };
  drawLabel(ctx, midAC.x, midAC.y, 'b', C.success, 13, true);
  const midBC = { x: (B.x+C.x)/2 - 15, y: (B.y+C.y)/2 - 5 };
  drawLabel(ctx, midBC.x, midBC.y, 'c', C.accent, 13, true);

  // Points
  drawPoint(ctx, A.x, A.y, 'A', C.dark);
  drawPoint(ctx, B.x, B.y, 'B', C.dark);
  drawPoint(ctx, C.x, C.y, 'C', C.dark);

  // Theorem
  drawLabel(ctx, cx, h - 28, 'a² + b² = c²', C.dark, 16, true);
  drawLabel(ctx, cx, h - 52, '勾股定理：直角三角形两直角边的平方和等于斜边的平方', C.gray, 12);
}
