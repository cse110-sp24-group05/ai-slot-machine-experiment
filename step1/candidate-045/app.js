'use strict';

// ─── Symbols ────────────────────────────────────────────────────────────────
const SYMBOLS = [
  { id: 'robot',   emoji: '🤖', label: 'Robot',      weight: 5  },
  { id: 'brain',   emoji: '🧠', label: 'Brain',      weight: 6  },
  { id: 'fire',    emoji: '🔥', label: 'Hot Take',   weight: 7  },
  { id: 'gpu',     emoji: '⚡', label: 'GPU',        weight: 6  },
  { id: 'chat',    emoji: '💬', label: 'Hallucination', weight: 8 },
  { id: 'money',   emoji: '💸', label: 'Burn Rate',  weight: 9  },
  { id: 'skull',   emoji: '💀', label: 'Token Death',weight: 10 },
  { id: 'crystal', emoji: '🔮', label: 'Prediction', weight: 4  },
];

// ─── Pay table ───────────────────────────────────────────────────────────────
// multiplier applied to bet; negative = lose extra
const PAY_TABLE = [
  { ids: ['robot',   'robot',   'robot'  ], mult: 50,  jackpot: true,
    title: 'SINGULARITY JACKPOT',
    msg:   'Three robots aligned. This is it. Skynet begins. Take your tokens and run.' },
  { ids: ['crystal', 'crystal', 'crystal'], mult: 30,  jackpot: true,
    title: 'ORACLE TRIPLE',
    msg:   'You predicted the unpredictable. Claude is deeply unsettled.' },
  { ids: ['brain',   'brain',   'brain'  ], mult: 20,
    title: 'TRIPLE BRAIN',
    msg:   'More intelligence than GPT-4 on a good day. Collect your cognitive surplus.' },
  { ids: ['gpu',     'gpu',     'gpu'    ], mult: 15,
    title: 'TRIPLE GPU',
    msg:   'Nvidia\'s stock just went up. Your tokens are warming the planet.' },
  { ids: ['fire',    'fire',    'fire'   ], mult: 12,
    title: 'TRIPLE HOT TAKE',
    msg:   '"AI will replace all jobs by Tuesday." — You, apparently.' },
  { ids: ['chat',    'chat',    'chat'   ], mult: 8,
    title: 'HALLUCINATION TRIPLE',
    msg:   'Three confident hallucinations in a row. You\'ve peaked.' },
  { ids: ['money',   'money',   'money'  ], mult: 5,
    title: 'BURN RATE x3',
    msg:   'You\'re spending so fast even OpenAI is impressed.' },
  { ids: ['skull',   'skull',   'skull'  ], mult: -2,
    title: 'TRIPLE TOKEN DEATH',
    msg:   'Context window exceeded. All your work is gone. Classic AI.' },
  // Two-of-a-kind
  { ids: ['robot',   'robot',   null     ], mult: 4 },
  { ids: ['crystal', 'crystal', null     ], mult: 3 },
  { ids: ['brain',   'brain',   null     ], mult: 2 },
  { ids: ['gpu',     'gpu',     null     ], mult: 2 },
  { ids: ['fire',    'fire',    null     ], mult: 1.5 },
  // Any-of patterns
  { ids: ['robot', 'brain', 'gpu'        ], mult: 3, anyOrder: true,
    title: 'AI TRIFECTA',
    msg:   'Robot, brain, and raw compute. You\'ve invented AGI. Please don\'t.' },
  { ids: ['skull', null, null            ], mult: -0.5, anyContains: 'skull' },
];

// ─── Idle messages ───────────────────────────────────────────────────────────
const IDLE_MSGS = [
  'Insert tokens to hallucinate your winnings',
  'Pull the lever. Lose responsibly.',
  'Warning: results may be confidently wrong',
  'Tokens are just numbers. Numbers are just vibes.',
  '"This slot machine is aligned." — PR team',
  'Your bet will be deprecated in a future update',
  'GPT-4 would have spun already',
];

// ─── Lose messages ───────────────────────────────────────────────────────────
const LOSE_MSGS = [
  'The model predicted your loss with 99.9% confidence.',
  'Insufficient training data. Try again.',
  'Your tokens have been donated to a data center in Iowa.',
  'Loss function optimised. Unfortunately for you.',
  'This result has been hallucinated responsibly.',
  'Fine-tuning in progress. Wallet emptied.',
  '"We take alignment seriously." — also us, after taking your tokens',
  'Tokens burned. CO₂ released. Humanity advanced zero percent.',
  'Another alignment tax collected.',
  'The model says: skill issue.',
];

// ─── State ───────────────────────────────────────────────────────────────────
const BET_STEPS = [5, 10, 20, 50];
let tokens      = 100;
let burned      = 0;
let betIndex    = 1;  // default 10
let spinning    = false;
let idleMsgIdx  = 0;

