import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { ArrowLeft, ArrowRight, CircleHelp, FlaskConical, Lightbulb, RotateCcw, Sparkles, Zap, Check, MoveUp, MoveDown, Undo2, Redo2 } from 'lucide-react';
import type { LearningProfile, Puzzle, PuzzleAnswer } from '../core/types';
import { labelledData, validatePuzzle, puzzleXP } from '../core/progression';
import { trainThreshold, predictThreshold } from '../core/algorithms';

type Props={puzzle:Puzzle;profile:LearningProfile;guest:boolean;position:number;total:number;onUpdate:(answer:PuzzleAnswer)=>void;onUndo:()=>void;onRedo:()=>void;onSolve:()=>void;onSkip:()=>void;onExit:()=>void;onNext:()=>void;onHint:()=>boolean;onLab:()=>void;onTrain?:(p:Puzzle)=>string|void;onPredict?:(p:Puzzle,answer:PuzzleAnswer)=>void};

/** Dispatch training for a puzzle based on its templateId prefix. */
function dispatchTrain(p: Puzzle, profile: LearningProfile): string | null {
  if (!p.templateId) return null;
  if (p.templateId.startsWith('threshold:')) {
    const data = labelledData(profile);
    if (!data.length) return 'No training data available.';
    try {
      const m = trainThreshold(data);
      return `Threshold model trained. Threshold: ${m.threshold}°C, Accuracy: ${Math.round(m.accuracy * 100)}%`;
    } catch { return 'Training failed — check your data.'; }
  }
  if (p.templateId.startsWith('kmeans:')) {
    return 'K-Means: use the Laboratory workspace to run iterative clustering.';
  }
  if (p.templateId.startsWith('id3:')) {
    return 'ID3: decision tree training requires labelled categorical data from the puzzle spec.';
  }
  return null;
}

