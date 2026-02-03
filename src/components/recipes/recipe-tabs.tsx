"use client";

import { cn } from "@/lib/utils";
import type { RecipeTab } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type RecipeTabsProps = {
  activeTab: RecipeTab;
  onTabChange: (tab: RecipeTab) => void;
  labels: {
    discover: string;
    favorites: string;
    myRecipes: string;
  };
  counts?: {
    discover?: number;
    favorites?: number;
    myRecipes?: number;
  };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RecipeTabs({ activeTab, onTabChange, labels, counts }: RecipeTabsProps) {
  const tabs: { key: RecipeTab; label: string; count?: number }[] = [
    { key: "discover", label: labels.discover, count: counts?.discover },
    { key: "favorites", label: labels.favorites, count: counts?.favorites },
    { key: "my-recipes", label: labels.myRecipes, count: counts?.myRecipes },
  ];

  return (
    <div className="sticky top-0 z-10 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "relative flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm font-medium transition-colors",
              activeTab === tab.key
                ? "text-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            )}
          >
            <span className="flex items-center justify-center gap-2">
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full",
                    activeTab === tab.key
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {/* Active indicator */}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
