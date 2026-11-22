# ML Club Companion — Development Scaffold / Vertical Slice

A **mobile-first, local-first puzzle academy** for machine learning, built with React, TypeScript and Vite. It follows the 15-week curriculum at https://machinelearning-club.github.io/.

> **Status:** Development prototype, not a finished 15-week game. The first 16 Week 1 core puzzles and one optional advanced puzzle are interactive; 14 further week packs are present as independently editable, typed development slots. Do **not** publish as curriculum-complete.

## Run

Requires Node.js 20.19+ (Node 22 LTS recommended) and npm.

```sh
npm install
npm run dev
npm run test
npm run build
npm run preview
```

Open the local address printed by Vite. Installability and offline service-worker behavior should be tested using the **production build** on localhost or HTTPS, ideally in multiple browsers. `npm run dev` does not prove the PWA can run offline.

No backend, API keys, cloud account or login is needed. This repository is **not** the Machine Learning Club course website; it is the companion app.

## Implemented now

- Dark geometric neon visual design, mobile-first navigation and accessible controls.
- **Immediate Play**: first install begins with the first real puzzle; subsequent interrupted sessions restore their active puzzle.
- **Academy**: 15 sourced week manifests, module grouping, chapter previews, locked future content, 16 playable Week 1 core puzzles and one optional advanced problem.
- **Real puzzle logic**: interactive classification, ordered pipelines, supervised labels, threshold training by empirical risk minimisation, unseen predictions and correction using new evidence, probability, conditional probability, Bayes and expectation. Core K-Means and entropy operations also exist for future weeks.
- **Progression**: solve / skip distinction; hints cost 1 credit, skips 2; 6-credit cap, +2 credits/12 hours; one-time XP; simple concept mastery metric; explicit discovery/explanation pauses and auto advance for simpler puzzles.
- **Adaptive assistance (early prototype)**: after repeated invalid attempts, a free, dismissible mini-exercise preserves the original workspace. Needs more targeted authored diagnostics.
- **Knowledge Atlas**: notebook, early concept graph, discovered concepts vs preview nodes, three-level explanations, XP category levels, unlocked discovery journal.
- **Challenges**: deterministic UTC daily foundations question bank and one-time rewards. Weekly 10–15 minute challenges are **not implemented**. No leaderboard or online gallery.
- **Laboratory**: persistent named threshold-classifier projects, editable datasets, real retraining, predicted output, duplicate/rename/delete, export/import `.mlclub`. Copies of eligible Week 1 Academy model workspaces preserve the learned labelled dataset. Other laboratory algorithms are planned.
- **File-based persistence**: primary browser OPFS via JSON files, with a prior-version recovery file for the learning profile; exported `.mlclub` projects and `.mlprofile` full-profile backups are versioned JSON. Compatibility fallback uses localStorage if OPFS is unavailable; final fallback is volatile and explicitly warned.
- **Guest Open Demo**: isolated temporary profile, unlocked **authored** puzzle content and previews for all 15 chapters. Later chapters are not pretended to be playable.
- PWA manifest, generated icons, service worker precaching and reduced-motion preference.

## Repository layout

```text
src/
  core/
    algorithms.ts            Offline learning / math algorithms
    progression.ts           Validators, XP, skips, credits, mastery
    types.ts                 Versioned shared model contracts
  content/
    week01.ts                Actual Week 1 authored puzzle pack
    registry.ts              Registry and integrity checks
  weeks/
    week02.ts ... week15.ts  Parallel independent content work packages
  storage/
    files.ts                 OPFS, fallbacks, import/export, projects
  components/
    Academy.tsx              Hybrid map / Chapter Preview
    PuzzlePlayer.tsx         Generic puzzle player
    Laboratory.tsx           Project Library / sandbox
    Atlas.tsx                Hybrid Knowledge Atlas
    Challenges.tsx           Shared daily challenge prototype
  App.tsx                    Navigation, mode isolation, session state
  styles.css                 Responsive dark geometric design
public/                      PWA icons
scripts/                     Test helper
tests/                       Node built-in unit tests for core

docs/                        Implementation task / acceptance criteria
```

## Content workflow: all 15 weeks in parallel

`src/content/week01.ts` is the reference for the typed content contract. `src/weeks/week02.ts` through `week15.ts` are **not empty navigation hacks**: each specifies the exact curriculum name, module, objectives and authoring slot. Contributors can work on separate week files concurrently. Only change `status` to `vertical-slice` after the week contains validated, playable puzzles; do not silently claim a complete week. Core engine work can be shared across teams.

