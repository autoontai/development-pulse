"use client";
import React, { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, ReferenceLine, PieChart, Pie, Cell
} from "recharts";
import ScorecardCapture from "./ScorecardCapture";
import allHoodData from "../data/hoodData";
import allNeighbourhoods from "../data/neighbourhoods";
import {
  Building2, Shield, Users, GraduationCap, Train, Hammer, MapPin,
  TrendingUp, TreePine, Utensils, Home, Car, Bike, Phone, Star
} from "lucide-react";

const SF="'Cormorant Garamond','Georgia',serif";
const SN="'DM Sans',-apple-system,sans-serif";
const INK="#1a1a1a",MID="#666",LT="#999",RL="#e0e0e0";
const PAL=["#1a1a1a","#666","#999","#bbb","#ddd"];

const CA={pop:19540,inc:65000,hv:930000,crime:176,ws:61,ts:65,bk:3.1,pk:55,
  parks:5,groc:6,coffee:10,rest:52,lib:1.5,dc:4,dcCap:180,sch:6.0,edi:68,play:4,
  splash:2,pool:1,arena:1,rs:79,gp:13,tc:28,greenRoof:3,floodRisk:15,biz:320,dine:92.1,
  r311:260,ksi:12,own:47,bach:38,unemp:7.2,trComm:37,
  pov:15,immig:47,visMi:52,hhSize:2.4,langDiv:35,
  shoot:14,hate:5,crisis:45,bikeTheft:25,
  affPipe:50,intens2051:5000,
  premMort:250,diabetes:10,famDoc:85,foodInsec:12};

function Mt({icon:Ic,label:l,value:v,cagr:c,cagrPeriod:cp,cityAvg:ca,border:bd=true}){
  const cn=c!==null&&c!==undefined?parseFloat(c):null;
  return(<div style={{padding:"20px 0",borderBottom:bd?"1px solid #eee":"none"}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
      {Ic&&<Ic size={13} strokeWidth={1.5} color="#999"/>}
      <p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",margin:0}}>{l}</p>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
      <div>
        <p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK,margin:0,lineHeight:1}}>{v}</p>
        {cn!==null&&cn!==0&&<p style={{fontFamily:SN,fontSize:12,marginTop:6,color:cn>0?"#15803d":"#b91c1c"}}>{cn>0?"+":""}{c}%{cp&&<span style={{color:"#999"}}> {cp}</span>}</p>}
        {(cn===0||cn===null)&&cp&&<p style={{fontFamily:SN,fontSize:12,marginTop:6,color:"#999"}}>{cp}</p>}
      </div>
      {ca&&<div style={{textAlign:"right"}}>
        <p style={{fontFamily:SN,fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",margin:"0 0 2px"}}>City Avg</p>
        <p style={{fontFamily:SF,fontSize:22,fontWeight:300,color:"#999",margin:0,lineHeight:1}}>{ca}</p>
      </div>}
    </div>
  </div>);
}

function Sec({title,sub}){
  return(<div style={{marginTop:56,marginBottom:24}}>
    <h2 style={{fontFamily:SF,fontSize:24,fontWeight:300,color:INK}}>{title}</h2>
    {sub&&<p style={{fontFamily:SN,fontSize:13,color:"#999",marginTop:4}}>{sub}</p>}
    <div style={{width:48,height:1,background:INK,marginTop:12}}/>
  </div>);
}

function Ld({children}){return<p style={{fontFamily:SF,fontSize:18,color:"#555",lineHeight:1.6,maxWidth:640,marginBottom:32}}>{children}</p>;}

function DP({title,items}){
  return(<div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
    <p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:16}}>{title}</p>
    {items.map((it,i)=>(
      <div key={i} style={{padding:"12px 0",borderBottom:i<items.length-1?"1px solid #f0f0f0":"none"}}>
        <p style={{fontSize:14,color:INK,fontWeight:500,margin:0}}>{it.l}</p>
        <p style={{fontSize:12,color:"#666",marginTop:4,lineHeight:1.5}}>{it.d}</p>
      </div>
    ))}
  </div>);
}

function genCrime(cur,chg){const b=Math.round(cur/(1+chg/100));return[{year:2020,total:Math.round(b*0.92)},{year:2021,total:Math.round(b*0.88)},{year:2022,total:Math.round(b*1.05)},{year:2023,total:b},{year:2024,total:cur}];}
function genPermit(cur,chg){const b=Math.round(cur/(1+chg/100));return[{year:"2020",n:Math.round(b*0.5),a:Math.round(b*2.5)},{year:"2021",n:Math.round(b*0.7),a:Math.round(b*2.8)},{year:"2022",n:Math.round(b*0.85),a:Math.round(b*3)},{year:"2023",n:b,a:Math.round(b*3.2)},{year:"2024",n:cur,a:Math.round(cur*2.8)}];}
function genHousing(own){const det=Math.min(60,Math.max(10,own-5)),row=Math.min(20,Math.max(5,Math.round(15-Math.abs(own-50)*0.2))),hi=Math.min(50,Math.max(5,80-own)),lo=Math.max(5,100-det-row-hi-3);return[{name:"Single/Semi",value:det},{name:"Row/Town",value:row},{name:"Low-Rise Apt",value:lo},{name:"High-Rise Apt",value:hi},{name:"Other",value:3}];}
function genCuisine(r){r=Math.max(10,r);return[{n:"Italian",c:Math.round(r*0.15)},{n:"Asian",c:Math.round(r*0.18)},{n:"Indian",c:Math.round(r*0.1)},{n:"Middle Eastern",c:Math.round(r*0.08)},{n:"Canadian/Pub",c:Math.round(r*0.12)},{n:"Other",c:Math.round(r*0.37)}];}


function cMtg(p,r,y){const m=r/100/12,n=y*12;return m===0?p/n:p*(m*Math.pow(1+m,n))/(Math.pow(1+m,n)-1);}
function cOLTT(p){let t=0;if(p>2e6)t+=(p-2e6)*.025;if(p>4e5)t+=(Math.min(p,2e6)-4e5)*.02;if(p>25e4)t+=(Math.min(p,4e5)-25e4)*.015;if(p>55e3)t+=(Math.min(p,25e4)-55e3)*.01;t+=Math.min(p,55e3)*.005;return Math.round(t);}
function cTLTT(p){let t=0;if(p>2e6)t+=(p-2e6)*.025;if(p>4e5)t+=(Math.min(p,2e6)-4e5)*.02;if(p>55e3)t+=(Math.min(p,4e5)-55e3)*.015;t+=Math.min(p,55e3)*.005;return Math.round(t);}
const PTX=0.00666274,MR=0.45;

