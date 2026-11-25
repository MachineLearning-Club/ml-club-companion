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

/** Softmax of a logit vector. Numerically stable (subtracts max). */
export function softmax(logits: readonly number[]): number[] {
  if (!logits.length || logits.some(x => !Number.isFinite(x))) throw new Error('Invalid logits');
  const max = Math.max(...logits);
  const exps = logits.map(x => Math.exp(x - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sum);
}

/** Cross-entropy loss H(target, predicted). Both are probability distributions. */
export function crossEntropyLoss(predicted: readonly number[], target: readonly number[]): number {
  if (!predicted.length || predicted.length !== target.length) throw new Error('Length mismatch');
  if (predicted.some(x => !Number.isFinite(x) || x < 0) || target.some(x => !Number.isFinite(x) || x < 0)) throw new Error('Invalid values');
  return -target.reduce((s, t, i) => s + (t > 0 ? t * Math.log(Math.max(predicted[i], 1e-15)) : 0), 0);
}

/** Element-wise gradient of MSE w.r.t. predicted: 2*(predicted - target)/n */
export function mseGradient(predicted: readonly number[], target: readonly number[]): number[] {
  if (!predicted.length || predicted.length !== target.length) throw new Error('Length mismatch');
  const n = predicted.length;
  return predicted.map((p, i) => 2 * (p - target[i]) / n);
}

/** Educational 2-layer backpropagation step (sigmoid activations, MSE loss). */
export function backpropStep(
  input: readonly number[],
  target: readonly number[],
  weights1: readonly (readonly number[])[],
  bias1: readonly number[],
  weights2: readonly (readonly number[])[],
  bias2: readonly number[],
  learningRate: number
): { w1: number[][], b1: number[], w2: number[][], b2: number[], loss: number } {
  if (!input.length || !target.length || !weights1.length || !weights2.length) throw new Error('Empty layer');
  if (!Number.isFinite(learningRate) || learningRate <= 0) throw new Error('Invalid learning rate');
  // Helper: sigmoid
  const sig = (x: number) => x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
  // Forward pass layer 1
  const h1 = bias1.map((b, i) => sig(weights1[i].reduce((s, w, j) => s + w * input[j], 0) + b));
  // Forward pass layer 2
  const out = bias2.map((b, i) => sig(weights2[i].reduce((s, w, j) => s + w * h1[j], 0) + b));
  // MSE loss
  const loss = out.reduce((s, o, i) => s + (o - target[i]) ** 2, 0) / out.length;
  // Backprop output layer
  const dOut = out.map((o, i) => (o - target[i]) * o * (1 - o) * 2 / out.length);
  // Backprop hidden layer
  const dH1 = h1.map((h, j) => weights2.reduce((s, w2row, i) => s + w2row[j] * dOut[i], 0) * h * (1 - h));
  // Update weights
  const w2 = weights2.map((row, i) => row.map((w, j) => w - learningRate * dOut[i] * h1[j]));
  const b2 = bias2.map((b, i) => b - learningRate * dOut[i]);
  const w1 = weights1.map((row, i) => row.map((w, j) => w - learningRate * dH1[i] * input[j]));
  const b1 = bias1.map((b, i) => b - learningRate * dH1[i]);
  return { w1, b1, w2, b2, loss };
}

/** Silhouette score for 2D clustering evaluation (mean over all points). */
export function silhouetteScore(points: readonly [number,number][], assignments: readonly number[]): number {
  if (points.length !== assignments.length || points.length < 2) throw new Error('Invalid clustering');
  const dist = (a: [number,number], b: [number,number]) => Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
  const clusters = [...new Set(assignments)];
  if (clusters.length < 2) return 0;
  const scores = points.map((p, i) => {
    const ownCluster = assignments[i];
    const ownNeighbors = points.filter((_, j) => j !== i && assignments[j] === ownCluster);
    const a = ownNeighbors.length ? ownNeighbors.reduce((s, q) => s + dist(p, q), 0) / ownNeighbors.length : 0;
    const otherClusters = clusters.filter(c => c !== ownCluster);
    const b = Math.min(...otherClusters.map(c => {
      const members = points.filter((_, j) => assignments[j] === c);
      return members.length ? members.reduce((s, q) => s + dist(p, q), 0) / members.length : Infinity;
    }));
    const denom = Math.max(a, b);
    return denom === 0 ? 0 : (b - a) / denom;
  });
  return scores.reduce((s, x) => s + x, 0) / scores.length;
}

/** KNN returning distances and indices for educational step-through. */
export function knnWithDistances<T extends string|number>(
  samples: readonly { features: readonly number[]; label: T }[],
  query: readonly number[],
  k: number
): { label: T; distance: number; index: number }[] {
  if (!Number.isInteger(k) || k < 1 || k > samples.length) throw new Error('Invalid K');
  return samples
    .map((s, index) => ({
      label: s.label,
      distance: Math.sqrt(s.features.reduce((sum, f, i) => sum + (f - query[i]) ** 2, 0)),
      index
    }))
    .sort((a, b) => a.distance - b.distance || a.index - b.index)
    .slice(0, k);
}
