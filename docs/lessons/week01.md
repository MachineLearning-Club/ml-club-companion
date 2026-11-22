# Week 01 — Content work package

Source manifest: `src/content/week01.ts`.

**Status:** Week 1 vertical slice exists; expand without breaking stable IDs.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Machines Follow Rules | 5 | sort,choice,order | rule interpreter; deterministic classification |
| Rules or Learning | 5 | choice,train,predict | fit model from examples, test held-out prediction |
| Features, Labels & Feedback | 5 | sort,choice,repair | dataset-aware truth labels and updateable model |
| From Camera to Action | 4 | order,connect,trace | execute ordered pipeline, check outputs |
| What Are the Chances? | 6 | sort,numeric,choice | exact sample-space counts |
| A Clue Changes Everything | 5 | numeric,choice | conditional count and Bayes identity |
| Fair, Loaded or Tricky? | 6 | numeric,sort,choice | probability normalization and expected value |
| Mystery Machine | 1 | connect,order,numeric | multiple independent evidence-based objectives |

## Educational outcomes & advanced branches

- **Machines Follow Rules:** Identify deterministic instructions and irrelevant features. *Advanced branch:* Find two equivalent rule systems.
- **Rules or Learning:** Distinguish programmed rules from learned parameters. *Advanced branch:* Adversarial indistinguishable examples.
- **Features, Labels & Feedback:** Learn supervised examples and labeling. *Advanced branch:* Detect label noise.
- **From Camera to Action:** Compose real sensor-model-rule-action pipeline. *Advanced branch:* Rewire equivalent pipelines.
- **What Are the Chances?:** Compute probabilities from sample spaces. *Advanced branch:* Nonuniform sample space.
- **A Clue Changes Everything:** Conditional probability and Bayes from counted cases. *Advanced branch:* Base-rate reversal.
- **Fair, Loaded or Tricky?:** Distributions and expectation. *Advanced branch:* Compare strategies with equal expectation.
- **Mystery Machine:** Integrate rules, learning and uncertainty in a checkpoint. *Advanced branch:* Alternative optimized solution.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
