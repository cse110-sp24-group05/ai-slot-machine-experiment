const SYMBOLS = ['🧠', '💾', '📜', '🔑', '🐛'];
const SYMBOL_HEIGHT = 120; // Matches CSS .symbol height
const REEL_SPIN_DURATION = 2000; // Base spin time in ms
const REEL_DELAY = 300; // Delay between each reel stopping

// Multipliers
const PAYOUTS = {
    '🧠': 50,
    '💾': 20,
    '📜': 10,
    '🔑': 5,
    '🐛': 0
};

let balance = 1000;
let bet = 10;
let isSpinning = false;

const balanceDisplay = document.getElementById('token-balance');
const betDisplay = document.getElementById('bet-amount');
const messageDisplay = document.getElementById('message');
const spinButton = document.getElementById('spin-button');
const betIncreaseBtn = document.getElementById('bet-increase');
const betDecreaseBtn = document.getElementById('bet-decrease');

const reels = [
    document.getElementById('reel-1').querySelector('.reel-inner'),
    document.getElementById('reel-2').querySelector('.reel-inner'),
    document.getElementById('reel-3').querySelector('.reel-inner')
];

// Initialize reels with some symbols
function initReels() {
    reels.forEach(reelInner => {
        reelInner.innerHTML = '';
        // Add 3 random symbols to start
        for (let i = 0; i < 3; i++) {
            const sym = document.createElement('div');
            sym.className = 'symbol';
            sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reelInner.appendChild(sym);
        }
        // Initial position is showing the middle symbol (index 1)
        reelInner.style.transform = `translateY(-${SYMBOL_HEIGHT}px)`;
    });
    updateUI();
}

function updateUI() {
    balanceDisplay.textContent = balance;
    betDisplay.textContent = bet;
    
    betDecreaseBtn.disabled = isSpinning || bet <= 10;
    betIncreaseBtn.disabled = isSpinning || bet + 10 > balance;
    spinButton.disabled = isSpinning || balance < bet;
}

function showMessage(msg, type = '') {
    messageDisplay.textContent = msg;
    messageDisplay.className = 'message ' + type;
}

betDecreaseBtn.addEventListener('click', () => {
    if (bet > 10) {
        bet -= 10;
        updateUI();
    }
});

betIncreaseBtn.addEventListener('click', () => {
    if (bet + 10 <= balance) {
        bet += 10;
        updateUI();
    }
});

spinButton.addEventListener('click', spin);

async function spin() {
    if (isSpinning || balance < bet) return;
    
    isSpinning = true;
    balance -= bet;
    updateUI();
    showMessage('Generating response...', 'accent');

    // Generate final results
    const results = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
    ];

    const spinPromises = reels.map((reelInner, index) => {
        return new Promise(resolve => {
            const spins = 20 + (index * 10); 
            
            // Get the currently displayed symbol (it's at the visual center)
            // Due to the way we reset it, it will be the one that ended up at index spins+1 in the previous spin
            // Or index 1 on init. Let's just grab the one visually in frame by calculation.
            // A simpler way: we know what result was generated last time. But init state is random.
            // Let's just find the child that is currently "active" based on transform.
            const currentTransform = reelInner.style.transform;
            const match = currentTransform.match(/translateY\(-(\d+)px\)/);
            let currentY = match ? parseInt(match[1]) : 0;
            let currentIndex = Math.round(currentY / SYMBOL_HEIGHT);
            
            // If the reel has children, get the textContent of the currently visible one
            let currentVisibleSymbol = SYMBOLS[0];
            if (reelInner.children.length > currentIndex) {
                currentVisibleSymbol = reelInner.children[currentIndex].textContent;
            }

            reelInner.innerHTML = '';
            
            // Put the currently visible symbol at index 0
            const oldCenter = document.createElement('div');
            oldCenter.className = 'symbol';
            oldCenter.textContent = currentVisibleSymbol;
            reelInner.appendChild(oldCenter);
            
            for (let i = 0; i < spins; i++) {
                const sym = document.createElement('div');
                sym.className = 'symbol';
                sym.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                reelInner.appendChild(sym);
            }
            
            const targetFinal = document.createElement('div');
            targetFinal.className = 'symbol';
            targetFinal.textContent = results[index];
            reelInner.appendChild(targetFinal);
            
            const bottomPad = document.createElement('div');
            bottomPad.className = 'symbol';
            bottomPad.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            reelInner.appendChild(bottomPad);
            
            // Reset position to index 0 instantly
            reelInner.style.transition = 'none';
            reelInner.style.transform = `translateY(0px)`;
            
            // Force reflow
            reelInner.offsetHeight; 
            
            // Calculate final translation
            const targetY = (spins + 1) * SYMBOL_HEIGHT;
            
            const duration = REEL_SPIN_DURATION + (index * REEL_DELAY);
            // Cubic bezier for a slight wind-up and a bounce at the end
            reelInner.style.transition = `transform ${duration}ms cubic-bezier(0.25, -0.1, 0.25, 1.1)`;
            reelInner.style.transform = `translateY(-${targetY}px)`;
            
            setTimeout(() => {
                resolve();
            }, duration);
        });
    });

    await Promise.all(spinPromises);
    
    checkWin(results);
    isSpinning = false;
    updateUI();
}

function checkWin(results) {
    const [r1, r2, r3] = results;
    
    // Check for bugs
    if (r1 === '🐛' || r2 === '🐛' || r3 === '🐛') {
        showMessage('Hallucination detected! Tokens lost.', 'loss');
        return;
    }

    let winAmount = 0;
    
    if (r1 === r2 && r2 === r3) {
        // 3 of a kind
        winAmount = bet * PAYOUTS[r1];
        showMessage(`Jackpot! Generated 3x ${r1}. Won ${winAmount} tokens!`, 'win');
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        // 2 of a kind
        winAmount = bet * 2;
        showMessage(`Partial match! Won ${winAmount} tokens.`, 'win');
    } else {
        showMessage('Context window exhausted. No matches.', '');
    }

    if (winAmount > 0) {
        balance += winAmount;
    }
}

// Start
initReels();