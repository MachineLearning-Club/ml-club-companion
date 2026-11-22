# Week 14 — Content work package

Source manifest: `src/weeks/week14.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Test the Application | 5 | choice,trace | assertions on actual algorithm results |
| Find Failure Modes | 6 | trace,repair | error diagnostics |
| Improve Performance | 5 | numeric,parameters | operation counts and computational complexity |
| Make It Robust | 5 | sort,connect | safety invariant checks |
| Release Readiness | 5 | order,trace | CI/acceptance gates |
| Quality Checkpoint | 2 | connect,trace | multi-objective verification |

## Educational outcomes & advanced branches

- **Test the Application:** Design reproducible edge-case tests. *Advanced branch:* Property-based variants.
- **Find Failure Modes:** Trace corrupted data and boundary behavior. *Advanced branch:* Metamorphic test.
- **Improve Performance:** Measure and optimize algorithm work. *Advanced branch:* Memory bound.
- **Make It Robust:** Validate inputs and fallback behaviors. *Advanced branch:* Deliberately adversarial data.
- **Release Readiness:** Check integration and evaluation evidence. *Advanced branch:* Minimal reproducible failure.
- **Quality Checkpoint:** Pass full test suite on a scenario. *Advanced branch:* Pareto optimization.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
