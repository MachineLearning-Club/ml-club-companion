import type { LabProject, LearningProfile, ThresholdLabProject } from '../core/types';
import { createProfile, makeId } from '../core/progression';
export type StorageMode='opfs'|'localstorage-fallback'|'memory-fallback';
export type Storage = {
  mode:StorageMode;
  loadProfile:()=>Promise<LearningProfile>;
  saveProfile:(profile:LearningProfile)=>Promise<void>;
  listProjects:()=>Promise<LabProject[]>;
  saveProject:(project:LabProject)=>Promise<void>;
  deleteProject:(id:string)=>Promise<void>;
};
const DEFAULT_PROFILE='main.json';
const parseProfile=(raw:string):LearningProfile=>{
  const p=JSON.parse(raw) as LearningProfile;
  if(p.schemaVersion!==1||typeof p.completed!=='object'||typeof p.workspaces!=='object'||!Array.isArray(p.discoveries)||typeof p.xpAwards!=='object'||!p.settings) throw new Error('Unsupported or corrupted learning profile');
  return p;
};
function parseProject(raw:string):LabProject {
  const p=JSON.parse(raw) as LabProject;
  if(p.schemaVersion!==1||!p.id||!p.title||!p.createdAt||!p.updatedAt)throw new Error('Unsupported or invalid project');
  if(p.kind==='threshold'){
    if(!Array.isArray(p.data)||p.data.length>10000||!Number.isFinite(p.testTemperature)||p.data.some(e=>!Number.isFinite(e.temperature)||(e.label!==0&&e.label!==1)))throw new Error('Invalid threshold project');
  }else if(p.kind==='kmeans'){
    if(!Array.isArray(p.points)||p.points.length>10000||!Array.isArray(p.initialCentroids)||p.initialCentroids.length<1||p.initialCentroids.length>12||!Number.isInteger(p.iteration)||p.iteration<0||p.iteration>1000||!Number.isInteger(p.k)||p.k!==p.initialCentroids.length||[...p.points,...p.initialCentroids].some(v=>v.length!==2||v.some(x=>!Number.isFinite(x))))throw new Error('Invalid K-Means project');
  }else throw new Error('Unsupported project kind');
  return p;
}
const safeFilename=(id:string)=>id.replace(/[^a-z0-9-]/gi,'').slice(0,100);
const getFile=async(dir:FileSystemDirectoryHandle,name:string)=>dir.getFileHandle(name,{create:true});
const write=async(dir:FileSystemDirectoryHandle,name:string,text:string)=>{const handle=await getFile(dir,name);const writer=await handle.createWritable();await writer.write(text);await writer.close();};
const read=async(dir:FileSystemDirectoryHandle,name:string):Promise<string|null>=>{try{const file=await (await dir.getFileHandle(name)).getFile();return await file.text();}catch{return null;}};

