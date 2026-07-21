// ===== Geometry Models Registry =====
const models = [
  { id:'hand-in-hand',  name:'手拉手模型',   draw:drawHandInHand,   params:[{name:'旋转角度',key:'angle',min:0,max:90,step:1,default:45}] },
  { id:'k-model',       name:'一线三等角',    draw:drawKModel,       params:[{name:'角度',    key:'angle',min:10,max:80,step:1,default:40}] },
  { id:'double-median', name:'倍长中线',      draw:drawDoubleMedian, params:[{name:'形状',    key:'shape',min:-30,max:80,step:1,default:20}] },
  { id:'bisector',      name:'角平分线模型',   draw:drawBisector,    params:[{name:'角度',    key:'angle',min:20,max:140,step:1,default:60},{name:'位置',key:'pos',min:20,max:80,step:1,default:55}] },
  { id:'shortest-path', name:'将军饮马',      draw:drawShortestPath, params:[{name:'路径',    key:'t',   min:0,max:1,step:0.01,default:0.5}] },
  { id:'dart',          name:'飞镖模型',      draw:drawDart,         params:[{name:'形状',    key:'shape',min:-30,max:40,step:1,default:0}] },
  { id:'figure-8',      name:'八字模型',      draw:drawFigure8,      params:[{name:'角度',    key:'angle',min:20,max:80,step:1,default:45}] },
  { id:'half-angle',    name:'半角模型',      draw:drawHalfAngle,    params:[{name:'半角',    key:'angle',min:5,max:40,step:1,default:22}] },
  { id:'cut-supp',      name:'截长补短',      draw:drawCutSupp,      params:[{name:'阶段',    key:'stage',min:0,max:1,step:0.01,default:0.5}] },
  { id:'pythagorean',   name:'勾股定理',      draw:drawPythagorean,  params:[{name:'比例',    key:'ratio',min:0.3,max:2,step:0.01,default:0.75}] },
];

// Colors
const CLR = {
  pri:'#4f46e5', sec:'#2563eb', acc:'#f59e0b', red:'#dc2626',
  grn:'#16a34a', pur:'#9333ea', org:'#ea580c', teal:'#0d9488',
  gry:'#6b7280', lgr:'#d1d5db', dark:'#1f2937',
};

function clr(c, a) {
  return `rgba(${parseInt(c.slice(1,3),16)},${parseInt(c.slice(3,5),16)},${parseInt(c.slice(5,7),16)},${a})`;
}

