import { sequenceContract } from '../content/authoring';
import {
  convolve2D,
  entropyOfLabels,
  knnClassify,
  meanSquaredError,
  perceptronOutput,
  squaredDistance,
} from '../core/simulations';
import type { Puzzle, WeekContent } from '../core/types';

const basic = { week: 9, domain: 'Foundations' as const, isCheckpoint: true };

const evalEntropy = entropyOfLabels(['yes', 'yes', 'no', 'no']);
const centroids: [number, number][] = [
  [0, 0],
  [10, 10],
];
const pts: Record<string, [number, number]> = {
  p1: [1, 1],
  p2: [2, 0],
  p3: [9, 10],
  p4: [11, 8],
};
const assignCentroid = (pt: [number, number]) =>
  squaredDistance(pt, centroids[0]) <= squaredDistance(pt, centroids[1]) ? 'c0' : 'c1';

const knnSamples = [
  { features: [1, 1], label: 0 },
  { features: [2, 1], label: 0 },
  { features: [8, 8], label: 1 },
  { features: [9, 7], label: 1 },
];
const knnPred = knnClassify(knnSamples, [2, 2], 3);

const convSample = convolve2D(
  [
    [2, 2, 2],
    [2, 0, 2],
    [2, 2, 2],
  ],
  [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  { padding: 'valid' }
);

const percPred = perceptronOutput([1, -1], [1, 0], -0.5);
const mseSample = meanSquaredError([0.8], [1.0]);

const puzzles: Puzzle[] = [
  {
    ...basic,
    id: 'w9-01',
    sequence: 'Prepare Evaluation',
    title: 'Week 1 Recap: Rules vs. Learning',
    instruction: 'A spam filter updates its word weights automatically from thousands of user-marked emails rather than a fixed IF/ELSE list. Which paradigm is this?',
    kind: 'choice',
    concept: 'Learning vs rules',
    options: [
      { id: 'ml', title: 'Machine learning from labelled examples' },
      { id: 'rule', title: 'Hard-coded deterministic rules' },
      { id: 'random', title: 'Uncalibrated random guessing' },
    ],
    correctChoice: 'ml',
    hint: 'Parameters are inferred from labelled data instead of hand-written thresholds.',
  },
  {
    ...basic,
    id: 'w9-02',
    sequence: 'Prepare Evaluation',
    title: 'Week 2 Recap: Dataset Entropy',
    instruction: 'Compute the Shannon entropy (in bits) of a balanced dataset with labels ["yes", "yes", "no", "no"].',
    kind: 'numeric',
    concept: 'Shannon entropy',
    numeric: { expected: evalEntropy, tolerance: 0.001 },
    hint: 'A 50/50 binary split has maximum uncertainty: -(0.5 log₂ 0.5 + 0.5 log₂ 0.5).',
  },
  {
    ...basic,
    id: 'w9-03',
    sequence: 'Prepare Evaluation',
    title: 'Week 2 Recap: Decision Tree Splits',
    instruction: 'How does ID3 choose which feature to place at the root of a decision tree?',
    kind: 'choice',
    concept: 'Information gain',
    options: [
      { id: 'gain', title: 'The feature with the highest information gain (largest entropy reduction)' },
      { id: 'alpha', title: 'The feature whose name comes first alphabetically' },
      { id: 'const', title: 'A feature that has the same value for every row' },
    ],
    correctChoice: 'gain',
    hint: 'ID3 greedily maximizes entropy reduction at each split.',
  },
  {
    ...basic,
    id: 'w9-04',
    sequence: 'Select Your Approach',
    title: 'Week 3 Recap: Nearest Centroid',
    instruction: 'Assign each 2D point to its nearest centroid: C0 = (0, 0) or C1 = (10, 10).',
    kind: 'sort',
    concept: 'K-Means assignment',
    items: [
      { id: 'p1', title: 'Point (1, 1)' },
      { id: 'p2', title: 'Point (2, 0)' },
      { id: 'p3', title: 'Point (9, 10)' },
      { id: 'p4', title: 'Point (11, 8)' },
    ],
    buckets: [
      { id: 'c0', title: 'Centroid C0 (0, 0)' },
      { id: 'c1', title: 'Centroid C1 (10, 10)' },
    ],
    correctAssignments: {
      p1: assignCentroid(pts.p1),
      p2: assignCentroid(pts.p2),
      p3: assignCentroid(pts.p3),
      p4: assignCentroid(pts.p4),
    },
    hint: 'Compare squared Euclidean distance to (0, 0) and (10, 10).',
  },
  {
    ...basic,
    id: 'w9-05',
    sequence: 'Select Your Approach',
    title: 'Week 3 Recap: k-NN Prediction',
    instruction: 'With training points (1,1)→0, (2,1)→0, (8,8)→1, (9,7)→1, what does k-NN (k=3) predict for query (2, 2)?',
    kind: 'numeric',
    concept: 'k-NN classification',
    numeric: { expected: knnPred, tolerance: 0 },
    hint: 'Find the 3 closest training points to (2, 2) and take the majority label.',
  },
  {
    ...basic,
    id: 'w9-06',
    sequence: 'Select Your Approach',
    title: 'Week 4 Recap: Confusion Matrix Accuracy',
    instruction: 'A classifier achieves TP = 40, TN = 45, FP = 5, FN = 10 on 100 test cases. What is its accuracy (between 0 and 1)?',
    kind: 'numeric',
    concept: 'Classification accuracy',
    numeric: { expected: (40 + 45) / 100, tolerance: 0.001 },
    hint: 'Accuracy = (TP + TN) / (TP + TN + FP + FN).',
  },
  {
    ...basic,
    id: 'w9-07',
    sequence: 'Select Your Approach',
    title: 'Week 4 Recap: Precision vs. Recall',
    instruction: 'In medical screening where missing a sick patient (false negative) is very costly, which metric should you prioritize?',
    kind: 'choice',
    concept: 'Precision-recall tradeoff',
    options: [
      { id: 'recall', title: 'Recall (minimize false negatives)' },
      { id: 'speed', title: 'Training speed' },
      { id: 'train_acc', title: 'Training set accuracy only' },
    ],
    correctChoice: 'recall',
    hint: 'Recall = TP / (TP + FN) measures how many actual positives were caught.',
  },
  {
    ...basic,
    id: 'w9-08',
    sequence: 'Build & Test',
    title: 'Week 5 Recap: Convolution Value',
    instruction: 'Convolve the 3×3 image [[2,2,2],[2,0,2],[2,2,2]] with kernel [[1,0,1],[0,1,0],[1,0,1]] (valid padding). What is the single output number?',
    kind: 'numeric',
    concept: '2D convolution',
    numeric: { expected: convSample[0][0], tolerance: 0 },
    hint: 'Multiply each of the 4 corner 2s by 1, plus the center 0 by 1.',
  },
  {
    ...basic,
    id: 'w9-09',
    sequence: 'Build & Test',
    title: 'Week 6 Recap: Perceptron Output',
    instruction: 'Compute the perceptron output for weights [1, -1], input [1, 0], and bias -0.5.',
    kind: 'numeric',
    concept: 'Perceptron step',
    numeric: { expected: percPred, tolerance: 0 },
    hint: 'z = 1×1 + (-1)×0 - 0.5 = 0.5 ≥ 0.',
  },
  {
    ...basic,
    id: 'w9-10',
    sequence: 'Build & Test',
    title: 'Week 6 Recap: Linear Separability',
    instruction: 'Which of these datasets cannot be solved by a single perceptron?',
    kind: 'choice',
    concept: 'Perceptron limits',
    options: [
      { id: 'xor', title: 'XOR truth table' },
      { id: 'or', title: 'OR truth table' },
      { id: 'and', title: 'AND truth table' },
    ],
    correctChoice: 'xor',
    hint: 'Opposite corners of the unit square share labels in XOR.',
  },
  {
    ...basic,
    id: 'w9-11',
    sequence: 'Build & Test',
    title: 'Week 7 Recap: MSE Loss',
    instruction: 'A neural network predicts 0.8 when the target is 1.0. What is the Mean Squared Error?',
    kind: 'numeric',
    concept: 'MSE evaluation',
    numeric: { expected: mseSample, tolerance: 0.001 },
    hint: 'Compute (0.8 - 1.0)².',
  },
  {
    ...basic,
    id: 'w9-12',
    sequence: 'Reflect & Improve',
    title: 'Week 7 Recap: Gradient Update',
    instruction: 'With weight w = 0.5, gradient dL/dw = 2.0, and learning rate lr = 0.1, what is w_new = w - lr × (dL/dw)?',
    kind: 'numeric',
    concept: 'Gradient descent step',
    numeric: { expected: 0.5 - 0.1 * 2.0, tolerance: 0.001 },
    hint: '0.5 - 0.2 = 0.3.',
  },
  {
    ...basic,
    id: 'w9-13',
    sequence: 'Reflect & Improve',
    title: 'Week 8 Recap: Diagnosing Overfitting',
    instruction: 'Your model gets 99% accuracy on training data and 61% on held-out validation data. What is the primary diagnosis?',
    kind: 'choice',
    concept: 'Generalization gap',
    options: [
      { id: 'overfit', title: 'Overfitting to the training set' },
      { id: 'underfit', title: 'Underfitting due to too few parameters' },
      { id: 'perfect', title: 'Ideal generalization' },
    ],
    correctChoice: 'overfit',
    hint: 'A large gap between high training performance and low validation performance signals overfitting.',
  },
  {
    ...basic,
    id: 'w9-14',
    sequence: 'Reflect & Improve',
    title: 'Tune Evaluation Split',
    instruction: 'Set the held-out test fraction to a standard 0.20 (20% of the dataset reserved for final evaluation).',
    kind: 'parameters',
    concept: 'Train-test split',
    parameterGoal: { key: 'testFraction', min: 0.05, max: 0.5, target: 0.2, tolerance: 0.05 },
    hint: 'Reserving around 20% leaves 80% for training/validation while giving a reliable test estimate.',
  },
  {
    ...basic,
    id: 'w9-15',
    sequence: 'Mid-Term Capstone',
    title: 'Synthesis: Complete ML Pipeline',
    instruction: 'Order the end-to-end machine learning workflow from raw data to verified deployment.',
    kind: 'order',
    concept: 'End-to-end ML workflow',
    steps: [
      { id: 'eval', title: 'Evaluate on untouched test set' },
      { id: 'split', title: 'Split into train, validation, and test' },
      { id: 'collect', title: 'Collect and clean labelled data' },
      { id: 'train', title: 'Train and tune model on train/validation' },
    ],
    correctOrder: ['collect', 'split', 'train', 'eval'],
    hint: 'Split before training so test data never leaks into model selection.',
    discovery: {
      title: 'Mid-term synthesis',
      intuition: 'Every ML method—trees, k-NN, perceptrons, or neural nets—follows the same disciplined lifecycle.',
      example: 'Collect data → split cleanly → train & validate → evaluate once on test.',
      technical: 'Separating model selection (validation) from final reporting (test) prevents optimistic bias.',
    },
  },
  {
    ...basic,
    id: 'w9-16',
    sequence: 'Mid-Term Capstone',
    title: 'Capstone: Choose the Right Tool',
    instruction: 'You have 500 small tabular rows with clear categorical rules and must explain every prediction to a doctor. Which model is best?',
    kind: 'choice',
    concept: 'Model selection',
    advanced: true,
    unlockAfter: ['w9-15'],
    options: [
      { id: 'tree', title: 'Shallow Decision Tree (ID3)' },
      { id: 'deep_cnn', title: 'Deep 50-layer Convolutional Neural Network' },
      { id: 'kmeans', title: 'Unsupervised K-Means with no labels' },
    ],
    correctChoice: 'tree',
    hint: 'Small tabular data with interpretability favors decision trees over deep vision networks.',
  },
];

export const week09: WeekContent = {
  number: 9,
  module: 2,
  title: 'Mid-Term Evaluation',
  summary: 'Apply concepts from Weeks 1–8 in integrated evaluation checkpoints.',
  topics: ['Capstone review', 'Metrics', 'Transfer', 'Reflection'],
  visual: 'networks',
  status: 'vertical-slice',
  knowledgeConcepts: ['Entropy', 'k-NN', 'Confusion matrix', 'Convolution', 'Perceptron', 'MSE', 'Generalization'],
  sequences: [
    sequenceContract('w09-s01', 'Prepare Evaluation', 'Interpret constraints and dataset', ['choice', 'numeric'], 'eval fixture reproducibility', 4, 'Insufficient labels'),
    sequenceContract('w09-s02', 'Select Your Approach', 'Choose algorithms to meet objectives', ['sort', 'numeric', 'choice'], 'objective feasibility', 5, 'Nonobvious simpler baseline'),
    sequenceContract('w09-s03', 'Build & Test', 'Assemble reusable model pipeline', ['numeric', 'choice'], 'execution of pipeline and metrics', 7, 'Resource-efficient variant'),
    sequenceContract('w09-s04', 'Reflect & Improve', 'Diagnose errors and revise parameters', ['numeric', 'choice', 'parameters'], 'before/after evaluation evidence', 5, 'Tradeoff between objectives'),
    sequenceContract('w09-s05', 'Mid-Term Capstone', 'Integrate earlier lessons', ['order', 'choice'], 'multi-goal, deterministic validator', 2, 'Alternate compact solution'),
  ],
  puzzles,
};
