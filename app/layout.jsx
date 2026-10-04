import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import { Manrope } from "next/font/google";
import { MotionConfig } from "motion/react";
import { SITE_URL, PHONE_E164 } from "@/lib/carMeta";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// No maximumScale - blocking pinch-zoom fails WCAG 1.4.4 (Resize Text).
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#171717",
  colorScheme: "dark",
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Used Cars in Heckmondwike | Ace Motor Sales",
    template: "%s | Ace Motor Sales",
  },
  description:
    "Used cars for sale in Heckmondwike, West Yorkshire. Fully inspected vehicles with nationwide UK delivery. View latest stock today.",
  applicationName: "Ace Motor Sales",
  category: "automotive",
  openGraph: {
    siteName: "Ace Motor Sales",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

const DEALER_ID = `${SITE_URL}/#dealer`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CarDealer",
      "@id": DEALER_ID,
      name: "Ace Motor Sales",
      alternateName: "AMS",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      image: `${SITE_URL}/hero.webp`,
      telephone: PHONE_E164,
      email: "acemotorslimited@hotmail.com",
      priceRange: "££",
      address: {
        "@type": "PostalAddress",
        streetAddress: "4 Westgate",
        addressLocality: "Heckmondwike",
        addressRegion: "West Yorkshire",
        postalCode: "WF16 0EH",
        addressCountry: "GB",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 53.70835,
        longitude: -1.678337,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "20:00",
        },
      ],
      areaServed: [
        { "@type": "AdministrativeArea", name: "West Yorkshire" },
        { "@type": "Country", name: "United Kingdom" },
      ],
      sameAs: [
        "https://www.facebook.com/acemotorsales1",
        "https://www.instagram.com/acemotorsltd",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ace Motor Sales",
      inLanguage: "en-GB",
      publisher: { "@id": DEALER_ID },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${manrope.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-neutral-900 text-zinc-100 selection:bg-rose-400/20">
        {/* Rendered into the server HTML so crawlers see it without running JS */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        <MotionConfig reducedMotion="user">{children}</MotionConfig>

        <Toaster
          position="top-right"
          duration={3000}
          richColors
          closeButton
          visibleToasts={5}
        />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
