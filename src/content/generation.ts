import type { Domain, Puzzle } from '../core/types';
import { computeProbability, entropy, expectedValue } from '../core/algorithms';
import { squaredDistance, informationGain } from '../core/simulations';
/** Small seeded RNG: stable in all conforming JS runtimes, for offline shared challenges and replay. */
export function seedFromString(value:string):number {let h=2166136261>>>0;for(const ch of value){h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;}return h;}
export function mulberry32(seed:number):()=>number {let a=seed>>>0;return ()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export function sharedChallengeSeed(date:string,track:string,level:number):number {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isInteger(level)||level<1||level>15||!track)throw new Error('Invalid challenge key');
  return seedFromString(`mlclub:v1:${date}:${track}:${level}`);
}
export type GeneratorKind='probability'|'entropy'|'expected-value'|'nearest-centroid'|'information-gain'|'knn-classify'|'perceptron-step'|'convolution-pixel';
const description:Record<GeneratorKind,{concept:string;domain:Domain;sequence:string}>={
  probability:{concept:'Sample space',domain:'Probability & Data',sequence:'Practice'},
  entropy:{concept:'Entropy',domain:'Decision Trees',sequence:'Practice'},
  'expected-value':{concept:'Expected value',domain:'Probability & Data',sequence:'Practice'},
  'nearest-centroid':{concept:'Euclidean distance',domain:'Clustering & Similarity',sequence:'Practice'},
  'information-gain':{concept:'Information gain',domain:'Decision Trees',sequence:'Practice'},
  'knn-classify':{concept:'K-nearest neighbours',domain:'Clustering & Similarity',sequence:'Practice'},
  'perceptron-step':{concept:'Perceptron learning rule',domain:'Neural Networks',sequence:'Practice'},
  'convolution-pixel':{concept:'2D convolution',domain:'Computer Vision',sequence:'Practice'}
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
    return {...basic,title:'Entropy of Labels',instruction:`A dataset has ${a} positive and ${b} negative labels. Calculate its entropy in bits (3 decimal places).`,numeric:{expected:entropy([a/(a+b),b/(a+b)]),tolerance:0.0005,min:0,max:1},hint:'Use -\u03a3 p log\u2082(p) and the observed label proportions.'};
  }
  if(kind==='expected-value'){
    const x=rnd(-5,4),y=rnd(x+1,10),p=rnd(1,9)/10;
    return {...basic,title:'Expected Outcome',instruction:`A reward is ${x} with probability ${p.toFixed(1)} and ${y} otherwise. What is its expected value?`,numeric:{expected:expectedValue([{value:x,probability:p},{value:y,probability:1-p}]),tolerance:0.0001},hint:'Weight each outcome by its probability and add the contributions.'};
  }
  if(kind==='nearest-centroid'){
    const x=rnd(-3,3),y=rnd(-3,3),left:[number,number]=[rnd(-5,-2),rnd(-5,0)],right:[number,number]=[rnd(2,5),rnd(0,5)];
    const da=squaredDistance([x,y],left),db=squaredDistance([x,y],right);
    return {...basic,title:'Nearest Centroid',instruction:`P=(${x},${y}), centroid A=(${left.join(',')}), B=(${right.join(',')}). Enter the squared distance to the nearest centroid.`,numeric:{expected:Math.min(da,db),tolerance:0,min:0},hint:'Compute (x\u2081\u2212c\u2081)\u00b2+(x\u2082\u2212c\u2082)\u00b2 for both centers and select the smaller value.'};
  }
  if(kind==='information-gain'){
    // Build a small categorical dataset with two buckets
    const totalPos=rnd(2,6),totalNeg=rnd(2,6);
    const total=totalPos+totalNeg;
    const half=Math.floor(total/2);
    // Distribute pos/neg across buckets deterministically
    const sunnyPos=rnd(0,Math.min(totalPos,half));
    const sunnyNeg=half-sunnyPos;
    const rainyPos=totalPos-sunnyPos,rainyNeg=totalNeg-sunnyNeg;
    if(sunnyNeg<0||rainyPos<0||rainyNeg<0){
      // fallback: balanced split
      const p=totalPos,n=totalNeg;
      const rows2=[...Array(p).fill(0).map(()=>({features:{outlook:'sunny'},label:'yes'})),...Array(n).fill(0).map(()=>({features:{outlook:'rainy'},label:'no'}))];
      const ig2=informationGain(rows2,'outlook');
      return {...basic,title:'Information Gain',instruction:`A dataset has ${p+n} items (${p} YES, ${n} NO). Splitting on "outlook" puts all YES items in "sunny" and all NO items in "rainy". Compute the information gain (4 decimal places).`,numeric:{expected:Math.round(ig2*10000)/10000,tolerance:0.0005,min:0,max:1},hint:'IG = H(parent) \u2212 \u03a3 |branch|/|total| \u00d7 H(branch). Use log\u2082.'};
    }
    const rows=[
      ...Array(sunnyPos).fill(0).map(()=>({features:{outlook:'sunny'},label:'yes'})),
      ...Array(sunnyNeg).fill(0).map(()=>({features:{outlook:'sunny'},label:'no'})),
      ...Array(rainyPos).fill(0).map(()=>({features:{outlook:'rainy'},label:'yes'})),
      ...Array(rainyNeg).fill(0).map(()=>({features:{outlook:'rainy'},label:'no'}))
    ];
    const ig=informationGain(rows,'outlook');
    const expected=Math.round(ig*10000)/10000;
    return {...basic,title:'Information Gain',instruction:`A dataset has ${total} items (${totalPos} YES, ${totalNeg} NO). The "sunny" bucket has ${sunnyPos} YES and ${sunnyNeg} NO. The "rainy" bucket has ${rainyPos} YES and ${rainyNeg} NO. Compute the information gain (4 decimal places).`,numeric:{expected,tolerance:0.0005,min:0,max:1},hint:'IG = H(parent) \u2212 \u03a3 |branch|/|total| \u00d7 H(branch). Use log\u2082.'};
  }
  if(kind==='knn-classify'){
    const ax=rnd(-5,0),ay=rnd(-5,0);
    const bx=rnd(1,6),by=rnd(1,6);
    // Query perturbed from A
    const qx=ax+rnd(0,1),qy=ay+rnd(0,1);
    const dA=Math.sqrt((qx-ax)**2+(qy-ay)**2);
    const dB=Math.sqrt((qx-bx)**2+(qy-by)**2);
    const nearest=dA<=dB?0:1;
    return {...basic,title:'KNN Classify (k=1)',instruction:`Sample A=(${ax},${ay}) labelled 0, sample B=(${bx},${by}) labelled 1. Query Q=(${qx},${qy}). With k=1, what label does KNN assign? Enter 0 or 1.`,numeric:{expected:nearest,tolerance:0,min:0,max:1},hint:'Compute the Euclidean distance to each sample and pick the label of the closest one.'};
  }
  if(kind==='perceptron-step'){
    const w0=rnd(-3,3),w1=rnd(-3,3),bias=rnd(-2,2);
    const x0=rnd(0,3),x1=rnd(0,3);
    const lr=0.5;
    const z=w0*x0+w1*x1+bias;
    const output=z>=0?1:0;
    const target=1-output; // force an error so delta != 0
    const delta=target-output; // ±2 or ±1 depending on how we define it — standard perceptron: delta = target - output
    const newW0=w0+lr*delta*x0;
    return {...basic,title:'Perceptron Update',instruction:`Perceptron weights w=(${w0},${w1}), bias=${bias}. Input x=(${x0},${x1}), target=${target}, lr=0.5. Compute new w\u2080 after one weight update (2 decimal places).`,numeric:{expected:Math.round(newW0*100)/100,tolerance:0.005},hint:'First compute output = sign(w\u00b7x + bias). Then: w\u2080 \u2190 w\u2080 + lr \u00d7 (target \u2212 output) \u00d7 x\u2080.'};
  }
  // convolution-pixel
  const imgRow0=[rnd(0,9),rnd(0,9),rnd(0,9)];
  const imgRow1=[rnd(0,9),rnd(0,9),rnd(0,9)];
  const k00=rnd(-2,2),k01=rnd(-2,2),k10=rnd(-2,2),k11=rnd(-2,2);
  const pixel=imgRow0[0]*k00+imgRow0[1]*k01+imgRow1[0]*k10+imgRow1[1]*k11;
  return {...basic,title:'Convolution Pixel',instruction:`Image top two rows: [${imgRow0.join(',')}] and [${imgRow1.join(',')}]. Kernel: [[${k00},${k01}],[${k10},${k11}]]. Valid convolution. What is the top-left output pixel?`,numeric:{expected:pixel,tolerance:0},hint:'Multiply each kernel element with the corresponding image element and sum.'};
}
/** Validate many variants at build/test time, catching impossible templates before shipping. */
export function generatorSelfCheck(kind:GeneratorKind,count=256):boolean {
  for(let seed=0;seed<count;seed++){
    const p=generatePractice(kind,seed);
    if(!p.numeric||!Number.isFinite(p.numeric.expected)||p.numeric.expected<(p.numeric.min??-Infinity)||p.numeric.expected>(p.numeric.max??Infinity))return false;
  }
  return true;
}
