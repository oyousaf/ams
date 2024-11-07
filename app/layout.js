import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata = {
  title: "Ace Motor Sales",
  description:
    "Explore a selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "Ace Motor Sales",
    "Ace Motor Sales Ltd",
    "Heckmondwike car dealer",
    "used cars West Yorkshire",
    "certified used cars",
    "reliable cars",
    "pre-owned vehicles",
    "car dealership UK",
  ],
  openGraph: {
    title: "Ace Motor Sales",
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
    title: "Ace Motor Sales",
    description:
      "Explore certified, pre-owned vehicles with top quality, reliability, and performance.",
    images: ["/hero.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb" className="min-h-full antialiased">
      <body className="min-h-screen bg-black/90 text-white">
        <div role="main" className="max-w-7xl mx-auto relative">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
