"use client";

import { ShoppingCart, Coffee, UtensilsCrossed, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

type MissingItem = {
  ingredient: string;
  meal: string;
  mealIcon: React.ElementType;
  mealColor: string;
};

const missingItems: MissingItem[] = [
  { ingredient: "Greek Yogurt", meal: "Breakfast", mealIcon: Coffee, mealColor: "#F59E0B" },
  { ingredient: "Fresh Berries", meal: "Breakfast", mealIcon: Coffee, mealColor: "#F59E0B" },
  { ingredient: "Chicken Breast", meal: "Lunch", mealIcon: UtensilsCrossed, mealColor: "#4D9A4A" },
  { ingredient: "Feta Cheese", meal: "Lunch", mealIcon: UtensilsCrossed, mealColor: "#4D9A4A" },
  { ingredient: "Almonds", meal: "Snack", mealIcon: Apple, mealColor: "#E8913A" },
];

export function MissingIngredients() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 to-rose-400" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[var(--color-primary)]/10">
              <ShoppingCart size={16} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)] leading-tight">
                Missing Ingredients
              </h2>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                For today&apos;s meals
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold">
            {missingItems.length} items
          </span>
        </div>

        {/* Ingredient list */}
        <div className="space-y-1.5 mb-5">
          {missingItems.map((item) => {
            const MealIcon = item.mealIcon;
            return (
              <div
                key={item.ingredient}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3.5 py-3 cursor-pointer",
                  "border-l-2 hover:bg-[var(--color-bg-secondary)] transition-all duration-150"
                )}
                style={{ borderLeftColor: item.mealColor }}
              >
                {/* Meal icon badge */}
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ backgroundColor: item.mealColor + "18" }}
                >
                  <MealIcon size={14} style={{ color: item.mealColor }} />
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate">
                    {item.ingredient}
                  </p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    {item.meal}
                  </p>
                </div>

                {/* Decorative checkbox circle */}
                <div className="w-5 h-5 rounded-full border-2 border-[var(--color-border)] shrink-0" />
              </div>
            );
          })}
        </div>

        {/* CTA button */}
        <button
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3",
            "bg-gradient-to-r from-[var(--color-primary)] to-amber-500 text-white",
            "text-sm font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
          )}
        >
          <ShoppingCart size={16} />
          Add all to shopping list
        </button>
      </div>
    </div>
  );
}
