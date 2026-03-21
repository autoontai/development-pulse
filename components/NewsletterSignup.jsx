"use client";
import React, { useState } from "react";

const SN = "'DM Sans',-apple-system,sans-serif";
const SF = "'Cormorant Garamond','Georgia',serif";
const INK = "#1a1a1a";

export default function NewsletterSignup({ neighbourhood, variant }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, neighbourhood: neighbourhood || "" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  // Compact sidebar version
  if (variant === "sidebar") {
    return (
      <div style={{ padding: "16px 20px", borderTop: "1px solid #e0e0e0", marginTop: 8 }}>
        <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999", margin: "0 0 8px" }}>Newsletter</p>
        {status === "success" ? (
          <p style={{ fontSize: 13, color: "#15803d", margin: 0 }}>Subscribed!</p>
        ) : (
          <div>
            <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px", lineHeight: 1.4 }}>
              Weekly neighbourhood intelligence brief.
            </p>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
              placeholder="your@email.com"
              style={{ width: "100%", padding: "7px 10px", fontSize: 12, fontFamily: SN, border: "1px solid #ddd", background: "#fff", color: INK, boxSizing: "border-box", marginBottom: 6 }}
            />
            <button
              onClick={handleSubmit} disabled={status === "loading"}
              style={{ width: "100%", padding: "7px 10px", fontSize: 11, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", letterSpacing: "0.05em", opacity: status === "loading" ? 0.6 : 1 }}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
            {status === "error" && <p style={{ fontSize: 11, color: "#b91c1c", marginTop: 4 }}>Something went wrong. Try again.</p>}
          </div>
        )}
      </div>
    );
  }

  // Full landing page version
  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "40px 32px", textAlign: "center" }}>
      <p style={{ fontFamily: SN, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", margin: "0 0 12px" }}>Stay Informed</p>
      <h3 style={{ fontFamily: SF, fontSize: 28, fontWeight: 300, color: INK, margin: "0 0 8px" }}>The Weekly Neighbourhood Brief</h3>
      <p style={{ fontFamily: SN, fontSize: 14, color: "#666", maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Crime trends, development pipeline updates, school rating changes, and investment signals — delivered to your inbox every Tuesday.
      </p>
      {status === "success" ? (
        <p style={{ fontSize: 16, color: "#15803d", fontFamily: SF }}>You&rsquo;re subscribed. Check your inbox for a welcome email.</p>
      ) : (
        <div style={{ display: "flex", gap: 8, maxWidth: 440, margin: "0 auto" }}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit(e)}
            placeholder="Enter your email"
            style={{ flex: 1, padding: "12px 16px", fontSize: 15, fontFamily: SN, border: "1px solid #ddd", background: "#faf9f6", color: INK, boxSizing: "border-box" }}
          />
          <button
            onClick={handleSubmit} disabled={status === "loading"}
            style={{ padding: "12px 24px", fontSize: 14, fontFamily: SN, fontWeight: 600, background: INK, color: "#fff", border: "none", cursor: "pointer", letterSpacing: "0.03em", flexShrink: 0, opacity: status === "loading" ? 0.6 : 1 }}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      )}
      {status === "error" && <p style={{ fontSize: 13, color: "#b91c1c", marginTop: 8 }}>Something went wrong. Please try again.</p>}
      <p style={{ fontSize: 11, color: "#bbb", marginTop: 16 }}>Free. No spam. Unsubscribe anytime.</p>
    </div>
  );
}
