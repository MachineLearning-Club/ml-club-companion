# Week 12 — Content work package

Source manifest: `src/weeks/week12.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Understand the Brief | 5 | sort,choice | requirements traceability |
| Define Success | 5 | numeric,choice | testable threshold objectives |
| Choose Architecture | 6 | connect,order | interface contracts and data-flow |
| Plan Experiments | 5 | order,trace | fixture/seed and baseline reproducibility |
| Project Design Checkpoint | 2 | connect,parameters | requirements coverage |

## Educational outcomes & advanced branches

- **Understand the Brief:** Identify project stakeholders and objective. *Advanced branch:* Find conflicting requirement.
- **Define Success:** Turn goals into measurable acceptance criteria. *Advanced branch:* Tradeoff requirements.
- **Choose Architecture:** Compose algorithm and UI components. *Advanced branch:* Alternative modular design.
- **Plan Experiments:** Design reproducible data and test plans. *Advanced branch:* Counterexample.
- **Project Design Checkpoint:** Produce a technically coherent plan. *Advanced branch:* Minimal architecture.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
