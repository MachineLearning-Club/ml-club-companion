import type { WeekContent, Puzzle } from '../core/types';
import { entropy } from '../core/algorithms';
import { sequenceContract } from '../content/authoring';

const basic = { week: 2, domain: 'Decision Trees' as const };

// Pre-computed values using real entropy() function
// Weather dataset: Day1 sunny+weak→no, Day2 sunny+strong→no, Day3 rainy+weak→yes,
//                  Day4 rainy+strong→yes, Day5 cloudy+weak→yes, Day6 cloudy+strong→yes
// Full set: 4 yes, 2 no → entropy([4/6, 2/6]) ≈ 0.9183
const fullEntropy = entropy([4 / 6, 2 / 6]); // ≈ 0.9183
// Weak subset: Day1(no), Day3(yes), Day5(yes) → 2yes 1no → entropy([2/3, 1/3])
// Strong subset: Day2(no), Day4(yes), Day6(yes) → 2yes 1no → entropy([2/3, 1/3])
const windSubsetEntropy = entropy([2 / 3, 1 / 3]); // ≈ 0.9183
// Information gain of wind = fullEntropy - windSubsetEntropy
const windIG = fullEntropy - windSubsetEntropy; // 0: wind does not reduce uncertainty
// Outlook subsets are all pure → IG = fullEntropy

