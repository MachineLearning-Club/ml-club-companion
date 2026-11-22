import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week04: WeekContent = {
  number: 4, module: 2,
  title: 'Revision: Supervised and Unsupervised Learning',
  summary: 'Combine supervised and unsupervised methods.',
  topics: ['Model comparison', 'Transfer', 'Evaluation'],
  visual: 'clusters',
  status: 'planned',
  sequences: [
    sequenceContract('w04-s01','Recognise the Problem','Select suitable supervised/unsupervised methods',['choice','sort'],'task based method selection',5,'Ambiguous labels'),
    sequenceContract('w04-s02','Compare Algorithms','Contrast ID3, K-Means and KNN',['choice','numeric'],'algorithm-specific metrics',5,'Similar outcomes from different methods'),
    sequenceContract('w04-s03','Test Generalisation','Evaluate data splits and edge cases',['numeric','choice'],'confusion matrix and holdout accuracy',5,'Class imbalance'),
    sequenceContract('w04-s04','Repair a Pipeline','Find flawed data processing steps',['order','connect','trace'],'pipeline execution and data leakage checks',5,'Alternative repair'),
    sequenceContract('w04-s05','Applied Review','Combine two ML approaches on one scenario',['connect','parameters'],'multiple objective criterion',2,'Optimize both metrics')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
