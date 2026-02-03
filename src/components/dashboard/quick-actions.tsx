"use client";

import { Plus, Camera, BookOpen, ShoppingCart } from "lucide-react";
import { Link } from "@/i18n/navigation";

const actions = [
  { label: "Add Item", icon: Plus, href: "/pantry", color: "#E8913A" },
  { label: "Scan Item", icon: Camera, href: "/pantry", color: "#3B82F6" },
  { label: "Recipes", icon: BookOpen, href: "/recipes", color: "#4D9A4A" },
  { label: "Shop List", icon: ShoppingCart, href: "/shopping-list", color: "#8B5CF6" },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 sm:flex-col sm:gap-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm px-4 py-3.5 sm:px-4 sm:py-4 hover:border-[var(--color-border-hover)] transition-all cursor-pointer group"
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
              style={{ backgroundColor: action.color + "12" }}
            >
              <Icon size={18} style={{ color: action.color }} />
            </div>
            <span className="text-sm sm:text-xs font-medium text-[var(--color-text)]">{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
