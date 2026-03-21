import "./globals.css";
import Header from "../components/Header";

export const metadata = {
  title: "Real Data IQ | Neighbourhood Intelligence for Toronto",
  description:
    "Crime stats, school ratings, development pipeline, transit scores, and 20+ data layers for all 158 Toronto neighbourhoods.",
  openGraph: {
    title: "Real Data IQ | Know Your Neighbourhood",
    description: "158 neighbourhoods, 20+ data layers. Know your neighbourhood before you buy.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <Header />
        <div style={{ paddingTop: 64 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
