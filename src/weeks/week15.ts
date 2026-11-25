import type { WeekContent, Puzzle } from '../core/types';
import { entropy, trainThreshold } from '../core/algorithms';
import { informationGain, knnClassify, meanSquaredError } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 15, domain: 'ML Engineering' as const };

// Real deterministic computations for Week 15 hackathon capstone
const capstoneThreshold = trainThreshold([
  { temperature: 14, label: 1 },
  { temperature: 17, label: 1 },
  { temperature: 21, label: 0 },
  { temperature: 25, label: 0 },
]); // threshold = 19, accuracy = 1

const capstoneKnn = knnClassify(
  [
    { features: [1, 2], label: 'eco' },
    { features: [2, 2], label: 'eco' },
    { features: [9, 8], label: 'boost' },
    { features: [8, 9], label: 'boost' },
  ],
  [2, 3],
  3,
); // 'eco'

const capstoneMSE = meanSquaredError([0.9, 0.2], [1.0, 0.0]); // (0.01 + 0.04)/2 = 0.025

const featureRows = [
  { features: { sensor_ok: 'yes' }, label: 'trusted' },
  { features: { sensor_ok: 'yes' }, label: 'trusted' },
  { features: { sensor_ok: 'no' }, label: 'review' },
  { features: { sensor_ok: 'no' }, label: 'review' },
];
const sensorIG = informationGain(featureRows, 'sensor_ok'); // 1.0
const splitEntropy = entropy([0.5, 0.5]); // 1.0

