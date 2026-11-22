import type { Puzzle, SequencePlan, WeekContent } from '../core/types';
import { validatePuzzleSpec } from '../core/validation';
export type ContentLint={errors:string[];warnings:string[]};
/** Content authors can run this before opening PRs. Content must be grounded in algorithms, not guessed answers. */
export function lintWeek(week:WeekContent):ContentLint {
  const errors:string[]=[],warnings:string[]=[];
  if(week.number<1||week.number>15)errors.push('Week number must be 1..15');
  if(!week.topics.length)errors.push('Topics missing');
  if(!week.sequences?.length)warnings.push('No planned micro-sequences');
  const sequenceIds=new Set((week.sequences??[]).map(s=>s.title));
  const ids=new Set<string>();
  for(const p of week.puzzles){
    if(ids.has(p.id))errors.push(`Duplicate ID ${p.id}`);ids.add(p.id);
    if(p.week!==week.number)errors.push(`${p.id}: wrong week`);
    if(week.sequences?.length&&!sequenceIds.has(p.sequence))warnings.push(`${p.id}: sequence not in plan`);
    try{validatePuzzleSpec(p);}catch(e){errors.push((e as Error).message);}
    if(p.kind==='numeric'&&p.numeric?.tolerance===0&&!Number.isInteger(p.numeric.expected))warnings.push(`${p.id}: exact floating-point equality may reject valid answers`);
    if(p.hint.toLowerCase().includes('answer is'))warnings.push(`${p.id}: hint may reveal solution`);
  }
  if(week.status==='planned'&&week.puzzles.length)errors.push('Cannot have playable puzzles in a planned-only manifest');
  if(week.status==='vertical-slice'&&!week.puzzles.length)errors.push('Playable week contains no puzzles');
  if(week.sequences?.some(s=>!s.validatorRequirement||s.microPuzzleTarget<1))errors.push('Incomplete sequence contract');
  return {errors,warnings};
}
export function lessonCoverage(week:WeekContent):{plannedSequences:number;authoredSequences:number;authoredPuzzles:number;target:number} {
  const authored=new Set(week.puzzles.map(p=>p.sequence));
  return {plannedSequences:week.sequences?.length??0,authoredSequences:(week.sequences??[]).filter(s=>authored.has(s.title)).length,authoredPuzzles:week.puzzles.length,target:(week.sequences??[]).reduce((s,c)=>s+c.microPuzzleTarget,0)};
}
export function sequenceContract(id:string,title:string,objective:string,mechanics:SequencePlan['mechanics'],validatorRequirement:string,microPuzzleTarget=5,advancedIdea?:string):SequencePlan {
  return {id,title,objective,mechanics,validatorRequirement,microPuzzleTarget,advancedIdea};
}
export function exampleAnswerFor(p:Puzzle){
  switch(p.kind){case 'sort':return {assignments:{...p.correctAssignments}};case 'choice':return {selected:p.correctChoice};case 'order':return {order:[...(p.correctOrder??[])]};case 'numeric':return {numberValue:p.numeric?.expected};case 'multi':return {selectedMany:[...(p.correctChoices??[])]};case 'connect':return {connections:[...(p.correctConnections??[])]};case 'parameters':return {parameters:p.parameterGoal?{[p.parameterGoal.key]:p.parameterGoal.target}:{}};case 'trace':return {trace:[...(p.correctTrace??[])]};default:return {};}
}
