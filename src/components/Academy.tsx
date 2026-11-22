import { ArrowRight, BookOpen, Check, Circle, LockKeyhole, Sparkles, ChevronRight } from 'lucide-react';
import { weeks, mainPuzzles } from '../content/registry';
import type { LearningProfile, Puzzle } from '../core/types';
import { mastery } from '../core/progression';
type Props={profile:LearningProfile;guest:boolean;selectedWeek:number;onSelectWeek:(week:number)=>void;onPlay:(p:Puzzle)=>void};
export function Academy({profile,guest,selectedWeek,onSelectWeek,onPlay}:Props){
  const w=weeks[selectedWeek-1];
  const completed=mainPuzzles.filter(p=>!!profile.completed[p.id]).length;
  const m=mastery(profile,mainPuzzles);
  const next=mainPuzzles.find(p=>!profile.completed[p.id]);
  const isPlayable=(p:Puzzle)=>{
    if(guest)return true;
    const idx=mainPuzzles.findIndex(q=>q.id===p.id);
    return idx===0||mainPuzzles.slice(0,idx).every(q=>!!profile.completed[q.id]);
  };
  const firstWeekUnfinished=w.puzzles.some(p=>!p.advanced&&!profile.completed[p.id]);
  return <div className="screen-stack">
    <div className="section-title"><div><div className="eyebrow">YOUR LEARNING JOURNEY</div><h1>Academy</h1><p>Fifteen weeks. One connected world of ideas.</p></div><div className="header-emblem">✧</div></div>
    <div className="stats-card"><div><span>EXPERIENCE PATH</span><strong>{completed}<small> / {mainPuzzles.length} available</small></strong></div><div><span>CONCEPT MASTERY</span><strong>{m.verified}<small> / {m.total} assessed</small></strong></div></div>
    {next&&!guest&&<button className="continue-banner" onClick={()=>onPlay(next)}><span className="continue-orb"><ArrowRight size={22}/></span><span><small>CONTINUE LEARNING</small><strong>{next.title}</strong><em>Week {next.week} · {next.sequence}</em></span><ChevronRight size={18}/></button>}
    {guest&&<div className="guest-banner"><Sparkles size={17}/> Open Demo: preview any week and try all currently authored puzzles.</div>}
    <div className="section-row"><h2>Curriculum map</h2><span>15 weeks</span></div>
    <div className="journey-map">
      {weeks.map(week=>{
        const count=week.puzzles.filter(p=>!p.advanced&&profile.completed[p.id]).length;
        const authored=week.puzzles.filter(p=>!p.advanced).length;
        const selected=week.number===selectedWeek;
        return <button className={`journey-node ${selected?'selected':''} module-${week.module}`} key={week.number} onClick={()=>onSelectWeek(week.number)}>
          <span className={`journey-index ${count&&count===authored?'finished':''}`}>{count&&count===authored?<Check size={18}/>:String(week.number).padStart(2,'0')}</span>
          <span className="journey-copy"><small>MODULE {week.module} · WEEK {String(week.number).padStart(2,'0')}</small><strong>{week.title}</strong><em>{authored?`${count}/${authored} playable puzzles`: 'Chapter preview'}</em></span>
          <ChevronRight size={17}/>
        </button>;
      })}
    </div>
    <div className="chapter-detail"><div className="eyebrow">WEEK {String(w.number).padStart(2,'0')} · CHAPTER PREVIEW</div><h2>{w.title}</h2><p>{w.summary}</p><div className="topic-cloud">{w.topics.map(t=><span key={t}>{t}</span>)}</div>
      {w.status==='planned'?<div className="not-ready"><LockKeyhole size={17}/><div><strong>Content pack scaffolded</strong><p>This chapter is in development. Its lesson description is visible; playable puzzles are not yet authored.</p></div></div>:<>
        <div className="section-row"><h3>Available puzzle sequences</h3><span>{w.puzzles.length} puzzles</span></div>
        <div className="puzzle-list">{w.puzzles.map(p=>{
          const status=profile.completed[p.id]; const available=p.advanced?(guest||!!profile.completed['w1-12']):isPlayable(p);
          return <button key={p.id} className="puzzle-row" disabled={!available} onClick={()=>onPlay(p)}><span className={`puzzle-status ${status??''}`}>{status==='solved'?<Check size={16}/>:status==='skipped'?'↷':p.advanced?<Sparkles size={16}/>:<Circle size={13}/>}</span><span><strong>{p.title}</strong><small>{p.advanced?'Advanced · optional':p.sequence}</small></span>{available?<ArrowRight size={16}/>:<LockKeyhole size={15}/>}</button>;
        })}</div>
        {firstWeekUnfinished&&<p className="small-muted">This is the first playable vertical slice, not a claim that the entire week is finished. More Week 1 sequences can be authored independently.</p>}
      </>}
    </div>
    <p className="source-note"><BookOpen size={14}/> Curriculum aligned to machinelearning-club.github.io</p>
  </div>;
}
