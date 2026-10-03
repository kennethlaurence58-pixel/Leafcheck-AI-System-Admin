import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

export type Plant = { id:string; name:string; species:string; space:string; health:number; water:string; ph:string; moisture:string; temp:string };
type AppData = {
  plants: Plant[]; archivedPlants: Plant[]; archivedSpaces:string[]; notifications:{id:string;text:string;read:boolean;archived:boolean}[];
  addPlant:(space:string,name:string)=>void; archivePlant:(id:string)=>void; archiveSpace:(name:string)=>void;
  markAllRead:()=>void; clearAllNotifications:()=>void; archiveNotification:(id:string)=>void;
};
const Ctx=createContext<AppData|null>(null);
const initial:Plant[]=[];
export function AppDataProvider({children}:PropsWithChildren){
 const [plants,setPlants]=useState(initial); const [archivedPlants,setArchivedPlants]=useState<Plant[]>([]); const [archivedSpaces,setArchivedSpaces]=useState<string[]>([]);
 const [notifications,setNotifications]=useState<{id:string;text:string;read:boolean;archived:boolean}[]>([]);
 const value=useMemo(()=>({plants,archivedPlants,archivedSpaces,notifications,
  addPlant:(space:string,name:string)=>setPlants(p=>[...p,{id:Date.now().toString(),name,species:'Not analyzed',space,health:0,water:'0',ph:'0',moisture:'0',temp:'0'}]),
  archivePlant:(id:string)=>setPlants(p=>{const x=p.find(v=>v.id===id); if(x)setArchivedPlants(a=>[...a,x]); return p.filter(v=>v.id!==id)}),
  archiveSpace:(name:string)=>setArchivedSpaces(s=>s.includes(name)?s:[...s,name]), markAllRead:()=>setNotifications(n=>n.map(x=>({...x,read:true}))), clearAllNotifications:()=>setNotifications([]), archiveNotification:(id:string)=>setNotifications(n=>n.map(x=>x.id===id?{...x,archived:true}:x))
 }),[plants,archivedPlants,archivedSpaces,notifications]);
 return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
export function useAppData(){const v=useContext(Ctx); if(!v) throw new Error('useAppData outside provider'); return v}
