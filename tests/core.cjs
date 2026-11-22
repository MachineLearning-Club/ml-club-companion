const test=require('node:test');
const assert=require('node:assert/strict');
const {trainThreshold,predictThreshold,computeProbability,conditionalProbability,bayesFromCounts,expectedValue,kMeansStep,entropy}=require('../.test-build/core/algorithms.js');
const {createProfile,validatePuzzle,award,totalXP,replenishCredits,levelAtXP,xpForDomain,WEEK1_EXAMPLES}=require('../.test-build/core/progression.js');
const {week01}=require('../.test-build/content/week01.js');
const {assertContentIntegrity,weeks}=require('../.test-build/content/registry.js');
test('15 curriculum packs match source website',()=>{assertContentIntegrity();assert.equal(weeks.length,15);assert.equal(week01.puzzles.length,17);assert.equal(weeks[14].title,'FIICode IV: Hackathon');});
test('threshold is trained rather than supplied',()=>{const m=trainThreshold(WEEK1_EXAMPLES);assert.equal(m.threshold,19);assert.equal(m.accuracy,1);assert.equal(predictThreshold(m.threshold,19),0);const fixed=trainThreshold([...WEEK1_EXAMPLES,{temperature:19,label:1}]);assert.equal(fixed.threshold,19.5);assert.equal(predictThreshold(fixed.threshold,19),1);});
test('probability, Bayes and expected value are correct',()=>{assert.equal(computeProbability(3,6),0.5);assert.equal(conditionalProbability(2,3),2/3);assert.equal(bayesFromCounts(60,80),0.75);assert.ok(Math.abs(expectedValue(Array.from({length:10},(_,i)=>({value:i+1,probability:.1})))-5.5)<1e-9);});
test('kmeans and entropy run deterministic real math',()=>{const s=kMeansStep([[0,0],[2,0],[10,10],[12,10]],[[0,0],[10,10]]);assert.deepEqual(s.centroids,[[1,0],[11,10]]);assert.deepEqual(s.assignments,[0,0,1,1]);assert.equal(entropy([.5,.5]),1);});
test('each puzzle validator uses authored objective',()=>{let profile=createProfile(new Date('2026-11-21T00:00:00Z'));const p=week01.puzzles[0];assert.equal(validatePuzzle(p,{assignments:{s1:'circle',s2:'square',s3:'circle',s4:'square'}},profile),true);assert.equal(validatePuzzle(p,{assignments:{s1:'square'}},profile),false);const sort=week01.puzzles.find(x=>x.id==='w1-06');profile.workspaces[sort.id]={assignments:sort.correctAssignments};assert.equal(validatePuzzle(week01.puzzles.find(x=>x.id==='w1-07'),{trained:true},profile),true);assert.equal(validatePuzzle(week01.puzzles.find(x=>x.id==='w1-09'),{selected:'ON',trained:true},profile),true);});
test('XP is idempotent and skip has no XP',()=>{const p=week01.puzzles[2];const start=createProfile();const solved=award(start,p,'solved');assert.equal(totalXP(solved),30);assert.equal(totalXP(award(solved,p,'solved')),30);assert.equal(totalXP(award(start,p,'skipped')),0);assert.equal(xpForDomain(solved,week01.puzzles,'Foundations'),30);assert.equal(levelAtXP(225),3);});
test('hint credits are capped at six; replenishment every 12 hours',()=>{const p=createProfile(new Date('2026-11-20T00:00:00Z'));p.credits=1;const after=replenishCredits(p,new Date('2026-11-21T01:00:00Z'));assert.equal(after.credits,5);assert.equal(replenishCredits(after,new Date('2026-11-30T00:00:00Z')).credits,6);});
test('all Week 1 puzzle paths have attainable valid authored solutions',()=>{
 let profile=createProfile();
 for(const p of week01.puzzles){
  let answer;
  switch(p.kind){
   case 'sort':answer={assignments:{...p.correctAssignments}};break;
   case 'choice':answer={selected:p.correctChoice};break;
   case 'order':answer={order:[...p.correctOrder]};break;
   case 'train':answer={trained:true};break;
   case 'predict':answer={selected:'0'};break;
   case 'repair':answer={selected:'ON',trained:true};break;
  }
  assert.ok(validatePuzzle(p,answer,profile),`Valid solution rejected for ${p.id}`);
  profile.workspaces[p.id]=answer;
  profile=award(profile,p,'solved');
 }
 assert.equal(Object.keys(profile.completed).length,17);
 assert.equal(profile.discoveries.length,6);
});
