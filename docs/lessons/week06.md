# Week 06 — Content work package

Source manifest: `src/weeks/week06.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Weighted Decisions | 5 | numeric,choice | dot product |
| Bias & Threshold | 6 | parameters,numeric | step activation with bias |
| Teach the Neuron | 6 | trace,numeric | perceptron training step |
| Separate the Data | 5 | choice,parameters | weighted hyperplane test |
| Inspect Failures | 4 | choice,repair | finite epoch trace and failure diagnostics |
| Perceptron Checkpoint | 2 | parameters,trace | perceptron convergence and held-out tests |

## Educational outcomes & advanced branches

- **Weighted Decisions:** Compute weighted sums. *Advanced branch:* Negative weights.
- **Bias & Threshold:** Manipulate a separating hyperplane. *Advanced branch:* Boundary exactly zero.
- **Teach the Neuron:** Perceptron error-correction updates. *Advanced branch:* Learning-rate changes.
- **Separate the Data:** Decide linear separability. *Advanced branch:* XOR impossible separation.
- **Inspect Failures:** Classify impossible and ambiguous training sets. *Advanced branch:* Noisy labels.
- **Perceptron Checkpoint:** Train and test linear classifier. *Advanced branch:* Minimal updates.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
