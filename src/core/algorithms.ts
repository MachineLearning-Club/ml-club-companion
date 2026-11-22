/** Pure deterministic, offline algorithms. No React or browser dependencies. */
export type Example = { temperature: number; label: 0 | 1 };
export type ThresholdModel = { threshold: number; accuracy: number; errors: number };

/** Fit an ON-if-temperature-below-threshold classifier by empirical risk minimisation.
 * Midpoints of distinct training values and both exterior regions are searched.
 * Ties are resolved by choosing the lowest candidate threshold.
 */
export function trainThreshold(examples: readonly Example[]): ThresholdModel {
  if (!examples.length) throw new Error('Training requires labelled data');
  if (examples.some(e => !Number.isFinite(e.temperature) || (e.label !== 0 && e.label !== 1))) {
    throw new Error('Invalid training example');
  }
  const values = [...new Set(examples.map(e => e.temperature))].sort((a,b)=>a-b);
  const candidates = [values[0] - 1, ...values.slice(1).map((v,i)=>(values[i]+v)/2), values[values.length-1] + 1];
  let best: ThresholdModel | null = null;
  for (const threshold of candidates) {
    const errors = examples.filter(e => predictThreshold(threshold,e.temperature)!==e.label).length;
    if (!best || errors<best.errors) best={threshold,errors,accuracy:(examples.length-errors)/examples.length};
  }
  return best!;
}
export function predictThreshold(threshold:number, temperature:number):0|1 { return temperature<threshold?1:0; }
export function computeProbability(favourable:number,total:number):number {
  if (!Number.isInteger(total)||total<=0||!Number.isInteger(favourable)||favourable<0||favourable>total) throw new Error('Invalid sample space');
  return favourable/total;
}
export function conditionalProbability(intersection:number, conditionCount:number):number { return computeProbability(intersection,conditionCount); }
export function bayesFromCounts(joint:number,evidence:number):number { return conditionalProbability(joint,evidence); }
export function expectedValue(outcomes:readonly {value:number;probability:number}[]):number {
  if (!outcomes.length || outcomes.some(o=>!Number.isFinite(o.value)||!Number.isFinite(o.probability)||o.probability<0)) throw new Error('Invalid distribution');
  const sum=outcomes.reduce((s,o)=>s+o.probability,0);
  if(Math.abs(sum-1)>1e-9) throw new Error('Probabilities must sum to one');
  return outcomes.reduce((s,o)=>s+o.value*o.probability,0);
}
/** One Lloyd iteration of K-means. Handles empty clusters by preserving their centroid. */
export function kMeansStep(points:readonly [number,number][],centroids:readonly [number,number][]) {
  if(!centroids.length) throw new Error('At least one centroid required');
  const assignments = points.map(p=> {
    let closest=0, best=Infinity;
    centroids.forEach((c,i)=>{const d=(p[0]-c[0])**2+(p[1]-c[1])**2; if(d<best){best=d; closest=i;}});
    return closest;
  });
  const nextCentroids=centroids.map((c,i)=>{
    const members=points.filter((_,j)=>assignments[j]===i);
    return members.length ? [members.reduce((s,p)=>s+p[0],0)/members.length,members.reduce((s,p)=>s+p[1],0)/members.length] as [number,number] : [...c] as [number,number];
  });
  return { assignments,centroids:nextCentroids, inertia:points.reduce((sum,p,i)=>sum+(p[0]-nextCentroids[assignments[i]][0])**2+(p[1]-nextCentroids[assignments[i]][1])**2,0) };
}
export function entropy(probs:readonly number[]):number {
  if(probs.some(x=>x<0 || x>1) || Math.abs(probs.reduce((a,b)=>a+b,0)-1)>1e-9) throw new Error('Invalid probability vector');
  return -probs.filter(p=>p>0).reduce((s,p)=>s+p*Math.log2(p),0);
}