const puzzles: Puzzle[] = [
  // ── Sequence 1: Read a Dataset ──────────────────────────────────────────────
  {
    ...basic,
    id: 'w2-01',
    sequence: 'Read a Dataset',
    title: 'Features vs Labels',
    instruction:
      'Sort each column from the weather dataset into the correct category. Columns: Outlook, Wind, PlayTennis.',
    kind: 'sort',
    concept: 'Input features vs target label',
    items: [
      { id: 'outlook', title: 'Outlook' },
      { id: 'wind', title: 'Wind' },
      { id: 'playtennis', title: 'PlayTennis' },
    ],
    buckets: [
      { id: 'feature', title: 'Input Feature' },
      { id: 'label', title: 'Target Label' },
    ],
    correctAssignments: { outlook: 'feature', wind: 'feature', playtennis: 'label' },
    hint: 'The label is what you are trying to predict. Everything else is a feature.',
  },
  {
    ...basic,
    id: 'w2-02',
    sequence: 'Read a Dataset',
    title: 'Spot the Label',
    instruction:
      'Which column is the target label in this dataset: Outlook, Wind, Humidity, PlayTennis?',
    kind: 'choice',
    concept: 'Target label identification',
    options: [
      { id: 'outlook', title: 'Outlook', detail: 'Sunny / rainy / cloudy' },
      { id: 'wind', title: 'Wind', detail: 'Weak / strong' },
      { id: 'humidity', title: 'Humidity', detail: 'High / normal' },
      { id: 'playtennis', title: 'PlayTennis', detail: 'Yes / no' },
    ],
    correctChoice: 'playtennis',
    hint: 'The label column holds the outcome you want the model to learn to predict.',
  },
  {
    ...basic,
    id: 'w2-03',
    sequence: 'Read a Dataset',
    title: 'Domain of a Feature',
    instruction:
      'The Outlook feature takes the values sunny, rainy, and cloudy. What is its domain?',
    kind: 'choice',
    concept: 'Categorical feature domain',
    options: [
      { id: 'numeric', title: 'Continuous numeric range', detail: 'e.g. 0.0 to 1.0' },
      { id: 'binary', title: 'Binary: yes / no' },
      { id: 'categorical', title: 'Categorical: {sunny, rainy, cloudy}' },
    ],
    correctChoice: 'categorical',
    hint: 'A finite set of named values is called a categorical (or nominal) domain.',
  },
  {
    ...basic,
    id: 'w2-04',
    sequence: 'Read a Dataset',
    title: 'Leakage Alert',
    instruction:
      'Which of these features could cause data leakage if used to predict whether a match was played?',
    kind: 'multi',
    concept: 'Data leakage',
    options: [
      { id: 'outlook', title: 'Outlook (weather forecast)' },
      { id: 'score', title: 'Final match score' },
      { id: 'wind', title: 'Wind speed' },
      { id: 'rained', title: 'Whether it rained during the match' },
    ],
    correctChoices: ['score', 'rained'],
    hint: 'A feature leaks the target when it is only knowable after the event you are predicting.',
  },
  {
    ...basic,
    id: 'w2-05',
    sequence: 'Read a Dataset',
    title: 'Steps to a Classifier',
    instruction:
      'Put the supervised-learning pipeline steps in the correct order.',
    kind: 'order',
    concept: 'Supervised learning pipeline',
    steps: [
      { id: 'evaluate', title: 'Evaluate on held-out test data' },
      { id: 'collect', title: 'Collect and label training data' },
      { id: 'train', title: 'Train the model' },
      { id: 'split', title: 'Split data into train / test sets' },
    ],
    correctOrder: ['collect', 'split', 'train', 'evaluate'],
    hint: 'You cannot evaluate a model you have not yet trained, and training requires labelled examples.',
  },

  // ── Sequence 2: Measure Uncertainty ─────────────────────────────────────────
  {
    ...basic,
    id: 'w2-06',
    sequence: 'Measure Uncertainty',
    title: 'Entropy of the Weather Dataset',
    instruction:
      'The weather dataset has 4 "yes" and 2 "no" labels. What is its entropy in bits? Give your answer to three decimal places.',
    kind: 'numeric',
    concept: 'Entropy',
    numeric: { expected: fullEntropy, tolerance: 0.001, unit: 'bits' },
    hint: 'Compute H(4/6, 2/6). A 50 / 50 split would have maximum binary entropy, but this dataset is not balanced.',
  },
  {
    ...basic,
    id: 'w2-07',
    sequence: 'Measure Uncertainty',
    title: 'More or Less Uncertain?',
    instruction:
      'Which label distribution has higher entropy: {5 yes, 1 no} or {3 yes, 3 no}?',
    kind: 'choice',
    concept: 'Comparing entropy',
    options: [
      { id: 'fiveone', title: '{5 yes, 1 no}', detail: 'One label strongly dominates' },
      { id: 'threethree', title: '{3 yes, 3 no}', detail: 'Perfectly balanced' },
    ],
    correctChoice: 'threethree',
    hint: 'Entropy is highest when every outcome is equally likely.',
    discovery: {
      title: 'Entropy peaks at balance',
      intuition: 'The more evenly spread the labels, the harder it is to predict any one of them.',
      example: 'H(5/6, 1/6) ≈ 0.65 bits; H(1/2, 1/2) = 1.0 bit.',
      technical:
        'For a binary variable H(p) = −p log₂p − (1−p) log₂(1−p). The maximum is 1 bit at p = 0.5.',
    },
  },
  {
    ...basic,
    id: 'w2-08',
    sequence: 'Measure Uncertainty',
    title: 'Entropy of a Pure Subset — Sunny',
    instruction:
      'Look at only the sunny days (Day 1 & 2). Both have label "no". What is the entropy of this subset?',
    kind: 'numeric',
    concept: 'Entropy of a pure set',
    numeric: { expected: 0, tolerance: 0.001, unit: 'bits' },
    hint: 'If every example in a set has the same label the set is pure — there is no uncertainty at all.',
  },
  {
    ...basic,
    id: 'w2-09',
    sequence: 'Measure Uncertainty',
    title: 'Entropy of a Pure Subset — Rainy',
    instruction:
      'Look at only the rainy days (Day 3 & 4). Both have label "yes". What is the entropy of this subset?',
    kind: 'numeric',
    concept: 'Entropy of a pure set',
    numeric: { expected: 0, tolerance: 0.001, unit: 'bits' },
    hint: 'All examples share one label: perfectly predictable, zero bits of uncertainty.',
  },
  {
    ...basic,
    id: 'w2-10',
    sequence: 'Measure Uncertainty',
    title: 'Entropy of a Pure Subset — Cloudy',
    instruction:
      'Look at only the cloudy days (Day 5 & 6). Both have label "yes". What is the entropy of this subset?',
    kind: 'numeric',
    concept: 'Entropy of a pure set',
    numeric: { expected: 0, tolerance: 0.001, unit: 'bits' },
    hint: 'A subset where every example shares the same label is called a pure leaf.',
    discovery: {
      title: 'Pure subsets need no further splitting',
      intuition:
        'Once all examples in a node share one label, the tree can stop growing there and just predict that label.',
      example:
        'All cloudy days → yes. No matter how many features remain, there is nothing left to learn.',
      technical:
        'Entropy = 0 iff all probability mass is on one class: H([1,0]) = −1·log₂1 − 0 = 0.',
    },
  },

  // ── Sequence 3: Choose a Split ───────────────────────────────────────────────
  {
    ...basic,
    id: 'w2-11',
    sequence: 'Choose a Split',
    title: 'Information Gain — Outlook',
    instruction:
      'All three outlook subsets (sunny, rainy, cloudy) are pure. What is the information gain of splitting by Outlook?',
    kind: 'numeric',
    concept: 'Information gain',
    numeric: { expected: fullEntropy, tolerance: 0.001, unit: 'bits' },
    hint: 'Information gain = parent entropy − weighted child entropy. If all children are pure their combined entropy is 0.',
  },
  {
    ...basic,
    id: 'w2-12',
    sequence: 'Choose a Split',
    title: 'Information Gain — Wind',
    instruction:
      'Each wind subset (weak: 2 yes 1 no; strong: 2 yes 1 no) is impure. What is the information gain of splitting by Wind? Give your answer to three decimal places.',
    kind: 'numeric',
    concept: 'Information gain',
    numeric: { expected: windIG, tolerance: 0.001, unit: 'bits' },
    hint: 'IG(Wind) = H(parent) − [½·H(weak) + ½·H(strong)]. Both subsets have the same entropy.',
  },
  {
    ...basic,
    id: 'w2-13',
    sequence: 'Choose a Split',
    title: 'Which Feature Splits First?',
    instruction:
      'ID3 chooses the feature with the highest information gain. Given IG(Outlook) ≈ 0.918 and IG(Wind) = 0, which feature should ID3 split on first?',
    kind: 'choice',
    concept: 'ID3 split criterion',
    options: [
      { id: 'outlook', title: 'Outlook', detail: 'IG ≈ 0.918 bits' },
      { id: 'wind', title: 'Wind', detail: 'IG = 0 bits' },
    ],
    correctChoice: 'outlook',
    hint: 'ID3 is greedy: it always selects the feature that removes the most uncertainty at each step.',
  },
  {
    ...basic,
    id: 'w2-14',
    sequence: 'Choose a Split',
    title: 'Conditional Entropy After Outlook Split',
    instruction:
      'After splitting by Outlook all three child nodes are pure. What is the weighted conditional entropy of the split?',
    kind: 'numeric',
    concept: 'Conditional entropy',
    numeric: { expected: 0.0, tolerance: 0.001, unit: 'bits' },
    hint: 'Conditional entropy = Σ (nᵢ/N)·H(child i). If every child has entropy 0, the sum is 0.',
  },
  {
    ...basic,
    id: 'w2-15',
    sequence: 'Choose a Split',
    title: 'Leaf Prediction — Sunny Branch',
    instruction:
      'After splitting on Outlook, the sunny branch contains only "no" examples. What label does that leaf predict?',
    kind: 'choice',
    concept: 'Leaf node prediction',
    options: [
      { id: 'yes', title: 'YES' },
      { id: 'no', title: 'NO' },
    ],
    correctChoice: 'no',
    hint: 'A pure leaf predicts the single class present in its examples.',
  },
  {
    ...basic,
    id: 'w2-16',
    sequence: 'Choose a Split',
    title: 'Steps to Compute Information Gain',
    instruction:
      'Put the steps for computing the information gain of a feature in the correct order.',
    kind: 'order',
    concept: 'Information gain algorithm',
    steps: [
      { id: 'weight', title: 'Weight each child entropy by its fraction of examples' },
      { id: 'parent', title: 'Compute entropy of the parent node' },
      { id: 'subtract', title: 'Subtract the weighted sum from parent entropy' },
      { id: 'group', title: 'Group examples by feature value' },
      { id: 'children', title: 'Compute entropy of each child group' },
    ],
    correctOrder: ['parent', 'group', 'children', 'weight', 'subtract'],
    hint: 'You need the parent entropy before you can measure how much the split reduces it.',
  },

  // ── Sequence 4: Grow a Tree ──────────────────────────────────────────────────
  {
    ...basic,
    id: 'w2-17',
    sequence: 'Grow a Tree',
    title: 'Connect the Tree',
    instruction:
      'Connect the nodes of the decision tree built on the weather dataset. Root splits on Outlook; each branch leads to a leaf.',
    kind: 'connect',
    concept: 'Tree structure',
    correctConnections: [
      ['root', 'sunny_leaf'],
      ['root', 'rainy_leaf'],
      ['root', 'cloudy_leaf'],
    ],
    hint: 'The root node has three outgoing edges — one for each value of Outlook.',
  },
  {
    ...basic,
    id: 'w2-18',
    sequence: 'Grow a Tree',
    title: 'Trace a Prediction — Sunny',
    instruction:
      'Trace the path through the tree to predict the label for a new example with Outlook = sunny.',
    kind: 'trace',
    concept: 'Tree prediction path',
    correctTrace: ['root', 'sunny_branch', 'leaf_no'],
    hint: 'Follow the edge that matches the feature value of the example.',
  },
  {
    ...basic,
    id: 'w2-19',
    sequence: 'Grow a Tree',
    title: 'Trace a Prediction — Rainy',
    instruction:
      'Trace the path through the tree to predict the label for a new example with Outlook = rainy.',
    kind: 'trace',
    concept: 'Tree prediction path',
    correctTrace: ['root', 'rainy_branch', 'leaf_yes'],
    hint: 'Each branch of the tree corresponds to one value of the split feature.',
  },
  {
    ...basic,
    id: 'w2-20',
    sequence: 'Grow a Tree',
    title: 'Unknown Feature Value',
    instruction:
      'A new example has Outlook = overcast — a value never seen in training. What does the ID3 tree do?',
    kind: 'choice',
    concept: 'Missing / unknown feature value handling',
    options: [
      { id: 'crash', title: 'Crashes — unknown value is not allowed' },
      { id: 'majority', title: 'Returns the majority label of the training set' },
      { id: 'random', title: 'Picks a random branch' },
    ],
    correctChoice: 'majority',
    hint: 'Most implementations fall back to the most common label when a branch is missing.',
  },
  {
    ...basic,
    id: 'w2-21',
    sequence: 'Grow a Tree',
    title: 'Training Accuracy',
    instruction:
      'The ID3 tree built from the weather dataset classifies every training example correctly. What is its training accuracy?',
    kind: 'numeric',
    concept: 'Training accuracy',
    numeric: { expected: 1.0, tolerance: 0.0, unit: '' },
    hint: 'All 6 examples are correctly classified. 6 / 6 = 1.0.',
  },
  {
    ...basic,
    id: 'w2-22',
    sequence: 'Grow a Tree',
    title: 'Is This Tree Overfitting?',
    instruction:
      'The tree achieves 100% training accuracy on 6 examples and was never tested on unseen data. What is the most accurate assessment?',
    kind: 'choice',
    concept: 'Overfitting',
    options: [
      { id: 'no', title: 'No — 100% training accuracy means the model is perfect' },
      { id: 'yes', title: 'Possibly — perfect fit on 6 examples may not generalise' },
      { id: 'unknown', title: 'Cannot assess without seeing the full model' },
    ],
    correctChoice: 'yes',
    hint: 'A tree that memorises 6 examples may fail on the 7th. Test accuracy on unseen data tells us.',
  },

  // ── Sequence 5: Generalise & Debug ───────────────────────────────────────────
  {
    ...basic,
    id: 'w2-23',
    sequence: 'Generalise & Debug',
    title: 'Predict: Rainy Day',
    instruction:
      'Using the trained weather tree (root → Outlook), what label does it predict for Outlook = rainy?',
    kind: 'choice',
    concept: 'Model prediction',
    options: [
      { id: 'yes', title: 'YES' },
      { id: 'no', title: 'NO' },
    ],
    correctChoice: 'yes',
    hint: 'Follow the rainy branch from the root.',
  },
  {
    ...basic,
    id: 'w2-24',
    sequence: 'Generalise & Debug',
    title: 'Predict: Sunny Day',
    instruction:
      'Using the same weather tree, what label does it predict for Outlook = sunny?',
    kind: 'choice',
    concept: 'Model prediction',
    options: [
      { id: 'yes', title: 'YES' },
      { id: 'no', title: 'NO' },
    ],
    correctChoice: 'no',
    hint: 'Follow the sunny branch from the root.',
  },
  {
    ...basic,
    id: 'w2-25',
    sequence: 'Generalise & Debug',
    title: 'Repair the Tree',
    instruction:
      'A buggy tree incorrectly labels "rainy → NO". Choose the correct label for the rainy branch.',
    kind: 'repair',
    concept: 'Tree debugging',
    options: [
      { id: 'yes', title: 'YES' },
      { id: 'no', title: 'NO' },
    ],
    correctChoice: 'yes',
    hint: 'In the training data, all rainy days had label "yes".',
  },
  {
    ...basic,
    id: 'w2-26',
    sequence: 'Generalise & Debug',
    title: 'Signs of Overfitting',
    instruction:
      'Which observation most strongly suggests that a decision tree is overfitting?',
    kind: 'choice',
    concept: 'Overfitting diagnosis',
    options: [
      { id: 'low', title: '70% training accuracy, 68% test accuracy' },
      { id: 'gap', title: '100% training accuracy, 50% test accuracy' },
      { id: 'equal', title: '80% training accuracy, 80% test accuracy' },
    ],
    correctChoice: 'gap',
    hint: 'Overfitting shows as a large gap between training and test accuracy.',
  },
  {
    ...basic,
    id: 'w2-27',
    sequence: 'Generalise & Debug',
    title: 'Causes of Overfitting',
    instruction:
      'Which of these are known causes of overfitting in a decision tree? Select all that apply.',
    kind: 'multi',
    concept: 'Overfitting causes',
    options: [
      { id: 'deep', title: 'Tree is too deep (many layers)' },
      { id: 'few', title: 'Too few training examples' },
      { id: 'lowentropy', title: 'Low entropy at the root' },
      { id: 'prune', title: 'Applying pruning' },
    ],
    correctChoices: ['deep', 'few'],
    hint: 'A very deep tree memorises training noise; too few examples leave insufficient signal.',
  },

  // ── Sequence 6: Decision Tree Checkpoint ────────────────────────────────────
  {
    ...basic,
    id: 'w2-28',
    sequence: 'Decision Tree Checkpoint',
    title: 'Build the Full Tree',
    instruction:
      'Connect the nodes of a decision tree trained on this 2-feature dataset:\n• A, high → yes  • A, low → yes  • B, high → no  • B, low → no\nThe tree splits on Feature1 first.',
    kind: 'connect',
    concept: 'ID3 tree construction',
    isCheckpoint: true,
    correctConnections: [
      ['root', 'A_branch'],
      ['root', 'B_branch'],
      ['A_branch', 'leaf_yes'],
      ['B_branch', 'leaf_no'],
    ],
    hint: 'All A examples are "yes" and all B examples are "no" — both children are pure leaves.',
  },
];