// ============================================================
// 1. 手拉手模型
// ============================================================
function drawHandInHand(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2;
  const A={x:cx-80, y:cy+30};
  const len=110, ba=-Math.PI/3;
  const B={x:A.x+len*Math.cos(ba), y:A.y+len*Math.sin(ba)};
  const C={x:A.x+len*Math.cos(ba+Math.PI/3), y:A.y+len*Math.sin(ba+Math.PI/3)};
  const ra=-p.angle*Math.PI/180;
  const D={x:A.x+len*Math.cos(ba+ra), y:A.y+len*Math.sin(ba+ra)};
  const E={x:A.x+len*Math.cos(ba+Math.PI/3+ra), y:A.y+len*Math.sin(ba+Math.PI/3+ra)};

  // Triangles
  const tri = function(a,b,c,fc,sc,lw){
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.lineTo(c.x,c.y); ctx.closePath();
    ctx.fillStyle=fc; ctx.fill(); ctx.strokeStyle=sc; ctx.lineWidth=lw; ctx.stroke();
  }
  tri(A,B,C, clr(CLR.sec,0.12), CLR.sec, 2.5);
  tri(A,D,E, clr(CLR.grn,0.12), CLR.grn, 2.5);

  // BD and CE
  const seg = function(a,b,c,lw,d){
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=c; ctx.lineWidth=lw; if(d)ctx.setLineDash(d); ctx.stroke(); ctx.setLineDash([]);
  }
  seg(B,D,CLR.red,2.5);
  seg(C,E,CLR.red,2.5);

  // Equal marks on BD, CE
  const mark = function(a,b,c){
    const an=Math.atan2(b.y-a.y,b.x-a.x)+Math.PI/2;
    const mx=(a.x+b.x)/2, my=(a.y+b.y)/2, L=10;
    for(let i=0;i<2;i++){
      const o=6*(i-0.5), cx=mx+o*Math.cos(an+Math.PI/2), cy=my+o*Math.sin(an+Math.PI/2);
      ctx.beginPath(); ctx.moveTo(cx-L*Math.cos(an),cy-L*Math.sin(an)); ctx.lineTo(cx+L*Math.cos(an),cy+L*Math.sin(an));
      ctx.strokeStyle=c; ctx.lineWidth=1.5; ctx.stroke();
    }
  }
  mark(B,D,CLR.red);
  mark(C,E,CLR.red);
  mark(A,B,CLR.sec);
  mark(A,C,CLR.sec);
  mark(A,D,CLR.grn);
  mark(A,E,CLR.grn);

  // Points
  [A,B,C,D,E].forEach((pt,i)=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  // Labels
  ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'},{p:E,l:'E'}].forEach(o=>{
    ctx.fillStyle=CLR.dark; ctx.fillText(o.l, o.p.x, o.p.y-14);
  });

  // Rotation arc
  ctx.beginPath(); ctx.arc(A.x,A.y,50,ba,ba+ra,ra<0);
  ctx.strokeStyle=CLR.acc; ctx.lineWidth=2; ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif';
  ctx.fillText('△ABC ≅ △ADE (SAS) → BD = CE', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('手拉手：两等腰三角形共顶点旋转，拉手线相等', cx, h-52);
}

