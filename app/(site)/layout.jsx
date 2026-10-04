import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieJar from "@/components/CookieJar";

export default function SiteLayout({ children }) {
  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-70 rounded bg-black px-4 py-2 text-white shadow-lg"
      >
        Skip to main content
      </a>

      <CookieJar />

      <header>
        <Navbar />
      </header>

      <main id="main-content">{children}</main>

      {/* Footer renders its own <footer> landmark */}
      <Footer />
    </>
  );
}
