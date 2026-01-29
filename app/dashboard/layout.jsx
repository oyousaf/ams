export default function DashboardLayout({ children }) {
  return (
    <div className="fixed inset-0 h-dvh overflow-hidden bg-rose-950 [scrollbar-gutter:auto]">
      {children}
    </div>
  );
}
