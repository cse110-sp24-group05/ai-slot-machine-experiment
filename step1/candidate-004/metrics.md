# Metrics

Run ID: candidate-004
Timestamp (ISO 8601): 2026-04-12  
Model + version string: claude-sonnet-4-6

Input tokens: full context at generation time (system prompt ~6.5k + tools ~20k + prior messages) ≈ ~28–32k tokens
Output tokens: 862 lines of dense HTML/CSS/JS ≈ ~4,500–5,500 tokens
Total tokens: ~33–38k tokens

Wall-clock time (s): N/A
Tool-reported time (s): N/A

Files produced (count and names): 1 — step1/candidate-004/index.html

Lines of code (total across produced files): 862

Runs in browser? (yes / no / partial): yes

App Quality Notes (1-3 sentences or bullets):

- Includes a "hallucination mode" (5–15% chance per spin) where wrong symbols briefly flash on the reels with a ⚠ HALLUCINATING ⚠ banner before resolving to the real outcome — payout is always based on the real symbols.
- Context window progress bar fills as spins accumulate and triggers a flavor message at 50 spins ("context window full — model behavior is now undefined").
- 7 weighted symbols, 3 rotating win messages per symbol, 17 lose messages, particle burst on big wins, Web Audio API sound effects, and turbo mode (click again mid-spin to skip).

Code Quality Notes (1-3 sentences or bullets):

- Single-file vanilla HTML/CSS/JS with no dependencies; CSS custom properties used for the full color palette.
- Hallucination logic cleanly separates display symbols from real/payout symbols by returning either the real array or a `{display, real, hallucinated}` object from `maybeHallucinate()`.
- State mutation is minimal and centralised; `updateStats()` is the single source of truth for all DOM stat updates.
