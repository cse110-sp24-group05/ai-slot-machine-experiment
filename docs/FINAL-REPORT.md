# Overview

For this assignment, we ran the same prompt 50 times through Claude Code and measured what came out, variability, and consistency. The prompt asked for a slot machine web app built in vanilla HTML, CSS, and JavaScript, themed around AI tokens. We didn’t touch the code, didn’t guide the AI, and started fresh every single run. Our objective wasn’t to build the best slot machine app, but rather to see how consistent, or inconsistent, the output was when nothing changed except the session of the model.

We used **claude-sonnet-4-6** for every run of this experiment. After the 50 baseline runs, we picked the best candidates and ran them through four rounds of single-turn refinement prompts, narrowing down from **5 → 3 → 2 → 1 final candidate**.

# Initial Findings

Some observations were pretty consistent: almost every run produced a single HTML file with the spin logic and token system in the same general format and shape. The code was all generated in a single HTML file and included HTML, CSS, and JavaScript inside. However, there were a lot more variations than we expected, with the biggest differences being how the AI token theme was handled, whether the token economy actually worked, and code quality. Some iterations leaned into the joke of the slot machine and AI memes, while others produced more generic slot machines. Some runs had broken win/loss logic and failed to update tokens after each spin. Code quality varied greatly, from clean and readable code to messy code.

The UI quality also varied significantly. Some versions felt close to finished prototypes, with smoother animations, clear payout explanations, and better layouts. Others felt more incomplete, sometimes missing visual feedback, reset functionality, or clear instructions for the player. Among the stronger baseline candidates, extra features included ticker animations, reset/refill token buttons, sound effects, and more readable symbol layouts. This variation made the output differences easy to observe. Even with the same exact prompt, some runs produced fully playable prototypes, while others mainly generated a frontend shell with incomplete game logic.

After scoring all 50 runs with our rubric, we picked these five to move forward: **candidate-003 (18/25), candidate-020 (19/25), candidate-024 (19/25), candidate-035 (18/25), and candidate-042 (17/25).** We prioritized candidates that were functional first, then creative with well-functioning and smooth UI/UX.

# Refinement Rounds

Each round we wrote a new prompt with a limit of 200 words, copied the surviving candidates into a new folder, ran a clean session, and scored again using the same rubric each time.

## Step 2 (5 candidates)

We focused on strengthening the actual game mechanics. The main additions were different sound effects for outcomes, adjustable betting amounts, clearer payout multipliers, and partial refund logic for two-of-a-kind outcomes. This round improved the gameplay depth the most. The ability to choose bet sizes made the game feel more interactive, and the payout structure made outcomes easier to understand. However, not every candidate implemented the payout rules consistently. Some versions followed the prompt exactly, while others introduced multiplier errors or inconsistent refund behavior. The strongest candidates after this round were the ones that improved game depth without breaking the existing token logic.

## Step 3 (3 candidates)

We targeted reducing remaining bugs, reinforcing the sarcastic AI theme, improving visual readability, adding sound effects to all buttons, and improving formatting. This round created the largest improvement in visual polish, with more cohesive AI-themed jokes. The weaker candidates in this stage mainly improved appearance while still leaving logic issues unresolved, which led to their elimination.

## Step 4 (2 candidates)

The remaining two candidates were refined around immersion and feature completeness. The prompt targeted token refill systems, custom betting controls, immersive casino-style sound effects, optional color palette customization, and stronger casino-themed visuals such as levers and decorative gimmicks. This round was less about core logic and more about user experience. One candidate clearly stood out because it successfully layered the new features on top of already stable gameplay, while the other introduced more ambitious visuals at the cost of minor regressions in the betting flow.

## Step 5 (final pick)

Our final candidate was **candidate-020, scoring 23/25**. It consistently preserved a stable token economy, correct payout handling, clean UI structure, readable code organization, a strong AI satire theme, and a polished casino-like atmosphere. Rather than being the flashiest version, it was the one that remained the most functional and understandable after every refinement pass. After the final refinement, it featured clean animations and a toggleable AI voice feature.

Overall, the refinement helped, but mostly in an incremental way rather than a dramatic one. The baseline generations already showed that the model could produce playable prototypes, but the refinement stages made the stronger candidates feel much more complete. The most noticeable gains came from improving payout consistency, strengthening visual clarity, reinforcing the theme, adding player controls like custom betting and token refills, and making the experience more immersive through sound and casino-style design choices.

# Limitations

A few limitations are important to acknowledge. First, 50 runs of one relatively simple prompt is still a small experiment, so it is not enough to make broad claims about the consistency of the model as a whole. The frozen-prompt baseline was intentionally restrictive. In realistic student workflows, most users would naturally revise the prompt after seeing weak outputs, so this design isolates variability well but does not fully represent practical usage.

Furthermore, the scoring process included subjective judgment. Even with a shared rubric, differences in how teammates interpreted polish, creativity, and code quality likely introduced some inconsistency in the scores. Finally, this experiment was based on single-shot generation followed by single-turn refinements, which is much simpler than how students would normally use AI tools during real prototyping workflows.

# Conclusion

The biggest finding was that the model stayed structurally consistent but not behaviorally consistent. Most outputs shared a similar HTML/CSS/JS skeleton, but gameplay quality, payout logic, theme commitment, and overall polish varied a lot more than we expected.

Refinement rounds were worth it, but worked best with narrow, specific requests. The strongest candidates evolved from rough prototypes into something that actually felt intentional and usable with a human-oriented goal.

If we ran this again, we’d split the rubric more clearly across functionality, creativity, and maintainability, while also scoring out of 10 to leave more room for precision.

For students using AI to prototype: it’s great for fast first drafts, but those drafts still need human review. The structure might look complete, but the actual user experience can differ significantly between generations, especially around gameplay logic, fairness, and edge cases.
