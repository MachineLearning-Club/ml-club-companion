const test=require('node:test');const assert=require('node:assert/strict');
const s=require('../.test-build/core/simulations.js');
const e=require('../.test-build/core/validation.js');
const session=require('../.test-build/core/session.js');
const gen=require('../.test-build/content/generation.js');
const author=require('../.test-build/content/authoring.js');
const {weeks}=require('../.test-build/content/registry.js');
const {createProfile,award,mergeProgress,canEnterWeek,weekProgress,totalXP}=require('../.test-build/core/progression.js');
test('real ID3 picks information gain and generalises with fallback',()=>{
 const rows=[{features:{outlook:'sunny',wind:'strong'},label:'no'},{features:{outlook:'rainy',wind:'strong'},label:'yes'},{features:{outlook:'rainy',wind:'weak'},label:'yes'},{features:{outlook:'sunny',wind:'weak'},label:'no'}];
 assert.ok(s.informationGain(rows,'outlook')>.9);assert.ok(Math.abs(s.informationGain(rows,'wind'))<1e-10);
 const tree=s.trainID3(rows,['wind','outlook']);assert.equal(tree.type,'node');assert.equal(tree.feature,'outlook');
 assert.equal(s.predictID3(tree,{outlook:'rainy',wind:'strong'}),'yes');
 assert.equal(s.predictID3(tree,{outlook:'unknown',wind:'strong'}),'no');
});
test('K-Means reaches stable assignments with actual iterative trace',()=>{
 const history=s.runKMeans([[0,0],[2,0],[10,10],[12,10]],[[0,0],[10,10]]);
 assert.ok(history.length>=2);const final=history.at(-1);assert.deepEqual(final.centroids,[[1,0],[11,10]]);
 assert.deepEqual(final.assignments,[0,0,1,1]);assert.equal(final.inertia,4);assert.equal(final.changed,false);
});
test('kNN deterministic majority and nearest tie handling',()=>{
 const data=[{features:[0,0],label:'A'},{features:[1,0],label:'A'},{features:[10,10],label:'B'}];
 assert.equal(s.knnClassify(data,[.5,.1],3),'A');assert.equal(s.knnClassify(data,[10,9.9],1),'B');
 assert.throws(()=>s.knnClassify(data,[0,0],5));
});
test('perceptron trains real linear separator; XOR does not converge',()=>{
 const or=[{input:[0,0],target:0},{input:[0,1],target:1},{input:[1,0],target:1},{input:[1,1],target:1}];
 const trained=s.trainPerceptron(or,100,.2);assert.equal(trained.converged,true);
 for(const row of or)assert.equal(s.perceptronOutput(trained.weights,row.input,trained.bias),row.target);
 const xor=or.map(row=>({...row,target:(row.input[0]!==row.input[1]?1:0)}));assert.equal(s.trainPerceptron(xor,30,.2).converged,false);
});
test('real image convolution and neural forward pass',()=>{
 assert.deepEqual(s.convolve2D([[1,2,3],[4,5,6],[7,8,9]],[[1,0],[0,-1]]),[[-4,-4],[-4,-4]]);
 assert.deepEqual(s.convolve2D([[1]],[[1]],{padding:'same'}),[[1]]);
 assert.equal(s.denseForward([2,3],[[1,1]],[-1],'linear')[0],4);
 assert.equal(s.meanSquaredError([1,3],[0,1]),2.5);
});
test('actual smoothed conditional bigram counts are reproducible',()=>{
 const m=s.bigramModel(['a b','a c','a b']);assert.equal(m.a.b,2/3);assert.equal(m.a.c,1/3);assert.equal(s.nextBigram(m,'a'),'b');
});
test('all supported generic mechanics have positive and negative validators',()=>{
 const base={id:'test',week:2,sequence:'S',title:'T',instruction:'I',concept:'C',domain:'Foundations',hint:'H'};
 const cases=[
  [{...base,kind:'numeric',numeric:{expected:1.25,tolerance:.001}},{numberValue:1.25},{numberValue:1.3}],
  [{...base,kind:'multi',correctChoices:['a','b'],options:[{id:'a',title:'A'},{id:'b',title:'B'},{id:'c',title:'C'}]},{selectedMany:['b','a']},{selectedMany:['a']}],
  [{...base,kind:'connect',correctConnections:[['camera','model'],['model','action']]},{connections:[['camera','model'],['model','action']]},{connections:[['model','camera']]}],
  [{...base,kind:'parameters',parameterGoal:{key:'k',min:1,max:9,target:3,tolerance:0}},{parameters:{k:3}},{parameters:{k:5}}],
  [{...base,kind:'trace',correctTrace:['a','b']},{trace:['a','b']},{trace:['b','a']}]
 ];for(const [p,good,bad] of cases){e.validatePuzzleSpec(p);assert.equal(e.evaluateGeneric(p,good).valid,true,p.kind);assert.equal(e.evaluateGeneric(p,bad).valid,false,p.kind);}
});
test('session undo redo, adaptive assistance, and deterministic restoration',()=>{
 const puzzle={id:'p',kind:'numeric',numeric:{expected:2,tolerance:0}};let q=session.newSession('p');
 q=session.updateSession(q,{numberValue:1});q=session.updateSession(q,{numberValue:3});
 assert.equal(session.undoSession(q).answer.numberValue,1);assert.equal(session.redoSession(session.undoSession(q)).answer.numberValue,3);
 q=session.checkSession(q,puzzle);q=session.checkSession(q,puzzle);q=session.checkSession(q,puzzle);
 assert.equal(q.assistanceOffered,true);assert.equal(q.status,'active');
 q=session.updateSession(q,{numberValue:2});q=session.checkSession(q,puzzle);assert.equal(q.status,'solved');
 assert.equal(session.restoreSession(q,'p').status,'solved');assert.throws(()=>session.restoreSession(q,'other'));
});
test('seeded practice challenges are identical and mathematically feasible',()=>{
 assert.equal(gen.sharedChallengeSeed('2026-11-22','foundations',1),gen.sharedChallengeSeed('2026-11-22','foundations',1));
 for(const kind of ['probability','entropy','expected-value','nearest-centroid']){
  assert.equal(gen.generatorSelfCheck(kind,512),true);
  const p=gen.generatePractice(kind,1345);assert.deepEqual(p,gen.generatePractice(kind,1345));
  assert.equal(e.evaluateGeneric(p,{numberValue:p.numeric.expected}).valid,true);
  assert.equal(e.evaluateGeneric(p,{numberValue:p.numeric.expected+123}).valid,false);
 }
});
test('all 15 lessons have substantive independent authoring plans',()=>{
 assert.equal(weeks.length,15);assert.ok(weeks.every(w=>w.sequences.length>=5));
 assert.ok(weeks.reduce((n,w)=>n+w.sequences.length,0)>=80);
 assert.ok(weeks.reduce((n,w)=>n+author.lessonCoverage(w).target,0)>=350);
 for(const w of weeks){const report=author.lintWeek(w);assert.deepEqual(report.errors,[],`Week ${w.number}: ${report.errors.join('; ')}`);}
});
test('skip may later earn mastery and XP, merging profiles preserves unique rewards',()=>{
 const puzzle=weeks[0].puzzles[0];const base=createProfile();const skipped=award(base,puzzle,'skipped');assert.equal(totalXP(skipped),0);
 const solved=award(skipped,puzzle,'solved');assert.equal(solved.completed[puzzle.id],'solved');assert.equal(totalXP(solved),10);
 assert.equal(totalXP(award(solved,puzzle,'solved')),10);
 const merged=mergeProgress(skipped,solved);assert.equal(merged.completed[puzzle.id],'solved');assert.equal(totalXP(merged),10);
 const completed=weeks[0].puzzles.filter(p=>!p.advanced).reduce((profile,p)=>award(profile,p,'skipped'),base);
 assert.equal(weekProgress(completed,weeks.flatMap(w=>w.puzzles),1).completed,16);
 assert.equal(canEnterWeek(completed,weeks.flatMap(w=>w.puzzles),2),true);
 assert.equal(canEnterWeek(base,weeks.flatMap(w=>w.puzzles),2),false);
});
