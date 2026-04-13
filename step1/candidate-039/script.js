const SYMBOLS = {
    '🧠': { name: 'AGI', payout: 500, weight: 1 },
    '🤖': { name: 'AI Model', payout: 200, weight: 3 },
    '💸': { name: 'Venture Capital', payout: 100, weight: 5 },
    '🪄': { name: 'Prompt Engineering', payout: 50, weight: 10 },
    '📉': { name: 'GPU Shortage', payout: 20, weight: 15 },
    '🗑️': { name: 'Hallucination', payout: 5, weight: 20 }
};

const SPIN_COST = 10;
let balance = 1000;
let isSpinning = false;

// DOM Elements
const balanceEl = document.getElementById('balance');
const messageEl = document.getElementById('message');
const spinBtn = document.getElementById('spin-button');
const reels = [
    document.getElementById('reel1').querySelector('.reel-inner'),
    document.getElementById('reel2').querySelector('.reel-inner'),
    document.getElementById('reel3').querySelector('.reel-inner')
];

// Helper to create weighted symbol array
const symbolPool = [];
for (const [symbol, data] of Object.entries(SYMBOLS)) {
    for (let i = 0; i < data.weight; i++) {
        symbolPool.push(symbol);
    }
}

// Get a random symbol from the pool
function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbolPool.length);
    return symbolPool[randomIndex];
}

// Generate the initial view for the reels
function initializeReels() {
    reels.forEach(reelInner => {
        reelInner.innerHTML = '';
        // Add a random starting symbol
        const symEl = document.createElement('div');
        symEl.className = 'symbol';
        symEl.textContent = getRandomSymbol();
        reelInner.appendChild(symEl);
        reelInner.style.transform = `translateY(0px)`;
    });
    updateBalanceDisplay();
}

function updateBalanceDisplay() {
    balanceEl.textContent = balance;
}

function showMessage(text, isError = false, isWin = false) {
    messageEl.textContent = text;
    messageEl.style.color = isError ? 'var(--error)' : (isWin ? 'var(--gold)' : 'var(--success)');
    
    messageEl.classList.remove('error-shake', 'win-anim');
    void messageEl.offsetWidth; // Trigger reflow to restart animation
    
    if (isError) {
        messageEl.classList.add('error-shake');
    } else if (isWin) {
        messageEl.classList.add('win-anim');
    }
}

async function spin() {
    if (isSpinning) return;
    
    if (balance < SPIN_COST) {
        showMessage("Not enough Tokens! Need more VC funding.", true);
        return;
    }

    isSpinning = true;
    spinBtn.disabled = true;
    
    // Deduct cost
    balance -= SPIN_COST;
    updateBalanceDisplay();
    showMessage("Generating response...", false);

    // Determine results beforehand
    const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
    
    // Animate each reel
    const spinPromises = reels.map((reelInner, index) => animateReel(reelInner, results[index], index));
    
    await Promise.all(spinPromises);
    
    checkWin(results);
    
    isSpinning = false;
    spinBtn.disabled = false;
}

function animateReel(reelInner, finalSymbol, index) {
    return new Promise(resolve => {
        // Clear previous content and prep for animation
        reelInner.innerHTML = '';
        reelInner.style.transition = 'none';
        reelInner.style.transform = 'translateY(0)';
        
        const numSpins = 20 + (index * 10); // Each subsequent reel spins longer
        const symbolHeight = 120;
        
        // Populate the reel with random symbols for the blur effect
        for(let i=0; i < numSpins; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = getRandomSymbol();
            reelInner.appendChild(sym);
        }
        
        // Add final symbol at the top (which will end up at index 0 visually after transform)
        // Actually, flex column flows down. If we transform negative Y, we move the reel UP,
        // so the last element added appears at the bottom.
        // Let's prepend the final symbol and translate UP towards it? No, translating UP means
        // looking at elements further down the DOM list.
        // Let's put final symbol at the END of the list.
        const finalSymEl = document.createElement('div');
        finalSymEl.className = 'symbol';
        finalSymEl.textContent = finalSymbol;
        reelInner.appendChild(finalSymEl);
        
        // Start position is top of the list (0)
        // We want to translate up to the last element.
        // Total elements = numSpins + 1. We want to land on the last one.
        const targetY = -(numSpins * symbolHeight);
        
        // Trigger reflow
        void reelInner.offsetWidth;
        
        // Apply animation
        const duration = 1 + (index * 0.5); // Seconds
        reelInner.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
        reelInner.style.transform = `translateY(${targetY}px)`;
        
        // Clean up after animation
        setTimeout(() => {
            reelInner.style.transition = 'none';
            reelInner.innerHTML = '';
            reelInner.appendChild(finalSymEl);
            reelInner.style.transform = 'translateY(0)';
            resolve();
        }, duration * 1000);
    });
}

function checkWin(results) {
    if (results[0] === results[1] && results[1] === results[2]) {
        const winningSymbol = results[0];
        const payout = SYMBOLS[winningSymbol].payout;
        const name = SYMBOLS[winningSymbol].name;
        
        balance += payout;
        updateBalanceDisplay();
        showMessage(`JACKPOT! Hit 3x ${name}! +${payout} Tokens!`, false, true);
    } else {
        // Just for fun, add a message for 2 of a kind
        if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
             showMessage("Almost! Just a minor hallucination.", false, false);
        } else {
             showMessage("Model converged on garbage. Try again.", false, false);
        }
    }
}

// Event Listeners
spinBtn.addEventListener('click', spin);

// Init
initializeReels();