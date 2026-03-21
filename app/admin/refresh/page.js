"use client";
import React, { useState } from "react";
import hoodData from "../../../data/hoodData";
import neighbourhoods from "../../../data/neighbourhoods";

const SN = "'DM Sans',-apple-system,sans-serif";
const SF = "'Cormorant Garamond','Georgia',serif";
const INK = "#1a1a1a";

function getName(id) {
  const h = neighbourhoods.find(n => n.id === id);
  return h ? h.name : "Unknown";
}
function getSlug(id) {
  const h = neighbourhoods.find(n => n.id === id);
  return h ? h.slug : "";
}

function generateRefresh() {
  const now = new Date();
  const monthName = now.toLocaleDateString("en-CA", { month: "long", year: "numeric" });

  // Top movers by momentum
  const topMom = [...hoodData].sort((a, b) => b.mom - a.mom).slice(0, 5);
  const botMom = [...hoodData].sort((a, b) => a.mom - b.mom).slice(0, 5);

  // Biggest crime drops
  const crimeDrops = [...hoodData].filter(h => h.crimeC < 0).sort((a, b) => a.crimeC - b.crimeC).slice(0, 5);
  const crimeRises = [...hoodData].filter(h => h.crimeC > 0).sort((a, b) => b.crimeC - a.crimeC).slice(0, 5);

  // Hottest permit activity
  const permitHot = [...hoodData].filter(h => h.permC > 0).sort((a, b) => b.permC - a.permC).slice(0, 5);

  // Most affordable with good schools
  const affordable = [...hoodData].filter(h => h.hv < 900000 && h.sch >= 7.0).sort((a, b) => a.hv - b.hv).slice(0, 5);

  const blogPost = `{
    slug: "monthly-refresh-${now.toISOString().slice(0, 7)}",
    title: "${monthName} Data Refresh: What Changed Across Toronto's 158 Neighbourhoods",
    date: "${now.toISOString().slice(0, 10)}",
    excerpt: "Monthly data refresh covering crime trajectory, development permits, momentum scores, and affordability shifts across all 158 Toronto neighbourhoods.",
    image: "/blog-safest.svg",
    imageAlt: "Toronto data refresh",
    readTime: "5 min read",
    body: \`
## ${monthName} Monthly Data Refresh

This month's refresh highlights the biggest movers across Toronto's 158 neighbourhoods — where crime is falling fastest, permits are accelerating, and momentum is building.

## Highest Momentum Neighbourhoods

${topMom.map((h, i) => `**${i + 1}. ${getName(h.id)}** — Momentum score ${h.mom}. Pipeline: ${h.pipe} units. Permits ${h.permC > 0 ? "+" : ""}${h.permC}% YoY. Crime: ${h.crime} (${h.crimeC > 0 ? "+" : ""}${h.crimeC}% YoY).`).join("\n\n")}

## Biggest Crime Drops

${crimeDrops.map((h, i) => `**${i + 1}. ${getName(h.id)}** — Crime down ${Math.abs(h.crimeC)}% year-over-year. Total incidents: ${h.crime}. Shootings: ${h.shoot}.`).join("\n\n")}

## Hottest Permit Activity

${permitHot.map((h, i) => `**${i + 1}. ${getName(h.id)}** — Permits up ${h.permC}% YoY. Pipeline: ${h.pipe} units. ${h.affPipe > 0 ? h.affPipe + " affordable units in pipeline." : ""}`).join("\n\n")}

## Best Value: Strong Schools Under $900K

${affordable.map((h, i) => `**${i + 1}. ${getName(h.id)}** — $${(h.hv / 1000).toFixed(0)}K median, schools ${h.sch}/10, walk score ${h.ws}, crime ${h.crime}.`).join("\n\n")}

## Neighbourhoods Losing Momentum

${botMom.map((h, i) => `**${i + 1}. ${getName(h.id)}** — Momentum score ${h.mom}. Crime trend ${h.crimeC > 0 ? "+" : ""}${h.crimeC}%. Permits ${h.permC > 0 ? "+" : ""}${h.permC}%.`).join("\n\n")}

All data sourced from Toronto Open Data, Toronto Police Service, Statistics Canada, and City of Toronto building permits. Visit realdataiq.com for the full profile of any neighbourhood.
\`,
  },`;

  const emailHtml = `<div style="font-family:-apple-system,sans-serif;max-width:600px;margin:0 auto;padding:40px 20px">
<h1 style="font-size:24px;font-weight:300;color:#1a1a1a">${monthName} Data Refresh</h1>
<div style="width:48px;height:1px;background:#1a1a1a;margin:16px 0 24px"></div>
<p style="font-size:15px;color:#555;line-height:1.7">Here's what changed across Toronto's 158 neighbourhoods this month.</p>

<h2 style="font-size:18px;color:#1a1a1a;margin-top:32px">Highest Momentum</h2>
${topMom.map((h, i) => `<p style="font-size:14px;color:#444;line-height:1.6;margin:8px 0"><strong>${i + 1}. ${getName(h.id)}</strong> — Score ${h.mom}. Pipeline ${h.pipe} units. Crime ${h.crimeC > 0 ? "+" : ""}${h.crimeC}%.</p>`).join("")}

<h2 style="font-size:18px;color:#1a1a1a;margin-top:32px">Biggest Crime Drops</h2>
${crimeDrops.map((h, i) => `<p style="font-size:14px;color:#444;line-height:1.6;margin:8px 0"><strong>${i + 1}. ${getName(h.id)}</strong> — Down ${Math.abs(h.crimeC)}%. Total: ${h.crime}.</p>`).join("")}

<h2 style="font-size:18px;color:#1a1a1a;margin-top:32px">Hottest Permits</h2>
${permitHot.map((h, i) => `<p style="font-size:14px;color:#444;line-height:1.6;margin:8px 0"><strong>${i + 1}. ${getName(h.id)}</strong> — Up ${h.permC}%. Pipeline: ${h.pipe} units.</p>`).join("")}

<h2 style="font-size:18px;color:#1a1a1a;margin-top:32px">Best Value (Schools 7+, Under $900K)</h2>
${affordable.map((h, i) => `<p style="font-size:14px;color:#444;line-height:1.6;margin:8px 0"><strong>${i + 1}. ${getName(h.id)}</strong> — $${(h.hv / 1000).toFixed(0)}K, schools ${h.sch}/10.</p>`).join("")}

<div style="margin-top:32px;padding-top:24px;border-top:1px solid #eee">
<p style="font-size:12px;color:#999">Real Data IQ — Neighbourhood intelligence for Toronto's 158 neighbourhoods.</p>
<p style="font-size:12px;color:#999"><a href="https://www.realdataiq.com" style="color:#1a1a1a">View full profiles at realdataiq.com</a></p>
</div>
</div>`;

  return { blogPost, emailHtml, monthName };
}

