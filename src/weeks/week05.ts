import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week05: WeekContent = {
  number: 5, module: 2,
  title: 'Computer Vision: Images as Data',
  summary: 'Represent and transform images computationally.',
  topics: ['Pixels', 'Images', 'Filtering'],
  visual: 'pixels',
  status: 'planned',
  sequences: [
    sequenceContract('w05-s01','Pictures Are Numbers','Represent grayscale and RGB pixel arrays',['numeric','sort'],'pixel matrix indexing and conversion',5,'Different encoding same color'),
    sequenceContract('w05-s02','Transform a Picture','Brightness and channel manipulation',['parameters','numeric'],'pixel-wise tensor transforms',5,'Boundary clipping'),
    sequenceContract('w05-s03','Convolution & Kernels','Apply small image filters',['numeric','trace'],'real 2D convolution / padding behavior',6,'Kernel symmetry'),
    sequenceContract('w05-s04','See the Edges','Compare smoothing and edge filters',['parameters','choice'],'convolution with known kernels',6,'False edge detection'),
    sequenceContract('w05-s05','Vision Pipeline','Compose preprocess-filter-detect',['order','connect','trace'],'end-to-end pixel output',5,'Trade resolution for speed'),
    sequenceContract('w05-s06','Vision Checkpoint','Identify structure from noisy input',['parameters','connect'],'evaluate detection accuracy',2,'Noise robustness')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
