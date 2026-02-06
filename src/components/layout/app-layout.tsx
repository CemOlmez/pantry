"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { BottomTabs } from "./bottom-tabs";
import { MobileHeader } from "./mobile-header";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <MobileHeader />
      <main
        className={`transition-all duration-200 ${
          collapsed ? "md:pl-16" : "md:pl-60"
        }`}
      >
        <div className="p-4 pb-20 md:p-8 md:pb-8">{children}</div>
      </main>
      <BottomTabs />
    </div>
  );
}
