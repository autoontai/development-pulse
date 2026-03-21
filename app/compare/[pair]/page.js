"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import comparePairs from "../../../data/comparePairs";
import neighbourhoods from "../../../data/neighbourhoods";
import hoodData from "../../../data/hoodData";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend
} from "recharts";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";
const COLORS = ["#1a1a1a", "#888"];

const CA = { pop:19540, inc:65000, hv:930000, crime:176, ws:61, ts:65, bk:3.1,
  parks:5, groc:6, coffee:10, rest:52, sch:6.0, dc:4, rs:79, gp:13, tc:28,
  biz:320, dine:92.1, r311:260, ksi:12, own:47, bach:38, unemp:7.2,
  premMort:250, diabetes:10, famDoc:85, foodInsec:12 };

function Row({ label, values, cityAvg, lowerIsBetter, unit }) {
  const nums = values.map(v => typeof v === "number" ? v : parseFloat(String(v).replace(/[$%,Kkm\/\s]/g, "")) || 0);
  const best = lowerIsBetter ? Math.min(...nums) : Math.max(...nums);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr 90px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
      <p style={{ fontSize: 12, color: "#666", margin: 0 }}>{label}</p>
      {values.map((v, i) => (
        <div key={i} style={{ textAlign: "center" }}>
          <p style={{ fontFamily: SF, fontSize: 18, fontWeight: 300, margin: 0, color: nums[i] === best && values.length > 1 ? INK : "#999" }}>{v}{unit || ""}</p>
          {nums[i] === best && values.length > 1 && <div style={{ width: 5, height: 5, borderRadius: 3, background: INK, margin: "3px auto 0" }} />}
        </div>
      ))}
      <p style={{ fontFamily: SF, fontSize: 13, color: "#bbb", margin: 0, textAlign: "center" }}>{cityAvg}{unit || ""}</p>
    </div>
  );
}

function Sec({ title }) {
  return <div style={{ marginTop: 48, marginBottom: 16 }}><h2 style={{ fontFamily: SF, fontSize: 22, fontWeight: 300, color: INK }}>{title}</h2><div style={{ width: 40, height: 1, background: INK, marginTop: 8 }} /></div>;
}

