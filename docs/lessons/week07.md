# Week 07 — Content work package

Source manifest: `src/weeks/week07.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Connect Neurons | 5 | connect,order | shape and dimension validation |
| Forward Propagation | 6 | numeric,trace | dense layer and activation |
| Measure Loss | 5 | numeric,choice | MSE/cross-entropy |
| Understand Gradients | 6 | numeric,order | chain rule in simple network |
| Backpropagation | 6 | trace,parameters | gradient descent step |
| Neural Checkpoint | 2 | connect,parameters | forward/backward training verified |

## Educational outcomes & advanced branches

- **Connect Neurons:** Build fully connected feedforward layers. *Advanced branch:* Identity network.
- **Forward Propagation:** Compute network outputs. *Advanced branch:* Equivalent weights.
- **Measure Loss:** Compare targets and predictions. *Advanced branch:* Loss vs accuracy.
- **Understand Gradients:** Inspect derivative signals. *Advanced branch:* Vanishing gradient.
- **Backpropagation:** Update weights from error signals. *Advanced branch:* Check gradient numerically.
- **Neural Checkpoint:** Train a toy network on real data. *Advanced branch:* Architecture optimization.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
