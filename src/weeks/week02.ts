import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week02: WeekContent = {
  number: 2, module: 1,
  title: 'Supervised Learning: ID3',
  summary: 'Build interpretable decision trees from labelled data.',
  topics: ['Entropy', 'Information gain', 'Tree construction'],
  visual: 'rules',
  status: 'planned',
  sequences: [
    sequenceContract('w02-s01','Read a Dataset','Identify input and target variables in examples',['sort','choice'],'extract categorical feature / label',5,'Spot leakage'),
    sequenceContract('w02-s02','Measure Uncertainty','Compute entropy for labelled subsets',['numeric','choice'],'entropy calculator',5,'Compare competing distributions'),
    sequenceContract('w02-s03','Choose a Split','Evaluate information gain of candidate features',['numeric','choice'],'conditional entropy and information gain',6,'Two equal-gain features'),
    sequenceContract('w02-s04','Grow a Tree','Construct and traverse an ID3 decision tree',['connect','order','trace'],'ID3 train and predict with categorical values',6,'Equivalent minimal trees'),
    sequenceContract('w02-s05','Generalise & Debug','Inspect unseen examples, missing values and overfit',['choice','repair','trace'],'hold-out predictions & fallback cases',5,'Adversarial missing feature'),
    sequenceContract('w02-s06','Decision Tree Checkpoint','Build an interpretable classifier end to end',['connect','parameters','trace'],'accuracy and tree-structure constraints',2,'Optimise tree size')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
