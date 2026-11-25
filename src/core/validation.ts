import type { Puzzle, PuzzleAnswer } from './types';
/** The generic part of puzzle validation: pure, extensible, feedback-oriented, no hidden answer injection. */
export type ValidationResult={valid:boolean;complete:boolean;reason:string;score:number};
const result=(valid:boolean,complete=true,reason=valid?'Valid solution':'Try another approach'):ValidationResult=>({valid,complete,reason,score:valid?1:0});
const sameSet=(a:readonly string[],b:readonly string[])=>a.length===b.length&&new Set(a).size===a.length&&a.every(x=>b.includes(x));
function edges(edges:readonly [string,string][]):string[] {return edges.map(([a,b])=>`${a.length}:${a}|${b.length}:${b}`);}
export function evaluateGeneric(p:Puzzle,a:PuzzleAnswer):ValidationResult {
  switch(p.kind){
    case 'sort':case 'dataset-label':{
      if(!p.items?.length||!p.correctAssignments)return result(false,false,'Missing classification data');
      const valid=p.items.every(item=>a.assignments?.[item.id]===p.correctAssignments?.[item.id]);
      const complete=p.items.every(item=>a.assignments?.[item.id]!==undefined);
      return result(valid,complete,complete?'Check the assigned categories':'Assign every item');
    }
    case 'choice':return result(!!a.selected&&a.selected===p.correctChoice,!!a.selected,!!a.selected?'Check the evidence':'Choose an answer');
    case 'order':{
      const order=a.order??p.steps?.map(s=>s.id)??[];
      if(!p.correctOrder?.length)return result(false,false,'Missing sequence');
      return result(order.join('\0')===p.correctOrder.join('\0'),order.length===p.correctOrder.length,'Check the operation order');
    }
    case 'numeric':{
      const spec=p.numeric;
      if(!spec||!Number.isFinite(spec.expected)||!Number.isFinite(spec.tolerance)||spec.tolerance<0)throw new Error(`Invalid numeric spec ${p.id}`);
      const v=a.numberValue;
      if(v===undefined||!Number.isFinite(v))return result(false,false,'Enter a finite number');
      if(spec.min!==undefined&&v<spec.min||spec.max!==undefined&&v>spec.max)return result(false,true,'Value outside permitted range');
      return result(Math.abs(v-spec.expected)<=spec.tolerance,true,'Recheck your calculation and units');
    }
    case 'multi':{
      if(!p.correctChoices?.length)throw new Error(`Missing multi-answer key ${p.id}`);
      const picks=a.selectedMany??[];return result(sameSet(picks,p.correctChoices),picks.length>0,'Check every selected option');
    }
    case 'connect':case 'drag-connect':{
      if(!p.correctConnections?.length)throw new Error(`Missing connection key ${p.id}`);
      const actual=a.connections??[];return result(sameSet(edges(actual),edges(p.correctConnections)),actual.length>0,'Check your connected nodes');
    }
    case 'parameters':{
      const spec=p.parameterGoal;if(!spec)throw new Error(`Missing parameters spec ${p.id}`);
      const v=a.parameters?.[spec.key];
      return result(v!==undefined&&Number.isFinite(v)&&v>=spec.min&&v<=spec.max&&Math.abs(v-spec.target)<=spec.tolerance,v!==undefined,'Try changing the selected parameter');
    }
    case 'trace':{
      const expected=p.correctTrace;if(!expected?.length)throw new Error(`Missing trace key ${p.id}`);
      const actual=a.trace??[];return result(actual.join('\0')===expected.join('\0'),actual.length>0,'Review the execution trace');
    }
    case 'train':case 'predict':case 'repair':return result(false,false,'Needs contextual training data');
    case 'slider':{
      // slider is a specialised numeric kind
      const spec=p.numeric;
      if(!spec||!Number.isFinite(spec.expected)||!Number.isFinite(spec.tolerance)||spec.tolerance<0) return result(false,false,'Missing slider spec');
      const v=a.numberValue;
      if(v===undefined||!Number.isFinite(v))return result(false,false,'Move the slider');
      return result(Math.abs(v-spec.expected)<=spec.tolerance,true,'Try a different slider value');
    }
  }
}
/** Fail fast on bad authoring. Never mark a placeholder as playable. */
export function validatePuzzleSpec(p:Puzzle):void {
  if(!p.id||!p.title?.trim()||!p.instruction?.trim()||!p.hint?.trim()||!p.concept?.trim())throw new Error(`Missing required content: ${p.id}`);
  switch(p.kind){
    case 'choice':case 'predict':case 'repair':if(!p.options?.length&&p.kind!=='predict'||p.kind==='choice'&&!p.options?.some(o=>o.id===p.correctChoice))throw new Error(`Invalid options: ${p.id}`);break;
    case 'sort':case 'dataset-label':if(!p.items?.length||!p.buckets?.length||p.items.some(i=>!p.correctAssignments?.[i.id]||!p.buckets?.some(b=>b.id===p.correctAssignments?.[i.id])))throw new Error(`Invalid sort: ${p.id}`);break;
    case 'order':if(!p.steps?.length||!p.correctOrder||!sameSet(p.steps.map(s=>s.id),p.correctOrder))throw new Error(`Invalid order: ${p.id}`);break;
    case 'numeric':if(!p.numeric||!Number.isFinite(p.numeric.expected)||!Number.isFinite(p.numeric.tolerance)||p.numeric.tolerance<0)throw new Error(`Invalid numeric target: ${p.id}`);break;
    case 'multi':if(!p.correctChoices?.length||!p.options?.length||!p.correctChoices.every(x=>p.options?.some(o=>o.id===x)))throw new Error(`Invalid multiple selection: ${p.id}`);break;
    case 'connect':case 'drag-connect':if(!p.correctConnections?.length)throw new Error(`Invalid graph target: ${p.id}`);break;
    case 'parameters':if(!p.parameterGoal||p.parameterGoal.min>p.parameterGoal.max||p.parameterGoal.tolerance<0||p.parameterGoal.target<p.parameterGoal.min||p.parameterGoal.target>p.parameterGoal.max)throw new Error(`Invalid parameter target: ${p.id}`);break;
    case 'trace':if(!p.correctTrace?.length)throw new Error(`Invalid trace target: ${p.id}`);break;
    case 'train':break;
    case 'slider':if(!p.numeric||(!Number.isFinite(p.numeric.expected)||!Number.isFinite(p.numeric.tolerance)||p.numeric.tolerance<0))throw new Error(`Invalid slider spec: ${p.id}`);break;
  }
}
