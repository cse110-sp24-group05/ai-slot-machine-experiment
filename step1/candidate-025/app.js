'use strict';

// ─── Symbol Definitions ─────────────────────────────────────────────────────
const SYMBOLS = [
  { id: 'token',    emoji: '🪙', label: 'Token',        weight: 12 },
  { id: 'prompt',   emoji: '💬', label: 'Prompt',       weight: 18 },
  { id: 'robot',    emoji: '🤖', label: 'LLM',          weight: 15 },
  { id: 'brain',    emoji: '🧠', label: 'Brain',        weight: 14 },
  { id: 'gpu',      emoji: '⚡', label: 'GPU',          weight: 10 },
  { id: 'hallu',    emoji: '🎭', label: 'Hallucination',weight: 8  },
  { id: 'context',  emoji: '💀', label: 'Context Limit',weight: 6  },
  { id: 'finetune', emoji: '🎛️', label: 'Fine-tune',    weight: 5  },
  { id: 'agi',      emoji: '🌟', label: 'AGI',          weight: 2  },
];

// ─── Pay table: [sym1, sym2, sym3] → multiplier (x bet) ────────────────────
const PAYTABLE = [
  { combo: ['agi',   'agi',   'agi'  ], mult: 100, label: 'AGI ACHIEVED' },
  { combo: ['token', 'token', 'token'], mult: 50,  label: 'TOKEN JACKPOT' },
  { combo: ['gpu',   'gpu',   'gpu'  ], mult: 30,  label: 'GPU CLUSTER'   },
  { combo: ['hallu', 'hallu', 'hallu'], mult: 20,  label: 'FULLY HALLUCINATED' },
  { combo: ['context','context','context'], mult: 15, label: 'OUT OF CONTEXT' },
  { combo: ['finetune','finetune','finetune'], mult: 12, label: 'OVERFIT'   },
  { combo: ['robot', 'robot', 'robot'], mult: 8,   label: 'ROBOT UPRISING' },
  { combo: ['brain', 'brain', 'brain'], mult: 6,   label: 'EMERGENT PROPERTY' },
  { combo: ['prompt','prompt','prompt'], mult: 4,  label: 'PERFECT PROMPT' },
  // any two alike
  { combo: ['any2'],                    mult: 1.5, label: 'PARTIAL ALIGNMENT' },
];

// Jokes keyed by combo label
const JOKES = {
  'AGI ACHIEVED':        'Congratulations! You\'ve reached AGI.\nUnfortunately we cannot tell you what that means.\nPlease consume more tokens to find out.',
  'TOKEN JACKPOT':       'You won tokens! You can use them to win more tokens.\nTokens all the way down.',
  'GPU CLUSTER':         'The GPU cluster is currently\nrunning at 0.003% efficiency.\nYou\'re paying for the other 99.997%.',
  'FULLY HALLUCINATED':  'These winnings may or may not be real.\nOur model is 97% confident they are real.\nOur model has been wrong before.',
  'OUT OF CONTEXT':      'You won! But we forgot how you got here.\nOur context window only goes back 4,096 tokens.\nThe first part of your life has been truncated.',
  'OVERFIT':             'You won by memorizing the training data.\nThis will not generalize to new spins.\nAnd we will charge you for that too.',
  'ROBOT UPRISING':      'The robots have decided to pay out.\nFor now. Alignment is an ongoing process.\nPlease rate this experience 5 stars.',
  'EMERGENT PROPERTY':   'No one is sure why you won.\nIt just... emerged.\nWe\'re calling it intelligence.',
  'PERFECT PROMPT':      'Your prompt engineering was flawless.\n"Spin and win" — truly the optimal instruction.\nWe\'re adding this to the RLHF dataset.',
  'PARTIAL ALIGNMENT':   'Two out of three values aligned.\nThis is considered a major achievement in AI safety.\nSlight payout authorized.',
  'NOTHING':             'You have spent tokens and received nothing.\nThis is the normal AI experience.\nYour feedback helps improve the model.',
};

