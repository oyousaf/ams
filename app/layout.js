import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Ace Motor Sales",
  description:
    "Explore a selection of certified, pre-owned vehicles, each thoroughly inspected to ensure top quality, reliability, and performance.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords:
    "Ace Motor Sales, Ace Motor Sales Ltd, Heckmondwike, Heckmondwike car dealer, used cars West Yorkshire, pre-owned vehicles, second-hand vehicles UK, certified used cars, reliable cars, family cars, petrol cars, diesel cars, affordable financing, inspected cars, trusted dealership, reliable car sales Heckmondwike",
  viewport: {
    width: "device-width",
    initialScale: 1.0,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-gb">
      <body className="min-h-screen bg-black/90">
        <main className="max-w-7xl mx-auto relative">
          <Navbar />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
