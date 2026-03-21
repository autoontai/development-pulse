import neighbourhoods from "./neighbourhoods";
import hoodData from "./hoodData";

export function getHoodSEO(slug) {
  const hood = neighbourhoods.find(n => n.slug === slug);
  if (!hood) return null;
  const d = hoodData.find(h => h.id === hood.id);

  const title = `${hood.name} Neighbourhood Profile | Real Data IQ`;
  const description = `${hood.name} (#${hood.id}): Crime rate ${d ? (d.crime < 176 ? "below" : "above") + " city avg" : ""}, schools rated ${d ? d.sch : "N/A"}/10, walk score ${d ? d.ws : "N/A"}, ${hood.pop.toLocaleString()} residents, $${(hood.hv/1000).toFixed(0)}K median home value. 20+ data layers compared to Toronto averages.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": hood.name,
    "description": description,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Toronto",
      "addressRegion": "Ontario",
      "addressCountry": "CA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 43.7,
      "longitude": -79.4
    },
    "additionalProperty": [
      {"@type": "PropertyValue", "name": "Population", "value": hood.pop},
      {"@type": "PropertyValue", "name": "Median Home Value", "value": hood.hv},
      {"@type": "PropertyValue", "name": "Median Household Income", "value": hood.income},
    ]
  };

  return { title, description, jsonLd, hood, data: d };
}
