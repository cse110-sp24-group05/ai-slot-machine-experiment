const symbols = ['🤖', '🧠', '💸', '🗑️', '📉', '⚠️'];

const SPIN_COST = 256;
const STARTING_TOKENS = 4096;

let tokens = STARTING_TOKENS;
let isSpinning = false;

const tokenCountEl = document.getElementById('token-count');
const statusMessageEl = document.getElementById('status-message');
const spinButton = document.getElementById('spin-button');
const reels = [
    document.querySelector('#reel-1 .symbol'),
    document.querySelector('#reel-2 .symbol'),
    document.querySelector('#reel-3 .symbol')
];

function updateTokenDisplay() {
    tokenCountEl.textContent = tokens;
    if (tokens < SPIN_COST) {
        tokenCountEl.style.color = 'var(--danger-color)';
    } else {
        tokenCountEl.style.color = 'var(--accent-color)';
    }
}

function setStatus(message, type = 'info') {
    statusMessageEl.textContent = message;
    if (type === 'error' || type === 'penalty') {
        statusMessageEl.style.color = 'var(--danger-color)';
    } else if (type === 'success' || type === 'jackpot') {
        statusMessageEl.style.color = 'var(--success-color)';
    } else {
        statusMessageEl.style.color = 'var(--text-color)';
    }
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function calculatePayout(results) {
    const [s1, s2, s3] = results;

    if (s1 === s2 && s2 === s3) {
        // 3 of a kind
        if (s1 === '🤖') {
            tokens += 4096;
            setStatus('AGI Achieved! +4096 Tokens', 'jackpot');
        } else if (s1 === '🧠') {
            tokens += 1024;
            setStatus('Deep Learning Success! +1024 Tokens', 'success');
        } else if (s1 === '💸') {
            tokens -= 512;
            setStatus('Unexpected API Billing! -512 Tokens', 'penalty');
        } else if (s1 === '⚠️') {
            tokens -= 256;
            setStatus('Severe Hallucination! -256 Tokens', 'penalty');
        } else if (s1 === '🗑️') {
            tokens += 0;
            setStatus('Garbage In, Garbage Out. +0 Tokens', 'error');
        } else if (s1 === '📉') {
            tokens += 0;
            setStatus('Compute limits reached. +0 Tokens', 'error');
        } else {
            tokens += 256; // Fallback
            setStatus('Perfect Match! +256 Tokens', 'success');
        }
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        // 2 of a kind
        tokens += 128;
        setStatus('Partial match found in training data. +128 Tokens', 'info');
    } else {
        // No match
        setStatus('Model returned empty string. Tokens consumed.', 'error');
    }

    // Ensure tokens don't go below 0 visually if penalized below 0
    if (tokens < 0) tokens = 0;
    
    updateTokenDisplay();
}

function spin() {
    if (isSpinning) return;
    
    if (tokens < SPIN_COST) {
        setStatus('Context Window Exceeded! (Out of tokens)', 'error');
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    
    // Deduct cost
    tokens -= SPIN_COST;
    updateTokenDisplay();
    setStatus('Generating response...', 'info');

    // Add spinning animation class
    reels.forEach(reel => reel.parentElement.classList.add('spinning'));

    // We will simulate the spin by rapidly changing the text content of the reels,
    // then stopping them one by one.
    
    let spinInterval = setInterval(() => {
        reels.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });
    }, 50);

    const results = [];

    // Stop reels one by one
    setTimeout(() => {
        results[0] = getRandomSymbol();
        reels[0].textContent = results[0];
        reels[0].parentElement.classList.remove('spinning');
    }, 1000);

    setTimeout(() => {
        results[1] = getRandomSymbol();
        reels[1].textContent = results[1];
        reels[1].parentElement.classList.remove('spinning');
    }, 1500);

    setTimeout(() => {
        clearInterval(spinInterval);
        results[2] = getRandomSymbol();
        reels[2].textContent = results[2];
        reels[2].parentElement.classList.remove('spinning');
        
        isSpinning = false;
        spinButton.disabled = false;
        
        calculatePayout(results);
    }, 2000);
}

spinButton.addEventListener('click', spin);

// Initialize
updateTokenDisplay();