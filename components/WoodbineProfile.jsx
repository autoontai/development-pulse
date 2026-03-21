import React, { useState } from "react";
import ScorecardCapture from "./ScorecardCapture";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell, ReferenceLine, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, CartesianGrid, Area, ComposedChart
} from "recharts";
import {
  Building2, Shield, Users, GraduationCap, Train, Hammer, MapPin,
  TrendingUp, TreePine, Utensils, Home, Car, Bike, Phone, Star, Search, ChevronRight
} from "lucide-react";

const INK="#1a1a1a",MID="#666",LIGHT="#999",RULE="#e0e0e0";
const PAL=["#1a1a1a","#666","#999","#bbb","#ddd","#444","#888","#555"];
const SERIF="'Cormorant Garamond','Georgia',serif";
const SANS="'DM Sans',-apple-system,'Helvetica Neue',sans-serif";

const HOOD={id:64,name:"Woodbine Corridor",ward:"Beaches—East York"};

const CT={
  population:   {2006:13200,2011:13850,2016:14800,2021:15420,to:19540},
  medianIncome: {2006:52800,2011:57200,2016:64500,2021:72500,to:65000},
  homeValue:    {2006:425000,2011:520000,2016:785000,2021:1125000,to:930000},
  ownerPct:     {2006:64,2011:62,2016:60,2021:58,to:47},
  bachelorPct:  {2006:34,2011:38,2016:42,2021:45,to:38},
  unemployRate: {2006:6.8,2011:7.2,2016:6.5,2021:5.8,to:7.2},
  transitPct:   {2006:38,2011:39,2016:41,2021:42,to:37},
  popDensity:   {2006:5800,2011:6100,2016:6500,2021:6780,to:4334},
};
const ML={
  population:   {l:"Population",       f:v=>v.toLocaleString(),          h:"neutral"},
  medianIncome: {l:"Median Income",    f:v=>"$"+(v/1000).toFixed(0)+"K", h:"better"},
  homeValue:    {l:"Home Value",       f:v=>"$"+(v/1000).toFixed(0)+"K", h:"neutral"},
  ownerPct:     {l:"Owner-Occupied",   f:v=>v+"%",                       h:"neutral"},
  bachelorPct:  {l:"Bachelor’s+",f:v=>v+"%",                       h:"better"},
  unemployRate: {l:"Unemployment",     f:v=>v+"%",                       h:"worse"},
  transitPct:   {l:"Transit Commuters",f:v=>v+"%",                       h:"better"},
  popDensity:   {l:"Density /km²",f:v=>v.toLocaleString(),          h:"neutral"},
};
function gIdx(k){return CT[k].to>0?Math.round((CT[k][2021]/CT[k].to)*100):100;}
function gTrend(k){return [2006,2011,2016,2021].map(y=>({year:String(y),v:CT[k][y]}));}

const CRIME=[{year:2020,total:131},{year:2021,total:120},{year:2022,total:153},{year:2023,total:162},{year:2024,total:140}];
const PT=[{year:"2019",n:8,a:42},{year:"2020",n:5,a:35},{year:"2021",n:12,a:48},{year:"2022",n:15,a:55},{year:"2023",n:18,a:62},{year:"2024",n:22,a:68},{year:"2025",n:14,a:45}];
const DEVS=[
  {type:"Site Plan",status:"Under Review",addr:"1450 Danforth Ave",desc:"6-storey mixed-use, 48 residential units with ground-floor retail",s:6,u:48},
  {type:"Rezoning",status:"Approved",addr:"1520 Danforth Ave",desc:"12-storey residential tower with 110 units",s:12,u:110},
  {type:"Minor Variance",status:"Hearing Scheduled",addr:"892 Woodbine Ave",desc:"Rear yard setback reduction for laneway secondary suite",s:2,u:1},
  {type:"OPA + Rezoning",status:"Under Review",addr:"1600 Danforth Ave",desc:"15-storey mixed-use development with 185 units",s:15,u:185},
];
const PU=DEVS.reduce((s,a)=>s+(a.u||0),0);
const RS=[{a:"1480 Danforth Ave",s:95,u:150},{a:"890 Danforth Ave",s:91,u:120},{a:"660 Woodbine Ave",s:88,u:85},{a:"1400 Woodbine Ave",s:82,u:48},{a:"720 Woodbine Ave",s:74,u:24},{a:"1550 Danforth Ave",s:68,u:32},{a:"45 Barker Ave",s:55,u:18}];
const RSA=Math.round(RS.reduce((s,b)=>s+b.s,0)/RS.length);
const SCH=[{n:"Earl Haig PS",r:7.2,to:6.0,e:380,prev:6.9},{n:"Woodbine Jr & Sr PS",r:6.8,to:6.0,e:420,prev:6.5},{n:"Holy Name CS",r:6.5,to:6.0,e:310,prev:6.4},{n:"Danforth CTI",r:5.9,to:6.1,e:890,prev:5.7}];
const HM=[{name:"Single & Semi-Detached",value:35},{name:"Row & Townhouse",value:12},{name:"Low-Rise Apartment",value:22},{name:"High-Rise Apartment",value:28},{name:"Other",value:3}];
// ── Neighbourhood Momentum Score ──
const MOMENTUM = {
  overall: 118,
  components: [
    {label:"Permit Velocity", score:142, weight:"25%", detail:"New build permits up 175% since 2019"},
    {label:"Crime Trajectory", score:112, weight:"20%", detail:"Total incidents down 13.6% YoY"},
    {label:"Business Growth", score:109, weight:"20%", detail:"Net +16 businesses in 12 months"},
    {label:"Population Growth", score:104, weight:"15%", detail:"+4.2% since 2016 census"},
    {label:"Transit Investment", score:115, weight:"10%", detail:"Ontario Line station planned 2030–2031"},
    {label:"Green Space", score:118, weight:"10%", detail:"18% coverage vs 13% city avg"},
  ],
};

// ── Full Recreation Facilities (from CKAN parks-and-recreation-facilities) ──
const REC = {
  indoorPools: [{name:"Stan Wadlow Pool",addr:"373 Cedarvale Ave",features:"25m, 6 lanes, accessible ramp"}],
  outdoorPools: [{name:"Monarch Park Pool",addr:"115 Felstead Ave",features:"Waterslide, diving board, wading pool"},{name:"Donald D. Summerville Olympic Pool",addr:"1867 Lake Shore Blvd E",features:"Olympic-length lap pool, 5m and 10m diving platforms"}],
  splashPads: [{name:"Woodbine Park Splash Pad",addr:"1695 Lake Shore Blvd E"},{name:"Monarch Park Splash Pad",addr:"115 Felstead Ave"},{name:"Stan Wadlow Splash Pad",addr:"373 Cedarvale Ave"}],
  wadingPools: [{name:"Monarch Park Wading Pool",addr:"115 Felstead Ave"},{name:"Kew Gardens Wading Pool",addr:"2075 Queen St E"}],
  playgrounds: [{name:"Woodbine Park Playground",addr:"1695 Lake Shore Blvd E"},{name:"Monarch Park Playground",addr:"115 Felstead Ave"},{name:"Stan Wadlow Playground",addr:"373 Cedarvale Ave"},{name:"Ted Reeve Park Playground",addr:"175 Main St"},{name:"Norwood Park Playground",addr:"50 Norwood Rd"},{name:"Cassels Ave Parkette",addr:"18 Cassels Ave"}],
  arenas: [{name:"Ted Reeve Arena",addr:"175 Main St",features:"Community skating, hockey leagues"},{name:"Stan Wadlow Arena",addr:"373 Cedarvale Ave",features:"Figure skating, public skate"}],
  tennisCourts: [{name:"Monarch Park Tennis",addr:"115 Felstead Ave",courts:4},{name:"Stan Wadlow Tennis",addr:"373 Cedarvale Ave",courts:2}],
  basketballCourts: [{name:"Stan Wadlow Basketball",addr:"373 Cedarvale Ave"},{name:"Woodbine Park Basketball",addr:"1695 Lake Shore Blvd E"}],
  baseballDiamonds: [{name:"Stan Wadlow Diamonds",addr:"373 Cedarvale Ave",diamonds:3},{name:"Ted Reeve Diamonds",addr:"175 Main St",diamonds:2}],
  dogOffLeash: [{name:"Woodbine Park Off-Leash",addr:"1695 Lake Shore Blvd E",area:"Fenced, large"},{name:"Monarch Park Off-Leash",addr:"115 Felstead Ave",area:"Open section"}],
  fitnessAreas: [{name:"Stan Wadlow Outdoor Fitness",addr:"373 Cedarvale Ave",features:"Calisthenics equipment"}],
  communityGardens: [{name:"Woodbine Community Garden",addr:"Woodbine Ave & Danforth"},{name:"Cassels Ave Community Garden",addr:"18 Cassels Ave"}],
  skatePark: [{name:"Woodbine Park Skate Spot",addr:"1695 Lake Shore Blvd E"}],
  communityCentres: [{name:"Stan Wadlow Community Centre",addr:"373 Cedarvale Ave",features:"Gym, pool, meeting rooms, programs for all ages"},{name:"Woodbine Park Clubhouse",addr:"1695 Lake Shore Blvd E",features:"Event space, seasonal programs"}],
};

// ── Festivals & Events ──
const EVENTS = [
  {name:"Taste of the Danforth",month:"Aug",desc:"Canada’s largest street festival. 1.5M+ visitors, food, music, 1.5 km of Danforth Ave",annual:true},
  {name:"Woodbine Park Farmers Market",month:"May–Oct",desc:"Weekly Saturday market, 30+ local vendors, organic produce, baked goods",annual:true},
  {name:"Danforth East Arts Fair",month:"Sep",desc:"Local artists, live performances, gallery walks along the Danforth corridor",annual:true},
  {name:"Movies in the Park (Woodbine)",month:"Jul–Aug",desc:"Free outdoor screenings Friday evenings in Woodbine Park",annual:true},
  {name:"Monarch Park Skating Party",month:"Jan",desc:"Annual community skate with hot chocolate and music",annual:true},
  {name:"Danforth Village Holiday Market",month:"Dec",desc:"Artisan market with local makers, food vendors, carolling",annual:true},
];

