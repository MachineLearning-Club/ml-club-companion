import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week12: WeekContent = {
  number: 12, module: 3,
  title: 'FIICode I: Understanding the Challenge',
  summary: 'Analyse the project brief and design a solution.',
  topics: ['Requirements', 'Architecture', 'Planning'],
  visual: 'systems',
  status: 'planned',
  sequences: [
    sequenceContract('w12-s01','Understand the Brief','Identify project stakeholders and objective',['sort','choice'],'requirements traceability',5,'Find conflicting requirement'),
    sequenceContract('w12-s02','Define Success','Turn goals into measurable acceptance criteria',['numeric','choice'],'testable threshold objectives',5,'Tradeoff requirements'),
    sequenceContract('w12-s03','Choose Architecture','Compose algorithm and UI components',['connect','order'],'interface contracts and data-flow',6,'Alternative modular design'),
    sequenceContract('w12-s04','Plan Experiments','Design reproducible data and test plans',['order','trace'],'fixture/seed and baseline reproducibility',5,'Counterexample'),
    sequenceContract('w12-s05','Project Design Checkpoint','Produce a technically coherent plan',['connect','parameters'],'requirements coverage',2,'Minimal architecture')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
