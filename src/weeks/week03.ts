import type { WeekContent, Puzzle } from '../core/types';
import { kMeansStep } from '../core/algorithms';
import { squaredDistance, euclideanDistance, runKMeans } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 3, domain: 'Clustering & Similarity' as const };

// Fixed dataset for Week 3 K-Means exercises
const points: [number, number][] = [
  [2, 2],   // A
  [4, 2],   // B
  [2, 4],   // C
  [8, 8],   // D
  [10, 8],  // E
  [8, 10],  // F
];
const initialCentroids: [number, number][] = [
  [2, 2],   // C1
  [10, 10], // C2
];

const sqDistC1ToC2 = squaredDistance(initialCentroids[0], initialCentroids[1]); // 128
const eucDistC1ToC2 = euclideanDistance(initialCentroids[0], initialCentroids[1]); // sqrt(128) ≈ 11.314
const step1 = kMeansStep(points, initialCentroids);
const kmeansTrace = runKMeans(points, initialCentroids);
const finalStep = kmeansTrace[kmeansTrace.length - 1];
const c0X = step1.centroids[0][0]; // 8/3 ≈ 2.667
const c1X = step1.centroids[1][0]; // 26/3 ≈ 8.667
const finalInertia = finalStep.inertia; // 96/9 ≈ 10.667

