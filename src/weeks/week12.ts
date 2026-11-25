import type { WeekContent, Puzzle } from '../core/types';
import { entropy, trainThreshold } from '../core/algorithms';
import { informationGain } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 12, domain: 'ML Engineering' as const };

// Real deterministic calculations for Week 12 acceptance criteria & baseline planning
const baselineAccuracy = trainThreshold([
  { temperature: 15, label: 1 },
  { temperature: 17, label: 1 },
  { temperature: 19, label: 0 },
  { temperature: 21, label: 1 }, // noisy point → 1 error out of 4 = 0.75
  { temperature: 23, label: 0 },
  { temperature: 25, label: 0 },
]).accuracy; // 5/6 ≈ 0.8333

const classEntropy = entropy([0.8, 0.2]); // imbalanced 80/20 dataset ≈ 0.7219

const triageRows = [
  { features: { urgent: 'yes' }, label: 'escalate' },
  { features: { urgent: 'yes' }, label: 'escalate' },
  { features: { urgent: 'no' }, label: 'queue' },
  { features: { urgent: 'no' }, label: 'queue' },
];
const urgentIG = informationGain(triageRows, 'urgent'); // 1.0

const puzzles: Puzzle[] = [
  // ── Sequence 1: Understand the Brief ───────────────────────────────────────
  {
    ...basic,
    id: 'w12-01',
    sequence: 'Understand the Brief',
    title: 'Stakeholders vs Constraints',
    instruction: 'Sort each item from a FIICode project brief into Stakeholder (who uses or owns it) or Constraint (technical/business limit).',
    kind: 'sort',
    concept: 'Stakeholder and constraint analysis',
    items: [
      { id: 'clinic', title: 'Triage Nurse (End User)' },
      { id: 'admin', title: 'Hospital IT Lead' },
      { id: 'latency', title: 'Response < 200 ms offline' },
      { id: 'privacy', title: 'No patient data leaves device' },
    ],
    buckets: [
      { id: 'stakeholder', title: 'Stakeholder' },
      { id: 'constraint', title: 'Constraint' },
    ],
    correctAssignments: {
      clinic: 'stakeholder',
      admin: 'stakeholder',
      latency: 'constraint',
      privacy: 'constraint',
    },
    hint: 'Stakeholders are people or roles; constraints bound how the system must behave.',
    discovery: {
      title: 'Start from the problem, not the model',
      intuition: 'Before picking an algorithm, identify who relies on the output and what boundaries (speed, privacy, offline use) cannot be violated.',
      example: 'A clinic app requiring offline < 200 ms inference rules out heavy cloud-only APIs.',
      technical: 'Requirements traceability links every architectural choice back to a stakeholder need or constraint.',
    },
  },
  {
    ...basic,
    id: 'w12-02',
    sequence: 'Understand the Brief',
    title: 'Core Objective Extraction',
    instruction: 'A brief asks for "an app that flags urgent support tickets before SLA expires." Which ML framing fits best?',
    kind: 'choice',
    concept: 'Problem framing',
    options: [
      { id: 'binary', title: 'Binary classification (urgent vs normal)', detail: 'Predicts urgency from ticket text/metadata' },
      { id: 'cluster', title: 'Unsupervised K-Means with k=10', detail: 'Groups tickets without urgency labels' },
      { id: 'gen', title: 'Bigram text generator', detail: 'Generates synthetic tickets instead of triaging' },
    ],
    correctChoice: 'binary',
    hint: 'Flagging urgent vs normal tickets is a two-class supervised decision.',
  },
  {
    ...basic,
    id: 'w12-03',
    sequence: 'Understand the Brief',
    title: 'Scope Guardrails',
    instruction: 'Select all items that belong in the MVP scope for a 4-week FIICode build.',
    kind: 'multi',
    concept: 'MVP scoping',
    options: [
      { id: 'core_flow', title: 'End-to-end input → model → result UI' },
      { id: 'eval_panel', title: 'Validation metrics on a held-out fixture' },
      { id: 'custom_gpu', title: 'Custom distributed GPU cluster' },
      { id: 'clear_docs', title: 'Setup & demo instructions' },
    ],
    correctChoices: ['core_flow', 'eval_panel', 'clear_docs'],
    hint: 'Focus on a working, verifiable end-to-end slice rather than premature infrastructure.',
  },

  // ── Sequence 2: Define Success ─────────────────────────────────────────────
  {
    ...basic,
    id: 'w12-04',
    sequence: 'Define Success',
    title: 'Baseline Threshold Accuracy',
    instruction: 'On 6 labelled samples with 1 noisy point, trainThreshold() makes 1 error. What is the baseline accuracy (as a decimal)?',
    kind: 'numeric',
    concept: 'Measurable baseline metric',
    numeric: { expected: baselineAccuracy, tolerance: 0.01, unit: '' },
    hint: 'Accuracy is (6 − 1) / 6.',
    discovery: {
      title: 'Success needs a number',
      intuition: '"Works well" is untestable. A measurable acceptance criterion specifies the exact metric, dataset, and minimum threshold.',
      example: 'Achieve >= 83% accuracy and 0 crashes on the 6-case fixture.',
      technical: 'Baseline metrics establish the floor that any more complex model must beat to justify its added complexity.',
    },
  },
  {
    ...basic,
    id: 'w12-05',
    sequence: 'Define Success',
    title: 'Imbalanced Dataset Entropy',
    instruction: 'An 80/20 imbalanced ticket dataset has class probabilities [0.8, 0.2]. Compute its Shannon entropy H(Y) in bits.',
    kind: 'numeric',
    concept: 'Class distribution entropy',
    numeric: { expected: classEntropy, tolerance: 0.01, unit: 'bits' },
    hint: 'Compute −(0.8·log₂(0.8) + 0.2·log₂(0.2)).',
  },
  {
    ...basic,
    id: 'w12-06',
    sequence: 'Define Success',
    title: 'Why Accuracy Alone Fails',
    instruction: 'Only 5% of transactions are fraud. A dummy model predicts "not fraud" every time and gets 95% accuracy. Which metric exposes this?',
    kind: 'choice',
    concept: 'Metric selection for imbalanced classes',
    options: [
      { id: 'recall', title: 'Recall on the fraud class', detail: 'Measures how many actual frauds were caught (0% here)' },
      { id: 'acc', title: 'Overall accuracy', detail: 'Stays 95% even when catching zero frauds' },
      { id: 'size', title: 'Model file size in KB', detail: 'Does not measure prediction quality' },
    ],
    correctChoice: 'recall',
    hint: 'Check what fraction of positive (fraud) cases the model actually detects.',
  },

  // ── Sequence 3: Choose Architecture ────────────────────────────────────────
  {
    ...basic,
    id: 'w12-07',
    sequence: 'Choose Architecture',
    title: 'Clean Modular Boundaries',
    instruction: 'Connect the layers of a clean FIICode application so UI and ML logic stay decoupled.',
    kind: 'connect',
    concept: 'Layered application architecture',
    correctConnections: [
      ['ui_controls', 'app_controller'],
      ['app_controller', 'ml_engine'],
      ['ml_engine', 'result_formatter'],
      ['result_formatter', 'ui_display'],
    ],
    hint: 'UI sends events to a controller, which calls the pure ML engine and formats results back for display.',
  },
  {
    ...basic,
    id: 'w12-08',
    sequence: 'Choose Architecture',
    title: 'Order Design Decisions',
    instruction: 'Order the architecture design steps from requirements to implementation readiness.',
    kind: 'order',
    concept: 'Architecture design workflow',
    steps: [
      { id: 'reqs', title: 'List functional & non-functional requirements' },
      { id: 'contracts', title: 'Define input/output data contracts' },
      { id: 'baseline', title: 'Select simplest baseline algorithm' },
      { id: 'wire', title: 'Map component interfaces & error paths' },
    ],
    correctOrder: ['reqs', 'contracts', 'baseline', 'wire'],
    hint: 'Requirements → data contracts → baseline model → component wiring.',
  },
  {
    ...basic,
    id: 'w12-09',
    sequence: 'Choose Architecture',
    title: 'Feature Predictive Power',
    instruction: 'On 4 tickets where `urgent=yes` always escalates (2×) and `urgent=no` always queues (2×), what is the information gain of `urgent`?',
    kind: 'numeric',
    concept: 'Feature signal check',
    numeric: { expected: urgentIG, tolerance: 0.01, unit: 'bits' },
    hint: 'Full entropy is 1.0 bit and both child subsets are completely pure (entropy 0).',
  },

  // ── Sequence 4: Plan Experiments ───────────────────────────────────────────
  {
    ...basic,
    id: 'w12-10',
    sequence: 'Plan Experiments',
    title: 'Reproducible Experiment Order',
    instruction: 'Order the steps of a reproducible ML experiment plan.',
    kind: 'order',
    concept: 'Experimental reproducibility',
    steps: [
      { id: 'seed', title: 'Fix dataset snapshot and random seed' },
      { id: 'split', title: 'Create deterministic train/validation split' },
      { id: 'run_base', title: 'Evaluate simple baseline first' },
      { id: 'iterate', title: 'Test one hypothesis at a time and log metrics' },
    ],
    correctOrder: ['seed', 'split', 'run_base', 'iterate'],
    hint: 'Lock data and seed before splitting, establish a baseline, then change one variable at a time.',
    discovery: {
      title: 'Change one thing at a time',
      intuition: 'If you change the dataset, features, and hyperparameters all at once, you cannot tell which change helped or hurt.',
      example: 'Keep seed=42 and the same validation split across baseline and candidate models.',
      technical: 'Controlled experiments isolate the effect of a single independent variable on evaluation metrics.',
    },
  },
  {
    ...basic,
    id: 'w12-11',
    sequence: 'Plan Experiments',
    title: 'Trace a Fair Comparison',
    instruction: 'Trace the valid sequence for comparing Model A and Model B on the same benchmark.',
    kind: 'trace',
    concept: 'Fair model comparison',
    correctTrace: ['load_fixed_split', 'train_model_a', 'score_a_on_val', 'train_model_b', 'score_b_on_val', 'compare_metrics'],
    hint: 'Use the exact same fixed split, train and score Model A, then train and score Model B, then compare.',
  },
  {
    ...basic,
    id: 'w12-12',
    sequence: 'Plan Experiments',
    title: 'Spot Data Leakage',
    instruction: 'An experiment scales features using the mean and std of the entire dataset (train + test) before splitting. What is the flaw?',
    kind: 'choice',
    concept: 'Preventing data leakage',
    options: [
      { id: 'leak', title: 'Test statistics leaked into training', detail: 'Inflates validation score optimistically' },
      { id: 'slow', title: 'Division by std is too slow', detail: 'Not a correctness flaw' },
      { id: 'none', title: 'No flaw; scaling is always safe', detail: 'Ignores split boundary' },
    ],
    correctChoice: 'leak',
    hint: 'Statistics computed on test rows give the pipeline hidden information about the test distribution.',
  },

  // ── Sequence 5: Project Design Checkpoint ──────────────────────────────────
  {
    ...basic,
    id: 'w12-13',
    sequence: 'Project Design Checkpoint',
    title: 'Traceable Plan Wiring',
    instruction: 'Connect each planning artifact to what it verifies in the FIICode design.',
    kind: 'connect',
    concept: 'Requirements coverage',
    correctConnections: [
      ['brief_goal', 'acceptance_metric'],
      ['acceptance_metric', 'baseline_experiment'],
      ['baseline_experiment', 'architecture_spec'],
    ],
    hint: 'Goal → measurable metric → baseline experiment → architecture spec.',
  },
  {
    ...basic,
    id: 'w12-14',
    sequence: 'Project Design Checkpoint',
    title: 'Checkpoint: Latency Budget',
    instruction: 'Set the maximum allowed inference latency budget (ms) to meet a strict 50 ms SLA target.',
    kind: 'parameters',
    concept: 'Design constraint budgeting',
    parameterGoal: { key: 'latency_budget_ms', min: 10, max: 100, target: 50, tolerance: 2 },
    hint: 'Set the slider to 50 ms.',
    isCheckpoint: true,
    discovery: {
      title: 'A coherent plan de-risks implementation',
      intuition: 'When stakeholders, metrics, modular boundaries, and experiment fixtures are aligned upfront, coding becomes execution rather than guesswork.',
      example: 'Goal → SLA metric → deterministic baseline → modular architecture.',
      technical: 'Requirements traceability ensures every component in the build has a clear justification and test criterion.',
    },
  },
  {
    ...basic,
    id: 'w12-15',
    sequence: 'Understand the Brief',
    title: 'Conflicting Requirements',
    instruction: 'A client demands both (1) 100% recall on rare alerts AND (2) zero false alarms ever on overlapping data. How should you respond?',
    kind: 'choice',
    concept: 'Requirement conflict resolution',
    advanced: true,
    unlockAfter: ['w12-14'],
    options: [
      { id: 'tradeoff', title: 'Explain the precision–recall tradeoff and propose a tunable threshold', detail: 'Quantifies achievable operating points' },
      { id: 'promise', title: 'Promise both 100% recall and 0% false positives', detail: 'Impossible on overlapping distributions' },
      { id: 'ignore', title: 'Silently drop the recall requirement', detail: 'Violates stakeholder transparency' },
    ],
    correctChoice: 'tradeoff',
    hint: 'On overlapping classes, lowering false negatives increases false positives.',
  },
];

