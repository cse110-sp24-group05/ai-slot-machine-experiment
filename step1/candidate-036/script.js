document.addEventListener('DOMContentLoaded', () => {
    // --- State & Configuration ---
    let balance = 128000;
    const SPIN_COST = 1024;
    let isSpinning = false;

    // The possible symbols
    const symbols = ['🤖', '🧠', '💸', '📉', '🚀'];
    
    // Weights for symbols (higher number = more frequent)
    // Let's make Hype (🚀) rare, and API Cost (💸) / Parameters (🧠) common
    const symbolWeights = [
        { symbol: '🤖', weight: 15 }, // AI Bot
        { symbol: '🧠', weight: 25 }, // Parameters
        { symbol: '💸', weight: 30 }, // API Cost
        { symbol: '📉', weight: 20 }, // Hallucination
        { symbol: '🚀', weight: 10 }  // Hype (Jackpot)
    ];

    // Build weighted array for easy random selection
    let weightedSymbols = [];
    symbolWeights.forEach(item => {
        for(let i=0; i<item.weight; i++) {
            weightedSymbols.push(item.symbol);
        }
    });

    // --- DOM Elements ---
    const balanceEl = document.getElementById('balance');
    const spinButton = document.getElementById('spin-button');
    const messageEl = document.getElementById('message');
    
    const reelElements = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    // --- Core Logic ---

    // Initialize UI
    updateBalanceDisplay();

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        
        if (balance < SPIN_COST) {
            showMessage("Rate limit exceeded! Not enough tokens.", "loss");
            return;
        }

        startSpin();
    });

    function startSpin() {
        isSpinning = true;
        spinButton.disabled = true;
        
        // Deduct cost
        balance -= SPIN_COST;
        updateBalanceDisplay();
        
        showMessage("Generating response...", "");
        
        // Add spinning animation class
        reelElements.forEach(reel => reel.classList.add('spinning'));

        // Determine final symbols
        const finalSymbols = [
            getRandomSymbol(),
            getRandomSymbol(),
            getRandomSymbol()
        ];

        // Stop reels with staggered timing
        const spinDurations = [1000, 1500, 2000]; // ms
        
        reelElements.forEach((reel, index) => {
            setTimeout(() => {
                reel.classList.remove('spinning');
                reel.querySelector('.symbol').innerText = finalSymbols[index];
                
                // If it's the last reel, calculate results
                if (index === 2) {
                    calculateResult(finalSymbols);
                }
            }, spinDurations[index]);
        });
    }

    function getRandomSymbol() {
        const randomIndex = Math.floor(Math.random() * weightedSymbols.length);
        return weightedSymbols[randomIndex];
    }

    function calculateResult(results) {
        isSpinning = false;
        spinButton.disabled = false;

        const counts = {};
        results.forEach(s => counts[s] = (counts[s] || 0) + 1);
        
        const uniqueSymbols = Object.keys(counts);
        
        let winAmount = 0;
        let msg = "";
        let msgClass = "";

        // Check for 3 of a kind
        if (uniqueSymbols.length === 1) {
            const sym = uniqueSymbols[0];
            if (sym === '🚀') {
                winAmount = 10000;
                msg = "AGI Achieved! The singularity is here! (+10,000 Tokens)";
                msgClass = "jackpot";
            } else if (sym === '🤖') {
                winAmount = 5000;
                msg = "Perfect zero-shot code generation! (+5,000 Tokens)";
                msgClass = "win";
            } else if (sym === '🧠') {
                winAmount = 2500;
                msg = "Deep insight uncovered! (+2,500 Tokens)";
                msgClass = "win";
            } else if (sym === '💸') {
                winAmount = 1024;
                msg = "API outage! Tokens refunded. (+1,024 Tokens)";
                msgClass = "win";
            } else if (sym === '📉') {
                winAmount = -5000;
                msg = "Massive hallucination! Model collapse detected! (-5,000 Tokens)";
                msgClass = "loss";
            }
        } 
        // Check for 2 of a kind
        else if (uniqueSymbols.length === 2) {
            // Find which symbol has 2
            let pairSymbol = null;
            for (let s in counts) {
                if (counts[s] === 2) pairSymbol = s;
            }
            
            if (pairSymbol === '📉') {
                // Punishment for double hallucination
                winAmount = -1000;
                msg = "The model is confused. Lost extra tokens! (-1,000 Tokens)";
                msgClass = "loss";
            } else {
                winAmount = 500;
                msg = "Partial match. The output is... okayish. (+500 Tokens)";
                msgClass = "win";
            }
        } 
        // All different
        else {
            winAmount = 0;
            msg = "Irrelevant output generated. Tokens wasted.";
            msgClass = "loss";
        }

        // Apply winnings/losses
        balance += winAmount;
        
        // Ensure balance doesn't go below 0
        if (balance < 0) balance = 0;
        
        updateBalanceDisplay();
        showMessage(msg, msgClass);
        
        if (balance <= 0) {
            showMessage("Out of context! Please upgrade your plan (refresh to restart).", "loss");
            spinButton.disabled = true;
        }
    }

    function updateBalanceDisplay() {
        // Simple animation for balance change could go here
        balanceEl.innerText = balance.toLocaleString();
    }

    function showMessage(text, className) {
        messageEl.innerText = text;
        messageEl.className = className; // 'win', 'loss', 'jackpot', or empty
    }
});