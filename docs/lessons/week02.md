# Week 02 — Content work package

Source manifest: `src/weeks/week02.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Read a Dataset | 5 | sort,choice | extract categorical feature / label |
| Measure Uncertainty | 5 | numeric,choice | entropy calculator |
| Choose a Split | 6 | numeric,choice | conditional entropy and information gain |
| Grow a Tree | 6 | connect,order,trace | ID3 train and predict with categorical values |
| Generalise & Debug | 5 | choice,repair,trace | hold-out predictions & fallback cases |
| Decision Tree Checkpoint | 2 | connect,parameters,trace | accuracy and tree-structure constraints |

## Educational outcomes & advanced branches

- **Read a Dataset:** Identify input and target variables in examples. *Advanced branch:* Spot leakage.
- **Measure Uncertainty:** Compute entropy for labelled subsets. *Advanced branch:* Compare competing distributions.
- **Choose a Split:** Evaluate information gain of candidate features. *Advanced branch:* Two equal-gain features.
- **Grow a Tree:** Construct and traverse an ID3 decision tree. *Advanced branch:* Equivalent minimal trees.
- **Generalise & Debug:** Inspect unseen examples, missing values and overfit. *Advanced branch:* Adversarial missing feature.
- **Decision Tree Checkpoint:** Build an interpretable classifier end to end. *Advanced branch:* Optimise tree size.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
