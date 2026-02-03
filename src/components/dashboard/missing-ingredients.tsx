"use client";

import { ShoppingCart, Coffee, UtensilsCrossed, Apple } from "lucide-react";

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
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]/10">
              <ShoppingCart size={15} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[var(--color-text)]">Missing Ingredients</h2>
              <p className="text-xs text-[var(--color-text-tertiary)]">For today&apos;s meals</p>
            </div>
          </div>
          <span className="text-xs font-medium text-[var(--color-primary)]">
            {missingItems.length} items
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {missingItems.map((item) => {
            const MealIcon = item.mealIcon;
            return (
              <div
                key={item.ingredient}
                className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-3.5 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors cursor-pointer"
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ backgroundColor: item.mealColor + "12" }}
                >
                  <MealIcon size={14} style={{ color: item.mealColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)]">{item.ingredient}</p>
                  <p className="text-xs text-[var(--color-text-tertiary)]">{item.meal}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="flex items-center justify-center gap-2 w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-[var(--color-text-inverse)] hover:opacity-90 transition-opacity cursor-pointer">
          <ShoppingCart size={16} />
          Add all to shopping list
        </button>
      </div>
    </div>
  );
}
