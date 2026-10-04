// robots.txt only stops crawling; noindex is what keeps the URL out of results.
export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return (
    <main
      className="h-dvh w-screen overflow-hidden bg-rose-950"
      aria-label="Dashboard"
    >
      {children}
    </main>
  );
}
