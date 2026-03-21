"use client";
import React from "react";
import { useParams } from "next/navigation";
import neighbourhoods from "../../../data/neighbourhoods";
import hoodData from "../../../data/hoodData";
import WoodbineProfile from "../../../components/WoodbineProfile";
import FullProfile from "../../../components/FullProfile";

function PlaceSchema({ hood, data }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": hood.name + ", Toronto, Ontario",
    "description": `Neighbourhood profile for ${hood.name}: population ${hood.pop.toLocaleString()}, median home value $${(hood.hv/1000).toFixed(0)}K.`,
    "address": {"@type": "PostalAddress", "addressLocality": "Toronto", "addressRegion": "Ontario", "addressCountry": "CA"},
    "additionalProperty": [
      {"@type": "PropertyValue", "name": "Population", "value": String(hood.pop)},
      {"@type": "PropertyValue", "name": "Median Home Value", "value": "$" + (hood.hv/1000).toFixed(0) + "K"},
      {"@type": "PropertyValue", "name": "Median Household Income", "value": "$" + (hood.income/1000).toFixed(0) + "K"},
    ]
  };
  if (data) {
    schema.additionalProperty.push(
      {"@type": "PropertyValue", "name": "Walk Score", "value": String(data.ws)},
      {"@type": "PropertyValue", "name": "Transit Score", "value": String(data.ts)},
      {"@type": "PropertyValue", "name": "School Rating", "value": data.sch + "/10"},
      {"@type": "PropertyValue", "name": "Crime Incidents", "value": String(data.crime)},
    );
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

function FAQSchema({ hood, data }) {
  if (!data) return null;
  const safe = data.crime < 176;
  const goodSchools = data.sch >= 6.0;
  const affordable = hood.hv < 900000;
  const familyFriendly = data.play >= 4 && data.dc >= 3;
  const momentum = data.mom > 105;

  const faqs = [
    {
      q: `Is ${hood.name} safe in 2026?`,
      a: `${hood.name} has ${data.crime} reported crime incidents, which is ${safe ? "below" : "above"} the Toronto average of 176. The year-over-year trend is ${data.crimeC > 0 ? "up" : "down"} ${Math.abs(data.crimeC)}%. Traffic KSI (killed or seriously injured) collisions stand at ${data.ksi}, ${data.ksi < 12 ? "below" : "above"} the city average of 12. The neighbourhood has ${data.shoot} shooting incidents and ${data.hate} reported hate crimes. Overall, ${hood.name} is considered ${safe ? "safer than average" : "roughly average"} for Toronto.`
    },
    {
      q: `What are schools like in ${hood.name}?`,
      a: `Schools in ${hood.name} have an average Fraser Institute rating of ${data.sch}/10, which is ${goodSchools ? "above" : "below"} the Toronto average of 6.0/10. The neighbourhood has ${data.dc} licensed daycares with ${data.dcCap} total spaces, and a School Readiness (EDI) score of ${data.edi}% of children meeting developmental benchmarks (city average: 68%). There are ${data.play} playgrounds and ${data.splash} splash pads for younger children.`
    },
    {
      q: `Is ${hood.name} good for families?`,
      a: `${familyFriendly ? "Yes, " + hood.name + " is well-suited for families." : hood.name + " has some family amenities but may have gaps."} The neighbourhood has ${data.groc} grocery stores, ${data.dc} daycares (${data.dcCap} spaces), ${data.play} playgrounds, ${data.pool} pools, ${data.arena} arenas, and ${data.parks} parks. The walk score is ${data.ws} and transit score is ${data.ts}. Schools rate ${data.sch}/10 and average household size is ${data.hhSize}.`
    },
    {
      q: `How much do homes cost in ${hood.name} in 2026?`,
      a: `The median home value in ${hood.name} is $${(hood.hv/1000).toFixed(0)}K, ${hood.hv > 930000 ? "above" : "below"} the Toronto average of $930K. Home values grew ${data.hvC}% between the 2016 and 2021 census. The ownership rate is ${data.own}% (city average: 47%). Median household income is $${(hood.income/1000).toFixed(0)}K, giving a price-to-income ratio of ${(hood.hv/hood.income).toFixed(1)}x.`
    },
    {
      q: `Is ${hood.name} a good investment in 2026?`,
      a: `${hood.name} has a momentum score of ${data.mom}/200, which indicates ${momentum ? "above-average positive trajectory" : "average or steady trajectory"}. The development pipeline has ${data.pipe} units, with building permits ${data.permC > 0 ? "up" : "down"} ${Math.abs(data.permC)}% year-over-year. ${data.affPipe > 0 ? data.affPipe + " affordable housing units are in the pipeline." : ""} The neighbourhood is projected to add ${data.intens2051.toLocaleString()} dwelling units by 2051. Net business growth is ${data.bg > 0 ? "+" : ""}${data.bg} in the past 12 months.`
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": {"@type": "Answer", "text": f.a}
    }))
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />;
}

export default function NeighbourhoodPage() {
  const params = useParams();
  const slug = params.slug;
  const hood = neighbourhoods.find(n => n.slug === slug);

  if (!hood) {
    return (
      <div style={{ padding: 80, textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: "#1a1a1a" }}>Neighbourhood not found</h1>
        <p style={{ color: "#999", marginTop: 12 }}>No neighbourhood matches &ldquo;{slug}&rdquo;</p>
        <a href="/" style={{ color: "#1a1a1a", marginTop: 24, display: "inline-block" }}>&larr; Back to all neighbourhoods</a>
      </div>
    );
  }

  const data = hoodData.find(d => d.id === hood.id);

  if (hood.id === 64) {
    return (<><PlaceSchema hood={hood} data={data} /><FAQSchema hood={hood} data={data} /><WoodbineProfile /></>);
  }

  if (!data) {
    return (<div style={{ padding: 80, textAlign: "center" }}><p>Loading...</p></div>);
  }

  return (<><PlaceSchema hood={hood} data={data} /><FAQSchema hood={hood} data={data} /><FullProfile d={data} /></>);
}
