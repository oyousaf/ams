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
