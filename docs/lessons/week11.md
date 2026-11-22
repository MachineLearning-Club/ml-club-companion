# Week 11 — Content work package

Source manifest: `src/weeks/week11.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Think in Procedures | 5 | order,trace | pure executor trace |
| Organize Objects | 5 | sort,connect | object method and state contracts |
| Test the System | 6 | choice,trace | verified test expectations |
| Data Pipelines | 6 | connect,order | typed I/O and dependencies |
| Debug & Version | 5 | choice,repair | repeatable regression checks |
| Engineering Checkpoint | 2 | connect,trace | requirements and test-pass validation |

## Educational outcomes & advanced branches

- **Think in Procedures:** Construct functions and pseudocode. *Advanced branch:* Equivalent refactoring.
- **Organize Objects:** Identify reusable object behavior. *Advanced branch:* Composition vs inheritance.
- **Test the System:** Write cases for example algorithms. *Advanced branch:* Boundary case discovery.
- **Data Pipelines:** Compose ETL/ML operations. *Advanced branch:* Minimal coupling.
- **Debug & Version:** Review fixes and safe workflows. *Advanced branch:* Mutation testing.
- **Engineering Checkpoint:** Assemble tested AI feature. *Advanced branch:* Simplified architecture.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