export function PuzzlePlayer({puzzle:p,profile,guest,position,total,onUpdate,onUndo,onRedo,onSolve,onSkip,onExit,onNext,onHint,onLab,onTrain,onPredict}:Props){
  const answer=profile.workspaces[p.id]??{};
  const [selectedItem,setSelectedItem]=useState<string|null>(null);
  const [wrong,setWrong]=useState(0);
  const [hintVisible,setHintVisible]=useState(Boolean(profile.hintClaims?.[p.id]));
  const [assistance,setAssistance]=useState(false);
  const [supportSolved,setSupportSolved]=useState(false);
  const [feedback,setFeedback]=useState<'correct'|'wrong'|null>(null);
  const [explainLayer,setExplainLayer]=useState<'intuition'|'example'|'technical'>('intuition');
  const [trainInfo,setTrainInfo]=useState<string|null>(null);
  const dragRef=useRef<string|null>(null);
  const isSolved=profile.completed[p.id]==='solved';
  const isSkipped=profile.completed[p.id]==='skipped';
  const submitted=isSolved||feedback==='correct';
  useEffect(()=>{setSelectedItem(null);setWrong(0);setHintVisible(Boolean(profile.hintClaims?.[p.id]));setAssistance(false);setSupportSolved(false);setFeedback(null);setExplainLayer('intuition');setTrainInfo(null);},[p.id]);
  useEffect(()=>{
    if(feedback!=='correct' || p.discovery || p.isCheckpoint || p.advanced)return;
    const t=setTimeout(onNext,700);return ()=>clearTimeout(t);
  },[feedback,p.discovery,p.isCheckpoint,p.advanced,onNext]);
  const model=useMemo(()=>{
    try { const data=labelledData(profile); return data.length?trainThreshold(data):null; } catch { return null; }
  },[profile]);
  const correct=validatePuzzle(p,answer,profile);
  const assign=(id:string,bucket:string)=>{
    if(submitted)return;
    onUpdate({...answer,assignments:{...(answer.assignments||{}),[id]:bucket}});
    setSelectedItem(null);setFeedback(null);
  };
  const choose=(id:string)=>{if(!submitted){const next={...answer,selected:id};onUpdate(next);if(p.kind==='predict')onPredict?.(p,next);setFeedback(null);}};
  const check=()=>{
    if(submitted)return;
    if(correct){setFeedback('correct');onSolve();}
    else {setFeedback('wrong');setWrong(w=>w+1);if(wrong>=2)setAssistance(true);}
  };
  const showHint=()=>{if(hintVisible)return;if(onHint())setHintVisible(true);};
  const ordering=answer.order??p.steps?.map(s=>s.id)??[];
  // Puzzle choices must not be shown in the authored answer order.
  const traceChoices=useMemo(()=>{
    const choices=[...new Set(p.correctTrace??[])];
    let seed=[...p.id].reduce((s,c)=>((s*31+c.charCodeAt(0))>>>0),2166136261);
    for(let i=choices.length-1;i>0;i--){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const j=seed%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}
    if(choices.length>1&&choices.every((step,i)=>step===p.correctTrace?.[i]))choices.reverse();
    return choices;
  },[p.id,p.correctTrace]);
  const move=(index:number,offset:number)=>{
    if(submitted || index+offset<0 || index+offset>=ordering.length)return;
    const next=[...ordering];[next[index],next[index+offset]]=[next[index+offset],next[index]];onUpdate({...answer,order:next});setFeedback(null);
  };
  const updateDrop=(e:PointerEvent<HTMLElement>)=>{
    if(!dragRef.current)return;
    const target=document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-bucket]');
    if(target?.dataset.bucket)assign(dragRef.current,target.dataset.bucket);
    dragRef.current=null;
  };
  const trainingData=labelledData(profile);
  const repaired=answer.selected==='ON'&&model?trainThreshold([...trainingData,{temperature:19,label:1}]):null;

  // Determine if this is week-1 train/predict/repair or generic dispatch
  const isWeek1TrainPuzzle = p.week===1 && (p.kind==='train'||p.kind==='predict'||p.kind==='repair');

  return <section className="player" onPointerUp={updateDrop} aria-label={`Puzzle ${position} of ${total}`}>
    <header className="player-top">
      <button className="icon-button" aria-label="Exit to Academy" onClick={onExit}><ArrowLeft size={21}/></button>
      <div className="player-progress"><span>{p.sequence}</span><div className="progress-track"><div style={{width:`${Math.min(100,position/total*100)}%`}}/></div></div>
      <span className="counter">{p.advanced?'BONUS':`${position}/${total}`}</span>
    </header>
    <div className="player-header">
      <div className="eyebrow">{guest?"OPEN DEMO · ":""}WEEK {String(p.week).padStart(2,'0')} <span className="dot"/> {p.advanced?'ADVANCED CHALLENGE':p.isCheckpoint?'APPLIED CHECKPOINT':'MICRO PUZZLE'}</div>
      <h1>{p.title}</h1>
      <p>{p.instruction}</p>
    </div>
    <div className="puzzle-stage">
      {(p.kind==='sort'||p.kind==='dataset-label') && <>
        <div className="stage-caption">SIGNAL INPUTS <span>{Object.keys(answer.assignments??{}).length}/{p.items?.length} assigned</span></div>
        <div className="signal-grid">
          {p.items?.map(i=><button key={i.id} className={`signal-card ${selectedItem===i.id?'selected':''} ${answer.assignments?.[i.id]?'assigned':''}`}
            draggable={!submitted}
            onPointerDown={()=>dragRef.current=i.id}
            onDragStart={e=>{e.dataTransfer.setData('text/plain',i.id);setSelectedItem(i.id)}}
            onClick={()=>{if(!submitted)setSelectedItem(i.id)}} aria-pressed={selectedItem===i.id}>
            {i.shape?<div className={`signal-shape ${i.shape}`} style={{borderColor:i.color,backgroundColor:`${i.color}22`}}/>:<span className="signal-number">{i.title}</span>}
            <span className="signal-text">{i.shape?i.title:i.subtitle}</span>
            {answer.assignments?.[i.id]&&<span className="signal-tag">{answer.assignments[i.id]}</span>}
          </button>)}
        </div>
        <div className="stage-caption">DESTINATIONS <span>Tap an input, then a destination</span></div>
        <div className="bucket-grid">
          {p.buckets?.map(b=><button key={b.id} data-bucket={b.id} disabled={submitted} className="bucket" onClick={()=>selectedItem&&assign(selectedItem,b.id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();assign(e.dataTransfer.getData('text/plain'),b.id)}}><span className="bucket-icon">◇</span>{b.title}<span className="bucket-count">{Object.values(answer.assignments??{}).filter(x=>x===b.id).length}</span></button>)}
        </div>
      </>}
      {(p.kind==='choice'||(p.kind==='predict'&&isWeek1TrainPuzzle)||(p.kind==='repair'&&isWeek1TrainPuzzle))&&<>
        {p.kind==='predict'&&model&&<div className="model-readout"><div><span>LEARNED THRESHOLD</span><strong>{model.threshold}°C</strong></div><div><span>MODEL ACCURACY</span><strong>{Math.round(model.accuracy*100)}%</strong></div></div>}
        {p.kind==='repair'&&model&&<div className="model-readout warning"><div><span>OLD PREDICTION AT 19°C</span><strong>{predictThreshold(model.threshold,19)===1?'ON':'OFF'}</strong></div><div><span>OBSERVED LABEL</span><strong>ON</strong></div></div>}
        <div className="choice-list">{p.options?.map((o,i)=><button key={o.id} disabled={submitted} className={`choice ${answer.selected===o.id?'selected':''}`} onClick={()=>choose(o.id)}><span className="choice-index">{String.fromCharCode(65+i)}</span><span className="choice-label"><strong>{o.title}</strong>{o.detail&&<small>{o.detail}</small>}</span><span className="choice-state">{answer.selected===o.id?<Check size={16}/>:null}</span></button>)}</div>
        {p.kind==='repair'&&<><button disabled={submitted||!answer.selected} className="secondary-button full" onClick={()=>onUpdate({...answer,trained:true})}>Retrain with selected observation <RotateCcw size={16}/></button>{answer.trained&&<div className="model-note">{repaired?`New threshold: ${repaired.threshold}°C · training accuracy: ${Math.round(repaired.accuracy*100)}%`:'The selected observation contradicts the known evidence. Check the label.'}</div>}</>}
      </>}
      {p.kind==='order'&&<><div className="stage-caption">EXECUTION ORDER <span>Move blocks up or down</span></div><div className="order-list">{ordering.map((id,index)=><div className="order-item" key={id}><span className="order-index">{index+1}</span><span>{p.steps?.find(s=>s.id===id)?.title}</span><div className="order-controls"><button disabled={submitted||index===0} onClick={()=>move(index,-1)} aria-label={`Move ${id} up`}><MoveUp size={18}/></button><button disabled={submitted||index===ordering.length-1} onClick={()=>move(index,1)} aria-label={`Move ${id} down`}><MoveDown size={18}/></button></div></div>)}</div></>}
      {(p.kind==='numeric'||p.kind==='slider')&&<div className="numeric-editor">
        <label className="field-label" htmlFor="numeric-answer">YOUR CALCULATED ANSWER {p.numeric?.unit??''}</label>
        {p.kind==='slider'&&p.numeric?<><input id="numeric-answer" type="range" min={p.numeric.min??0} max={p.numeric.max??1} step={0.01} className="parameter-slider" value={answer.numberValue??p.numeric.min??0} disabled={submitted} onChange={e=>onUpdate({...answer,numberValue:Number(e.target.value)})}/><span className="slider-value">{(answer.numberValue??p.numeric.min??0).toFixed(2)}</span></>:<input id="numeric-answer" type="number" inputMode="decimal" step="any" className="project-title-input" value={answer.numberValue??''} disabled={submitted} onChange={e=>onUpdate({...answer,numberValue:e.target.value===''?undefined:Number(e.target.value)})}/>}
      </div>}
      {p.kind==='multi'&&<div className="choice-list">{p.options?.map(o=><button className={`choice ${(answer.selectedMany??[]).includes(o.id)?'selected':''}`} key={o.id} disabled={submitted} aria-pressed={(answer.selectedMany??[]).includes(o.id)} onClick={()=>{const prev=answer.selectedMany??[];onUpdate({...answer,selectedMany:prev.includes(o.id)?prev.filter(v=>v!==o.id):[...prev,o.id]})}}><span className="choice-label"><strong>{o.title}</strong>{o.detail&&<small>{o.detail}</small>}</span><span className="choice-state">{(answer.selectedMany??[]).includes(o.id)?<Check size={16}/>:null}</span></button>)}</div>}
      {p.kind==='parameters'&&p.parameterGoal&&<div className="numeric-editor"><label className="field-label" htmlFor="parameter-slider">{p.parameterGoal.key}: {(answer.parameters?.[p.parameterGoal.key]??p.parameterGoal.min).toFixed(2)}</label><input id="parameter-slider" type="range" min={p.parameterGoal.min} max={p.parameterGoal.max} step={(p.parameterGoal.max-p.parameterGoal.min)/100} disabled={submitted} value={answer.parameters?.[p.parameterGoal.key]??p.parameterGoal.min} onChange={e=>onUpdate({...answer,parameters:{...answer.parameters,[p.parameterGoal!.key]:Number(e.target.value)}})}/><div className="parameter-range"><span>{p.parameterGoal.min}</span><span>{p.parameterGoal.max}</span></div></div>}
      {p.kind==='connect'&&<div className="order-list"><div className="stage-caption">CONNECT GRAPH EDGES</div>{(p.correctConnections??[]).map(([source],i)=><div className="order-item" key={`${source}-${i}`}><strong>{source}</strong><span>→</span><select disabled={submitted} aria-label={`Destination for ${source}`} value={answer.connections?.[i]?.[1]??''} onChange={e=>{const next=[...(answer.connections??[])];next[i]=[source,e.target.value];onUpdate({...answer,connections:next})}}><option value="">Select destination</option>{[...new Set((p.correctConnections??[]).flat())].map(id=><option key={id} value={id}>{id}</option>)}</select></div>)}</div>}
      {p.kind==='trace'&&<div className="order-list"><div className="stage-caption">EXECUTION TRACE <span>Tap steps in execution order</span></div><div className="trace-steps">{traceChoices.map(step=><button key={step} className={`choice ${(answer.trace??[]).includes(step)?'selected':''}`} disabled={submitted} onClick={()=>onUpdate({...answer,trace:[...(answer.trace??[]),step]})}>{step}</button>)}</div><p className="small-muted">Current trace: {(answer.trace??[]).join(' → ')||'Empty'}</p><button className="secondary-button" disabled={submitted} onClick={()=>onUpdate({...answer,trace:[]})}>Clear trace</button></div>}
      {p.kind==='drag-connect'&&<div className="order-list"><div className="stage-caption">DRAG TO CONNECT NODES</div><p className="small-muted">Visual node connection — connect nodes by selecting source then destination.</p>{(p.correctConnections??[]).map(([source],i)=><div className="order-item" key={`drag-${source}-${i}`}><strong>{source}</strong><span>→</span><select disabled={submitted} aria-label={`Destination for ${source}`} value={answer.connections?.[i]?.[1]??''} onChange={e=>{const next=[...(answer.connections??[])];next[i]=[source,e.target.value];onUpdate({...answer,connections:next})}}><option value="">Select destination</option>{[...new Set((p.correctConnections??[]).flat())].map(id=><option key={id} value={id}>{id}</option>)}</select></div>)}</div>}
      {p.kind==='train'&&isWeek1TrainPuzzle&&<>
        <div className="stage-caption">LABELED TRAINING EXAMPLES <span>{trainingData.length} samples</span></div>
        <div className="data-table"><div className="data-head"><span>TEMPERATURE</span><span>LABEL</span></div>{trainingData.map((d,i)=><div className="data-row" key={i}><span>{d.temperature}°C</span><span className={d.label?'data-on':'data-off'}>{d.label?'ON':'OFF'}</span></div>)}</div>
        <button className="action-button full" disabled={submitted||trainingData.length!==6} onClick={()=>onUpdate({...answer,trained:true})}><Zap size={18}/> Train real threshold model</button>
        {answer.trained&&model&&<div className="model-readout"><div><span>LEARNED THRESHOLD</span><strong>{model.threshold}°C</strong></div><div><span>TRAINING ACCURACY</span><strong>{Math.round(model.accuracy*100)}%</strong></div></div>}
      </>}
      {p.kind==='train'&&!isWeek1TrainPuzzle&&<>
        <div className="stage-caption">TRAINING PUZZLE</div>
        <p className="small-muted">{p.instruction}</p>
        <button className="action-button full" disabled={submitted} onClick={()=>{const custom=onTrain?.(p);const info=typeof custom==='string'?custom:dispatchTrain(p,profile);setTrainInfo(info??'Model trained.');onUpdate({...answer,trained:true});}}><Zap size={18}/> Train model</button>
        {trainInfo&&<div className="model-note">{trainInfo}</div>}
        {p.options&&<div className="choice-list">{p.options.map((o,i)=><button key={o.id} disabled={submitted} className={`choice ${answer.selected===o.id?'selected':''}`} onClick={()=>choose(o.id)}><span className="choice-index">{String.fromCharCode(65+i)}</span><span className="choice-label"><strong>{o.title}</strong>{o.detail&&<small>{o.detail}</small>}</span><span className="choice-state">{answer.selected===o.id?<Check size={16}/>:null}</span></button>)}</div>}
      </>}
      {p.kind==='predict'&&!isWeek1TrainPuzzle&&<>
        <div className="stage-caption">PREDICTION PUZZLE</div>
        {p.options&&<div className="choice-list">{p.options.map((o,i)=><button key={o.id} disabled={submitted} className={`choice ${answer.selected===o.id?'selected':''}`} onClick={()=>choose(o.id)}><span className="choice-index">{String.fromCharCode(65+i)}</span><span className="choice-label"><strong>{o.title}</strong>{o.detail&&<small>{o.detail}</small>}</span><span className="choice-state">{answer.selected===o.id?<Check size={16}/>:null}</span></button>)}</div>}
      </>}
      {p.kind==='repair'&&!isWeek1TrainPuzzle&&<>
        <div className="stage-caption">REPAIR PUZZLE</div>
        {p.options&&<div className="choice-list">{p.options.map((o,i)=><button key={o.id} disabled={submitted} className={`choice ${answer.selected===o.id?'selected':''}`} onClick={()=>choose(o.id)}><span className="choice-index">{String.fromCharCode(65+i)}</span><span className="choice-label"><strong>{o.title}</strong>{o.detail&&<small>{o.detail}</small>}</span><span className="choice-state">{answer.selected===o.id?<Check size={16}/>:null}</span></button>)}</div>}
        <button disabled={submitted||!answer.selected} className="secondary-button full" onClick={()=>onUpdate({...answer,trained:true})}>Apply fix <RotateCcw size={16}/></button>
      </>}
    </div>
    {isSkipped&&!submitted&&<div className="guest-banner" role="status">Previously skipped. Solve this puzzle now to verify mastery and earn its one-time XP.</div>}
    {feedback==='wrong'&&!submitted&&<p className="feedback wrong" role="status">Not quite. Inspect the examples and try another approach.</p>}
    {assistance&&!submitted&&<div className="assistance" aria-label="Adaptive assistance"><div className="assistance-title"><Lightbulb size={17}/> MINI PRACTICE · FREE</div><p>Which part of an observation should guide a classification: a relevant feature or an unrelated decoration?</p><div className="assistance-actions"><button onClick={()=>setSupportSolved(true)}>Relevant feature</button><button onClick={()=>setSupportSolved(false)}>Decoration</button></div>{supportSolved&&<p className="success-text">Exactly. Return to the original puzzle with your workspace preserved.</p>}<button className="linklike" onClick={()=>setAssistance(false)}>Return to puzzle</button></div>}
    {hintVisible&&!submitted&&<div className="hint-box"><Lightbulb size={16}/><span>{p.hint}</span></div>}
    {submitted&&<div className="completion-box"><span className="completion-icon"><Check size={18}/></span><div><strong>{isSkipped?'Puzzle skipped': 'Well done — valid solution'}</strong><small>{isSkipped?'Progress unlocked; mastery not awarded.':`+${puzzleXP(p)} XP earned once`}</small></div></div>}
    {submitted&&p.discovery&&isSolved&&<div className="discovery-box"><div className="discovery-title"><Sparkles size={18}/> DISCOVERY UNLOCKED</div><h3>{p.discovery.title}</h3><div className="mini-tabs"><button className={explainLayer==='intuition'?'active':''} onClick={()=>setExplainLayer('intuition')}>Intuition</button><button className={explainLayer==='example'?'active':''} onClick={()=>setExplainLayer('example')}>Example</button><button className={explainLayer==='technical'?'active':''} onClick={()=>setExplainLayer('technical')}>Technical</button></div><p>{p.discovery[explainLayer]}</p></div>}
    {!submitted&&<div className="support-actions"><button onClick={onUndo} disabled={!(profile.histories?.[p.id]?.past.length)}><Undo2 size={17}/> Undo</button><button onClick={onRedo} disabled={!(profile.histories?.[p.id]?.future.length)}><Redo2 size={17}/> Redo</button></div>}
    <div className="player-footer">
      {submitted?<button className="action-button full" onClick={onNext}>Continue <ArrowRight size={18}/></button>:<button className="action-button full" onClick={check} disabled={!correct && p.kind==='train'&&!answer.trained}>Check answer <ArrowRight size={18}/></button>}
      {!submitted&&<div className="support-actions"><button onClick={showHint} disabled={hintVisible||profile.credits<1&&!profile.hintClaims?.[p.id]}><CircleHelp size={17}/> Hint · 1 credit</button><button onClick={onSkip} disabled={isSkipped||profile.credits<2}>Skip · 2 credits <ArrowRight size={14}/></button></div>}
      <div className="wallet"><Zap size={14}/> {profile.credits}/6 hint credits <span>· +2 every 12 hours</span></div>
      {['w1-06','w1-07','w1-08','w1-09','w1-10'].includes(p.id)&&<button className="linklike" onClick={onLab}><FlaskConical size={15}/> Copy this model into Laboratory</button>}
    </div>
  </section>;
}
