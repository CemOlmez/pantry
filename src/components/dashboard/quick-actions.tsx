"use client";

import { Plus, Camera, BookOpen, ShoppingCart, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

const actions: QuickAction[] = [
  {
    label: "Add Item",
    description: "to your pantry",
    icon: Plus,
    href: "/pantry",
    gradient: "bg-gradient-to-br from-orange-400 to-amber-500",
  },
  {
    label: "Scan Item",
    description: "barcode or photo",
    icon: Camera,
    href: "/pantry",
    gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    label: "Recipes",
    description: "find what to cook",
    icon: BookOpen,
    href: "/recipes",
    gradient: "bg-gradient-to-br from-emerald-400 to-green-600",
  },
  {
    label: "Shop List",
    description: "what you need",
    icon: ShoppingCart,
    href: "/shopping-list",
    gradient: "bg-gradient-to-br from-purple-400 to-violet-600",
  },
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
            className={cn(
              "group relative rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]",
              "shadow-sm overflow-hidden",
              "hover:shadow-lg hover:-translate-y-1 transition-all duration-200",
              "active:scale-[0.98]",
              // Mobile: horizontal layout
              "flex flex-row items-center gap-3 p-3",
              // Desktop: vertical layout, centered
              "sm:flex-col sm:items-center sm:gap-2.5 sm:px-4 sm:py-5"
            )}
          >
            {/* Icon area with gradient background */}
            <div
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-xl shrink-0",
                "shadow-sm",
                action.gradient
              )}
            >
              <Icon size={22} className="text-white" strokeWidth={2.25} />
            </div>

            {/* Text content */}
            <div className="flex flex-col sm:items-center">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                {action.label}
              </span>
              <span className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {action.description}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
