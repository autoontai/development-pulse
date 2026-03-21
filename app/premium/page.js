"use client";
import React, { useState } from "react";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";

export default function PremiumPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, neighbourhood: "Premium Subscriber" }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "64px 32px" }}>

        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Premium</p>
        <h1 style={{ fontFamily: SF, fontSize: 44, fontWeight: 300, color: INK, margin: "0 0 16px", lineHeight: 1.1 }}>The Intelligence Brief</h1>
        <div style={{ width: 64, height: 1, background: INK, margin: "16px 0 24px" }} />
        <p style={{ fontFamily: SF, fontSize: 20, color: "#555", lineHeight: 1.6, marginBottom: 48 }}>
          Go deeper than the free data. Our premium newsletter delivers the analysis, signals, and exclusive insights that help you make smarter real estate decisions.
        </p>

        {/* WHAT'S INCLUDED */}
        <div style={{ marginBottom: 48 }}>
          {[
            {
              title: "Monthly Deep-Dive Report",
              desc: "A 10+ page analysis of one neighbourhood or theme — gentrification patterns, school catchment arbitrage, transit-driven appreciation, or emerging corridors. Original analysis you won't find anywhere else.",
            },
            {
              title: "Early Access to New Data",
              desc: "When we add new datasets or metrics (health data, environmental risk, rental yields), premium subscribers see them first — typically 2 weeks before the public site updates.",
            },
            {
              title: "Monthly Data Refresh Alerts",
              desc: "The first to know when crime shifts, permits spike, or momentum changes across Toronto's 158 neighbourhoods. Delivered to your inbox with our analyst commentary on what it means.",
            },
            {
              title: "Exclusive Insights & Signals",
              desc: "Investment signals we don't publish publicly: which neighbourhoods are underpriced relative to their fundamentals, where institutional money is moving, and early indicators of neighbourhood transition.",
            },
          ].map((item, i) => (
            <div key={i} style={{ padding: "28px 0", borderBottom: "1px solid #eee" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <span style={{ fontFamily: SF, fontSize: 24, color: "#ccc", fontWeight: 300, flexShrink: 0, width: 28 }}>{i + 1}</span>
                <div>
                  <h3 style={{ fontFamily: SF, fontSize: 22, fontWeight: 400, color: INK, margin: "0 0 6px" }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "#666", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRICING */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: 32, marginBottom: 48, textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 8 }}>Founding Member Pricing</p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4, marginBottom: 8 }}>
            <span style={{ fontFamily: SF, fontSize: 48, fontWeight: 300, color: INK }}>$10</span>
            <span style={{ fontSize: 16, color: "#999" }}>/month</span>
          </div>
          <p style={{ fontSize: 14, color: "#999", marginBottom: 4 }}>Cancel anytime. No commitment.</p>
          <p style={{ fontSize: 13, color: "#15803d", fontWeight: 600, marginBottom: 24 }}>Free during our founding period — subscribe now to lock in this rate.</p>

          {status === "success" ? (
            <div style={{ padding: 16 }}>
              <p style={{ fontSize: 18, color: "#15803d", fontFamily: SF }}>You're on the list! We'll notify you when premium launches.</p>
              <p style={{ fontSize: 13, color: "#999", marginTop: 8 }}>In the meantime, you'll receive our free weekly intelligence brief.</p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
                placeholder="Enter your email"
                style={{ flex: 1, padding: "12px 16px", fontSize: 15, fontFamily: SN, border: "1px solid #ddd", background: "#faf9f6", color: INK, boxSizing: "border-box" }}
              />
              <button
                onClick={handleSubmit} disabled={status === "loading"}
                style={{ padding: "12px 24px", fontSize: 14, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", flexShrink: 0, opacity: status === "loading" ? 0.6 : 1 }}
              >
                {status === "loading" ? "..." : "Join Free"}
              </button>
            </div>
          )}
          {status === "error" && <p style={{ fontSize: 13, color: "#b91c1c", marginTop: 8 }}>Something went wrong. Try again.</p>}
        </div>

        {/* WHO IT'S FOR */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: SF, fontSize: 26, fontWeight: 300, color: INK, marginBottom: 16 }}>Who this is for</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Homebuyers who want to understand where Toronto is heading, not just where it is today",
              "Real estate investors looking for data-backed signals on emerging neighbourhoods",
              "Agents and brokers who want to give clients neighbourhood intelligence their competitors can't",
              "Anyone making a $500K+ decision who wants more than a vibes-based recommendation",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#999", flexShrink: 0, marginTop: 2 }}>—</span>
                <p style={{ fontSize: 14, color: "#555", lineHeight: 1.6, margin: 0 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 24 }}>
          <a href="/" style={{ fontSize: 13, color: INK, textDecoration: "underline" }}>&larr; Back to all neighbourhoods</a>
        </div>
      </div>
    </div>
  );
}
