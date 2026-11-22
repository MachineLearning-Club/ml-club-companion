# Week 09 — Content work package

Source manifest: `src/weeks/week09.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Prepare Evaluation | 4 | sort,choice | eval fixture reproducibility |
| Select Your Approach | 5 | choice,connect | objective feasibility |
| Build & Test | 7 | connect,order,parameters | execution of pipeline and metrics |
| Reflect & Improve | 5 | trace,choice | before/after evaluation evidence |
| Mid-Term Capstone | 2 | connect,trace,parameters | multi-goal, deterministic validator |

## Educational outcomes & advanced branches

- **Prepare Evaluation:** Interpret constraints and dataset. *Advanced branch:* Insufficient labels.
- **Select Your Approach:** Choose algorithms to meet objectives. *Advanced branch:* Nonobvious simpler baseline.
- **Build & Test:** Assemble reusable model pipeline. *Advanced branch:* Resource-efficient variant.
- **Reflect & Improve:** Diagnose errors and revise parameters. *Advanced branch:* Tradeoff between objectives.
- **Mid-Term Capstone:** Integrate earlier lessons. *Advanced branch:* Alternate compact solution.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
