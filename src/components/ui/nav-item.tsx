"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

export function NavItem({ href, icon, label, collapsed }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (isActive) {
    return (
      <div className="relative">
        {/* Top inverted corner — page color behind, sidebar color curves over */}
        <div className="absolute -top-3 right-0 h-3 w-3 z-10">
          <div className="h-full w-full bg-[var(--color-bg)]" />
          <div className="absolute inset-0 bg-[var(--color-sidebar-bg)] rounded-br-lg" />
        </div>

        <Link
          href={href}
          title={collapsed ? label : undefined}
          className={cn(
            "relative flex items-center text-sm font-medium bg-[var(--color-bg)] text-[var(--color-sidebar-item-active-text)] rounded-l-lg z-10",
            collapsed ? "justify-center p-2 mr-0" : "gap-3 px-3 py-2 -mr-2"
          )}
        >
          <span className="shrink-0">{icon}</span>
          {!collapsed && <span>{label}</span>}
        </Link>

        {/* Bottom inverted corner — page color behind, sidebar color curves over */}
        <div className="absolute -bottom-3 right-0 h-3 w-3 z-10">
          <div className="h-full w-full bg-[var(--color-bg)]" />
          <div className="absolute inset-0 bg-[var(--color-sidebar-bg)] rounded-tr-lg" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-lg text-sm font-medium transition-colors",
        collapsed ? "justify-center p-2" : "gap-3 px-3 py-2",
        "text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text)]"
      )}
    >
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