const puzzles: Puzzle[] = [
  // ── Sequence 1: Revisit the Goal ───────────────────────────────────────────
  {
    ...basic,
    id: 'w15-01',
    sequence: 'Revisit the Goal',
    title: 'Hackathon Priority Triage',
    instruction: 'Two hours remain before the FIICode demo. Which task must take top priority?',
    kind: 'choice',
    concept: 'Scope prioritization',
    options: [
      { id: 'e2e', title: 'Ensure the core end-to-end flow + tests run reliably on demo inputs' },
      { id: 'theme', title: 'Redesign the footer animations' },
      { id: 'rewrite', title: 'Rewrite the entire ML engine in a new language' },
    ],
    correctChoice: 'e2e',
    hint: 'A working, tested core demo always beats unfinished polish or risky rewrites.',
  },
  {
    ...basic,
    id: 'w15-02',
    sequence: 'Revisit the Goal',
    title: 'Traceable Success Metrics',
    instruction: 'Select all statements that represent traceable, demo-ready success metrics.',
    kind: 'multi',
    concept: 'Traceable success criteria',
    options: [
      { id: 'acc', title: 'Held-out fixture accuracy >= 90% (verified by test suite)' },
      { id: 'latency', title: 'Inference latency < 50 ms on target device' },
      { id: 'vibes', title: 'Looks smart to judges' },
      { id: 'zero_crash', title: '0 unhandled exceptions on malformed inputs' },
    ],
    correctChoices: ['acc', 'latency', 'zero_crash'],
    hint: 'Pick metrics that can be measured and demonstrated live.',
  },
  {
    ...basic,
    id: 'w15-03',
    sequence: 'Revisit the Goal',
    title: 'Order Final Sprint Plan',
    instruction: 'Order the final hackathon sprint steps from goal check to demo readiness.',
    kind: 'order',
    concept: 'Capstone sprint execution',
    steps: [
      { id: 'freeze', title: 'Freeze scope to verified MVP features' },
      { id: 'integrate', title: 'Wire final UI controls to real ML engine' },
      { id: 'verify', title: 'Run full test suite & edge-case checks' },
      { id: 'rehearse', title: 'Rehearse 3-minute live demo & explanation' },
    ],
    correctOrder: ['freeze', 'integrate', 'verify', 'rehearse'],
    hint: 'Lock scope → integrate → verify with tests → rehearse demo.',
  },

  // ── Sequence 2: Build the System ───────────────────────────────────────────
  {
    ...basic,
    id: 'w15-04',
    sequence: 'Build the System',
    title: 'Assemble Smart Thermostat Graph',
    instruction: 'Connect the hackathon system nodes for a smart eco-thermostat.',
    kind: 'connect',
    concept: 'Integrated system wiring',
    correctConnections: [
      ['sensor_stream', 'threshold_trainer'],
      ['threshold_trainer', 'mode_classifier'],
      ['mode_classifier', 'dashboard_ui'],
    ],
    hint: 'Sensor stream → trainer → classifier → dashboard UI.',
  },
  {
    ...basic,
    id: 'w15-05',
    sequence: 'Build the System',
    title: 'Verify Learned Threshold',
    instruction: 'Given readings (14→1, 17→1, 21→0, 25→0), what threshold does `trainThreshold()` select?',
    kind: 'numeric',
    concept: 'Real algorithm execution',
    numeric: { expected: capstoneThreshold.threshold, tolerance: 0, unit: '°C' },
    hint: 'Midpoint between 17°C and 21°C.',
  },
  {
    ...basic,
    id: 'w15-06',
    sequence: 'Build the System',
    title: 'Tune kNN Mode Classifier',
    instruction: 'Set `k` to 3 so the mode classifier uses 3-nearest-neighbor majority voting.',
    kind: 'parameters',
    concept: 'Hyperparameter configuration',
    parameterGoal: { key: 'k', min: 1, max: 5, target: 3, tolerance: 0 },
    hint: 'Move the k slider to 3.',
  },
  {
    ...basic,
    id: 'w15-07',
    sequence: 'Build the System',
    title: 'Confirm Live Prediction',
    instruction: 'With eco points (1,2), (2,2) and boost points (9,8), (8,9), what does `knnClassify(..., [2, 3], 3)` predict?',
    kind: 'choice',
    concept: 'System output verification',
    options: [
      { id: 'eco', title: 'eco' },
      { id: 'boost', title: 'boost' },
    ],
    correctChoice: capstoneKnn,
    hint: '[2, 3] is right next to (1, 2) and (2, 2).',
    discovery: {
      title: 'Live predictions must match offline tests',
      intuition: 'When your UI calls the exact same pure algorithm tested in CI, what you verify in tests is what users see in the demo.',
      example: 'knnClassify returns "eco" both in unit tests and in the live dashboard.',
      technical: 'Sharing a single pure core module eliminates train-serve skew.',
    },
  },

  // ── Sequence 3: Explain the Results ────────────────────────────────────────
  {
    ...basic,
    id: 'w15-08',
    sequence: 'Explain the Results',
    title: 'Quantify Prediction Error',
    instruction: 'Your confidence estimator predicts [0.9, 0.2] against targets [1.0, 0.0]. Compute `meanSquaredError` to 3 decimal places.',
    kind: 'numeric',
    concept: 'Metric-backed explanation',
    numeric: { expected: capstoneMSE, tolerance: 0.002, unit: '' },
    hint: 'Compute ((0.9 − 1.0)² + (0.2 − 0.0)²) / 2 = (0.01 + 0.04) / 2.',
  },
  {
    ...basic,
    id: 'w15-09',
    sequence: 'Explain the Results',
    title: 'Explain Feature Importance',
    instruction: `On 4 balanced samples (entropy ${splitEntropy}), splitting on \`sensor_ok\` produces pure subsets. What is its information gain?`,
    kind: 'numeric',
    concept: 'Information-gain explanation',
    numeric: { expected: sensorIG, tolerance: 0.01, unit: 'bits' },
    hint: 'Parent entropy minus zero weighted child entropy.',
  },
  {
    ...basic,
    id: 'w15-10',
    sequence: 'Explain the Results',
    title: 'Communicate Model Limitations',
    instruction: 'A judge asks: "When does your model fail?" What is the strongest scientific answer?',
    kind: 'choice',
    concept: 'Bias and limitation analysis',
    options: [
      { id: 'honest', title: 'State exact failure modes (e.g. out-of-range units, minority-class skew) and show the guardrails' },
      { id: 'never', title: 'Claim the model has 100% accuracy on all future data' },
      { id: 'blame', title: 'Say any wrong answer is user error' },
    ],
    correctChoice: 'honest',
    hint: 'Credible engineers quantify limitations and show how the system handles them safely.',
    discovery: {
      title: 'Honest limitations build trust',
      intuition: 'Explaining where a model works, where it degrades, and what guardrails catch bad inputs proves deep engineering understanding.',
      example: 'Show both the 0.025 MSE on clean data and the unit-mismatch warning for out-of-range inputs.',
      technical: 'Model cards document intended use, evaluation metrics, and known failure boundaries.',
    },
  },

  // ── Sequence 4: Validate & Present ─────────────────────────────────────────
  {
    ...basic,
    id: 'w15-11',
    sequence: 'Validate & Present',
    title: 'Order Live Demo Flow',
    instruction: 'Order the sections of a clear, evidence-backed 3-minute hackathon presentation.',
    kind: 'order',
    concept: 'Technical presentation structure',
    steps: [
      { id: 'problem', title: 'State user problem & measurable success criteria' },
      { id: 'demo', title: 'Run live interactive demo on real & edge cases' },
      { id: 'evidence', title: 'Show test suite results & evaluation metrics' },
      { id: 'limits', title: 'Discuss limitations & next engineering steps' },
    ],
    correctOrder: ['problem', 'demo', 'evidence', 'limits'],
    hint: 'Problem → live demo → test/metric evidence → limitations & next steps.',
  },
  {
    ...basic,
    id: 'w15-12',
    sequence: 'Validate & Present',
    title: 'Trace Reproducible Demo Check',
    instruction: 'Trace the pre-demo verification checklist right before stepping on stage.',
    kind: 'trace',
    concept: 'Pre-demo reproducibility check',
    correctTrace: ['checkout_clean_branch', 'run_npm_test', 'verify_offline_bundle', 'load_demo_fixtures'],
    hint: 'Clean branch → run test suite → verify offline bundle → load demo fixtures.',
  },
  {
    ...basic,
    id: 'w15-13',
    sequence: 'Validate & Present',
    title: 'Simplify Technical Explanation',
    instruction: 'How should you explain `trainThreshold` to a non-technical stakeholder in one sentence?',
    kind: 'choice',
    concept: 'Accessible communication',
    options: [
      { id: 'plain', title: 'It scans past examples to pick the cutoff temperature that makes the fewest mistakes' },
      { id: 'jargon', title: 'It performs 1D empirical risk minimisation over sorted midpoint partitions' },
      { id: 'magic', title: 'It uses neural quantum intuition' },
    ],
    correctChoice: 'plain',
    hint: 'Keep the mechanism accurate while using plain everyday language.',
  },

  // ── Sequence 5: Final Capstone ─────────────────────────────────────────────
  {
    ...basic,
    id: 'w15-14',
    sequence: 'Final Capstone',
    title: 'Wire Complete Capstone System',
    instruction: 'Connect all components of your final FIICode capstone from raw input to verified presentation.',
    kind: 'connect',
    concept: 'Capstone system integration',
    correctConnections: [
      ['validated_input', 'ml_core'],
      ['ml_core', 'metric_evaluator'],
      ['metric_evaluator', 'explanation_panel'],
    ],
    hint: 'Validated input → ML core → metric evaluator → explanation panel.',
  },
  {
    ...basic,
    id: 'w15-15',
    sequence: 'Final Capstone',
    title: 'Checkpoint: Capstone Sign-Off',
    instruction: 'Trace the final end-to-end capstone verification from problem brief to passing live demo.',
    kind: 'trace',
    concept: 'End-to-end capstone completion',
    correctTrace: ['define_goal', 'build_pure_core', 'pass_all_tests', 'explain_metrics', 'deliver_demo'],
    hint: 'Define goal → build core → pass tests → explain metrics → deliver demo.',
    isCheckpoint: true,
    discovery: {
      title: 'From Foundations to Engineering',
      intuition: 'Across 15 weeks you progressed from simple rules and probability to building, testing, and presenting a complete ML-powered application.',
      example: 'Problem brief → pure algorithms → automated tests → honest evaluation → working app.',
      technical: 'Reliable AI engineering combines mathematical clarity, modular software design, and rigorous verification.',
    },
  },
  {
    ...basic,
    id: 'w15-16',
    sequence: 'Final Capstone',
    title: 'Minimal Node Architecture',
    instruction: 'Your capstone pipeline currently has 6 nodes, including 2 redundant identity transforms. Target the minimal node count (4) that achieves the exact same result.',
    kind: 'parameters',
    concept: 'Architecture simplification',
    advanced: true,
    unlockAfter: ['w15-15'],
    parameterGoal: { key: 'pipeline_nodes', min: 2, max: 8, target: 4, tolerance: 0 },
    hint: '6 total nodes minus 2 redundant nodes leaves 4 essential nodes.',
  },
];

export const week15: WeekContent = {
  number: 15,
  module: 3,
  title: 'FIICode IV: Hackathon',
  summary: 'Complete and present an integrated application.',
  topics: ['Capstone', 'Presentation', 'Reflection'],
  visual: 'systems',
  status: 'vertical-slice',
  sequences: [
    sequenceContract('w15-s01', 'Revisit the Goal', 'Specify final product requirements', ['choice', 'order'], 'traceable success metrics', 5, 'Prioritization'),
    sequenceContract('w15-s02', 'Build the System', 'Assemble final integrated project', ['connect', 'parameters'], 'real algorithm execution', 7, 'Alternative pipeline'),
    sequenceContract('w15-s03', 'Explain the Results', 'Interpret predictions and limitations', ['numeric', 'choice'], 'metric-backed explanation', 5, 'Analyze biases'),
    sequenceContract('w15-s04', 'Validate & Present', 'Test and communicate solution', ['trace', 'order'], 'reproducible checks', 6, 'Simplify explanation'),
    sequenceContract('w15-s05', 'Final Capstone', 'Complete a flexible FIICode-style project', ['connect', 'trace', 'parameters'], 'multi-objective accepted implementations', 2, 'Achieve comparable result with fewer nodes'),
  ],
  puzzles,
};
