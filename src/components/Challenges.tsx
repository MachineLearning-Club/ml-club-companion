import { useState } from 'react';
import { CalendarDays, LockKeyhole, Check, ArrowRight, Users } from 'lucide-react';
import type { LearningProfile } from '../core/types';
const bank=[
 {q:'A fair six-sided die is rolled. Given the result is odd, what is P(result > 3)?',choices:['1/3','1/2','2/3'],correct:'1/3',explanation:'Odd outcomes are {1,3,5}; only 5 exceeds 3.'},
 {q:'A classifier predicts ON for all six observations, but only three should be ON. What is its accuracy?',choices:['25%','50%','75%'],correct:'50%',explanation:'3 correct out of 6 predictions gives 50% accuracy.'},
 {q:'A fair coin is flipped twice. What is the probability of exactly one head?',choices:['1/4','1/2','3/4'],correct:'1/2',explanation:'Two of four equally likely outcomes have exactly one head: HT and TH.'},
 {q:'Two independent fair six-sided dice are rolled. What is the probability that both show six?',choices:['1/6','1/12','1/36'],correct:'1/36',explanation:'Independent outcomes multiply: (1/6) × (1/6) = 1/36.'}
];
function utcDay(){return new Date().toISOString().slice(0,10);}
function utcWeek(){const d=new Date();const day=(d.getUTCDay()+6)%7;d.setUTCDate(d.getUTCDate()-day);return d.toISOString().slice(0,10);}
export function Challenges({profile,guest,onComplete}: {profile:LearningProfile;guest:boolean;onComplete:(id:string,xp:number)=>void}){
 const day=utcDay();const week=utcWeek();const index=Math.floor(Date.parse(`${day}T00:00:00Z`)/86400000)%bank.length;const challenge=bank[index];const id=`daily:${day}:foundations`;
 const [selected,setSelected]=useState('');const [feedback,setFeedback]=useState<'valid'|'invalid'|null>(null);
 const eligible=guest||!!profile.completed['w1-03'];const claimed=!!profile.xpAwards[`challenge:${id}`];
 return <div className="screen-stack"><div className="section-title"><div><div className="eyebrow">SHARED PRACTICE</div><h1>Challenges</h1><p>The same problems for learners at the same curriculum level.</p></div><div className="header-emblem"><CalendarDays size={24}/></div></div>
 <div className="challenge-card"><div className="eyebrow">DAILY · {day} UTC</div><div className="section-row"><h2>Foundations Challenge</h2><span>+40 XP</span></div><p>{challenge.q}</p>
 {eligible?<><div className="choice-list">{challenge.choices.map(c=><button className={`choice ${selected===c?'selected':''}`} disabled={claimed||feedback==='valid'} key={c} onClick={()=>{setSelected(c);setFeedback(null)}}><span className="choice-index">◇</span><span className="choice-label"><strong>{c}</strong></span></button>)}</div>
 {claimed?<div className="completion-box"><Check size={19}/> Completed — reward saved for this date.</div>:feedback==='valid'?<div className="completion-box"><Check size={19}/> {challenge.explanation}</div>:<><button className="action-button full" disabled={!selected} onClick={()=>{if(selected===challenge.correct){setFeedback('valid');onComplete(id,40)}else setFeedback('invalid')}}>Check challenge <ArrowRight size={16}/></button>{feedback==='invalid'&&<p className="feedback wrong">Recount the possible outcomes and try again.</p>}</>}
 </>:<div className="not-ready"><LockKeyhole size={18}/><p>Complete the first rules sequence to unlock shared challenges.</p></div>}
 </div>
 <div className="chapter-detail"><div className="eyebrow">WEEKLY · STARTING {week} UTC</div><h2>Applied Challenge</h2><p>Weekly scenarios will combine multiple concepts and take approximately 10–15 minutes. The weekly solver is not authored yet; this card is a development preview, not a simulated challenge.</p><span className="pill"><Users size={14}/> Solution Gallery · future online release</span></div>
 <p className="small-muted">Daily problems are deterministic by UTC date. No leaderboard, penalty streaks or internet access required. The current slice ships only the Foundations daily challenge track.</p>
 </div>;
}
