import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 rounded bg-black px-4 py-2 text-white shadow-lg"
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
    </>
  );
}
