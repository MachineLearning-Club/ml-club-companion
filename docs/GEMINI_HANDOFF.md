# Gemini / Antigravity handoff: lesson implementation

## Mission

Turn the 15-week scaffold into a genuinely playable, offline-first ML puzzle academy. **Do not replace the core engine or redesign the application architecture before demonstrating that the existing contracts cannot represent the requested mechanic.** Follow the source course at https://machinelearning-club.github.io/; keep the published week order intact.

## Already built

- React 19 / Vite / TypeScript PWA (mobile-first, English first, Romanian-ready).
- Week 1 runnable vertical slice (16 ordinary micro-puzzles + 1 optional advanced challenge).
- Shared math kernels: entropy/probabilities, threshold ERM, categorical ID3, K-Means with iteration traces, KNN, perceptron, 2D convolution, dense feedforward and a toy bigram generator.
- A generic puzzle contract supporting `sort`, `choice`, `order`, `train`, `predict`, `repair`, `numeric`, `multi`, `connect`, `parameters`, `trace`.
- Generic answer evaluation, structured error reporting, undo/redo session helpers, reproducible seeded practice questions.
- 15 separate week manifests with 86 authored sequence briefs and 409 target puzzle slots. These are **targets, not fabricated playable puzzles**.
- OPFS profile / project persistence, backup, restore, Guest Mode isolation and basic K-Means / threshold labs.

## Parallel tasks (one owner per week)

Assign one agent to each of `docs/lessons/weekNN.md` and `src/weeks/weekNN.ts` (Week 1 is `src/content/week01.ts`). Never edit someone else's week file. Separate engine PRs must remain compatible and receive test coverage.

Each week task should:
1. Read the corresponding source curriculum and its `docs/lessons/weekNN.md`.
2. Author short varied puzzle sequences, not a quiz disguised as a game. Build Discover → Explain → Apply and evolving workspaces.
3. Use the existing mechanics, or propose a narrow, generic extension with tests if truly necessary.
4. Implement genuine offline validation for each required problem. Give concrete answer acceptance/rejection tests and edge-case tests.
5. Keep advanced puzzles optional; hints are 1 credit, skips 2, replenishment 2/12h up to 6; never gate progress on mastery.
6. Add deterministic verified variants for daily/weekly challenges where useful; do not assume remote services.
7. Confirm layout on touch/keyboard, reduced motion, small portrait screens, no mandatory timer.
8. Only set manifest status `vertical-slice` after puzzles are actually runnable and tested.

## Source of truth and checks

Run `npm ci && npm run test && npm run build` for every PR. Do not mark a week complete if only its planned sequence descriptors exist. Do not show an online Community Gallery as functional in the offline MVP.

## Integration cadence

Wave A (Weeks 2–5): ID3/K-Means/Revision/Vision; Wave B (Weeks 6–10): Perceptron/Networks/Revision/Midterm/Generative AI; Wave C (Weeks 11–15): Engineering and four FIICode sessions. Lessons may be *authored concurrently*, but merge through CI with shared engine stability. Review actual computations, generated test seeds and pedagogical progression rather than screenshots alone.

## Critical safeguards

Never execute arbitrary imported project code. Use pure data project formats; Python WASM is an optional later extension behind an explicit sandbox. No forced login, no ads, no hidden remote grading, no competitive leaderboard. Preserve the local file-based OPFS source of truth and portable export. Account/cloud/community capabilities are deferred.
