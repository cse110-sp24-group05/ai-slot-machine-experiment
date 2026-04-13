# Metrics                                                                                                                     
                                                                                                                              
  ┌────────────────────────┬──────────────────────────┐                                                                       
  │         Field          │          Value           │                                                                       
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Run ID                 │ (not exposed by runtime) │     
  ├────────────────────────┼──────────────────────────┤
  │ Timestamp (ISO 8601)   │ 2026-04-13T01:33:29Z     │                                                                       
  ├────────────────────────┼──────────────────────────┤
  │ Model + version string │ claude-sonnet-4-6        │                                                                       
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Input tokens           │ (not exposed by runtime) │
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Output tokens          │ (not exposed by runtime) │     
  ├────────────────────────┼──────────────────────────┤
  │ Total tokens           │ (not exposed by runtime) │
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Wall-clock time (s)    │ (not exposed by runtime) │
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Tool-reported time (s) │ (not exposed by runtime) │     
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Files produced         │ 1 — index.html           │
  ├────────────────────────┼──────────────────────────┤                                                                       
  │ Lines of code          │ 931                      │     
  ├────────────────────────┼──────────────────────────┤
  │ Runs in browser?       │ Yes                      │
  └────────────────────────┴──────────────────────────┘                                                                       
   
  App Quality Notes                                                                                                           
  - Fully playable single-file slot machine with staggered reel animations, weighted symbol probabilities, a paytable, bet
  selection, confetti on jackpot, and a "broke" screen — the AI satire is consistent end-to-end (loss messages, symbol names, 
  broke/reset copy).                                                                                                         
  - The 👻 Hallucination triple deliberately pays 0× (thematically correct, mechanically surprising) and the two-of-a-kind    
  sub-payouts add depth beyond a simple 3-match game.       
                                                                                                                              
  Code Quality Notes
  - All game logic, rendering, and styles are self-contained in one file with no dependencies — good for shareability, but the
   931-line monolith would be hard to extend.                                                                                 
  - Reel animation uses a hand-rolled requestAnimationFrame easing loop rather than CSS transitions, which gives precise
  landing control but bypasses the platform's compositor optimizations; a CSS custom property approach could simplify it.     
  - Token counts and win/loss state are plain let globals — fine at this scale, but fragile if the file grows.  
