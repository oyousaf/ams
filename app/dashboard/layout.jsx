export default function DashboardLayout({ children }) {
  return (
    <main
      className="min-h-dvh bg-rose-950 overflow-hidden [scrollbar-gutter:auto]"
      aria-label="Dashboard"
    >
      {children}
    </main>
  );
}
