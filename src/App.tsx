import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BrainCircuit, CalendarDays, FlaskConical, Map, Network, Settings2, Zap, HardDrive, Download, Upload, Users, LogOut, RotateCcw } from 'lucide-react';
import type { LearningProfile, LabProject, Puzzle, PuzzleAnswer } from './core/types';
import { award, canSpend, createProfile, labelledData, levelAtXP, replenishCredits, totalXP, xpForDomain } from './core/progression';
import { assertContentIntegrity, mainPuzzles, puzzles } from './content/registry';
import { createStorage, exportProfile, importProfile, newProject, type Storage, type StorageMode } from './storage/files';
import { Academy } from './components/Academy';
import { PuzzlePlayer } from './components/PuzzlePlayer';
import { Atlas } from './components/Atlas';
import { Challenges } from './components/Challenges';
import { Laboratory } from './components/Laboratory';
import { t, type MessageKey } from './i18n';
import './styles.css';

type Tab='academy'|'challenges'|'laboratory'|'atlas'|'settings';
assertContentIntegrity();
const tI18n=t;
const TABS:{id:Tab;titleKey:MessageKey;icon:typeof Map}[]=[{id:'academy',titleKey:'academy',icon:Map},{id:'challenges',titleKey:'challenges',icon:CalendarDays},{id:'laboratory',titleKey:'laboratory',icon:FlaskConical},{id:'atlas',titleKey:'collection',icon:Network}];
export default function App(){
 const [loading,setLoading]=useState(true);
 const [storage,setStorage]=useState<Storage|null>(null);
 const [storageMode,setStorageMode]=useState<StorageMode>('opfs');
 const [mainProfile,setMainProfile]=useState<LearningProfile>(()=>createProfile());
 const [guest,setGuest]=useState(false);
 const [guestProfile,setGuestProfile]=useState<LearningProfile>(()=>createProfile());
 const [projects,setProjects]=useState<LabProject[]>([]);
 const [guestProjects,setGuestProjects]=useState<LabProject[]>([]);
 const [tab,setTab]=useState<Tab>('academy');
 const [playing,setPlaying]=useState<string|null>(null);
 const [selectedWeek,setSelectedWeek]=useState(1);
 const [activeProjectId,setActiveProjectId]=useState<string|null>(null);
 const [notice,setNotice]=useState('');
 const [importMessage,setImportMessage]=useState('');
 const backupInput=useRef<HTMLInputElement>(null);
 const currentProfile=guest?guestProfile:mainProfile;
 const setProfile=guest?setGuestProfile:setMainProfile;
 const currentProjects=guest?guestProjects:projects;
 const setCurrentProjects=guest?setGuestProjects:setProjects;
 useEffect(()=>{
   let mounted=true;
   (async()=>{
    const store=await createStorage();const p=replenishCredits(await store.loadProfile());const list=await store.listProjects();
    if(!mounted)return;
    setStorage(store);setStorageMode(store.mode);setMainProfile(p);setProjects(list);setSelectedWeek(p.currentWeek);
    if(p.activePuzzle && puzzles.some(q=>q.id===p.activePuzzle)){setPlaying(p.activePuzzle);}
    else if(Object.keys(p.completed).length===0){setPlaying(mainPuzzles[0].id);setMainProfile({...p,activePuzzle:mainPuzzles[0].id});}
    else setTab('academy');
    setLoading(false);
   })().catch(e=>{setNotice(`Unable to initialise local storage: ${String(e)}`);setLoading(false);});
   return()=>{mounted=false;};
 },[]);
 // OPFS is the primary file store; never put learning data into a remote service.
 useEffect(()=>{if(!storage||!mainProfile)return;const task=setTimeout(()=>{storage.saveProfile({...mainProfile,lastUpdated:new Date().toISOString()}).catch(e=>setNotice(`Autosave failed: ${String(e)}`))},170);return()=>clearTimeout(task);},[storage,mainProfile]);
 useEffect(()=>{if(!currentProfile)return;const id=setInterval(()=>setProfile(prev=>prev?replenishCredits(prev):prev),60_000);return()=>clearInterval(id);},[guest]);
 useEffect(()=>{document.documentElement.dataset.reducedMotion=currentProfile?.settings.reducedMotion?'true':'false';},[currentProfile?.settings.reducedMotion]);
 const profile=currentProfile;
 const puzzle=puzzles.find(p=>p.id===playing)??null;
 const position=puzzle?mainPuzzles.findIndex(p=>p.id===puzzle.id)+1:0;
 const startPuzzle=(p:Puzzle)=>{setPlaying(p.id);setTab('academy');setProfile(prev=>prev?{...prev,activePuzzle:p.id,currentWeek:p.week}:prev)};
 const changeAnswer=(answer:PuzzleAnswer)=>{if(!puzzle)return;setProfile(prev=>{
   if(!prev)return prev;
   const before=prev.workspaces[puzzle.id]??{};
   const history=prev.histories?.[puzzle.id]??{past:[],future:[]};
   const past=JSON.stringify(before)===JSON.stringify(answer)?history.past:[...history.past.slice(-49),before];
   return {...prev,workspaces:{...prev.workspaces,[puzzle.id]:answer},histories:{...prev.histories,[puzzle.id]:{past,future:[]}}};
 })};
 const restoreAnswer=(direction:'undo'|'redo')=>{if(!puzzle)return;setProfile(prev=>{
   if(!prev)return prev;
   const h=prev.histories?.[puzzle.id];if(!h)return prev;
   const from=direction==='undo'?h.past:h.future;
   if(!from.length)return prev;
   const current=prev.workspaces[puzzle.id]??{};
   const answer=direction==='undo'?from[from.length-1]:from[0];
   const after=direction==='undo'?{past:h.past.slice(0,-1),future:[current,...h.future]}:{past:[...h.past,current],future:h.future.slice(1)};
   return {...prev,workspaces:{...prev.workspaces,[puzzle.id]:answer},histories:{...prev.histories,[puzzle.id]:after}};
 })};
 const solve=()=>{if(!puzzle)return;setProfile(prev=>prev?award(prev,puzzle,'solved'):prev)};
 const skip=()=>{if(!puzzle || !profile||!canSpend(profile,2))return;setProfile(prev=>prev?award({...prev,credits:prev.credits-2},puzzle,'skipped'):prev)};
 const hint=()=>{
   if(!profile||!puzzle)return false;
   if(profile.hintClaims?.[puzzle.id])return true;
   if(!canSpend(profile,1))return false;
   setProfile(prev=>prev?{...prev,credits:prev.credits-1,hintClaims:{...prev.hintClaims,[puzzle.id]:true}}:prev);
   return true;
 };
 const exitPlayer=()=>{setPlaying(null);setTab('academy');setProfile(prev=>prev?{...prev,activePuzzle:null}:prev)};
 const next=useCallback(()=>{
   if(!playing)return;
   const idx=mainPuzzles.findIndex(p=>p.id===playing);
   const nextPuzzle=idx<0?null:mainPuzzles.slice(idx+1).find(p=>!((guest?guestProfile:mainProfile)?.completed[p.id]));
   if(nextPuzzle){setPlaying(nextPuzzle.id);setProfile(prev=>prev?{...prev,activePuzzle:nextPuzzle.id}:prev)}
   else {setPlaying(null);setTab('academy');setSelectedWeek(1);setProfile(prev=>prev?{...prev,activePuzzle:null}:prev);setNotice('First vertical slice completed. Additional Week 1 sequences are being authored.');}
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[playing,guest,guestProfile,mainProfile]);
 const saveProject=(project:LabProject)=>{setCurrentProjects(prev=>[project,...prev.filter(p=>p.id!==project.id)]);if(!guest){storage?.saveProject(project).catch(e=>setNotice(`Project save failed: ${String(e)}`));}};
 const deleteProject=(id:string)=>{setCurrentProjects(prev=>prev.filter(p=>p.id!==id));if(activeProjectId===id)setActiveProjectId(null);if(!guest)storage?.deleteProject(id).catch(e=>setNotice(`Delete failed: ${String(e)}`));};
 const labFromPuzzle=()=>{if(!puzzle)return;const base=newProject(puzzle.title);const labelled=profile?labelledData(profile):[];const extra=puzzle.id==='w1-09'&&profile?.workspaces['w1-09']?.trained&&profile.workspaces['w1-09']?.selected==='ON'?[{temperature:19,label:1 as const}]:[];const pr={...base,origin:puzzle.id,data:[...labelled,...extra]};saveProject(pr);setActiveProjectId(pr.id);setPlaying(null);setTab('laboratory');setProfile(prev=>prev?{...prev,activePuzzle:null}:prev)};
 const activateGuest=()=>{if(!profile)return;setGuest(true);setGuestProfile(createProfile());setGuestProjects([]);setActiveProjectId(null);setPlaying(null);setSelectedWeek(1);setTab('academy');setNotice('Open Demo enabled. The persistent profile is isolated.');};
 const exitGuest=()=>{if(!guest)return;if(guestProjects.length && !confirm('Exit Guest Mode? Unsaved guest projects will be discarded. Export any work you want to keep.'))return;setGuest(false);setGuestProjects([]);setActiveProjectId(null);setPlaying(null);setTab('academy');setNotice('Returned to your main learning profile.');};
 const grantChallenge=(id:string,xp:number)=>setProfile(prev=>prev?{...prev,xpAwards:{...prev.xpAwards,[`challenge:${id}`]:prev.xpAwards[`challenge:${id}`]??xp}}:prev);
 const learnedXP=useMemo(()=>profile?totalXP(profile):0,[profile]);
 const importBackup=async(file:File)=>{
  if(!storage)return;
  try{const backup=importProfile(await file.text());if(!confirm('Replace the current main learning profile with this backup? Existing projects with matching IDs will be replaced.'))return;
    for(const p of backup.projects)await storage.saveProject(p);
    await storage.saveProfile(backup.profile);setMainProfile(backup.profile);setProjects(await storage.listProjects());setNotice('Learning profile restored.');setImportMessage('Backup restored.');
  }catch(e){setImportMessage((e as Error).message)}
 };
 if(loading)return <main className="loading"><BrainCircuit size={44}/><h1>ML Club Companion</h1><p>Preparing your offline learning space…</p></main>;
 if(!profile)return <main className="loading"><h1>Storage unavailable</h1><p>{notice||'Restart the app in a supported browser.'}</p><button onClick={()=>location.reload()}>Retry</button></main>;
 return <div className="app-shell">
  <div className="desktop-rail"><div className="brand brand-large"><span className="brand-icon"><BrainCircuit size={20}/></span><span>ML Club<br/><strong>Companion</strong></span></div>{TABS.map(t=><button className={tab===t.id?'active':''} onClick={()=>{setPlaying(null);setTab(t.id);setProfile(prev=>prev?{...prev,activePuzzle:null}:prev)}} key={t.id}><t.icon size={19}/>{tI18n(profile.settings.locale,t.titleKey)}</button>)}<button className={tab==='settings'?'active':''} onClick={()=>{setPlaying(null);setTab('settings')}}><Settings2 size={19}/> Settings</button></div>
  <div className="app-content">
  {!playing&&<header className="app-topbar"><div className="brand"><span className="brand-icon"><BrainCircuit size={19}/></span><span>ML <strong>Companion</strong></span></div><div className="topbar-metrics"><span><Zap size={15}/> {profile.credits}</span><span>Lv {levelAtXP(learnedXP)}</span><button aria-label="Open settings" onClick={()=>setTab('settings')}><Settings2 size={18}/></button></div></header>}
  {notice&&<div className="notice" role="status">{notice}<button aria-label="Dismiss" onClick={()=>setNotice('')}>×</button></div>}
  {storageMode!=='opfs'&&!guest&&<div className="storage-warning"><HardDrive size={17}/>{storageMode==='memory-fallback'?'File storage is unavailable. Changes are temporary; export is recommended.':'OPFS unavailable: using compatibility storage instead of files. Export a backup regularly.'}</div>}
  <main className={playing?'player-main':'main-container'}>
    {puzzle?<PuzzlePlayer key={puzzle.id} puzzle={puzzle} profile={profile} guest={guest} position={Math.max(position,1)} total={mainPuzzles.length} onUpdate={changeAnswer} onUndo={()=>restoreAnswer('undo')} onRedo={()=>restoreAnswer('redo')} onSolve={solve} onSkip={skip} onExit={exitPlayer} onNext={next} onHint={hint} onLab={labFromPuzzle}/>:<>
      {tab==='academy'&&<Academy profile={profile} guest={guest} selectedWeek={selectedWeek} onSelectWeek={setSelectedWeek} onPlay={startPuzzle}/>}
      {tab==='challenges'&&<Challenges profile={profile} guest={guest} onComplete={grantChallenge}/>}
      {tab==='laboratory'&&<Laboratory projects={currentProjects} guest={guest} activeId={activeProjectId} onActive={setActiveProjectId} onSave={saveProject} onDelete={deleteProject}/>}
      {tab==='atlas'&&<Atlas profile={profile} puzzles={puzzles} guest={guest}/>}
      {tab==='settings'&&<div className="screen-stack"><div className="section-title"><div><div className="eyebrow">PROFILE & PREFERENCES</div><h1>Settings</h1><p>Local-first by design. No account required.</p></div><div className="header-emblem"><Settings2/></div></div>
        <div className="chapter-detail"><h2>Learning Profile</h2><div className="setting-row"><span>Global experience</span><strong>{learnedXP} XP · Level {levelAtXP(learnedXP)}</strong></div><div className="setting-row"><span>Stored projects</span><strong>{currentProjects.length}</strong></div><div className="setting-row"><span>Storage mode</span><strong>{guest?'Temporary guest':storageMode==='opfs'?'OPFS local files':storageMode==='localstorage-fallback'?'Browser compatibility storage':'Volatile fallback'}</strong></div><div className="setting-row"><span>Foundations domain XP</span><strong>{xpForDomain(profile,puzzles,'Foundations')}</strong></div></div>
        <div className="chapter-detail"><h2>Accessibility</h2><label className="toggle-row"><span><strong>Reduced motion</strong><small>Disable decorative motion and animated transitions.</small></span><input type="checkbox" checked={profile.settings.reducedMotion} onChange={e=>setProfile(prev=>prev?{...prev,settings:{...prev.settings,reducedMotion:e.target.checked}}:prev)}/></label><p className="small-muted">All core puzzle mechanics support tap/click alternatives to dragging. No compulsory timers.</p></div>
        {!guest&&<div className="chapter-detail"><h2>Backup & portability</h2><p>Export the complete learning profile, including your projects, for a manual backup. No cloud service is used.</p><button className="secondary-button full" onClick={()=>exportProfile(profile,projects)}><Download size={16}/> Export profile (.mlprofile)</button><button className="secondary-button full" onClick={()=>backupInput.current?.click()}><Upload size={16}/> Import profile backup</button><input ref={backupInput} type="file" accept=".mlprofile,application/json" hidden onChange={e=>{const f=e.target.files?.[0];if(f)void importBackup(f);e.target.value='';}}/>{importMessage&&<p role="status" className="small-muted">{importMessage}</p>}</div>}
        <div className="chapter-detail"><h2>Open Demo</h2><p>Guest Mode opens all available chapter previews and currently authored puzzle simulations. Guest XP and projects are temporary and never modify the main profile.</p>{!guest?<button className="action-button full" onClick={activateGuest}><Users size={16}/> Start Guest Open Demo</button>:<button className="action-button full" onClick={exitGuest}><LogOut size={16}/> Exit Guest Mode</button>}</div>
        <div className="chapter-detail"><h2>Development status</h2><p>Week 1: 16 main puzzles and one optional advanced puzzle are interactive. Weeks 2–15 have independent typed content packs and Chapter Preview, but their playable puzzles are not implemented yet.</p><div className="setting-row"><span>Online sync</span><strong>Future release</strong></div><div className="setting-row"><span>Community Gallery</span><strong>Future release</strong></div><button className="text-button" onClick={()=>{if(confirm('Reset the current workspace only? Earned XP and solved puzzles remain.'))setProfile(prev=>prev?{...prev,activePuzzle:null,workspaces:{}}:prev)}}><RotateCcw size={15}/> Clear temporary puzzle workspaces</button></div>
      </div>}
    </>}
  </main>
  {!playing&&<nav className="bottom-nav" aria-label="Main navigation">{TABS.map(t=><button key={t.id} aria-current={tab===t.id?'page':undefined} className={tab===t.id?'active':''} onClick={()=>setTab(t.id)}><t.icon size={21}/><span>{tI18n(profile.settings.locale,t.titleKey)}</span></button>)}</nav>}
  </div>
 </div>;
}
