import type { LearningProfile, Puzzle, Progress, Domain, PuzzleAnswer } from './types';
import { domains } from './types';
import { trainThreshold, predictThreshold, type Example } from './algorithms';
import { evaluateGeneric } from './validation';
export const WEEK1_EXAMPLES: Example[] = [16,17,18,20,21,23].map(t=>({temperature:t,label:t<20?1:0}));
export const DISCOVERY_AWARD=20;
export const PUZZLE_AWARD=10;
const ADVANCED_AWARD=40;

export function createProfile(now=new Date()):LearningProfile {
  const iso=now.toISOString();
  return { schemaVersion:1,id:makeId(),createdAt:iso,lastUpdated:iso,completed:{},workspaces:{},histories:{},hintClaims:{},xpAwards:{},discoveries:[],activePuzzle:null,currentWeek:1,credits:6,lastReplenished:iso,settings:{reducedMotion:false,locale:'en'} };
}
export function makeId():string {
  // UUID where browser cryptographic APIs exist; fallback only for test/nonsecure contexts.
  if(typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
export function labelledData(profile:LearningProfile):Example[] {
  const assignments=profile.workspaces['w1-06']?.assignments ?? {};
  return WEEK1_EXAMPLES.filter(e=>assignments[String(e.temperature)] !== undefined)
    .map(e=>({temperature:e.temperature,label:assignments[String(e.temperature)]==='ON'?1:0 as 0|1}));
}
export function validatePuzzle(p:Puzzle,a:PuzzleAnswer,profile:LearningProfile):boolean {
  switch(p.kind) {
    case 'sort': return !!p.items?.length && p.items.every(i=>a.assignments?.[i.id]===p.correctAssignments?.[i.id]);
    case 'choice': return !!a.selected && a.selected===p.correctChoice;
    case 'order': return (a.order||p.steps?.map(s=>s.id)||[]).join('|')===p.correctOrder?.join('|');
    case 'train': {
      if(p.week!==1) return !!a.trained && (!p.correctChoice || a.selected===p.correctChoice);
      const data=labelledData(profile);
      if(data.length!==WEEK1_EXAMPLES.length || !a.trained) return false;
      return trainThreshold(data).accuracy===1;
    }
    case 'predict': {
      if(p.week!==1) return !!a.selected && a.selected===p.correctChoice;
      const data=labelledData(profile);
      if(data.length!==WEEK1_EXAMPLES.length) return false;
      const model=trainThreshold(data);
      return a.selected === String(predictThreshold(model.threshold,22));
    }
    case 'repair': {
      if(p.week!==1) return !!a.trained && (!p.correctChoice || a.selected===p.correctChoice);
      if(!a.trained || a.selected !== 'ON') return false;
      const data=labelledData(profile);
      if(data.length!==WEEK1_EXAMPLES.length) return false;
      const corrected=trainThreshold([...data,{temperature:19,label:1}]);
      return corrected.accuracy===1 && predictThreshold(corrected.threshold,19)===1;
    }
    default: return evaluateGeneric(p,a).valid;
  }
}
export function puzzleXP(p:Puzzle):number { return p.advanced?ADVANCED_AWARD:p.isCheckpoint?50:PUZZLE_AWARD; }
export function award(profile:LearningProfile,p:Puzzle,status:Progress):LearningProfile {
  if(profile.completed[p.id]==='solved' || (profile.completed[p.id]==='skipped' && status==='skipped')) return profile;
  const xpAwards={...profile.xpAwards};
  const discoveries=[...profile.discoveries];
  if(status==='solved') {
    xpAwards[`puzzle:${p.id}`]=puzzleXP(p);
    if(p.discovery) {
      xpAwards[`discovery:${p.id}`]=DISCOVERY_AWARD;
      if(!discoveries.includes(p.id)) discoveries.push(p.id);
    }
  }
  return {...profile,completed:{...profile.completed,[p.id]:status},xpAwards,discoveries};
}
export function totalXP(profile:LearningProfile):number { return Object.values(profile.xpAwards).reduce((a,b)=>a+b,0); }
export function xpForDomain(profile:LearningProfile, puzzles:readonly Puzzle[], domain:Domain):number {
  const byId=new Map(puzzles.map(p=>[p.id,p]));
  return Object.entries(profile.xpAwards).reduce((sum,[id,xp])=>{
    const p=byId.get(id.split(':').slice(1).join(':'));
    return sum+(p?.domain===domain || (id.startsWith('challenge:daily:') && domain==='Probability & Data') ? xp:0);
  },0);
}
export function xpThreshold(level:number):number { const n=Math.max(0,level-1); return 100*n+25*n*(n-1)/2; }
export function levelAtXP(xp:number):number {let level=1; while(xpThreshold(level+1)<=xp) level++; return level;}
export function replenishCredits(profile:LearningProfile, now=new Date()):LearningProfile {
  const elapsed=now.getTime()-new Date(profile.lastReplenished).getTime();
  const periods=Math.floor(elapsed/(12*60*60*1000));
  if(!Number.isFinite(elapsed)||periods<=0) return profile;
  return {...profile,credits:Math.min(6,profile.credits+2*periods),lastReplenished:new Date(new Date(profile.lastReplenished).getTime()+periods*12*60*60*1000).toISOString()};
}
export function canSpend(profile:LearningProfile,cost:1|2){return profile.credits>=cost;}
export function mastery(profile:LearningProfile,puzzles:readonly Puzzle[]):{verified:number;total:number} {
  const concepts=new Map<string,boolean>();
  for(const puzzle of puzzles.filter(p=>!p.advanced)){
    const wasVerified=profile.completed[puzzle.id]==='solved';
    concepts.set(puzzle.concept,(concepts.get(puzzle.concept)??false)||wasVerified);
  }
  return {verified:[...concepts.values()].filter(Boolean).length,total:concepts.size};
}
export function domainsWithXP(profile:LearningProfile,puzzles:readonly Puzzle[]){return domains.map(domain=>({domain,xp:xpForDomain(profile,puzzles,domain),level:levelAtXP(xpForDomain(profile,puzzles,domain))}));}

/** A skip unlocks progression but cannot erase subsequent evidence of mastery. */
export function canEnterWeek(profile:LearningProfile,allPuzzles:readonly Puzzle[],week:number,guest=false):boolean {
  if(guest||week===1)return true;
  if(week<1||week>15)return false;
  const previous=allPuzzles.filter(p=>p.week===week-1&&!p.advanced);
  return previous.length>0&&previous.every(p=>profile.completed[p.id]!==undefined);
}
export function weekProgress(profile:LearningProfile,allPuzzles:readonly Puzzle[],week:number){
  const ps=allPuzzles.filter(p=>p.week===week&&!p.advanced);
  const solved=ps.filter(p=>profile.completed[p.id]==='solved').length;
  const skipped=ps.filter(p=>profile.completed[p.id]==='skipped').length;
  return {total:ps.length,solved,skipped,completed:solved+skipped,available:ps.length>0};
}
/** Merge independent offline achievements without awarding XP twice. Workspaces are not merged automatically. */
export function mergeProgress(a:LearningProfile,b:LearningProfile):LearningProfile {
  const completed:{[id:string]:Progress}={...a.completed};
  for(const [id,status] of Object.entries(b.completed))if(status==='solved'||!completed[id])completed[id]=status;
  const xpAwards={...a.xpAwards};for(const [id,xp] of Object.entries(b.xpAwards))if(xpAwards[id]===undefined)xpAwards[id]=xp;
  const later=new Date(a.lastUpdated)>=new Date(b.lastUpdated)?a:b;
  return {...later,completed,xpAwards,discoveries:[...new Set([...a.discoveries,...b.discoveries])],activePuzzle:later.activePuzzle};
}
