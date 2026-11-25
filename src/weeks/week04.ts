import type { WeekContent, Puzzle } from '../core/types';
import { knnClassify } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 4, domain: 'Foundations' as const };

// Confusion matrix values: TP=40, TN=35, FP=10, FN=15
const TP = 40;
const TN = 35;
const FP = 10;
const FN = 15;
const total = TP + TN + FP + FN; // 100
const accuracy = (TP + TN) / total; // 0.75
const precision = TP / (TP + FP); // 0.8
const recall = TP / (TP + FN); // 40/55 ≈ 0.7273

// Real KNN classification check
const knnSamples = [
  { features: [1, 1], label: 1 },
  { features: [1.5, 1.2], label: 1 },
  { features: [5, 5], label: 0 },
  { features: [6, 5], label: 0 },
];
const knnPred = knnClassify(knnSamples, [1.2, 1.1], 3); // 1

const puzzles: Puzzle[] = [
  // ── Sequence 1: Recognise the Problem ───────────────────────────────────────
  {
    ...basic,
    id: 'w4-01',
    sequence: 'Recognise the Problem',
    title: 'Supervised or Unsupervised?',
    instruction:
      'Sort each ML task into Supervised (has target labels) or Unsupervised (no target labels).',
    kind: 'sort',
    concept: 'Supervised vs unsupervised learning',
    items: [
      { id: 'cls', title: 'Classify emails as spam / ham' },
      { id: 'seg', title: 'Segment customers into groups' },
      { id: 'det', title: 'Detect fraud from labelled transactions' },
      { id: 'clu', title: 'Find natural clusters in sensor readings' },
    ],
    buckets: [
      { id: 'sup', title: 'Supervised' },
      { id: 'uns', title: 'Unsupervised' },
    ],
    correctAssignments: { cls: 'sup', seg: 'uns', det: 'sup', clu: 'uns' },
    hint: 'Ask yourself: does the training data include the answer we want to predict?',
  },
  {
    ...basic,
    id: 'w4-02',
    sequence: 'Recognise the Problem',
    title: 'When to Cluster',
    instruction:
      'A music app has listening histories for 10,000 users but no pre-defined listener categories. Which approach fits best?',
    kind: 'choice',
    concept: 'Problem formulation',
    options: [
      { id: 'id3', title: 'ID3 Decision Tree', detail: 'Requires categorical target labels' },
      { id: 'kmeans', title: 'K-Means Clustering', detail: 'Discovers groups from feature similarity' },
      { id: 'thresh', title: '1D Threshold Classifier', detail: 'Requires binary labels' },
    ],
    correctChoice: 'kmeans',
    hint: 'Without labels, you need an unsupervised clustering method.',
  },
  {
    ...basic,
    id: 'w4-03',
    sequence: 'Recognise the Problem',
    title: 'Need for Interpretability',
    instruction:
      'A hospital wants a model whose decisions doctors can read as clear IF/ELSE rules. Which algorithm naturally provides this?',
    kind: 'choice',
    concept: 'Model interpretability',
    options: [
      { id: 'id3', title: 'ID3 Decision Tree' },
      { id: 'kmeans', title: 'K-Means Clustering' },
      { id: 'knn', title: 'K-Nearest Neighbours' },
    ],
    correctChoice: 'id3',
    hint: 'Every root-to-leaf path in a decision tree is an explicit conjunction of feature conditions.',
  },
  {
    ...basic,
    id: 'w4-04',
    sequence: 'Recognise the Problem',
    title: 'Identify Supervised Methods',
    instruction:
      'Which of these algorithms require labelled training examples? Select all that apply.',
    kind: 'multi',
    concept: 'Supervised algorithms',
    options: [
      { id: 'id3', title: 'ID3 Decision Tree' },
      { id: 'kmeans', title: 'K-Means Clustering' },
      { id: 'threshold', title: 'Threshold Classifier' },
      { id: 'knn', title: 'K-Nearest Neighbours (KNN)' },
    ],
    correctChoices: ['id3', 'threshold', 'knn'],
    hint: 'Three of these predict a target label from labelled examples; one groups unlabelled points.',
  },

  // ── Sequence 2: Compare Algorithms ──────────────────────────────────────────
  {
    ...basic,
    id: 'w4-05',
    sequence: 'Compare Algorithms',
    title: 'K-Means vs KNN',
    instruction:
      'Both K-Means and KNN have a parameter K and use distance. What is the key difference between them?',
    kind: 'choice',
    concept: 'K-Means vs KNN',
    options: [
      { id: 'diff', title: 'K-Means is unsupervised (finds K clusters); KNN is supervised (votes among K labelled neighbours)' },
      { id: 'same', title: 'They are the same algorithm with different names' },
      { id: 'tree', title: 'KNN builds a decision tree while K-Means uses entropy' },
    ],
    correctChoice: 'diff',
    hint: 'In K-Means, K is the number of clusters; in KNN, K is the number of nearest labelled neighbours.',
  },
  {
    ...basic,
    id: 'w4-06',
    sequence: 'Compare Algorithms',
    title: 'KNN Majority Vote',
    instruction:
      'A 3-NN classifier finds the 3 closest training points to query (1.2, 1.1): two have label 1 and one has label 0. What label does 3-NN predict?',
    kind: 'numeric',
    concept: 'KNN classification',
    numeric: { expected: knnPred, tolerance: 0, unit: '' },
    hint: 'KNN takes the majority vote among the K nearest neighbours.',
  },
  {
    ...basic,
    id: 'w4-07',
    sequence: 'Compare Algorithms',
    title: 'Splitting Criterion in ID3',
    instruction:
      'What metric does ID3 maximise when choosing which feature to split on next?',
    kind: 'choice',
    concept: 'ID3 vs K-Means objective',
    options: [
      { id: 'ig', title: 'Information gain (reduction in entropy)' },
      { id: 'inertia', title: 'Within-cluster inertia' },
      { id: 'euclid', title: 'Euclidean distance to the origin' },
    ],
    correctChoice: 'ig',
    hint: 'ID3 uses entropy to pick the most informative feature split.',
  },

  // ── Sequence 3: Test Generalisation ─────────────────────────────────────────
  {
    ...basic,
    id: 'w4-08',
    sequence: 'Test Generalisation',
    title: 'Compute Accuracy',
    instruction:
      'A test evaluation yields TP = 40, TN = 35, FP = 10, FN = 15 (100 total). What is the accuracy (as a decimal between 0 and 1)?',
    kind: 'numeric',
    concept: 'Accuracy from confusion matrix',
    numeric: { expected: accuracy, tolerance: 0.001, unit: '' },
    hint: 'Accuracy = (TP + TN) / (TP + TN + FP + FN).',
  },
  {
    ...basic,
    id: 'w4-09',
    sequence: 'Test Generalisation',
    title: 'Compute Precision',
    instruction:
      'Using the same confusion matrix (TP = 40, TN = 35, FP = 10, FN = 15), what is the precision = TP / (TP + FP)?',
    kind: 'numeric',
    concept: 'Precision',
    numeric: { expected: precision, tolerance: 0.001, unit: '' },
    hint: 'Precision is the fraction of positive predictions that were actually positive: 40 / (40 + 10).',
  },
  {
    ...basic,
    id: 'w4-10',
    sequence: 'Test Generalisation',
    title: 'Compute Recall',
    instruction:
      'Using the same confusion matrix (TP = 40, TN = 35, FP = 10, FN = 15), what is the recall = TP / (TP + FN) to 2+ decimal places?',
    kind: 'numeric',
    concept: 'Recall',
    numeric: { expected: recall, tolerance: 0.01, unit: '' },
    hint: 'Recall is the fraction of actual positives that were caught: 40 / (40 + 15).',
  },
  {
    ...basic,
    id: 'w4-11',
    sequence: 'Test Generalisation',
    title: 'The Imbalanced Dataset Trap',
    instruction:
      'In a medical screening dataset, 99% of patients are healthy and 1% have the condition. A model predicts "healthy" for everyone and gets 99% accuracy. Why is accuracy misleading here?',
    kind: 'choice',
    concept: 'Class imbalance',
    options: [
      { id: 'recall', title: 'It has 0% recall on the minority class — it misses every sick patient' },
      { id: 'fast', title: '99% accuracy means the model is nearly optimal' },
      { id: 'overfit', title: 'The model is overfitting the 1% positive examples' },
    ],
    correctChoice: 'recall',
    hint: 'Look at precision and recall for the rare class, not just overall accuracy.',
    discovery: {
      title: 'Accuracy hides minority-class failure',
      intuition:
        'When one class dominates, a trivial majority-class predictor scores high accuracy while being completely useless.',
      example:
        'With 990 healthy and 10 sick patients, predicting "healthy" for all gives TP=0, FN=10: 99% accuracy, 0% recall.',
      technical:
        'Evaluate imbalanced classifiers using precision, recall, F1-score, or PR-AUC rather than raw accuracy.',
    },
  },

  // ── Sequence 4: Repair a Pipeline ───────────────────────────────────────────
  {
    ...basic,
    id: 'w4-12',
    sequence: 'Repair a Pipeline',
    title: 'Order the Evaluation Pipeline',
    instruction:
      'Arrange the ML workflow stages in the correct order to avoid data leakage.',
    kind: 'order',
    concept: 'Leak-free pipeline',
    steps: [
      { id: 'eval', title: 'Evaluate on the untouched test set' },
      { id: 'split', title: 'Split data into train and test sets' },
      { id: 'fit', title: 'Fit preprocessing and model on train set only' },
      { id: 'collect', title: 'Collect raw dataset' },
    ],
    correctOrder: ['collect', 'split', 'fit', 'eval'],
    hint: 'Always split BEFORE fitting any preprocessing or model parameters.',
  },
  {
    ...basic,
    id: 'w4-13',
    sequence: 'Repair a Pipeline',
    title: 'Fix the Scaling Leak',
    instruction:
      'A pipeline computes the mean and standard deviation across the ENTIRE dataset (train + test) before splitting. How do you repair it?',
    kind: 'repair',
    concept: 'Preventing preprocessing leakage',
    options: [
      { id: 'fix', title: 'Split first, then compute mean/std on train only and apply to test' },
      { id: 'keep', title: 'Keep as-is — scaling does not use labels so it cannot leak' },
      { id: 'drop', title: 'Remove the test set completely' },
    ],
    correctChoice: 'fix',
    hint: 'Test statistics must never influence training transformations.',
  },
  {
    ...basic,
    id: 'w4-14',
    sequence: 'Repair a Pipeline',
    title: 'Trace a Leakage Failure',
    instruction:
      'Trace what happens when a leaking feature (such as a post-event ID) is left in the training data.',
    kind: 'trace',
    concept: 'Leakage impact trace',
    correctTrace: ['leakage_in_features', 'high_test_score', 'fails_in_production'],
    hint: 'The model looks great in offline evaluation because the test set also has the leak, then fails on real new inputs.',
  },
  {
    ...basic,
    id: 'w4-15',
    sequence: 'Repair a Pipeline',
    title: 'Match Algorithm to Task',
    instruction:
      'Connect each algorithm to its best-matched scenario.',
    kind: 'connect',
    concept: 'Algorithm selection',
    correctConnections: [
      ['id3', 'interpretable_rules'],
      ['kmeans', 'customer_segments'],
      ['knn', 'nearest_examples'],
    ],
    hint: 'ID3 → rules; K-Means → unlabelled segments; KNN → similarity to stored examples.',
  },

  // ── Sequence 5: Applied Review ──────────────────────────────────────────────
  {
    ...basic,
    id: 'w4-16',
    sequence: 'Applied Review',
    title: 'Connect Metrics to Meanings',
    instruction:
      'Connect each evaluation metric to what it measures.',
    kind: 'connect',
    concept: 'Evaluation metrics',
    correctConnections: [
      ['accuracy', 'overall_correct'],
      ['precision', 'positive_predictive_value'],
      ['inertia', 'cluster_compactness'],
    ],
    hint: 'Inertia is for unsupervised clustering; accuracy and precision are for supervised classification.',
  },
  {
    ...basic,
    id: 'w4-17',
    sequence: 'Applied Review',
    title: 'Set K for 3-Class Nearest Neighbours',
    instruction:
      'To avoid 2-way ties in a binary KNN classifier while keeping the neighbourhood small, set K to the smallest odd integer greater than 1.',
    kind: 'parameters',
    concept: 'Hyperparameter tuning',
    isCheckpoint: true,
    parameterGoal: { key: 'k', min: 1, max: 9, target: 3, tolerance: 0 },
    hint: 'K = 1 is sensitive to noise; K = 2 can tie. What is the next odd number?',
  },
];