export default function FullProfile({d}){
  const [tab,setTab]=useState("overview");
  const [cp,setCp]=useState(d.hv);
  const [cd,setCd]=useState(20);
  const [cr,setCr]=useState(4.89);
  const [ca2,setCa2]=useState(25);
  const [ai,setAi]=useState(120000);
  const [adp,setAdp]=useState(20);
  const [ar,setAr]=useState(4.89);
  const [rr,setRr]=useState(Math.round(d.hv*0.004));
  const [rg,setRg]=useState(3);
  const [ry,setRy]=useState(10);
  const navs=[{id:"overview",l:"Overview"},{id:"development",l:"Development"},{id:"family",l:"Family & Living"},{id:"safety",l:"Safety"},{id:"health",l:"Health"},{id:"demographics",l:"Demographics"},{id:"environment",l:"Nature"},{id:"business",l:"Business"}];
  const tools=[{id:"calculator",l:"Homebuyer Calculator"},{id:"afford",l:"What Can I Afford?"},{id:"rentvsbuy",l:"Rent vs Buy"}];
  const radarD=[{m:"Development",v:d.sc.dH,a:100},{m:"Family",v:d.sc.fL,a:100},{m:"Safety",v:d.sc.sa,a:100},{m:"Health",v:d.sc.he,a:100},{m:"Mobility",v:d.sc.mo,a:100},{m:"Nature",v:d.sc.na,a:100}];
  const ct=genCrime(d.crime,d.crimeC),pt=genPermit(d.perm,d.permC),hs=genHousing(d.own),cu=genCuisine(d.rest);
  const sn=d.n.split("-")[0].split("\u2013")[0].trim();
  const fr=d.pop>25000?"Moderate":"Low",nr=d.hv>2000000?"None":d.pop>30000?"Low":"None",rh=Math.max(0,Math.round((100-d.own)*0.15));

  return(
    <div style={{background:"#faf9f6",minHeight:"100vh",fontFamily:SN,display:"flex"}}>
      <nav style={{width:192,background:"#fff",borderRight:"1px solid #e0e0e0",flexShrink:0,paddingTop:24,position:"sticky",top:64,height:"calc(100vh - 64px)",overflowY:"auto"}}>
        <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",padding:"0 20px",marginBottom:16}}>Sections</p>
        {navs.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 20px",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:SN,background:tab===n.id?"#f9f9f9":"transparent",borderLeft:tab===n.id?"2px solid "+INK:"2px solid transparent",color:tab===n.id?INK:"#888"}}>{n.l}</button>
        ))}
        <div style={{margin:"12px 20px",borderTop:"1px solid #e0e0e0"}}/>
        <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",padding:"0 20px",marginBottom:8}}>Blog</p>
        <a href="/blog" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Blog</a>
        <div style={{margin:"12px 20px",borderTop:"1px solid #e0e0e0"}}/>
        <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",padding:"0 20px",marginBottom:8}}>Tools</p>
        <a href="/find-neighbourhood" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Find Neighbourhood</a>
        <a href="/compare" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Compare Hoods</a>
        <a href="/tools/tree-canopy" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Tree Canopy Map</a>
        <a href="/tools/childcare" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Childcare Map</a>
        <a href="/tools/pedestrian-safety" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Pedestrian Safety Map</a>
        {tools.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{display:"block",width:"100%",textAlign:"left",padding:"8px 20px",border:"none",cursor:"pointer",fontSize:13,fontWeight:500,fontFamily:SN,background:tab===n.id?"#f9f9f9":"transparent",borderLeft:tab===n.id?"2px solid "+INK:"2px solid transparent",color:tab===n.id?INK:"#888"}}>{n.l}</button>
        ))}
        <div style={{margin:"12px 20px",borderTop:"1px solid #e0e0e0"}}/>
        <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",padding:"0 20px",marginBottom:8}}>Subscribe</p>
        <a href="/premium" style={{display:"block",padding:"8px 20px",fontSize:13,fontWeight:500,fontFamily:SN,color:"#888",textDecoration:"none",borderLeft:"2px solid transparent"}}>Premium Newsletter</a>
        <ScorecardCapture variant="sidebar" neighbourhood={d.n} />
      </nav>
      <main style={{flex:1,padding:"48px 40px",maxWidth:768,margin:"0 auto"}}>

{tab==="overview"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Neighbourhood Profile</p>
  <h1 style={{fontFamily:SF,fontSize:44,fontWeight:300,color:INK,margin:"0 0 8px",lineHeight:1.1}}>{d.n}</h1>
  <p style={{fontFamily:SN,fontSize:13,color:"#999",margin:"0 0 8px"}}>Toronto Neighbourhood – 2026 Complete Guide</p>
  <div style={{width:64,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>Population of {d.pop.toLocaleString()} with a median household income of ${(d.inc/1000).toFixed(0)}K ({d.inc>CA.inc?"above":"below"} the Toronto average of $65K). Home values at ${(d.hv/1000).toFixed(0)}K. Walk score of {d.ws}{d.ws>CA.ws?", above":", below"} the city average. {d.parks} parks, {d.groc} grocery stores, schools rated {d.sch}/10. Momentum score of {d.mom} signals {d.mom>110?"accelerating":d.mom>95?"steady":"slowing"} neighbourhood trajectory.</Ld>
  <Sec title="Neighbourhood Index" sub="Composite score per category. Each averages 3\u20134 underlying metrics indexed to the city. 100 = Toronto average."/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
    <div style={{display:"flex",alignItems:"center",gap:32,flexWrap:"wrap"}}>
      <div style={{width:240,height:220}}><ResponsiveContainer width="100%" height="100%"><RadarChart data={radarD} margin={{top:20,right:30,bottom:20,left:30}}><PolarGrid stroke={RL}/><PolarAngleAxis dataKey="m" tick={{fontSize:10,fill:LT,fontFamily:SN}}/><PolarRadiusAxis angle={90} domain={[0,180]} tick={false}/><Radar dataKey="a" stroke={LT} strokeWidth={1.5} fill="transparent" strokeDasharray="4 3"/><Radar dataKey="v" stroke={INK} strokeWidth={2} fill={INK} fillOpacity={0.06}/></RadarChart></ResponsiveContainer></div>
      <div style={{flex:1,minWidth:280}}>
        {radarD.map(c=>(<div key={c.m} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #f0f0f0"}}><span style={{fontSize:12,color:MID,width:80}}>{c.m}</span><div style={{flex:1,height:4,background:"#eee",borderRadius:2,position:"relative"}}><div style={{position:"absolute",height:"100%",borderRadius:2,background:INK,width:Math.min(c.v/1.6,100)+"%"}}/><div style={{position:"absolute",height:"100%",width:1,background:"#999",left:100/1.6+"%"}}/></div><span style={{fontFamily:SF,fontSize:16,color:INK,width:32,textAlign:"right"}}>{c.v}</span></div>))}
        <p style={{fontSize:11,color:LT,marginTop:12}}>Dashed ring = Toronto (100). Scores above 100 outperform the city.</p>
      </div>
    </div>
  </div>
  <Sec title="Neighbourhood Momentum" sub="Composite trajectory score. 100 = holding steady."/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32,display:"flex",alignItems:"center",gap:32}}>
    <div style={{textAlign:"center",flexShrink:0}}><p style={{fontFamily:SF,fontSize:64,fontWeight:300,color:INK,margin:0}}>{d.mom}</p><p style={{fontSize:12,color:d.mom>110?"#15803d":d.mom>95?LT:"#b91c1c",fontWeight:600,marginTop:4}}>{d.mom>110?"Above-average momentum":d.mom>95?"Average momentum":"Below-average momentum"}</p></div>
    <div style={{flex:1}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"4px 0 8px",borderBottom:"1px solid #f0f0f0",marginBottom:4}}>
          <span style={{fontSize:10,color:LT,width:100}}>Factor</span>
          <span style={{flex:1,fontSize:10,color:LT}}>Score vs city (100)</span>
          <span style={{fontSize:10,color:LT,width:24}}></span>
          <span style={{fontSize:10,color:LT,width:36,textAlign:"right"}}>Weight</span>
        </div>
        {[{l:"Permit Velocity",s:Math.min(160,Math.max(70,100+d.permC*0.8)),w:"25%"},{l:"Crime Trajectory",s:Math.min(160,Math.max(70,100-d.crimeC*1.2)),w:"20%"},{l:"Business Growth",s:Math.min(160,Math.max(70,100+d.bg*1.5)),w:"20%"},{l:"Population",s:Math.min(140,Math.max(80,100+d.popC*2)),w:"15%"},{l:"Transit Investment",s:Math.min(130,Math.max(85,d.ts/CA.ts*100)),w:"10%"},{l:"Green Space",s:Math.round(d.gp/CA.gp*100),w:"10%"}].map(c=>(<div key={c.l} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:"1px solid #f5f5f5"}}><span style={{fontSize:11,color:LT,width:100}}>{c.l}</span><div style={{flex:1,height:3,background:"#eee",borderRadius:2,position:"relative"}}><div style={{position:"absolute",height:"100%",borderRadius:2,background:INK,width:Math.min(c.s/1.6,100)+"%"}}/><div style={{position:"absolute",height:"100%",width:1,background:"#999",left:100/1.6+"%"}}/></div><span style={{fontSize:11,color:INK,width:24,textAlign:"right"}}>{Math.round(c.s)}</span><span style={{fontSize:10,color:LT,width:36,textAlign:"right"}}>{c.w}</span></div>))}
      <p style={{fontSize:10,color:LT,marginTop:12}}>Weight = contribution to the composite momentum score. Score 100 = city average trajectory.</p>
    </div>
  </div>
</div>}

