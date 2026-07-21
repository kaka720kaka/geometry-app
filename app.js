// ===== Main App Controller =====

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Canvas logical size
const W = 600, H = 400;
canvas.width = W;
canvas.height = H;

// State
let currentModel = models[0];
let params = {};       // current param values
let paramDefaults = {}; // defaults for reset
let playing = false;
let frame = 0;
let animTarget = null; // which param is animated
let animSpeed = 0;
let animMin = 0, animMax = 0;

// ===== Init =====
function init() {
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
  currentModel = models.find(m => m.id === id);
  if (!currentModel) return;

  // Update nav
  document.querySelectorAll('.model-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.model-btn[data-id="${id}"]`).classList.add('active');

  // Reset params to defaults
  params = {};
  paramDefaults = {};
  currentModel.params.forEach(p => {
    params[p.key] = p.default;
    paramDefaults[p.key] = p.default;
  });

  playing = false;
  frame = 0;
  animTarget = null;
  renderControls();
  updateInfo();
}

// ===== Controls =====
function renderControls() {
  const container = document.getElementById('controls');
  const model = currentModel;

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

  // Auto-animate if model supports it
  const animatable = model.params.length > 0;
  html += `<div class="btn-row">
    ${animatable ? `<button class="btn btn-play" id="btnPlay" onclick="togglePlay()">▶ 自动演示</button>` : ''}
    <button class="btn btn-reset" onclick="resetParams()">↺ 重置</button>
  </div>`;

  container.innerHTML = html;
}

function formatVal(v, step) {
  return step < 1 ? v.toFixed(2) : Math.round(v);
}

function onParamChange(key, val) {
  params[key] = val;
  const p = currentModel.params.find(p => p.key === key);
  const step = p ? p.step : 1;
  document.getElementById(`val-${key}`).textContent = formatVal(val, step);
}

function resetParams() {
  params = { ...paramDefaults };
  playing = false;
  frame = 0;
  animTarget = null;
  renderControls();
  document.getElementById('btnPlay') && (document.getElementById('btnPlay').textContent = '▶ 自动演示');
}

function togglePlay() {
  playing = !playing;
  const btn = document.getElementById('btnPlay');
  if (btn) btn.textContent = playing ? '⏸ 停止' : '▶ 自动演示';

  if (playing && currentModel.params.length > 0) {
    // Animate the first param
    const p = currentModel.params[0];
    animTarget = p.key;
    animMin = p.min;
    animMax = p.max;
    animSpeed = (animMax - animMin) / 300; // ~300 frames per cycle
    if (params[p.key] >= animMax - 0.01) params[p.key] = animMin;
  }
}

// ===== Info Panel =====
function updateInfo() {
  document.getElementById('infoName').textContent = currentModel.name;
  // The theorem text is embedded in the model draw function, show static info here
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
  document.getElementById('infoTheorem').textContent =
    theorems[currentModel.id] || '';
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
  // Update slider display
  const slider = document.getElementById(`slider-${animTarget}`);
  const val = document.getElementById(`val-${animTarget}`);
  if (slider) slider.value = params[animTarget];
  const p = currentModel.params.find(p => p.key === animTarget);
  const step = p ? p.step : 1;
  if (val) val.textContent = formatVal(params[animTarget], step);
  frame++;
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  currentModel.draw(ctx, W, H, params, frame);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  if (e.key === 'r' || e.key === 'R') resetParams();
});

// ===== Boot =====
init();
