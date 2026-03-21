"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import neighbourhoods from "../data/neighbourhoods";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";

const ADDR_HINTS = [
  {kw:["danforth","woodbine","coxwell","greenwood"],ids:[64,62,65,60]},
  {kw:["queen east","leslieville","carlaw"],ids:[69,70]},
  {kw:["queen west","ossington","trinity"],ids:[81,84]},
  {kw:["bloor west","runnymede","high park"],ids:[90,87,88]},
  {kw:["yonge","eglinton","davisville"],ids:[100,99,104]},
  {kw:["king west","liberty","bathurst"],ids:[82,81]},
  {kw:["bay","college","university"],ids:[76,79,95]},
  {kw:["st clair","corso","dufferin"],ids:[93,94,107]},
  {kw:["lawrence","allen"],ids:[32,34,105]},
  {kw:["finch","steeles","jane finch"],ids:[24,25,116]},
  {kw:["kingston","beach"],ids:[63,64]},
  {kw:["scarborough","kennedy","brimley"],ids:[124,126,143]},
  {kw:["sheppard","don mills","bayview"],ids:[42,47,52]},
  {kw:["lakeshore","mimico","park lawn"],ids:[17,158]},
  {kw:["roncesvalles","roncy"],ids:[86,87]},
  {kw:["annex","spadina","harbord"],ids:[95,96]},
  {kw:["cabbagetown","parliament","regent"],ids:[72,73,74]},
  {kw:["junction","keele","stockyards"],ids:[89,92]},
  {kw:["waterfront","harbourfront"],ids:[77]},
  {kw:["forest hill"],ids:[101,102]},
  {kw:["rosedale","moore park","summerhill"],ids:[98]},
  {kw:["bridle path","york mills"],ids:[41]},
];

export default function Header() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => { setSel(-1); }, [q]);

  const results = useMemo(() => {
    if (!q.trim() || q.length < 2) return [];
    const lq = q.toLowerCase().trim();
    const nameM = neighbourhoods
      .filter(n => n.name.toLowerCase().includes(lq))
      .sort((a, b) => {
        const as = a.name.toLowerCase().startsWith(lq) ? 0 : 1;
        const bs = b.name.toLowerCase().startsWith(lq) ? 0 : 1;
        return as - bs || a.name.localeCompare(b.name);
      });
    const idM = /^\d+$/.test(lq) ? neighbourhoods.filter(n => String(n.id).startsWith(lq)) : [];
    const addrM = [];
    ADDR_HINTS.forEach(h => {
      if (h.kw.some(k => lq.includes(k) || k.includes(lq))) {
        h.ids.forEach(id => {
          const hood = neighbourhoods.find(n => n.id === id);
          if (hood && !nameM.find(m => m.id === id)) addrM.push(hood);
        });
      }
    });
    const seen = new Set();
    return [...nameM, ...idM, ...addrM].filter(n => { if (seen.has(n.id)) return false; seen.add(n.id); return true; }).slice(0, 8);
  }, [q]);

  const go = (h) => { setQ(""); setOpen(false); router.push(`/toronto/${h.slug}`); };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel(p => Math.min(p + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel(p => Math.max(p - 1, -1)); }
    else if (e.key === "Enter" && sel >= 0 && results[sel]) go(results[sel]);
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 32px", height: 64, display: "flex", alignItems: "center", gap: 24 }}>
      <a href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
        <img src="/logo.jpg" alt="Real Data IQ" style={{ height: 48, width: "auto", objectFit: "contain" }} />
      </a>
      <div style={{ height: 28, width: 1, background: "#e5e5e5", flexShrink: 0 }} />
      <div ref={ref} style={{ flex: 1, maxWidth: 520, position: "relative" }}>
        <input type="text" value={q} onChange={e => setQ(e.target.value)} onFocus={() => setOpen(true)} onKeyDown={onKey}
          placeholder="Search neighbourhood..."
          style={{ width: "100%", padding: "9px 16px 9px 36px", fontSize: 14, fontFamily: SN, border: "1px solid #e0e0e0", background: "#faf9f6", color: "#1a1a1a", outline: "none", borderRadius: 0, boxSizing: "border-box" }} />
        <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.35 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        {open && results.length > 0 && (
          <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #e0e0e0", borderTop: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.08)", zIndex: 200 }}>
            {results.map((h, i) => (
              <button key={h.id} onClick={() => go(h)} onMouseEnter={() => setSel(i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "12px 16px", border: "none", borderBottom: i < results.length - 1 ? "1px solid #f0f0f0" : "none", background: i === sel ? "#f5f5f0" : "#fff", cursor: "pointer", textAlign: "left", fontFamily: SN }}>
                <div>
                  <p style={{ fontSize: 14, color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{h.name}</p>
                  <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>#{h.id}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: SF, fontSize: 15, color: "#1a1a1a", margin: 0 }}>${(h.hv / 1000).toFixed(0)}K</p>
                  <p style={{ fontSize: 10, color: "#bbb", margin: 0 }}>median</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <p style={{ fontFamily: SN, fontSize: 11, color: "#bbb", margin: 0, flexShrink: 0, letterSpacing: "0.1em" }}>TORONTO &middot; 158 NEIGHBOURHOODS</p>
    </header>
  );
}
