"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { NavItem } from "@/components/ui/nav-item";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { UserMenu } from "@/components/ui/user-menu";

export function Sidebar() {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", icon: "🏠", label: t("pantry") },
    { href: "/recipes", icon: "📖", label: t("recipes") },
    { href: "/meal-planner", icon: "📅", label: t("mealPlanner") },
    { href: "/meal-prep", icon: "🍱", label: t("mealPrep") },
    { href: "/shopping-list", icon: "🛒", label: t("shoppingList") },
  ];

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)]">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/logo.png" alt="Pantry" width={36} height={36} />
        <span className="text-lg font-bold text-[var(--color-text)]">
          Pantry
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-3">
        <div className="px-2 space-y-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <div className="border-t border-[var(--color-sidebar-border)] pt-3">
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}
