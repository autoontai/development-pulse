import comparePairs from "../../../data/comparePairs";

export async function generateMetadata({ params }) {
  const { pair } = await params;
  const match = comparePairs.find(p => p.slug === pair);
  if (!match) return { title: "Comparison Not Found | Real Data IQ" };

  return {
    title: `${match.title} – Toronto Neighbourhood Comparison 2026 | Real Data IQ`,
    description: `Side-by-side comparison of ${match.title}: crime rates, school rankings, transit scores, home prices, development pipeline & 50+ metrics. Which Toronto neighbourhood is better for you in 2026?`,
    openGraph: {
      title: `${match.title} | Real Data IQ`,
      description: `Compare every metric: crime, schools, transit, housing, health & more.`,
      type: "website",
    },
  };
}

export default function CompareLayout({ children }) {
  return children;
}
