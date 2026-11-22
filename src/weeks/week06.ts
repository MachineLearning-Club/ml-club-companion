import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week06: WeekContent = {
  number: 6, module: 2,
  title: 'Perceptrons: A First Learning Neuron',
  summary: 'Explore linear classification and parameter updates.',
  topics: ['Weighted sums', 'Step activation', 'Separability'],
  visual: 'pixels',
  status: 'planned',
  sequences: [
    sequenceContract('w06-s01','Weighted Decisions','Compute weighted sums',['numeric','choice'],'dot product',5,'Negative weights'),
    sequenceContract('w06-s02','Bias & Threshold','Manipulate a separating hyperplane',['parameters','numeric'],'step activation with bias',6,'Boundary exactly zero'),
    sequenceContract('w06-s03','Teach the Neuron','Perceptron error-correction updates',['trace','numeric'],'perceptron training step',6,'Learning-rate changes'),
    sequenceContract('w06-s04','Separate the Data','Decide linear separability',['choice','parameters'],'weighted hyperplane test',5,'XOR impossible separation'),
    sequenceContract('w06-s05','Inspect Failures','Classify impossible and ambiguous training sets',['choice','repair'],'finite epoch trace and failure diagnostics',4,'Noisy labels'),
    sequenceContract('w06-s06','Perceptron Checkpoint','Train and test linear classifier',['parameters','trace'],'perceptron convergence and held-out tests',2,'Minimal updates')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
