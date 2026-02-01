"use client";

import { Coffee, UtensilsCrossed, ChefHat, Apple } from "lucide-react";
import { cn } from "@/lib/utils";

type MealSlot = {
  type: string;
  icon: React.ElementType;
  name: string | null;
  calories: number | null;
};

const meals: MealSlot[] = [
  { type: "Breakfast", icon: Coffee, name: "Greek Yogurt with Berries", calories: 280 },
  { type: "Lunch", icon: UtensilsCrossed, name: "Grilled Chicken Salad", calories: 450 },
  { type: "Dinner", icon: ChefHat, name: null, calories: null },
  { type: "Snack", icon: Apple, name: "Mixed Nuts", calories: 180 },
];

export function TodaysMeals() {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5">
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">
        Today&apos;s Meals
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {meals.map((meal) => {
          const Icon = meal.icon;
          const isEmpty = !meal.name;
          return (
            <div
              key={meal.type}
              className={cn(
                "rounded-lg p-3 flex items-start gap-3",
                isEmpty
                  ? "border-2 border-dashed border-[var(--color-border)]"
                  : "bg-[var(--color-bg-secondary)]"
              )}
            >
              <Icon className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--color-text-secondary)]">
                  {meal.type}
                </p>
                {isEmpty ? (
                  <p className="text-sm text-[var(--color-text-secondary)] italic">
                    No meal planned
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">
                      {meal.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {meal.calories} cal
                    </p>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