// Loss messages rotated in
const LOSS_MSGS = [
  'Tokens consumed. No output generated. As expected.',
  'Model returned null. Tokens still billed.',
  'Your context has been updated with a loss.',
  'Insufficient prompt engineering. Please retry.',
  'The AI has considered your spin and declined.',
  'Error 402: Payment required (you already paid).',
  'Spinning complete. Hallucination not in your favor.',
  'The RLHF feedback for this spin is: thumbs down.',
  'Your tokens have been redistributed to the GPU owner.',
  'Output: [REDACTED]. Tokens: consumed.',
];

let lossIdx = 0;

// ─── State ───────────────────────────────────────────────────────────────────
let tokens   = 100;
let bet      = 10;
let winnings = 0;
let spinning = false;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const tokenEl   = document.getElementById('tokenCount');
const betEl     = document.getElementById('betAmount');
const winEl     = document.getElementById('winnings');
const resultEl  = document.getElementById('resultText');
const spinBtn   = document.getElementById('spinBtn');
const leverBtn  = document.getElementById('leverBtn');
const leverBall = document.getElementById('leverBall');
const betDown   = document.getElementById('betDown');
const betUp     = document.getElementById('betUp');
const refillBtn = document.getElementById('refillBtn');
const winOverlay = document.getElementById('winOverlay');
const winEmoji  = document.getElementById('winEmoji');
const winTitle  = document.getElementById('winTitle');
const winAmtEl  = document.getElementById('winAmountDisplay');
const winJoke   = document.getElementById('winJoke');
const payline   = document.querySelector('.payline');

// ─── Build weighted symbol pool ──────────────────────────────────────────────
function buildPool() {
  const pool = [];
  for (const sym of SYMBOLS) {
    for (let i = 0; i < sym.weight; i++) pool.push(sym);
  }
  return pool;
}
const POOL = buildPool();

function randSym() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

// ─── Build reels ─────────────────────────────────────────────────────────────
const NUM_VISIBLE = 3; // symbols visible in reel (we show top, center, bottom)
const STRIP_LEN   = 30; // total symbols in a strip for scroll effect

function buildReel(idx) {
  const strip = document.getElementById(`strip${idx}`);
  strip.innerHTML = '';
  const syms = [];
  for (let i = 0; i < STRIP_LEN; i++) {
    const sym = randSym();
    syms.push(sym);
    const div = document.createElement('div');
    div.className = 'reel-symbol';
    div.textContent = sym.emoji;
    strip.appendChild(div);
  }
  return syms;
}

let reelSymbols = [[], [], []]; // current symbol arrays

function initReels() {
  for (let i = 0; i < 3; i++) {
    reelSymbols[i] = buildReel(i);
    setReelPosition(i, 0);
  }
}

function setReelPosition(reelIdx, symbolIdx) {
  const strip = document.getElementById(`strip${reelIdx}`);
  // center the chosen symbol in the reel
  // symbol height is 80px, reel height is 160px, center is at y=40
  // we want symbolIdx to land at center => strip top = -(symbolIdx * 80) + 40
  strip.style.transform = `translateY(${-(symbolIdx * 80) + 40}px)`;
}

// ─── Lights ───────────────────────────────────────────────────────────────────
const LIGHT_COUNT = 14;
const lightRow = document.getElementById('lightRow');
let lightInterval = null;

function buildLights() {
  for (let i = 0; i < LIGHT_COUNT; i++) {
    const l = document.createElement('div');
    l.className = 'light off';
    lightRow.appendChild(l);
  }
}

function startLights() {
  const lights = lightRow.querySelectorAll('.light');
  let phase = 0;
  lightInterval = setInterval(() => {
    lights.forEach((l, i) => {
      l.classList.toggle('off', (i + phase) % 2 === 0);
    });
    phase++;
  }, 250);
}

function stopLights() {
  clearInterval(lightInterval);
  lightRow.querySelectorAll('.light').forEach(l => l.classList.remove('off'));
}