export async function createStorage():Promise<Storage> {
  if(navigator.storage && typeof navigator.storage.getDirectory==='function') {
    try {
      const root=await navigator.storage.getDirectory();
      const base=await root.getDirectoryHandle('ml-club-companion-v1',{create:true});
      const projectDir=await base.getDirectoryHandle('projects',{create:true});
      // Serialize writes to protect against out-of-order autosaves.
      let queue:Promise<void>=Promise.resolve();
      const enqueue=(fn:()=>Promise<void>):Promise<void>=>{const task=queue.then(fn);queue=task.catch(()=>{});return task;};
      return {
        mode:'opfs',
        loadProfile:async()=>{
          for(const filename of [DEFAULT_PROFILE,'main.backup.json']) {
            const raw=await read(base,filename);
            if(raw)try{return parseProfile(raw);}catch{/* attempt backup */}
          }
          return createProfile();
        },
        saveProfile:profile=>enqueue(async()=>{
          const previous=await read(base,DEFAULT_PROFILE);
          if(previous)await write(base,'main.backup.json',previous);
          await write(base,DEFAULT_PROFILE,JSON.stringify(profile));
        }),
        listProjects:async()=>{
          const list:LabProject[]=[];
          for await(const [name,handle] of projectDir.entries()) {
            if(handle.kind!=='file'||!name.endsWith('.json'))continue;
            const raw=await read(projectDir,name);
            if(raw)try{list.push(parseProject(raw));}catch{/* ignore malformed file */}
          }
          return list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
        },
        saveProject:project=>enqueue(()=>write(projectDir,`${safeFilename(project.id)}.json`,JSON.stringify(project))),
        deleteProject:id=>enqueue(()=>projectDir.removeEntry(`${safeFilename(id)}.json`))
      };
    }catch {/* Fall back only when OPFS genuinely cannot be used. */}
  }
  // Degraded compatibility mode, not the user-selected primary file store.
  try {
    const key='mlclub-compat-test';localStorage.setItem(key,'ok');localStorage.removeItem(key);
    const prefix='mlclub-compat-v1:';
    const raw=localStorage.getItem(prefix+'profile');
    return {
      mode:'localstorage-fallback',
      loadProfile:async()=>{try{return raw?parseProfile(raw):createProfile();}catch{return createProfile();}},
      saveProfile:async p=>{localStorage.setItem(prefix+'profile',JSON.stringify(p));},
      listProjects:async()=>{
        const list:LabProject[]=[];
        for(let i=0;i<localStorage.length;i++){
          const key=localStorage.key(i);
          if(!key?.startsWith(prefix+'project:'))continue;
          const value=localStorage.getItem(key);
          if(value)try{list.push(parseProject(value));}catch{/* skip invalid */}
        }
        return list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
      },
      saveProject:async p=>{localStorage.setItem(prefix+'project:'+safeFilename(p.id),JSON.stringify(p));},
      deleteProject:async id=>{localStorage.removeItem(prefix+'project:'+safeFilename(id));}
    };
  }catch{/* localStorage unavailable or blocked */}
  // Last resort. A warning is shown and an export remains available.
  let profile:LearningProfile=createProfile();
  const projects=new Map<string,LabProject>();
  return {mode:'memory-fallback',loadProfile:async()=>profile,saveProfile:async p=>{profile=p;},listProjects:async()=>[...projects.values()],saveProject:async p=>{projects.set(p.id,p);},deleteProject:async id=>{projects.delete(id);}};
}
export function newProject(origin?:string):ThresholdLabProject {
  const now=new Date().toISOString();
  return {schemaVersion:1,id:makeId(),title:origin?`Experiment from ${origin}`:'Untitled experiment',kind:'threshold',createdAt:now,updatedAt:now,origin,data:origin?[{temperature:16,label:1},{temperature:17,label:1},{temperature:18,label:1},{temperature:20,label:0},{temperature:21,label:0},{temperature:23,label:0}]:[],testTemperature:19};
}
export function downloadJson(data:unknown,name:string) {
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200);
}
export function exportProject(project:LabProject){downloadJson(project,`${safeFilename(project.title.toLowerCase().replaceAll(' ','-'))||'experiment'}.mlclub`);}
export function exportProfile(profile:LearningProfile,projects:LabProject[]){
  downloadJson({format:'mlclub-profile',schemaVersion:1,exportedAt:new Date().toISOString(),profile,projects},'ml-club-profile.mlprofile');
}
export function importProject(raw:string):LabProject {
  if(raw.length>2_000_000)throw new Error('Project file exceeds 2 MB');
  const project=parseProject(raw);
  const now=new Date().toISOString();
  return {...project,id:makeId(),createdAt:now,updatedAt:now,title:`${project.title} (imported)`};
}
export function importProfile(raw:string):{profile:LearningProfile;projects:LabProject[]} {
  if(raw.length>10_000_000)throw new Error('Profile backup exceeds 10 MB');
  const obj=JSON.parse(raw) as {format?:string;schemaVersion?:number;profile:LearningProfile;projects:LabProject[]};
  if(obj.format!=='mlclub-profile'||obj.schemaVersion!==1||!Array.isArray(obj.projects)||obj.projects.length>200)throw new Error('Unsupported backup');
  const profile=parseProfile(JSON.stringify(obj.profile));
  const projects=obj.projects.map(p=>parseProject(JSON.stringify(p)));
  return {profile,projects};
}

export function newKMeansProject():LabProject {
  const now=new Date().toISOString();
  return {schemaVersion:1,id:makeId(),title:'K-Means Sandbox',kind:'kmeans',createdAt:now,updatedAt:now,origin:'Clustering experiment',
    points:[[-3,2],[-2,2.5],[-2.8,1],[-1.3,2.8],[2.4,2.5],[3,1.5],[1.9,1],[2.9,3],[-0.8,-2],[.5,-2],[.2,-3],[-1,-3.4]],
    initialCentroids:[[-2,2],[2,2],[0,-2]],k:3,iteration:0};
}