const advanced: Puzzle = {
  ...basic,
  id: 'w4-18',
  sequence: 'Applied Review',
  title: 'Hybrid Pipeline: Cluster Then Classify',
  instruction:
    'You have 10,000 unlabelled customer records and 200 labelled ones. How can you combine K-Means and ID3 in one pipeline?',
  kind: 'choice',
  concept: 'Combining unsupervised and supervised learning',
  advanced: true,
  unlockAfter: ['w4-17'],
  options: [
    { id: 'hybrid', title: 'Run K-Means on all 10,000 records to create a cluster-ID feature, then train ID3 on the 200 labelled ones' },
    { id: 'discard', title: 'Discard the 10,000 unlabelled records because ID3 cannot use them' },
    { id: 'reverse', title: 'Run ID3 on the unlabelled records first to invent labels' },
  ],
  correctChoice: 'hybrid',
  hint: 'Unsupervised cluster assignments can serve as an engineered feature for a downstream supervised model.',
  discovery: {
    title: 'Semi-supervised feature engineering',
    intuition:
      'Unlabelled data still reveals structure in feature space. Clustering captures that structure as a compact feature.',
    example:
      'Customer segments discovered by K-Means on 10,000 users help an ID3 tree generalise better from just 200 labelled examples.',
    technical:
      'Using cluster assignments or distances to centroids as features is a classic semi-supervised representation technique.',
  },
};