const advanced: Puzzle = {
  ...basic,
  id: 'w2-29',
  sequence: 'Decision Tree Checkpoint',
  title: 'Smaller but Equal',
  instruction:
    'Two trees achieve identical test accuracy on the weather dataset. Tree X has depth 1 (one split). Tree Y has depth 3 (three nested splits). Which should you prefer, and why?',
  kind: 'choice',
  concept: 'Occam\'s razor / model complexity',
  advanced: true,
  unlockAfter: ['w2-28'],
  options: [
    { id: 'x', title: 'Tree X — simpler model, same accuracy, easier to interpret' },
    { id: 'y', title: 'Tree Y — more splits, so it captured more information' },
    { id: 'either', title: 'Neither — accuracy is all that matters' },
  ],
  correctChoice: 'x',
  hint: 'All else equal, prefer the simplest explanation. This is Occam\'s razor.',
  discovery: {
    title: 'Prefer the simplest model',
    intuition:
      'When two models perform equally well on unseen data, the simpler one is less likely to have over-fitted noise in the training set.',
    example:
      'A single-split tree on Outlook (depth 1) achieves 100% on this training set. Adding extra splits cannot improve it — but could hurt generalisation.',
    technical:
      'Minimum Description Length and Bayesian model selection both penalise model complexity. Prefer the hypothesis with the fewest free parameters when likelihoods are equal.',
  },
};

