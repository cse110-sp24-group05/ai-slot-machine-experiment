# Notes
Observations:
-
  - The app is complete and playable with no missing features — bet controls, animated reels, sound,
   payout table, history log, and reset all work as a coherent whole.
  - Thematic cohesion is strong: the AI/token framing (symbol names like AGI, BRAIN, METRICS; loss
  messages referencing hallucinations, context windows, backpropagation) is consistently carried
  through every UI element.

  Bugs:
  -
  - totalBurned is incremented by the full bet on every spin, but on a pair win the player gets half
   back — so "burned" overstates actual net loss. It should subtract the returned amount on pair
  outcomes.
  - Bet input accepts values higher than current balance if typed manually (only setBet() clamps to
  balance); the spin function catches it but the input itself gives no visual feedback.

  Interesting behavior:
  -
  - The model produced 12 distinct lose messages, 5 pair messages, 6 win messages, 4 bigwin
  messages, and 4 jackpot messages — a surprisingly rich flavor text pool for a single-file game,
  suggesting significant output tokens were spent on copy rather than logic.
  - Web Audio synthesis is implemented from scratch using oscillator nodes with exponential gain
  ramps — no sound assets, no libraries. Uncommon choice that keeps the file fully self-contained.
