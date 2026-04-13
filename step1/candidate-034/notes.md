# Notes


Observations:
- Single self-contained HTML file; zero external dependencies, opens directly in any browser with no build step.
- All animation is driven by `requestAnimationFrame` + CSS transitions — no canvas, no Web Animations API.
- The AI-theme is consistent end-to-end: spin button reads "GENERATE OUTPUT", status reads "Running inference...", game over reads "CONTEXT LIMIT REACHED", and every win/lose message is a jab at AI product culture.
- Game state is a handful of module-level `let` variables — easy to audit and modify.

Bugs:
- **Payout table mismatch:** the payout table UI labels a pair win as `×2`, but the code computes `Math.floor(bet * 1.5)`, so the displayed multiplier is wrong.
- **Dead position-reset guard:** inside `spinReel`, the guard `if (position >= (totalSymbols - 5) * symbolHeight) position = 0` (line 732) can never trigger under the current parameters — at 18 px/frame the reel travels at most ~1700 px before stopping, well under the 3850 px threshold — so the loop-around logic is dead code.
- **Redundant bump animation:** `updateBalance` simultaneously applies a CSS class that sets `transform: scale(1.2)` and an inline `style.animation` that runs the `tokenBounce` keyframe; the two fight briefly and the class has no visible effect because the inline animation takes precedence.

Interesting behavior:
- After a spin leaves the balance below the current bet, the game automatically drops to the lowest still-affordable bet tier rather than immediately disabling the spin button — a smooth UX detail that keeps play going as long as any bet is possible.
- The reel strip (40 symbols) is only rebuilt on game reset, not between spins; `spinReel` always writes the outcome symbol to the fixed index 37, so the two symbols above and below the payline are deterministic within a session — a player watching closely could notice repeated neighbours.
- `spins` is incremented after `evaluateResult`, so the stats counter lags one behind during the result animation; on a fast connection this is imperceptible but would matter if stats were persisted.