export default function AdminRefresh() {
  const [output, setOutput] = useState(null);
  const [copied, setCopied] = useState("");

  function generate() {
    setOutput(generateRefresh());
  }

  function copyText(text, label) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(""), 2000);
  }

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN, padding: "48px 32px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Admin</p>
        <h1 style={{ fontFamily: SF, fontSize: 36, fontWeight: 300, color: INK, margin: "0 0 16px" }}>Monthly Data Refresh Generator</h1>
        <div style={{ width: 48, height: 1, background: INK, margin: "16px 0 24px" }} />
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6, marginBottom: 32 }}>
          Click the button to generate this month's data refresh. You'll get two outputs: a blog post entry (paste into blogPosts.js) and an email HTML (paste into Resend).
        </p>

        <button onClick={generate} style={{ padding: "14px 28px", fontSize: 15, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", marginBottom: 32 }}>
          Generate {new Date().toLocaleDateString("en-CA", { month: "long", year: "numeric" })} Refresh
        </button>

        {output && (
          <div>
            {/* BLOG POST */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ fontFamily: SF, fontSize: 22, fontWeight: 300, color: INK, margin: 0 }}>1. Blog Post Entry</h2>
                <button onClick={() => copyText(output.blogPost, "blog")} style={{ padding: "6px 16px", fontSize: 12, fontFamily: SN, background: copied === "blog" ? "#15803d" : "#fff", color: copied === "blog" ? "#fff" : INK, border: "1px solid #e0e0e0", cursor: "pointer" }}>
                  {copied === "blog" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>Paste this into data/blogPosts.js (before the closing bracket), then push to GitHub.</p>
              <textarea readOnly value={output.blogPost} style={{ width: "100%", height: 300, padding: 12, fontSize: 12, fontFamily: "monospace", border: "1px solid #e0e0e0", background: "#fff", boxSizing: "border-box", resize: "vertical" }} />
            </div>

            {/* EMAIL */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <h2 style={{ fontFamily: SF, fontSize: 22, fontWeight: 300, color: INK, margin: 0 }}>2. Email HTML</h2>
                <button onClick={() => copyText(output.emailHtml, "email")} style={{ padding: "6px 16px", fontSize: 12, fontFamily: SN, background: copied === "email" ? "#15803d" : "#fff", color: copied === "email" ? "#fff" : INK, border: "1px solid #e0e0e0", cursor: "pointer" }}>
                  {copied === "email" ? "Copied!" : "Copy"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>Go to Resend → Emails → Send Broadcast → paste this HTML → select your audience → send.</p>
              <textarea readOnly value={output.emailHtml} style={{ width: "100%", height: 300, padding: 12, fontSize: 12, fontFamily: "monospace", border: "1px solid #e0e0e0", background: "#fff", boxSizing: "border-box", resize: "vertical" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
