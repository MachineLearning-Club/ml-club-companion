/** Pure, deterministic educational ML kernels. No DOM, network, hidden model calls or third-party math runtime. */
export type Vector = readonly number[];
export type Point = readonly [number, number];
const finite=(x:number)=>Number.isFinite(x);
export function squaredDistance(a:Vector,b:Vector):number {
  if(a.length!==b.length || !a.length || [...a,...b].some(x=>!finite(x))) throw new Error('Incompatible vectors');
  return a.reduce((s,x,i)=>s+(x-b[i])**2,0);
}
export function euclideanDistance(a:Vector,b:Vector):number { return Math.sqrt(squaredDistance(a,b)); }
export function nearestNeighbors<T>(samples:readonly {features:Vector;label:T}[], query:Vector, k:number):T[] {
  if(!Number.isInteger(k)||k<1||k>samples.length) throw new Error('Invalid K');
  return samples.map((s,i)=>({label:s.label,d:squaredDistance(s.features,query),i})).sort((a,b)=>a.d-b.d||a.i-b.i).slice(0,k).map(x=>x.label);
}
export function knnClassify<T extends string | number>(samples:readonly {features:Vector;label:T}[], query:Vector, k:number):T {
  const votes=nearestNeighbors(samples,query,k);
  const counts=new Map<T,number>();for(const v of votes)counts.set(v,(counts.get(v)??0)+1);
  // Stable tie break: first among nearest neighbours.
  return votes.reduce((best,v)=>((counts.get(v)??0)>(counts.get(best)??0)?v:best),votes[0]);
}
export type KMeansTraceStep={iteration:number;centroids:Point[];assignments:number[];inertia:number;changed:boolean};
export function runKMeans(points:readonly Point[],initialCentroids:readonly Point[],maxIterations=100):KMeansTraceStep[] {
  if(!points.length||!initialCentroids.length||!Number.isInteger(maxIterations)||maxIterations<1||maxIterations>1000) throw new Error('Invalid clustering input');
  if([...points,...initialCentroids].some(p=>p.length!==2||p.some(x=>!finite(x)))) throw new Error('Invalid point coordinates');
  let centers:Point[]=initialCentroids.map(p=>[...p] as [number,number]);
  let before=points.map(p=>nearestCenter(p,centers));
  const history:KMeansTraceStep[]=[];
  for(let n=1;n<=maxIterations;n++) {
    const centersNext=centers.map((center,index)=>{
      const assigned=points.filter((_,i)=>before[i]===index);
      return assigned.length?[assigned.reduce((s,p)=>s+p[0],0)/assigned.length,assigned.reduce((s,p)=>s+p[1],0)/assigned.length] as Point:[...center] as Point;
    });
    const assignments=points.map(p=>nearestCenter(p,centersNext));
    const inertia=points.reduce((s,p,i)=>s+squaredDistance(p,centersNext[assignments[i]]),0);
    const changed=centersNext.some((c,i)=>squaredDistance(c,centers[i])>1e-16);
    history.push({iteration:n,centroids:centersNext,assignments,inertia,changed});
    centers=centersNext;before=assignments;
    if(!changed)break;
  }
  return history;
}
function nearestCenter(point:Point,centers:readonly Point[]):number {
  let best=0,dist=Infinity;
  for(let i=0;i<centers.length;i++){const d=squaredDistance(point,centers[i]);if(d<dist){best=i;dist=d;}}
  return best;
}
export type CategoricalRow = { features:Record<string,string>; label:string };
export type DecisionTree = {type:'leaf';label:string;count:number}|{type:'node';feature:string;gain:number;branches:Record<string,DecisionTree>;fallback:string};
function distribution(labels:readonly string[]):number[] {const hist=new Map<string,number>();labels.forEach(x=>hist.set(x,(hist.get(x)??0)+1));return [...hist.values()].map(v=>v/labels.length);}
export function entropyOfLabels(labels:readonly string[]):number {if(!labels.length)throw new Error('No labels');return -distribution(labels).reduce((s,p)=>s+(p===0?0:p*Math.log2(p)),0);}
export function informationGain(rows:readonly CategoricalRow[],feature:string):number {
  if(!rows.length || rows.some(r=>r.features[feature]===undefined))throw new Error('Missing feature');
  const groups=new Map<string,CategoricalRow[]>();for(const r of rows){const key=r.features[feature];groups.set(key,[...(groups.get(key)??[]),r]);}
  return entropyOfLabels(rows.map(r=>r.label))-[...groups.values()].reduce((s,g)=>s+(g.length/rows.length)*entropyOfLabels(g.map(r=>r.label)),0);
}
export function trainID3(rows:readonly CategoricalRow[],features:readonly string[],maxDepth=12):DecisionTree {
  if(!rows.length||maxDepth<0)throw new Error('No training examples');
  if(rows.some(r=>features.some(f=>r.features[f]===undefined)))throw new Error('Missing categorical feature');
  const count=new Map<string,number>();rows.forEach(r=>count.set(r.label,(count.get(r.label)??0)+1));
  const fallback=[...count].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0][0];
  if(count.size===1||!features.length||maxDepth===0)return {type:'leaf',label:fallback,count:rows.length};
  const ordered=features.map((f,i)=>({f,g:informationGain(rows,f),i})).sort((a,b)=>b.g-a.g||a.i-b.i);
  const split=ordered[0];if(split.g<=1e-12)return {type:'leaf',label:fallback,count:rows.length};
  const branches:Record<string,DecisionTree>={};for(const val of [...new Set(rows.map(r=>r.features[split.f]))].sort()){
    branches[val]=trainID3(rows.filter(r=>r.features[split.f]===val),features.filter(f=>f!==split.f),maxDepth-1);
  }
  return {type:'node',feature:split.f,gain:split.g,branches,fallback};
}
export function predictID3(tree:DecisionTree,features:Record<string,string>):string {
  if(tree.type==='leaf')return tree.label;
  return tree.branches[features[tree.feature]]?predictID3(tree.branches[features[tree.feature]],features):tree.fallback;
}
export function dot(a:Vector,b:Vector):number {if(a.length!==b.length||a.some(x=>!finite(x))||b.some(x=>!finite(x)))throw new Error('Invalid dot product');return a.reduce((s,v,i)=>s+v*b[i],0);}
export function perceptronOutput(weights:Vector,input:Vector,bias:number):0|1 {return dot(weights,input)+bias>=0?1:0;}
export function trainPerceptron(samples:readonly {input:Vector;target:0|1}[],epochs=100,learningRate=0.2){
  if(!samples.length||!Number.isInteger(epochs)||epochs<1||epochs>10000||!finite(learningRate)||learningRate<=0)throw new Error('Invalid perceptron training');
  const dim=samples[0].input.length;
  if(dim===0||samples.some(s=>s.input.length!==dim||s.input.some(x=>!finite(x))||![0,1].includes(s.target)))throw new Error('Invalid training samples');
  const weights=Array(dim).fill(0) as number[];let bias=0;const trace:{epoch:number;errors:number;weights:number[];bias:number}[]=[];
  for(let epoch=1;epoch<=epochs;epoch++){
    let errors=0;for(const s of samples){const predicted=perceptronOutput(weights,s.input,bias);const delta=s.target-predicted;if(delta!==0){errors++;for(let i=0;i<dim;i++)weights[i]+=learningRate*delta*s.input[i];bias+=learningRate*delta;}}
    trace.push({epoch,errors,weights:[...weights],bias});if(errors===0)break;
  }
  return {weights,bias,converged:trace[trace.length-1].errors===0,trace};
}
export type Matrix = readonly (readonly number[])[];
function assertMatrix(a:Matrix){if(!a.length||!a[0].length||a.some(row=>row.length!==a[0].length||row.some(v=>!finite(v))))throw new Error('Invalid matrix');}
export function convolve2D(image:Matrix,kernel:Matrix,{padding='valid'}:{padding?:'valid'|'same'}={}):number[][] {
  assertMatrix(image);assertMatrix(kernel);
  const h=image.length,w=image[0].length,kh=kernel.length,kw=kernel[0].length;
  const ph=padding==='same'?Math.floor(kh/2):0,pw=padding==='same'?Math.floor(kw/2):0;
  const oh=padding==='same'?h:h-kh+1,ow=padding==='same'?w:w-kw+1;
  if(oh<1||ow<1)throw new Error('Kernel larger than image');
  return Array.from({length:oh},(_,i)=>Array.from({length:ow},(_,j)=>{
    let sum=0;for(let u=0;u<kh;u++)for(let v=0;v<kw;v++){
      const y=i+u-ph,x=j+v-pw;if(y>=0&&y<h&&x>=0&&x<w)sum+=image[y][x]*kernel[u][v];
    }return sum;
  }));
}
export function sigmoid(x:number):number {return x>=0?1/(1+Math.exp(-x)):Math.exp(x)/(1+Math.exp(x));}
export function denseForward(input:Vector,weights:Matrix,bias:Vector,activation:'sigmoid'|'relu'|'linear'='sigmoid'):number[] {
  if(weights.length!==bias.length||!weights.length)throw new Error('Invalid layer');
  return weights.map((w,i)=>{const z=dot(w,input)+bias[i];return activation==='sigmoid'?sigmoid(z):activation==='relu'?Math.max(0,z):z;});
}
export function meanSquaredError(predicted:Vector,target:Vector):number {return squaredDistance(predicted,target)/predicted.length;}
export function bigramModel(sentences:readonly string[]):Record<string,Record<string,number>> {
  const counts:Record<string,Record<string,number>>={};for(const sentence of sentences){const tokens=['<START>',...sentence.toLowerCase().trim().split(/\s+/).filter(Boolean),'<END>'];
    for(let i=0;i<tokens.length-1;i++){const row=counts[tokens[i]]??={};row[tokens[i+1]]=(row[tokens[i+1]]??0)+1;}}
  return Object.fromEntries(Object.entries(counts).map(([token,row])=>{const total=Object.values(row).reduce((a,b)=>a+b,0);return [token,Object.fromEntries(Object.entries(row).map(([next,c])=>[next,c/total]))];}));
}
export function nextBigram(model:Record<string,Record<string,number>>,token:string):string|null {
  const row=model[token];if(!row)return null;return Object.keys(row).sort((a,b)=>row[b]-row[a]||a.localeCompare(b))[0]??null;
}
