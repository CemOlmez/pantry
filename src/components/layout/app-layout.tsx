import { Sidebar } from "./sidebar";
import { BottomTabs } from "./bottom-tabs";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main className="md:pl-60">
        <div className="p-4 pb-20 md:p-8 md:pb-8">{children}</div>
      </main>
      <BottomTabs />
    </div>
  );
}
