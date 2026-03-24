"use client";
import React from "react";
import { useRouter } from "next/navigation";
import blogPosts from "../../data/blogPosts";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";

export default function BlogIndex() {
  const router = useRouter();
  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 32px" }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#999", marginBottom: 12 }}>Insights</p>
        <h1 style={{ fontFamily: SF, fontSize: 42, fontWeight: 300, color: INK, margin: "0 0 16px", lineHeight: 1.1 }}>The Real Data IQ Blog</h1>
        <div style={{ width: 64, height: 1, background: INK, margin: "16px 0 24px" }} />
        <p style={{ fontFamily: SF, fontSize: 18, color: "#666", lineHeight: 1.6, maxWidth: 600, marginBottom: 48 }}>Data-driven insights on Toronto neighbourhoods. Crime trends, school rankings, investment signals, and the numbers behind where to buy.</p>
        {blogPosts.map(post => (
          <article key={post.slug} onClick={() => router.push("/blog/" + post.slug)}
            style={{ display: "flex", gap: 24, marginBottom: 32, cursor: "pointer", padding: 24, background: "#fff", border: "1px solid #e0e0e0", transition: "border-color 0.2s", alignItems: "flex-start" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = INK}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}>
            <img src={post.image} alt={post.imageAlt} style={{ width: 200, height: 140, objectFit: "cover", flexShrink: 0 }} />
            <div>
              <div style={{ display: "flex", gap: 12, marginBottom: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>{post.category}</span>
                <span style={{ fontSize: 11, color: "#ccc" }}>&middot;</span>
                <span style={{ fontSize: 11, color: "#999" }}>{post.date}</span>
                <span style={{ fontSize: 11, color: "#ccc" }}>&middot;</span>
                <span style={{ fontSize: 11, color: "#999" }}>{post.readTime} read</span>
              </div>
              <h2 style={{ fontFamily: SF, fontSize: 22, fontWeight: 400, color: INK, margin: "0 0 8px", lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
            </div>
          </article>
        ))}
        <div style={{ marginTop: 48, borderTop: "1px solid #e0e0e0", paddingTop: 24 }}>
          <a href="/" style={{ fontSize: 12, color: INK, textDecoration: "underline" }}>&larr; Back to all neighbourhoods</a>
        </div>
      </div>
    </div>
  );
}
