"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BottomTabs() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: "🏠", label: t("pantry") },
    { href: "/recipes", icon: "📖", label: t("recipes") },
    { href: "/meal-planner", icon: "📅", label: t("mealPlanner") },
    { href: "/meal-prep", icon: "🍱", label: t("mealPrep") },
    { href: "/shopping-list", icon: "🛒", label: t("shoppingList") },
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
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
