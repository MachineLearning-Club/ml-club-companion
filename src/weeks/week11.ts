import type { WeekContent, Puzzle } from '../core/types';
import { trainThreshold } from '../core/algorithms';
import { knnClassify, meanSquaredError, squaredDistance } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 11, domain: 'ML Engineering' as const };

// Real deterministic computations for Week 11 test & pipeline puzzles
const tempSamples = [
  { temperature: 16, label: 1 as const },
  { temperature: 18, label: 1 as const },
  { temperature: 22, label: 0 as const },
  { temperature: 24, label: 0 as const },
];
const fittedThreshold = trainThreshold(tempSamples); // threshold = 20, accuracy = 1

const mseCase = meanSquaredError([2.0, 4.0], [1.0, 2.0]); // ((1)^2 + (2)^2)/2 = 2.5

const knnDataset = [
  { features: [1, 1], label: 'normal' },
  { features: [2, 1], label: 'normal' },
  { features: [8, 8], label: 'alert' },
  { features: [9, 8], label: 'alert' },
];
const queryDist = squaredDistance([3, 2], [2, 1]); // 1 + 1 = 2
const knnPred = knnClassify(knnDataset, [3, 2], 3); // 'normal'

const puzzles: Puzzle[] = [
  // ── Sequence 1: Think in Procedures ────────────────────────────────────────
  {
    ...basic,
    id: 'w11-01',
    sequence: 'Think in Procedures',
    title: 'Pure Function Structure',
    instruction: 'Order the blocks to form a pure Python prediction function that returns a label without mutating external state.',
    kind: 'order',
    concept: 'Pure functions & procedures',
    steps: [
      { id: 'def', title: 'def predict_temp(temp, threshold):' },
      { id: 'validate', title: 'if not math.isfinite(temp): raise ValueError()' },
      { id: 'compute', title: 'label = 1 if temp < threshold else 0' },
      { id: 'return', title: 'return label' },
    ],
    correctOrder: ['def', 'validate', 'compute', 'return'],
    hint: 'Signature first, then input guard, then computation, then return.',
    discovery: {
      title: 'Pure functions are predictable',
      intuition: 'A pure function depends only on its arguments and has no side effects, so calling it twice with the same inputs always yields the same output.',
      example: 'predict_temp(18, 20) always returns 1 without modifying any global list.',
      technical: 'Referential transparency makes unit testing, caching, and parallel execution straightforward.',
    },
  },
  {
    ...basic,
    id: 'w11-02',
    sequence: 'Think in Procedures',
    title: 'Trace a Helper Call',
    instruction: 'Trace the execution order when normalize_and_score([2, 4], 4) calls helper scale(x, max_v).',
    kind: 'trace',
    concept: 'Call stack execution trace',
    correctTrace: ['enter_normalize', 'call_scale_2', 'call_scale_4', 'compute_mean', 'return_0.75'],
    hint: 'Enter the outer function, evaluate scale on each element in order, then average.',
  },
  {
    ...basic,
    id: 'w11-03',
    sequence: 'Think in Procedures',
    title: 'Trace Pure Output',
    instruction: 'For query [3, 2] and nearest point [2, 1], compute the squared Euclidean distance returned by squaredDistance([3, 2], [2, 1]).',
    kind: 'numeric',
    concept: 'Deterministic procedure output',
    numeric: { expected: queryDist, tolerance: 0, unit: '' },
    hint: 'Compute (3 − 2)² + (2 − 1)².',
  },

  // ── Sequence 2: Organize Objects ───────────────────────────────────────────
  {
    ...basic,
    id: 'w11-04',
    sequence: 'Organize Objects',
    title: 'State vs Behaviour',
    instruction: 'Sort each member of a ThresholdClassifier class into stored state (attributes) or behaviour (methods).',
    kind: 'sort',
    concept: 'Object encapsulation',
    items: [
      { id: 'threshold', title: 'self.threshold' },
      { id: 'errors', title: 'self.training_errors' },
      { id: 'fit', title: 'fit(examples)' },
      { id: 'predict', title: 'predict(x)' },
    ],
    buckets: [
      { id: 'state', title: 'State (Attribute)' },
      { id: 'behaviour', title: 'Behaviour (Method)' },
    ],
    correctAssignments: {
      threshold: 'state',
      errors: 'state',
      fit: 'behaviour',
      predict: 'behaviour',
    },
    hint: 'Attributes hold data; methods are functions bound to the object.',
    discovery: {
      title: 'Objects bundle state and behaviour',
      intuition: 'Instead of passing loose threshold variables everywhere, a classifier object stores its learned parameters alongside fit() and predict().',
      example: 'clf = ThresholdClassifier(); clf.fit(data); clf.predict(21).',
      technical: 'Encapsulation enforces a clean contract: callers interact with public methods while internal state stays consistent.',
    },
  },
  {
    ...basic,
    id: 'w11-05',
    sequence: 'Organize Objects',
    title: 'Method Contract Flow',
    instruction: 'Connect each lifecycle stage of an ML model object to the method or property it produces.',
    kind: 'connect',
    concept: 'Object method contracts',
    correctConnections: [
      ['raw_examples', 'model.fit()'],
      ['model.fit()', 'learned_threshold'],
      ['new_reading', 'model.predict()'],
      ['model.predict()', 'predicted_label'],
    ],
    hint: 'Training data enters fit() to produce learned parameters; new readings enter predict() to produce labels.',
  },
  {
    ...basic,
    id: 'w11-06',
    sequence: 'Organize Objects',
    title: 'Why Composition Wins',
    instruction: 'You want a SensorMonitor that logs readings and runs a classifier. Which design avoids brittle inheritance?',
    kind: 'choice',
    concept: 'Composition over inheritance',
    options: [
      { id: 'compose', title: 'SensorMonitor holds a classifier instance', detail: 'Delegates prediction to self.model.predict()' },
      { id: 'inherit', title: 'SensorMonitor subclasses ThresholdClassifier', detail: 'Mixes sensor I/O into classifier internals' },
      { id: 'global', title: 'Use global variables shared by functions', detail: 'No object boundaries' },
    ],
    correctChoice: 'compose',
    hint: 'A monitor "has-a" classifier; it is not a specialised type of classifier.',
  },

  // ── Sequence 3: Test the System ────────────────────────────────────────────
  {
    ...basic,
    id: 'w11-07',
    sequence: 'Test the System',
    title: 'Verified Threshold Expectation',
    instruction: 'On examples (16°C→1, 18°C→1, 22°C→0, 24°C→0), what exact threshold does trainThreshold() learn?',
    kind: 'numeric',
    concept: 'Deterministic test oracle',
    numeric: { expected: fittedThreshold.threshold, tolerance: 0, unit: '°C' },
    hint: 'The midpoint between the highest ON example (18) and lowest OFF example (22).',
  },
  {
    ...basic,
    id: 'w11-08',
    sequence: 'Test the System',
    title: 'MSE Assertion Check',
    instruction: 'A unit test checks meanSquaredError([2.0, 4.0], [1.0, 2.0]). What exact value should assert.equal expect?',
    kind: 'numeric',
    concept: 'Numerical unit test',
    numeric: { expected: mseCase, tolerance: 0.01, unit: '' },
    hint: 'Average the squared differences: ((2−1)² + (4−2)²) / 2.',
  },
  {
    ...basic,
    id: 'w11-09',
    sequence: 'Test the System',
    title: 'Choose the Boundary Case',
    instruction: 'Which test input best catches an off-by-one bug in `temp < threshold` vs `temp <= threshold`?',
    kind: 'choice',
    concept: 'Boundary value testing',
    options: [
      { id: 'exact', title: 'temp == threshold', detail: 'Tests the exact decision boundary' },
      { id: 'far', title: 'temp == -100', detail: 'Far from the boundary' },
      { id: 'dup', title: 'Repeat temp == 16 five times', detail: 'Same interior point' },
    ],
    correctChoice: 'exact',
    hint: 'Strict (<) and non-strict (<=) inequalities only disagree right on the boundary.',
    discovery: {
      title: 'Test the boundaries',
      intuition: 'Most bugs hide at edge cases: empty inputs, exact thresholds, ties, and extreme values.',
      example: 'Testing temp = 20 when threshold = 20 immediately distinguishes < from <=.',
      technical: 'Boundary-value analysis targets inputs where behaviour transitions between equivalence classes.',
    },
  },

  // ── Sequence 4: Data Pipelines ─────────────────────────────────────────────
  {
    ...basic,
    id: 'w11-10',
    sequence: 'Data Pipelines',
    title: 'Order an ETL + ML Pipeline',
    instruction: 'Arrange the stages of a reproducible data pipeline from raw storage to evaluation.',
    kind: 'order',
    concept: 'ETL and ML pipeline stages',
    steps: [
      { id: 'ingest', title: 'Load raw CSV records' },
      { id: 'clean', title: 'Drop invalid / NaN rows' },
      { id: 'split', title: 'Split train and test sets' },
      { id: 'fit', title: 'Fit model on training set only' },
      { id: 'eval', title: 'Score model on held-out test set' },
    ],
    correctOrder: ['ingest', 'clean', 'split', 'fit', 'eval'],
    hint: 'Clean before splitting, and never fit on the test set.',
  },
  {
    ...basic,
    id: 'w11-11',
    sequence: 'Data Pipelines',
    title: 'Wire Typed Pipeline Nodes',
    instruction: 'Connect each pipeline stage to the stage that consumes its output.',
    kind: 'connect',
    concept: 'Typed I/O contracts',
    correctConnections: [
      ['csv_reader', 'schema_validator'],
      ['schema_validator', 'feature_scaler'],
      ['feature_scaler', 'knn_classifier'],
      ['knn_classifier', 'metrics_report'],
    ],
    hint: 'Raw rows → validation → scaling → classification → evaluation.',
  },
  {
    ...basic,
    id: 'w11-12',
    sequence: 'Data Pipelines',
    title: 'Pipeline Output Check',
    instruction: `With normal points (1,1), (2,1) and alert points (8,8), (9,8), what label does kNN (k=3) output for [3, 2]?`,
    kind: 'choice',
    concept: 'End-to-end pipeline verification',
    options: [
      { id: 'normal', title: 'normal' },
      { id: 'alert', title: 'alert' },
    ],
    correctChoice: knnPred,
    hint: 'Count which class appears most often among the 3 closest points to (3, 2).',
  },

  // ── Sequence 5: Debug & Version ────────────────────────────────────────────
  {
    ...basic,
    id: 'w11-13',
    sequence: 'Debug & Version',
    title: 'Select Safe Git Practices',
    instruction: 'Select all practices that keep a shared ML codebase safe and traceable.',
    kind: 'multi',
    concept: 'Version control hygiene',
    options: [
      { id: 'small_commits', title: 'Commit small, tested changes' },
      { id: 'pin_seed', title: 'Record random seeds in config' },
      { id: 'force_push', title: 'Force-push over teammates’ commits' },
      { id: 'run_tests', title: 'Run unit tests before merging' },
    ],
    correctChoices: ['small_commits', 'pin_seed', 'run_tests'],
    hint: 'Avoid destructive history rewrites on shared branches.',
  },
  {
    ...basic,
    id: 'w11-14',
    sequence: 'Debug & Version',
    title: 'Repair a Silent Normalization Bug',
    instruction: 'A pipeline divides by `(max_val - min_val)`. When all values are equal, it crashes with ZeroDivisionError. Select the safe fix and retrain.',
    kind: 'repair',
    concept: 'Defensive bug fixing',
    options: [
      { id: 'guard', title: 'Return 0.0 when max_val == min_val' },
      { id: 'ignore', title: 'Catch all exceptions and return None' },
      { id: 'delete', title: 'Remove normalization from the pipeline' },
    ],
    correctChoice: 'guard',
    hint: 'Handle the degenerate zero-range case explicitly without swallowing unrelated errors.',
    discovery: {
      title: 'Fix the root cause, not the symptom',
      intuition: 'Swallowing every exception hides real bugs. Handling a known edge case explicitly keeps the pipeline predictable.',
      example: 'If max_val == min_val, all features are identical, so returning 0.0 is well-defined.',
      technical: 'Add a regression unit test for constant-feature arrays so the ZeroDivisionError can never return unnoticed.',
    },
  },
  {
    ...basic,
    id: 'w11-15',
    sequence: 'Debug & Version',
    title: 'Regression Test Purpose',
    instruction: 'After fixing a bug in `trainThreshold`, what should you add before closing the issue?',
    kind: 'choice',
    concept: 'Regression testing',
    options: [
      { id: 'reg_test', title: 'A unit test reproducing the bug that now passes' },
      { id: 'comment', title: 'A comment saying "fixed"' },
      { id: 'skip', title: 'Delete the failing input from the dataset' },
    ],
    correctChoice: 'reg_test',
    hint: 'Automated tests prevent fixed bugs from reappearing later.',
  },

  // ── Sequence 6: Engineering Checkpoint ─────────────────────────────────────
  {
    ...basic,
    id: 'w11-16',
    sequence: 'Engineering Checkpoint',
    title: 'Assemble Tested Feature',
    instruction: 'Connect the components of a production-ready AI feature from input validation to CI verification.',
    kind: 'connect',
    concept: 'Tested AI feature architecture',
    correctConnections: [
      ['input_guard', 'pure_model'],
      ['pure_model', 'unit_tests'],
      ['unit_tests', 'ci_gate'],
    ],
    hint: 'Guard inputs → run pure model → verify with unit tests → gate merge in CI.',
  },
  {
    ...basic,
    id: 'w11-17',
    sequence: 'Engineering Checkpoint',
    title: 'Checkpoint: Full Release Trace',
    instruction: 'Trace the verified engineering workflow from bug report to safe release.',
    kind: 'trace',
    concept: 'End-to-end engineering workflow',
    correctTrace: ['reproduce_bug', 'write_failing_test', 'implement_fix', 'all_tests_pass', 'commit_change'],
    hint: 'Write a failing test first, fix the code, verify all tests pass, then commit.',
    isCheckpoint: true,
    discovery: {
      title: 'Software engineering makes ML reliable',
      intuition: 'Clean functions, encapsulated objects, typed pipelines, and automated tests turn fragile scripts into dependable systems.',
      example: 'Reproduce → test → fix → verify → commit.',
      technical: 'Continuous integration runs deterministic test suites on every commit to guarantee invariants hold.',
    },
  },
  {
    ...basic,
    id: 'w11-18',
    sequence: 'Test the System',
    title: 'Mutation Testing Insight',
    instruction: 'You deliberately flip `<` to `<=` in your code (a mutant) and all unit tests still pass. What does this reveal?',
    kind: 'choice',
    concept: 'Mutation testing',
    advanced: true,
    unlockAfter: ['w11-17'],
    options: [
      { id: 'gap', title: 'Your test suite is missing a boundary test' },
      { id: 'perfect', title: 'Your code has zero bugs' },
      { id: 'compiler', title: 'The test runner is broken' },
    ],
    correctChoice: 'gap',
    hint: 'If changing program logic leaves every test green, the tests are not checking that behaviour.',
  },
];

