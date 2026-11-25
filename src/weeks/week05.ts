import type { WeekContent, Puzzle } from '../core/types';
import { convolve2D, knnClassify } from '../core/simulations';
import { sequenceContract } from '../content/authoring';

const basic = { week: 5, domain: 'Computer Vision' as const };

// Verified 2D convolution examples computed with real convolve2D()
const img2x2 = [
  [1, 2],
  [3, 4],
];
const img3x3 = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
const diffKernel = [
  [1, 0],
  [0, -1],
];
const conv2x2Val = convolve2D(img2x2, diffKernel, { padding: 'valid' })[0][0]; // -3
const conv3x3 = convolve2D(img3x3, diffKernel, { padding: 'valid' }); // [[-4, -4], [-4, -4]]
const conv3x3TopLeft = conv3x3[0][0]; // -4
const conv3x3Same = convolve2D(img3x3, diffKernel, { padding: 'same' });
const conv3x3SameHeight = conv3x3Same.length; // 3

// Box blur kernel on 3x3 uniform-gradient patch
const boxKernel = [
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
  [1 / 9, 1 / 9, 1 / 9],
];
const boxMean = convolve2D(img3x3, boxKernel, { padding: 'valid' })[0][0]; // 5

// KNN digit classification from flattened 2x2 pixel patches
const digitSamples = [
  { features: [0, 255, 0, 255], label: 1 },
  { features: [255, 255, 255, 255], label: 8 },
  { features: [255, 255, 0, 0], label: 7 },
];
const queryDigit = knnClassify(digitSamples, [10, 250, 5, 245], 1); // 1

