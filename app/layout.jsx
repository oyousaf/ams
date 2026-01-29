import "./globals.css";
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
  metadataBase: new URL("https://acemotorsales.uk"),
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// ---------- Structured Data ----------
const structuredData = [
  {
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
  },
];

export default function RootLayout({ children }) {
  return (
    <html
      lang="en-GB"
      className={`${manrope.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-neutral-900 text-zinc-100">
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