// ── Risk Layer ──
const RISK = {
  floodRisk: {level:"Low", detail:"No TRCA-designated floodplain within neighbourhood boundaries. Nearest regulated area is Taylor-Massey Creek, 800m north.", inFloodplain: false},
  contaminatedSites: {count:1, detail:"One historical gas station site at 1380 Danforth Ave with completed Phase II ESA. Remediated and record of site condition filed.", status:"Remediated"},
  aircraftNoise: {level:"None", detail:"Outside all NEF 25+ contours. No noise impact from Pearson or Billy Bishop airports.", nef:"Below 25"},
  roomingHouses: {count:3, toAvg:8, detail:"Three registered multi-tenant houses. Well below city average of 8 per neighbourhood."},
  environmentalAlerts: {active:0, detail:"No active environmental orders or compliance issues."},
  heritageDesignations: {count:12, detail:"Twelve properties under Part IV of the Ontario Heritage Act along Danforth Ave and residential side streets."},
};
// ── Homebuyer Calculator Helpers ──
function calcMortgagePayment(principal, annualRate, amortYears) {
  const r = annualRate / 100 / 12;
  const n = amortYears * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcOntarioLTT(price) {
  let tax = 0;
  if (price > 2000000) tax += (price - 2000000) * 0.025;
  if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
  if (price > 250000) tax += (Math.min(price, 400000) - 250000) * 0.015;
  if (price > 55000) tax += (Math.min(price, 250000) - 55000) * 0.01;
  tax += Math.min(price, 55000) * 0.005;
  return Math.round(tax);
}

function calcTorontoLTT(price) {
  let tax = 0;
  if (price > 2000000) tax += (price - 2000000) * 0.025;
  if (price > 400000) tax += (Math.min(price, 2000000) - 400000) * 0.02;
  if (price > 55000) tax += (Math.min(price, 400000) - 55000) * 0.015;
  tax += Math.min(price, 55000) * 0.005;
  return Math.round(tax);
}

// Toronto 2025 residential tax rate (municipal + education + city building)
const PROPERTY_TAX_RATE = 0.666274 / 100; // ~0.666% effective rate
const MPAC_RATIO = 0.45; // 2016 assessed value is roughly 45% of current market
const ANNUAL_WATER = 1140; // avg annual water/sewer for detached
const ANNUAL_WASTE = 372; // standard bin size
const HOME_INSURANCE_RATE = 0.0035; // ~0.35% of home value
const CONDO_FEE_PSF = 0.65; // avg $/sqft/month if condo

// ── Affordability Data (sample of Toronto neighbourhoods with median home values) ──
const HOODS_AFFORD = [
  {id:1,name:"West Humber-Clairville",med:785000,rent:2100},
  {id:5,name:"Downsview",med:880000,rent:2200},
  {id:10,name:"Mount Dennis",med:820000,rent:1950},
  {id:21,name:"St.Andrew-Windfields",med:2950000,rent:4800},
  {id:25,name:"Broadview North",med:1280000,rent:2800},
  {id:36,name:"Newtonbrook West",med:1150000,rent:2400},
  {id:44,name:"Flemingdon Park",med:580000,rent:1800},
  {id:55,name:"Thorncliffe Park",med:520000,rent:1750},
  {id:62,name:"East End-Danforth",med:1050000,rent:2500},
  {id:64,name:"Woodbine Corridor",med:1125000,rent:2600},
  {id:63,name:"The Beaches",med:1450000,rent:3100},
  {id:70,name:"South Riverdale",med:1350000,rent:2900},
  {id:73,name:"Moss Park",med:680000,rent:2200},
  {id:77,name:"Waterfront-City Island",med:750000,rent:2500},
  {id:82,name:"Niagara",med:820000,rent:2400},
  {id:85,name:"Roncesvalles",med:1380000,rent:2700},
  {id:89,name:"High Park North",med:1250000,rent:2600},
  {id:95,name:"Annex",med:1650000,rent:2800},
  {id:100,name:"Yonge-St.Clair",med:980000,rent:2500},
  {id:105,name:"Lawrence Park South",med:2800000,rent:4200},
  {id:110,name:"Forest Hill South",med:3200000,rent:5000},
  {id:113,name:"Wychwood",med:1180000,rent:2400},
  {id:120,name:"Clanton Park",med:920000,rent:2100},
  {id:125,name:"Yorkdale-Glen Park",med:980000,rent:2200},
  {id:128,name:"Corso Italia-Davenport",med:1050000,rent:2300},
  {id:130,name:"Keelesdale",med:850000,rent:2000},
  {id:132,name:"Oakwood Village",med:950000,rent:2200},
  {id:135,name:"Rockcliffe-Smythe",med:880000,rent:2050},
  {id:137,name:"Weston",med:780000,rent:1900},
  {id:140,name:"Scarborough Village",med:750000,rent:1850},
  {id:145,name:"Scarborough Town Centre",med:620000,rent:1900},
  {id:150,name:"Rouge",med:950000,rent:2100},
  {id:155,name:"Milliken",med:880000,rent:2000},
  {id:80,name:"Palmerston-Little Italy",med:1350000,rent:2700},
  {id:76,name:"Bay-Cloverhill",med:720000,rent:2600},
  {id:52,name:"Lawrence Park North",med:2400000,rent:3800},
  {id:68,name:"North St.James Town",med:560000,rent:2000},
  {id:75,name:"Church-Wellesley",med:650000,rent:2300},
  {id:90,name:"Junction Area",med:1100000,rent:2400},
  {id:96,name:"Casa Loma",med:1900000,rent:3500},
];







// ── Category Composite Scores (avg of sub-metric indices, 100 = city avg) ──
// For "lower is better" metrics (crime, KSI, 311, unemployment), we invert: 200 - index
function catScore(indices, inverted=[]) {
  const adjusted = indices.map((v,i) => inverted.includes(i) ? (200 - v) : v);
  return Math.round(adjusted.reduce((a,b) => a+b, 0) / adjusted.length);
}

const SCORES = {
  devHousing: catScore([
    Math.round(PU/210*100),          // pipeline vs avg
    gIdx("homeValue"),                // home value vs avg
    Math.round(RSA/79*100),           // rentsafe vs avg
    gIdx("ownerPct"),                 // ownership vs avg
  ]),
  familyLife: catScore([
    Math.round(8/6*100),              // grocery
    Math.round(14/10*100),            // coffee
    Math.round(6.6/6.0*100),          // schools
    Math.round(6/4*100),              // daycares
  ]),
  safety: catScore([
    Math.round(140/176*100),          // crime
    Math.round(8/12*100),             // traffic KSI
    Math.round(94.3/92.1*100),        // dinesafe
    Math.round(232/260*100),          // 311
  ], [0, 1, 3]),                      // crime, KSI, 311 are "lower is better"
  mobility: catScore([
    Math.round(82/61*100),            // walk score
    Math.round(78/65*100),            // transit score
    Math.round(4.2/3.1*100),          // bike infra
    Math.round(72/55*100),            // parking
  ]),
  nature: catScore([
    Math.round(8/5*100),              // parks
    Math.round(2/1.5*100),            // libraries
    Math.round(68/52*100),            // restaurants
    gIdx("population"),               // population
  ]),
};

// cagr is always a NUMBER (e.g. 63, -13.6, 0). Never a string with +/-.
function Metric({icon:Icon,label,value,cagr,cagrPeriod,cityAvg,border=true}) {
  const hasGrowth = cagr!==null && cagr!==undefined;
  const n = hasGrowth ? parseFloat(cagr) : 0;
  return (
    <div className={`py-5 ${border?"border-b border-gray-200":""}`}>
      <div className="flex items-center gap-1.5 mb-1.5">{Icon && <Icon size={13} strokeWidth={1.5} className="text-gray-400"/>}<p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400">{label}</p></div>
      <div className="flex items-end justify-between">
        <div>
          <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900 leading-none">{value}</p>
          {hasGrowth && n!==0 && (
            <p style={{fontFamily:SANS}} className={`text-xs mt-1.5 ${n>0?"text-emerald-700":n<0?"text-red-700":"text-gray-400"}`}>
              {n>0?"+":""}{n}%{cagrPeriod && <span className="text-gray-400 font-normal"> {cagrPeriod}</span>}
            </p>
          )}
          {hasGrowth && n===0 && cagrPeriod && (
            <p style={{fontFamily:SANS}} className="text-xs mt-1.5 text-gray-400">{cagrPeriod}</p>
          )}
          {!hasGrowth && cagrPeriod && (
            <p style={{fontFamily:SANS}} className="text-xs mt-1.5 text-gray-400">{cagrPeriod}</p>
          )}
        </div>
        {cityAvg && (
          <div className="text-right">
            <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-0.5">City Avg</p>
            <p style={{fontFamily:SERIF}} className="text-2xl font-light text-gray-400 leading-none">{cityAvg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({title,sub}) {
  return (<div className="mt-14 mb-6"><h2 style={{fontFamily:SERIF}} className="text-2xl font-light text-gray-900 tracking-tight">{title}</h2>{sub&&<p style={{fontFamily:SANS}} className="text-sm text-gray-500 mt-1">{sub}</p>}<div className="w-12 h-px bg-gray-900 mt-3"/></div>);
}
function Lede({children}) {
  return <p style={{fontFamily:SERIF}} className="text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl">{children}</p>;
}
function StatusDot({s}) {
  const col=s==="Approved"?"bg-emerald-500":s.includes("Review")?"bg-amber-500":"bg-gray-400";
  return <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${col}`}/><span style={{fontFamily:SANS}} className="text-xs text-gray-500">{s}</span></div>;
}

export default function WoodbineProfile() {
  const [tab,setTab]=useState("overview");
  const [tm,setTm]=useState("medianIncome");
  const [srch,setSrch]=useState("");
  const [srchF,setSrchF]=useState(false);

  // Rent vs Buy state
  const [rvbRent,setRvbRent]=useState(2600);
  const [rvbGrowth,setRvbGrowth]=useState(3);
  const [rvbYears,setRvbYears]=useState(10);

  // Homebuyer calculator state
  const [affordIncome,setAffordIncome]=useState(120000);
  const [affordDown,setAffordDown]=useState(20);
  const [affordRate,setAffordRate]=useState(4.89);
  const [calcPrice,setCalcPrice]=useState(1125000);
  const [calcDown,setCalcDown]=useState(20);
  const [calcRate,setCalcRate]=useState(4.89);
  const [calcAmort,setCalcAmort]=useState(25);

  const navs=[
    {id:"overview",label:"Overview"},
    {id:"development",label:"Development"},
    {id:"family",label:"Family & Living"},
    {id:"safety",label:"Safety"},
    {id:"health",label:"Health"},
    {id:"demographics",label:"Demographics"},
    {id:"environment",label:"Nature"},
    {id:"business",label:"Business"},
  ];

  const toolNavs=[
    {id:"calculator",label:"Homebuyer Calculator"},
    {id:"afford",label:"What Can I Afford?"},
    {id:"rentvsbuy",label:"Rent vs Buy"},
  ];

  const sugg=srchF&&srch.length>1?[
    {name:"Woodbine Corridor",id:64},{name:"The Beaches",id:63},{name:"East End–Danforth",id:62},{name:"Greenwood–Coxwell",id:65}
  ].filter(s=>s.name.toLowerCase().includes(srch.toLowerCase())):[];

  const tMeta=ML[tm];
  const tData=gTrend(tm);

  return (
    <div className="min-h-screen flex flex-col" style={{background:"#faf9f6",fontFamily:SANS}}>
      

      <div className="flex flex-1 overflow-hidden">
        <nav className="w-48 bg-white border-r border-gray-200 flex-shrink-0 pt-6 sticky overflow-y-auto" style={{top:64,height:"calc(100vh - 64px)"}}>
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 px-5 mb-4">Sections</p>
        {sectionNavs.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} className={"block w-full text-left px-5 py-2.5 text-sm font-medium border-l-2 cursor-pointer "+(tab===n.id?"bg-gray-50 border-gray-900 text-gray-900":"border-transparent text-gray-500 hover:text-gray-700")} style={{fontFamily:SANS}}>{n.label}</button>
        ))}
        <div className="mt-3 mb-2 px-5"><div className="border-t border-gray-200"/></div>
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 px-5 mb-2">Blog</p>
        <a href="/blog" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Blog</a>
        <div className="mt-3 mb-2 px-5"><div className="border-t border-gray-200"/></div>
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 px-5 mb-2">Tools</p>
        <a href="/find-neighbourhood" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Find Neighbourhood</a>
        <a href="/compare" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Compare Hoods</a>
        <a href="/tools/tree-canopy" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Tree Canopy Map</a>
        <a href="/tools/childcare" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Childcare Map</a>
        <a href="/tools/pedestrian-safety" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Pedestrian Safety Map</a>
        {toolNavs.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} className={"block w-full text-left px-5 py-2 text-sm font-medium border-l-2 cursor-pointer "+(tab===n.id?"bg-gray-50 border-gray-900 text-gray-900":"border-transparent text-gray-500 hover:text-gray-700")} style={{fontFamily:SANS}}>{n.label}</button>
        ))}
        <div className="mt-3 mb-2 px-5"><div className="border-t border-gray-200"/></div>
        <p className="text-xs tracking-[0.2em] uppercase text-gray-400 px-5 mb-2">Subscribe</p>
        <a href="/premium" className="block px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-l-2 border-transparent no-underline" style={{fontFamily:SANS}}>Premium Newsletter</a>
        <ScorecardCapture variant="sidebar" neighbourhood="Woodbine Corridor" />
      </nav>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">

            {tab==="overview"&&<div>
              <div className="mb-10">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Neighbourhood Profile</p>
                <h1 style={{fontFamily:SERIF}} className="text-5xl font-light text-gray-900 tracking-tight leading-tight">{HOOD.name}</h1>
                <div className="w-16 h-px bg-gray-900 mt-4 mb-6"/>
                <Lede>A transit-rich, family-oriented neighbourhood along the Danforth with a vibrant food corridor, above-average schools, and notably lower crime than the city as a whole. Home values have outpaced Toronto by 21 percent since 2006, while the area maintains a walkable, village-scale character across eight parks and direct subway access. The neighbourhood’s momentum score of 118 signals accelerating development activity and improving community metrics.</Lede>
              </div>

              <Section title="Neighbourhood Index" sub="Composite score per category. Each averages 3–4 underlying metrics indexed to the city. 100 = Toronto average."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-72 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={[
                        {m:"Development\n& Housing",v:SCORES.devHousing,a:100},
                        {m:"Family\n& Daily Life",v:SCORES.familyLife,a:100},
                        {m:"Safety &\nWellbeing",v:SCORES.safety,a:100},
                        {m:"Health",v:145,a:100},
                        {m:"Mobility\n& Access",v:SCORES.mobility,a:100},
                        {m:"Nature &\nCommunity",v:SCORES.nature,a:100},
                      ]} margin={{top:20,right:40,bottom:20,left:40}}>
                        <PolarGrid stroke={RULE}/>
                        <PolarAngleAxis dataKey="m" tick={{fontSize:10,fill:MID,fontFamily:SANS}}/>
                        <PolarRadiusAxis angle={90} domain={[0,180]} tick={false}/>
                        <Radar dataKey="a" stroke={LIGHT} strokeWidth={1.5} fill="transparent" strokeDasharray="4 3"/>
                        <Radar dataKey="v" stroke={INK} strokeWidth={2} fill={INK} fillOpacity={0.06}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 w-full">
                    {[
                      {label:"Development & Housing", score:SCORES.devHousing, subs:"Pipeline, home value, RentSafe, ownership"},
                      {label:"Family & Daily Life", score:SCORES.familyLife, subs:"Grocery, coffee, schools, daycares"},
                      {label:"Safety & Wellbeing", score:SCORES.safety, subs:"Crime, traffic KSI, DineSafe, 311"},
                      {label:"Health & Wellbeing", score:145, subs:"Premature mortality, diabetes, family doctor, food insecurity"},
                      {label:"Mobility & Access", score:SCORES.mobility, subs:"Walk, transit, bike lanes, parking"},
                      {label:"Nature & Community", score:SCORES.nature, subs:"Parks, libraries, restaurants, population"},
                    ].map(c=>(
                      <div key={c.label} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{c.label}</p>
                          <p className="text-xs text-gray-400">{c.subs}</p>
                        </div>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                          <div className="absolute h-full rounded-full bg-gray-900" style={{width:Math.min(c.score/1.6,100)+"%"}}/>
                          <div className="absolute h-full w-px bg-gray-400" style={{left:(100/1.6)+"%"}}/>
                        </div>
                        <div className="text-right w-20">
                          <span style={{fontFamily:SERIF}} className="text-lg text-gray-900">{c.score}</span>
                          <span className="text-xs text-gray-400 ml-1">/ 100</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-3">Dashed ring = Toronto (100). For safety metrics, lower raw values score higher.</p>
                  </div>
                </div>
              </div>

              <Section title="Neighbourhood Momentum" sub="Composite trajectory score. Is this neighbourhood accelerating or decelerating? 100 = holding steady."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="flex items-start gap-8">
                  <div className="text-center flex-shrink-0">
                    <p style={{fontFamily:SERIF}} className="text-6xl font-light text-gray-900">{MOMENTUM.overall}</p>
                    <p style={{fontFamily:SANS}} className="text-xs text-gray-400 mt-1">out of 200</p>
                    <p style={{fontFamily:SANS}} className="text-xs text-emerald-700 font-semibold mt-0.5">Above average momentum</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 py-1 mb-1 border-b border-gray-200">
                      <span className="text-xs text-gray-400 w-32">Factor</span>
                      <div className="flex-1 text-xs text-gray-400">Score vs city (100)</div>
                      <span className="text-xs text-gray-400 w-8 text-right"></span>
                      <span className="text-xs text-gray-400 w-8 text-right">Weight</span>
                    </div>
                    {MOMENTUM.components.map(c=>(
                      <div key={c.label} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                        <span className="text-xs text-gray-500 w-32">{c.label}</span>
                        <div className="flex-1 h-1 bg-gray-200 rounded-full relative">
                          <div className="absolute h-full rounded-full bg-gray-900" style={{width:Math.min(c.score/1.6,100)+"%"}}/>
                          <div className="absolute h-full w-px bg-gray-400" style={{left:(100/1.6)+"%"}}/>
                        </div>
                        <span style={{fontFamily:SERIF}} className="text-sm text-gray-900 w-8 text-right">{c.score}</span>
                        <span className="text-xs text-gray-400 w-8 text-right">{c.weight}</span>
                      </div>
                    ))}
                    <p className="text-xs text-gray-400 mt-3">Weight = contribution to the composite momentum score. Scores above 100 indicate positive momentum vs city average.</p>
                  </div>
                </div>
              </div>

              
              <Section title="Census Trends" sub="Four census cycles, 2006–2021. Dashed line is citywide average."/>
              <div className="bg-white border border-gray-200 p-6">
                <div className="flex flex-wrap gap-2 mb-5">
                  {Object.entries(ML).map(([k,m])=><button key={k} onClick={()=>setTm(k)} className={`px-3 py-1.5 text-xs tracking-wide transition-all border ${tm===k?"border-gray-900 text-gray-900 bg-gray-50":"border-gray-200 text-gray-500 hover:border-gray-400"}`}>{m.l}</button>)}
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={tData} margin={{top:10,right:10,bottom:5,left:10}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SANS}}/><YAxis tick={{fontSize:10,fontFamily:SANS}} tickFormatter={v=>v>=1000?(v/1000).toFixed(0)+"K":v}/><Tooltip/>
                    <ReferenceLine y={CT[tm].to} stroke={LIGHT} strokeDasharray="6 3" strokeWidth={1.5} label={{value:"Toronto: "+tMeta.f(CT[tm].to),position:"insideTopRight",fontSize:10,fill:LIGHT,fontFamily:SANS}}/>
                    <Area type="monotone" dataKey="v" fill={INK} fillOpacity={0.03} stroke="none"/>
                    <Line type="monotone" dataKey="v" stroke={INK} strokeWidth={2} dot={{r:4,fill:"#fff",stroke:INK,strokeWidth:2}}/>
                  </ComposedChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                  {[2006,2011,2016,2021].map((y,i)=>{
                    const prev=i>0?CT[tm][[2006,2011,2016,2021][i-1]]:null;
                    const cur=CT[tm][y];
                    const chg=prev?((cur-prev)/Math.abs(prev)*100).toFixed(1):null;
                    return <div key={y} className="text-center">
                      <p className="text-xs text-gray-400">{y}</p>
                      <p style={{fontFamily:SERIF}} className="text-lg font-normal text-gray-900">{tMeta.f(cur)}</p>
                      {chg&&<p className={`text-xs ${parseFloat(chg)>0?"text-emerald-700":"text-red-700"}`}>{parseFloat(chg)>0?"+":""}{chg}%</p>}
                    </div>;
                  })}
                </div>
              </div>
            </div>}

            {tab==="development"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Development</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Pipeline & Permits</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>The corridor has {PU} residential units in its active pipeline across {DEVS.length} applications. Permit velocity has nearly tripled since 2019, driven by the Danforth’s transition from low-rise commercial to mid-rise mixed-use. The 35-storey Choice Properties development at Woodbine & Danforth—approved in late 2024—marks a new scale for the neighbourhood, bringing 660 units, a replacement grocery store, a new daycare, and dedicated space for Coal Mine Theatre.</Lede>
              <div className="grid grid-cols-2 gap-x-8 mb-6">
                <Metric icon={Hammer} label="Pipeline Units" value={PU} cagr={63} cagrPeriod="vs 2023" cityAvg="210"/>
                <Metric icon={Hammer} label="New Build Permits (2024)" value="22" cagr={22} cagrPeriod="vs 2023" cityAvg="18"/>
                <Metric icon={Building2} label="Max Proposed Height" value="15 storeys" cagr={null} cagrPeriod="neighbourhood record"/>
                <Metric icon={Hammer} label="Demolition Permits" value="7" cagr={40} cagrPeriod="vs 2023" cityAvg="5"/>
                <Metric icon={Hammer} label="Affordable Units Pipeline" value="42" cagr={null} cagrPeriod="Approved/proposed affordable units" cityAvg="50"/>
                <Metric icon={TrendingUp} label="Intensification to 2051" value="3,200 units" cagr={null} cagrPeriod="Projected additional dwellings" cityAvg="5,000" border={false}/>
              </div>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">What’s Driving These Numbers</p>
                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Pipeline Units (+63% vs 2023)</p><p className="text-xs text-gray-500 mt-1">The 35-storey Choice Properties REIT redevelopment at 985 Woodbine Ave alone adds 660 units. Provincial Transit-Oriented Communities policy now permits higher density within 800m of subway stations, unlocking mid-rise and tall-building potential along the entire Danforth corridor.</p></div>
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">New Build Permits (+22% vs 2023)</p><p className="text-xs text-gray-500 mt-1">Acceleration driven by laneway suite and garden suite permits following Toronto’s 2022 as-of-right bylaw changes. Eight laneway suites permitted in 2024 alone, up from two in 2021.</p></div>
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Max Proposed Height: 35 storeys</p><p className="text-xs text-gray-500 mt-1">The Choice Properties tower at Woodbine & Danforth would be the tallest in the neighbourhood, more than doubling the previous record of 15 storeys. Approved by Community Council November 2024.</p></div>
                  <div className="py-3"><p className="text-sm text-gray-900 font-medium">Demolition Permits (+40%)</p><p className="text-xs text-gray-500 mt-1">Older single-storey commercial buildings along Danforth being cleared for mixed-use redevelopment. Seven demolition permits in 2024, concentrated between Woodbine and Main stations.</p></div>
                </div>
              </div>

              <Section title="Active Development Applications, March 2026" sub="Current planning applications tracked by the City of Toronto Application Information Centre."/>
              {DEVS.map((a,i)=>(<div key={i} className="py-5 border-b border-gray-200"><div className="flex items-center gap-3 mb-2"><p className="text-xs tracking-widest uppercase text-gray-400">{a.type}</p><StatusDot s={a.status}/></div><h3 style={{fontFamily:SERIF}} className="text-xl text-gray-900">{a.addr}</h3><p className="text-sm text-gray-500 mt-1 leading-relaxed">{a.desc}</p><div className="flex gap-6 mt-2 text-xs text-gray-400">{a.s&&<span>{a.s} storeys</span>}{a.u>0&&<span>{a.u} units</span>}</div></div>))}
              <Section title="Building Permits Issued, 2019–2025" sub="New construction and alteration permits issued by City of Toronto Building Division."/>
              <div className="bg-white border border-gray-200 p-6"><ResponsiveContainer width="100%" height={220}><BarChart data={PT} barGap={3} margin={{top:10,right:10,bottom:5,left:15}}><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SANS}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:11,fontFamily:SANS}} label={{value:"Permits",angle:-90,position:"insideLeft",offset:5,fontSize:10,fill:"#999"}}/><Tooltip/><Bar dataKey="n" name="New Build" fill={INK} radius={[2,2,0,0]}/><Bar dataKey="a" name="Alteration" fill="#ccc" radius={[2,2,0,0]}/></BarChart></ResponsiveContainer></div>
            </div>}

            {tab==="family"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Family & Living</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Raising a Family Here</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Woodbine Corridor outperforms the Toronto average on nearly every family metric. Schools rate 10% above average. Six licensed daycares serve 280 children. The neighbourhood is exceptionally well-served for recreation, with two outdoor pools, three splash pads, six playgrounds, two arenas, and the annual Taste of the Danforth—Canada’s largest street festival—on its doorstep. Families with children make up 40% of households, well above the city norm.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">What These Metrics Measure</p>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Grocery Stores</p><p className="text-xs text-gray-500 mt-0.5">Count of full-service grocery retailers within neighbourhood boundaries, sourced from City of Toronto business licences. Includes No Frills, Metro, FreshCo, and independent markets. Up 14% since 2020 as Danforth’s food retail cluster expands.</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Coffee Shops</p><p className="text-xs text-gray-500 mt-0.5">Licensed café and coffee retail establishments. The 27% growth reflects the post-pandemic shift toward third-place workspaces, with three independent specialty cafés opening in 2023–2024.</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">School Rating</p><p className="text-xs text-gray-500 mt-0.5">Fraser Institute average of all neighbourhood schools, scaled 0–10. Combines standardized EQAO test results, student outcomes, and value-added measures. Woodbine’s 6.6 reflects Earl Haig PS (7.2) and Woodbine Jr & Sr PS (6.8) anchoring the average.</p></div>
                  <div className="py-2"><p className="text-sm text-gray-900 font-medium">Licensed Daycares</p><p className="text-xs text-gray-500 mt-0.5">Ontario-licensed childcare centres from City of Toronto open data. Six centres with a combined 280 spaces. Average waitlist is 8 months. The new Choice Properties development includes a new daycare facility.</p></div>
                </div>
              </div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Daily Essentials</p>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Building2} label="Grocery Stores" value="8" cagr={14} cagrPeriod="vs 2020" cityAvg="6"/>
                <Metric icon={Utensils} label="Coffee Shops" value="14" cagr={27} cagrPeriod="vs 2020" cityAvg="10"/>
                <Metric icon={Utensils} label="Restaurants" value="68" cagr={12} cagrPeriod="2022–2024" cityAvg="52"/>
                <Metric icon={Building2} label="Libraries" value="2" cagr={0} cagrPeriod="no change" cityAvg="1.5"/>
              </div>
              <div className="py-4 border-b border-gray-200"><p className="text-xs tracking-widest uppercase text-gray-400 mb-2">Nearby Grocery</p><p className="text-sm text-gray-600 leading-relaxed">No Frills, Metro, FreshCo, Sobeys Urban Fresh, Loblaws CityMarket, Kim’s Mart, Danforth Fruit Market, Green Earth Organics</p></div>
              <div className="mt-8"><p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Children & Schools</p></div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={GraduationCap} label="Avg School Rating" value="6.6 / 10" cagr={3.1} cagrPeriod="vs prior yr" cityAvg="6.0"/>
                <Metric icon={Users} label="Licensed Daycares" value="6" cagr={20} cagrPeriod="vs 2020" cityAvg="4"/>
                <Metric icon={Users} label="Daycare Spaces" value="280" cagr={null} cagrPeriod="Total licensed capacity" cityAvg="180"/>
                <Metric icon={GraduationCap} label="School Readiness (EDI)" value="74%" cagr={null} cagrPeriod="Meeting developmental benchmarks" cityAvg="68%"/>
                <Metric icon={Star} label="Playgrounds" value="6" cagr={0} cagrPeriod="no change" cityAvg="4"/>
                <Metric icon={Star} label="Splash Pads" value="3" cagr={null} cityAvg="2"/>
              </div>
              {SCH.map((s,i)=>{
                const chg=((s.r-s.prev)/s.prev*100).toFixed(1);
                const cn=parseFloat(chg);
                return <div key={i} className="flex items-center py-4 border-b border-gray-100"><div className="flex-1"><p className="text-sm text-gray-900 font-medium">{s.n}</p><p className="text-xs text-gray-400">{s.e} students</p></div><div className="text-center mr-8"><p style={{fontFamily:SERIF}} className="text-2xl text-gray-900 leading-none">{s.r}</p><p className={`text-xs mt-1 ${cn>0?"text-emerald-700":"text-red-700"}`}>{cn>0?"+":""}{chg}% vs prior</p></div><div className="text-right"><p className="text-xs tracking-widest uppercase text-gray-400 mb-0.5">City Avg</p><p style={{fontFamily:SERIF}} className="text-2xl text-gray-400 leading-none">{s.to}</p></div></div>;
              })}
              <div className="mt-8"><p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Parks & Recreation</p></div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={TreePine} label="Parks" value="8" cagr={0} cagrPeriod="no change" cityAvg="5"/>
                <Metric icon={TreePine} label="Total Park Area" value="32.1 ha" cagr={null} cityAvg="~20 ha"/>
                <Metric icon={TreePine} label="Green Roofs" value="4" cagr={null} cityAvg="3"/>
                <Metric icon={Shield} label="Basement Flood Risk" value="8%" cagr={null} cagrPeriod="Probability based on infrastructure + terrain" cityAvg="15%"/>
                <Metric icon={Star} label="Pools & Arenas" value="3" cagr={null} cityAvg="2"/>
                <Metric icon={Star} label="Tennis Courts" value="4" cagr={null} cityAvg="3"/>
              </div>
              <div className="mt-8"><p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-1">Getting Around</p></div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={MapPin} label="Walk Score" value="82" cagr={2} cagrPeriod="2022–2024" cityAvg="61"/>
                <Metric icon={Train} label="Transit Score" value="78" cagr={4} cagrPeriod="2022–2024" cityAvg="65"/>
                <Metric icon={Bike} label="Bike Infrastructure" value="4.2 km" cagr={31} cagrPeriod="2020–2024" cityAvg="3.1 km"/>
                <Metric icon={Car} label="Parking Ease" value="72 / 100" cagr={-3} cagrPeriod="2022–2024" cityAvg="55" border={false}/>
              </div>

              <Section title="Recreation Facilities Inventory" sub="Named facilities from City of Toronto Parks & Recreation open data (parks-and-recreation-facilities dataset)."/>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Star} label="Indoor Pools" value={REC.indoorPools.length} cityAvg="1"/>
                <Metric icon={Star} label="Outdoor Pools" value={REC.outdoorPools.length} cityAvg="1"/>
                <Metric icon={Star} label="Splash Pads" value={REC.splashPads.length} cityAvg="2"/>
                <Metric icon={Star} label="Wading Pools" value={REC.wadingPools.length} cityAvg="1"/>
                <Metric icon={Star} label="Playgrounds" value={REC.playgrounds.length} cityAvg="4"/>
                <Metric icon={Star} label="Arenas" value={REC.arenas.length} cityAvg="1"/>
                <Metric icon={Star} label="Tennis Courts" value={REC.tennisCourts.reduce((s,t)=>s+(t.courts||1),0)} cityAvg="3"/>
                <Metric icon={Star} label="Basketball Courts" value={REC.basketballCourts.length} cityAvg="1"/>
                <Metric icon={Star} label="Baseball Diamonds" value={REC.baseballDiamonds.reduce((s,d)=>s+(d.diamonds||1),0)} cityAvg="2"/>
                <Metric icon={Star} label="Dog Off-Leash Areas" value={REC.dogOffLeash.length} cityAvg="1"/>
                <Metric icon={Star} label="Community Gardens" value={REC.communityGardens.length} cityAvg="1"/>
                <Metric icon={Star} label="Skate Parks" value={REC.skatePark.length} cityAvg="0.5" border={false}/>
              </div>

              {[
                {title:"Pools & Water Play",items:[...REC.indoorPools.map(p=>({n:p.name,d:p.features+" — Indoor, year-round"})),...REC.outdoorPools.map(p=>({n:p.name,d:p.features+" — Outdoor, seasonal"}))]},
                {title:"Community Centres",items:REC.communityCentres.map(c=>({n:c.name,d:c.features}))},
                {title:"Arenas & Ice",items:REC.arenas.map(a=>({n:a.name,d:a.features}))},
              ].map(group=>(
                <div key={group.title}>
                  <div className="mt-6 mb-2"><p className="text-xs tracking-widest uppercase text-gray-400">{group.title}</p></div>
                  {group.items.map((item,i)=>(
                    <div key={i} className="py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-900 font-medium">{item.n}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.d}</p>
                    </div>
                  ))}
                </div>
              ))}

              <Section title="Annual Festivals & Community Events" sub="Recurring events within or adjacent to the neighbourhood. Source: City of Toronto festivals-events dataset and local BIA listings."/>
              {EVENTS.map((e,i)=>(
                <div key={i} className="py-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-1">
                    <p style={{fontFamily:SERIF}} className="text-lg text-gray-900">{e.name}</p>
                    <span className="text-xs text-gray-400 ml-auto">{e.month}</span>
                  </div>
                  <p className="text-sm text-gray-500">{e.desc}</p>
                </div>
              ))}

              <Section title="Farmers Markets & Community Gardens"/>
              <div className="py-4 border-b border-gray-200">
                <p style={{fontFamily:SERIF}} className="text-lg text-gray-900">Woodbine Park Farmers Market</p>
                <p className="text-xs text-gray-400 mt-0.5">Saturdays, May–October — 30+ vendors, organic produce, baked goods, artisan products</p>
              </div>
              {REC.communityGardens.map((g,i)=>(
                <div key={i} className="py-3 border-b border-gray-100">
                  <p className="text-sm text-gray-900 font-medium">{g.name}</p>
                  <p className="text-xs text-gray-400">{g.addr}</p>
                </div>
              ))}
            </div>}

            {tab==="safety"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Safety</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Crime & Wellbeing</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>The neighbourhood sits 20% below the citywide crime rate, with total incidents declining 13.6% year-over-year in 2024. Traffic fatalities and serious injuries are a third below average. From a homebuyer risk perspective, Woodbine Corridor has no flood zone exposure, no aircraft noise, and only one fully remediated contaminated site.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">What These Metrics Measure & What Changed</p>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Crime Incidents (−13.6% YoY)</p><p className="text-xs text-gray-500 mt-0.5">Total Major Crime Indicator incidents (assault, break & enter, auto theft, robbery, theft over) reported by Toronto Police Service within neighbourhood boundaries. The 2024 decline was driven primarily by a 28% drop in auto theft following TPS’s Project MARE targeting organized theft rings in east Toronto, and a 15% reduction in break & enters attributed to increased community policing patrols.</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Traffic KSI (−33% YoY)</p><p className="text-xs text-gray-500 mt-0.5">Killed or Seriously Injured collisions from the City’s Vision Zero database. The improvement reflects the 2023 installation of protected bike lanes on Woodbine Ave and a new pedestrian signal at Danforth & Cassels. Two of the eight 2024 KSI incidents involved cyclists.</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">DineSafe Pass Rate (94.3%)</p><p className="text-xs text-gray-500 mt-0.5">Percentage of Toronto Public Health food safety inspections resulting in a “Pass” for restaurants, cafes, and food retailers. Inspections check temperature control, food handling, sanitation, and pest control. The neighbourhood’s rate exceeds the city average of 92.1%.</p></div>
                  <div className="py-2"><p className="text-sm text-gray-900 font-medium">311 Service Requests (−4.1% YoY)</p><p className="text-xs text-gray-500 mt-0.5">Total non-emergency service requests to the City of Toronto. Includes tree maintenance, graffiti removal, noise complaints, road repairs, and illegal dumping. Declining requests generally indicate improving infrastructure maintenance and neighbourhood upkeep.</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Shield} label="Crime Incidents (2024)" value="140" cagr={-13.6} cagrPeriod="2023–2024" cityAvg="176"/>
                <Metric icon={Car} label="Traffic KSI Collisions" value="8" cagr={-33} cagrPeriod="2023–2024" cityAvg="12"/>
                <Metric icon={Utensils} label="DineSafe Pass Rate" value="94.3%" cagr={1.2} cagrPeriod="vs prior yr" cityAvg="92.1%"/>
                <Metric icon={Phone} label="311 Requests" value="232" cagr={-4.1} cagrPeriod="2023–2024" cityAvg="260"/>
                <Metric icon={Shield} label="Shootings" value="6" cagr={-25} cagrPeriod="2023–2024" cityAvg="14"/>
                <Metric icon={Shield} label="Hate Crimes" value="2" cagr={null} cityAvg="5"/>
                <Metric icon={Phone} label="Persons in Crisis Calls" value="38" cagr={null} cityAvg="45"/>
                <Metric icon={Bike} label="Bicycle Thefts" value="18" cagr={null} cityAvg="25"/>
              </div>
              <Section title="Total Crime Incidents, 2020–2024" sub="Major Crime Indicator incidents reported by Toronto Police Service. Dashed line is citywide average (176)."/>
              <div className="bg-white border border-gray-200 p-6 mb-8"><ResponsiveContainer width="100%" height={200}><LineChart data={CRIME} margin={{top:10,right:10,bottom:5,left:15}}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SANS}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:11,fontFamily:SANS}} label={{value:"Incidents",angle:-90,position:"insideLeft",offset:5,fontSize:10,fill:"#999"}}/><Tooltip/><ReferenceLine y={176} stroke={LIGHT} strokeDasharray="6 3" strokeWidth={1.5} label={{value:"Toronto avg",position:"insideTopRight",fontSize:10,fill:LIGHT}}/><Line type="monotone" dataKey="total" stroke={INK} strokeWidth={2} dot={{r:4,fill:"#fff",stroke:INK,strokeWidth:2}}/></LineChart></ResponsiveContainer></div>
              <Section title="RentSafeTO Building Scores, 2024" sub="Annual inspection scores for multi-unit rental buildings (3+ storeys). Scale 0–100. Toronto average is 79."/>
              {RS.map((b,i)=><div key={i} className="flex items-center py-4 border-b border-gray-100"><div className="flex-1"><p className="text-sm text-gray-900">{b.a}</p><p className="text-xs text-gray-400">{b.u} units</p></div><p style={{fontFamily:SERIF}} className="text-2xl text-gray-900 mr-8">{b.s}</p><div className="text-right"><p className="text-xs tracking-widest uppercase text-gray-400 mb-0.5">City Avg</p><p style={{fontFamily:SERIF}} className="text-2xl text-gray-400 leading-none">79</p></div></div>)}

              <Section title="Environmental & Property Risk Assessment" sub="Due-diligence screening for homebuyers. Sources: Toronto Region Conservation Authority, Ontario Ministry of Environment, Transport Canada, City of Toronto."/>
              {[
                {label:"Flood Risk",value:RISK.floodRisk.level,detail:RISK.floodRisk.detail},
                {label:"Contaminated Sites",value:RISK.contaminatedSites.count+" ("+RISK.contaminatedSites.status+")",detail:RISK.contaminatedSites.detail},
                {label:"Aircraft Noise",value:RISK.aircraftNoise.level,detail:RISK.aircraftNoise.detail},
                {label:"Rooming Houses",value:RISK.roomingHouses.count+" registered (city avg "+RISK.roomingHouses.toAvg+")",detail:RISK.roomingHouses.detail},
                {label:"Environmental Orders",value:"None active",detail:RISK.environmentalAlerts.detail},
                {label:"Heritage Properties",value:RISK.heritageDesignations.count+" designated",detail:RISK.heritageDesignations.detail},
              ].map((r,i)=>(
                <div key={i} className="py-4 border-b border-gray-200">
                  <div className="flex items-baseline justify-between mb-1">
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400">{r.label}</p>
                    <p style={{fontFamily:SERIF}} className="text-lg text-gray-900">{r.value}</p>
                  </div>
                  <p className="text-sm text-gray-500">{r.detail}</p>
                </div>
              ))}
            </div>}

            {tab==="demographics"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Demographics</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Who Lives Here</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Population has grown 17% since 2006, outpacing the city. Median household income is 12% above average and climbing. 45% hold a bachelor’s degree or higher versus 38% citywide. The household composition skews toward families with children (40%), with a growing cohort of young professionals drawn by transit access and relative affordability compared to The Beaches and Leslieville.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">Key Demographic Shifts</p>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Income Growth (+12.4%, 2016–2021)</p><p className="text-xs text-gray-500 mt-0.5">Median household income rose from $64,500 to $72,500, outpacing the city’s 8.2% growth. Driven by the influx of dual-income professional households replacing retirees, consistent with the education trend (bachelor’s+ rising from 42% to 45%).</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Ownership Declining (60% → 58%)</p><p className="text-xs text-gray-500 mt-0.5">Home prices rising faster than incomes are gradually shifting the tenure mix toward renters. Purpose-built rental construction (the Choice Properties development includes 28 rental units) will continue this trend.</p></div>
                  <div className="py-2"><p className="text-sm text-gray-900 font-medium">Density Rising (6,500 → 6,780/km²)</p><p className="text-xs text-gray-500 mt-0.5">Population density has increased 17% since 2006, reflecting gentle densification through secondary suites and low-rise infill. The approved 660-unit tower will significantly accelerate this metric in the 2026 census.</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                {Object.entries(ML).map(([k,m],i)=>{
                  const prev=CT[k][2016],cur=CT[k][2021];
                  const chg=prev?parseFloat(((cur-prev)/Math.abs(prev)*100).toFixed(1)):null;
                  const icons={population:Users,medianIncome:Home,homeValue:Home,ownerPct:Users,bachelorPct:GraduationCap,unemployRate:Users,transitPct:Train,popDensity:MapPin};
                  return <Metric key={k} icon={icons[k]} label={m.l} value={m.f(cur)} cagr={chg} cagrPeriod="2016–2021" cityAvg={m.f(CT[k].to)} border={i<Object.keys(ML).length-2}/>;
                })}
              </div>
              <Section title="Diversity & Household Composition" sub="Census 2021. Immigration and language data from Statistics Canada."/>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Users} label="Poverty Rate (LIM)" value="12.8%" cagr={null} cagrPeriod="Below low-income cutoff" cityAvg="15%"/>
                <Metric icon={Users} label="Immigrant Population" value="38%" cagr={null} cityAvg="47%"/>
                <Metric icon={Users} label="Visible Minority" value="32%" cagr={null} cityAvg="52%"/>
                <Metric icon={Home} label="Avg Household Size" value="2.6" cagr={null} cityAvg="2.4"/>
                <Metric icon={Users} label="Language Diversity" value="28%" cagr={null} cagrPeriod="Non-official language at home" cityAvg="35%" border={false}/>
              </div>

              <Section title="Census Trends, 2006–2021" sub="Four census cycles from Statistics Canada. Dashed line is Toronto citywide average."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="flex flex-wrap gap-2 mb-5">{Object.entries(ML).map(([k,m])=><button key={k} onClick={()=>setTm(k)} className={`px-3 py-1.5 text-xs tracking-wide border transition-all ${tm===k?"border-gray-900 text-gray-900":"border-gray-200 text-gray-500 hover:border-gray-400"}`}>{m.l}</button>)}</div>
                <ResponsiveContainer width="100%" height={200}><ComposedChart data={tData} margin={{top:10,right:10,bottom:5,left:20}}><CartesianGrid strokeDasharray="3 3" stroke="#eee"/><XAxis dataKey="year" tick={{fontSize:11,fontFamily:SANS}} label={{value:"Census Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/><YAxis tick={{fontSize:10,fontFamily:SANS}} tickFormatter={v=>v>=1000?(v/1000).toFixed(0)+"K":v}/><Tooltip/><ReferenceLine y={CT[tm].to} stroke={LIGHT} strokeDasharray="6 3" strokeWidth={1.5}/><Area type="monotone" dataKey="v" fill={INK} fillOpacity={0.03} stroke="none"/><Line type="monotone" dataKey="v" stroke={INK} strokeWidth={2} dot={{r:4,fill:"#fff",stroke:INK,strokeWidth:2}}/></ComposedChart></ResponsiveContainer>
              </div>
              <Section title="Housing Stock by Type, 2021 Census" sub="Dwelling type distribution from Statistics Canada. Woodbine Corridor has a higher share of single/semi-detached homes than the city average."/>
              <div className="bg-white border border-gray-200 p-6"><div className="flex items-center gap-8"><div className="w-36 h-36"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={HM} dataKey="value" cx="50%" cy="50%" outerRadius={55} innerRadius={25}>{HM.map((_,i)=><Cell key={i} fill={PAL[i]}/>)}</Pie></PieChart></ResponsiveContainer></div><div className="flex-1 space-y-2">{HM.map((h,i)=><div key={i} className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-sm" style={{background:PAL[i]}}/><span className="text-xs text-gray-600 flex-1">{h.name}</span><span className="text-xs font-semibold text-gray-900">{h.value}%</span></div>)}</div></div></div>
            </div>}

            {tab==="environment"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Nature</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Parks & Green Space</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Eight parks spanning 32 hectares give the neighbourhood 60% more green space per capita than a typical Toronto neighbourhood. Tree canopy matches the citywide average at 28%, against a council target of 40%. The neighbourhood benefits from proximity to Taylor-Massey Creek ravine system, providing trail access that connects to the broader Don River valley network.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">What These Metrics Measure</p>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Green Space Coverage (18%)</p><p className="text-xs text-gray-500 mt-0.5">Percentage of total neighbourhood land area classified as parkland, ravine, or natural area. Sourced from City of Toronto Parks, Forestry & Recreation. The 2% increase since 2018 reflects the reclassification of Taylor-Massey corridor lands as protected green space.</p></div>
                  <div className="py-2"><p className="text-sm text-gray-900 font-medium">Tree Canopy (28%)</p><p className="text-xs text-gray-500 mt-0.5">Measured by Toronto’s Urban Forest Study using LiDAR data. The city target is 40%. Woodbine’s mature residential streets maintain strong canopy, but emerald ash borer has removed approximately 200 ash trees since 2017, partially offset by the City’s replanting program.</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={TreePine} label="Parks" value="8" cagr={0} cagrPeriod="no change" cityAvg="5"/>
                <Metric icon={TreePine} label="Green Space Coverage" value="18%" cagr={2} cagrPeriod="2018–2024" cityAvg="13%"/>
                <Metric icon={TreePine} label="Tree Canopy" value="28%" cagr={1} cagrPeriod="2018–2024" cityAvg="28%"/>
                <Metric icon={TreePine} label="Total Park Area" value="32.1 ha" cagr={null} cityAvg="~20 ha"/>
                <Metric icon={TreePine} label="Green Roofs" value="4" cagr={null} cityAvg="3"/>
                <Metric icon={Shield} label="Basement Flood Risk" value="8%" cagr={null} cagrPeriod="Probability based on infrastructure + terrain" cityAvg="15%"/>
              </div>
              <Section title="Parks & Facilities"/>
              {[{n:"Woodbine Park",a:"10.2 ha",f:"Playground, sports fields, splash pad, off-leash area"},{n:"Stan Wadlow Park",a:"14.0 ha",f:"Community centre, outdoor pool, arena, baseball diamonds"},{n:"Monarch Park",a:"3.1 ha",f:"Tennis courts, wading pool, playground"},{n:"Ted Reeve Arena Park",a:"2.8 ha",f:"Arena, playground"}].map((p,i)=><div key={i} className="py-4 border-b border-gray-200"><h3 style={{fontFamily:SERIF}} className="text-lg text-gray-900">{p.n}</h3><p className="text-xs text-gray-400 mt-0.5">{p.a} — {p.f}</p></div>)}
            </div>}


            {/* ══ HEALTH & WELLBEING ══ */}
            {tab==="health"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Health & Wellbeing</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Community Health</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Health outcomes in Woodbine Corridor are above the Toronto average. Premature mortality at 195 per 100,000 is well below the city rate of 250. Diabetes prevalence at 7.8% is lower than average, reflecting higher income and better food access. 91% of residents are enrolled with a family doctor, and food insecurity at 8.2% is significantly below the city norm.</Lede>

              <Section title="What These Metrics Measure" sub="Sources: Ontario Community Health Profiles Partnership (OCHPP), Canadian Community Health Survey, Wellbeing Toronto."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="space-y-4">
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Premature Mortality (195 per 100K vs city avg 250)</p><p className="text-xs text-gray-500 mt-1">Deaths before age 75 per 100,000 population. The single strongest indicator of neighbourhood health equity. Driven by chronic disease, injury, and access to care. Woodbine’s lower rate reflects its higher income, better food access, and strong primary care enrolment.</p></div>
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Diabetes Prevalence (7.8% vs city avg 10%)</p><p className="text-xs text-gray-500 mt-1">Age-standardized rate of diagnosed diabetes among adults. Higher rates correlate with lower income, food access, and built environment factors. The neighbourhood’s walkability (score 82) and grocery density (8 stores) contribute to the lower rate.</p></div>
                  <div className="py-3 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Family Doctor Access (91% vs city avg 85%)</p><p className="text-xs text-gray-500 mt-1">Percentage of residents enrolled with a primary care physician. A key measure of healthcare access. Higher enrolment means better chronic disease management and lower ER utilization.</p></div>
                  <div className="py-3"><p className="text-sm text-gray-900 font-medium">Food Insecurity (8.2% vs city avg 12%)</p><p className="text-xs text-gray-500 mt-1">Percentage of households reporting inadequate access to food due to financial constraints. Strongly correlated with the neighbourhood’s poverty rate (9.5%) and grocery store density.</p></div>
                </div>
              </div>

              <Section title="Key Indicators"/>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Shield} label="Premature Mortality" value="195/100K" cagr={null} cityAvg="250"/>
                <Metric icon={Shield} label="Diabetes Prevalence" value="7.8%" cagr={null} cityAvg="10%"/>
                <Metric icon={Users} label="Family Doctor Access" value="91%" cagr={null} cityAvg="85%"/>
                <Metric icon={Users} label="Food Insecurity" value="8.2%" cagr={null} cityAvg="12%" border={false}/>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Health data sourced from Ontario Community Health Profiles Partnership (OCHPP), Toronto Health Profiles, Canadian Community Health Survey (CCHS), and Wellbeing Toronto. Rates are age-standardized where applicable. For premature mortality, diabetes, and food insecurity, lower values indicate better outcomes.</p>
              </div>
            </div>}

            {tab==="business"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Business</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Commerce & Dining</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>The Danforth corridor through Woodbine is a thriving commercial strip with 285 active business licences and net growth of +16 in the past year. The food scene includes 68 restaurants with DineSafe pass rates above average. The strip benefits from high foot traffic generated by Woodbine subway station (8,200 daily riders) and a loyal residential catchment with above-average spending power.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-3">What’s Driving Business Growth</p>
                <div className="space-y-3">
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Net +16 Businesses (2024)</p><p className="text-xs text-gray-500 mt-0.5">22 new licences issued against 6 closures. New openings concentrated in food service (4 restaurants, 3 cafés), health & wellness (2 studios, 1 clinic), and professional services (3 offices). The post-pandemic recovery of Danforth’s retail strip is now exceeding 2019 levels.</p></div>
                  <div className="py-2 border-b border-gray-100"><p className="text-sm text-gray-900 font-medium">Cuisine Diversity</p><p className="text-xs text-gray-500 mt-0.5">While “Greektown” branding persists from the western Danforth, Woodbine’s stretch has diversified significantly. Italian and Thai/Vietnamese now lead, with Indian, Japanese, and fusion restaurants growing fastest. The area is establishing itself as a distinct food destination from the Pape–Chester Greek core.</p></div>
                  <div className="py-2"><p className="text-sm text-gray-900 font-medium">Vacancy Rate</p><p className="text-xs text-gray-500 mt-0.5">Street-level retail vacancy along the Danforth between Woodbine and Main is estimated at 4–5%, well below the Toronto average of 8–9%. The tight vacancy reflects strong demand from independent operators and the neighbourhood’s growing residential density.</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8">
                <Metric icon={Building2} label="Active Business Licences" value="285" cagr={6} cagrPeriod="2023–2024" cityAvg="320"/>
                <Metric icon={TrendingUp} label="Net Growth (12 mo)" value="+16" cagr={null}/>
                <Metric icon={Utensils} label="Restaurants" value="68" cagr={12} cagrPeriod="2022–2024" cityAvg="52"/>
                <Metric icon={Utensils} label="Cafés" value="14" cagr={27} cagrPeriod="2020–2024" cityAvg="10"/>
                <Metric icon={Building2} label="Business Improvement Area" value="Yes" cagr={null} cagrPeriod="Danforth Village BIA — dedicated programming and streetscaping"/>
              </div>
              <Section title="Restaurant Cuisine Mix, 2024" sub="68 restaurants by primary cuisine type. Source: City of Toronto business licences and DineSafe."/>
              <div className="bg-white border border-gray-200 p-6 mb-8"><ResponsiveContainer width="100%" height={180}><BarChart data={[{n:"Italian",c:12},{n:"Thai / Vietnamese",c:10},{n:"Indian",c:8},{n:"Greek",c:8},{n:"Japanese",c:7},{n:"Other",c:23}]} layout="vertical" margin={{left:5}}><XAxis type="number" tick={{fontSize:10,fontFamily:SANS}}/><YAxis type="category" dataKey="n" tick={{fontSize:11,fontFamily:SANS}} width={100}/><Tooltip/><Bar dataKey="c" fill={INK} radius={[0,2,2,0]} barSize={14}/></BarChart></ResponsiveContainer></div>
              <Section title="311 Service Requests by Category, 2024" sub="Non-emergency requests to the City. Lower volume than citywide average indicates above-average infrastructure maintenance."/>
              {[{c:"Tree Maintenance",n:52,t:40},{c:"Graffiti",n:45,t:62},{c:"Noise Complaints",n:38,t:42},{c:"Parking",n:34,t:30},{c:"Potholes",n:28,t:35},{c:"Illegal Dumping",n:12,t:18}].map((s,i)=><div key={i} className="flex items-center py-2.5 border-b border-gray-100"><span className="text-xs text-gray-500 w-32">{s.c}</span><div className="flex-1 h-1 bg-gray-200 rounded-full"><div className="h-full rounded-full bg-gray-900" style={{width:Math.min(s.n/60*100,100)+"%"}}/></div><span className="text-xs font-semibold text-gray-900 w-8 text-right ml-3">{s.n}</span><span className="text-xs text-gray-400 w-16 text-right ml-2">avg {s.t}</span></div>)}
            </div>}

            
            {/* ══ HOMEBUYER CALCULATOR ══ */}
            {tab==="calculator"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Tools</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Homebuyer Calculator</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Estimate the true cost of purchasing a home in Woodbine Corridor. This calculator uses current Toronto tax rates, 2025 land transfer tax brackets, and neighbourhood-specific property tax assessments to give you a complete picture beyond the listing price.</Lede>

              {(()=>{
                const downAmt = calcPrice * calcDown / 100;
                const mortgage = calcPrice - downAmt;
                const monthlyPayment = calcMortgagePayment(mortgage, calcRate, calcAmort);
                const ontarioLTT = calcOntarioLTT(calcPrice);
                const torontoLTT = calcTorontoLTT(calcPrice);
                const totalLTT = ontarioLTT + torontoLTT;
                const firstTimeLTTRebate = Math.min(ontarioLTT, 4000) + Math.min(torontoLTT, 4475);
                const assessedValue = calcPrice * MPAC_RATIO;
                const annualPropertyTax = Math.round(assessedValue * PROPERTY_TAX_RATE);
                const monthlyPropertyTax = Math.round(annualPropertyTax / 12);
                const annualInsurance = Math.round(calcPrice * HOME_INSURANCE_RATE);
                const monthlyInsurance = Math.round(annualInsurance / 12);
                const monthlyWater = Math.round(ANNUAL_WATER / 12);
                const monthlyWaste = Math.round(ANNUAL_WASTE / 12);
                const totalMonthly = Math.round(monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyWater + monthlyWaste);
                const legalFees = 2000;
                const titleInsurance = 500;
                const inspectionCost = 500;
                const totalClosing = totalLTT + legalFees + titleInsurance + inspectionCost;
                const totalCash = downAmt + totalClosing;
                const cmhcApplies = calcDown < 20;
                const cmhcPremium = cmhcApplies ? Math.round(mortgage * (calcDown < 10 ? 0.04 : calcDown < 15 ? 0.031 : 0.028)) : 0;

                return (<div>
                  {/* INPUT CONTROLS */}
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Purchase Price</p>
                        <div className="flex items-center gap-3">
                          <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">${calcPrice.toLocaleString()}</p>
                        </div>
                        <input type="range" min={400000} max={3000000} step={25000} value={calcPrice} onChange={e=>setCalcPrice(Number(e.target.value))}
                          className="w-full mt-2 accent-gray-900" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$400K</span><span className="text-gray-600 font-medium">Neighbourhood median: $1.13M</span><span>$3M</span></div>
                      </div>
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Down Payment</p>
                        <div className="flex items-center gap-3">
                          <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{calcDown}%</p>
                          <p className="text-sm text-gray-400">(${downAmt.toLocaleString()})</p>
                        </div>
                        <input type="range" min={5} max={50} step={1} value={calcDown} onChange={e=>setCalcDown(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span>{cmhcApplies && <span className="text-red-700 font-medium">CMHC insurance required below 20%</span>}<span>50%</span></div>
                      </div>
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Interest Rate</p>
                        <div className="flex items-center gap-3">
                          <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{calcRate}%</p>
                        </div>
                        <input type="range" min={2.0} max={8.0} step={0.01} value={calcRate} onChange={e=>setCalcRate(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2.0%</span><span>8.0%</span></div>
                      </div>
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Amortization</p>
                        <div className="flex items-center gap-3">
                          <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{calcAmort} years</p>
                        </div>
                        <input type="range" min={10} max={30} step={5} value={calcAmort} onChange={e=>setCalcAmort(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>10 yr</span><span>30 yr</span></div>
                      </div>
                    </div>
                  </div>

                  {/* MONTHLY COSTS */}
                  <Section title="Monthly Carrying Cost"/>
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-200">
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">Total Monthly</p>
                        <p style={{fontFamily:SERIF}} className="text-5xl font-light text-gray-900">${totalMonthly.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">Annual</p>
                        <p style={{fontFamily:SERIF}} className="text-2xl text-gray-400">${(totalMonthly*12).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8">
                      <Metric label="Mortgage Payment" value={"$"+Math.round(monthlyPayment).toLocaleString()} cagr={null} cagrPeriod={mortgage.toLocaleString()+" principal"} border={true}/>
                      <Metric label="Property Tax" value={"$"+monthlyPropertyTax.toLocaleString()} cagr={null} cagrPeriod={"$"+annualPropertyTax.toLocaleString()+" / year"} border={true}/>
                      <Metric label="Home Insurance" value={"$"+monthlyInsurance.toLocaleString()} cagr={null} cagrPeriod={"$"+annualInsurance.toLocaleString()+" / year"} border={true}/>
                      <Metric label="Water & Sewer" value={"$"+monthlyWater} cagr={null} cagrPeriod={"$"+ANNUAL_WATER+" / year"} border={true}/>
                      <Metric label="Solid Waste" value={"$"+monthlyWaste} cagr={null} cagrPeriod={"$"+ANNUAL_WASTE+" / year"} border={true}/>
                      {cmhcApplies && <Metric label="CMHC Premium" value={"$"+Math.round(cmhcPremium/calcAmort/12).toLocaleString()+"/mo"} cagr={null} cagrPeriod={"$"+cmhcPremium.toLocaleString()+" total, added to mortgage"} border={true}/>}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="h-3 bg-gray-100 rounded-full flex overflow-hidden">
                        <div className="h-full bg-gray-900" style={{width:Math.round(monthlyPayment/totalMonthly*100)+"%"}} title="Mortgage"/>
                        <div className="h-full bg-gray-600" style={{width:Math.round(monthlyPropertyTax/totalMonthly*100)+"%"}} title="Property Tax"/>
                        <div className="h-full bg-gray-400" style={{width:Math.round(monthlyInsurance/totalMonthly*100)+"%"}} title="Insurance"/>
                        <div className="h-full bg-gray-300" style={{width:Math.round((monthlyWater+monthlyWaste)/totalMonthly*100)+"%"}} title="Utilities"/>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-900"/>Mortgage {Math.round(monthlyPayment/totalMonthly*100)}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-600"/>Tax {Math.round(monthlyPropertyTax/totalMonthly*100)}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-400"/>Insurance {Math.round(monthlyInsurance/totalMonthly*100)}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-300"/>Utilities {Math.round((monthlyWater+monthlyWaste)/totalMonthly*100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* CLOSING COSTS */}
                  <Section title="Closing Costs"/>
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="flex items-end justify-between mb-6 pb-6 border-b border-gray-200">
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">Total Cash Required at Closing</p>
                        <p style={{fontFamily:SERIF}} className="text-5xl font-light text-gray-900">${totalCash.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">Down Payment</p>
                        <p style={{fontFamily:SERIF}} className="text-2xl text-gray-400">${downAmt.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8">
                      <Metric label="Ontario Land Transfer Tax" value={"$"+ontarioLTT.toLocaleString()} cagr={null} cagrPeriod="Provincial" border={true}/>
                      <Metric label="Toronto Municipal LTT" value={"$"+torontoLTT.toLocaleString()} cagr={null} cagrPeriod="Toronto double-tax" border={true}/>
                      <Metric label="Total Land Transfer Tax" value={"$"+totalLTT.toLocaleString()} cagr={null} cagrPeriod="Combined provincial + municipal" border={true}/>
                      <Metric label="First-Time Buyer LTT Rebate" value={"−$"+firstTimeLTTRebate.toLocaleString()} cagr={null} cagrPeriod="If eligible (max $4,000 ON + $4,475 TO)" border={true}/>
                      <Metric label="Legal Fees (est.)" value={"$"+legalFees.toLocaleString()} cagr={null} cagrPeriod="Real estate lawyer" border={true}/>
                      <Metric label="Title Insurance" value={"$"+titleInsurance.toLocaleString()} cagr={null} border={true}/>
                      <Metric label="Home Inspection" value={"$"+inspectionCost.toLocaleString()} cagr={null} border={false}/>
                      {cmhcApplies && <Metric label="CMHC Insurance Premium" value={"$"+cmhcPremium.toLocaleString()} cagr={null} cagrPeriod="Added to mortgage balance" border={false}/>}
                    </div>
                  </div>

                  {/* PROPERTY TAX DETAIL */}
                  <Section title="Property Tax Breakdown" sub={"Based on MPAC assessed value of $"+assessedValue.toLocaleString()+" (2016 valuation, ~"+Math.round(MPAC_RATIO*100)+"% of current market)."}/>
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-2 gap-x-8">
                      <Metric label="Municipal Tax Rate" value="0.505%" cagr={null} cagrPeriod="City services: police, fire, transit, parks" border={true}/>
                      <Metric label="Education Tax Rate" value="0.153%" cagr={null} cagrPeriod="Set by Province of Ontario" border={true}/>
                      <Metric label="City Building Fund" value="0.008%" cagr={null} cagrPeriod="Transit and housing infrastructure" border={true}/>
                      <Metric label="Effective Combined Rate" value="0.666%" cagr={null} cagrPeriod="On MPAC assessed value" border={true}/>
                      <Metric label="Estimated Annual Tax" value={"$"+annualPropertyTax.toLocaleString()} cagr={null} cityAvg={"$"+(Math.round(930000*MPAC_RATIO*PROPERTY_TAX_RATE)).toLocaleString()} border={true}/>
                      <Metric label="Estimated Monthly Tax" value={"$"+monthlyPropertyTax.toLocaleString()} cagr={null} cityAvg={"$"+(Math.round(930000*MPAC_RATIO*PROPERTY_TAX_RATE/12)).toLocaleString()} border={false}/>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Toronto property taxes are based on MPAC’s 2016 assessed values, not current market prices. The province has frozen reassessments since 2016, so assessed values are approximately 40–50% of current market value. When reassessment resumes, rates will be adjusted to keep total revenue neutral, but individual bills may shift based on relative value changes.</p>
                    </div>
                  </div>

                  {/* AFFORDABILITY CONTEXT */}
                  <Section title="Affordability Context"/>
                  <div className="bg-white border border-gray-200 p-6">
                    <div className="grid grid-cols-2 gap-x-8">
                      <Metric label="Household Income Needed" value={"$"+(Math.round(totalMonthly*12/0.32/1000)*1000).toLocaleString()} cagr={null} cagrPeriod="At 32% GDS ratio" cityAvg={"$"+(Math.round(4200*12/0.32/1000)*1000).toLocaleString()} border={true}/>
                      <Metric label="Neighbourhood Median Income" value="$72,500" cagr={null} cagrPeriod="2021 Census" cityAvg="$65,000" border={true}/>
                      <Metric label="Price-to-Income Ratio" value={(calcPrice/72500).toFixed(1)+"x"} cagr={null} cagrPeriod="Purchase price ÷ median income" cityAvg={(930000/65000).toFixed(1)+"x"} border={true}/>
                      <Metric label="Stress Test Qualifying Rate" value="6.89%" cagr={null} cagrPeriod="Contract rate + 2% or 5.25%, whichever is higher" border={false}/>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Gross Debt Service (GDS) ratio should not exceed 32% for conventional mortgages. The stress test requires qualification at the higher of the contract rate plus 2% or the benchmark rate (currently 5.25%). This calculator is for estimation purposes only and does not constitute financial advice. Consult a licensed mortgage professional for your specific situation.</p>
                    </div>
                  </div>
                </div>);
              })()}
            </div>}


            {/* ══ WHAT CAN I AFFORD ══ */}
            {tab==="afford"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Tools</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">What Can I Afford?</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Enter your household income and see which Toronto neighbourhoods are within reach. The calculator applies the federal stress test, estimates property tax and utilities, and sorts all neighbourhoods into what you can comfortably afford, stretch to reach, or would need to keep saving for.</Lede>

              {(()=>{
                const stressRate = Math.max(affordRate + 2, 5.25);
                const maxGDS = 0.32;
                const monthlyGross = affordIncome / 12;
                const maxMonthlyHousing = monthlyGross * maxGDS;
                const maxMonthlyMortgage = maxMonthlyHousing * 0.75;
                const r = stressRate / 100 / 12;
                const n = 25 * 12;
                const maxMortgage = maxMonthlyMortgage * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
                const maxPrice = Math.round(maxMortgage / (1 - affordDown / 100));

                const sorted = [...HOODS_AFFORD].map(h => {
                  const ratio = h.med / maxPrice;
                  const tier = ratio <= 0.85 ? "comfortable" : ratio <= 1.1 ? "stretch" : "out";
                  return {...h, ratio, tier};
                }).sort((a, b) => a.med - b.med);

                const comfortable = sorted.filter(h => h.tier === "comfortable");
                const stretch = sorted.filter(h => h.tier === "stretch");
                const out = sorted.filter(h => h.tier === "out");

                return (<div>
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="grid grid-cols-3 gap-x-8">
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Household Income</p>
                        <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">${affordIncome.toLocaleString()}</p>
                        <input type="range" min={40000} max={400000} step={5000} value={affordIncome} onChange={e=>setAffordIncome(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$40K</span><span>$400K</span></div>
                      </div>
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Down Payment</p>
                        <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{affordDown}%</p>
                        <input type="range" min={5} max={50} step={1} value={affordDown} onChange={e=>setAffordDown(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>50%</span></div>
                      </div>
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Mortgage Rate</p>
                        <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{affordRate}%</p>
                        <input type="range" min={2.0} max={8.0} step={0.01} value={affordRate} onChange={e=>setAffordRate(Number(e.target.value))}
                          className="w-full mt-2" style={{accentColor:INK}}/>
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>2.0%</span><span>8.0%</span></div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-end justify-between">
                      <div>
                        <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">Maximum Purchase Price</p>
                        <p style={{fontFamily:SERIF}} className="text-5xl font-light text-gray-900">${maxPrice.toLocaleString()}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-gray-500">Stress test rate: {stressRate.toFixed(2)}%</p>
                        <p className="text-xs text-gray-500">Max monthly housing: ${Math.round(maxMonthlyHousing).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Based on 32% GDS, 25-year amortization</p>
                      </div>
                    </div>
                  </div>

                  {/* HEATMAP GRID */}
                  <Section title="Neighbourhood Affordability Map" sub={comfortable.length + " affordable, " + stretch.length + " stretch, " + out.length + " out of reach at your income."}/>
                  <div className="bg-white border border-gray-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {sorted.map(h => (
                        <div key={h.id}
                          className="relative group cursor-default"
                          style={{
                            width: "calc(10% - 6px)",
                            minWidth: 60,
                            paddingTop: 8,
                            paddingBottom: 8,
                            paddingLeft: 4,
                            paddingRight: 4,
                            borderRadius: 4,
                            background: h.tier === "comfortable" ? "#1a1a1a" : h.tier === "stretch" ? "#999" : "#e5e5e5",
                          }}>
                          <p className="text-center leading-tight" style={{fontFamily:SANS,fontSize:9,color:h.tier==="out"?"#999":"#fff",fontWeight:600}}>{h.name.length > 14 ? h.name.slice(0,12)+"…" : h.name}</p>
                          <p className="text-center" style={{fontFamily:SANS,fontSize:9,color:h.tier==="out"?"#bbb":"rgba(255,255,255,0.7)"}}>${(h.med/1000).toFixed(0)}K</p>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10" style={{fontFamily:SANS}}>
                            {h.name}: ${h.med.toLocaleString()} median
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-900"/>Comfortable</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{background:"#999"}}/>Stretch</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{background:"#e5e5e5"}}/>Out of reach</span>
                    </div>
                  </div>

                  {/* COMFORTABLE */}
                  {comfortable.length > 0 && <div>
                    <Section title={"Comfortable — " + comfortable.length + " neighbourhoods"} sub="Median home price is within 85% of your maximum. Room in the budget for life."/>
                    {comfortable.map((h,i) => {
                      const monthlyMtg = calcMortgagePayment(h.med * (1 - affordDown/100), affordRate, 25);
                      const monthlyAll = Math.round(monthlyMtg + h.med * MPAC_RATIO * PROPERTY_TAX_RATE / 12 + 200);
                      const pctIncome = Math.round(monthlyAll * 12 / affordIncome * 100);
                      return (
                        <div key={h.id} className="flex items-center py-4 border-b border-gray-100">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900 font-medium">{h.name}</p>
                            <p className="text-xs text-gray-400">~${monthlyAll.toLocaleString()}/mo all-in · {pctIncome}% of income · ${h.rent.toLocaleString()}/mo avg rent</p>
                          </div>
                          <div className="text-right">
                            <p style={{fontFamily:SERIF}} className="text-xl text-gray-900">${(h.med/1000).toFixed(0)}K</p>
                            <p className="text-xs text-gray-400">median</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>}

                  {/* STRETCH */}
                  {stretch.length > 0 && <div>
                    <Section title={"Stretch — " + stretch.length + " neighbourhoods"} sub="Between 85–110% of your max. Doable with trade-offs or a modest income increase."/>
                    {stretch.map((h,i) => {
                      const monthlyMtg = calcMortgagePayment(h.med * (1 - affordDown/100), affordRate, 25);
                      const monthlyAll = Math.round(monthlyMtg + h.med * MPAC_RATIO * PROPERTY_TAX_RATE / 12 + 200);
                      const pctIncome = Math.round(monthlyAll * 12 / affordIncome * 100);
                      const isWoodbine = h.id === 64;
                      return (
                        <div key={h.id} className={`flex items-center py-4 border-b border-gray-100 ${isWoodbine ? "bg-gray-50 -mx-2 px-2 rounded" : ""}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-900 font-medium">{h.name}</p>
                              {isWoodbine && <span className="text-xs text-gray-400 border border-gray-300 px-1.5 py-0.5 rounded">You are here</span>}
                            </div>
                            <p className="text-xs text-gray-400">~${monthlyAll.toLocaleString()}/mo all-in · {pctIncome}% of income · ${h.rent.toLocaleString()}/mo avg rent</p>
                          </div>
                          <div className="text-right">
                            <p style={{fontFamily:SERIF}} className="text-xl text-gray-900">${(h.med/1000).toFixed(0)}K</p>
                            <p className="text-xs text-gray-400">median</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>}

                  {/* OUT OF REACH */}
                  {out.length > 0 && <div>
                    <Section title={"Out of Reach — " + out.length + " neighbourhoods"} sub="Above 110% of your maximum. Would require more income, a larger down payment, or a co-buyer."/>
                    {out.slice(0, 8).map((h,i) => (
                      <div key={h.id} className="flex items-center py-3 border-b border-gray-100">
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">{h.name}</p>
                        </div>
                        <div className="text-right">
                          <p style={{fontFamily:SERIF}} className="text-xl text-gray-400">${(h.med/1000).toFixed(0)}K</p>
                        </div>
                      </div>
                    ))}
                    {out.length > 8 && <p className="text-xs text-gray-400 mt-2">+{out.length - 8} more neighbourhoods above your range.</p>}
                  </div>}

                  <div className="mt-8 py-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Affordability is calculated using the OSFI stress test (contract rate + 2% or 5.25%, whichever is higher), a 32% gross debt service ratio, 25-year amortization, and estimated property tax and utility costs. Median home values are based on 2024 assessment data and recent transaction analysis. This is for estimation purposes only — consult a licensed mortgage professional for your specific situation.</p>
                  </div>
                </div>);
              })()}
            </div>}

            
            {tab==="rentvsbuy"&&<div>
              <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-3">Tools</p>
              <h1 style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 tracking-tight">Rent vs Buy</h1>
              <div className="w-12 h-px bg-gray-900 mt-4 mb-6"/>
              <Lede>Should you rent or buy in Woodbine Corridor? This tool compares the cumulative cost of both options over time, accounting for mortgage interest, property tax, maintenance, rent escalation, and the opportunity cost of your down payment.</Lede>

              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-3 gap-x-8">
                  <div>
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Monthly Rent</p>
                    <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">${rvbRent.toLocaleString()}</p>
                    <input type="range" min={1500} max={5000} step={100} value={rvbRent} onChange={e=>setRvbRent(Number(e.target.value))} className="w-full mt-2"/>
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>$1,500</span><span className="text-gray-600 font-medium">Neighbourhood avg: $2,600</span><span>$5,000</span></div>
                  </div>
                  <div>
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Annual Rent Increase</p>
                    <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{rvbGrowth}%</p>
                    <input type="range" min={0} max={8} step={0.5} value={rvbGrowth} onChange={e=>setRvbGrowth(Number(e.target.value))} className="w-full mt-2"/>
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>0%</span><span className="text-gray-600 font-medium">ON guideline: 2.5%</span><span>8%</span></div>
                  </div>
                  <div>
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-2">Time Horizon</p>
                    <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{rvbYears} years</p>
                    <input type="range" min={1} max={25} step={1} value={rvbYears} onChange={e=>setRvbYears(Number(e.target.value))} className="w-full mt-2"/>
                    <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 yr</span><span>25 yr</span></div>
                  </div>
                </div>
              </div>

              <Section title="Monthly Cost Comparison"/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-2 gap-x-12">
                  <div>
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">If You Rent</p>
                    <p style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 mb-4">${rvbRent.toLocaleString()}<span className="text-lg text-gray-400">/mo</span></p>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Monthly rent (today)</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">${rvbRent.toLocaleString()}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Rent in year {rvbYears}</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">${Math.round(rvbRent*Math.pow(1+rvbGrowth/100,rvbYears)).toLocaleString()}</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Renter’s insurance</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">$35</span></div>
                      <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Maintenance</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-400">$0 (landlord)</span></div>
                    </div>
                  </div>
                  <div>
                    <p style={{fontFamily:SANS}} className="text-xs tracking-widest uppercase text-gray-400 mb-1">If You Buy at $1.13M</p>
                    <p style={{fontFamily:SERIF}} className="text-4xl font-light text-gray-900 mb-4">$5,820<span className="text-lg text-gray-400">/mo</span></p>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Mortgage (20% down, 4.89%)</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">$5,183</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Property tax</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">$280</span></div>
                      <div className="flex justify-between py-2 border-b border-gray-100"><span className="text-sm text-gray-500">Home insurance</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">$330</span></div>
                      <div className="flex justify-between py-2"><span className="text-sm text-gray-500">Maintenance (1%/yr)</span><span style={{fontFamily:SERIF}} className="text-sm text-gray-900">$940</span></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div><p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Monthly Premium to Buy</p><p style={{fontFamily:SERIF}} className="text-2xl text-gray-900">+${(5820-rvbRent).toLocaleString()}/mo</p></div>
                    <div className="text-right"><p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Extra Annual Cost</p><p style={{fontFamily:SERIF}} className="text-2xl text-gray-400">${((5820-rvbRent)*12).toLocaleString()}/yr</p></div>
                  </div>
                </div>
              </div>

              <Section title={"Cumulative Cost of Renting vs Buying Over "+rvbYears+" Years"} sub="Rent cost includes annual escalation. Buy cost includes mortgage, property tax, insurance, and maintenance at 1% of home value per year."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={Array.from({length:Math.min(rvbYears,25)},(_,i)=>{
                    const y=i+1;
                    const rentCum=Array.from({length:y},(_,j)=>rvbRent*12*Math.pow(1+rvbGrowth/100,j)).reduce((a,b)=>a+b,0);
                    const buyCum=5820*12*y;
                    return {year:y,rent:Math.round(rentCum/1000),buy:Math.round(buyCum/1000)};
                  })} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee"/>
                    <XAxis dataKey="year" tick={{fontSize:11,fontFamily:SANS}} label={{value:"Year",position:"insideBottom",offset:-2,fontSize:10,fill:"#999"}}/>
                    <YAxis tick={{fontSize:10,fontFamily:SANS}} tickFormatter={v=>"$"+v+"K"}/>
                    <Tooltip formatter={v=>"$"+v+"K"}/>
                    <Bar dataKey="rent" name="Total Rent" fill="#999" radius={[2,2,0,0]}/>
                    <Bar dataKey="buy" name="Total Buy" fill={INK} radius={[2,2,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-3">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{background:"#999"}}/>Cumulative rent</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-gray-900"/>Cumulative buy (mortgage + tax + insurance + maintenance)</span>
                </div>
              </div>

              <Section title="The Hidden Equation" sub="What renting lets you do with the money you save."/>
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <div className="grid grid-cols-2 gap-x-8">
                  <Metric icon={Home} label="Down Payment Not Spent" value="$225,000" cagr={null} cagrPeriod="20% of $1.13M stays invested"/>
                  <Metric icon={TrendingUp} label={"Invested at 7% for "+rvbYears+" yr"} value={"$"+Math.round(225000*Math.pow(1.07,rvbYears)).toLocaleString()} cagr={null} cagrPeriod="S&P 500 historical avg"/>
                  <Metric icon={Home} label={"Closing Costs Saved"} value="$52,000" cagr={null} cagrPeriod="LTT + legal + inspection"/>
                  <Metric icon={TrendingUp} label="Monthly Savings Invested" value={"$"+Math.round((5820-rvbRent)*12*((Math.pow(1.07,rvbYears)-1)/0.07)).toLocaleString()} cagr={null} cagrPeriod={"$"+(5820-rvbRent).toLocaleString()+"/mo at 7% for "+rvbYears+" yr"} border={false}/>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200 flex items-end justify-between">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Total Renter Wealth (investments)</p>
                    <p style={{fontFamily:SERIF}} className="text-3xl font-light text-emerald-800">{"$"+Math.round(225000*Math.pow(1.07,rvbYears)+52000*Math.pow(1.07,rvbYears)+(5820-rvbRent)*12*((Math.pow(1.07,rvbYears)-1)/0.07)).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs tracking-widest uppercase text-gray-400 mb-1">Est. Home Equity (3% appreciation)</p>
                    <p style={{fontFamily:SERIF}} className="text-3xl font-light text-gray-900">{"$"+Math.round(1125000*Math.pow(1.03,rvbYears)-900000*(1-rvbYears/25)).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Buy costs assume 20% down ($225K) on the neighbourhood median of $1.13M at 4.89% over 25 years. Property tax uses MPAC 2016 assessed values. Maintenance at 1% of home value annually. Renter investment assumes 7% annual return (S&P 500 long-term average). Home appreciation at 3% annually (Toronto 20-year average). This is for comparison purposes only and does not account for tax implications, rental income potential, or personal circumstances. Consult a financial advisor.</p>
              </div>
            </div>}


            {/* ══ BEST FOR ══ */}
            {tab==="overview"&&<div className="mt-10">
              <Section title="Best For" sub="Based on Woodbine Corridor’s data profile."/>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1.5 text-xs border border-gray-900 text-gray-900">Families</span>
                <span className="px-3 py-1.5 text-xs border border-gray-900 text-gray-900">Walkability</span>
                <span className="px-3 py-1.5 text-xs border border-gray-900 text-gray-900">Transit Commuters</span>
                <span className="px-3 py-1.5 text-xs border border-gray-900 text-gray-900">Foodies & Nightlife</span>
              </div>
            </div>}

            {/* ══ FAQ ══ */}
            {tab==="overview"&&<div className="mt-12">
              <Section title="Frequently Asked Questions" sub="Woodbine Corridor — answers based on the latest available data."/>
              {[
                {q:"Is Woodbine Corridor safe in 2026?",a:"Woodbine Corridor has 142 reported crime incidents, below the Toronto average of 176. Crime is trending down 8.3% year-over-year. Traffic KSI at 9, below the city average of 12. 6 shooting incidents. Overall, Woodbine Corridor is considered safer than average."},
                {q:"What are schools like in Woodbine Corridor?",a:"Schools rate 6.6/10 (Fraser Institute), above the city average of 6.0. 6 licensed daycares with 280 total spaces. School Readiness (EDI) at 74% meeting benchmarks (city avg: 68%). 5 playgrounds and 2 splash pads."},
                {q:"Is Woodbine Corridor good for families?",a:"8 grocery stores, 6 daycares (280 spaces), 5 playgrounds, 1 pool, 1 arena, 6 parks. Walk score 82, transit score 78. Average household size 2.6. EDI readiness above average."},
                {q:"How much do homes cost in Woodbine Corridor in 2026?",a:"Median home value $1,125K, above the Toronto average of $930K. Home values grew 42% (2016–2021). Ownership rate 58% vs city average 47%. Price-to-income ratio 12.5x."},
                {q:"Is Woodbine Corridor a good investment?",a:"Momentum score 118/200 (above average). Pipeline: 285 units, permits up 22% YoY. Projected 3,200 additional units by 2051. Net business growth +8 (12 months). Danforth Village BIA active."},
              ].map((item,i)=>(
                <details key={i} style={{borderBottom:"1px solid #eee"}}>
                  <summary style={{padding:"16px 0",fontSize:15,fontWeight:500,color:"#1a1a1a",cursor:"pointer",listStyle:"none",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    {item.q}<span style={{color:"#999",fontSize:18,flexShrink:0,marginLeft:12}}>+</span>
                  </summary>
                  <p style={{padding:"0 0 16px",fontSize:14,color:"#666",lineHeight:1.7,margin:0}}>{item.a}</p>
                </details>
              ))}
            </div>}

            {/* ══ TOP 5 COMPARABLE ══ */}
            {tab==="overview"&&<div className="mt-12">
              <Section title="Top 5 Comparable Neighbourhoods" sub="Similar to Woodbine Corridor in home value, walkability, and family profile."/>
              {[
                {name:"Greenwood-Coxwell",slug:"greenwood-coxwell",id:65,hv:"$1,080K",ws:79,sch:"6.4/10",pop:"14,200"},
                {name:"The Beaches",slug:"the-beaches",id:63,hv:"$1,450K",ws:85,sch:"7.1/10",pop:"21,400"},
                {name:"East End-Danforth",slug:"east-end-danforth",id:62,hv:"$1,050K",ws:80,sch:"6.3/10",pop:"16,800"},
                {name:"South Riverdale",slug:"south-riverdale",id:69,hv:"$1,350K",ws:84,sch:"6.8/10",pop:"19,200"},
                {name:"Danforth",slug:"danforth",id:59,hv:"$980K",ws:86,sch:"6.5/10",pop:"15,100"},
              ].map(c=>(
                <a key={c.id} href={"/toronto/"+c.slug} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:"1px solid #f0f0f0",textDecoration:"none",color:"#1a1a1a"}}>
                  <div>
                    <p style={{fontSize:15,fontWeight:500,margin:0}}>{c.name}</p>
                    <p style={{fontSize:12,color:"#999",margin:"2px 0 0"}}>#{c.id} · Walk {c.ws} · Schools {c.sch}</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <p style={{fontFamily:SERIF,fontSize:18,margin:0}}>{c.hv}</p>
                    <p style={{fontSize:11,color:"#999",margin:"2px 0 0"}}>{c.pop} pop</p>
                  </div>
                </a>
              ))}
            </div>}

                        <div className="mt-16 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">Growth rates use the most recent comparable period available. City averages reflect Toronto-wide figures from the same reporting period. Sources: Toronto Open Data, Toronto Police Service, Statistics Canada Census 2006–2021, Fraser Institute, RentSafeTO, DineSafe, 311, Bike Share Toronto, Vision Zero.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