const puzzles: Puzzle[] = [
  // ── Sequence 1: See the Space ──────────────────────────────────────────────
  {
    ...basic,
    id: 'w3-01',
    sequence: 'See the Space',
    title: 'Squared Distance Between Centres',
    instruction:
      'Compute the squared Euclidean distance between C1 = (2, 2) and C2 = (10, 10): (x₁ − x₂)² + (y₁ − y₂)².',
    kind: 'numeric',
    concept: 'Squared Euclidean distance',
    numeric: { expected: sqDistC1ToC2, tolerance: 0, unit: '' },
    hint: 'Compute (10 − 2)² + (10 − 2)² = 8² + 8².',
  },
  {
    ...basic,
    id: 'w3-02',
    sequence: 'See the Space',
    title: 'Euclidean Distance Between Centres',
    instruction:
      'Compute the Euclidean distance between C1 = (2, 2) and C2 = (10, 10) to two decimal places.',
    kind: 'numeric',
    concept: 'Euclidean distance',
    numeric: { expected: eucDistC1ToC2, tolerance: 0.01, unit: 'units' },
    hint: 'Take the square root of the squared distance (√128).',
  },
  {
    ...basic,
    id: 'w3-03',
    sequence: 'See the Space',
    title: 'Nearest Point to C1',
    instruction:
      'Which point is closer to C1 = (2, 2): A = (2, 2) or D = (8, 8)?',
    kind: 'choice',
    concept: 'Distance comparison',
    options: [
      { id: 'A', title: 'A = (2, 2)', detail: 'Distance 0 from C1' },
      { id: 'D', title: 'D = (8, 8)', detail: 'Distance √72 from C1' },
    ],
    correctChoice: 'A',
    hint: 'A point at the exact coordinates of a centroid has distance 0 to it.',
  },

  // ── Sequence 2: Choose Initial Centers ─────────────────────────────────────
  {
    ...basic,
    id: 'w3-04',
    sequence: 'Choose Initial Centers',
    title: 'Unsupervised vs Supervised',
    instruction:
      'Unlike ID3 in Week 2, K-Means has no target labels in the training data. What does K-Means try to discover instead?',
    kind: 'choice',
    concept: 'Unsupervised learning',
    options: [
      { id: 'labels', title: 'Hidden ground-truth class names' },
      { id: 'groups', title: 'Natural groups of similar points based on distance' },
      { id: 'rules', title: 'IF/ELSE decision rules for predicting a target column' },
    ],
    correctChoice: 'groups',
    hint: 'Clustering algorithms group points that are close together in feature space without needing labels.',
  },
  {
    ...basic,
    id: 'w3-05',
    sequence: 'Choose Initial Centers',
    title: 'Counting Initial Centroids',
    instruction:
      'If you run K-Means with K = 2 on our 6-point dataset, how many initial centroids must you place before the first assignment step?',
    kind: 'numeric',
    concept: 'Hyperparameter K',
    numeric: { expected: 2, tolerance: 0, unit: 'centroids' },
    hint: 'The hyperparameter K directly specifies the number of clusters (and centroids).',
  },
  {
    ...basic,
    id: 'w3-06',
    sequence: 'Choose Initial Centers',
    title: 'Why Initialisation Matters',
    instruction:
      'What can go wrong if two initial centroids are placed right next to each other far away from one group of points?',
    kind: 'choice',
    concept: 'Centroid initialisation',
    options: [
      { id: 'local', title: 'K-Means may converge to a poor local optimum or leave a cluster empty' },
      { id: 'crash', title: 'Euclidean distance becomes negative' },
      { id: 'fixed', title: 'Nothing — K-Means always finds the global optimum' },
    ],
    correctChoice: 'local',
    hint: 'K-Means only guarantees convergence to a local minimum of inertia, not the global best.',
  },

  // ── Sequence 3: Assign Points ──────────────────────────────────────────────
  {
    ...basic,
    id: 'w3-07',
    sequence: 'Assign Points',
    title: 'Assign Points to Nearest Centroid',
    instruction:
      'Given C1 = (2, 2) and C2 = (10, 10), assign each point to its nearest cluster:\nA=(2,2), B=(4,2), C=(2,4), D=(8,8), E=(10,8), F=(8,10).',
    kind: 'sort',
    concept: 'Cluster assignment step',
    items: [
      { id: 'A', title: 'A = (2, 2)' },
      { id: 'B', title: 'B = (4, 2)' },
      { id: 'C', title: 'C = (2, 4)' },
      { id: 'D', title: 'D = (8, 8)' },
      { id: 'E', title: 'E = (10, 8)' },
      { id: 'F', title: 'F = (8, 10)' },
    ],
    buckets: [
      { id: 'c0', title: 'Cluster 0 (near 2,2)' },
      { id: 'c1', title: 'Cluster 1 (near 10,10)' },
    ],
    correctAssignments: { A: 'c0', B: 'c0', C: 'c0', D: 'c1', E: 'c1', F: 'c1' },
    hint: 'A, B, C have small coordinates (2–4); D, E, F have large coordinates (8–10).',
  },
  {
    ...basic,
    id: 'w3-08',
    sequence: 'Assign Points',
    title: 'Distance from B to C1',
    instruction:
      'Compute the squared distance from B = (4, 2) to C1 = (2, 2).',
    kind: 'numeric',
    concept: 'Point-to-centroid distance',
    numeric: { expected: squaredDistance([4, 2], [2, 2]), tolerance: 0, unit: '' },
    hint: '(4 − 2)² + (2 − 2)² = 4 + 0.',
  },
  {
    ...basic,
    id: 'w3-09',
    sequence: 'Assign Points',
    title: 'Tie-Breaking on the Boundary',
    instruction:
      'If a point lies at (6, 6), equidistant from C1 = (2, 2) and C2 = (10, 10), how does a deterministic K-Means implementation assign it?',
    kind: 'choice',
    concept: 'Deterministic tie-breaking',
    options: [
      { id: 'first', title: 'Assigns it to the lowest-indexed centroid (Cluster 0)' },
      { id: 'drop', title: 'Drops the point from the dataset' },
      { id: 'both', title: 'Assigns it to both clusters simultaneously' },
    ],
    correctChoice: 'first',
    hint: 'Standard hard K-Means assigns every point to exactly one cluster; `<` comparison keeps the first centroid on ties.',
  },

  // ── Sequence 4: Update Centroids ───────────────────────────────────────────
  {
    ...basic,
    id: 'w3-10',
    sequence: 'Update Centroids',
    title: 'New Centroid X — Cluster 0',
    instruction:
      'Cluster 0 contains A=(2,2), B=(4,2), C=(2,4). What is the x-coordinate of the updated centroid (rounded to 2+ decimals)?',
    kind: 'numeric',
    concept: 'Centroid mean update',
    numeric: { expected: c0X, tolerance: 0.01, unit: '' },
    hint: 'Average the x-coordinates: (2 + 4 + 2) / 3 = 8 / 3.',
  },
  {
    ...basic,
    id: 'w3-11',
    sequence: 'Update Centroids',
    title: 'New Centroid X — Cluster 1',
    instruction:
      'Cluster 1 contains D=(8,8), E=(10,8), F=(8,10). What is the x-coordinate of the updated centroid (rounded to 2+ decimals)?',
    kind: 'numeric',
    concept: 'Centroid mean update',
    numeric: { expected: c1X, tolerance: 0.01, unit: '' },
    hint: 'Average the x-coordinates: (8 + 10 + 8) / 3 = 26 / 3.',
  },
  {
    ...basic,
    id: 'w3-12',
    sequence: 'Update Centroids',
    title: 'Order the Lloyd Update',
    instruction:
      'Put the steps of a single K-Means update iteration in the right order.',
    kind: 'order',
    concept: 'Lloyd iteration',
    steps: [
      { id: 'mean', title: 'Recompute each centroid as the mean of its members' },
      { id: 'assign', title: 'Assign each point to its nearest centroid' },
      { id: 'inertia', title: 'Measure total inertia (sum of squared distances)' },
    ],
    correctOrder: ['assign', 'mean', 'inertia'],
    hint: 'First group points by current centres, then move each centre to its group mean.',
  },

  // ── Sequence 5: Iterate to Convergence ─────────────────────────────────────
  {
    ...basic,
    id: 'w3-13',
    sequence: 'Iterate to Convergence',
    title: 'Does K-Means Converge?',
    instruction:
      'When running Lloyd\'s algorithm on a finite dataset, is K-Means guaranteed to converge?',
    kind: 'choice',
    concept: 'K-Means convergence',
    options: [
      { id: 'yes_local', title: 'Yes, eventually (though not always to the global optimum)' },
      { id: 'yes_global', title: 'Yes, always to the unique global optimum' },
      { id: 'no', title: 'No — centroids can oscillate forever' },
    ],
    correctChoice: 'yes_local',
    hint: 'Each step strictly decreases or preserves inertia, and there are finitely many partitions.',
  },
  {
    ...basic,
    id: 'w3-14',
    sequence: 'Iterate to Convergence',
    title: 'Trace the K-Means Loop',
    instruction:
      'Trace the four-stage execution cycle of K-Means clustering.',
    kind: 'trace',
    concept: 'Algorithm execution trace',
    correctTrace: ['assign', 'centroids', 'check', 'repeat'],
    hint: 'Assign points → update centroids → check convergence → repeat if changed.',
  },
  {
    ...basic,
    id: 'w3-15',
    sequence: 'Iterate to Convergence',
    title: 'Inertia After Convergence',
    instruction:
      'After convergence, C0 = (8/3, 8/3) and C1 = (26/3, 26/3). What is the total inertia (sum of squared distances from every point to its centroid)?',
    kind: 'numeric',
    concept: 'Cluster inertia',
    numeric: { expected: finalInertia, tolerance: 0.01, unit: '' },
    hint: 'Sum the squared distances of A, B, C to (8/3, 8/3) and D, E, F to (26/3, 26/3): 96 / 9 ≈ 10.67.',
  },

  // ── Sequence 6: Clustering Checkpoint ──────────────────────────────────────
  {
    ...basic,
    id: 'w3-16',
    sequence: 'Clustering Checkpoint',
    title: 'What Happens When K = 1?',
    instruction:
      'If you set K = 1 in K-Means, what does the algorithm always produce?',
    kind: 'choice',
    concept: 'Edge case K=1',
    options: [
      { id: 'one', title: 'All points placed in a single cluster centred at the dataset mean' },
      { id: 'error', title: 'An error because at least two clusters are required' },
      { id: 'zero', title: 'Zero inertia' },
    ],
    correctChoice: 'one',
    hint: 'With one centroid, every point is closest to that single centroid.',
  },
  {
    ...basic,
    id: 'w3-17',
    sequence: 'Clustering Checkpoint',
    title: 'Choose the Natural K',
    instruction:
      'Our 6 points form two tight groups: {A, B, C} near (2,2) and {D, E, F} near (8,8). Set K to the number that separates these two natural groups.',
    kind: 'parameters',
    concept: 'Selecting K',
    isCheckpoint: true,
    parameterGoal: { key: 'k', min: 1, max: 5, target: 2, tolerance: 0 },
    hint: 'Count the distinct well-separated blobs in the 2D plane.',
  },
];

