import { useMemo } from 'react';
import type { KMeansLabProject } from '../core/types';
import { runKMeans, type Point } from '../core/simulations';
import { RotateCcw, StepForward, Play, Plus } from 'lucide-react';
const palette=['#32D9EF','#8D78FF','#E6B25B','#66CDAA','#DF80C9','#7DAAFF'];
/** The same trace data drives Run, Step, Reset and the visualization: no fake animation. */
export function KMeansWorkspace({project,onSave}:{project:KMeansLabProject;onSave:(p:KMeansLabProject)=>void}){
 const history=useMemo(()=>project.points.length?runKMeans(project.points,project.initialCentroids,50):[],[project.points,project.initialCentroids]);
 const step=history[Math.min(Math.max(0,project.iteration-1),history.length-1)];
 const center=project.iteration>0&&step?step.centroids:project.initialCentroids;
 const assignments=project.iteration>0&&step?step.assignments:project.points.map(()=>-1);
 const patch=(changes:Partial<KMeansLabProject>)=>onSave({...project,...changes,updatedAt:new Date().toISOString()});
 const scale=(v:number)=>Math.max(14,Math.min(286,(v+5)*30));
 const addPoint=()=>{if(project.points.length>=10000)return;const n=project.points.length;patch({points:[...project.points,[((n*37)%90)/10-4.5,((n*17)%90)/10-4.5]],iteration:0});};
 const changeK=(delta:number)=>{
  const next=Math.min(6,Math.max(1,project.k+delta));if(next===project.k)return;
  const all:Point[]=[...project.initialCentroids,[-3,-2],[3,-2],[0,3],[-4,0],[4,0],[0,0]];
  patch({k:next,initialCentroids:all.slice(0,next).map(c=>[...c] as [number,number]),iteration:0});
 };
 return <div className="experiment-view kmeans-workspace">
  <div className="stage-caption">CLUSTERING CANVAS <span>{project.points.length} points · {project.k} centroids</span></div>
  <svg role="img" aria-label={`Scatterplot with ${project.points.length} points; iteration ${project.iteration}`} viewBox="0 0 300 300" className="kmeans-canvas">
    <rect x="0" y="0" width="300" height="300" rx="12" fill="#121D31"/>
    {Array.from({length:9},(_,i)=><g key={i}><path d={`M${30+i*30} 10 V290 M10 ${30+i*30} H290`} stroke="#34445e" strokeWidth=".6"/></g>)}
    {project.points.map(([x,y],i)=><circle key={i} cx={scale(x)} cy={300-scale(y)} r="4.5" fill={assignments[i]<0?'#b8c8e7':palette[assignments[i]%palette.length]} stroke="#dce7ff" strokeWidth=".6"/>)}
    {center.map(([x,y],i)=><g key={i}><circle cx={scale(x)} cy={300-scale(y)} r="12" fill="none" stroke={palette[i%palette.length]} strokeWidth="2"/><path d={`M${scale(x)-7} ${300-scale(y)} h14 M${scale(x)} ${300-scale(y)-7} v14`} stroke={palette[i%palette.length]} strokeWidth="2"/></g>)}
  </svg>
  <div className="model-readout"><div><span>ITERATION</span><strong>{project.iteration} / {history.length}</strong></div><div><span>INERTIA (SSE)</span><strong>{step&&project.iteration>0?step.inertia.toFixed(2):'—'}</strong></div></div>
  <div className="lab-actions"><button className="secondary-button" aria-label="Decrease K" onClick={()=>changeK(-1)}>−</button><span className="small-muted">K = {project.k}</span><button className="secondary-button" aria-label="Increase K" onClick={()=>changeK(1)}>+</button></div>
  <div className="lab-actions"><button className="action-button" onClick={()=>patch({iteration:history.length})}><Play size={16}/> Run</button><button className="secondary-button" onClick={()=>patch({iteration:Math.min(project.iteration+1,history.length)})}><StepForward size={16}/> Step</button><button className="secondary-button" onClick={()=>patch({iteration:0})}><RotateCcw size={16}/> Reset</button><button className="secondary-button" onClick={addPoint}><Plus size={16}/> Point</button></div>
  <p className="small-muted">Actual Lloyd iterations. Centroid updates and inertia come from the offline algorithm kernel. A repeated state means convergence.</p>
 </div>;
}
