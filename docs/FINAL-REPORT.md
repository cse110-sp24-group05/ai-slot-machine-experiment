
## Overview

For this assignment, we ran the same prompt 50 times through Claude Code and measured output variability and consistency. The prompt asked for a slot machine web app built in vanilla HTML, CSS, and JavaScript, themed around AI tokens. We did not modify the code, provide additional guidance, or reuse previous sessions. Every run started from a clean session.

The objective was not to produce the best slot machine app, but to evaluate how consistent the model remained when the prompt stayed fixed and only the session changed.

We used **claude-sonnet-4-6** for every run of this experiment. After the 50 baseline runs, we selected the strongest candidates and moved them through four rounds of single-turn refinement prompts, narrowing the pool from **5 → 3 → 2 → 1 final candidate**.

## Initial Findings

Some observations were highly consistent. Nearly every run produced a **single HTML file** containing the spin logic, token system, styling, and JavaScript behavior in the same general structure. Most outputs followed a familiar HTML/CSS/JS pattern, which suggests strong structural consistency.

However, the differences between runs were larger than expected in several important areas. The biggest variation came from how the **AI token theme was interpreted**, whether the **token economy actually functioned correctly**, and the **overall code quality**. Some iterations leaned into the satirical AI-slot-machine concept, while others produced a more generic slot machine with only light theming. In weaker outputs, the win/loss logic was inconsistent, and token balances sometimes failed to update correctly after spins.

The UI quality also varied significantly. Some versions felt close to finished prototypes, with smooth animations, readable payout explanations, and polished layouts. Others felt incomplete, sometimes lacking clear feedback, reset functionality, or useful instructions. Among the stronger baseline candidates, extra features included ticker animations, reset or refill token buttons, sound effects, and clearer symbol layouts.

This variation made the differences easy to observe. Even with the exact same prompt, some runs produced fully playable prototypes, while others mainly generated a frontend shell with incomplete game logic.

After scoring all 50 runs with our rubric, we selected the following five candidates to move forward:

* **candidate-003** — 18/25
* **candidate-020** — 19/25
* **candidate-024** — 19/25
* **candidate-035** — 18/25
* **candidate-042** — 17/25

We prioritized candidates that were **functional first**, then creative, with smooth UI/UX and stable gameplay.

## Refinement Rounds

Each round used a new prompt capped at **200 words**. We copied the surviving candidates into a new folder, ran each in a clean session, and rescored them using the same rubric.

### Step 2 — 5 Candidates

This round focused on strengthening the **core game mechanics**. Major additions included different sound effects for outcomes, adjustable betting amounts, clearer payout multipliers, and partial refund logic for two-of-a-kind outcomes.

This stage improved gameplay depth the most. Adjustable betting made the app feel more interactive, and the payout structure made outcomes easier to understand. However, not every candidate implemented the payout rules consistently. Some versions followed the prompt exactly, while others introduced multiplier errors or inconsistent refund behavior.

The strongest candidates in this round improved gameplay depth **without breaking the existing token logic**.

### Step 3 — 3 Candidates

This round targeted **bug reduction, stronger AI satire, better visual readability, full button sound coverage, and improved formatting**.

This stage produced the largest improvement in **visual polish**. The stronger candidates developed more cohesive AI-themed humor and clearer layouts. The weaker candidates mostly improved appearance while still leaving gameplay bugs unresolved, which led to their elimination.

### Step 4 — 2 Candidates

The remaining two candidates were refined around **immersion and feature completeness**. The prompt focused on token refill systems, custom betting controls, immersive casino-style sound effects, optional color palette customization, and stronger casino visuals such as levers and decorative gimmicks.

This round emphasized **user experience rather than core logic**. One candidate clearly stood out because it successfully layered new features on top of already stable gameplay. The other introduced more ambitious visuals, but at the cost of minor regressions in betting flow.

### Step 5 — Final Pick

Our final selection was **candidate-020**, which scored **23/25**.

It consistently preserved:

* A stable token economy
* Correct payout handling
* Clean UI structure
* Readable code organization
* A strong AI satire theme
* A polished casino-like atmosphere

Rather than being the flashiest version, it was the candidate that remained the most **functional and understandable** throughout every refinement pass. After the final refinement, it included clean animations and a toggleable AI voice feature.

Overall, refinement helped in an **incremental rather than dramatic** way. The baseline generations already showed that the model could produce playable prototypes, but the refinement rounds made the stronger candidates feel much more complete.

The biggest gains came from:

* Improving payout consistency
* Strengthening visual clarity
* Reinforcing the theme
* Adding player controls like custom betting and token refills
* Increasing immersion through sound and casino-style visuals

## Limitations

Several limitations should be acknowledged.

First, **50 runs of a single relatively simple prompt** is still a small experiment, so it is not enough to make broad claims about the model’s overall consistency.

Second, the frozen-prompt baseline was intentionally restrictive. In realistic student workflows, most users would naturally revise their prompt after seeing weak outputs. This design isolates variability effectively, but it does not fully represent practical AI-assisted prototyping.

Third, the scoring process included **subjective judgment**. Even with a shared rubric, teammates may have interpreted polish, creativity, and code quality differently, which likely introduced scoring variation.

Finally, this experiment used **single-shot generation followed by single-turn refinements**, which is much simpler than how students would normally use AI tools in real prototyping workflows.

## Conclusion

The biggest finding was that the model remained **structurally consistent but not behaviorally consistent**.

Most outputs shared a similar HTML/CSS/JS skeleton, but gameplay quality, payout logic, theme commitment, and overall polish varied much more than expected.

The refinement rounds were worthwhile, but they worked best when the requests were **narrow and specific**. The strongest candidates evolved from rough prototypes into something that fe
