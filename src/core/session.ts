import type { Puzzle, PuzzleAnswer } from './types';
import { evaluateGeneric, type ValidationResult } from './validation';
/** Immutable puzzle session with undo/redo, attempts, adaptive assistance and stable restoration. */
export type PuzzleSession={schemaVersion:1;puzzleId:string;revision:number;answer:PuzzleAnswer;past:PuzzleAnswer[];future:PuzzleAnswer[];attempts:number;status:'active'|'solved'|'skipped';assistanceOffered:boolean;lastResult:ValidationResult|null};
function copy(a:PuzzleAnswer):PuzzleAnswer{return JSON.parse(JSON.stringify(a));}
export function newSession(puzzleId:string,answer:PuzzleAnswer={}):PuzzleSession {return {schemaVersion:1,puzzleId,revision:0,answer:copy(answer),past:[],future:[],attempts:0,status:'active',assistanceOffered:false,lastResult:null};}
export function updateSession(s:PuzzleSession,answer:PuzzleAnswer):PuzzleSession {
  if(s.status!=='active')return s;
  if(JSON.stringify(s.answer)===JSON.stringify(answer))return s;
  return {...s,revision:s.revision+1,past:[...s.past.slice(-49),copy(s.answer)],answer:copy(answer),future:[],lastResult:null};
}
export function undoSession(s:PuzzleSession):PuzzleSession {
  if(s.status!=='active'||!s.past.length)return s;
  return {...s,revision:s.revision+1,answer:copy(s.past[s.past.length-1]),past:s.past.slice(0,-1),future:[copy(s.answer),...s.future],lastResult:null};
}
export function redoSession(s:PuzzleSession):PuzzleSession {
  if(s.status!=='active'||!s.future.length)return s;
  return {...s,revision:s.revision+1,past:[...s.past,copy(s.answer)],answer:copy(s.future[0]),future:s.future.slice(1),lastResult:null};
}
export function checkSession(s:PuzzleSession,p:Puzzle,validate:(p:Puzzle,a:PuzzleAnswer)=>boolean=(p,a)=>evaluateGeneric(p,a).valid):PuzzleSession {
  if(s.status!=='active')return s;
  const valid=validate(p,s.answer);const attempts=s.attempts+(valid?0:1);
  const message=valid?'Valid solution': 'Try another approach';
  return {...s,status:valid?'solved':'active',attempts,assistanceOffered:s.assistanceOffered||attempts>=3,lastResult:{valid,complete:true,reason:message,score:valid?1:0}};
}
export function skipSession(s:PuzzleSession):PuzzleSession {return s.status==='active'?{...s,status:'skipped'}:s;}
/** Reject invalid imports and cross-puzzle state reuse. */
export function restoreSession(value:unknown,puzzleId:string):PuzzleSession {
  if(!value||typeof value!=='object')throw new Error('Invalid saved puzzle session');
  const s=value as PuzzleSession;
  if(s.schemaVersion!==1||s.puzzleId!==puzzleId||!Array.isArray(s.past)||!Array.isArray(s.future)||!['active','solved','skipped'].includes(s.status)||!Number.isInteger(s.revision)||s.revision<0||s.past.length>50||s.future.length>50)throw new Error('Incompatible or corrupt puzzle session');
  return {...s,answer:copy(s.answer),past:s.past.map(copy),future:s.future.map(copy)};
}
