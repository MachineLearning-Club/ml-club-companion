import type { WeekContent } from '../core/types';
import { sequenceContract } from '../content/authoring';
export const week14: WeekContent = {
  number: 14, module: 3,
  title: 'FIICode III: Improving and Testing',
  summary: 'Validate, improve and evaluate the application.',
  topics: ['Testing', 'Optimization', 'Reliability'],
  visual: 'systems',
  status: 'planned',
  sequences: [
    sequenceContract('w14-s01','Test the Application','Design reproducible edge-case tests',['choice','trace'],'assertions on actual algorithm results',5,'Property-based variants'),
    sequenceContract('w14-s02','Find Failure Modes','Trace corrupted data and boundary behavior',['trace','repair'],'error diagnostics',6,'Metamorphic test'),
    sequenceContract('w14-s03','Improve Performance','Measure and optimize algorithm work',['numeric','parameters'],'operation counts and computational complexity',5,'Memory bound'),
    sequenceContract('w14-s04','Make It Robust','Validate inputs and fallback behaviors',['sort','connect'],'safety invariant checks',5,'Deliberately adversarial data'),
    sequenceContract('w14-s05','Release Readiness','Check integration and evaluation evidence',['order','trace'],'CI/acceptance gates',5,'Minimal reproducible failure'),
    sequenceContract('w14-s06','Quality Checkpoint','Pass full test suite on a scenario',['connect','trace'],'multi-objective verification',2,'Pareto optimization')
  ],
  puzzles: [] // Parallel content-authoring slot. Do not label as playable until validated.
};
