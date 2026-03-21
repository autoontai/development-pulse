import neighbourhoods from "../../../data/neighbourhoods";
import hoodData from "../../../data/hoodData";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hood = neighbourhoods.find(n => n.slug === slug);
  if (!hood) return { title: "Neighbourhood Not Found | Real Data IQ" };

  const d = hoodData.find(h => h.id === hood.id);
  const crimeCtx = d ? (d.crime < 176 ? "below-average crime rate" : "above-average crime rate") : "";
  const schoolCtx = d ? `schools rated ${d.sch}/10` : "";
  const walkCtx = d ? `walk score ${d.ws}` : "";
  const transitCtx = d ? `transit score ${d.ts}` : "";
  const priceCtx = `$${(hood.hv/1000).toFixed(0)}K median home price`;

  return {
    title: `${hood.name} Toronto Neighbourhood Guide 2026 | Real Data IQ`,
    description: `Crime rates, school rankings, new developments, transit scores & property taxes in ${hood.name}. ${crimeCtx}, ${schoolCtx}, ${walkCtx}, ${transitCtx}, ${priceCtx}. Compare vs Toronto average + interactive charts. Updated 2026.`,
    openGraph: {
      title: `${hood.name} Toronto – 2026 Complete Guide | Real Data IQ`,
      description: `Is ${hood.name} right for you? Crime stats, school ratings, development pipeline, transit scores & 20+ data layers vs Toronto averages.`,
      type: "website",
    },
    alternates: {
      canonical: `https://www.realdataiq.com/toronto/${slug}`,
    },
  };
}

export default function NeighbourhoodLayout({ children }) {
  return children;
}
