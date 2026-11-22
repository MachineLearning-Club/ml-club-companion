# Week 10 — Content work package

Source manifest: `src/weeks/week10.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Words Become Tokens | 5 | sort,order | reproducible toy tokenization |
| Guess the Next Token | 6 | numeric,choice | real n-gram counts & normalized probabilities |
| Change the Temperature | 5 | parameters,numeric | stable softmax with temperature |
| Build a Toy Generator | 6 | connect,trace | deterministic seeded sampling |
| Evaluate Generated Text | 5 | choice,sort | objective factual checks |
| Generative AI Checkpoint | 2 | connect,parameters | sampling constraints, data provenance |

## Educational outcomes & advanced branches

- **Words Become Tokens:** Identify simple token boundaries. *Advanced branch:* Alternative tokenization.
- **Guess the Next Token:** Use conditional distributions. *Advanced branch:* Rare event.
- **Change the Temperature:** Investigate sampling distributions. *Advanced branch:* Entropy effects.
- **Build a Toy Generator:** Execute a sequential text-generation pipeline. *Advanced branch:* Multiple plausible continuations.
- **Evaluate Generated Text:** Distinguish likelihood from truth. *Advanced branch:* Hallucination counterexample.
- **Generative AI Checkpoint:** Build and inspect a tiny generator. *Advanced branch:* Optimize diversity vs accuracy.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