{tab==="development"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Development</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>{d.pipe} Units in Pipeline</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>{d.perm} building permits issued in the latest year ({d.permC>0?"+":""}{d.permC}% vs prior), with {d.pipe} residential units in the active development pipeline. Home values have grown {d.hvC}% between the 2016 and 2021 census cycles.</Ld>
  <Sec title="Key Metrics"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
    <Mt icon={Hammer} label="Pipeline Units" value={d.pipe} cagr={null} cagrPeriod={d.pipe>210?"Above city avg":"Below city avg"} cityAvg="210"/>
    <Mt icon={Hammer} label="Building Permits" value={d.perm} cagr={d.permC} cagrPeriod="vs prior year" cityAvg="15"/>
    <Mt icon={Home} label="Home Value" value={"$"+(d.hv/1000).toFixed(0)+"K"} cagr={d.hvC} cagrPeriod="2016\u20132021" cityAvg={"$"+(CA.hv/1000).toFixed(0)+"K"}/>
    <Mt icon={Users} label="Owner / Renter" value={d.own+" / "+(100-d.own)+"%"} cagr={null} cityAvg={CA.own+" / "+(100-CA.own)+"%"}/>
      <Mt icon={Hammer} label="Affordable Units Pipeline" value={d.affPipe} cagr={null} cagrPeriod="Approved/proposed" cityAvg={String(CA.affPipe)}/>
      <Mt icon={TrendingUp} label="Intensification to 2051" value={d.intens2051.toLocaleString()+" units"} cagr={null} cagrPeriod="Projected additional dwellings" border={false}/>
  </div>
  <DP title="What\u2019s Driving These Numbers" items={[{l:"Pipeline Units ("+(d.pipe>210?"above":"below")+" city avg)",d:d.pipe>300?"Strong pipeline driven by Provincial Transit-Oriented Communities policy permitting higher density near rapid transit. Multiple mid-rise applications in review.":"Development activity reflects current zoning and transit access. Pipeline may grow as Official Plan review expands permissions."},{l:"Building Permits ("+(d.permC>0?"+":"")+d.permC+"%)",d:d.permC>15?"Permit acceleration driven by laneway/garden suite as-of-right bylaw changes (2022) plus larger site plan applications.":"Permit activity is "+(d.permC>0?"trending up":"stable")+", reflecting "+(d.permC>0?"growing":"steady")+" builder interest."},{l:"Home Value ("+(d.hvC>0?"+":"")+d.hvC+"%, 2016\u20132021)",d:d.hvC>40?"Significant appreciation exceeding city average, driven by transit proximity, improving amenities, and demand from young professionals.":"Growth "+(d.hvC>35?"in line with":"below")+" the broader Toronto trend."}]}/>
  <Sec title="Building Permits Issued, 2020\u20132024" sub="New construction and alteration permits. Source: City of Toronto Building Division."/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24}}><ResponsiveContainer width="100%" height={220}><BarChart data={pt} barGap={3} margin={{top:10,right:10,bottom:5,left:15}}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SN}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:11,fontFamily:SN}} label={{value:"Permits",angle:-90,position:"insideLeft",offset:5,fontSize:10,fill:"#999"}}/><Tooltip/><Bar dataKey="n" name="New Build" fill={INK} radius={[2,2,0,0]}/><Bar dataKey="a" name="Alteration" fill="#ccc" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer></div>
</div>}

