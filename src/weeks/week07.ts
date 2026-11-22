import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week07: WeekContent = {
  number: 7, module: 2,
  title: 'Neural Networks and Training',
  summary: 'Combine neurons into trainable layered networks.',
  topics: ['Network layers', 'Loss', 'Backpropagation'],
  visual: 'networks',
  status: 'planned',
  sequences: [
    sequenceContract('w07-s01','Connect Neurons','Build fully connected feedforward layers',['connect','order'],'shape and dimension validation',5,'Identity network'),
    sequenceContract('w07-s02','Forward Propagation','Compute network outputs',['numeric','trace'],'dense layer and activation',6,'Equivalent weights'),
    sequenceContract('w07-s03','Measure Loss','Compare targets and predictions',['numeric','choice'],'MSE/cross-entropy',5,'Loss vs accuracy'),
    sequenceContract('w07-s04','Understand Gradients','Inspect derivative signals',['numeric','order'],'chain rule in simple network',6,'Vanishing gradient'),
    sequenceContract('w07-s05','Backpropagation','Update weights from error signals',['trace','parameters'],'gradient descent step',6,'Check gradient numerically'),
    sequenceContract('w07-s06','Neural Checkpoint','Train a toy network on real data',['connect','parameters'],'forward/backward training verified',2,'Architecture optimization')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