const puzzles: Puzzle[] = [
  // ── Sequence 1: Pictures Are Numbers ────────────────────────────────────────
  {
    ...basic,
    id: 'w5-01',
    sequence: 'Pictures Are Numbers',
    title: 'Counting Pixels in 28×28',
    instruction:
      'A classic handwritten-digit image is 28 pixels wide and 28 pixels tall. How many pixels does it contain in total?',
    kind: 'numeric',
    concept: 'Image dimensions',
    numeric: { expected: 28 * 28, tolerance: 0, unit: 'pixels' },
    hint: 'Multiply width × height: 28 × 28.',
  },
  {
    ...basic,
    id: 'w5-02',
    sequence: 'Pictures Are Numbers',
    title: 'What Does Pixel Value 0 Mean?',
    instruction:
      'In standard 8-bit grayscale (0 to 255), what colour does a pixel value of 0 represent?',
    kind: 'choice',
    concept: 'Grayscale intensity',
    options: [
      { id: 'black', title: 'Black (no light intensity)' },
      { id: 'white', title: 'White (maximum intensity)' },
      { id: 'gray', title: 'Mid-gray' },
    ],
    correctChoice: 'black',
    hint: '0 means zero brightness; 255 is full brightness (white).',
  },
  {
    ...basic,
    id: 'w5-03',
    sequence: 'Pictures Are Numbers',
    title: 'RGB Channel Count',
    instruction:
      'A standard colour image stores Red, Green, and Blue intensities at every pixel. How many colour channels does an RGB image have?',
    kind: 'numeric',
    concept: 'RGB colour channels',
    numeric: { expected: 3, tolerance: 0, unit: 'channels' },
    hint: 'Count the letters in R-G-B.',
  },
  {
    ...basic,
    id: 'w5-04',
    sequence: 'Pictures Are Numbers',
    title: 'Order From Darkest to Lightest',
    instruction:
      'Arrange these 8-bit grayscale pixel intensities from darkest to lightest.',
    kind: 'order',
    concept: 'Pixel intensity ordering',
    steps: [
      { id: 'p200', title: '200' },
      { id: 'p0', title: '0' },
      { id: 'p255', title: '255' },
      { id: 'p128', title: '128' },
    ],
    correctOrder: ['p0', 'p128', 'p200', 'p255'],
    hint: 'Smaller numbers are darker; 255 is pure white.',
  },

  // ── Sequence 2: Transform a Picture ─────────────────────────────────────────
  {
    ...basic,
    id: 'w5-05',
    sequence: 'Transform a Picture',
    title: 'Normalise a Pixel to [0, 1]',
    instruction:
      'Before feeding pixel intensities into a model, we divide by 255. What is the normalised value of a pixel with intensity 255?',
    kind: 'numeric',
    concept: 'Pixel normalisation',
    numeric: { expected: 1, tolerance: 0, unit: '' },
    hint: 'Compute 255 / 255.',
  },
  {
    ...basic,
    id: 'w5-06',
    sequence: 'Transform a Picture',
    title: 'Brightness Clipping',
    instruction:
      'An 8-bit pixel has value 220 and you add +60 brightness. Clamped to [0, 255], what is the resulting pixel value?',
    kind: 'numeric',
    concept: 'Intensity clipping',
    numeric: { expected: 255, tolerance: 0, unit: '' },
    hint: '220 + 60 = 280, which exceeds the 8-bit maximum of 255.',
  },
  {
    ...basic,
    id: 'w5-07',
    sequence: 'Transform a Picture',
    title: 'Total Values in an RGB Image',
    instruction:
      'A tiny 10×10 RGB image has 3 channels per pixel. How many numbers in total are stored in its tensor?',
    kind: 'numeric',
    concept: 'Image tensor size',
    numeric: { expected: 10 * 10 * 3, tolerance: 0, unit: 'values' },
    hint: 'Multiply height × width × channels: 10 × 10 × 3.',
  },

  // ── Sequence 3: Convolution & Kernels ───────────────────────────────────────
  {
    ...basic,
    id: 'w5-08',
    sequence: 'Convolution & Kernels',
    title: 'Convolve a 2×2 Patch',
    instruction:
      'Convolve image [[1, 2], [3, 4]] with kernel [[1, 0], [0, −1]] using valid padding. What is the single output value?',
    kind: 'numeric',
    concept: '2D convolution',
    numeric: { expected: conv2x2Val, tolerance: 0, unit: '' },
    hint: 'Multiply element-wise and sum: 1×1 + 2×0 + 3×0 + 4×(−1).',
  },
  {
    ...basic,
    id: 'w5-09',
    sequence: 'Convolution & Kernels',
    title: 'Convolve a 3×3 Image',
    instruction:
      'Convolve [[1, 2, 3], [4, 5, 6], [7, 8, 9]] with kernel [[1, 0], [0, −1]] (valid padding). What is the top-left output value result[0][0]?',
    kind: 'numeric',
    concept: '2D convolution sliding window',
    numeric: { expected: conv3x3TopLeft, tolerance: 0, unit: '' },
    hint: 'Apply the 2×2 kernel to the top-left 2×2 window [[1, 2], [4, 5]]: 1×1 + 2×0 + 4×0 + 5×(−1).',
    discovery: {
      title: 'Kernels slide across the image',
      intuition:
        'A 2×2 kernel produces one output number for each 2×2 window it visits, turning a 3×3 grid into a 2×2 feature map.',
      example:
        'Every 2×2 window in [[1,2,3],[4,5,6],[7,8,9]] has bottom-right − top-left = 4, so the kernel [[1,0],[0,-1]] outputs [[-4,-4],[-4,-4]].',
      technical:
        'With valid padding, an H×W image convolved with a k_h×k_w kernel yields an output of shape (H − k_h + 1) × (W − k_w + 1).',
    },
  },
  {
    ...basic,
    id: 'w5-10',
    sequence: 'Convolution & Kernels',
    title: 'Same Padding Output Height',
    instruction:
      'If you convolve a 3×3 image with a 2×2 kernel using "same" padding, what is the height of the output matrix?',
    kind: 'numeric',
    concept: 'Same padding',
    numeric: { expected: conv3x3SameHeight, tolerance: 0, unit: 'pixels' },
    hint: '"Same" padding pads the borders so the output keeps the input dimensions.',
  },
  {
    ...basic,
    id: 'w5-11',
    sequence: 'Convolution & Kernels',
    title: 'Trace a Convolution Step',
    instruction:
      'Trace the four steps to compute one output pixel of a 2D convolution.',
    kind: 'trace',
    concept: 'Convolution execution',
    correctTrace: ['align_kernel', 'multiply_elements', 'sum_products', 'write_output'],
    hint: 'Position the kernel over the patch, multiply element-wise, sum, and store at the output cell.',
  },

  // ── Sequence 4: See the Edges ───────────────────────────────────────────────
  {
    ...basic,
    id: 'w5-12',
    sequence: 'See the Edges',
    title: 'Box Blur on a 3×3 Patch',
    instruction:
      'Convolve [[1, 2, 3], [4, 5, 6], [7, 8, 9]] with a 3×3 averaging kernel (every entry = 1/9, valid padding). What is the output value?',
    kind: 'numeric',
    concept: 'Smoothing / box blur',
    numeric: { expected: boxMean, tolerance: 0.01, unit: '' },
    hint: 'A 3×3 box filter computes the mean of all 9 numbers: (1+2+…+9) / 9.',
  },
  {
    ...basic,
    id: 'w5-13',
    sequence: 'See the Edges',
    title: 'What Does an Edge Filter Output on a Flat Region?',
    instruction:
      'Every pixel in a 3×3 patch has value 100. You apply the edge kernel [[1, 0], [0, −1]]. What is the output everywhere?',
    kind: 'choice',
    concept: 'Edge detection invariance',
    options: [
      { id: 'zero', title: '0 — no change means no edge' },
      { id: 'hundred', title: '100 — it preserves the pixel value' },
      { id: 'twohundred', title: '200 — it doubles flat regions' },
    ],
    correctChoice: 'zero',
    hint: '100×1 + 100×(−1) = 0. Edge kernels respond only where intensity changes.',
  },
  {
    ...basic,
    id: 'w5-14',
    sequence: 'See the Edges',
    title: 'Choose Blur vs Edge Kernel',
    instruction:
      'You want to reduce high-frequency salt-and-pepper noise before running edge detection. Which kernel type should you apply first?',
    kind: 'choice',
    concept: 'Smoothing before edge detection',
    options: [
      { id: 'blur', title: 'Smoothing / blur kernel (positive weights summing to 1)' },
      { id: 'edge', title: 'Sharpening / edge kernel (positive and negative weights summing to 0)' },
    ],
    correctChoice: 'blur',
    hint: 'Edge kernels amplify noise; smoothing first suppresses isolated noisy pixels.',
  },
  {
    ...basic,
    id: 'w5-15',
    sequence: 'See the Edges',
    title: 'Set Kernel Size for a 3×3 Filter',
    instruction:
      'Set the kernel width parameter k for a standard 3×3 convolution filter.',
    kind: 'parameters',
    concept: 'Kernel size hyperparameter',
    parameterGoal: { key: 'k', min: 1, max: 7, target: 3, tolerance: 0 },
    hint: 'A 3×3 filter has width k = 3.',
  },

  // ── Sequence 5: Vision Pipeline ─────────────────────────────────────────────
  {
    ...basic,
    id: 'w5-16',
    sequence: 'Vision Pipeline',
    title: 'KNN Digit Classification',
    instruction:
      'A query 2×2 patch [10, 250, 5, 245] is compared against stored digit patches:\n• Digit 1: [0, 255, 0, 255]\n• Digit 8: [255, 255, 255, 255]\n• Digit 7: [255, 255, 0, 0]\nWhich digit does 1-NN predict?',
    kind: 'choice',
    concept: 'KNN image classification',
    options: [
      { id: '1', title: `Digit ${queryDigit}` },
      { id: '7', title: 'Digit 7' },
      { id: '8', title: 'Digit 8' },
    ],
    correctChoice: String(queryDigit),
    hint: 'Compare the pixel values element-by-element to find the smallest distance.',
  },
  {
    ...basic,
    id: 'w5-17',
    sequence: 'Vision Pipeline',
    title: 'Connect Vision Stages',
    instruction:
      'Connect each vision pipeline component to its role.',
    kind: 'connect',
    concept: 'Vision pipeline roles',
    correctConnections: [
      ['normalise', 'scale_0_to_1'],
      ['convolve', 'extract_edges'],
      ['classifier', 'predict_label'],
    ],
    hint: 'Normalisation scales intensities; convolution extracts spatial features; the classifier outputs the label.',
  },
  {
    ...basic,
    id: 'w5-18',
    sequence: 'Vision Pipeline',
    title: 'Order the Image Classifier Pipeline',
    instruction:
      'Put the stages of an image classification pipeline in the right order.',
    kind: 'order',
    concept: 'End-to-end vision pipeline',
    isCheckpoint: true,
    steps: [
      { id: 'classify', title: 'Classify extracted features (e.g. KNN)' },
      { id: 'normalise', title: 'Normalise pixel values to [0, 1]' },
      { id: 'convolve', title: 'Convolve with feature kernels' },
    ],
    correctOrder: ['normalise', 'convolve', 'classify'],
    hint: 'Normalise raw pixels first, extract features with convolution, then classify.',
  },

  // ── Sequence 6: Vision Checkpoint ───────────────────────────────────────────
  {
    ...basic,
    id: 'w5-19',
    sequence: 'Vision Checkpoint',
    title: 'Connect Filter to Effect',
    instruction:
      'Connect each kernel property to its visual effect.',
    kind: 'connect',
    concept: 'Kernel properties',
    correctConnections: [
      ['sum_to_one', 'preserves_brightness'],
      ['sum_to_zero', 'highlights_edges'],
    ],
    hint: 'Weights summing to 1 keep flat regions unchanged; weights summing to 0 zero out flat regions.',
  },
];

