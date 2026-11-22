# Week 04 — Content work package

Source manifest: `src/weeks/week04.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Recognise the Problem | 5 | choice,sort | task based method selection |
| Compare Algorithms | 5 | choice,numeric | algorithm-specific metrics |
| Test Generalisation | 5 | numeric,choice | confusion matrix and holdout accuracy |
| Repair a Pipeline | 5 | order,connect,trace | pipeline execution and data leakage checks |
| Applied Review | 2 | connect,parameters | multiple objective criterion |

## Educational outcomes & advanced branches

- **Recognise the Problem:** Select suitable supervised/unsupervised methods. *Advanced branch:* Ambiguous labels.
- **Compare Algorithms:** Contrast ID3, K-Means and KNN. *Advanced branch:* Similar outcomes from different methods.
- **Test Generalisation:** Evaluate data splits and edge cases. *Advanced branch:* Class imbalance.
- **Repair a Pipeline:** Find flawed data processing steps. *Advanced branch:* Alternative repair.
- **Applied Review:** Combine two ML approaches on one scenario. *Advanced branch:* Optimize both metrics.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
