import type { WeekContent, Puzzle } from '../core/types';
import { bigramModel, nextBigram, predictID3, trainID3 } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 14, domain: 'ML Engineering' as const };

// Real deterministic computations for Week 14 testing & performance puzzles
const id3Rows = [
  { features: { size: 'small', speed: 'fast' }, label: 'pass' },
  { features: { size: 'small', speed: 'slow' }, label: 'pass' },
  { features: { size: 'large', speed: 'fast' }, label: 'pass' },
  { features: { size: 'large', speed: 'slow' }, label: 'fail' },
];
const id3Tree = trainID3(id3Rows, ['size', 'speed']);
const unseenPred = predictID3(id3Tree, { size: 'medium', speed: 'fast' }); // fallback 'pass'

const bgModel = bigramModel(['ok go', 'ok stop', 'ok go']);
const nextAfterOk = nextBigram(bgModel, 'ok'); // 'go' (2/3 vs 1/3)

// Complexity calculation: kNN brute-force distance checks for N=200 samples, D=5 features = 1000 ops
const knnOps = 200 * 5; // 1000

const puzzles: Puzzle[] = [
  // ── Sequence 1: Test the Application ───────────────────────────────────────
  {
    ...basic,
    id: 'w14-01',
    sequence: 'Test the Application',
    title: 'ID3 Fallback Edge Case',
    instruction: 'An ID3 tree trained on {small, large} receives unseen `size: "medium"`. What does `predictID3()` return using its majority fallback?',
    kind: 'choice',
    concept: 'Edge-case test assertion',
    options: [
      { id: 'pass', title: 'pass (majority class fallback)' },
      { id: 'fail', title: 'fail' },
      { id: 'crash', title: 'Throws KeyError' },
    ],
    correctChoice: unseenPred,
    hint: '3 of 4 training rows are "pass", so the node fallback is the majority label.',
    discovery: {
      title: 'Test unseen categories explicitly',
      intuition: 'Real users will always enter categories your training set never saw. Testing fallback paths ensures graceful behaviour.',
      example: 'predictID3 falls back to node.fallback ("pass") when a branch key is missing.',
      technical: 'Defensive tree traversal avoids KeyError/undefined crashes on out-of-vocabulary categorical values.',
    },
  },
  {
    ...basic,
    id: 'w14-02',
    sequence: 'Test the Application',
    title: 'Bigram Tie-Breaking Check',
    instruction: 'Given sentences ["ok go", "ok stop", "ok go"], what token does `nextBigram(model, "ok")` return?',
    kind: 'choice',
    concept: 'Deterministic model oracle',
    options: [
      { id: 'go', title: 'go' },
      { id: 'stop', title: 'stop' },
      { id: 'null', title: 'null' },
    ],
    correctChoice: nextAfterOk ?? 'go',
    hint: '"go" follows "ok" twice out of three occurrences.',
  },
  {
    ...basic,
    id: 'w14-03',
    sequence: 'Test the Application',
    title: 'Trace Property-Based Test',
    instruction: 'Trace the steps of a property-based test verifying that Euclidean distance is always symmetric: d(a, b) == d(b, a).',
    kind: 'trace',
    concept: 'Property-based testing',
    correctTrace: ['generate_pair_a_b', 'compute_d_ab', 'compute_d_ba', 'assert_equal_within_eps'],
    hint: 'Generate inputs, compute both directions, and assert symmetry.',
  },

  // ── Sequence 2: Find Failure Modes ─────────────────────────────────────────
  {
    ...basic,
    id: 'w14-04',
    sequence: 'Find Failure Modes',
    title: 'Trace Corrupted Input Failure',
    instruction: 'Trace what happens when a corrupted CSV row with `NaN` enters an unguarded kNN distance loop.',
    kind: 'trace',
    concept: 'Failure mode propagation',
    correctTrace: ['read_nan_feature', 'squared_diff_nan', 'distance_becomes_nan', 'sort_order_corrupted'],
    hint: 'NaN in input poisons arithmetic, turning distances to NaN and breaking neighbor sorting.',
  },
  {
    ...basic,
    id: 'w14-05',
    sequence: 'Find Failure Modes',
    title: 'Repair Empty-Input Crash',
    instruction: 'Calling `trainThreshold([])` throws an error when a user uploads an empty file. Select the best UX + engine repair.',
    kind: 'repair',
    concept: 'Graceful failure handling',
    options: [
      { id: 'guard_ui', title: 'Check rows.length > 0 before training and show an actionable empty-file error' },
      { id: 'fake_row', title: 'Silently insert a fake row {temperature: 0, label: 0}' },
      { id: 'ignore', title: 'Leave the crash unhandled' },
    ],
    correctChoice: 'guard_ui',
    hint: 'Never fabricate training data; reject empty inputs cleanly with a clear message.',
    discovery: {
      title: 'Fail loudly with clarity, never silently with fake data',
      intuition: 'Inventing dummy records to avoid a crash corrupts model predictions. Rejecting invalid inputs early protects accuracy.',
      example: 'Show "Dataset needs at least 1 labelled row" when rows.length === 0.',
      technical: 'Precondition checks at the UI boundary prevent downstream invariant violations.',
    },
  },
  {
    ...basic,
    id: 'w14-06',
    sequence: 'Find Failure Modes',
    title: 'Diagnose Silent Drift',
    instruction: 'Your temperature classifier was trained in Celsius (15–25°C), but a new sensor sends Fahrenheit (60–80°F). What happens?',
    kind: 'choice',
    concept: 'Unit / distribution shift',
    options: [
      { id: 'all_off', title: 'Every reading is > 20, so the model predicts OFF 100% of the time' },
      { id: 'auto_convert', title: 'The threshold automatically converts to Fahrenheit' },
      { id: 'crash', title: 'predictThreshold throws a TypeError' },
    ],
    correctChoice: 'all_off',
    hint: 'A threshold of 20 treats 68°F as above 20, even though 68°F is 20°C.',
  },

  // ── Sequence 3: Improve Performance ────────────────────────────────────────
  {
    ...basic,
    id: 'w14-07',
    sequence: 'Improve Performance',
    title: 'Count kNN Operations',
    instruction: 'Brute-force kNN computes squaredDistance across N = 200 samples, each with D = 5 features. How many (x − b)² term operations occur per query?',
    kind: 'numeric',
    concept: 'Computational complexity O(N·D)',
    numeric: { expected: knnOps, tolerance: 0, unit: 'ops' },
    hint: 'Multiply number of samples N by number of features D.',
    discovery: {
      title: 'Measure before optimizing',
      intuition: 'Knowing how operation counts scale with N (samples) and D (features) tells you where bottlenecks actually live.',
      example: '200 samples × 5 features = 1,000 arithmetic terms per query—fast in JS, but 1,000,000 × 100 would need indexing or caching.',
      technical: 'Exact kNN query complexity is O(N·D) for distance computation plus O(N log N) or O(N log k) for neighbor selection.',
    },
  },
  {
    ...basic,
    id: 'w14-08',
    sequence: 'Improve Performance',
    title: 'Tune Batch Cache Size',
    instruction: 'To keep UI frame time under 16 ms while scoring 1,000 points, set the worker chunk size to 250 items per frame.',
    kind: 'parameters',
    concept: 'Chunked execution budget',
    parameterGoal: { key: 'chunk_size', min: 50, max: 500, target: 250, tolerance: 10 },
    hint: 'Set chunk_size to 250.',
  },
  {
    ...basic,
    id: 'w14-09',
    sequence: 'Improve Performance',
    title: 'Avoid Redundant Retraining',
    instruction: 'A user drags a test-point slider to preview predictions. Training data has not changed. What optimization keeps the UI instant?',
    kind: 'choice',
    concept: 'Memoization / caching trained state',
    options: [
      { id: 'cache', title: 'Memoize the trained model and only re-run predict() on slider move' },
      { id: 'retrain', title: 'Retrain ID3 from scratch on every pixel of slider movement' },
      { id: 'throttle_off', title: 'Disable prediction updates until page reload' },
    ],
    correctChoice: 'cache',
    hint: 'Prediction is O(depth) or O(1), whereas retraining scales with dataset size.',
  },

  // ── Sequence 4: Make It Robust ─────────────────────────────────────────────
  {
    ...basic,
    id: 'w14-10',
    sequence: 'Make It Robust',
    title: 'Classify Safety Invariants',
    instruction: 'Sort each check into Input Validation (before model runs) or Output Guard (after model runs).',
    kind: 'sort',
    concept: 'Defense in depth',
    items: [
      { id: 'finite', title: 'Reject NaN / Infinity inputs' },
      { id: 'schema', title: 'Verify required feature columns exist' },
      { id: 'prob_sum', title: 'Assert predicted probabilities sum to 1' },
      { id: 'fallback', title: 'Provide safe default when confidence < threshold' },
    ],
    buckets: [
      { id: 'input', title: 'Input Validation' },
      { id: 'output', title: 'Output Guard' },
    ],
    correctAssignments: {
      finite: 'input',
      schema: 'input',
      prob_sum: 'output',
      fallback: 'output',
    },
    hint: 'Input validation inspects incoming data; output guards verify model predictions before acting.',
  },
  {
    ...basic,
    id: 'w14-11',
    sequence: 'Make It Robust',
    title: 'Wire Fallback Safety Net',
    instruction: 'Connect the robustness layers so an invalid or low-confidence prediction never triggers an unsafe action.',
    kind: 'connect',
    concept: 'Safety fallback architecture',
    correctConnections: [
      ['raw_input', 'schema_guard'],
      ['schema_guard', 'model_predict'],
      ['model_predict', 'confidence_check'],
      ['confidence_check', 'safe_fallback'],
    ],
    hint: 'Input → schema guard → model → confidence check → safe fallback.',
  },
  {
    ...basic,
    id: 'w14-12',
    sequence: 'Make It Robust',
    title: 'Adversarial Duplicate Check',
    instruction: 'What happens to kNN (k=3) if an attacker injects 5 identical copies of a mislabelled point right next to a query?',
    kind: 'choice',
    concept: 'Adversarial data sensitivity',
    options: [
      { id: 'flip', title: 'The 3 nearest neighbors are all duplicates, flipping the majority vote' },
      { id: 'ignore', title: 'kNN automatically deduplicates identical points' },
      { id: 'average', title: 'kNN averages the labels into 0.5' },
    ],
    correctChoice: 'flip',
    hint: 'Standard kNN counts each training row as a separate vote.',
  },

  // ── Sequence 5: Release Readiness ──────────────────────────────────────────
  {
    ...basic,
    id: 'w14-13',
    sequence: 'Release Readiness',
    title: 'Order Pre-Release Gates',
    instruction: 'Arrange the CI and acceptance gates in order before tagging a release.',
    kind: 'order',
    concept: 'Release checklist',
    steps: [
      { id: 'typecheck', title: 'TypeScript compile & lint check' },
      { id: 'unit', title: 'Run deterministic unit & math tests' },
      { id: 'integration', title: 'Run end-to-end integration tests' },
      { id: 'build', title: 'Verify production bundle builds cleanly' },
    ],
    correctOrder: ['typecheck', 'unit', 'integration', 'build'],
    hint: 'Fast static checks first, then unit tests, integration tests, and final bundle build.',
  },
  {
    ...basic,
    id: 'w14-14',
    sequence: 'Release Readiness',
    title: 'Trace CI Gate Failure',
    instruction: 'Trace what happens when a pull request introduces a regression caught by CI.',
    kind: 'trace',
    concept: 'Continuous integration gate',
    correctTrace: ['push_pr', 'ci_runs_tests', 'assertion_fails', 'merge_blocked', 'author_fixes'],
    hint: 'Push PR → CI runs → test fails → merge blocked → author fixes.',
  },
  {
    ...basic,
    id: 'w14-15',
    sequence: 'Release Readiness',
    title: 'Evidence Required for Release',
    instruction: 'Select all evidence items that must be green before shipping your FIICode app.',
    kind: 'multi',
    concept: 'Release readiness criteria',
    options: [
      { id: 'tests_pass', title: 'All unit & integration tests pass with 0 skips' },
      { id: 'edge_cases', title: 'Empty, NaN, and unseen-category edge cases handled' },
      { id: 'perf_ok', title: 'Latency & memory stay within target budget' },
      { id: 'hope', title: 'Works on author’s machine without tests' },
    ],
    correctChoices: ['tests_pass', 'edge_cases', 'perf_ok'],
    hint: 'Objective automated checks and verified edge-case handling are required.',
  },

  // ── Sequence 6: Quality Checkpoint ─────────────────────────────────────────
  {
    ...basic,
    id: 'w14-16',
    sequence: 'Quality Checkpoint',
    title: 'Wire Quality Verification Loop',
    instruction: 'Connect the quality assurance pipeline from test fixtures to release approval.',
    kind: 'connect',
    concept: 'Multi-objective QA pipeline',
    correctConnections: [
      ['test_fixtures', 'correctness_suite'],
      ['correctness_suite', 'latency_benchmark'],
      ['latency_benchmark', 'release_gate'],
    ],
    hint: 'Fixtures → correctness tests → performance benchmark → release gate.',
  },
  {
    ...basic,
    id: 'w14-17',
    sequence: 'Quality Checkpoint',
    title: 'Checkpoint: Full QA Scenario',
    instruction: 'Trace the complete quality verification sequence on a release candidate.',
    kind: 'trace',
    concept: 'End-to-end quality verification',
    correctTrace: ['freeze_rc', 'run_unit_suite', 'test_corrupted_inputs', 'verify_latency_budget', 'approve_release'],
    hint: 'Freeze candidate → unit suite → corrupted inputs → latency budget → approve.',
    isCheckpoint: true,
    discovery: {
      title: 'Quality is multi-objective',
      intuition: 'A great ML app is not just accurate on clean data—it is also fast, resilient to bad inputs, and verified by automated gates.',
      example: 'Accuracy + edge-case safety + latency budget = release-ready software.',
      technical: 'Automated CI gates enforce correctness, robustness, and performance invariants simultaneously.',
    },
  },
  {
    ...basic,
    id: 'w14-18',
    sequence: 'Find Failure Modes',
    title: 'Metamorphic Testing',
    instruction: 'You do not know the exact ground truth for a new query, so you duplicate every training point twice and verify `knnClassify` gives the same label. What technique is this?',
    kind: 'choice',
    concept: 'Metamorphic testing',
    advanced: true,
    unlockAfter: ['w14-17'],
    options: [
      { id: 'meta', title: 'Metamorphic testing (checking invariance under input transformation)' },
      { id: 'overfit', title: 'Overfitting the test set' },
      { id: 'leakage', title: 'Data leakage' },
    ],
    correctChoice: 'meta',
    hint: 'Checking how outputs relate across transformed inputs without needing an external oracle.',
  },
];

