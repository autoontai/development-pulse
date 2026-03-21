"use client";
import React, { useState } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend
} from "recharts";
import neighbourhoods from "../../data/neighbourhoods";
import hoodData from "../../data/hoodData";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";
const COLORS = ["#1a1a1a", "#888", "#ccc"];

const CA = { pop:19540, inc:65000, hv:930000, crime:176, ws:61, ts:65, bk:3.1, pk:55,
  parks:5, groc:6, coffee:10, rest:52, lib:1.5, dc:4, sch:6.0, play:4,
  splash:2, pool:1, arena:1, rs:79, gp:13, tc:28, biz:320, dine:92.1,
  r311:260, ksi:12, own:47, bach:38, unemp:7.2, trComm:37 };

function Sec({ title, sub }) {
  return (
    <div style={{ marginTop: 56, marginBottom: 24 }}>
      <h2 style={{ fontFamily: SF, fontSize: 24, fontWeight: 300, color: INK }}>{title}</h2>
      {sub && <p style={{ fontFamily: SN, fontSize: 13, color: "#999", marginTop: 4 }}>{sub}</p>}
      <div style={{ width: 48, height: 1, background: INK, marginTop: 12 }} />
    </div>
  );
}

function CompareRow({ label, values, cityAvg, lowerIsBetter, unit }) {
  const nums = values.map(v => typeof v === "number" ? v : parseFloat(String(v).replace(/[$%,Kkm\/\s]/g, "")) || 0);
  const best = lowerIsBetter ? Math.min(...nums) : Math.max(...nums);

  return (
    <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${values.length}, 1fr) 100px`, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
      <p style={{ fontFamily: SN, fontSize: 12, color: "#666", margin: 0 }}>{label}</p>
      {values.map((v, i) => {
        const isBest = values.length > 1 && nums[i] === best;
        return (
          <div key={i} style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: SF, fontSize: 20, fontWeight: 300, margin: 0,
              color: isBest ? INK : "#999",
            }}>
              {v}{unit || ""}
            </p>
            {isBest && values.length > 1 && <div style={{ width: 6, height: 6, borderRadius: 3, background: INK, margin: "4px auto 0" }} />}
          </div>
        );
      })}
      <p style={{ fontFamily: SF, fontSize: 14, color: "#bbb", margin: 0, textAlign: "center" }}>{cityAvg}{unit || ""}</p>
    </div>
  );
}

function CompareHeader({ selected, hoodNames }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `180px repeat(${selected.length}, 1fr) 100px`, alignItems: "end", padding: "0 0 12px", borderBottom: "2px solid #e0e0e0", position: "sticky", top: 64, background: "#faf9f6", zIndex: 10 }}>
      <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: 0 }}>Metric</p>
      {hoodNames.map((name, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: COLORS[i], margin: "0 auto 6px" }} />
          <p style={{ fontFamily: SF, fontSize: 16, fontWeight: 400, color: INK, margin: 0 }}>{name}</p>
        </div>
      ))}
      <p style={{ fontFamily: SN, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#bbb", margin: 0, textAlign: "center" }}>City Avg</p>
    </div>
  );
}

export default function ComparePage() {
  const sorted = [...neighbourhoods].sort((a, b) => a.name.localeCompare(b.name));
  const [sel, setSel] = useState([64, 63]);

  const selData = sel.map(id => hoodData.find(d => d.id === id)).filter(Boolean);
  const selNames = sel.map(id => { const h = neighbourhoods.find(n => n.id === id); return h ? h.name : ""; });

  function handleChange(idx, newId) {
    const next = [...sel];
    next[idx] = Number(newId);
    setSel(next);
  }

  function addHood() {
    if (sel.length >= 3) return;
    const unused = sorted.find(n => !sel.includes(n.id));
    if (unused) setSel([...sel, unused.id]);
  }

  function removeHood(idx) {
    if (sel.length <= 2) return;
    setSel(sel.filter((_, i) => i !== idx));
  }

  const radarData = [
    { m: "Development", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.dH])), a: 100 },
    { m: "Family", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.fL])), a: 100 },
    { m: "Safety", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.sa])), a: 100 },
    { m: "Health", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.he])), a: 100 },
    { m: "Mobility", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.mo])), a: 100 },
    { m: "Nature", ...Object.fromEntries(selData.map((d, i) => ["v" + i, d.sc.na])), a: 100 },
  ];

  if (selData.length < 2) return <p>Loading...</p>;

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px" }}>

        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Tools</p>
        <h1 style={{ fontFamily: SF, fontSize: 42, fontWeight: 300, color: INK, margin: "0 0 16px", lineHeight: 1.1 }}>Compare Neighbourhoods</h1>
        <div style={{ width: 64, height: 1, background: INK, margin: "16px 0 24px" }} />
        <p style={{ fontFamily: SF, fontSize: 18, color: "#666", lineHeight: 1.6, maxWidth: 640, marginBottom: 32 }}>
          Side-by-side comparison of every metric across {sel.length} neighbourhoods, organized by category. The dot marks the strongest value in each row.
        </p>

        {/* SELECTORS */}
        <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap", alignItems: "flex-end" }}>
          {sel.map((id, i) => (
            <div key={i} style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: COLORS[i] }} />
                <p style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: 0 }}>Neighbourhood {i + 1}</p>
                {sel.length > 2 && <button onClick={() => removeHood(i)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#ccc", cursor: "pointer", fontSize: 16 }}>&times;</button>}
              </div>
              <select
                value={id}
                onChange={e => handleChange(i, e.target.value)}
                style={{ width: "100%", padding: "10px 12px", fontSize: 14, fontFamily: SN, border: "1px solid #ddd", background: "#fff", color: INK, cursor: "pointer" }}
              >
                {sorted.map(n => (
                  <option key={n.id} value={n.id}>{n.name} (#{n.id})</option>
                ))}
              </select>
            </div>
          ))}
          {sel.length < 3 && (
            <button onClick={addHood} style={{ padding: "10px 20px", fontSize: 13, fontFamily: SN, border: "1px dashed #ccc", background: "transparent", color: "#999", cursor: "pointer", height: 42, alignSelf: "flex-end" }}>+ Add third</button>
          )}
        </div>

        {/* RADAR OVERLAY */}
        <Sec title="Overall Index" sub="Category composite scores. 100 = Toronto average. Dashed ring = city baseline." />
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 24, marginBottom: 8 }}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="m" tick={{ fontSize: 11, fill: "#666", fontFamily: SN }} />
              <PolarRadiusAxis angle={90} domain={[0, 180]} tick={false} />
              <Radar dataKey="a" stroke="#ccc" strokeWidth={1.5} fill="transparent" strokeDasharray="4 3" />
              {selData.map((_, i) => (
                <Radar key={i} dataKey={"v" + i} name={selNames[i]} stroke={COLORS[i]} strokeWidth={2} fill={COLORS[i]} fillOpacity={0.05 - i * 0.015} strokeDasharray={i > 0 ? "6 3" : undefined} />
              ))}
              <Legend wrapperStyle={{ fontSize: 12, fontFamily: SN }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY SCORES */}
        <Sec title="Category Scores" sub="Composite index per category. Higher = better." />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Development & Housing" values={selData.map(d => d.sc.dH)} cityAvg={100} />
        <CompareRow label="Family & Daily Life" values={selData.map(d => d.sc.fL)} cityAvg={100} />
        <CompareRow label="Safety & Wellbeing" values={selData.map(d => d.sc.sa)} cityAvg={100} />
        <CompareRow label="Mobility & Access" values={selData.map(d => d.sc.mo)} cityAvg={100} />
        <CompareRow label="Health & Wellbeing" values={selData.map(d => d.sc.he)} cityAvg={100} />
        <CompareRow label="Nature & Community" values={selData.map(d => d.sc.na)} cityAvg={100} />
        <CompareRow label="Momentum Score" values={selData.map(d => d.mom)} cityAvg={100} />

        {/* DEVELOPMENT */}
        <Sec title="Development & Housing" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Pipeline Units" values={selData.map(d => d.pipe)} cityAvg={210} />
        <CompareRow label="Building Permits" values={selData.map(d => d.perm)} cityAvg={15} />
        <CompareRow label="Permit Growth" values={selData.map(d => (d.permC > 0 ? "+" : "") + d.permC + "%")} cityAvg="—" />
        <CompareRow label="Median Home Value" values={selData.map(d => "$" + (d.hv / 1000).toFixed(0) + "K")} cityAvg={"$" + (CA.hv / 1000).toFixed(0) + "K"} />
        <CompareRow label="Home Value Growth" values={selData.map(d => "+" + d.hvC + "%")} cityAvg="—" />
        <CompareRow label="Owner-Occupied" values={selData.map(d => d.own + "%")} cityAvg={CA.own + "%"} />
        <CompareRow label="RentSafe Score" values={selData.map(d => d.rs)} cityAvg={CA.rs} unit="/100" />

        {/* FAMILY */}
        <Sec title="Family & Daily Life" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Grocery Stores" values={selData.map(d => d.groc)} cityAvg={CA.groc} />
        <CompareRow label="Coffee Shops" values={selData.map(d => d.coffee)} cityAvg={CA.coffee} />
        <CompareRow label="Restaurants" values={selData.map(d => d.rest)} cityAvg={CA.rest} />
        <CompareRow label="Libraries" values={selData.map(d => d.lib)} cityAvg={CA.lib} />
        <CompareRow label="School Rating" values={selData.map(d => d.sch)} cityAvg={CA.sch} unit="/10" />
        <CompareRow label="Licensed Daycares" values={selData.map(d => d.dc)} cityAvg={CA.dc} />
        <CompareRow label="Playgrounds" values={selData.map(d => d.play)} cityAvg={CA.play} />
        <CompareRow label="Splash Pads" values={selData.map(d => d.splash)} cityAvg={CA.splash} />
        <CompareRow label="Pools" values={selData.map(d => d.pool)} cityAvg={CA.pool} />
        <CompareRow label="Arenas" values={selData.map(d => d.arena)} cityAvg={CA.arena} />
        <CompareRow label="Walk Score" values={selData.map(d => d.ws)} cityAvg={CA.ws} />
        <CompareRow label="Transit Score" values={selData.map(d => d.ts)} cityAvg={CA.ts} />
        <CompareRow label="Bike Infrastructure" values={selData.map(d => d.bk)} cityAvg={CA.bk} unit=" km" />
        <CompareRow label="Parking Ease" values={selData.map(d => d.pk)} cityAvg={CA.pk} unit="/100" />

        {/* SAFETY */}
        <Sec title="Safety & Wellbeing" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Crime Incidents" values={selData.map(d => d.crime)} cityAvg={CA.crime} lowerIsBetter />
        <CompareRow label="Crime Trend (YoY)" values={selData.map(d => (d.crimeC > 0 ? "+" : "") + d.crimeC + "%")} cityAvg="—" lowerIsBetter />
        <CompareRow label="Traffic KSI" values={selData.map(d => d.ksi)} cityAvg={CA.ksi} lowerIsBetter />
        <CompareRow label="DineSafe Pass Rate" values={selData.map(d => d.dine)} cityAvg={CA.dine} unit="%" />
        <CompareRow label="311 Requests" values={selData.map(d => d.r311)} cityAvg={CA.r311} lowerIsBetter />
        <CompareRow label="RentSafe Score" values={selData.map(d => d.rs)} cityAvg={CA.rs} unit="/100" />

        {/* DEMOGRAPHICS */}
        <Sec title="Demographics" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Population" values={selData.map(d => d.pop.toLocaleString())} cityAvg={CA.pop.toLocaleString()} />
        <CompareRow label="Pop. Growth" values={selData.map(d => (d.popC > 0 ? "+" : "") + d.popC + "%")} cityAvg="—" />
        <CompareRow label="Median Income" values={selData.map(d => "$" + (d.inc / 1000).toFixed(0) + "K")} cityAvg={"$" + (CA.inc / 1000).toFixed(0) + "K"} />
        <CompareRow label="Income Growth" values={selData.map(d => "+" + d.incC + "%")} cityAvg="—" />
        <CompareRow label="Bachelor's+" values={selData.map(d => d.bach)} cityAvg={CA.bach} unit="%" />
        <CompareRow label="Unemployment" values={selData.map(d => d.unemp)} cityAvg={CA.unemp} unit="%" lowerIsBetter />
        <CompareRow label="Transit Commuters" values={selData.map(d => d.trComm)} cityAvg={CA.trComm} unit="%" />

        {/* NATURE */}
        <Sec title="Health & Wellbeing" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Premature Mortality" values={selData.map(d => d.premMort)} cityAvg={250} unit="/100K" lowerIsBetter />
        <CompareRow label="Diabetes Rate" values={selData.map(d => d.diabetes)} cityAvg={10} unit="%" lowerIsBetter />
        <CompareRow label="Family Doctor Access" values={selData.map(d => d.famDoc)} cityAvg={85} unit="%" />
        <CompareRow label="Food Insecurity" values={selData.map(d => d.foodInsec)} cityAvg={12} unit="%" lowerIsBetter />

        <Sec title="Nature & Green Space" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Parks" values={selData.map(d => d.parks)} cityAvg={CA.parks} />
        <CompareRow label="Green Space" values={selData.map(d => d.gp)} cityAvg={CA.gp} unit="%" />
        <CompareRow label="Tree Canopy" values={selData.map(d => d.tc)} cityAvg={CA.tc} unit="%" />

        {/* BUSINESS */}
        <Sec title="Business & Commerce" />
        <CompareHeader selected={sel} hoodNames={selNames} />
        <CompareRow label="Active Businesses" values={selData.map(d => d.biz)} cityAvg={CA.biz} />
        <CompareRow label="Net Growth (12 mo)" values={selData.map(d => (d.bg > 0 ? "+" : "") + d.bg)} cityAvg="—" />
        <CompareRow label="Restaurants" values={selData.map(d => d.rest)} cityAvg={CA.rest} />
        <CompareRow label="Caf\u00e9s" values={selData.map(d => d.coffee)} cityAvg={CA.coffee} />
        <CompareRow label="DineSafe Pass" values={selData.map(d => d.dine)} cityAvg={CA.dine} unit="%" />

        {/* WINNER SUMMARY */}
        <Sec title="Summary" sub="Which neighbourhood leads in each category." />
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 24 }}>
          {[
            { cat: "Development & Housing", key: "dH" },
            { cat: "Family & Daily Life", key: "fL" },
            { cat: "Safety & Wellbeing", key: "sa" },
            { cat: "Mobility & Access", key: "mo" },
            { cat: "Nature & Community", key: "na" },
            { cat: "Health & Wellbeing", key: "he" },
            { cat: "Momentum", key: "mom" },
          ].map(({ cat, key }) => {
            const vals = key === "mom" ? selData.map(d => d.mom) : selData.map(d => d.sc[key] || 100);
            const maxVal = Math.max(...vals);
            const winnerIdx = vals.indexOf(maxVal);
            const isTie = vals.filter(v => v === maxVal).length > 1;
            return (
              <div key={cat} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 14, color: "#666", margin: 0, width: 200 }}>{cat}</p>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: isTie ? "#ccc" : COLORS[winnerIdx] }} />
                  <p style={{ fontFamily: SF, fontSize: 16, color: INK, margin: 0, fontWeight: 400 }}>
                    {isTie ? "Tie" : selNames[winnerIdx]}
                  </p>
                  <p style={{ fontFamily: SF, fontSize: 16, color: "#999", margin: 0 }}>
                    {maxVal}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 64, paddingTop: 24, borderTop: "1px solid #e0e0e0" }}>
          <p style={{ fontSize: 11, color: "#999", lineHeight: 1.8 }}>
            Sources: Toronto Open Data, Statistics Canada Census 2021, TPS, Fraser Institute, RentSafeTO, DineSafe, Vision Zero.
            The dot (&#x2022;) marks the leading value in each row. For safety metrics, lower is better.
            <br /><a href="/" style={{ color: INK, textDecoration: "underline" }}>&larr; Back to all neighbourhoods</a>
          </p>
        </div>
      </div>
    </div>
  );
}