const advanced: Puzzle = {
  ...basic,
  id: 'w3-18',
  sequence: 'Clustering Checkpoint',
  title: 'Inertia vs K (Elbow Method)',
  instruction:
    'On our 6-point dataset, we compare K = 2 (inertia ≈ 10.67) and K = 3. Which statement is always true when increasing K from 2 to 3?',
  kind: 'choice',
  concept: 'Elbow method',
  advanced: true,
  unlockAfter: ['w3-17'],
  options: [
    { id: 'lower', title: 'Larger K allows lower or equal inertia — up to 0 when K = N' },
    { id: 'higher', title: 'Larger K increases inertia because there are more centroids' },
    { id: 'same', title: 'Inertia is independent of K' },
  ],
  correctChoice: 'lower',
  hint: 'Adding more centroids gives points closer centres to choose from, so inertia never increases.',
  discovery: {
    title: 'Why we need the elbow method',
    intuition:
      'You cannot pick K simply by minimising inertia, because K = N (one cluster per point) always gives inertia = 0.',
    example:
      'At K = 2 inertia drops sharply from the K = 1 baseline to 10.67. Going from K = 2 to K = 3 gives a much smaller drop — the "elbow" is at K = 2.',
    technical:
      'Within-cluster sum of squares (WCSS) is monotonically non-increasing in K. Model selection balances WCSS against K (elbow heuristic, silhouette score, or BIC).',
  },
};

