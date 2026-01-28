import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Script from "next/script";
import { Manrope } from "next/font/google";

// ---------- Font ----------
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// ---------- Viewport ----------
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// ---------- Global Metadata ----------
export const metadata = {
  title: {
    default: "Ace Motor Sales",
    template: "%s | Ace Motor Sales",
  },
  description:
    "Trusted independent used car dealership in Heckmondwike, West Yorkshire, supplying quality pre-owned vehicles with nationwide UK delivery.",
  applicationName: "Ace Motor Sales",

  keywords: [
    "used cars Heckmondwike",
    "used car dealer Heckmondwike",
    "used cars West Yorkshire",
    "independent car dealer West Yorkshire",
    "used cars near Wakefield",
    "used cars near Leeds",
    "used cars near Bradford",
    "used cars UK delivery",
    "quality used cars UK",
    "Ace Motor Sales",
  ],

  metadataBase: new URL("https://acemotorsales.uk"),

  alternates: {
    canonical: "https://acemotorsales.uk",
    languages: {
      "en-GB": "https://acemotorsales.uk",
    },
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
    "Independent used car dealer based in Heckmondwike, West Yorkshire, supplying inspected vehicles to customers across the UK.",
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
    <html
      lang="en-GB"
      className={`${manrope.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-neutral-900 text-zinc-100">
        {/* Skip to content (accessibility) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-100 rounded bg-black px-4 py-2 text-white shadow-lg"
        >
          Skip to main content
        </a>

        <header role="banner">
          <Navbar />
        </header>

        {children}

        <footer role="contentinfo">
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
          strategy="afterInteractive"
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
