"use client";
import React from "react";
import { useParams } from "next/navigation";
import blogPosts from "../../../data/blogPosts";
import NewsletterSignup from "../../../components/NewsletterSignup";

const SF = "'Cormorant Garamond','Georgia',serif";
const SN = "'DM Sans',-apple-system,sans-serif";
const INK = "#1a1a1a";

export default function BlogPost() {
  const params = useParams();
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return (<div style={{ padding: 80, textAlign: "center", fontFamily: SN }}>
      <h1 style={{ fontFamily: SF, fontSize: 36, fontWeight: 300 }}>Article not found</h1>
      <a href="/blog" style={{ color: INK }}>&larr; Back to blog</a>
    </div>);
  }

  return (
    <div style={{ background: "#faf9f6", minHeight: "100vh", fontFamily: SN }}>
      <article style={{ maxWidth: 740, margin: "0 auto", padding: "48px 32px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#999" }}>{post.category}</span>
            <span style={{ fontSize: 11, color: "#ccc" }}>&middot;</span>
            <span style={{ fontSize: 11, color: "#999" }}>{post.date}</span>
            <span style={{ fontSize: 11, color: "#ccc" }}>&middot;</span>
            <span style={{ fontSize: 11, color: "#999" }}>{post.readTime} read</span>
          </div>
          <h1 style={{ fontFamily: SF, fontSize: 42, fontWeight: 300, color: INK, margin: "0 0 16px", lineHeight: 1.15 }}>{post.title}</h1>
          <p style={{ fontFamily: SF, fontSize: 20, color: "#666", lineHeight: 1.6, margin: "0 0 24px" }}>{post.excerpt}</p>
          <div style={{ width: 48, height: 1, background: INK, marginBottom: 32 }} />
        </div>

        <img src={post.image} alt={post.imageAlt} style={{ width: "100%", height: 400, objectFit: "cover", marginBottom: 32 }} />

        <div style={{ fontFamily: SF, fontSize: 18, color: "#444", lineHeight: 1.7, marginBottom: 32 }}>
          <p>We analysed all 158 Toronto neighbourhoods using the latest available data from Toronto Police Service, Statistics Canada, the Fraser Institute, and City of Toronto Open Data. Every ranking below is driven by real numbers — not opinion, not vibes, not real estate marketing.</p>
          <p style={{ marginTop: 16 }}>Here{"\u2019"}s what the data says.</p>
        </div>

        {/* RANKINGS */}
        <div>
          {post.hoods.map((h, i) => (
            <div key={h.slug} style={{ marginBottom: 32, paddingBottom: 32, borderBottom: i < post.hoods.length - 1 ? "1px solid #eee" : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                <span style={{ fontFamily: SF, fontSize: 48, fontWeight: 300, color: "#ddd", lineHeight: 1, flexShrink: 0, width: 48, textAlign: "right" }}>{h.rank}</span>
                <div style={{ flex: 1 }}>
                  <a href={"/toronto/" + h.slug} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontFamily: SF, fontSize: 24, fontWeight: 400, color: INK, margin: "0 0 8px", lineHeight: 1.2 }}>{h.name}</h3>
                  </a>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                    {h.crime !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Crime: {h.crime}</span>}
                    {h.ksi !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>KSI: {h.ksi}</span>}
                    {h.shoot !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Shootings: {h.shoot}</span>}
                    {h.hv !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>${h.hv < 10 ? h.hv + "M" : h.hv + "K"}</span>}
                    {h.sch !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Schools: {h.sch}/10</span>}
                    {h.ws !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Walk: {h.ws}</span>}
                    {h.mom !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Momentum: {h.mom}</span>}
                    {h.bg !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Biz Growth: +{h.bg}</span>}
                    {h.dc !== undefined && <span style={{ fontSize: 12, color: "#999", padding: "3px 10px", border: "1px solid #e0e0e0" }}>Daycares: {h.dc}</span>}
                  </div>
                  <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, margin: 0 }}>{h.insight}</p>
                  <a href={"/toronto/" + h.slug} style={{ fontSize: 13, color: INK, fontWeight: 500, marginTop: 8, display: "inline-block" }}>View full profile &rarr;</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontFamily: SF, fontSize: 18, color: "#444", lineHeight: 1.7, marginTop: 32, marginBottom: 32, paddingTop: 32, borderTop: "1px solid #eee" }}>
          <h2 style={{ fontFamily: SF, fontSize: 28, fontWeight: 300, color: INK, marginBottom: 16 }}>Methodology</h2>
          <p>Rankings are based on data from Toronto Open Data, Statistics Canada Census 2021, Toronto Police Service Major Crime Indicators, Fraser Institute school ratings, and City of Toronto building permits and business licences. All figures reflect the most recent available data as of March 2026. City average benchmarks use Toronto-wide figures across all 158 social planning neighbourhoods.</p>
        </div>

        <NewsletterSignup />

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #e0e0e0", display: "flex", justifyContent: "space-between" }}>
          <a href="/blog" style={{ fontSize: 13, color: INK, textDecoration: "underline" }}>&larr; All articles</a>
          <a href="/" style={{ fontSize: 13, color: INK, textDecoration: "underline" }}>All neighbourhoods &rarr;</a>
        </div>
      </article>
    </div>
  );
}