const advanced: Puzzle = {
  ...basic,
  id: 'w5-20',
  sequence: 'Vision Checkpoint',
  title: 'Why Raw Pixel KNN Struggles With Shifts',
  instruction:
    'A 1-NN classifier compares images pixel-by-pixel using Euclidean distance. If you shift a handwritten "1" two pixels to the right, what happens to the raw pixel distance?',
  kind: 'choice',
  concept: 'Translation sensitivity',
  advanced: true,
  unlockAfter: ['w5-18'],
  options: [
    { id: 'large', title: 'The pixel-wise distance jumps sharply even though the digit is still a "1"' },
    { id: 'zero', title: 'The distance stays 0 because Euclidean distance is shift-invariant' },
    { id: 'smaller', title: 'The distance becomes negative' },
  ],
  correctChoice: 'large',
  hint: 'Pixel-by-pixel comparison aligns index (i, j) with (i, j), so shifting breaks alignment.',
  discovery: {
    title: 'Why convolutional features beat raw pixels',
    intuition:
      'A shifted digit no longer overlaps the same pixel indices, fooling raw-pixel Euclidean distance.',
    example:
      'Two identical vertical bars two columns apart have zero pixel overlap and huge L2 distance.',
    technical:
      'Convolutional layers apply the same local kernel across all spatial positions (equivariance), and pooling/striding builds translation tolerance — motivating CNNs in later weeks.',
  },
};

