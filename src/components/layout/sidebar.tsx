"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Home,
  BookOpen,
  CalendarDays,
  UtensilsCrossed,
  ShoppingCart,
  PanelLeftClose,
} from "lucide-react";
import { NavItem } from "@/components/ui/nav-item";
import { UserMenu } from "@/components/ui/user-menu";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", icon: <Home size={20} />, label: t("pantry") },
    { href: "/recipes", icon: <BookOpen size={20} />, label: t("recipes") },
    { href: "/meal-planner", icon: <CalendarDays size={20} />, label: t("mealPlanner") },
    { href: "/meal-prep", icon: <UtensilsCrossed size={20} />, label: t("mealPrep") },
    { href: "/shopping-list", icon: <ShoppingCart size={20} />, label: t("shoppingList") },
  ];

  return (
    <aside
      className={`group hidden md:flex md:flex-col md:fixed md:inset-y-0 overflow-visible bg-[var(--color-sidebar-bg)] transition-all duration-200 z-20 ${
        collapsed ? "md:w-16" : "md:w-60"
      }`}
    >
      {/* Logo area — acts as collapse/expand toggle */}
      {collapsed ? (
        /* Collapsed: logo by default, swap to expand icon on sidebar hover */
        <div className="flex justify-center px-3 py-4">
          <button
            onClick={() => setCollapsed(false)}
            className="p-1 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <Image
              src="/logo.png"
              alt="Pantry"
              width={28}
              height={28}
              className="block group-hover:hidden w-8 h-8"
            />
            <PanelLeftClose className="hidden group-hover:block text-[var(--color-text-tertiary)] rotate-180 w-8 h-8" />
          </button>
        </div>
      ) : (
        /* Expanded: logo + name + collapse icon */
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Pantry" width={28} height={28} className="w-8 h-8" />
            <span className="text-lg font-bold text-[var(--color-text)]">
              Pantry
            </span>
          </div>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <PanelLeftClose className="w-8 h-8" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 pl-2 pr-0 space-y-1 overflow-visible">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      {/* User menu */}
      <div className="overflow-visible px-2 pb-3">
        <div className="border-t border-[var(--color-sidebar-border)] mb-2" />
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