export const week02: WeekContent = {
  number: 2,
  module: 1,
  title: 'Supervised Learning: ID3',
  summary: 'Build interpretable decision trees from labelled data.',
  topics: ['Entropy', 'Information gain', 'Tree construction', 'Overfitting'],
  visual: 'rules',
  status: 'vertical-slice',
  sequences: [
    sequenceContract(
      'w02-s01',
      'Read a Dataset',
      'Identify input and target variables in examples',
      ['sort', 'choice'],
      'extract categorical feature / label',
      5,
      'Spot leakage',
    ),
    sequenceContract(
      'w02-s02',
      'Measure Uncertainty',
      'Compute entropy for labelled subsets',
      ['numeric', 'choice'],
      'entropy calculator',
      5,
      'Compare competing distributions',
    ),
    sequenceContract(
      'w02-s03',
      'Choose a Split',
      'Evaluate information gain of candidate features',
      ['numeric', 'choice'],
      'conditional entropy and information gain',
      6,
      'Two equal-gain features',
    ),
    sequenceContract(
      'w02-s04',
      'Grow a Tree',
      'Construct and traverse an ID3 decision tree',
      ['connect', 'order', 'trace'],
      'ID3 train and predict with categorical values',
      6,
      'Equivalent minimal trees',
    ),
    sequenceContract(
      'w02-s05',
      'Generalise & Debug',
      'Inspect unseen examples, missing values and overfit',
      ['choice', 'repair', 'trace'],
      'hold-out predictions & fallback cases',
      5,
      'Adversarial missing feature',
    ),
    sequenceContract(
      'w02-s06',
      'Decision Tree Checkpoint',
      'Build an interpretable classifier end to end',
      ['connect', 'parameters', 'trace'],
      'accuracy and tree-structure constraints',
      2,
      'Optimise tree size',
    ),
  ],
  puzzles: [...puzzles, advanced],
};
