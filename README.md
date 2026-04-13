# Slot Machine AI Experiment

This project looks at how consistent an AI coding assistant is when given the exact same prompt multiple times. Instead of trying to get the best possible result, the goal was to see how much the outputs vary and what a single refinement step can actually improve.

We ran the same prompt 50 times using `claude-sonnet-4-6`, making sure each run was in a clean session with no previous context.

## Repo Structure
- `step1/` → 50 baseline candidates  
- `step2/` → refinement results  
- `step3/`, `step4/`, `step5/` → later refinement rounds  
- `prompts/` → prompts used  
- `docs/` → results + final report  
- `RUBRIC.md` → how we graded each candidate  

## What we did
- Ran the same prompt 50 times  
- Compared results using a shared rubric  
- Picked the best candidates  
- Applied one refinement step at a time  

## How we evaluated
We graded each candidate based on:
- Functionality  
- UX  
- Completeness  
- Code Quality  
- Creativity  

## What we noticed
- Even with the same prompt, results were pretty different  
- Some apps worked really well, others had bugs or missing features  
- Code quality varied a lot between runs  
- Refinement helped clean up the code, but didn’t completely change the app  

## Notes
- We used `ccusage` to get token data  
- A lot of tokens show up as cache reads, so input tokens look really small  
- Timing and token numbers are approximate  

## Conclusion
AI is useful for quickly generating working prototypes, but the results aren’t always consistent. A single refinement helps improve things a bit, but there are still clear limits without more iteration.