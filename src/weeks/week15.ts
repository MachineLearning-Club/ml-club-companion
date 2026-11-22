import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week15: WeekContent = {
  number: 15, module: 3,
  title: 'FIICode IV: Hackathon',
  summary: 'Complete and present an integrated application.',
  topics: ['Capstone', 'Presentation', 'Reflection'],
  visual: 'systems',
  status: 'planned',
  sequences: [
    sequenceContract('w15-s01','Revisit the Goal','Specify final product requirements',['choice','order'],'traceable success metrics',5,'Prioritization'),
    sequenceContract('w15-s02','Build the System','Assemble final integrated project',['connect','parameters'],'real algorithm execution',7,'Alternative pipeline'),
    sequenceContract('w15-s03','Explain the Results','Interpret predictions and limitations',['numeric','choice'],'metric-backed explanation',5,'Analyze biases'),
    sequenceContract('w15-s04','Validate & Present','Test and communicate solution',['trace','order'],'reproducible checks',6,'Simplify explanation'),
    sequenceContract('w15-s05','Final Capstone','Complete a flexible FIICode-style project',['connect','trace','parameters'],'multi-objective accepted implementations',2,'Achieve comparable result with fewer nodes')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