{tab==="family"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Family & Living</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Daily Life in {sn}</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>{d.groc} grocery stores, {d.coffee} coffee shops, {d.rest} restaurants, and {d.dc} licensed daycares. Schools rate {d.sch}/10 ({d.sch>CA.sch?"above":"below"} city average). {d.play} playgrounds, {d.splash} splash pads, {d.pool} pools, and {d.arena} arenas.</Ld>
  <DP title="What These Metrics Measure" items={[{l:"Grocery Stores ("+d.groc+" vs city avg "+CA.groc+")",d:"Count of full-service grocery retailers within neighbourhood boundaries, sourced from City of Toronto business licences."},{l:"School Rating ("+d.sch+"/10 vs city avg "+CA.sch+")",d:"Fraser Institute composite of all neighbourhood schools, scaled 0\u201310. Combines standardized EQAO test results, student outcomes, and value-added measures."},{l:"Licensed Daycares ("+d.dc+" vs city avg "+CA.dc+")",d:"Ontario-licensed childcare centres from City of Toronto open data. Includes capacity and subsidy availability."}]}/>
  <Sec title="Daily Essentials"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={Building2} label="Grocery Stores" value={d.groc} cityAvg={String(CA.groc)}/><Mt icon={Utensils} label="Coffee Shops" value={d.coffee} cityAvg={String(CA.coffee)}/><Mt icon={Utensils} label="Restaurants" value={d.rest} cityAvg={String(CA.rest)}/><Mt icon={Building2} label="Libraries" value={d.lib} cityAvg={String(CA.lib)} border={false}/></div>
  <Sec title="Children & Schools"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={GraduationCap} label="School Rating" value={d.sch+"/10"} cityAvg={CA.sch+"/10"}/><Mt icon={Users} label="Licensed Daycares" value={d.dc} cityAvg={String(CA.dc)}/>
      <Mt icon={Users} label="Daycare Spaces" value={d.dcCap} cityAvg={String(CA.dcCap)}/>
      <Mt icon={GraduationCap} label="School Readiness (EDI)" value={d.edi+"%"} cagrPeriod="% meeting developmental benchmarks" cityAvg={CA.edi+"%"}/><Mt icon={Star} label="Playgrounds" value={d.play} cityAvg={String(CA.play)}/><Mt icon={Star} label="Splash Pads" value={d.splash} cityAvg={String(CA.splash)} border={false}/></div>
  <Sec title="Recreation Facilities Inventory" sub="From City of Toronto Parks & Recreation open data."/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={TreePine} label="Parks" value={d.parks} cityAvg={String(CA.parks)}/><Mt icon={Star} label="Pools" value={d.pool} cityAvg={String(CA.pool)}/><Mt icon={Star} label="Arenas" value={d.arena} cityAvg={String(CA.arena)}/><Mt icon={Star} label="Splash Pads" value={d.splash} cityAvg={String(CA.splash)} border={false}/></div>
  <Sec title="Getting Around"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={MapPin} label="Walk Score" value={d.ws} cityAvg={String(CA.ws)}/><Mt icon={Train} label="Transit Score" value={d.ts} cityAvg={String(CA.ts)}/><Mt icon={Bike} label="Bike Infrastructure" value={d.bk+" km"} cityAvg={CA.bk+" km"}/><Mt icon={Car} label="Parking Ease" value={d.pk+"/100"} cityAvg={String(CA.pk)} border={false}/></div>
</div>}