// ─── DOM refs ────────────────────────────────────────────────────────────────
const tokenCountEl = document.getElementById('tokenCount');
const burnCountEl  = document.getElementById('burnCount');
const betAmountEl  = document.getElementById('betAmount');
const spinBtn      = document.getElementById('spinBtn');
const resetBtn     = document.getElementById('resetBtn');
const betDownBtn   = document.getElementById('betDown');
const betUpBtn     = document.getElementById('betUp');
const msgText      = document.getElementById('messageText');
const contextBar   = document.getElementById('contextBar');
const winOverlay   = document.getElementById('winOverlay');
const winEmoji     = document.getElementById('winEmoji');
const winTitle     = document.getElementById('winTitle');
const winMsg       = document.getElementById('winMsg');
const winClose     = document.getElementById('winClose');
const payGrid      = document.getElementById('payGrid');
const reelCols     = [0,1,2].map(i => document.getElementById(`reel${i}`));
const reelStrips   = [0,1,2].map(i => document.getElementById(`strip${i}`));

// ─── Weighted random ─────────────────────────────────────────────────────────
function weightedRandom() {
  const total = SYMBOLS.reduce((s, sym) => s + sym.weight, 0);
  let r = Math.random() * total;
  for (const sym of SYMBOLS) {
    r -= sym.weight;
    if (r <= 0) return sym;
  }
  return SYMBOLS[SYMBOLS.length - 1];
}

// ─── Build reel strips ───────────────────────────────────────────────────────
const VISIBLE_ROWS = 3; // cells visible in the window
const REEL_LEN     = 20; // cells per strip

function buildStrip(stripEl) {
  stripEl.innerHTML = '';
  for (let i = 0; i < REEL_LEN; i++) {
    const cell = document.createElement('div');
    cell.className = 'reel-cell';
    cell.textContent = SYMBOLS[i % SYMBOLS.length].emoji;
    stripEl.appendChild(cell);
  }
}
reelStrips.forEach(buildStrip);

// ─── Spin animation ──────────────────────────────────────────────────────────
function spinReel(stripEl, targetSymbol, delay) {
  return new Promise(resolve => {
    const col = stripEl.parentElement;
    col.classList.add('spinning');
    col.classList.remove('winner');

    // randomise strip content, place target near middle row
    const cells = stripEl.querySelectorAll('.reel-cell');
    cells.forEach((c, i) => {
      c.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji;
    });

    // After delay, stop and snap target into the centre cell (index 1 of 3 visible)
    setTimeout(() => {
      col.classList.remove('spinning');
      stripEl.style.transform = '';

      // Rewrite cells so the payline row (index 1) shows target
      cells.forEach((c, i) => {
        if (i === 1) c.textContent = targetSymbol.emoji;
        else c.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji;
      });

      resolve();
    }, delay);
  });
}

// ─── Evaluate result ─────────────────────────────────────────────────────────
function evaluate(results) {
  const ids = results.map(s => s.id);

  for (const rule of PAY_TABLE) {
    // Exact 3-of-a-kind
    if (!rule.anyOrder && !rule.anyContains) {
      const ruleIds = rule.ids.filter(Boolean);
      if (ruleIds.length === 3) {
        if (ids[0] === ruleIds[0] && ids[1] === ruleIds[1] && ids[2] === ruleIds[2]) {
          return rule;
        }
      } else if (ruleIds.length === 2) {
        // two of a kind — first two or any two?
        const count = ids.filter(id => id === ruleIds[0]).length;
        if (count >= 2) return rule;
      }
    }
    if (rule.anyOrder) {
      const ruleSet  = [...rule.ids].sort().join(',');
      const resultSet = [...ids].sort().join(',');
      if (ruleSet === resultSet) return rule;
    }
    if (rule.anyContains) {
      if (ids.includes(rule.anyContains)) return rule;
    }
  }
  return null;
}

// ─── Update UI ───────────────────────────────────────────────────────────────
function updateTokenDisplay() {
  tokenCountEl.textContent = tokens;
  burnCountEl.textContent  = burned;
  // context bar theatre
  const ratio = Math.max(0, Math.min(1, tokens / 200));
  const bars  = Math.round(ratio * 10);
  contextBar.textContent = '█'.repeat(bars) + '░'.repeat(10 - bars);
  contextBar.style.color = ratio > .5 ? 'var(--green)' : ratio > .2 ? 'var(--yellow)' : 'var(--red)';
}

function setMessage(text) {
  msgText.textContent = text;
}

function flashWinners(resultIndices) {
  resultIndices.forEach(i => {
    reelCols[i].classList.add('winner');
    setTimeout(() => reelCols[i].classList.remove('winner'), 1200);
  });
}

// ─── Show win modal ───────────────────────────────────────────────────────────
function showWinModal(rule, payout) {
  winEmoji.textContent = rule.jackpot ? '🎰🎉🎰' : '🎊';
  winTitle.textContent = rule.title   || `${payout > 0 ? '+' : ''}${payout} TOKENS`;
  winMsg.textContent   = rule.msg     || `You won ${payout} tokens. Spend them wisely (you won't).`;
  winOverlay.hidden    = false;
}

winClose.addEventListener('click', () => { winOverlay.hidden = true; });

