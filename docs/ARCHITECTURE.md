# Architecture & invariants

**UI** React + TypeScript + Vite. PWA service worker caches application shell and packaged lesson assets. No backend in MVP.

**Engine** Pure deterministic TypeScript. `core/validation` validates declarative mechanics. `core/progression` handles contextual Week 1 and progress semantics. `core/simulations` implements real algorithms. `core/session` models immutable action history, undo/redo and retry assistance. `content/generation` uses seed-driven testable templates. Individual week manifests own curriculum content only.

**Persistence** One main profile, main JSON/backup in OPFS (file-oriented storage). Project files in separate OPFS directory. Exports `.mlclub` and `.mlprofile` are currently versioned JSON, not ZIP; import treats untrusted input as data only. Only a compatibility fallback uses localStorage, with a warning. Guest sessions are isolated in memory.

**Progression invariants**: `solved` confers mastery and one-time XP; `skipped` unlocks the next puzzle without awarding XP/mastery. A skipped puzzle can later become `solved` (non-lossy upgrade). Future weeks are not considered complete unless their authored, verified puzzle requirements are completed or skipped. Reward IDs are stable and deduplicated. XP levels and per-concept mastery are independent; a chapter preview does not run locked content. No compulsory clock.

**Content validity**: unique week and puzzle IDs, no fake questions that cannot be solved, seeded variants produce mathematically correct results, no untested AI-generated answer keys. Each activity must have purpose, accepted/incorrect case fixtures, deterministic mathematical validator and meaningful feedback. Complex solutions need non-trivial score comparability.

**Extension protocol**: To add a mechanic, first extend `PuzzleKind`, `PuzzleAnswer`, spec validation and runtime evaluation, add the tactile accessible PuzzlePlayer rendering, then create positive/negative tests and deterministic generator fixtures. Only then author an entire lesson using the mechanic.

**Visual**: evolving geometric identity, dark navy with cyan/violet, Hybrid Academy Map, portrait-first with reduced motion, touch and keyboard alternatives, contextual learning explanations with three layers. Generated image mockups are references, not hard-coded screenshots.

**Scope boundary**: Future cloud sync and online Solution Gallery are architectural roadmaps, not shipping features. Never introduce user accounts, trackers, public community contributions or a server dependency into the local MVP.
