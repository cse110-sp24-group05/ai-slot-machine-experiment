const symbols = ['🧠', '🤖', '📈', '📉', '💬', '💩'];
const SPIN_COST = 100;
let balance = 10000;
let isSpinning = false;

const balanceDisplay = document.getElementById('balance');
const messageDisplay = document.getElementById('message');
const spinBtn = document.getElementById('spin-btn');
const reelsContainer = document.querySelector('.reels');
const reelElements = [
    document.getElementById('reel1'),
    document.getElementById('reel2'),
    document.getElementById('reel3')
];

function updateBalanceDisplay() {
    balanceDisplay.textContent = balance;
}

function getRandomSymbol() {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
}

function spin() {
    if (isSpinning) return;
    
    if (balance < SPIN_COST) {
        messageDisplay.textContent = "Context Window Exceeded - Please upgrade to Pro!";
        messageDisplay.className = 'loss';
        return;
    }

    balance -= SPIN_COST;
    updateBalanceDisplay();
    isSpinning = true;
    spinBtn.disabled = true;
    messageDisplay.textContent = "Generating response...";
    messageDisplay.className = '';

    reelsContainer.classList.add('spinning');

    // Randomize intermediate symbols during the spin visually
    const spinInterval = setInterval(() => {
        reelElements.forEach(reel => {
            reel.textContent = getRandomSymbol();
        });
    }, 100);

    // Stop spin after a delay
    setTimeout(() => {
        clearInterval(spinInterval);
        reelsContainer.classList.remove('spinning');
        
        // Final results
        const results = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        reelElements.forEach((reel, index) => {
            reel.textContent = results[index];
        });

        evaluateResult(results);
        
        isSpinning = false;
        spinBtn.disabled = false;
    }, 2000);
}

function evaluateResult(results) {
    const [s1, s2, s3] = results;

    if (s1 === '💩' && s2 === '💩' && s3 === '💩') {
        balance -= 1000;
        messageDisplay.textContent = "Massive Hallucination! -1000 tokens penalty.";
        messageDisplay.className = 'loss';
    } else if (s1 === s2 && s2 === s3) {
        balance += 5000;
        messageDisplay.textContent = "AGI Achieved! +5000 tokens!";
        messageDisplay.className = 'win';
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        balance += 500;
        messageDisplay.textContent = "Useful Snippet generated. +500 tokens!";
        messageDisplay.className = 'win';
    } else {
        messageDisplay.textContent = "Output was generic. Try another prompt.";
        messageDisplay.className = '';
    }
    
    // Check for negative balance
    if (balance < 0) balance = 0;
    
    updateBalanceDisplay();
}

spinBtn.addEventListener('click', spin);

// Initialize
updateBalanceDisplay();