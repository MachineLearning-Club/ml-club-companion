import { useState } from 'react';
import { Network, BookOpen, ChevronRight, CircleHelp, Sparkles } from 'lucide-react';
import { domainsWithXP, levelAtXP, totalXP, mastery } from '../core/progression';
import type { LearningProfile, Puzzle } from '../core/types';
const concepts=[
  {id:'feature',name:'Features',category:'Foundations',from:'w1-02',intro:'An input attribute that helps describe an example.',example:'Temperature and rain are input features for an outdoor-play classifier.',technical:'A feature vector x ∈ Rⁿ contains measurable model inputs.',links:['labels','threshold']},
  {id:'rule',name:'Rules',category:'Foundations',from:'w1-03',intro:'Explicit conditions define what a system does.',example:'IF pressed THEN ON ELSE OFF.',technical:'A Boolean predicate determines an output without training.',links:['feature','pipeline']},
  {id:'labels',name:'Labels',category:'Foundations',from:'w1-06',intro:'Known target answers paired with training observations.',example:'19°C → ON can be a label.',technical:'A labelled dataset D = {(xᵢ,yᵢ)}.',links:['feature','threshold']},
  {id:'threshold',name:'Threshold Model',category:'Probability & Data',from:'w1-08',intro:'A model chooses a boundary separating two classes.',example:'Train from temperatures and ON/OFF labels.',technical:'Predict 1 if x < θ; choose θ to minimise classification errors.',links:['labels','generalisation']},
  {id:'generalisation',name:'Generalisation',category:'Probability & Data',from:'w1-08',intro:'Applying a learned pattern to examples not seen during training.',example:'After training on 16–23°C, predict the label at 22°C.',technical:'Evaluate performance on unseen examples; low empirical risk need not imply low generalisation error.',links:['threshold','probability']},
  {id:'pipeline',name:'Decision Pipelines',category:'ML Engineering',from:'w1-12',intro:'Independent components connect an observation to an action.',example:'Camera → classifier → rule → actuator.',technical:'Function composition: action = controller(classifier(sensor(input))).',links:['rule','feature']},
  {id:'probability',name:'Probability',category:'Probability & Data',from:'w1-13',intro:'A number describing how likely an event is.',example:'For a fair die, P(even) = 3/6.',technical:'For equally likely outcomes, P(A) = |A|/|Ω|.',links:['generalisation','bayes','expectation']},
  {id:'bayes',name:'Bayesian Reasoning',category:'Probability & Data',from:'w1-15',intro:'Updating beliefs when new evidence is observed.',example:'Correct answer does not always mean the pupil knew the answer.',technical:'P(A|B) = P(B|A)P(A)/P(B).',links:['probability']},
  {id:'expectation',name:'Expected Value',category:'Probability & Data',from:'w1-16',intro:'The average result predicted over many repetitions.',example:'A fair ten-sided die has expectation 5.5.',technical:'E[X] = Σₓ x · P(X=x).',links:['probability']},
  {id:'entropy',name:'Entropy',category:'Decision Trees',from:'future',intro:'Quantifies uncertainty in a probability distribution.',example:'To be introduced with ID3.',technical:'H(X) = −Σ pᵢ log₂(pᵢ).',links:['probability','bayes']},
  {id:'centroids',name:'Centroids',category:'Clustering & Similarity',from:'future',intro:'Representative centers of clusters.',example:'To be introduced with K-Means.',technical:'Each centroid is the mean of its assigned points.',links:['feature']},
  {id:'perceptron',name:'Perceptron',category:'Neural Networks',from:'future',intro:'A simple trainable decision unit.',example:'To be introduced in Week 6.',technical:'ŷ = step(w·x+b).',links:['threshold','feature']}
];
type Props={profile:LearningProfile;puzzles:Puzzle[];guest:boolean};
export function Atlas({profile,puzzles,guest}:Props){
 const [mode,setMode]=useState<'notebook'|'graph'>('notebook');const [query,setQuery]=useState('');const [selected,setSelected]=useState('feature');const [layer,setLayer]=useState<'intro'|'example'|'technical'>('intro');
 const visible=concepts.filter(c=>!query||`${c.name} ${c.category}`.toLowerCase().includes(query.toLowerCase()));
 const unlocked=(id:string)=>{const c=concepts.find(c=>c.id===id);return !!c&&(guest || (!!profile.completed[c.from]&&profile.completed[c.from]==='solved'));};
 const concept=concepts.find(c=>c.id===selected)!;
 const total=totalXP(profile);const masteryInfo=mastery(profile,puzzles);
 return <div className="screen-stack"><div className="section-title"><div><div className="eyebrow">COLLECTION</div><h1>Knowledge Atlas</h1><p>See how everything you've learned connects.</p></div><div className="header-emblem"><Network size={24}/></div></div>
 <div className="stats-card"><div><span>GLOBAL LEVEL</span><strong>{levelAtXP(total)}</strong></div><div><span>MASTERED CONCEPTS</span><strong>{masteryInfo.verified}<small> / {masteryInfo.total}</small></strong></div></div>
 <div className="domain-levels">{domainsWithXP(profile,puzzles).map(d=><div key={d.domain}><span>{d.domain}</span><strong>Lv {d.level}</strong></div>)}</div>
 <div className="seg-tabs"><button className={mode==='notebook'?'active':''} onClick={()=>setMode('notebook')}><BookOpen size={16}/> Notebook</button><button className={mode==='graph'?'active':''} onClick={()=>setMode('graph')}><Network size={16}/> Knowledge Graph</button></div>
 <input className="search-input" aria-label="Search concepts" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search concepts…"/>
 {mode==='graph'&&<div className="atlas-map" aria-label="Concept graph; select a node from the accessible list below"><svg viewBox="0 0 340 260" width="100%" role="img" aria-label="Connections between foundational knowledge, models, probability and future concepts">
   {concepts.slice(0,10).flatMap((c,i)=>c.links.map((dest,j)=>{const k=concepts.findIndex(x=>x.id===dest);if(k<0||k>=10)return null;const a={x:35+(i%4)*87,y:35+Math.floor(i/4)*86};const b={x:35+(k%4)*87,y:35+Math.floor(k/4)*86};return <path key={`${i}-${j}`} d={`M${a.x} ${a.y} Q${(a.x+b.x)/2+16} ${(a.y+b.y)/2-12} ${b.x} ${b.y}`} stroke="#536a92" strokeWidth="1.1" opacity=".5" fill="none"/>;}))}
   {concepts.slice(0,10).map((c,i)=><g key={c.id} opacity={unlocked(c.id)?1:.35}><circle cx={35+(i%4)*87} cy={35+Math.floor(i/4)*86} r="13" fill={selected===c.id?'#4a3c75':'#24324d'} stroke={unlocked(c.id)?'#32d9ef':'#8392ad'} strokeWidth="2"/><text x={35+(i%4)*87} y={59+Math.floor(i/4)*86} textAnchor="middle" fill="#c4d2e8" fontSize="9">{c.name.slice(0,14)}</text></g>)}
  </svg></div>}
 <div className="concept-grid">{visible.map(c=><button key={c.id} className={`concept-item ${c.id===selected?'selected':''}`} onClick={()=>{setSelected(c.id);setLayer('intro')}}><span className={`concept-glyph ${unlocked(c.id)?'lit':''}`}>{unlocked(c.id)?'◆':'◇'}</span><span><strong>{c.name}</strong><small>{c.category}{!unlocked(c.id)?' · Future concept':''}</small></span><ChevronRight size={15}/></button>)}</div>
 <div className="concept-detail"><div className="eyebrow">{unlocked(concept.id)?'DISCOVERED KNOWLEDGE':'CHAPTER PREVIEW'}</div><h2>{concept.name}</h2>{unlocked(concept.id)?<><div className="mini-tabs"><button className={layer==='intro'?'active':''} onClick={()=>setLayer('intro')}>Intuition</button><button className={layer==='example'?'active':''} onClick={()=>setLayer('example')}>Example</button><button className={layer==='technical'?'active':''} onClick={()=>setLayer('technical')}>Technical</button></div><p>{concept[layer]}</p></>:<p>This concept appears in a future chapter. Its full explanation unlocks through Academy progress.</p>}
   <div className="eyebrow">RELATED CONCEPTS</div><div className="topic-cloud">{concept.links.map(id=>{const c=concepts.find(x=>x.id===id);return c?<button key={id} onClick={()=>{setSelected(id);setLayer('intro')}}>{c.name}</button>:null})}</div>
 </div>
 <div className="section-row"><h2>Hidden Discoveries</h2><span><Sparkles size={14}/> {profile.discoveries.length}</span></div>
 <div className="discovery-list">{profile.discoveries.length?profile.discoveries.map(id=>{const p=puzzles.find(p=>p.id===id);return p?.discovery?<div className="discovery-item" key={id}><Sparkles size={17}/><div><strong>{p.discovery.title}</strong><p>{p.discovery.intuition}</p></div></div>:null}):<div className="empty-state"><CircleHelp size={21}/> Unexpected findings will appear here after you discover them.</div>}</div>
 </div>;
}