export const week14: WeekContent = {
  number: 14,
  module: 3,
  title: 'FIICode III: Improving and Testing',
  summary: 'Validate, improve and evaluate the application.',
  topics: ['Testing', 'Optimization', 'Reliability'],
  visual: 'systems',
  status: 'vertical-slice',
  sequences: [
    sequenceContract('w14-s01', 'Test the Application', 'Design reproducible edge-case tests', ['choice', 'trace'], 'assertions on actual algorithm results', 5, 'Property-based variants'),
    sequenceContract('w14-s02', 'Find Failure Modes', 'Trace corrupted data and boundary behavior', ['trace', 'repair'], 'error diagnostics', 6, 'Metamorphic test'),
    sequenceContract('w14-s03', 'Improve Performance', 'Measure and optimize algorithm work', ['numeric', 'parameters'], 'operation counts and computational complexity', 5, 'Memory bound'),
    sequenceContract('w14-s04', 'Make It Robust', 'Validate inputs and fallback behaviors', ['sort', 'connect'], 'safety invariant checks', 5, 'Deliberately adversarial data'),
    sequenceContract('w14-s05', 'Release Readiness', 'Check integration and evaluation evidence', ['order', 'trace'], 'CI/acceptance gates', 5, 'Minimal reproducible failure'),
    sequenceContract('w14-s06', 'Quality Checkpoint', 'Pass full test suite on a scenario', ['connect', 'trace'], 'multi-objective verification', 2, 'Pareto optimization'),
  ],
  puzzles,
};
