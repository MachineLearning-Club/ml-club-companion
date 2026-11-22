# Implementation plan — parallel, bounded milestones

## Product constraints (ratified)

1. Progressive Knowledge Atlas, Chapter Previews, visual identity evolving from geometry to networks and pipelines.
2. Mobile-first installable PWA; React + TypeScript + Vite; initial English, i18n-ready for Romanian.
3. Real offline algorithms; optional Python in WASM later only where required.
4. **All 15 weeks in parallel** as independent content work packages, with incremental functional checkpoints. Never confuse scaffolding with completion.
5. Primary storage as local browser OPFS files. Portable project and profile backup exports. Future optional sync of full profile, without login in MVP.
6. Accessible controls, reduced motion, no compulsory timers. Tap alternatives to touch drag.
7. Offline-first, no account, cloud sync or community backend in first version.
8. Hybrid Map, Evolving Puzzle Sequences, optional advanced puzzles, contextual adaptive assistance, separate progression/mastery, automatic/explicit Hybrid Flow.
9. Shared daily and weekly challenges, no leaderboards; future optional Solution Gallery. Numerical domain levels. Secret discoveries.
10. Hybrid Laboratory with Project Library; single persistent local profile and isolated Open Demo Guest sessions; contextual resume; Layered Explanations.

## Development tracks

**Track A — engine, validators (shared core)**
- Algorithm interfaces, deterministic execution, numerical correctness, result replay and validation.
- Puzzle primitives: sort/classify, classify data, slider, graph, pipeline, code blocks, visual models, step-through execution.
- Replayable state transitions and adaptive diagnostic hints that genuinely assess misconceptions.
- Keep `src/core` independent of UI framework.

**Track B — content Weeks 1–3**
- Complete Week 1 including probability sample spaces, Bayes, distributions and expectation, a meaningful final Mystery Machine checkpoint and advanced discoveries.
- Week 2 ID3: authored datasets, categorical splits, entropy, information gain and decision-tree comparison.
- Week 3 K-Means: distance, centroids, iterative updates, convergence, initialisation, and alternative challenge.

**Track C — content Weeks 4–9**
- Revision, image pixels/filtering, perceptron, linear separability, multilayer networks, training and midterm capstone.
- Reuse engine math, do not implement fake classifiers where a real algorithm is expected.

**Track D — content Weeks 10–15**
- Generative AI with explicit toy-model limitations, tokens/prediction, software-engineering workflows and a persistent FIICode project across Weeks 12–15.
- Provide real validation and visible limitations; avoid fabricated model behavior.

**Track E — UX / persistence / offline / QA**
- Expand graph layouts and transition animations with reduced-motion support.
- Proper solution/replay storage, undo/redo, versioned crash-safe saves, package format hardening.
- Shared challenge recurrence, curriculum-level compatibility and future backend-neutral solution format.
- Test screen-reader navigation, pointer events, phone viewport, browser storage quota, import security and PWA offline updates.

## Milestone gates

### Gate 1: Runnable first vertical slice
- `npm install`, `npm run test`, `npm run build` successful.
- First launch immediately opens playable Week 1 puzzle.
- At least one authentic train/test/correct model sequence and foundational probability exercise.
- XP awarded once, skip does not claim mastery, no forced timer.
- Interrupted session restored; file-based OPFS save persists after browser restart.
- Guest session never mutates persistent profile.
- Full manual project and profile export/import work.

### Gate 2: Complete Module I
- Weeks 1–3 all playable, reviewed against website and pedagogical sequence.
- ID3 entropy and K-Means validators tested on exact reference fixtures.
- Optional advanced challenges, adaptive prerequisite puzzles and contextual explanations supported.

### Gate 3: Complete Module II
- Weeks 4–9 all playable with tested computations and checkpoints.
- Domain mastery independent of progress and skip, includes alternate verification.
- Portrait and landscape workspaces usable; import/replay survives app upgrades.

### Gate 4: Complete Module III + release
- Weeks 10–15 all playable, including persistent multi-objective FIICode capstone.
- Shared daily/weekly challenges fully seeded and repeatable without backend.
- PWA install, offline reload, mobile accessibility and storage QA passed.
- All 15 weeks content-audited, no unverified placeholders in user-visible complete curriculum.

## Agent / contributor authoring contract

For each content pack:
1. Read the official weekly course, lab, homework, advanced and quiz resources. Record the exact learning objectives.
2. Create 3–6-puzzle evolving sequences. Introduce one conceptual change per short puzzle; add transfer puzzles, a checkpoint, and occasional multi-objective capstone.
3. Every procedural variant has a seed, valid parameter range, mathematically grounded validator and reference solution. Avoid invariant-breaking random inputs.
4. Mark curriculum status `planned` until runnable UI and tests exist. Do not reuse validators to silently declare a different lesson completed.
5. Include accessible touch + keyboard alternatives, no required speed, and contextual layered explanations.
6. Add deterministic unit tests for key math/logic, mistake cases, and skipped/alternative solution behavior.
7. Do not create backend-dependent mechanics or claim online features work before they are implemented.
8. Prefer small, independently reviewed PRs per week; minimize conflicts by using typed shared contracts rather than editing the monolithic App for every puzzle.

## Final product quality target

A geometric, selectively neon puzzle game with compelling interactions, accurate computational learning, smooth progression, real experimentation and robust offline behavior — not an LMS wrapper or a slide deck with multiple-choice questions.
