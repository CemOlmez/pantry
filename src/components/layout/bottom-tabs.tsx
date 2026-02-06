"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Refrigerator,
  BookOpen,
  CalendarDays,
  UtensilsCrossed,
} from "lucide-react";

export function BottomTabs() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: <LayoutDashboard size={20} />, label: t("dashboard") },
    { href: "/pantry", icon: <Refrigerator size={20} />, label: t("pantry") },
    { href: "/recipes", icon: <BookOpen size={20} />, label: t("recipes") },
    { href: "/meal-planner", icon: <CalendarDays size={20} />, label: t("mealPlanner") },
    { href: "/meal-prep", icon: <UtensilsCrossed size={20} />, label: t("mealPrep") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[var(--color-tabs-border)] bg-[var(--color-tabs-bg)]">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-[var(--color-tabs-active)]"
                  : "text-[var(--color-tabs-inactive)]"
              )}
            >
              {tab.icon}
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
