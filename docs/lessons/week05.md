# Week 05 — Content work package

Source manifest: `src/weeks/week05.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| Pictures Are Numbers | 5 | numeric,sort | pixel matrix indexing and conversion |
| Transform a Picture | 5 | parameters,numeric | pixel-wise tensor transforms |
| Convolution & Kernels | 6 | numeric,trace | real 2D convolution / padding behavior |
| See the Edges | 6 | parameters,choice | convolution with known kernels |
| Vision Pipeline | 5 | order,connect,trace | end-to-end pixel output |
| Vision Checkpoint | 2 | parameters,connect | evaluate detection accuracy |

## Educational outcomes & advanced branches

- **Pictures Are Numbers:** Represent grayscale and RGB pixel arrays. *Advanced branch:* Different encoding same color.
- **Transform a Picture:** Brightness and channel manipulation. *Advanced branch:* Boundary clipping.
- **Convolution & Kernels:** Apply small image filters. *Advanced branch:* Kernel symmetry.
- **See the Edges:** Compare smoothing and edge filters. *Advanced branch:* False edge detection.
- **Vision Pipeline:** Compose preprocess-filter-detect. *Advanced branch:* Trade resolution for speed.
- **Vision Checkpoint:** Identify structure from noisy input. *Advanced branch:* Noise robustness.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