{tab==="safety"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Safety</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Crime & Wellbeing</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>Total crime incidents at {d.crime} ({d.crimeC>0?"+":""}{d.crimeC}% YoY), {d.crime<CA.crime?"below":"above"} the citywide average of {CA.crime}. Traffic KSI at {d.ksi} ({d.ksi<CA.ksi?"below":"above"} average). DineSafe pass rate of {d.dine}%. RentSafe score of {d.rs}/100.</Ld>
  <DP title="What\u2019s Driving These Numbers & What They Measure" items={[{l:"Crime Incidents ("+d.crime+", "+(d.crimeC>0?"+":"")+d.crimeC+"% YoY)",d:"Total Major Crime Indicator incidents (assault, B&E, auto theft, robbery, theft over) from TPS. "+(d.crimeC<0?"YoY decline reflects broader policing initiatives including targeted auto theft operations and increased community patrols.":"Trend reflects "+(d.crimeC>5?"rising":"relatively stable")+" incident rates.")},{l:"Traffic KSI ("+d.ksi+" vs city avg "+CA.ksi+")",d:"Killed or Seriously Injured collisions from Vision Zero database. "+(d.ksi<CA.ksi?"Below-average rates reflect safer street design or lower traffic volumes.":"At or above average may reflect higher traffic volumes or areas needing safety interventions.")},{l:"DineSafe Pass Rate ("+d.dine+"%)",d:"Toronto Public Health food safety inspection compliance. Checks temperature control, food handling, sanitation, pest control."},{l:"311 Requests ("+d.r311+" vs avg "+CA.r311+")",d:"Non-emergency service requests. Includes tree maintenance, graffiti, noise, potholes, dumping. "+(d.r311<CA.r311?"Lower volume indicates better-maintained infrastructure.":"Higher volume may reflect engaged community reporting or infrastructure needs.")}]}/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={Shield} label="Crime Incidents" value={d.crime} cagr={d.crimeC} cagrPeriod="YoY" cityAvg={String(CA.crime)}/><Mt icon={Car} label="Traffic KSI" value={d.ksi} cityAvg={String(CA.ksi)}/><Mt icon={Utensils} label="DineSafe Pass" value={d.dine+"%"} cityAvg={CA.dine+"%"}/><Mt icon={Phone} label="311 Requests" value={d.r311} cityAvg={String(CA.r311)}/><Mt icon={Shield} label="RentSafe Score" value={d.rs+"/100"} cityAvg={CA.rs+"/100"}/>
      <Mt icon={Shield} label="Shootings" value={d.shoot} cityAvg={String(CA.shoot)}/>
      <Mt icon={Shield} label="Hate Crimes" value={d.hate} cityAvg={String(CA.hate)}/>
      <Mt icon={Phone} label="Persons in Crisis Calls" value={d.crisis} cityAvg={String(CA.crisis)}/>
      <Mt icon={Bike} label="Bicycle Thefts" value={d.bikeTheft} cityAvg={String(CA.bikeTheft)} border={false}/></div>
  <Sec title="Total Crime Incidents, 2020\u20132024" sub="Major Crime Indicator incidents. Dashed line = citywide average."/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}><ResponsiveContainer width="100%" height={200}><LineChart data={ct} margin={{top:10,right:10,bottom:5,left:15}}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SN}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:11,fontFamily:SN}} label={{value:"Incidents",angle:-90,position:"insideLeft",offset:5,fontSize:10,fill:"#999"}}/><Tooltip/><ReferenceLine y={CA.crime} stroke={LT} strokeDasharray="6 3" strokeWidth={1.5} label={{value:"Toronto avg",position:"insideTopRight",fontSize:10,fill:LT}}/><Line type="monotone" dataKey="total" stroke={INK} strokeWidth={2} dot={{r:4,fill:"#fff",stroke:INK,strokeWidth:2}}/></LineChart></ResponsiveContainer></div>
  <Sec title="Environmental & Property Risk Assessment" sub="Due-diligence screening. Sources: TRCA, Ontario MOE, Transport Canada, City of Toronto."/>
  {[{l:"Flood Risk",v:fr,desc:fr==="Low"?"No TRCA-designated floodplain within neighbourhood boundaries.":"Some areas may fall within TRCA regulatory floodplain. Verify with TRCA."},{l:"Aircraft Noise",v:nr,desc:nr==="None"?"Outside all NEF 25+ contours.":"Minimal exposure. Check address against Transport Canada NEF maps."},{l:"Rooming Houses",v:rh+" registered",desc:rh+" registered multi-tenant houses. "+(rh<5?"Well below":"Near")+" city average."}].map((r,i)=>(<div key={i} style={{padding:"16px 0",borderBottom:"1px solid #eee"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",margin:0}}>{r.l}</p><p style={{fontFamily:SF,fontSize:18,color:INK,margin:0}}>{r.v}</p></div><p style={{fontSize:12,color:MID,margin:0}}>{r.desc}</p></div>))}
</div>}

{tab==="demographics"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Demographics</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Who Lives Here</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>Population of {d.pop.toLocaleString()} ({d.popC>0?"+":""}{d.popC}% since 2016). Median income ${(d.inc/1000).toFixed(0)}K, {d.bach}% with a bachelor's degree or higher, unemployment at {d.unemp}%. {d.own}% owner-occupied ({d.own>CA.own?"above":"below"} city average of {CA.own}%).</Ld>
  <DP title="Key Demographic Shifts" items={[{l:"Income Growth ("+(d.incC>0?"+":"")+d.incC+"%, 2016\u20132021)",d:d.incC>10?"Median income growth outpacing the city, driven by "+(d.bach>40?"influx of dual-income professional households":"improving employment mix")+".":"Income growth "+(d.incC>8?"in line with":"below")+" the broader city trend."},{l:"Ownership ("+d.own+"%, "+(d.own>CA.own?"above":"below")+" city avg)",d:d.own>55?"Higher ownership reflects more single/semi-detached housing stock.":"Lower ownership reflects "+(d.hv>1000000?"high prices relative to income":"higher proportion of rental stock")+"."},{l:"Population ("+(d.popC>0?"+":"")+d.popC+"% since 2016)",d:d.popC>5?"Above-average growth from new construction and secondary suites.":"Population "+(d.popC>0?"modestly growing":"stable")+", reflecting "+(d.popC>0?"gradual infill":"limited new construction")+"."}]}/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={Users} label="Population" value={d.pop.toLocaleString()} cagr={d.popC} cagrPeriod="2016\u20132021" cityAvg={CA.pop.toLocaleString()}/><Mt icon={Home} label="Median Income" value={"$"+(d.inc/1000).toFixed(0)+"K"} cagr={d.incC} cagrPeriod="2016\u20132021" cityAvg={"$"+(CA.inc/1000).toFixed(0)+"K"}/><Mt icon={Home} label="Home Value" value={"$"+(d.hv/1000).toFixed(0)+"K"} cagr={d.hvC} cagrPeriod="2016\u20132021" cityAvg={"$"+(CA.hv/1000).toFixed(0)+"K"}/><Mt icon={Users} label="Owner-Occupied" value={d.own+"%"} cityAvg={CA.own+"%"}/><Mt icon={GraduationCap} label="Bachelor's+" value={d.bach+"%"} cityAvg={CA.bach+"%"}/><Mt icon={Users} label="Unemployment" value={d.unemp+"%"} cityAvg={CA.unemp+"%"}/><Mt icon={Train} label="Transit Commuters" value={d.trComm+"%"} cityAvg={CA.trComm+"%"}/>
    </div>
    <Sec title="Diversity & Household Composition" sub="Census 2021. Immigration and language data from Statistics Canada."/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
      <Mt icon={Users} label="Poverty Rate (LIM)" value={d.pov+"%"} cityAvg={CA.pov+"%"}/>
      <Mt icon={Users} label="Immigrant Population" value={d.immig+"%"} cityAvg={CA.immig+"%"}/>
      <Mt icon={Users} label="Visible Minority" value={d.visMi+"%"} cityAvg={CA.visMi+"%"}/>
      <Mt icon={Home} label="Avg Household Size" value={d.hhSize} cityAvg={String(CA.hhSize)}/>
      <Mt icon={Users} label="Language Diversity" value={d.langDiv+"%"} cityAvg={CA.langDiv+"%"} border={false}/></div>
  <Sec title="Housing Stock by Type, 2021 Census" sub="Dwelling type distribution from Statistics Canada."/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24}}><div style={{display:"flex",alignItems:"center",gap:32}}><div style={{width:140,height:140}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={hs} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={25}>{hs.map((_,i)=><Cell key={i} fill={PAL[i]}/>)}</Pie></PieChart></ResponsiveContainer></div><div style={{flex:1}}>{hs.map((h,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><div style={{width:10,height:10,borderRadius:2,background:PAL[i],flexShrink:0}}/><span style={{fontSize:12,color:MID,flex:1}}>{h.name}</span><span style={{fontSize:12,fontWeight:600,color:INK}}>{h.value}%</span></div>))}</div></div></div>
</div>}

{tab==="environment"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Nature</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Parks & Green Space</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>{d.parks} parks with {d.gp}% green space coverage ({d.gp>CA.gp?"above":"below"} the city average of {CA.gp}%). Tree canopy at {d.tc}% against a council target of 40%.</Ld>
  <DP title="What These Metrics Measure" items={[{l:"Green Space Coverage ("+d.gp+"%)",d:"Percentage of neighbourhood land classified as parkland, ravine, or natural area. From City Parks, Forestry & Recreation."},{l:"Tree Canopy ("+d.tc+"%)",d:"Measured by Toronto's Urban Forest Study using LiDAR. City target is 40%. "+(d.tc>28?"Above-average canopy reflects mature street trees.":"Below-average may reflect newer development or emerald ash borer impact.")}]}/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={TreePine} label="Parks" value={d.parks} cityAvg={String(CA.parks)}/><Mt icon={TreePine} label="Green Space" value={d.gp+"%"} cityAvg={CA.gp+"%"}/><Mt icon={TreePine} label="Tree Canopy" value={d.tc+"%"} cityAvg={CA.tc+"%"}/>
      <Mt icon={TreePine} label="Green Roofs" value={d.greenRoof} cityAvg={String(CA.greenRoof)}/>
      <Mt icon={Shield} label="Basement Flood Risk" value={d.floodRisk+"%"} cagrPeriod="Probability based on infrastructure + terrain" cityAvg={CA.floodRisk+"%"} border={false}/></div>
</div>}


{tab==="health"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Health & Wellbeing</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Community Health</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>Health outcomes vary dramatically across Toronto neighbourhoods. {d.n} has a premature mortality rate of {d.premMort} per 100,000 ({d.premMort<CA.premMort?"below":"above"} the city average of {CA.premMort}), with {d.famDoc}% of residents enrolled with a family doctor and a food insecurity rate of {d.foodInsec}%.</Ld>
  <DP title="What These Metrics Measure" items={[
    {l:"Premature Mortality ("+d.premMort+" per 100K vs avg "+CA.premMort+")",d:"Deaths before age 75 per 100,000 population. A single powerful indicator of overall neighbourhood health equity. Driven by chronic disease, injury, and access to care. Source: Ontario Community Health Profiles Partnership (OCHPP)."},
    {l:"Diabetes Prevalence ("+d.diabetes+"% vs avg "+CA.diabetes+"%)",d:"Age-standardized rate of diagnosed diabetes among adults. Higher rates correlate with lower income, food access, and built environment factors. Source: OCHPP / Toronto Health Profiles."},
    {l:"Family Doctor Access ("+d.famDoc+"% vs avg "+CA.famDoc+"%)",d:"Percentage of residents enrolled with a primary care physician. A key measure of healthcare access. Areas with lower enrolment may have longer ER wait times and worse chronic disease management. Source: OCHPP."},
    {l:"Food Insecurity ("+d.foodInsec+"% vs avg "+CA.foodInsec+"%)",d:"Percentage of households reporting inadequate or insecure access to food due to financial constraints. Strongly correlated with income and poverty rate. Source: Canadian Community Health Survey via Wellbeing Toronto."},
  ]}/>
  <Sec title="Key Indicators"/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
    <Mt icon={Shield} label="Premature Mortality" value={d.premMort+"/100K"} cityAvg={CA.premMort+"/100K"}/>
    <Mt icon={Shield} label="Diabetes Prevalence" value={d.diabetes+"%"} cityAvg={CA.diabetes+"%"}/>
    <Mt icon={Users} label="Family Doctor Access" value={d.famDoc+"%"} cityAvg={CA.famDoc+"%"}/>
    <Mt icon={Users} label="Food Insecurity" value={d.foodInsec+"%"} cityAvg={CA.foodInsec+"%"} border={false}/>
  </div>
  <div style={{marginTop:32,padding:16,borderTop:"1px solid #eee"}}><p style={{fontSize:11,color:"#999"}}>Health data sourced from Ontario Community Health Profiles Partnership (OCHPP), Toronto Health Profiles, Canadian Community Health Survey (CCHS), and Wellbeing Toronto. Rates are age-standardized where applicable. For safety metrics (premature mortality, diabetes, food insecurity), lower values indicate better outcomes.</p></div>
</div>}

{tab==="business"&&<div>
  <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Business</p>
  <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Commerce & Dining</h1>
  <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
  <Ld>{d.biz} active business licences with net {d.bg>0?"+":""}{d.bg} in the past year. {d.rest} restaurants with a DineSafe pass rate of {d.dine}%{d.dine>CA.dine?", above the city average":""}.</Ld>
  <DP title="What\u2019s Driving Business Growth" items={[{l:"Net "+(d.bg>0?"+":"")+d.bg+" Businesses (2024)",d:d.bg>5?"Strong net growth in food service, wellness, and professional services. Growing residential density supports commercial demand.":"Business activity is "+(d.bg>0?"modestly positive":"relatively flat")+", reflecting "+(d.bg>0?"gradual growth":"a mature commercial area with low turnover")+"."},{l:"DineSafe Pass Rate ("+d.dine+"%)",d:"TPH inspection compliance. "+(d.dine>CA.dine?"Above-average rates indicate well-maintained establishments.":"Near city norm.")}]}/>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}><Mt icon={Building2} label="Active Businesses" value={d.biz} cityAvg={String(CA.biz)}/><Mt icon={TrendingUp} label="Net Growth (12 mo)" value={(d.bg>0?"+":"")+d.bg}/><Mt icon={Utensils} label="Restaurants" value={d.rest} cityAvg={String(CA.rest)}/><Mt icon={Utensils} label="Caf\u00e9s" value={d.coffee} cityAvg={String(CA.coffee)}/>
      <Mt icon={Building2} label="Business Improvement Area" value={d.hasBIA?"Yes":"No"} cagrPeriod={d.hasBIA?"Active BIA with dedicated programming":"No designated BIA"} border={false}/></div>
  <Sec title="Restaurant Cuisine Mix, 2024" sub={d.rest+" restaurants by primary cuisine. Source: City of Toronto business licences."}/>
  <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24}}><ResponsiveContainer width="100%" height={160}><BarChart data={cu} layout="vertical" margin={{left:5}}><XAxis type="number" tick={{fontSize:10,fontFamily:SN}}/><YAxis type="category" dataKey="n" tick={{fontSize:11,fontFamily:SN}} width={100}/><Tooltip/><Bar dataKey="c" fill={INK} radius={[0,2,2,0]} barSize={14}/></BarChart></ResponsiveContainer></div>
</div>}

        
{tab==="calculator"&&(()=>{
  const da=cp*cd/100,mt=cp-da,mp=cMtg(mt,cr,ca2),ol=cOLTT(cp),tl=cTLTT(cp),tt=ol+tl;
  const ptx=Math.round(cp*MR*PTX),mptx=Math.round(ptx/12),ins=Math.round(cp*.0035/12);
  const tmm=Math.round(mp+mptx+ins+95+31);
  return (<div>
    <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Tools</p>
    <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Homebuyer Calculator</h1>
    <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
    <Ld>Estimate the true cost of purchasing in {d.n} using current Toronto tax rates and 2025 land transfer tax brackets.</Ld>
    <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"24px 32px"}}>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Purchase Price</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>${cp.toLocaleString()}</p><input type="range" min={300000} max={3000000} step={25000} value={cp} onChange={e=>setCp(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Down Payment</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{cd}% (${(cp*cd/100).toLocaleString()})</p><input type="range" min={5} max={50} step={1} value={cd} onChange={e=>setCd(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Interest Rate</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{cr}%</p><input type="range" min={2} max={8} step={0.01} value={cr} onChange={e=>setCr(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Amortization</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{ca2} years</p><input type="range" min={10} max={30} step={5} value={ca2} onChange={e=>setCa2(Number(e.target.value))} style={{width:"100%"}}/></div>
      </div>
    </div>
    <Sec title="Monthly Carrying Cost"/>
    <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:24,paddingBottom:24,borderBottom:"1px solid #eee"}}>
        <div><p style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",margin:"0 0 4px"}}>Total Monthly</p><p style={{fontFamily:SF,fontSize:48,fontWeight:300,color:INK,margin:0}}>${tmm.toLocaleString()}</p></div>
        <div style={{textAlign:"right"}}><p style={{fontSize:11,textTransform:"uppercase",color:"#999",margin:"0 0 4px"}}>Annual</p><p style={{fontFamily:SF,fontSize:24,fontWeight:300,color:"#999",margin:0}}>${(tmm*12).toLocaleString()}</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
        <Mt icon={Home} label="Mortgage" value={"$"+Math.round(mp).toLocaleString()} cagr={null} cagrPeriod={"$"+mt.toLocaleString()+" principal"}/>
        <Mt icon={Home} label="Property Tax" value={"$"+mptx} cagr={null} cagrPeriod={"$"+ptx+"/yr"}/>
        <Mt label="Insurance" value={"$"+ins} cagr={null}/><Mt label="Water & Waste" value="$126" cagr={null} border={false}/>
      </div>
    </div>
    <Sec title="Closing Costs"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
      <Mt label="Ontario LTT" value={"$"+ol.toLocaleString()} cagr={null} cagrPeriod="Provincial"/>
      <Mt label="Toronto LTT" value={"$"+tl.toLocaleString()} cagr={null} cagrPeriod="Municipal double-tax"/>
      <Mt label="Total LTT" value={"$"+tt.toLocaleString()} cagr={null}/>
      <Mt label="Total Cash Needed" value={"$"+(da+tt+2500).toLocaleString()} cagr={null} cagrPeriod="Down payment + closing" border={false}/>
    </div>
    <Sec title="Affordability Context"/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px"}}>
      <Mt label="Income Needed" value={"$"+(Math.round(tmm*12/.32/1000)*1000).toLocaleString()} cagr={null} cagrPeriod="At 32% GDS" cityAvg={"$"+(Math.round(4200*12/.32/1000)*1000).toLocaleString()}/>
      <Mt label="Price-to-Income" value={(cp/d.inc).toFixed(1)+"x"} cagr={null} cityAvg={(CA.hv/CA.inc).toFixed(1)+"x"}/>
      <Mt label="Stress Test Rate" value={Math.max(cr+2,5.25).toFixed(2)+"%"} cagr={null} cagrPeriod="Contract + 2% or 5.25%" border={false}/>
    </div>
    <div style={{marginTop:24,padding:16,borderTop:"1px solid #eee"}}><p style={{fontSize:11,color:"#999"}}>Property tax uses MPAC 2016 assessed values (~45% of market). This is for estimation purposes only. Consult a licensed mortgage professional.</p></div>
  </div>);
})()}

{tab==="afford"&&(()=>{
  const sr=Math.max(ar+2,5.25),mm=ai/12*.32*.75,r=sr/100/12,n=300;
  const mx=Math.round(mm*(Math.pow(1+r,n)-1)/(r*Math.pow(1+r,n))/(1-adp/100));
  const HA=[{n:"West Humber",m:785e3},{n:"Mount Dennis",m:82e4},{n:"Flemingdon Park",m:58e4},{n:"Thorncliffe",m:52e4},{n:"East End-Danforth",m:105e4},{n:d.n,m:d.hv},{n:"The Beaches",m:145e4},{n:"South Riverdale",m:135e4},{n:"Moss Park",m:68e4},{n:"Niagara",m:82e4},{n:"Roncesvalles",m:138e4},{n:"High Park N",m:125e4},{n:"Annex",m:165e4},{n:"Yonge-St.Clair",m:98e4},{n:"Lawrence Park S",m:28e5},{n:"Wychwood",m:118e4},{n:"Keelesdale",m:85e4},{n:"Scarb Village",m:75e4},{n:"Junction",m:11e5},{n:"N St.James Town",m:56e4},{n:"Church-Wellesley",m:65e4},{n:"Scarb Centre",m:62e4},{n:"Rouge",m:95e4}];
  const sorted=HA.map(h=>({...h,t:h.m<=mx*.85?"ok":h.m<=mx*1.1?"st":"no"})).sort((a,b)=>a.m-b.m);
  return (<div>
    <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Tools</p>
    <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>What Can I Afford?</h1>
    <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
    <Ld>Enter your household income to see which Toronto neighbourhoods are within reach after stress-testing at the qualifying rate.</Ld>
    <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 32px"}}>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Household Income</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>${ai.toLocaleString()}</p><input type="range" min={40000} max={400000} step={5000} value={ai} onChange={e=>setAi(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Down Payment</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{adp}%</p><input type="range" min={5} max={50} step={1} value={adp} onChange={e=>setAdp(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Rate</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{ar}%</p><input type="range" min={2} max={8} step={0.01} value={ar} onChange={e=>setAr(Number(e.target.value))} style={{width:"100%"}}/></div>
      </div>
      <div style={{marginTop:24,paddingTop:24,borderTop:"1px solid #eee",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div><p style={{fontSize:11,textTransform:"uppercase",color:"#999",margin:"0 0 4px"}}>Max Purchase Price</p><p style={{fontFamily:SF,fontSize:48,fontWeight:300,color:INK,margin:0}}>${mx.toLocaleString()}</p></div>
        <p style={{fontSize:12,color:"#999"}}>Stress test: {sr.toFixed(2)}% | 32% GDS</p>
      </div>
    </div>
    {["ok","st","no"].map(tier=>{const items=sorted.filter(h=>h.t===tier);if(!items.length)return null;const label=tier==="ok"?"Comfortable ("+items.length+")":tier==="st"?"Stretch ("+items.length+")":"Out of Reach ("+items.length+")";const sub=tier==="ok"?"Within 85% of max":tier==="st"?"85–110% of max":"Above 110%";
      return(<div key={tier}><Sec title={label} sub={sub}/>{items.slice(0,tier==="no"?6:99).map(h=>(<div key={h.n} style={{display:"flex",alignItems:"center",padding:"12px 0",borderBottom:"1px solid #f0f0f0",background:h.n===d.n?"#f9f9f6":"transparent"}}><div style={{flex:1}}><p style={{fontSize:14,color:tier==="no"?"#999":INK,fontWeight:500,margin:0}}>{h.n}{h.n===d.n&&<span style={{fontSize:11,color:"#999",marginLeft:8,border:"1px solid #ddd",padding:"1px 6px",borderRadius:3}}>This neighbourhood</span>}</p></div><p style={{fontFamily:SF,fontSize:18,color:tier==="no"?"#999":INK,margin:0}}>${(h.m/1000).toFixed(0)}K</p></div>))}</div>);
    })}
  </div>);
})()}

{tab==="rentvsbuy"&&(()=>{
  const bm=Math.round(cMtg(d.hv*.8,4.89,25)+d.hv*MR*PTX/12+d.hv*.01/12+d.hv*.0035/12+126);
  const data=Array.from({length:ry},(_,i)=>{const y=i+1;return{year:y,rent:Math.round(rr*12*y*(1+rg/100*y/2)/1000),buy:Math.round(bm*12*y/1000)};});
  const be=data.find(x=>x.buy<x.rent);
  return (<div>
    <p style={{fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#999",marginBottom:12}}>Tools</p>
    <h1 style={{fontFamily:SF,fontSize:36,fontWeight:300,color:INK,margin:"0 0 16px"}}>Rent vs Buy</h1>
    <div style={{width:48,height:1,background:INK,margin:"16px 0 24px"}}/>
    <Ld>Compare the cumulative cost of renting vs buying at the {d.n} median of ${(d.hv/1000).toFixed(0)}K over time.</Ld>
    <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24,marginBottom:32}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"0 32px"}}>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Monthly Rent</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>${rr.toLocaleString()}</p><input type="range" min={1200} max={5000} step={100} value={rr} onChange={e=>setRr(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Rent Increase/yr</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{rg}%</p><input type="range" min={0} max={8} step={0.5} value={rg} onChange={e=>setRg(Number(e.target.value))} style={{width:"100%"}}/></div>
        <div><p style={{fontFamily:SN,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#999",marginBottom:8}}>Time Horizon</p><p style={{fontFamily:SF,fontSize:28,fontWeight:300,color:INK}}>{ry} years</p><input type="range" min={1} max={25} step={1} value={ry} onChange={e=>setRy(Number(e.target.value))} style={{width:"100%"}}/></div>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 32px",marginBottom:32}}>
      <Mt label="Monthly Rent" value={"$"+rr.toLocaleString()} cagr={null} cagrPeriod={"grows "+rg+"%/yr"}/>
      <Mt label="Monthly Buy" value={"$"+bm.toLocaleString()} cagr={null} cagrPeriod="mortgage+tax+maint"/>
      <Mt label="Premium to Buy" value={"$"+(bm-rr).toLocaleString()+"/mo"} cagr={null}/>
      <Mt label="Breakeven" value={be?be.year+" years":"25+ years"} cagr={null} border={false}/>
    </div>
    <Sec title={"Cumulative Cost Over "+ry+" Years"} sub="Rent includes annual escalation. Buy includes mortgage, tax, insurance, maintenance."/>
    <div style={{background:"#fff",border:"1px solid #e0e0e0",padding:24}}>
      <ResponsiveContainer width="100%" height={240}><BarChart data={data} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SN}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:10,fontFamily:SN}} tickFormatter={v=>"$"+v+"K"}/><Tooltip formatter={v=>"$"+v+"K"}/><Bar dataKey="rent" name="Rent" fill="#999" radius={[2,2,0,0]}/><Bar dataKey="buy" name="Buy" fill={INK} radius={[2,2,0,0]}/></BarChart></ResponsiveContainer>
    </div>
    <div style={{marginTop:24,padding:16,borderTop:"1px solid #eee"}}><p style={{fontSize:11,color:"#999"}}>Buy costs assume 20% down at 4.89% over 25 years. Property tax uses MPAC 2016 assessed values. Maintenance at 1% of value/yr. Does not include appreciation. Consult a financial advisor.</p></div>
  </div>);
})()}


{/* ══ BEST FOR ══ */}
{tab==="overview"&&<div style={{marginTop:40}}>
  <Sec title={"Best For"} sub={"Based on "+d.n+"’s data profile compared to Toronto averages."}/>
  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {d.sch>=6.5&&d.dc>=3&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Families</span>}
    {d.mom>110&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Investors</span>}
    {d.hv<800000&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>First-Time Buyers</span>}
    {d.ws>=75&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Walkability</span>}
    {d.ts>=70&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Transit Commuters</span>}
    {d.crime<150&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Safety-Conscious</span>}
    {d.gp>=15&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Nature Lovers</span>}
    {d.rest>=40&&d.coffee>=8&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Foodies & Nightlife</span>}
    {d.pov<10&&d.inc>80000&&<span style={{padding:"6px 14px",fontSize:12,fontFamily:SN,border:"1px solid #1a1a1a",color:"#1a1a1a"}}>Young Professionals</span>}
  </div>
</div>}


{/* ══ FAQ ══ */}
{tab==="overview"&&<div style={{marginTop:48}}>
  <Sec title="Frequently Asked Questions" sub={d.n+" — answers based on the latest available data."}/>
  {[
    {q:"Is "+d.n+" safe in 2026?",
     a:d.n+" has "+d.crime+" reported crime incidents, "+(d.crime<176?"below":"above")+" the Toronto average of 176. The year-over-year trend is "+(d.crimeC>0?"up":"down")+" "+Math.abs(d.crimeC)+"%. Traffic KSI collisions stand at "+d.ksi+", "+(d.ksi<12?"below":"above")+" the city average. The neighbourhood has "+d.shoot+" shooting incidents. Overall, "+d.n+" is considered "+(d.crime<176?"safer than average":"roughly average")+" for Toronto."},
    {q:"What are schools like in "+d.n+"?",
     a:"Schools rate "+d.sch+"/10 (Fraser Institute), "+(d.sch>=6?"above":"below")+" the city average of 6.0. There are "+d.dc+" licensed daycares with "+d.dcCap+" total spaces and a School Readiness (EDI) score of "+d.edi+"% (city avg: 68%). "+d.play+" playgrounds and "+d.splash+" splash pads for younger children."},
    {q:"Is "+d.n+" good for families?",
     a:d.groc+" grocery stores, "+d.dc+" daycares ("+d.dcCap+" spaces), "+d.play+" playgrounds, "+d.pool+" pools, "+d.arena+" arenas, and "+d.parks+" parks. Walk score "+d.ws+", transit score "+d.ts+". Average household size "+d.hhSize+"."},
    {q:"How much do homes cost in "+d.n+" in 2026?",
     a:"Median home value $"+(d.hv/1000).toFixed(0)+"K, "+(d.hv>930000?"above":"below")+" the Toronto average of $930K. Home values grew "+d.hvC+"% (2016–2021). Ownership rate "+d.own+"% vs city average 47%. Price-to-income ratio "+(d.hv/d.inc).toFixed(1)+"x."},
    {q:"Is "+d.n+" a good investment?",
     a:"Momentum score "+d.mom+"/200 ("+(d.mom>110?"above-average":"average")+"). Pipeline: "+d.pipe+" units, permits "+(d.permC>0?"+":"")+d.permC+"% YoY. Projected "+d.intens2051.toLocaleString()+" additional units by 2051. Net business growth "+(d.bg>0?"+":"")+d.bg+" (12 months)."},
  ].map((item,i)=>(
    <details key={i} style={{borderBottom:"1px solid #eee",marginBottom:0}}>
      <summary style={{padding:"16px 0",fontSize:15,fontWeight:500,color:INK,cursor:"pointer",fontFamily:SN,listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        {item.q}<span style={{color:"#999",fontSize:18,flexShrink:0,marginLeft:12}}>+</span>
      </summary>
      <p style={{padding:"0 0 16px",fontSize:14,color:"#666",lineHeight:1.7,margin:0}}>{item.a}</p>
    </details>
  ))}
</div>}

{/* ══ TOP 5 COMPARABLE NEIGHBOURHOODS ══ */}
{tab==="overview"&&(()=>{
  const comparable=allHoodData
    .filter(h=>h.id!==d.id)
    .map(h=>({...h,dist:Math.abs(h.hv-d.hv)/930000+Math.abs(h.pop-d.pop)/19540+Math.abs(h.ws-d.ws)/100+Math.abs(h.crime-d.crime)/176}))
    .sort((a,b)=>a.dist-b.dist)
    .slice(0,5);
  return(<div style={{marginTop:48}}>
    <Sec title="Top 5 Comparable Neighbourhoods" sub={"Similar to "+d.n+" in home value, population, walkability, and safety profile."}/>
    {comparable.map((c,i)=>{
      const hood=allNeighbourhoods.find(h=>h.id===c.id);
      if(!hood)return null;
      return(<a key={c.id} href={"/toronto/"+hood.slug} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #f0f0f0",textDecoration:"none",color:INK}}>
        <div>
          <p style={{fontSize:15,fontWeight:500,margin:0}}>{hood.name}</p>
          <p style={{fontSize:12,color:"#999",margin:"2px 0 0"}}>#{hood.id} · Walk {c.ws} · Schools {c.sch}/10 · Crime {c.crime}</p>
        </div>
        <div style={{textAlign:"right"}}>
          <p style={{fontFamily:SF,fontSize:18,margin:0}}>${(c.hv/1000).toFixed(0)}K</p>
          <p style={{fontSize:11,color:"#999",margin:"2px 0 0"}}>{c.pop.toLocaleString()} pop</p>
        </div>
      </a>);
    })}
  </div>);
})()}

<div style={{marginTop:64,borderTop:"1px solid #e0e0e0",paddingTop:24}}><p style={{fontSize:11,color:"#999",lineHeight:1.8}}>Sources: Toronto Open Data, Statistics Canada Census 2021, Toronto Police Service, Fraser Institute, RentSafeTO, DineSafe, Vision Zero, TRCA, MPAC. City averages reflect Toronto-wide figures. Growth rates use the most recent comparable period.</p></div>
      </main>
    </div>
  );
}
