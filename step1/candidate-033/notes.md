# Notes

Observations:
- Single self-contained HTML file with no external dependencies; CSS, JS, and markup all inline. Deployable by double-clicking.
- Uses a weighted reel strip (50 symbols) rather than uniform random selection — rare symbols like 🤖 appear once in the strip, giving a genuine 1/50 per-reel probability before any forced-win overrides.
- Reel animation is driven by a recursive `setTimeout` ticker with a cubic ease-out curve, not CSS transitions or `requestAnimationFrame`. This gives smooth deceleration but ties animation fidelity to the JS event loop.
- Forced-win overrides are applied after random targets are chosen: 12% chance of a pair (reels 0+1 match), 4% chance of a triple. Both checks run independently, so the 4% triple can override a naturally different pair — effective triple rate is slightly higher than stated.
- The `VISIBLE` constant (line 633) is defined but never used; a leftover from an earlier reel-window design.

Bugs:
- **Accounting inconsistency in `totalLost`:** On a jackpot, `totalLost -= bet` is called to convert it to a net figure (line 796), but on a pair win it is not. This means pair wins inflate `totalLost` by the bet amount, making the "Tokens Burned" counter show gross spend for pairs but net spend for jackpots — the display is inconsistent.
- **Out-of-tokens message can overwrite a winning message:** When a player bets their last tokens and wins, `evaluateResult` fires the win message, but the `balance <= 0` check immediately after (line 777) replaces it 600 ms later with the broke message — the win is acknowledged and then erased.
- **`betUp` disabled state not initialized:** The `disabled` property on the bet-up button is only set inside `updateStats()`. On the very first render it is not `disabled` in HTML, so a fast click before the first `updateStats()` call could push the bet above the balance. In practice the call happens synchronously at startup, so this window is negligible.
- **`getSymbolAt` is defined but never called** (line 669–672); the result is always read directly from `REEL_STRIP[t % STRIP_LEN]` instead.

Interesting behavior:
- The three-🤖 jackpot (×50) has a natural probability of (1/50)³ = 1 in 125,000, but the 4% forced-triple override makes it effectively far more common — roughly 1 in 25 spins could triple on *any* symbol, including the rarer ones, which compresses the actual jackpot gap significantly.
- The staggered reel stop delays (0 ms, 200 ms, 400 ms) create the classic slot-machine tension of watching each reel lock in sequence, even though all three outcomes are predetermined before any animation begins.
- On mobile the emoji rendering varies by OS emoji font; on some Android devices the reel symbols render at different sizes, causing subtle vertical misalignment in the payline window.
