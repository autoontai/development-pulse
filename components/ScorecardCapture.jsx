"use client";
import React, { useState } from "react";

const SN = "'DM Sans',-apple-system,sans-serif";
const SF = "'Cormorant Garamond','Georgia',serif";
const INK = "#1a1a1a";

export default function ScorecardCapture({ neighbourhood, compact }) {
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
        body: JSON.stringify({ email, neighbourhood: neighbourhood || "Homepage", scorecard: true }),
      });
      if (res.ok) setStatus("success");
      else setStatus("error");
    } catch { setStatus("error"); }
  }

  // Header bar version (persistent across all pages)
  if (compact) {
    if (status === "success") {
      return (
        <div style={{ background: "#f0fdf4", padding: "8px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ fontSize: 13, color: "#15803d", margin: 0, fontFamily: SN }}>Scorecard sent! Check your inbox.</p>
        </div>
      );
    }
    return (
      <div style={{ background: "#faf9f6", borderBottom: "1px solid #e0e0e0", padding: "8px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: INK, margin: 0, fontFamily: SN, fontWeight: 500 }}>
          Free Toronto Neighbourhood Scorecard
        </p>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
            placeholder="your@email.com"
            style={{ padding: "5px 10px", fontSize: 13, fontFamily: SN, border: "1px solid #ddd", background: "#fff", color: INK, width: 200 }}
          />
          <button onClick={handleSubmit} disabled={status === "loading"}
            style={{ padding: "5px 14px", fontSize: 12, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", opacity: status === "loading" ? 0.6 : 1 }}>
            {status === "loading" ? "..." : "Get Free Scorecard"}
          </button>
        </div>
        {status === "error" && <span style={{ fontSize: 11, color: "#b91c1c" }}>Try again</span>}
      </div>
    );
  }

  // Sidebar version (replaces old newsletter)
  if (status === "success") {
    return (
      <div style={{ padding: "16px 20px", borderTop: "1px solid #e0e0e0", marginTop: 8 }}>
        <p style={{ fontSize: 13, color: "#15803d", margin: 0, fontFamily: SN }}>Scorecard sent!</p>
      </div>
    );
  }
  return (
    <div style={{ padding: "16px 20px", borderTop: "1px solid #e0e0e0", marginTop: 8 }}>
      <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Free Scorecard</p>
      <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px", lineHeight: 1.4 }}>
        Get {neighbourhood ? neighbourhood + "'s" : "your"} neighbourhood scorecard emailed to you.
      </p>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
        placeholder="your@email.com"
        style={{ width: "100%", padding: "7px 10px", fontSize: 12, fontFamily: SN, border: "1px solid #ddd", background: "#fff", color: INK, boxSizing: "border-box", marginBottom: 6 }} />
      <button onClick={handleSubmit} disabled={status === "loading"}
        style={{ width: "100%", padding: "7px 10px", fontSize: 11, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", opacity: status === "loading" ? 0.6 : 1 }}>
        {status === "loading" ? "..." : "Get Free Scorecard"}
      </button>
      {status === "error" && <p style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Try again.</p>}
    </div>
  );
}