export const week05: WeekContent = {
  number: 5,
  module: 2,
  title: 'Computer Vision: Images as Data',
  summary: 'Represent and transform images computationally.',
  topics: ['Pixels & RGB', 'Normalisation', '2D Convolution', 'KNN image classification'],
  visual: 'pixels',
  status: 'vertical-slice',
  sequences: [
    sequenceContract(
      'w05-s01',
      'Pictures Are Numbers',
      'Represent grayscale and RGB pixel arrays',
      ['numeric', 'sort'],
      'pixel matrix indexing and conversion',
      4,
      'Different encoding same color',
    ),
    sequenceContract(
      'w05-s02',
      'Transform a Picture',
      'Brightness and channel manipulation',
      ['parameters', 'numeric'],
      'pixel-wise tensor transforms',
      3,
      'Boundary clipping',
    ),
    sequenceContract(
      'w05-s03',
      'Convolution & Kernels',
      'Apply small image filters',
      ['numeric', 'trace'],
      'real 2D convolution / padding behavior',
      4,
      'Kernel symmetry',
    ),
    sequenceContract(
      'w05-s04',
      'See the Edges',
      'Compare smoothing and edge filters',
      ['parameters', 'choice'],
      'convolution with known kernels',
      4,
      'False edge detection',
    ),
    sequenceContract(
      'w05-s05',
      'Vision Pipeline',
      'Compose preprocess-filter-detect',
      ['order', 'connect', 'trace'],
      'end-to-end pixel output',
      3,
      'Trade resolution for speed',
    ),
    sequenceContract(
      'w05-s06',
      'Vision Checkpoint',
      'Identify structure from noisy input',
      ['parameters', 'connect'],
      'evaluate detection accuracy',
      2,
      'Noise robustness',
    ),
  ],
  puzzles: [...puzzles, advanced],
};
