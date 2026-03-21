"use client";
import React from "react";
import { useRouter } from "next/navigation";
import neighbourhoods from "../data/neighbourhoods";
import blogPosts from "../data/blogPosts";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";

export default function Home() {
  const router = useRouter();
  const featured = neighbourhoods.filter(n => [64, 63, 69, 62, 89, 86, 95, 77].includes(n.id));
  const sorted = [...neighbourhoods].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebSite", "name": "Real Data IQ",
        "url": "https://www.realdataiq.com",
        "description": "Neighbourhood intelligence for all 158 Toronto neighbourhoods.",
        "potentialAction": { "@type": "SearchAction", "target": "https://www.realdataiq.com/toronto/{search_term_string}", "query-input": "required name=search_term_string" }
      }) }} />

      {/* HERO */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "72px 32px 40px" }}>
        <h2 style={{ fontFamily: SF, fontSize: 52, fontWeight: 300, color: "#1a1a1a", lineHeight: 1.1, margin: "0 0 16px" }}>Know your neighbourhood<br />before you buy.</h2>
        <div style={{ width: 64, height: 1, background: "#1a1a1a", margin: "24px 0" }} />
        <p style={{ fontFamily: SF, fontSize: 20, color: "#666", lineHeight: 1.6, maxWidth: 600 }}>Crime stats, school ratings, development pipeline, transit scores, property tax estimates, and 20+ data layers for every Toronto neighbourhood — compared to citywide averages.</p>
      </div>

      {/* FIND YOUR NEIGHBOURHOOD CTA */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 48px" }}>
        <button
          onClick={() => router.push("/find-neighbourhood")}
          style={{
            width: "100%", padding: "24px 32px", background: "#fff",
            border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}
        >
          <div>
            <p style={{ fontFamily: SF, fontSize: 20, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px" }}>Find Your Neighbourhood</p>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Enter any Toronto address to see which neighbourhood it falls in, with a live map.</p>
          </div>
          <span style={{ fontSize: 24, color: "#999", flexShrink: 0, marginLeft: 16 }}>&rarr;</span>
        </button>
        <button
          onClick={() => router.push("/compare")}
          style={{
            width: "100%", padding: "24px 32px", background: "#fff", marginTop: 12,
            border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}
        >
          <div>
            <p style={{ fontFamily: SF, fontSize: 20, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px" }}>Compare Neighbourhoods</p>
            <p style={{ fontSize: 13, color: "#999", margin: 0 }}>Side-by-side comparison of every metric across 2–3 neighbourhoods.</p>
          </div>
          <span style={{ fontSize: 24, color: "#999", flexShrink: 0, marginLeft: 16 }}>&rarr;</span>
        </button>
      </div>

      {/* ALL TOOLS & LINKS */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 12px", display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={() => router.push("/tools/tree-canopy")}
          style={{ width: "100%", padding: "20px 24px", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
          <div><p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 3px" }}>Tree Canopy Coverage Map</p><p style={{ fontSize: 12, color: "#999", margin: 0 }}>Explore the greenest neighbourhoods in Toronto.</p></div>
          <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 12 }}>&rarr;</span>
        </button>
        <button onClick={() => router.push("/tools/childcare")}
          style={{ width: "100%", padding: "20px 24px", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
          <div><p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 3px" }}>Childcare Readiness Map</p><p style={{ fontSize: 12, color: "#999", margin: 0 }}>Find neighbourhoods with the most daycare spots and shortest waits.</p></div>
          <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 12 }}>&rarr;</span>
        </button>
        <button onClick={() => router.push("/tools/pedestrian-safety")}
          style={{ width: "100%", padding: "20px 24px", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
          <div><p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 3px" }}>Pedestrian & Cyclist Safety Map</p><p style={{ fontSize: 12, color: "#999", margin: 0 }}>See which areas have the lowest traffic collision rates.</p></div>
          <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 12 }}>&rarr;</span>
        </button>
        <button onClick={() => router.push("/blog")}
          style={{ width: "100%", padding: "20px 24px", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
          <div><p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 3px" }}>Neighbourhood Intelligence Blog</p><p style={{ fontSize: 12, color: "#999", margin: 0 }}>Data-driven rankings, hidden gems, and investment signals.</p></div>
          <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 12 }}>&rarr;</span>
        </button>
        <button onClick={() => router.push("/premium")}
          style={{ width: "100%", padding: "20px 24px", background: "#fff", border: "1px solid #e0e0e0", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"} onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
          <div><p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 3px" }}>Premium Newsletter</p><p style={{ fontSize: 12, color: "#999", margin: 0 }}>Monthly deep-dive reports, early data access, and exclusive insights. $10/mo.</p></div>
          <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 12 }}>&rarr;</span>
        </button>
      </div>

      {/* FEATURED */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 48px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>Featured Neighbourhoods</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {featured.map(n => (
            <button key={n.id} onClick={() => router.push("/toronto/" + n.slug)}
              style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "16px", textAlign: "left", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
              <p style={{ fontFamily: SF, fontSize: 16, color: "#1a1a1a", margin: "0 0 4px", fontWeight: 400 }}>{n.name}</p>
              <p style={{ fontSize: 11, color: "#999", margin: 0 }}>#{n.id} · ${(n.hv / 1000).toFixed(0)}K median</p>
            </button>
          ))}
        </div>
      </div>

      {/* ALL NEIGHBOURHOODS */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 80px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", margin: "0 0 16px" }}>All 158 Neighbourhoods</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "#e0e0e0", border: "1px solid #e0e0e0" }}>
          {sorted.map(n => (
            <button key={n.id} onClick={() => router.push("/toronto/" + n.slug)}
              style={{ background: "#fff", border: "none", padding: "14px 16px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f5f0"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
              <div>
                <p style={{ fontSize: 14, color: "#1a1a1a", margin: 0, fontWeight: 500 }}>{n.name}</p>
                <p style={{ fontSize: 11, color: "#999", margin: "2px 0 0" }}>#{n.id} · Pop. {n.pop.toLocaleString()}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: SF, fontSize: 16, color: "#1a1a1a", margin: 0 }}>${(n.hv / 1000).toFixed(0)}K</p>
                <p style={{ fontSize: 10, color: "#999", margin: "1px 0 0" }}>${(n.income / 1000).toFixed(0)}K income</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 48px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 16 }}>Latest from the Blog</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {blogPosts.slice(0, 3).map(post => (
            <button key={post.slug} onClick={() => router.push("/blog/" + post.slug)}
              style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "20px 24px", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "border-color 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#1a1a1a"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: SF, fontSize: 18, fontWeight: 400, color: "#1a1a1a", margin: "0 0 4px" }}>{post.title}</p>
                <p style={{ fontSize: 12, color: "#999", margin: 0 }}>{post.readTime} · {new Date(post.date).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</p>
              </div>
              <span style={{ fontSize: 20, color: "#999", flexShrink: 0, marginLeft: 16 }}>&rarr;</span>
            </button>
          ))}
        </div>
        <button onClick={() => router.push("/blog")} style={{ marginTop: 12, background: "transparent", border: "none", cursor: "pointer", fontSize: 13, color: "#1a1a1a", textDecoration: "underline", padding: 0 }}>View all articles &rarr;</button>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 32px 48px" }}>
        <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 24 }}>
          <p style={{ fontSize: 11, color: "#999", lineHeight: 1.8 }}>Sources: Toronto Open Data, Statistics Canada Census 2021, Toronto Police Service, Fraser Institute, RentSafeTO, DineSafe, Vision Zero, TRCA, MPAC.</p>
        </div>
      </div>
    </div>
  );
}
