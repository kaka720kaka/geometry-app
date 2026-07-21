// ===== Main App Controller =====

const canvas = document.getElementById('canvas');
if (!canvas) {
  document.body.innerHTML = '<div style="padding:40px;text-align:center;color:red;">错误：找不到 Canvas 元素</div>';
  throw new Error('Canvas not found');
}

const ctx = canvas.getContext('2d');
const W = 600, H = 400;
canvas.width = W;
canvas.height = H;

// State
let currentModel = null;
let params = {};
let paramDefaults = {};
let playing = false;
let frame = 0;
let animTarget = null;
let animSpeed = 0;
let animMin = 0, animMax = 0;
let errorMsg = null;

// ===== Init =====
function init() {
  if (typeof models === 'undefined' || !models || models.length === 0) {
    errorMsg = '模型数据加载失败，请刷新页面';
    draw();
    return;
  }
  renderModelNav();
  selectModel(models[0].id);
  requestAnimationFrame(loop);
}

// ===== Model Navigation =====
function renderModelNav() {
  const nav = document.getElementById('modelNav');
  nav.innerHTML = models.map((m, i) =>
    `<button class="model-btn" data-id="${m.id}" onclick="selectModel('${m.id}')">
      ${i+1}. ${m.name}
    </button>`
  ).join('');
}