Reference curricula: https://machinelearning-club.github.io/, including Week 1 at https://machinelearning-club.github.io/w1/course/ and laboratory at https://machinelearning-club.github.io/w1/lab/.

## Storage and data semantics

- **OPFS** stores named local JSON files inside the PWA origin, not arbitrary files in the user's Downloads/Documents folder. Users can export explicit files.
- `.mlclub`: currently a single versioned JSON document, **not a compressed ZIP archive**. A future format revision may introduce ZIP packaging, but should remain backward-compatible.
- `.mlprofile`: versioned JSON backup of the entire persistent profile + laboratory projects.
- Autosave is asynchronous with short debounce; the learning profile retains a previous-file recovery copy. This is an initial persistence strategy, not full transactional crash recovery.
- Never automatically run imported code; the current project format is pure data. Import is validated and receives a new project ID.
- Guest sessions remain in memory and are never added to the persistent main profile.
- Cloud sync and Community Solution Gallery are explicitly deferred. Do not use authentication, user analytics or tracking APIs in this slice.
- `npm install` should create a committed `package-lock.json` before CI and deployment. The lockfile is not included because the package registry was unavailable in the development environment.

## Honest limits / next work

1. **Not a full week:** more Week 1 content and checkpoints are required to reflect the complete probability/distributions coverage and original 15-week design. The existing 16 puzzles form a vertical slice, not the planned hundreds of puzzles.
2. **Other weeks:** Weeks 2–15 have accurate manifests and independent files, but no playable content yet. The selection `all 15 in parallel` means authoring tracks can proceed concurrently, not that unimplemented chapters are represented as finished.
3. **Shared challenges:** only one daily Foundations track works; weekly and other curriculum-level tracks require new genuine authored validators.
4. **Progress semantics:** the current simple mastery indicator counts solved concepts. Evolve it to evidence-based independent objectives and alternative verification.
5. **Python WASM:** intentionally deferred; the currently used models are executed locally in TypeScript. Integrate a browser Python runtime only if a later puzzle genuinely needs real Python and budget permits offline caching.
6. **Testing:** core TypeScript compiled and Node unit tests passed in this environment. npm registry access was unavailable, so a full `npm install`, browser run, React typecheck and production PWA build could **not** be executed here. Run the commands above before calling the UI build verified.
7. **Browser QA:** validate native pointer drag, accessibility focus order, reduced motion, installation and OPFS persistence on Android Chrome, iOS Safari and desktop Chromium/Firefox. Touch drag should always have the tap-target alternative.

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for parallel milestones and acceptance criteria.

## Foundational engine milestone (2026-11-22)

The 15 week manifests now include **86 detailed, independent sequence plans** with **409 target micro-puzzle slots**. These are an authoring backlog, not implemented playable content. See [`docs/lessons/`](docs/lessons/) and [`docs/GEMINI_HANDOFF.md`](docs/GEMINI_HANDOFF.md) to parallelize writing lessons without editing shared engine code.

`src/core/simulations.ts` contains actual offline kernels for squared/Euclidean distance, KNN, full K-Means Lloyd iteration traces, categorical ID3 with entropy/information gain, perceptron training, image convolution, dense neural layer forward passes, MSE, and a toy bigram model. `src/core/validation.ts` validates nine puzzle mechanics declaratively; Week 1 retains specialized learning-from-examples validators. `src/core/session.ts` provides immutable undo/redo snapshots and adaptive assistance triggers; `src/content/generation.ts` generates reproducible valid math practice questions from fixed seeds. `src/content/authoring.ts` validates authoring contracts before a week can be called playable.

The UI now exposes numeric, multi-select, graph connections, parameter sliders and trace puzzle controls in addition to previous modes, and Laboratory includes a real K-Means workspace with Run/Step/Reset and measured inertia. Limitations remain: a visual node editor and safe Python WASM interpreter, advanced per-concept adaptive diagnostics, comprehensive weekly challenge tracks, automatic profile conflict resolution, and the bulk of 15-week authored puzzle content are not complete.

Tests: `npm run test` (core without React), `npm run build` (full UI/PWA), and CI in `.github/workflows/ci.yml`. The project is under active development; *do not represent all 15 lesson targets as playable*. Most lesson packs remain `planned` until authoring and test verification.