export default function PairComparePage() {
  const params = useParams();
  const match = comparePairs.find(p => p.slug === params.pair);

  if (!match) {
    return (<div style={{ padding: 80, textAlign: "center", fontFamily: SN }}><h1 style={{ fontFamily: SF, fontSize: 36, fontWeight: 300 }}>Comparison not found</h1><a href="/compare" style={{ color: INK }}>&larr; Compare neighbourhoods</a></div>);
  }

  const data = match.ids.map(id => hoodData.find(d => d.id === id)).filter(Boolean);
  const names = match.ids.map(id => { const h = neighbourhoods.find(n => n.id === id); return h ? h.name : ""; });

  if (data.length < 2) return <p style={{ padding: 80 }}>Loading...</p>;

  const radarD = [
    { m: "Development", a: data[0].sc.dH, b: data[1].sc.dH, c: 100 },
    { m: "Family", a: data[0].sc.fL, b: data[1].sc.fL, c: 100 },
    { m: "Safety", a: data[0].sc.sa, b: data[1].sc.sa, c: 100 },
    { m: "Health", a: data[0].sc.he, b: data[1].sc.he, c: 100 },
    { m: "Mobility", a: data[0].sc.mo, b: data[1].sc.mo, c: 100 },
    { m: "Nature", a: data[0].sc.na, b: data[1].sc.na, c: 100 },
  ];

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `Which is better, ${names[0]} or ${names[1]}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${names[0]} scores higher in ${radarD.filter(r => r.a > r.b).map(r => r.m).join(", ") || "no categories"}, while ${names[1]} leads in ${radarD.filter(r => r.b > r.a).map(r => r.m).join(", ") || "no categories"}. The best choice depends on your priorities.` }},
      { "@type": "Question", "name": `Is ${names[0]} safer than ${names[1]}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${names[0]} has ${data[0].crime} crime incidents vs ${data[1].crime} in ${names[1]}. The Toronto average is 176. ${data[0].crime < data[1].crime ? names[0] : names[1]} has the lower crime rate.` }},
      { "@type": "Question", "name": `Which has better schools, ${names[0]} or ${names[1]}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${names[0]} schools rate ${data[0].sch}/10 vs ${data[1].sch}/10 in ${names[1]}. The city average is 6.0/10.` }},
    ]
  };

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Neighbourhood Comparison</p>
        <h1 style={{ fontFamily: SF, fontSize: 38, fontWeight: 300, color: INK, margin: "0 0 8px", lineHeight: 1.15 }}>{match.title}</h1>
        <p style={{ fontFamily: SF, fontSize: 16, color: "#999", marginBottom: 8 }}>Toronto Neighbourhood Comparison 2026</p>
        <div style={{ width: 48, height: 1, background: INK, margin: "16px 0 32px" }} />

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 24, marginBottom: 32 }}>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarD} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <PolarGrid stroke="#e0e0e0" /><PolarAngleAxis dataKey="m" tick={{ fontSize: 11, fill: "#666" }} />
              <PolarRadiusAxis angle={90} domain={[0, 180]} tick={false} />
              <Radar dataKey="c" stroke="#ccc" strokeWidth={1.5} fill="transparent" strokeDasharray="4 3" />
              <Radar dataKey="a" name={names[0]} stroke={COLORS[0]} strokeWidth={2} fill={COLORS[0]} fillOpacity={0.06} />
              <Radar dataKey="b" name={names[1]} stroke={COLORS[1]} strokeWidth={2} fill={COLORS[1]} fillOpacity={0.04} strokeDasharray="6 3" />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <Sec title="Housing & Development" />
        <Row label="Median Home Value" values={data.map(d => "$"+(d.hv/1000).toFixed(0)+"K")} cityAvg={"$"+(CA.hv/1000).toFixed(0)+"K"} />
        <Row label="Pipeline Units" values={data.map(d => d.pipe)} cityAvg={210} />
        <Row label="Momentum Score" values={data.map(d => d.mom)} cityAvg={100} />
        <Row label="Owner-Occupied" values={data.map(d => d.own+"%")} cityAvg={CA.own+"%"} />

        <Sec title="Safety" />
        <Row label="Crime Incidents" values={data.map(d => d.crime)} cityAvg={CA.crime} lowerIsBetter />
        <Row label="Traffic KSI" values={data.map(d => d.ksi)} cityAvg={CA.ksi} lowerIsBetter />
        <Row label="Shootings" values={data.map(d => d.shoot)} cityAvg={14} lowerIsBetter />
        <Row label="RentSafe Score" values={data.map(d => d.rs)} cityAvg={CA.rs} unit="/100" />

        <Sec title="Family & Schools" />
        <Row label="School Rating" values={data.map(d => d.sch)} cityAvg={CA.sch} unit="/10" />
        <Row label="Walk Score" values={data.map(d => d.ws)} cityAvg={CA.ws} />
        <Row label="Transit Score" values={data.map(d => d.ts)} cityAvg={CA.ts} />
        <Row label="Daycares" values={data.map(d => d.dc)} cityAvg={CA.dc} />
        <Row label="Parks" values={data.map(d => d.parks)} cityAvg={CA.parks} />
        <Row label="Restaurants" values={data.map(d => d.rest)} cityAvg={CA.rest} />

        <Sec title="Health" />
        <Row label="Premature Mortality" values={data.map(d => d.premMort)} cityAvg={CA.premMort} unit="/100K" lowerIsBetter />
        <Row label="Family Doctor Access" values={data.map(d => d.famDoc+"%")} cityAvg={CA.famDoc+"%"} />
        <Row label="Food Insecurity" values={data.map(d => d.foodInsec+"%")} cityAvg={CA.foodInsec+"%"} lowerIsBetter />

        <Sec title="Demographics" />
        <Row label="Population" values={data.map(d => d.pop.toLocaleString())} cityAvg={CA.pop.toLocaleString()} />
        <Row label="Median Income" values={data.map(d => "$"+(d.inc/1000).toFixed(0)+"K")} cityAvg={"$"+(CA.inc/1000).toFixed(0)+"K"} />
        <Row label="Poverty Rate" values={data.map(d => d.pov+"%")} cityAvg="15%" lowerIsBetter />

        {/* VIEW FULL PROFILES */}
        <div style={{ marginTop: 48, display: "flex", gap: 12 }}>
          {match.ids.map((id, i) => {
            const h = neighbourhoods.find(n => n.id === id);
            return h ? <a key={id} href={"/toronto/" + h.slug} style={{ flex: 1, padding: 16, background: "#fff", border: "1px solid #e0e0e0", textDecoration: "none", textAlign: "center" }}><p style={{ fontFamily: SF, fontSize: 16, color: INK, margin: 0 }}>View {h.name} Full Profile &rarr;</p></a> : null;
          })}
        </div>

        <div style={{ marginTop: 48, borderTop: "1px solid #e0e0e0", paddingTop: 24 }}>
          <p style={{ fontSize: 11, color: "#999" }}>Sources: Toronto Open Data, Statistics Canada Census 2021, TPS, Fraser Institute, OCHPP. <a href="/compare" style={{ color: INK, textDecoration: "underline" }}>Compare other neighbourhoods &rarr;</a></p>
        </div>
      </div>
    </div>
  );
}