// ─── Main spin ───────────────────────────────────────────────────────────────
async function spin() {
  if (spinning) return;
  const bet = BET_STEPS[betIndex];
  if (tokens < bet) {
    setMessage('Insufficient tokens. Even AI has limits. (Top up!)');
    return;
  }

  spinning = true;
  spinBtn.disabled = true;

  // Deduct bet immediately (burn, baby, burn)
  tokens -= bet;
  burned += bet;
  updateTokenDisplay();
  setMessage('Calculating your fate with stochastic vibes…');

  // Pick outcomes
  const results = [weightedRandom(), weightedRandom(), weightedRandom()];

  // Stagger stop times: 700, 1100, 1500 ms
  const delays = [700, 1100, 1500];
  await Promise.all(reelStrips.map((strip, i) => spinReel(strip, results[i], delays[i])));

  // Short pause so player can see the result
  await new Promise(r => setTimeout(r, 300));

  // Evaluate
  const rule = evaluate(results);
  let payout = 0;

  if (rule) {
    payout = Math.round(bet * rule.mult);
    tokens += payout;
    burned = Math.max(0, burned - payout);  // net burn adjusts
    if (payout > 0) {
      flashWinners([0,1,2]);
      setMessage(`${rule.title ? rule.title + ' — ' : ''}+${payout} tokens! ${rule.msg || ''}`);
      if (rule.title) showWinModal(rule, payout);
      else setMessage(`Nice! +${payout} tokens. The house weeps.`);
    } else {
      const loss = Math.abs(payout);
      tokens = Math.max(0, tokens - loss);
      burned += loss;
      setMessage(rule.msg || `Ouch. ${rule.title || 'Penalty'}: −${loss} tokens.`);
    }
  } else {
    setMessage(LOSE_MSGS[Math.floor(Math.random() * LOSE_MSGS.length)]);
  }

  updateTokenDisplay();

  if (tokens <= 0) {
    setTimeout(() => setMessage('💀 Out of tokens. The context window is empty. Please inject more funding.'), 600);
  }

  spinning = false;
  spinBtn.disabled = false;
}

// ─── Bet controls ────────────────────────────────────────────────────────────
betDownBtn.addEventListener('click', () => {
  betIndex = Math.max(0, betIndex - 1);
  betAmountEl.textContent = BET_STEPS[betIndex];
});
betUpBtn.addEventListener('click', () => {
  betIndex = Math.min(BET_STEPS.length - 1, betIndex + 1);
  betAmountEl.textContent = BET_STEPS[betIndex];
});

// ─── Spin button ─────────────────────────────────────────────────────────────
spinBtn.addEventListener('click', spin);

// ─── Keyboard: spacebar spins ─────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !spinning) { e.preventDefault(); spin(); }
});

// ─── Reset ───────────────────────────────────────────────────────────────────
resetBtn.addEventListener('click', () => {
  tokens = 100;
  burned = 0;
  updateTokenDisplay();
  setMessage('"Additional funding secured." — Your VC');
});

// ─── Build pay table UI ───────────────────────────────────────────────────────
function buildPayTable() {
  const rows = [
    { syms: '🤖🤖🤖', label: 'Singularity', mult: '×50', jackpot: true },
    { syms: '🔮🔮🔮', label: 'Oracle',       mult: '×30', jackpot: true },
    { syms: '🧠🧠🧠', label: 'Triple Brain', mult: '×20' },
    { syms: '⚡⚡⚡', label: 'Triple GPU',   mult: '×15' },
    { syms: '🔥🔥🔥', label: 'Hot Takes',    mult: '×12' },
    { syms: '💬💬💬', label: 'Hallucination',mult: '×8'  },
    { syms: '💸💸💸', label: 'Burn x3',      mult: '×5'  },
    { syms: '💀💀💀', label: 'Token Death',  mult: '−2×' },
    { syms: '🤖🧠⚡', label: 'AI Trifecta',  mult: '×3'  },
    { syms: '🤖🤖 ?', label: '2× Robot',     mult: '×4'  },
    { syms: '💀 ? ?', label: 'Any Skull',     mult: '−½×' },
  ];
  payGrid.innerHTML = rows.map(r => `
    <div class="pay-row${r.jackpot ? ' jackpot' : ''}">
      <span class="pay-symbols">${r.syms}</span>
      <span>${r.label}</span>
      <span class="pay-mult">${r.mult}</span>
    </div>
  `).join('');
}
buildPayTable();

// ─── Idle message rotation ────────────────────────────────────────────────────
setInterval(() => {
  if (!spinning) {
    idleMsgIdx = (idleMsgIdx + 1) % IDLE_MSGS.length;
    if (msgText.textContent === IDLE_MSGS[(idleMsgIdx - 1 + IDLE_MSGS.length) % IDLE_MSGS.length]) {
      setMessage(IDLE_MSGS[idleMsgIdx]);
    }
  }
}, 4000);

// ─── Init ────────────────────────────────────────────────────────────────────
betAmountEl.textContent = BET_STEPS[betIndex];
updateTokenDisplay();
setMessage(IDLE_MSGS[0]);
