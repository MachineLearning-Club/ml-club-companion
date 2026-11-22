# Week 03 — Content work package

Source manifest: `src/weeks/week03.ts`.

**Status:** Plan only; no runnable puzzles yet. Do not claim otherwise.

## Sequences to implement

| Sequence | Target micro-puzzles | Mechanics | Minimum real validator |
|---|---:|---|---|
| See the Space | 5 | numeric,choice | euclidean/squared distances |
| Choose Initial Centers | 5 | parameters,choice | validate center count and coordinates |
| Assign Points | 6 | sort,connect,numeric | nearest-center deterministic ties |
| Update Centroids | 6 | numeric,order | arithmetic mean per cluster |
| Iterate to Convergence | 6 | trace,parameters | k-means trace and convergence |
| Clustering Checkpoint | 2 | parameters,trace,numeric | run complete clustering, inertia and silhouette checks |

## Educational outcomes & advanced branches

- **See the Space:** Understand 2D data and Euclidean distance. *Advanced branch:* Tie between nearest centroids.
- **Choose Initial Centers:** Place valid initial centroids. *Advanced branch:* Bad initialization.
- **Assign Points:** Assign each point to the nearest center. *Advanced branch:* Voronoi boundary.
- **Update Centroids:** Recompute cluster centers from assignments. *Advanced branch:* Empty clusters.
- **Iterate to Convergence:** Execute and inspect Lloyd iterations. *Advanced branch:* Local optima.
- **Clustering Checkpoint:** Group a dataset and evaluate the result. *Advanced branch:* Compare different K values.

## Acceptance criteria

1. Puzzle mechanics must use the shared engine and declare stable `wNN-*` IDs, sequence names matching the manifest, learning objectives, and hints without answer leaks.
2. Any numeric/model outcome must be validated from a real implementation, not a narrative claim or random guess. Use shared deterministic fixtures and seeded variants.
3. Sequence order should be Discover → Explain → Apply, with connected evolving workspaces when useful and independent transfer puzzles.
4. Add unit tests for correct/incorrect answers, all procedural seeds, edge cases, XP once, skip-to-solved mastery, and inaccessible future chapters.
5. Do not mark this week playable until all its required puzzles are independently verifiable and the entire sequence has been tested on a phone-sized viewport.
6. Keep the curriculum fixed; no server dependency, mandatory timer, leaderboard, or generative-AI grading.
