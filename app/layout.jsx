import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

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
    "Ace Motor Sales Heckmondwike",
  ],
  metadataBase: new URL("https://acemotorsales.uk"),
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
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  alternates: {
    canonical: "https://acemotorsales.uk",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className="min-h-full scroll-smooth antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([structuredData, orgSchema, websiteSchema]),
          }}
        />
      </head>
      <body className="min-h-screen text-zinc-100">
        <header>
          <Navbar />
        </header>

        <main
          id="main-content"
          aria-label="Ace Motor Sales Main Content"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
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
        <SpeedInsights />
      </body>
    </html>
  );
}
