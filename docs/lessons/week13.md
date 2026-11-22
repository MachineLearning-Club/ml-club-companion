# Week 13 — Content work package

Source manifest: `src/weeks/week13.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Implement Data Flow | 5 | connect,trace | typed data passing |
| Compose Algorithms | 6 | connect,parameters | algorithm execution and validity |
| Create Controls | 5 | order,connect | event/update semantics |
| Debug Integration | 6 | trace,repair | integration test fixtures |
| Application Checkpoint | 2 | connect,trace | functional multi-stage acceptance |

## Educational outcomes & advanced branches

- **Implement Data Flow:** Connect input and transforms. *Advanced branch:* Handle missing data.
- **Compose Algorithms:** Wire real ML nodes. *Advanced branch:* Alternative algorithm.
- **Create Controls:** Bind user actions to model params. *Advanced branch:* Avoid invalid states.
- **Debug Integration:** Find broken cross-component behavior. *Advanced branch:* Race-condition prevention.
- **Application Checkpoint:** Construct end-to-end running pipeline. *Advanced branch:* Optimize component count.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
