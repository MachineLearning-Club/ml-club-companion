import type { Domain, Puzzle } from '../core/types';
import { computeProbability, entropy, expectedValue } from '../core/algorithms';
import { squaredDistance } from '../core/simulations';
/** Small seeded RNG: stable in all conforming JS runtimes, for offline shared challenges and replay. */
export function seedFromString(value:string):number {let h=2166136261>>>0;for(const ch of value){h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;}return h;}
export function mulberry32(seed:number):()=>number {let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export function sharedChallengeSeed(date:string,track:string,level:number):number {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(level)||level<1||level>15||!track)throw new Error('Invalid challenge key');
  return seedFromString(`mlclub:v1:${date}:${track}:${level}`);
}
export type GeneratorKind='probability'|'entropy'|'expected-value'|'nearest-centroid';
const description:Record<GeneratorKind,{concept:string;domain:Domain;sequence:string}>={
  probability:{concept:'Sample space',domain:'Probability & Data',sequence:'Practice'},
  entropy:{concept:'Entropy',domain:'Decision Trees',sequence:'Practice'},
  'expected-value':{concept:'Expected value',domain:'Probability & Data',sequence:'Practice'},
  'nearest-centroid':{concept:'Euclidean distance',domain:'Clustering & Similarity',sequence:'Practice'}
};
/** Generate a valid math puzzle together with its mathematical answer, not a cosmetic reshuffling. */
export function generatePractice(kind:GeneratorKind,seed:number,week=1):Puzzle {
  if(!Number.isInteger(seed)||week<1||week>15)throw new Error('Invalid generator arguments');
  const random=mulberry32(seed);const rnd=(min:number,max:number)=>min+Math.floor(random()*(max-min+1));
  const basic={id:`generated:${kind}:${week}:${seed>>>0}`,week,sequence:description[kind].sequence,kind:'numeric' as const,concept:description[kind].concept,domain:description[kind].domain,templateId:`generator:${kind}:v1`,difficulty:2 as const};
  if(kind==='probability'){
    const total=rnd(4,15),favourable=rnd(1,total-1);
    return {...basic,title:'Fair Sample Space',instruction:`A bag has ${total} equally likely tickets, ${favourable} marked. Enter the probability of drawing a marked ticket as a decimal.`,numeric:{expected:computeProbability(favourable,total),tolerance:0.0001,min:0,max:1},hint:'Divide the favourable count by the total count.'};
  }
  if(kind==='entropy'){
    const a=rnd(1,9),b=rnd(1,9);
    return {...basic,title:'Entropy of Labels',instruction:`A dataset has ${a} positive and ${b} negative labels. Calculate its entropy in bits (3 decimal places).`,numeric:{expected:entropy([a/(a+b),b/(a+b)]),tolerance:0.0005,min:0,max:1},hint:'Use -Σ p log₂(p) and the observed label proportions.'};
  }
  if(kind==='expected-value'){
    const x=rnd(-5,4),y=rnd(x+1,10),p=rnd(1,9)/10;
    return {...basic,title:'Expected Outcome',instruction:`A reward is ${x} with probability ${p.toFixed(1)} and ${y} otherwise. What is its expected value?`,numeric:{expected:expectedValue([{value:x,probability:p},{value:y,probability:1-p}]),tolerance:0.0001},hint:'Weight each outcome by its probability and add the contributions.'};
  }
  const x=rnd(-3,3),y=rnd(-3,3),left:[number,number]=[rnd(-5,-2),rnd(-5,0)],right:[number,number]=[rnd(2,5),rnd(0,5)];
  const da=squaredDistance([x,y],left),db=squaredDistance([x,y],right);
  return {...basic,title:'Nearest Centroid',instruction:`P=(${x},${y}), centroid A=(${left.join(',')}), B=(${right.join(',')}). Enter the squared distance to the nearest centroid.`,numeric:{expected:Math.min(da,db),tolerance:0,min:0},hint:'Compute (x₁−c₁)²+(x₂−c₂)² for both centers and select the smaller value.'};
}
/** Validate many variants at build/test time, catching impossible templates before shipping. */
export function generatorSelfCheck(kind:GeneratorKind,count=256):boolean {
  for(let seed=0;seed<count;seed++){
    const p=generatePractice(kind,seed);
    if(!p.numeric||!Number.isFinite(p.numeric.expected)||p.numeric.expected<(p.numeric.min??-Infinity)||p.numeric.expected>(p.numeric.max??Infinity))return false;
  }
  return true;
}
