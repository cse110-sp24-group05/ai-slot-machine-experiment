Metrics                                                                                                
                                                                                                                ┌────────────────────────┬────────────────────────────────────────────────────────────┐
  │         Field          │                           Value                            │                
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Run ID                 │ candidate-021                                              │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Timestamp (ISO 8601)   │ 2026-04-12T05:08:52Z                                       │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Model + version string │ claude-sonnet-4-6                                          │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Input tokens           │   9                                                        │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Output tokens          │   21956                                                    │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Total tokens           │   180972                                                   │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Wall-clock time (s)    │  290 seconds                                               │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Tool-reported time (s) │  same as Wall-clock time                                   │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Files produced         │ 1 — index.html                                             │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Lines of code          │ 818                                                        │
  ├────────────────────────┼────────────────────────────────────────────────────────────┤
  │ Runs in browser?       │ Yes                                                        │
  └────────────────────────┴────────────────────────────────────────────────────────────┘

  App Quality Notes
  - Fully self-contained single-file app; no dependencies, no build step — open index.html and it works  
  immediately.
  - All major slot machine behaviors are present: weighted odds, cascading reel stops with audio
  feedback, win/loss state, payout table, stats tracking, keyboard support, and a reset flow.
  - The AI-roast theming is consistent throughout (balance labeled "Context Window Balance", symbols     
  named HALLUC/AGI/BOT, loss messages reference RLHF/hallucination/training data).

  Code Quality Notes
  - Logic, styles, and markup are cleanly separated within the single file; no inline styles or mixed    
  concerns outside of intentional design tokens via CSS custom properties.
  - The weighted-pool approach for symbol randomness is simple and correct; game state is flat and easy  
  to follow.
  - No frameworks, no dead code, no defensive error-handling theater — the Web Audio API calls are the   
  only try/catch, justified because autoplay policy can throw on some browsers.