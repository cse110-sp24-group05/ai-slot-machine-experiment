# Notes


Observations:                                                                                                                                                 
    - Task was completed in a single Write pass after one Read of the                                                                                         
      existing file; no iterative edits were needed.
    - Web Audio API was chosen for sound effects to keep the output a
      single self-contained HTML file with zero external dependencies.
    - Bet preset buttons (5/10/25/50/100/MAX) were added beyond the
      literal spec ("manually choose amount") as a UX convenience — minor
      scope creep that was not requested.
    - The paytable in the original code listed multipliers that did not
      match the new spec (e.g., old x2 pair payout vs. new ½-back); the
      HTML paytable section was updated in sync with the JS logic.

Bugs:
    - setBetMax() snapshots balance at button-click time; if a spin
      completes between the click and the next spin, the stored max could
      exceed the new balance. Spin-time validation catches this, so it
      surfaces as an error message rather than a silent exploit.
    - No input sanitisation on the bet field beyond parseInt(); a user
      typing a float (e.g. 10.9) is silently floored. Acceptable for a
      toy app but worth noting.

Interesting behavior:
    - Token profile: 9 raw input vs. 140,933 cache-read tokens — almost
      all context was served from cache, which explains the low cost
      ($0.32) despite a ~720-line file output.
    - The AudioContext must be created or resumed inside a user-gesture
      handler (the spin button); browsers block autoplay audio, so the
      first spin also silently unlocks the audio engine — no extra
      "click to enable sound" prompt needed.
