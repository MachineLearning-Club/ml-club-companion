import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week11: WeekContent = {
  number: 11, module: 3,
  title: 'Software Engineering Techniques',
  summary: 'Develop, test and maintain ML-powered software.',
  topics: ['Python', 'Testing', 'Software workflows'],
  visual: 'systems',
  status: 'planned',
  sequences: [
    sequenceContract('w11-s01','Think in Procedures','Construct functions and pseudocode',['order','trace'],'pure executor trace',5,'Equivalent refactoring'),
    sequenceContract('w11-s02','Organize Objects','Identify reusable object behavior',['sort','connect'],'object method and state contracts',5,'Composition vs inheritance'),
    sequenceContract('w11-s03','Test the System','Write cases for example algorithms',['choice','trace'],'verified test expectations',6,'Boundary case discovery'),
    sequenceContract('w11-s04','Data Pipelines','Compose ETL/ML operations',['connect','order'],'typed I/O and dependencies',6,'Minimal coupling'),
    sequenceContract('w11-s05','Debug & Version','Review fixes and safe workflows',['choice','repair'],'repeatable regression checks',5,'Mutation testing'),
    sequenceContract('w11-s06','Engineering Checkpoint','Assemble tested AI feature',['connect','trace'],'requirements and test-pass validation',2,'Simplified architecture')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