export const week11: WeekContent = {
  number: 11,
  module: 3,
  title: 'Software Engineering Techniques',
  summary: 'Develop, test and maintain ML-powered software.',
  topics: ['Python', 'Testing', 'Software workflows'],
  visual: 'systems',
  status: 'vertical-slice',
  sequences: [
    sequenceContract('w11-s01', 'Think in Procedures', 'Construct functions and pseudocode', ['order', 'trace'], 'pure executor trace', 5, 'Equivalent refactoring'),
    sequenceContract('w11-s02', 'Organize Objects', 'Identify reusable object behavior', ['sort', 'connect'], 'object method and state contracts', 5, 'Composition vs inheritance'),
    sequenceContract('w11-s03', 'Test the System', 'Write cases for example algorithms', ['choice', 'trace'], 'verified test expectations', 6, 'Boundary case discovery'),
    sequenceContract('w11-s04', 'Data Pipelines', 'Compose ETL/ML operations', ['connect', 'order'], 'typed I/O and dependencies', 6, 'Minimal coupling'),
    sequenceContract('w11-s05', 'Debug & Version', 'Review fixes and safe workflows', ['choice', 'repair'], 'repeatable regression checks', 5, 'Mutation testing'),
    sequenceContract('w11-s06', 'Engineering Checkpoint', 'Assemble tested AI feature', ['connect', 'trace'], 'requirements and test-pass validation', 2, 'Simplified architecture'),
  ],
  puzzles,
};