// ============================================================
// 2. 一线三等角
// ============================================================
function drawKModel(ctx, w, h, p, frame) {
  const cx=w/2, by=h/2+55, ang=p.angle*Math.PI/180;
  const B={x:cx-140,y:by}, C={x:cx,y:by}, D={x:cx+140,y:by};
  const A={x:B.x, y:B.y-100};
  const E={x:C.x+70*Math.sin(ang), y:C.y-70*Math.cos(ang)};
  const F={x:D.x, y:D.y-120};

  // Base line
  ctx.beginPath(); ctx.moveTo(B.x-30,by); ctx.lineTo(D.x+30,by);
  ctx.strokeStyle=CLR.lgr; ctx.lineWidth=1.5; ctx.stroke();

  // Rays
  const ray = function(a,b,c,lw){
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=c; ctx.lineWidth=lw; ctx.stroke();
  }
  ray(B,A,CLR.pri,2); ray(C,E,CLR.pri,2); ray(D,F,CLR.pri,2);

  // Angle arcs
  const angArc = function(v,p1,p2,c,r,lb){
    const a1=Math.atan2(p1.y-v.y,p1.x-v.x), a2=Math.atan2(p2.y-v.y,p2.x-v.x);
    ctx.beginPath(); ctx.arc(v.x,v.y,r,a1,a2,false);
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    const ma=(a1+a2)/2;
    ctx.fillStyle=c; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lb, v.x+(r+16)*Math.cos(ma), v.y+(r+16)*Math.sin(ma));
  }
  angArc(B,A,{x:C.x,y:B.y},CLR.acc,30,'α');
  angArc(C,{x:B.x,y:C.y},E,CLR.acc,30,'α');
  angArc(D,{x:C.x,y:D.y},F,CLR.acc,30,'α');

  // Dashed
  const dash = function(a,b){
    ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=CLR.gry; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
  }
  dash(C,B); dash(C,D);

  // Points
  [A,B,C,D,E,F].forEach(pt=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'},{p:E,l:'E'},{p:F,l:'F'}].forEach(o=>{
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif';
  ctx.fillText('∠B = ∠ACE = ∠D → △ABC ∽ △CDE', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('一线三等角：同侧三个等角导出相似三角形', cx, h-52);
}

// ============================================================
// 3. 倍长中线
// ============================================================
function drawDoubleMedian(ctx, w, h, p, frame) {
  const cx=w/2, by=h/2+75;
  const B={x:cx-100,y:by}, C={x:cx+100,y:by};
  const A={x:cx+p.shape, y:h/2-60};
  const D={x:(B.x+C.x)/2, y:by};
  const E={x:A.x+2*(D.x-A.x), y:A.y+2*(D.y-A.y)};

  // Triangle
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.sec,0.06); ctx.fill();
  ctx.strokeStyle=CLR.sec; ctx.lineWidth=2; ctx.stroke();

  // Median
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(D.x,D.y);
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=2.5; ctx.stroke();
  // Extended segment D-E
  ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(D.x,D.y); ctx.lineTo(E.x,E.y);
  ctx.strokeStyle=CLR.red; ctx.lineWidth=2.5; ctx.stroke();
  ctx.setLineDash([]);

  // Dashed BE and CE
  const dd = function(a,b){
    ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=CLR.gry; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
  }
  dd(B,E); dd(C,E);

  // Equal marks
  const em = function(a,b,c,n){
    const an=Math.atan2(b.y-a.y,b.x-a.x)+Math.PI/2, mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    for(let i=0;i<n;i++){
      const o=6*(i-(n-1)/2), x=mx+o*Math.cos(an+Math.PI/2), y=my+o*Math.sin(an+Math.PI/2);
      ctx.beginPath(); ctx.moveTo(x-10*Math.cos(an),y-10*Math.sin(an)); ctx.lineTo(x+10*Math.cos(an),y+10*Math.sin(an));
      ctx.strokeStyle=c; ctx.lineWidth=1.5; ctx.stroke();
    }
  }
  em(A,D,CLR.pri,2); em(D,E,CLR.red,2); em(B,E,CLR.gry,1); em(A,C,CLR.gry,1);

  // Points
  [A,B,C,D,E].forEach(pt=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'},{p:E,l:'E'}].forEach(o=>{
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif';
  ctx.fillText('AD = DE → ABEC 为平行四边形 → AB = CE', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('倍长中线：延长中线一倍构造全等三角形', cx, h-52);
}

// ============================================================
// 4. 角平分线模型
// ============================================================
function drawBisector(ctx, w, h, p, frame) {
  const cx=w/2, O={x:cx, y:h/2+80};
  const ha=p.angle/2*Math.PI/180, L=200;
  const A={x:O.x-L*Math.cos(ha), y:O.y-L*Math.sin(ha)};
  const B={x:O.x+L*Math.cos(ha), y:O.y-L*Math.sin(ha)};
  const P={x:O.x, y:O.y-L*p.pos/100};

  // Rays OA, OB
  ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(A.x,A.y);
  ctx.strokeStyle=CLR.dark; ctx.lineWidth=2.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(B.x,B.y);
  ctx.strokeStyle=CLR.dark; ctx.lineWidth=2.5; ctx.stroke();

  // Bisector
  ctx.beginPath(); ctx.moveTo(O.x,O.y); ctx.lineTo(O.x,O.y-L*0.85);
  ctx.strokeStyle=CLR.acc; ctx.lineWidth=3; ctx.setLineDash([8,4]); ctx.stroke(); ctx.setLineDash([]);

  // Perpendicular foots
  const foot = function(pt,a,b){
    const dx=b.x-a.x, dy=b.y-a.y, t=((pt.x-a.x)*dx+(pt.y-a.y)*dy)/(dx*dx+dy*dy);
    return {x:a.x+t*dx, y:a.y+t*dy};
  }
  const fA=foot(P,O,A), fB=foot(P,O,B);

  // Dashed perpendiculars
  const dd = function(a,b){
    ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=CLR.red; ctx.lineWidth=2; ctx.stroke(); ctx.setLineDash([]);
  }
  dd(P,fA); dd(P,fB);

  // Right angle marks
  const rt = function(v,p1,p2){
    const a1=Math.atan2(p1.y-v.y,p1.x-v.x), a2=Math.atan2(p2.y-v.y,p2.x-v.x), s=15;
    const x1=v.x+s*Math.cos(a1), y1=v.y+s*Math.sin(a1);
    const x2=v.x+s*Math.cos(a2), y2=v.y+s*Math.sin(a2);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x1+(x2-v.x),y1+(y2-v.y)); ctx.lineTo(x2,y2);
    ctx.strokeStyle=CLR.dark; ctx.lineWidth=1.5; ctx.stroke();
  }
  rt(fA,O,P); rt(fB,O,P);

  // Equal marks
  const em = function(a,b,n){
    const an=Math.atan2(b.y-a.y,b.x-a.x)+Math.PI/2, mx=(a.x+b.x)/2, my=(a.y+b.y)/2;
    for(let i=0;i<n;i++){
      const o=6*(i-(n-1)/2), x=mx+o*Math.cos(an+Math.PI/2), y=my+o*Math.sin(an+Math.PI/2);
      ctx.beginPath(); ctx.moveTo(x-10*Math.cos(an),y-10*Math.sin(an)); ctx.lineTo(x+10*Math.cos(an),y+10*Math.sin(an));
      ctx.strokeStyle=CLR.red; ctx.lineWidth=1.5; ctx.stroke();
    }
  }
  em(P,fA,2); em(P,fB,2);

  // Angle marks
  const ang = function(v,p1,p2,c,r,lb){
    const a1=Math.atan2(p1.y-v.y,p1.x-v.x), a2=Math.atan2(p2.y-v.y,p2.x-v.x);
    ctx.beginPath(); ctx.arc(v.x,v.y,r,a1,a2,false);
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    const ma=(a1+a2)/2;
    ctx.fillStyle=c; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lb, v.x+(r+16)*Math.cos(ma), v.y+(r+16)*Math.sin(ma));
  }
  const mid={x:O.x, y:O.y-L*0.3};
  ang(O,A,mid,CLR.acc,35,'∠1'); ang(O,mid,B,CLR.acc,35,'∠2');

  // Points
  [{p:O,l:'O'},{p:A,l:'A'},{p:B,l:'B'},{p:P,l:'P'},{p:fA,l:'D'},{p:fB,l:'E'}].forEach(o=>{
    ctx.beginPath(); ctx.arc(o.p.x,o.p.y,4,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif';
  ctx.fillText('角平分线上的点到角两边距离相等 → PD = PE', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('角平分线性质：PD ⊥ OA，PE ⊥ OB', cx, h-52);
}

// ============================================================
// 5. 将军饮马
// ============================================================
function drawShortestPath(ctx, w, h, p, frame) {
  const cx=w/2, ry=h/2+40;
  const A={x:cx-120, y:h/2-30}, B={x:cx+120, y:h/2-30};
  const B2={x:B.x, y:ry+(ry-B.y)};
  const t=(ry-A.y)/(B2.y-A.y);
  const P={x:A.x+t*(B2.x-A.x), y:ry};

  // River
  ctx.beginPath(); ctx.moveTo(30,ry); ctx.lineTo(w-30,ry);
  ctx.strokeStyle=CLR.sec; ctx.lineWidth=3; ctx.stroke();

  // Path A-P-B
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(P.x,P.y);
  ctx.strokeStyle=CLR.red; ctx.lineWidth=2.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(P.x,P.y); ctx.lineTo(B.x,B.y);
  ctx.strokeStyle=CLR.red; ctx.lineWidth=2.5; ctx.stroke();

  // Dashed A-B' and B-B'
  const dd = function(a,b){
    ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=CLR.gry; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
  }
  dd(A,B2); dd(B,B2);

  // Animated path indicator
  const progress=p.t;
  if(progress<t){
    const cur={x:A.x+progress*(B2.x-A.x), y:A.y+progress*(B2.y-A.y)};
    ctx.beginPath(); ctx.arc(cur.x,cur.y,6,0,Math.PI*2); ctx.fillStyle=CLR.acc; ctx.fill();
  }else{
    const cur={x:P.x+(progress-t)/(1-t)*(B.x-P.x), y:P.y+(progress-t)/(1-t)*(B.y-P.y)};
    if(cur.y>=ry){
      ctx.beginPath(); ctx.arc(cur.x,cur.y,6,0,Math.PI*2); ctx.fillStyle=CLR.acc; ctx.fill();
    }
  }

  // Points
  [{p:A,l:'A'},{p:B,l:'B'},{p:B2,l:"B'"},{p:P,l:'P'}].forEach(o=>{
    ctx.beginPath(); ctx.arc(o.p.x,o.p.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.sec; ctx.font='bold 13px sans-serif'; ctx.textAlign='left';
  ctx.fillText('河岸 L', 32, ry-12);

  ctx.fillStyle=CLR.dark; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('作 B 关于 L 的对称点 B\', 连接 AB\' → AP+PB 最短', cx, h-32);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('将军饮马：轴对称求最短路径（AP+PB = AB\'）', cx, h-52);
}

// ============================================================
// 6. 飞镖模型
// ============================================================
function drawDart(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2-10;
  const A={x:cx+p.shape, y:cy-65};
  const B={x:cx-120, y:cy+70};
  const C={x:cx, y:cy+30};
  const D={x:cx+120, y:cy+70};

  // Quadrilateral
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.lineTo(D.x,D.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.pur,0.1); ctx.fill();
  ctx.strokeStyle=CLR.pur; ctx.lineWidth=2.5; ctx.stroke();

  // Dashed AC
  ctx.beginPath(); ctx.setLineDash([6,4]); ctx.moveTo(A.x,A.y); ctx.lineTo(C.x,C.y);
  ctx.strokeStyle=CLR.gry; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);

  // Angle arcs
  const ang = function(v,p1,p2,c,r,lb){
    const a1=Math.atan2(p1.y-v.y,p1.x-v.x), a2=Math.atan2(p2.y-v.y,p2.x-v.x);
    ctx.beginPath(); ctx.moveTo(v.x,v.y); ctx.arc(v.x,v.y,r,a1,a2,false); ctx.lineTo(v.x,v.y);
    ctx.fillStyle=clr(c,0.2); ctx.fill();
    ctx.beginPath(); ctx.arc(v.x,v.y,r,a1,a2,false);
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    const ma=(a1+a2)/2;
    ctx.fillStyle=c; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lb, v.x+(r+18)*Math.cos(ma), v.y+(r+18)*Math.sin(ma));
  }
  ang(A,B,D,CLR.red,45,'∠A');
  ang(B,A,C,CLR.acc,28,'∠B');
  ang(C,B,D,CLR.grn,28,'∠C');
  ang(D,A,C,CLR.sec,28,'∠D');

  // Points
  [A,B,C,D].forEach(pt=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'}].forEach(o=>{
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
  ctx.fillText('∠A = ∠B + ∠C + ∠D', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('飞镖定理：凹角等于三个内角之和', cx, h-50);
}

// ============================================================
// 7. 八字模型
// ============================================================
function drawFigure8(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2-10;
  const ang=p.angle*Math.PI/180, L=130;
  const O={x:cx,y:cy};
  const A={x:cx-L*Math.cos(ang), y:cy-L*Math.sin(ang)};
  const B={x:cx+L*Math.cos(ang), y:cy+L*Math.sin(ang)};
  const C={x:cx+L*Math.cos(ang), y:cy-L*Math.sin(ang)};
  const D={x:cx-L*Math.cos(ang), y:cy+L*Math.sin(ang)};

  // Lines
  const seg = function(a,b,c,lw){
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=c; ctx.lineWidth=lw; ctx.stroke();
  }
  seg(A,B,CLR.pri,2); seg(C,D,CLR.pri,2);

  // Angle arcs at O
  const angArc = function(v,p1,p2,c,r,lb){
    const a1=Math.atan2(p1.y-v.y,p1.x-v.x), a2=Math.atan2(p2.y-v.y,p2.x-v.x);
    ctx.beginPath(); ctx.moveTo(v.x,v.y); ctx.arc(v.x,v.y,r,a1,a2,false); ctx.lineTo(v.x,v.y);
    ctx.fillStyle=clr(c,0.25); ctx.fill();
    ctx.beginPath(); ctx.arc(v.x,v.y,r,a1,a2,false);
    ctx.strokeStyle=c; ctx.lineWidth=2; ctx.stroke();
    const ma=(a1+a2)/2;
    ctx.fillStyle=c; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText(lb, v.x+(r+16)*Math.cos(ma), v.y+(r+16)*Math.sin(ma));
  }
  angArc(O,A,C,CLR.red,30,'∠1');
  angArc(O,C,B,CLR.red,30,'∠2');
  angArc(O,B,D,CLR.grn,30,'∠3');
  angArc(O,D,A,CLR.grn,30,'∠4');

  // Points
  [A,B,C,D,O].forEach(pt=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'},{p:O,l:'O'}].forEach(o=>{
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
  ctx.fillText('∠1 = ∠2 (对顶角)， ∠A+∠D = ∠B+∠C', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('八字模型：对顶三角形角度关系 / 相似八字形', cx, h-50);
}

// ============================================================
// 8. 半角模型
// ============================================================
function drawHalfAngle(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2-20, sz=160;
  const A={x:cx-sz/2, y:cy-sz/2};
  const B={x:cx+sz/2, y:cy-sz/2};
  const C={x:cx+sz/2, y:cy+sz/2};
  const D={x:cx-sz/2, y:cy+sz/2};

  // Square
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.lineTo(D.x,D.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.pri,0.04); ctx.fill();
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=2.5; ctx.stroke();

  // Right angle mark at A
  const s=18;
  ctx.beginPath(); ctx.moveTo(A.x+s,A.y); ctx.lineTo(A.x+s,A.y-s); ctx.lineTo(A.x,A.y-s);
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=1.5; ctx.stroke();

  // Half-angle rays from A
  const ha=p.angle*Math.PI/180, ba=0;
  const r1a=ba+ha, r2a=ba+ha+Math.PI/4;
  const L=sz*1.8;

  // Line intersection helper
  const isect = function(p1,p2,p3,p4){
    const d=(p1.x-p2.x)*(p3.y-p4.y)-(p1.y-p2.y)*(p3.x-p4.x);
    if(Math.abs(d)<1e-8)return{x:p1.x,y:p1.y};
    const t=((p1.x-p3.x)*(p3.y-p4.y)-(p1.y-p3.y)*(p3.x-p4.x))/d;
    return{x:p1.x+t*(p2.x-p1.x), y:p1.y+t*(p2.y-p1.y)};
  }

  const R1={x:A.x+L*Math.cos(r1a), y:A.y+L*Math.sin(r1a)};
  const R2={x:A.x+L*Math.cos(r2a), y:A.y+L*Math.sin(r2a)};
  const E=isect(A,R1,B,C);
  const F=isect(A,R2,D,C);

  // Rays and EF
  const seg = function(a,b,c,lw){
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=c; ctx.lineWidth=lw; ctx.stroke();
  }
  seg(A,E,CLR.red,2.5); seg(A,F,CLR.red,2.5); seg(E,F,CLR.acc,2.5);

  // Half-angle arc at A
  const a1=Math.atan2(E.y-A.y,E.x-A.x), a2=Math.atan2(F.y-A.y,F.x-A.x);
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.arc(A.x,A.y,40,a1,a2,false); ctx.lineTo(A.x,A.y);
  ctx.fillStyle=clr(CLR.acc,0.2); ctx.fill();
  ctx.beginPath(); ctx.arc(A.x,A.y,40,a1,a2,false);
  ctx.strokeStyle=CLR.acc; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle=CLR.acc; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
  const ma=(a1+a2)/2;
  ctx.fillText('45°', A.x+55*Math.cos(ma), A.y+55*Math.sin(ma));

  // Points
  [{p:A,l:'A'},{p:B,l:'B'},{p:C,l:'C'},{p:D,l:'D'},{p:E,l:'E'},{p:F,l:'F'}].forEach(o=>{
    ctx.beginPath(); ctx.arc(o.p.x,o.p.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
    ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText(o.l,o.p.x,o.p.y-14);
  });

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
  ctx.fillText('正方形中 ∠EAF = 45° → EF = BE + DF', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('半角模型：将△ADF旋转90°至△ABG，证△AEG≅△AEF', cx, h-52);
}

// ============================================================
// 9. 截长补短
// ============================================================
function drawCutSupp(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2-25;
  const aL=80, bL=60, cL=aL+bL;
  const y1=cy-15, y2=cy+35, y3=cy+75;
  const sx=cx-150;

  // Segment a
  ctx.beginPath(); ctx.moveTo(sx,y1); ctx.lineTo(sx+aL,y1);
  ctx.strokeStyle=CLR.sec; ctx.lineWidth=5; ctx.stroke();
  ctx.beginPath(); ctx.arc(sx,y1,4,0,Math.PI*2); ctx.fillStyle=CLR.sec; ctx.fill();
  ctx.beginPath(); ctx.arc(sx+aL,y1,4,0,Math.PI*2); ctx.fillStyle=CLR.sec; ctx.fill();
  ctx.fillStyle=CLR.sec; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText('a',sx+aL/2,y1-18);

  // Segment b
  ctx.beginPath(); ctx.moveTo(sx,y2); ctx.lineTo(sx+bL,y2);
  ctx.strokeStyle=CLR.grn; ctx.lineWidth=5; ctx.stroke();
  ctx.beginPath(); ctx.arc(sx,y2,4,0,Math.PI*2); ctx.fillStyle=CLR.grn; ctx.fill();
  ctx.beginPath(); ctx.arc(sx+bL,y2,4,0,Math.PI*2); ctx.fillStyle=CLR.grn; ctx.fill();
  ctx.fillStyle=CLR.grn; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText('b',sx+bL/2,y2-18);

  // Segment c = a+b
  ctx.beginPath(); ctx.moveTo(sx,y3); ctx.lineTo(sx+cL,y3);
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=5; ctx.stroke();
  ctx.beginPath(); ctx.arc(sx,y3,4,0,Math.PI*2); ctx.fillStyle=CLR.pri; ctx.fill();
  ctx.beginPath(); ctx.arc(sx+cL,y3,4,0,Math.PI*2); ctx.fillStyle=CLR.pri; ctx.fill();
  ctx.fillStyle=CLR.pri; ctx.font='bold 15px sans-serif'; ctx.textAlign='center'; ctx.fillText('c = a + b',sx+cL/2,y3-18);

  // Stage indicator
  if(p.stage<0.5){
    // 截长
    const cx2=sx+aL;
    ctx.beginPath(); ctx.setLineDash([4,4]); ctx.moveTo(cx2,y3-25); ctx.lineTo(cx2,y3+10);
    ctx.strokeStyle=CLR.red; ctx.lineWidth=1.5; ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=CLR.sec; ctx.font='bold 13px sans-serif'; ctx.textAlign='center'; ctx.fillText('a',sx+aL/2,y3+22);
    ctx.fillStyle=CLR.grn; ctx.font='bold 13px sans-serif'; ctx.textAlign='center'; ctx.fillText('剩余 = b',cx2+bL/2,y3+22);
    ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText('截长法：在长线段上截取短线段', cx+30, cy+90);
  }else{
    // 补短
    ctx.beginPath(); ctx.setLineDash([4,4]); ctx.moveTo(sx+aL,y1); ctx.lineTo(sx+aL+bL,y1);
    ctx.strokeStyle=CLR.red; ctx.lineWidth=2; ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle=CLR.grn; ctx.font='bold 13px sans-serif'; ctx.textAlign='center'; ctx.fillText('补 b',sx+aL+bL/2,y1+22);
    ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
    ctx.fillText('补短法：延长短线段补齐', cx+30, cy+90);
  }

  ctx.fillStyle=CLR.dark; ctx.font='bold 14px sans-serif'; ctx.textAlign='center';
  ctx.fillText('已知 a + b = c，证明线段关系：截长补短法', cx, h-18);
}

// ============================================================
// 10. 勾股定理
// ============================================================
function drawPythagorean(ctx, w, h, p, frame) {
  const cx=w/2, cy=h/2+10, sc=50;
  const la=sc, lb=sc*p.ratio, lc=Math.sqrt(la*la+lb*lb);
  const O={x:cx-lb/2, y:cy+la/2};
  const A={x:O.x, y:O.y};
  const B={x:O.x+lb, y:O.y};
  const C={x:O.x, y:O.y-la};

  // Right triangle
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(C.x,C.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.pri,0.1); ctx.fill();
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=2.5; ctx.stroke();

  // Right angle mark
  const s=15;
  ctx.beginPath(); ctx.moveTo(A.x+s,A.y); ctx.lineTo(A.x+s,A.y-s); ctx.lineTo(A.x,A.y-s);
  ctx.strokeStyle=CLR.pri; ctx.lineWidth=1.5; ctx.stroke();

  // Square a² (on bottom leg)
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(B.x,B.y); ctx.lineTo(B.x,B.y+lb); ctx.lineTo(A.x,A.y+lb); ctx.closePath();
  ctx.fillStyle=clr(CLR.sec,0.12); ctx.fill();
  ctx.strokeStyle=CLR.sec; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle=CLR.sec; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('a²',(A.x+B.x)/2, A.y+lb/2+5);

  // Square b² (on vertical leg)
  ctx.beginPath(); ctx.moveTo(A.x,A.y); ctx.lineTo(A.x-la,A.y); ctx.lineTo(A.x-la,C.y); ctx.lineTo(C.x,C.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.grn,0.12); ctx.fill();
  ctx.strokeStyle=CLR.grn; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle=CLR.grn; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('b²',A.x-la/2-3, (A.y+C.y)/2);

  // Square c² (on hypotenuse)
  const dx=C.x-B.x, dy=C.y-B.y;
  const p1=B, p2=C, p3={x:C.x-dy, y:C.y+dx}, p4={x:B.x-dy, y:B.y+dx};
  ctx.beginPath(); ctx.moveTo(p1.x,p1.y); ctx.lineTo(p2.x,p2.y); ctx.lineTo(p3.x,p3.y); ctx.lineTo(p4.x,p4.y); ctx.closePath();
  ctx.fillStyle=clr(CLR.acc,0.12); ctx.fill();
  ctx.strokeStyle=CLR.acc; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle=CLR.acc; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('c²',(p1.x+p3.x)/2, (p1.y+p3.y)/2);

  // Side labels
  ctx.fillStyle=CLR.sec; ctx.font='bold 13px sans-serif'; ctx.textAlign='center';
  ctx.fillText('a',(A.x+B.x)/2, A.y+20);
  ctx.fillStyle=CLR.grn;
  ctx.fillText('b',A.x-18, (A.y+C.y)/2);
  ctx.fillStyle=CLR.acc;
  ctx.fillText('c',(B.x+C.x)/2-15, (B.y+C.y)/2-5);

  // Points
  [A,B,C].forEach(pt=>{
    ctx.beginPath(); ctx.arc(pt.x,pt.y,5,0,Math.PI*2); ctx.fillStyle=CLR.dark; ctx.fill();
  });
  ctx.fillStyle=CLR.dark; ctx.font='bold 15px sans-serif'; ctx.textAlign='center';
  ctx.fillText('A',A.x,A.y-14);
  ctx.fillText('B',B.x,B.y-14);
  ctx.fillText('C',C.x,C.y-14);

  ctx.fillStyle=CLR.dark; ctx.font='bold 16px sans-serif'; ctx.textAlign='center';
  ctx.fillText('a² + b² = c²', cx, h-28);
  ctx.fillStyle=CLR.gry; ctx.font='12px sans-serif';
  ctx.fillText('勾股定理：直角三角形两直角边的平方和等于斜边的平方', cx, h-50);
}
