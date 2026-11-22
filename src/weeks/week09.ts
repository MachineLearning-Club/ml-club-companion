import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week09: WeekContent = {
  number: 9, module: 2,
  title: 'Mid-Term Evaluation',
  summary: 'Apply concepts in integrated scenarios.',
  topics: ['Capstone review', 'Transfer', 'Reflection'],
  visual: 'networks',
  status: 'planned',
  sequences: [
    sequenceContract('w09-s01','Prepare Evaluation','Interpret constraints and dataset',['sort','choice'],'eval fixture reproducibility',4,'Insufficient labels'),
    sequenceContract('w09-s02','Select Your Approach','Choose algorithms to meet objectives',['choice','connect'],'objective feasibility',5,'Nonobvious simpler baseline'),
    sequenceContract('w09-s03','Build & Test','Assemble reusable model pipeline',['connect','order','parameters'],'execution of pipeline and metrics',7,'Resource-efficient variant'),
    sequenceContract('w09-s04','Reflect & Improve','Diagnose errors and revise parameters',['trace','choice'],'before/after evaluation evidence',5,'Tradeoff between objectives'),
    sequenceContract('w09-s05','Mid-Term Capstone','Integrate earlier lessons',['connect','trace','parameters'],'multi-goal, deterministic validator',2,'Alternate compact solution')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
