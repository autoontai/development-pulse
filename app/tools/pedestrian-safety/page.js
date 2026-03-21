"use client";
import React, { useState, useEffect, useRef } from "react";
import hoodData from "../../../data/hoodData";
import neighbourhoods from "../../../data/neighbourhoods";
import centroids from "../../../data/centroids";

const SF="'Cormorant Garamond','Georgia',serif";
const SN="'DM Sans',-apple-system,sans-serif";
const INK="#1a1a1a";

function getColor(ksi) {
  // Low KSI = green, high = red
  const norm = Math.min(1, ksi / 25);
  const r = Math.round(50 + norm * 205);
  const g = Math.round(180 - norm * 140);
  return `rgb(${r},${g},50)`;
}

export default function PedestrianSafetyMap() {
  const mapRef = useRef(null);
  const mapInst = useRef(null);
  const [addr, setAddr] = useState("");
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link"); link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    const loadMap = () => {
      if (!mapRef.current || mapInst.current) return;
      const L = window.L;
      const map = L.map(mapRef.current).setView([43.70, -79.40], 11);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; OSM &copy; CARTO', maxZoom: 16
      }).addTo(map);

      hoodData.forEach(d => {
        const c = centroids.find(x => x.id === d.id);
        const h = neighbourhoods.find(x => x.id === d.id);
        if (!c || !h) return;
        const pedInv = Math.round(d.ksi * 0.45); // est pedestrian involvement
        const cycInv = Math.round(d.ksi * 0.2);  // est cyclist involvement
        const safeScore = Math.max(0, Math.round(100 - d.ksi * 4.5));

        const circle = L.circleMarker([c.lat, c.lng], {
          radius: 6 + d.ksi * 0.5, fillColor: getColor(d.ksi), fillOpacity: 0.75,
          stroke: true, color: "#fff", weight: 1
        }).addTo(map);
        circle.bindPopup(`<div style="font-family:${SN};font-size:13px"><strong>${h.name}</strong><br/>KSI Collisions: ${d.ksi}<br/>Est. Pedestrian: ${pedInv}<br/>Est. Cyclist: ${cycInv}<br/>Safety Score: ${safeScore}/100<br/><a href="/toronto/${h.slug}">View Profile →</a></div>`);
        circle.on("click", () => setInfo({ name: h.name, ksi: d.ksi, ped: pedInv, cyc: cycInv, safe: safeScore, slug: h.slug }));
      });
      mapInst.current = map;
    };
    if (!window.L) {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      s.onload = loadMap; document.body.appendChild(s);
    } else loadMap();
  }, []);

  async function searchAddr() {
    if (!addr.trim()) return;
    const q = addr.includes("Toronto") ? addr : addr + ", Toronto, ON, Canada";
    const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&countrycodes=ca`);
    const d = await r.json();
    if (d.length && mapInst.current) mapInst.current.setView([d[0].lat, d[0].lon], 14, { animate: true });
  }

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Tools</p>
        <h1 style={{ fontFamily: SF, fontSize: 36, fontWeight: 300, color: INK, margin: "0 0 8px" }}>Pedestrian & Cyclist Safety Map</h1>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 24, maxWidth: 600 }}>
          Explore traffic collision risk across Toronto. Green = low KSI (killed or seriously injured). Red = high KSI. Based on Vision Zero data including pedestrian and cyclist involvement.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input type="text" value={addr} onChange={e => setAddr(e.target.value)} onKeyDown={e => e.key === "Enter" && searchAddr()}
            placeholder="Search address to zoom..." style={{ flex: 1, padding: "10px 14px", fontSize: 14, fontFamily: SN, border: "1px solid #ddd", background: "#fff" }} />
          <button onClick={searchAddr} style={{ padding: "10px 20px", fontSize: 13, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer" }}>Go</button>
        </div>
        <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: 7, background: getColor(3) }} /><span style={{ fontSize: 11, color: "#999" }}>Safe (low KSI)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: 7, background: getColor(12) }} /><span style={{ fontSize: 11, color: "#999" }}>Average</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 14, height: 14, borderRadius: 7, background: getColor(22) }} /><span style={{ fontSize: 11, color: "#999" }}>High risk</span></div>
        </div>
        <div ref={mapRef} style={{ width: "100%", height: 520, border: "1px solid #e0e0e0" }} />
        {info && (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 20, marginTop: 16 }}>
            <h3 style={{ fontFamily: SF, fontSize: 22, fontWeight: 300, margin: "0 0 8px" }}>{info.name}</h3>
            <p style={{ fontSize: 14, color: "#666", margin: 0 }}>KSI: {info.ksi} · Pedestrian: ~{info.ped} · Cyclist: ~{info.cyc} · Safety Score: {info.safe}/100 · <a href={"/toronto/" + info.slug} style={{ color: INK, textDecoration: "underline" }}>Full Profile →</a></p>
          </div>
        )}
        <p style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>Data: City of Toronto Vision Zero, Toronto Police Service. Pedestrian/cyclist breakdowns are estimated. City average: 12 KSI per neighbourhood.</p>
      </div>
    </div>
  );
}
