import { useRef, useState } from 'react';
import { FlaskConical, Plus, Copy, Trash2, Download, Upload, ArrowLeft, Save, Play, GitBranch, RotateCcw, Sparkles } from 'lucide-react';
import type { LabProject, ThresholdLabProject } from '../core/types';
import { KMeansWorkspace } from './KMeansWorkspace';
import { trainThreshold, predictThreshold } from '../core/algorithms';
import { exportProject, importProject, newProject, newKMeansProject } from '../storage/files';
export function Laboratory({projects,guest,activeId,onActive,onSave,onDelete}:{projects:LabProject[];guest:boolean;activeId:string|null;onActive:(id:string|null)=>void;onSave:(project:LabProject)=>void;onDelete:(id:string)=>void}){
 const inputRef=useRef<HTMLInputElement>(null);
 const [message,setMessage]=useState('');
 const project=projects.find(p=>p.id===activeId);
 const update=(changes:Partial<ThresholdLabProject>)=>{if(project?.kind==='threshold')onSave({...project,...changes,updatedAt:new Date().toISOString()})};
 const openNew=(origin?:string)=>{const p=newProject(origin);onSave(p);onActive(p.id)};
 const duplicate=(p:LabProject)=>{const now=new Date().toISOString();const next={...p,id:newProject().id,title:`${p.title} (copy)`,createdAt:now,updatedAt:now};onSave(next);onActive(next.id)};
 const model=project?.kind==='threshold'&&project.data.length?trainThreshold(project.data):null;
 return <div className="screen-stack"><div className="section-title"><div><div className="eyebrow">FREE EXPERIMENTATION</div><h1>Laboratory</h1><p>Build, test, modify. Learn by experimenting.</p></div><div className="header-emblem"><FlaskConical size={24}/></div></div>
 {guest&&<div className="guest-banner">Guest experiments are temporary. Export projects before exiting Guest Mode.</div>}
 {!project?<>
   <button className="continue-banner" onClick={()=>openNew()}><span className="continue-orb"><Plus size={22}/></span><span><small>CREATE EXPERIMENT</small><strong>Blank workspace</strong><em>Start with an editable labelled dataset</em></span></button>
   <button className="secondary-button full" onClick={()=>openNew('Week 1 dataset')}><Sparkles size={17}/> Threshold classifier preset</button><button className="secondary-button full" onClick={()=>{const p=newKMeansProject();onSave(p);onActive(p.id)}}><Sparkles size={17}/> Real K-Means experiment</button>
   <div className="section-row"><h2>Project Library</h2><span>{projects.length} projects</span></div>
   {projects.length===0&&<div className="empty-state"><FlaskConical size={24}/> No projects yet. Start a new experiment or bring one from Academy.</div>}
   <div className="project-list">{projects.map(p=><div className="project-item" key={p.id}><button onClick={()=>onActive(p.id)}><span className="project-icon"><GitBranch size={20}/></span><span><strong>{p.title}</strong><small>{p.kind==='threshold'?`Threshold classifier · ${p.data.length} observations`:`K-Means · ${p.points.length} points`}</small><em>Edited {new Date(p.updatedAt).toLocaleDateString()}</em></span></button><div className="project-actions"><button title="Duplicate" aria-label={`Duplicate ${p.title}`} onClick={()=>duplicate(p)}><Copy size={16}/></button><button title="Export" aria-label={`Export ${p.title}`} onClick={()=>exportProject(p)}><Download size={16}/></button><button title="Delete" aria-label={`Delete ${p.title}`} onClick={()=>{if(confirm(`Delete ${p.title}?`))onDelete(p.id)}}><Trash2 size={16}/></button></div></div>)}</div>
   <button className="secondary-button full" onClick={()=>inputRef.current?.click()}><Upload size={17}/> Import .mlclub project</button>
   <input ref={inputRef} type="file" accept=".mlclub,application/json" hidden onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{const p=importProject(await f.text());onSave(p);onActive(p.id);setMessage('Project imported as an independent copy.')}catch(err){setMessage((err as Error).message)}e.target.value='';}}/>
   {message&&<p className="small-muted" role="status">{message}</p>}
 </>:<>
   <div className="row-between"><button className="text-button" onClick={()=>onActive(null)}><ArrowLeft size={16}/> All projects</button><span className="storage-state"><Save size={15}/> Autosaved locally</span></div>
   <label className="field-label" htmlFor="project-title">PROJECT NAME</label>
   <input id="project-title" className="project-title-input" aria-label="Project name" value={project.title} onChange={e=>update({title:e.target.value.slice(0,80)})}/>
   {project.kind==='kmeans'?<KMeansWorkspace project={project} onSave={onSave}/>:<div className="experiment-view"><div className="stage-caption">LABELLED DATA <span>Toggle labels to experiment</span></div><div className="dataset-tags">{project.data.map((d,i)=><div className="dataset-chip" key={i}><span>{d.temperature}°C</span><button aria-label={`Toggle label for ${d.temperature} degrees`} className={d.label?'data-on':'data-off'} onClick={()=>update({data:project.data.map((x,j)=>i===j?{...x,label:(x.label===1?0:1) as 0|1}:x)})}>{d.label?'ON':'OFF'}</button><button aria-label={`Delete observation ${d.temperature}`} onClick={()=>update({data:project.data.filter((_,j)=>i!==j)})}><Trash2 size={13}/></button></div>)}</div>
   <div className="lab-new-row"><input id="new-temp" aria-label="New temperature observation" type="number" defaultValue={19} step="1"/><button className="secondary-button" onClick={()=>{const e=document.getElementById('new-temp') as HTMLInputElement;const temp=Number(e?.value);if(Number.isFinite(temp)&&project.data.length<10000)update({data:[...project.data,{temperature:temp,label:1}]});}}><Plus size={15}/> Add ON sample</button></div>
   <div className="stage-caption">MODEL EXECUTION <span>Real threshold search</span></div>
   {model?<><div className="model-readout"><div><span>LEARNED BOUNDARY</span><strong>{model.threshold}°C</strong></div><div><span>TRAINING ACCURACY</span><strong>{Math.round(model.accuracy*100)}%</strong></div></div>
     <div className="label-value"><label htmlFor="test-temperature">Test input temperature</label><strong>{project.testTemperature}°C</strong></div>
     <input id="test-temperature" className="range" type="range" min="5" max="35" step="1" value={project.testTemperature} onChange={e=>update({testTemperature:Number(e.target.value)})}/>
     <div className="prediction-output"><Play size={17}/><span>Predicted output</span><strong>{predictThreshold(model.threshold,project.testTemperature)?'ON':'OFF'}</strong></div>
   </>:<div className="not-ready">Add at least one observation to train the model.</div>}
   <p className="small-muted">This is a real one-dimensional empirical-risk threshold model. The code computes every candidate midpoint from the observations. More algorithm workspaces are scaffolded for subsequent development.</p></div>}
   <div className="lab-actions"><button className="secondary-button" onClick={()=>duplicate(project)}><Copy size={16}/> Duplicate</button><button className="secondary-button" onClick={()=>exportProject(project)}><Download size={16}/> Export</button>{project.kind==='threshold'&&<button className="secondary-button" onClick={()=>{if(confirm('Reset dataset to the initial examples?'))update({data:newProject('Threshold preset').data,testTemperature:19})}}><RotateCcw size={16}/> Reset data</button>}</div>
 </>}
 </div>;
}
