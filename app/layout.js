import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
  description:
    "Explore a selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Ace Motor Sales",
    "Heckmondwike car dealer",
    "West Yorkshire used cars",
    "certified pre-owned cars",
    "reliable used vehicles",
    "affordable car sales UK",
    "quality second-hand cars",
    "trusted car dealership",
    "pre-owned vehicles West Yorkshire",
    "UK used car sales",
    "car dealership Heckmondwike",
    "local car dealer UK",
    "certified used vehicles",
    "family cars for sale",
    "nationwide car delivery",
  ],
  openGraph: {
    title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
    description:
      "Explore certified, pre-owned vehicles with top quality, reliability, and performance.",
    url: "https://acemotorsales.uk",
    siteName: "Ace Motor Sales",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Ace Motor Sales Banner Image",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
    description:
      "Explore certified, pre-owned vehicles with top quality, reliability, and performance.",
    images: ["/hero.jpg"],
  },
  canonicalUrl: "https://acemotorsales.uk"
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CarDealer",
  name: "Ace Motor Sales",
  alternateName: "Ace Motor Sales Ltd",
  url: metadata.canonicalUrl,
  logo: "/apple-touch-icon.png",
  image: "/hero.jpg",
  description:
    "Explore certified, pre-owned vehicles with top quality, reliability, and performance.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Westgate",
    addressLocality: "Heckmondwike",
    addressRegion: "West Yorkshire",
    postalCode: "WF16 0EH",
    addressCountry: "UK",
  },
  telephone: "+447809107655",
  sameAs: [
    "https://www.facebook.com/acemotorsales1",
    "https://www.instagram.com/acemotorsltd",
  ],
  openingHours: "Mo-Su 09:00-20:00",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.70825741357984,
    longitude: -1.6782300556791774,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb" className="min-h-full antialiased">
      <head>
        <meta name="application-name" content="Ace Motor Sales" />
        <link rel="canonical" href="https://acemotorsales.uk" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-black/90 text-white">
        <div role="main" className="max-w-7xl mx-auto relative">
          <Navbar />
          <main>{children}</main>
          <SpeedInsights />
          <Footer />
        </div>
      </body>
    </html>
  );
}
