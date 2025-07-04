import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

export const metadata = {
  title: "Ace Motor Sales - Certified Used Cars with Nationwide Delivery",
  description:
    "Explore a selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
  applicationName: "Ace Motor Sales",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Ace Motor Sales",
    "Heckmondwike car dealer",
    "used cars Heckmondwike",
    "West Yorkshire car dealer",
    "certified used vehicles UK",
    "affordable second-hand cars",
    "quality used vehicles West Yorkshire",
    "family cars for sale UK",
    "trusted local car dealership",
    "nationwide car delivery UK",
    "pre-owned cars with delivery",
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
  canonicalUrl: "https://acemotorsales.uk",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CarDealer",
  name: "Ace Motor Sales",
  alternateName: "Ace Motor Sales Ltd",
  url: metadata.canonicalUrl,
  logo: "/apple-touch-icon.png",
  image: "/hero.jpg",
  description: metadata.description,
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
    <html lang="en-gb" className="min-h-full scroll-smooth antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <meta
          name="description"
          content="Certified, pre-owned vehicles at Ace Motor Sales. Quality, reliability, and performance guaranteed."
        />
        <meta property="og:title" content="Ace Motor Sales" />
        <meta
          property="og:description"
          content="Explore our range of carefully inspected pre-owned vehicles."
        />
        <meta property="og:image" content="/hero.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body className="min-h-screen text-zinc-100">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-right"
          duration={3000}
          richColors
          closeButton
          visibleToasts={5}
        />
        <SpeedInsights />
      </body>
    </html>
  );
}