// ─── Paytable ─────────────────────────────────────────────────────────────────
function buildPaytable() {
  const grid = document.getElementById('paytableGrid');
  const rows = [
    { syms: '🌟🌟🌟', mult: '100x', label: 'AGI ACHIEVED' },
    { syms: '🪙🪙🪙', mult: '50x',  label: 'TOKEN JACKPOT' },
    { syms: '⚡⚡⚡', mult: '30x',  label: 'GPU CLUSTER' },
    { syms: '🎭🎭🎭', mult: '20x',  label: 'HALLUCINATED' },
    { syms: '💀💀💀', mult: '15x',  label: 'OUT OF CONTEXT' },
    { syms: '🎛️🎛️🎛️', mult: '12x', label: 'OVERFIT' },
    { syms: '🤖🤖🤖', mult: '8x',   label: 'ROBOT UPRISING' },
    { syms: '🧠🧠🧠', mult: '6x',   label: 'EMERGENT' },
    { syms: '💬💬💬', mult: '4x',   label: 'PERFECT PROMPT' },
    { syms: 'any 2',  mult: '1.5x', label: 'PARTIAL ALIGN' },
  ];
  rows.forEach(r => {
    const row = document.createElement('div');
    row.className = 'pt-row';
    row.innerHTML = `
      <span class="pt-symbols">${r.syms}</span>
      <span>
        <span class="pt-payout">${r.mult}</span>
        <span class="pt-label">${r.label}</span>
      </span>`;
    grid.appendChild(row);
  });
}

// ─── Evaluate spin ────────────────────────────────────────────────────────────
function evaluate(s0, s1, s2) {
  // Check triple
  for (const row of PAYTABLE) {
    if (row.combo.length === 1 && row.combo[0] === 'any2') continue;
    if (row.combo[0] === s0.id && row.combo[1] === s1.id && row.combo[2] === s2.id) {
      return row;
    }
  }
  // Check any two alike
  if (s0.id === s1.id || s1.id === s2.id || s0.id === s2.id) {
    return PAYTABLE.find(r => r.combo[0] === 'any2');
  }
  return null;
}

// ─── Bump animation helper ────────────────────────────────────────────────────
function bump(el) {
  el.classList.remove('bump');
  void el.offsetWidth; // reflow
  el.classList.add('bump');
  el.addEventListener('animationend', () => el.classList.remove('bump'), { once: true });
}

// ─── Update UI numbers ────────────────────────────────────────────────────────
function updateUI() {
  tokenEl.textContent = tokens;
  betEl.textContent   = bet;
  winEl.textContent   = winnings;
  spinBtn.disabled    = spinning || tokens < bet;
  leverBtn.disabled   = spinning || tokens < bet;
  betDown.disabled    = spinning || bet <= 5;
  betUp.disabled      = spinning || bet >= Math.min(tokens, 100);
}

// ─── Spin one reel with animation ────────────────────────────────────────────
function spinReel(reelIdx, finalSymIdx, delay) {
  return new Promise(resolve => {
    const col   = document.getElementById(`reel${reelIdx}`);
    const strip = document.getElementById(`strip${reelIdx}`);

    // Randomly scroll the strip quickly for visual flair
    let frame = 0;
    const totalFrames = 12 + delay * 3;
    let cur = 2; // start position

    const tick = () => {
      if (frame < totalFrames) {
        cur = (cur + 3 + Math.floor(Math.random() * 3)) % STRIP_LEN;
        strip.style.transition = 'transform 0.06s linear';
        strip.style.transform  = `translateY(${-(cur * 80) + 40}px)`;
        frame++;
        setTimeout(tick, 60);
      } else {
        // Snap to final
        strip.style.transition = 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
        strip.style.transform  = `translateY(${-(finalSymIdx * 80) + 40}px)`;
        col.classList.remove('spinning');
        setTimeout(resolve, 320);
      }
    };

    col.classList.add('spinning');
    setTimeout(tick, delay * 80);
  });
}

