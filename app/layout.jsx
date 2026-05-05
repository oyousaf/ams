import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";
import Script from "next/script";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: {
    default: "Used Cars in Heckmondwike | Ace Motor Sales",
    template: "%s | Ace Motor Sales",
  },
  description:
    "Used cars for sale in Heckmondwike, West Yorkshire. Fully inspected vehicles with nationwide UK delivery. View latest stock today.",
  keywords: [
    "used cars Heckmondwike",
    "used cars West Yorkshire",
    "cars for sale Heckmondwike",
    "second hand cars West Yorkshire",
    "used car dealer Heckmondwike",
    "cheap used cars West Yorkshire",
    "cars for sale near Leeds",
    "UK car dealership delivery",
  ],
  category: "automotive",
  applicationName: "Ace Motor Sales",
  metadataBase: new URL("https://acemotorsales.uk"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  other: {
    "geo.region": "GB-WYK",
    "geo.placename": "Heckmondwike",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "CarDealer",
  name: "Ace Motor Sales",
  url: "https://acemotorsales.uk",
  logo: "https://acemotorsales.uk/apple-touch-icon.png",
  image: "https://acemotorsales.uk/hero.jpg",
  telephone: "+447809107655",
  openingHours: "Mo-Su 09:00-20:00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "4 Westgate",
    addressLocality: "Heckmondwike",
    addressRegion: "West Yorkshire",
    postalCode: "WF16 0EH",
    addressCountry: "GB",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      suppressHydrationWarning
      className={`${manrope.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-neutral-900 text-zinc-100 selection:bg-rose-400/20">
        {children}

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
            __html: JSON.stringify(structuredData),
          }}
        />

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