export const week12: WeekContent = {
  number: 12,
  module: 3,
  title: 'FIICode I: Understanding the Challenge',
  summary: 'Analyse the project brief and design a solution.',
  topics: ['Requirements', 'Architecture', 'Planning'],
  visual: 'systems',
  status: 'vertical-slice',
  sequences: [
    sequenceContract('w12-s01', 'Understand the Brief', 'Identify project stakeholders and objective', ['sort', 'choice'], 'requirements traceability', 5, 'Find conflicting requirement'),
    sequenceContract('w12-s02', 'Define Success', 'Turn goals into measurable acceptance criteria', ['numeric', 'choice'], 'testable threshold objectives', 5, 'Tradeoff requirements'),
    sequenceContract('w12-s03', 'Choose Architecture', 'Compose algorithm and UI components', ['connect', 'order'], 'interface contracts and data-flow', 6, 'Alternative modular design'),
    sequenceContract('w12-s04', 'Plan Experiments', 'Design reproducible data and test plans', ['order', 'trace'], 'fixture/seed and baseline reproducibility', 5, 'Counterexample'),
    sequenceContract('w12-s05', 'Project Design Checkpoint', 'Produce a technically coherent plan', ['connect', 'parameters'], 'requirements coverage', 2, 'Minimal architecture'),
  ],
  puzzles,
};
