import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week08: WeekContent = {
  number: 8, module: 2,
  title: 'Revision: Computer Vision and Neural Networks',
  summary: 'Review image processing and trainable classifiers.',
  topics: ['Vision revision', 'Networks revision', 'Evaluation'],
  visual: 'networks',
  status: 'planned',
  sequences: [
    sequenceContract('w08-s01','Read a Pipeline','Interpret complete computer-vision systems',['connect','choice'],'pipeline dependency validation',5,'Equivalent architecture'),
    sequenceContract('w08-s02','Inspect Network Outputs','Trace classification probabilities',['numeric','trace'],'softmax and forward pass',6,'Overconfidence'),
    sequenceContract('w08-s03','Repair Generalisation','Spot label leakage and overfitting',['choice','repair'],'train/test validation',5,'Distribution shift'),
    sequenceContract('w08-s04','Blend Methods','Compare image filters with learned models',['parameters','order'],'objective comparison',5,'Minimal compute'),
    sequenceContract('w08-s05','Review Checkpoint','Solve unseen vision/NN problems',['connect','trace'],'independent proficiency checks',2,'Robustness perturbations')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