function selectModel(id) {
  const model = models.find(m => m.id === id);
  if (!model) return;
  currentModel = model;

  document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.model-btn[data-id="${id}"]`);
  if (btn) btn.classList.add('active');

  params = {};
  paramDefaults = {};
  currentModel.params.forEach(p => {
    params[p.key] = p.default;
    paramDefaults[p.key] = p.default;
  });

  playing = false;
  frame = 0;
  animTarget = null;
  errorMsg = null;
  renderControls();
  updateInfo();
}

// ===== Controls =====
function renderControls() {
  const container = document.getElementById('controls');
  const model = currentModel;
  if (!model) { container.innerHTML = ''; return; }

  let html = '';
  model.params.forEach(p => {
    html += `<div class="control-group">
      <label>${p.name}</label>
      <input type="range" id="slider-${p.key}" min="${p.min}" max="${p.max}"
        step="${p.step}" value="${params[p.key]}"
        oninput="onParamChange('${p.key}', parseFloat(this.value))">
      <span class="val" id="val-${p.key}">${formatVal(params[p.key], p.step)}</span>
    </div>`;
  });

  const animatable = model.params.length > 0;
  html += `<div class="btn-row">
    ${animatable ? `<button class="btn btn-play" id="btnPlay" onclick="togglePlay()">▶ 自动演示</button>` : ''}
    <button class="btn btn-reset" onclick="resetParams()">↺ 重置</button>
  </div>`;

  container.innerHTML = html;
}

function formatVal(v, step) {
  if (isNaN(v)) return '0';
  return step < 1 ? v.toFixed(2) : Math.round(v).toString();
}

function onParamChange(key, val) {
  params[key] = val;
  const p = currentModel.params.find(p => p.key === key);
  const step = p ? p.step : 1;
  const el = document.getElementById(`val-${key}`);
  if (el) el.textContent = formatVal(val, step);
}

function resetParams() {
  params = { ...paramDefaults };
  playing = false;
  frame = 0;
  animTarget = null;
  errorMsg = null;
  renderControls();
  const btn = document.getElementById('btnPlay');
  if (btn) btn.textContent = '▶ 自动演示';
}

function togglePlay() {
  playing = !playing;
  const btn = document.getElementById('btnPlay');
  if (btn) btn.textContent = playing ? '⏸ 停止' : '▶ 自动演示';

  if (playing && currentModel && currentModel.params.length > 0) {
    const p = currentModel.params[0];
    animTarget = p.key;
    animMin = p.min;
    animMax = p.max;
    animSpeed = (animMax - animMin) / 300;
    if (params[p.key] >= animMax - 0.01) params[p.key] = animMin;
  }
}

// ===== Info Panel =====
function updateInfo() {
  const nameEl = document.getElementById('infoName');
  const theoremEl = document.getElementById('infoTheorem');
  if (!currentModel) { nameEl.textContent = ''; theoremEl.textContent = ''; return; }

  nameEl.textContent = currentModel.name;
  const theorems = {
    'hand-in-hand': '两个等边三角形共顶点，旋转其中一个，旋转后对应顶点连线（拉手线）相等且夹角等于旋转角。关键：SAS全等。',
    'k-model': '在一条直线上，同侧有三个相等的角，则构成两个相似三角形。常用于构造全等或相似解题。',
    'double-median': '倍长中线法：延长中线一倍，构造平行四边形，利用对边平行且相等转化线段关系。',
    'bisector': '角平分线上的任意点到角两边的距离相等。这是角平分线最基本的性质定理。',
    'shortest-path': '将军饮马问题：利用轴对称将折线"拉直"，转化为两点之间线段最短。',
    'dart': '飞镖定理：凹四边形的凹角等于其他三个内角之和。∠A = ∠B + ∠C + ∠D。',
    'figure-8': '八字模型：对顶的两个三角形中，∠A+∠B = ∠C+∠D。也常用于倒角计算。',
    'half-angle': '正方形中从顶点出发作45°角，截两边所得线段满足 EF = BE + DF。核心是旋转构造全等。',
    'cut-supp': '截长补短是辅助线添加思路：在长线段上截取短线段，或延长短线段，构造等量关系证明。',
    'pythagorean': '勾股定理：直角三角形中 a² + b² = c²。图中三个正方形的面积直观展示这一定理。',
  };
  theoremEl.textContent = theorems[currentModel.id] || '';
}

// ===== Draw Loop =====
function loop(timestamp) {
  updateAnimation();
  draw();
  requestAnimationFrame(loop);
}

function updateAnimation() {
  if (!playing || !animTarget) return;
  params[animTarget] += animSpeed;
  if (params[animTarget] >= animMax) {
    params[animTarget] = animMax;
    animSpeed = -Math.abs(animSpeed);
  }
  if (params[animTarget] <= animMin) {
    params[animTarget] = animMin;
    animSpeed = Math.abs(animSpeed);
  }
  const slider = document.getElementById(`slider-${animTarget}`);
  const val = document.getElementById(`val-${animTarget}`);
  if (slider) slider.value = params[animTarget];
  const p = currentModel ? currentModel.params.find(p => p.key === animTarget) : null;
  const step = p ? p.step : 1;
  if (val) val.textContent = formatVal(params[animTarget], step);
  frame++;
}

function draw() {
  // Clear with visible white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // DEBUG: visible border to confirm canvas renders
  ctx.strokeStyle = '#4f46e5';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W-4, H-4);

  // Error state
  if (errorMsg) {
    ctx.fillStyle = '#dc2626';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(errorMsg, W/2, H/2);
    return;
  }

  // No model loaded
  if (!currentModel) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('加载中...', W/2, H/2);
    return;
  }

  // Draw subtle grid
  ctx.strokeStyle = '#f0f0f0';
  ctx.lineWidth = 0.5;
  for (let x = 30; x < W; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 30; y < H; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Draw model
  try {
    currentModel.draw(ctx, W, H, params, frame);
  } catch (e) {
    errorMsg = '绘制错误：' + e.message;
    console.error(e);
  }

  // DEBUG: visible purple border on top of everything
  ctx.strokeStyle = '#7c3aed';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, W-6, H-6);

  // DEBUG: model name
  ctx.fillStyle = '#7c3aed';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('模型: ' + currentModel.name, W-12, H-12);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  if (e.key === 'r' || e.key === 'R') resetParams();
});

// ===== Boot =====
init();
