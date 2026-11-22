import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week10: WeekContent = {
  number: 10, module: 3,
  title: 'Generative AI: GPT, Data and Society',
  summary: 'Explore generative models and their applications.',
  topics: ['Tokens', 'Next token prediction', 'Responsible AI'],
  visual: 'networks',
  status: 'planned',
  sequences: [
    sequenceContract('w10-s01','Words Become Tokens','Identify simple token boundaries',['sort','order'],'reproducible toy tokenization',5,'Alternative tokenization'),
    sequenceContract('w10-s02','Guess the Next Token','Use conditional distributions',['numeric','choice'],'real n-gram counts & normalized probabilities',6,'Rare event'),
    sequenceContract('w10-s03','Change the Temperature','Investigate sampling distributions',['parameters','numeric'],'stable softmax with temperature',5,'Entropy effects'),
    sequenceContract('w10-s04','Build a Toy Generator','Execute a sequential text-generation pipeline',['connect','trace'],'deterministic seeded sampling',6,'Multiple plausible continuations'),
    sequenceContract('w10-s05','Evaluate Generated Text','Distinguish likelihood from truth',['choice','sort'],'objective factual checks',5,'Hallucination counterexample'),
    sequenceContract('w10-s06','Generative AI Checkpoint','Build and inspect a tiny generator',['connect','parameters'],'sampling constraints, data provenance',2,'Optimize diversity vs accuracy')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