export const week04: WeekContent = {
  number: 4,
  module: 2,
  title: 'Revision: Supervised and Unsupervised Learning',
  summary: 'Combine supervised and unsupervised methods.',
  topics: ['Model comparison', 'Confusion matrix', 'Pipeline repair', 'Evaluation'],
  visual: 'clusters',
  status: 'vertical-slice',
  sequences: [
    sequenceContract(
      'w04-s01',
      'Recognise the Problem',
      'Select suitable supervised/unsupervised methods',
      ['choice', 'sort'],
      'task based method selection',
      4,
      'Ambiguous labels',
    ),
    sequenceContract(
      'w04-s02',
      'Compare Algorithms',
      'Contrast ID3, K-Means and KNN',
      ['choice', 'numeric'],
      'algorithm-specific metrics',
      3,
      'Similar outcomes from different methods',
    ),
    sequenceContract(
      'w04-s03',
      'Test Generalisation',
      'Evaluate data splits and edge cases',
      ['numeric', 'choice'],
      'confusion matrix and holdout accuracy',
      4,
      'Class imbalance',
    ),
    sequenceContract(
      'w04-s04',
      'Repair a Pipeline',
      'Find flawed data processing steps',
      ['order', 'connect', 'trace'],
      'pipeline execution and data leakage checks',
      4,
      'Alternative repair',
    ),
    sequenceContract(
      'w04-s05',
      'Applied Review',
      'Combine two ML approaches on one scenario',
      ['connect', 'parameters'],
      'multiple objective criterion',
      3,
      'Optimize both metrics',
    ),
  ],
  puzzles: [...puzzles, advanced],
};
