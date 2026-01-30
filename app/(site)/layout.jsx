import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SiteLayout({ children }) {
  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded bg-black px-4 py-2 text-white shadow-lg"
      >
        Skip to main content
      </a>

      <header>
        <Navbar />
      </header>

      <main id="main-content">{children}</main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