export const week03: WeekContent = {
  number: 3,
  module: 1,
  title: 'Unsupervised Learning: K-Means',
  summary: 'Discover patterns through distance and centroid iteration.',
  topics: ['Euclidean distance', 'Centroids', 'K-Means convergence', 'Inertia & elbow method'],
  visual: 'clusters',
  status: 'vertical-slice',
  sequences: [
    sequenceContract(
      'w03-s01',
      'See the Space',
      'Understand 2D data and Euclidean distance',
      ['numeric', 'choice'],
      'euclidean/squared distances',
      3,
      'Tie between nearest centroids',
    ),
    sequenceContract(
      'w03-s02',
      'Choose Initial Centers',
      'Place valid initial centroids',
      ['parameters', 'choice'],
      'validate center count and coordinates',
      3,
      'Bad initialization',
    ),
    sequenceContract(
      'w03-s03',
      'Assign Points',
      'Assign each point to the nearest center',
      ['sort', 'connect', 'numeric'],
      'nearest-center deterministic ties',
      3,
      'Voronoi boundary',
    ),
    sequenceContract(
      'w03-s04',
      'Update Centroids',
      'Recompute cluster centers from assignments',
      ['numeric', 'order'],
      'arithmetic mean per cluster',
      3,
      'Empty clusters',
    ),
    sequenceContract(
      'w03-s05',
      'Iterate to Convergence',
      'Execute and inspect Lloyd iterations',
      ['trace', 'parameters'],
      'k-means trace and convergence',
      3,
      'Local optima',
    ),
    sequenceContract(
      'w03-s06',
      'Clustering Checkpoint',
      'Group a dataset and evaluate the result',
      ['parameters', 'trace', 'numeric'],
      'run complete clustering, inertia and silhouette checks',
      3,
      'Compare different K values',
    ),
  ],
  puzzles: [...puzzles, advanced],
};
