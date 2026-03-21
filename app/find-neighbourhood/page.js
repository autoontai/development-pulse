"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import neighbourhoods from "../../data/neighbourhoods";
import centroids from "../../data/centroids";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";

function findNearest(lat, lng) {
  let best = null, bestDist = Infinity;
  centroids.forEach(c => {
    const d = Math.sqrt(Math.pow(lat - c.lat, 2) + Math.pow(lng - c.lng, 2));
    if (d < bestDist) { bestDist = d; best = c; }
  });
  return best ? neighbourhoods.find(n => n.id === best.id) : null;
}

export default function FindNeighbourhood() {
  const router = useRouter();
  const [addr, setAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);

  // Load Leaflet
  useEffect(() => {
    if (typeof window === "undefined") return;
    // CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    // JS
    if (!window.L) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  function initMap() {
    if (!mapRef.current || mapInstance.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true }).setView([43.70, -79.40], 11);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 18,
    }).addTo(map);
    mapInstance.current = map;
    setMapReady(true);
  }

  async function handleSearch() {
    if (!addr.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Geocode with Nominatim (free, no API key)
      const query = addr.includes("Toronto") ? addr : addr + ", Toronto, Ontario, Canada";
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=ca`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await resp.json();

      if (!data.length) {
        setError("Address not found. Try including the street number and name, e.g. '1450 Danforth Ave'.");
        setLoading(false);
        return;
      }

      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      const displayName = data[0].display_name;

      // Find nearest neighbourhood
      const hood = findNearest(lat, lng);

      if (!hood) {
        setError("Could not determine the neighbourhood for this address. It may be outside Toronto.");
        setLoading(false);
        return;
      }

      setResult({ lat, lng, displayName, hood });

      // Update map
      if (mapInstance.current && window.L) {
        const L = window.L;
        const map = mapInstance.current;
        map.setView([lat, lng], 14, { animate: true });

        if (markerRef.current) map.removeLayer(markerRef.current);

        const icon = L.divIcon({
          className: "",
          html: '<div style="width:16px;height:16px;background:#1a1a1a;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        markerRef.current.bindPopup(
          `<div style="font-family:${SN};font-size:13px"><strong>${hood.name}</strong><br/>#${hood.id}</div>`
        ).openPopup();

        // Draw approximate neighbourhood area
        const centroid = centroids.find(c => c.id === hood.id);
        if (centroid) {
          L.circle([centroid.lat, centroid.lng], {
            radius: 800,
            color: INK,
            weight: 1.5,
            fillColor: INK,
            fillOpacity: 0.06,
            dashArray: "5 5",
          }).addTo(map);
        }
      }
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>

        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Address Lookup</p>
        <h1 style={{ fontFamily: SF, fontSize: 42, fontWeight: 300, color: INK, margin: "0 0 16px", lineHeight: 1.1 }}>Find Your Neighbourhood</h1>
        <div style={{ width: 64, height: 1, background: INK, margin: "16px 0 24px" }} />
        <p style={{ fontFamily: SF, fontSize: 18, color: "#666", lineHeight: 1.6, maxWidth: 600, marginBottom: 32 }}>
          Enter any Toronto address to see which of the 158 neighbourhoods it belongs to, pinpointed on a map with a direct link to the full neighbourhood profile.
        </p>

        {/* SEARCH */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            value={addr}
            onChange={e => setAddr(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Enter an address, e.g. 1450 Danforth Ave..."
            style={{
              flex: 1, padding: "14px 18px", fontSize: 16, fontFamily: SN,
              border: "1px solid #ddd", background: "#fff", color: INK,
              outline: "none", boxSizing: "border-box",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              padding: "14px 28px", fontSize: 14, fontFamily: SN, fontWeight: 600,
              background: INK, color: "#fff", border: "none", cursor: "pointer",
              letterSpacing: "0.05em", opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Searching..." : "Find"}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: 14, color: "#b91c1c", marginBottom: 16 }}>{error}</p>
        )}

        {/* RESULT CARD */}
        {result && (
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 24, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Your Neighbourhood</p>
                <h2 style={{ fontFamily: SF, fontSize: 32, fontWeight: 300, color: INK, margin: "0 0 8px" }}>{result.hood.name}</h2>
                <p style={{ fontSize: 13, color: "#999", margin: "0 0 4px" }}>Neighbourhood #{result.hood.id}</p>
                <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{result.displayName.split(",").slice(0, 3).join(",")}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: SF, fontSize: 28, fontWeight: 300, color: INK, margin: 0 }}>${(result.hood.hv / 1000).toFixed(0)}K</p>
                <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>median home</p>
                <p style={{ fontFamily: SF, fontSize: 20, fontWeight: 300, color: "#999", margin: "8px 0 0" }}>${(result.hood.income / 1000).toFixed(0)}K</p>
                <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>median income</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/toronto/" + result.hood.slug)}
              style={{
                marginTop: 16, padding: "12px 24px", fontSize: 14, fontFamily: SN,
                background: INK, color: "#fff", border: "none", cursor: "pointer",
                fontWeight: 500, letterSpacing: "0.03em",
              }}
            >
              View Full Neighbourhood Profile &rarr;
            </button>
          </div>
        )}

        {/* MAP */}
        <div
          ref={mapRef}
          style={{
            width: "100%", height: 480, background: "#eee",
            border: "1px solid #e0e0e0",
          }}
        />
        <p style={{ fontSize: 11, color: "#bbb", marginTop: 8 }}>
          Map data &copy; OpenStreetMap contributors. Tiles by CARTO. Geocoding by Nominatim.
          Neighbourhood boundaries are approximate.
        </p>

        {/* FOOTER */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #e0e0e0" }}>
          <p style={{ fontSize: 11, color: "#999" }}>
            <a href="/" style={{ color: INK, textDecoration: "underline" }}>&larr; Back to all neighbourhoods</a>
          </p>
        </div>
      </div>
    </div>
  );
}
