import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Script from "next/script";

// ---------- Viewport ----------
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// ---------- Metadata ----------
export const metadata = {
  title: "Used Cars in Heckmondwike | Nationwide UK Delivery",
  description:
    "Trusted used car dealership in Heckmondwike offering quality pre-owned vehicles with nationwide UK delivery and thorough inspections.",
  applicationName: "Ace Motor Sales",
  metadataBase: new URL("https://acemotorsales.uk"),
  alternates: {
    canonical: "https://acemotorsales.uk",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Used Cars in Heckmondwike | Nationwide UK Delivery",
    description:
      "Quality pre-owned vehicles from a trusted Heckmondwike dealership, with nationwide UK delivery available.",
    url: "https://acemotorsales.uk",
    siteName: "Ace Motor Sales",
    images: [
      {
        url: "https://acemotorsales.uk/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Ace Motor Sales used car forecourt in Heckmondwike",
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Used Cars in Heckmondwike | Nationwide UK Delivery",
    description:
      "Quality pre-owned vehicles with nationwide UK delivery from a trusted local dealership.",
    images: ["https://acemotorsales.uk/hero.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

// ---------- Structured Data ----------
const carDealerSchema = {
  "@context": "https://schema.org",
  "@type": "CarDealer",
  name: "Ace Motor Sales",
  alternateName: "Ace Motor Sales Ltd",
  url: "https://acemotorsales.uk",
  logo: "https://acemotorsales.uk/apple-touch-icon.png",
  image: "https://acemotorsales.uk/hero.jpg",
  description:
    "Trusted used car dealership in Heckmondwike offering quality pre-owned vehicles with nationwide UK delivery.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Westgate",
    addressLocality: "Heckmondwike",
    addressRegion: "West Yorkshire",
    postalCode: "WF16 0EH",
    addressCountry: "GB",
  },
  telephone: "+447809107655",
  openingHours: "Mo-Su 09:00-20:00",
  geo: {
    "@type": "GeoCoordinates",
    latitude: 53.70825741357984,
    longitude: -1.6782300556791774,
  },
  sameAs: [
    "https://www.facebook.com/acemotorsales1",
    "https://www.instagram.com/acemotorsltd",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ace Motor Sales",
  url: "https://acemotorsales.uk",
  logo: "https://acemotorsales.uk/apple-touch-icon.png",
  sameAs: carDealerSchema.sameAs,
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Ace Motor Sales",
  url: "https://acemotorsales.uk",
};

// ---------- Layout ----------
export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className="min-h-full scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </head>

      <body className="min-h-screen text-zinc-100 bg-neutral-900">
        <header>
          <Navbar />
        </header>

        <main
          id="main-content"
          aria-label="Ace Motor Sales Main Content"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <h1 className="sr-only">
            Trusted used car dealership in Heckmondwike, specialising in quality
            pre-owned vehicles with nationwide UK delivery.
          </h1>

          {children}
        </main>

        <footer>
          <Footer />
        </footer>

        <Toaster
          position="top-right"
          duration={3000}
          richColors
          closeButton
          visibleToasts={5}
        />

        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              carDealerSchema,
              organizationSchema,
              websiteSchema,
            ]),
          }}
        />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
