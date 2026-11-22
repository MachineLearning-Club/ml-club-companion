import type { WeekContent } from '../core/types';
import { validatePuzzleSpec } from '../core/validation';
import { week01 } from './week01';
import { week02 } from '../weeks/week02';
import { week03 } from '../weeks/week03';
import { week04 } from '../weeks/week04';
import { week05 } from '../weeks/week05';
import { week06 } from '../weeks/week06';
import { week07 } from '../weeks/week07';
import { week08 } from '../weeks/week08';
import { week09 } from '../weeks/week09';
import { week10 } from '../weeks/week10';
import { week11 } from '../weeks/week11';
import { week12 } from '../weeks/week12';
import { week13 } from '../weeks/week13';
import { week14 } from '../weeks/week14';
import { week15 } from '../weeks/week15';
export const weeks: WeekContent[] = [week01,week02,week03,week04,week05,week06,week07,week08,week09,week10,week11,week12,week13,week14,week15];
export const puzzles = weeks.flatMap(w=>w.puzzles);
export const mainPuzzles=puzzles.filter(p=>!p.advanced);
export function assertContentIntegrity() {
  if(weeks.length!==15||weeks.some((w,i)=>w.number!==i+1)) throw new Error('Week registry must include 15 sequential weeks');
  const ids=puzzles.map(p=>p.id);
  if(new Set(ids).size!==ids.length) throw new Error('Duplicate puzzle IDs');
  for(const w of weeks){
    if(w.sequences){const ids=w.sequences.map(s=>s.id);if(new Set(ids).size!==ids.length)throw new Error(`Duplicate sequence ID in week ${w.number}`);
      for(const seq of w.sequences){if(!seq.title||!seq.objective||!seq.validatorRequirement||seq.microPuzzleTarget<1)throw new Error(`Incomplete plan ${seq.id}`);}}
    if(w.status==='planned'&&w.puzzles.length)throw new Error(`Week ${w.number} contains puzzles but is still marked planned`);
  }
  for(const p of puzzles){
    if(!weeks[p.week-1]||p.week<1)throw new Error(`Puzzle has missing week: ${p.id}`);
    validatePuzzleSpec(p);
  }
}