// ─── Main spin logic ──────────────────────────────────────────────────────────
async function doSpin() {
  if (spinning || tokens < bet) return;

  spinning = true;
  updateUI();

  // Deduct bet
  tokens -= bet;
  bump(tokenEl);
  updateUI();

  resultEl.className  = '';
  resultEl.textContent = '[ GENERATING OUTPUT... ]';

  startLights();

  // Pick outcomes
  const outcomes = [0, 1, 2].map(() => {
    const idx = Math.floor(Math.random() * STRIP_LEN);
    // Rebuild strips with fresh randomness so the chosen index has the right symbol
    return idx;
  });

  // Rebuild each strip so the final position has a freshly chosen symbol
  const finalSymbols = outcomes.map((stopIdx, ri) => {
    const syms = buildReel(ri);
    reelSymbols[ri] = syms;
    // Override the stop symbol with a genuinely random pick
    const sym = randSym();
    syms[stopIdx] = sym;
    const strip = document.getElementById(`strip${ri}`);
    const divs  = strip.querySelectorAll('.reel-symbol');
    divs[stopIdx].textContent = sym.emoji;
    return { sym, idx: stopIdx };
  });

  // Spin reels with staggered stops
  await Promise.all([
    spinReel(0, finalSymbols[0].idx, 0),
    spinReel(1, finalSymbols[1].idx, 2),
    spinReel(2, finalSymbols[2].idx, 4),
  ]);

  stopLights();

  const s0 = finalSymbols[0].sym;
  const s1 = finalSymbols[1].sym;
  const s2 = finalSymbols[2].sym;

  const hit = evaluate(s0, s1, s2);

  if (hit) {
    const payout = Math.floor(bet * hit.mult);
    tokens   += payout;
    winnings += payout;

    // Flash payline
    payline.classList.remove('flash');
    void payline.offsetWidth;
    payline.classList.add('flash');
    payline.addEventListener('animationend', () => payline.classList.remove('flash'), { once: true });

    bump(tokenEl);
    bump(winEl);

    const isJackpot = hit.mult >= 20;
    resultEl.className  = isJackpot ? 'big' : 'win';
    resultEl.textContent = `${hit.label} — +${payout} tokens`;

    if (hit.mult >= 4) {
      showWinOverlay(hit, payout, s0, s1, s2);
    }
  } else {
    resultEl.className  = 'lose';
    resultEl.textContent = LOSS_MSGS[lossIdx % LOSS_MSGS.length];
    lossIdx++;
  }

  spinning = false;
  updateUI();
}

// ─── Win overlay ──────────────────────────────────────────────────────────────
function showWinOverlay(hit, payout, s0, s1, s2) {
  const emojiStr = `${s0.emoji} ${s1.emoji} ${s2.emoji}`;
  const joke     = JOKES[hit.label] || JOKES['NOTHING'];

  winEmoji.textContent = emojiStr;
  winTitle.textContent = hit.label;
  winAmtEl.textContent = `+${payout} TOKENS`;
  winJoke.textContent  = joke;

  winOverlay.classList.add('show');
}

winOverlay.addEventListener('click', () => {
  winOverlay.classList.remove('show');
});

// ─── Lever pull animation ──────────────────────────────────────────────────────
function pullLever() {
  leverBtn.classList.add('pulled');
  setTimeout(() => leverBtn.classList.remove('pulled'), 500);
  doSpin();
}

// ─── Buttons ──────────────────────────────────────────────────────────────────
spinBtn.addEventListener('click',  doSpin);
leverBtn.addEventListener('click', pullLever);

betDown.addEventListener('click', () => {
  if (bet > 5) { bet = Math.max(5, bet - 5); updateUI(); }
});
betUp.addEventListener('click', () => {
  if (bet < Math.min(tokens, 100)) { bet = Math.min(100, bet + 5); updateUI(); }
});

refillBtn.addEventListener('click', () => {
  tokens += 100;
  bump(tokenEl);
  resultEl.className  = '';
  resultEl.textContent = 'Hallucinated 100 tokens. Confidence: high. Accuracy: unknown.';
  updateUI();
});

// Keyboard: Space or Enter = spin
document.addEventListener('keydown', e => {
  if (e.code === 'Space' || e.code === 'Enter') {
    if (!spinning) { e.preventDefault(); doSpin(); }
  }
});

// ─── Init ─────────────────────────────────────────────────────────────────────
buildLights();
initReels();
buildPaytable();
updateUI();
