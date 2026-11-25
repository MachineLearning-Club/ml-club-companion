import type { WeekContent, Puzzle } from '../core/types';
import { denseForward, perceptronOutput, sigmoid, trainPerceptron } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 13, domain: 'ML Engineering' as const };

// Real deterministic algorithm outputs for Week 13 implementation puzzles
const linearOut = denseForward([2, 3], [[0.5, 1.0]], [-1.0], 'linear')[0]; // 0.5*2 + 1*3 - 1 = 3.0
const sigZero = sigmoid(0); // 0.5
const orSamples = [
  { input: [0, 0], target: 0 as const },
  { input: [0, 1], target: 1 as const },
  { input: [1, 0], target: 1 as const },
  { input: [1, 1], target: 1 as const },
];
const trainedOr = trainPerceptron(orSamples, 20, 0.2);
const orPred10 = perceptronOutput(trainedOr.weights, [1, 0], trainedOr.bias); // 1

const puzzles: Puzzle[] = [
  // ── Sequence 1: Implement Data Flow ────────────────────────────────────────
  {
    ...basic,
    id: 'w13-01',
    sequence: 'Implement Data Flow',
    title: 'Connect Input to Transform',
    instruction: 'Wire the typed data-flow stages from raw user form input to the model feature vector.',
    kind: 'connect',
    concept: 'Typed data flow',
    correctConnections: [
      ['form_input', 'parse_numbers'],
      ['parse_numbers', 'validate_range'],
      ['validate_range', 'feature_vector'],
    ],
    hint: 'Parse strings into numbers, validate their ranges, then pack into a feature vector.',
    discovery: {
      title: 'Validate at the boundary',
      intuition: 'Converting and checking user input once at the app boundary keeps every downstream ML function simple and crash-free.',
      example: 'String "22.5" → parseFloat → finite & range check → [22.5].',
      technical: 'Parse-don’t-validate ensures downstream components receive strongly typed finite numbers.',
    },
  },
  {
    ...basic,
    id: 'w13-02',
    sequence: 'Implement Data Flow',
    title: 'Trace Feature Normalization',
    instruction: 'Trace the exact data transformations applied to raw reading `x = 15` with `min = 10`, `max = 20`.',
    kind: 'trace',
    concept: 'Transform pipeline trace',
    correctTrace: ['read_x_15', 'subtract_min_5', 'divide_range_10', 'output_0.5'],
    hint: 'Subtract min (15 − 10 = 5), divide by range (20 − 10 = 10), yielding 0.5.',
  },
  {
    ...basic,
    id: 'w13-03',
    sequence: 'Implement Data Flow',
    title: 'Check Dense Linear Output',
    instruction: 'Your data flow feeds [2, 3] into denseForward([2, 3], [[0.5, 1.0]], [-1.0], "linear"). What scalar output is produced?',
    kind: 'numeric',
    concept: 'Forward pass verification',
    numeric: { expected: linearOut, tolerance: 0.01, unit: '' },
    hint: 'Compute 0.5×2 + 1.0×3 + (−1.0).',
  },

  // ── Sequence 2: Compose Algorithms ─────────────────────────────────────────
  {
    ...basic,
    id: 'w13-04',
    sequence: 'Compose Algorithms',
    title: 'Wire Multi-Node ML Graph',
    instruction: 'Connect the real ML nodes to build a two-stage scoring + thresholding application.',
    kind: 'connect',
    concept: 'Composing ML nodes',
    correctConnections: [
      ['feature_vector', 'dense_layer'],
      ['dense_layer', 'sigmoid_gate'],
      ['sigmoid_gate', 'decision_rule'],
    ],
    hint: 'Features → dense linear layer → sigmoid probability → threshold decision rule.',
  },
  {
    ...basic,
    id: 'w13-05',
    sequence: 'Compose Algorithms',
    title: 'Tune Sigmoid Midpoint',
    instruction: 'Adjust the logit parameter `z` so `sigmoid(z)` equals exactly 0.50.',
    kind: 'parameters',
    concept: 'Activation function calibration',
    parameterGoal: { key: 'z', min: -5, max: 5, target: 0, tolerance: 0.1 },
    hint: `sigmoid(0) = ${sigZero}. Set z = 0.`,
    discovery: {
      title: 'Compose small, verified primitives',
      intuition: 'Complex AI apps are built by chaining simple, well-tested building blocks like linear projections, activations, and decision rules.',
      example: 'denseForward → sigmoid → threshold(0.5) turns raw features into a binary action.',
      technical: 'Modular composition lets you swap or test each node independently.',
    },
  },
  {
    ...basic,
    id: 'w13-06',
    sequence: 'Compose Algorithms',
    title: 'Verify Trained Perceptron Node',
    instruction: 'A perceptron trained on logical OR outputs 0 or 1. What does perceptronOutput(weights, [1, 0], bias) return?',
    kind: 'numeric',
    concept: 'Trained node execution',
    numeric: { expected: orPred10, tolerance: 0, unit: '' },
    hint: 'For logical OR, input [1, 0] has at least one 1.',
  },

  // ── Sequence 3: Create Controls ────────────────────────────────────────────
  {
    ...basic,
    id: 'w13-07',
    sequence: 'Create Controls',
    title: 'Order UI Event-to-Model Loop',
    instruction: 'Order the steps when a user moves the k-NN `k` slider in the application UI.',
    kind: 'order',
    concept: 'Unidirectional UI state flow',
    steps: [
      { id: 'event', title: 'User moves slider to k = 5' },
      { id: 'clamp', title: 'Clamp k to valid integer [1, N]' },
      { id: 'recompute', title: 'Re-run knnClassify with new k' },
      { id: 'render', title: 'Update prediction badge in UI' },
    ],
    correctOrder: ['event', 'clamp', 'recompute', 'render'],
    hint: 'Capture event → validate/clamp parameter → run model → re-render view.',
  },
  {
    ...basic,
    id: 'w13-08',
    sequence: 'Create Controls',
    title: 'Bind Controls to Parameters',
    instruction: 'Connect each UI control to the model parameter or action it safely updates.',
    kind: 'connect',
    concept: 'Control bindings',
    correctConnections: [
      ['k_slider', 'knn_neighbors'],
      ['threshold_slider', 'decision_cutoff'],
      ['reset_button', 'default_state'],
    ],
    hint: 'Match each widget to its corresponding model parameter or state reset.',
  },
  {
    ...basic,
    id: 'w13-09',
    sequence: 'Create Controls',
    title: 'Prevent Invalid Parameter State',
    instruction: 'A dataset has 10 samples. What should happen if a user tries to set k-NN `k = 0` or `k = 25`?',
    kind: 'choice',
    concept: 'Input constraint enforcement',
    options: [
      { id: 'clamp', title: 'Clamp or reject k outside [1, 10] before calling kNN' },
      { id: 'crash', title: 'Let knnClassify throw an unhandled exception' },
      { id: 'silent', title: 'Silently return a random class' },
    ],
    correctChoice: 'clamp',
    hint: 'Enforce valid bounds in the UI control and state layer.',
  },

  // ── Sequence 4: Debug Integration ──────────────────────────────────────────
  {
    ...basic,
    id: 'w13-10',
    sequence: 'Debug Integration',
    title: 'Trace Cross-Component Mismatch',
    instruction: 'The UI shows 0% accuracy even though the model works. Trace how an integration bug occurs when labels are strings ("yes"/"no") but the scorer expects numbers (1/0).',
    kind: 'trace',
    concept: 'Interface contract mismatch',
    correctTrace: ['model_returns_yes', 'scorer_expects_1', 'strict_eq_fails', 'accuracy_reports_0'],
    hint: 'Model outputs string → scorer expects number → === comparison fails → accuracy drops to 0.',
    discovery: {
      title: 'Integration bugs live at interfaces',
      intuition: 'Two functions can both pass their own unit tests and still fail together if they disagree on units, types, or label encoding.',
      example: 'Model returns "yes"/"no" while evaluator checks === 1/0.',
      technical: 'Integration tests exercise the real boundary between components using shared fixtures.',
    },
  },
  {
    ...basic,
    id: 'w13-11',
    sequence: 'Debug Integration',
    title: 'Repair Stale UI State',
    instruction: 'After uploading a new CSV dataset, the UI still displays predictions from the old model. Select the proper fix and apply.',
    kind: 'repair',
    concept: 'State synchronization fix',
    options: [
      { id: 'retrain', title: 'Invalidate cached model and trigger retrain on dataset change' },
      { id: 'reload', title: 'Ask the user to manually refresh the browser tab' },
      { id: 'hide', title: 'Hide the prediction badge after upload' },
    ],
    correctChoice: 'retrain',
    hint: 'Dependent derived state (model & predictions) must recompute whenever source data changes.',
  },
  {
    ...basic,
    id: 'w13-12',
    sequence: 'Debug Integration',
    title: 'Diagnose Inverted Axis Bug',
    instruction: 'A 2D scatter plot swaps x and y coordinates when rendering, while kNN uses [x, y]. What symptom do users see?',
    kind: 'choice',
    concept: 'Visual-model alignment',
    options: [
      { id: 'mismatch', title: 'Plotted points look closer to the wrong cluster compared to kNN predictions' },
      { id: 'faster', title: 'kNN runs twice as fast' },
      { id: 'none', title: 'No visual difference at all' },
    ],
    correctChoice: 'mismatch',
    hint: 'The visual chart and the underlying algorithm disagree on point locations.',
  },
  {
    ...basic,
    id: 'w13-13',
    sequence: 'Debug Integration',
    title: 'Select Integration Test Fixtures',
    instruction: 'Select all assertions that belong in an integration test for the end-to-end app.',
    kind: 'multi',
    concept: 'Integration test coverage',
    options: [
      { id: 'valid_flow', title: 'Valid input produces finite prediction and updates UI state' },
      { id: 'bad_input', title: 'Malformed input shows validation message without crashing' },
      { id: 'param_update', title: 'Changing slider k updates prediction deterministically' },
      { id: 'css_color', title: 'Exact pixel shade of background gradient' },
    ],
    correctChoices: ['valid_flow', 'bad_input', 'param_update'],
    hint: 'Test behaviour across components rather than brittle visual styling details.',
  },

  // ── Sequence 5: Application Checkpoint ─────────────────────────────────────
  {
    ...basic,
    id: 'w13-14',
    sequence: 'Application Checkpoint',
    title: 'Wire End-to-End Pipeline',
    instruction: 'Connect all stages of the running FIICode application from user input to verified output.',
    kind: 'connect',
    concept: 'End-to-end application wiring',
    correctConnections: [
      ['user_input', 'input_validator'],
      ['input_validator', 'ml_pipeline'],
      ['ml_pipeline', 'ui_renderer'],
    ],
    hint: 'Input → validator → ML pipeline → UI renderer.',
  },
  {
    ...basic,
    id: 'w13-15',
    sequence: 'Application Checkpoint',
    title: 'Checkpoint: Full App Execution',
    instruction: 'Trace the complete execution of your working FIICode app when a user submits a new sample.',
    kind: 'trace',
    concept: 'End-to-end runtime trace',
    correctTrace: ['submit_input', 'validate_schema', 'run_inference', 'format_explanation', 'render_result'],
    hint: 'Submit → validate → infer → format → render.',
    isCheckpoint: true,
    discovery: {
      title: 'Working end-to-end beats isolated pieces',
      intuition: 'An integrated vertical slice—input, validation, model, and UI—lets you test real user journeys early.',
      example: 'Submit → validate → infer → format → render.',
      technical: 'End-to-end verification confirms that data contracts, controls, and algorithms align in production.',
    },
  },
  {
    ...basic,
    id: 'w13-16',
    sequence: 'Implement Data Flow',
    title: 'Handling Missing Values Safely',
    instruction: 'A sensor occasionally sends `null` for humidity. What is the safest deterministic handling in an inference pipeline?',
    kind: 'choice',
    concept: 'Missing data imputation & flagging',
    advanced: true,
    unlockAfter: ['w13-15'],
    options: [
      { id: 'impute_flag', title: 'Impute using training-set median and surface a missing-feature warning' },
      { id: 'zero', title: 'Coerce null to 0 without telling the user' },
      { id: 'nan', title: 'Pass NaN into dot() and let the score become NaN' },
    ],
    correctChoice: 'impute_flag',
    hint: 'Use a statistically consistent fallback from training data and keep the user informed.',
  },
];

export const week13: WeekContent = {
  number: 13,
  module: 3,
  title: 'FIICode II: Implementing the Application',
  summary: 'Build functional project components.',
  topics: ['Implementation', 'Integration', 'Debugging'],
  visual: 'systems',
  status: 'vertical-slice',
  sequences: [
    sequenceContract('w13-s01', 'Implement Data Flow', 'Connect input and transforms', ['connect', 'trace'], 'typed data passing', 5, 'Handle missing data'),
    sequenceContract('w13-s02', 'Compose Algorithms', 'Wire real ML nodes', ['connect', 'parameters'], 'algorithm execution and validity', 6, 'Alternative algorithm'),
    sequenceContract('w13-s03', 'Create Controls', 'Bind user actions to model params', ['order', 'connect'], 'event/update semantics', 5, 'Avoid invalid states'),
    sequenceContract('w13-s04', 'Debug Integration', 'Find broken cross-component behavior', ['trace', 'repair'], 'integration test fixtures', 6, 'Race-condition prevention'),
    sequenceContract('w13-s05', 'Application Checkpoint', 'Construct end-to-end running pipeline', ['connect', 'trace'], 'functional multi-stage acceptance', 2, 'Optimize component count'),
  ],
  puzzles,
};
