"use client";

import { Coffee, UtensilsCrossed, ChefHat, Apple, CalendarDays, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type MealSlot = {
  type: string;
  icon: React.ElementType;
  name: string | null;
  calories: number | null;
  iconBg: string;
  iconColor: string;
};

const meals: MealSlot[] = [
  {
    type: "Breakfast",
    icon: Coffee,
    name: "Greek Yogurt with Berries",
    calories: 280,
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-500",
  },
  {
    type: "Lunch",
    icon: UtensilsCrossed,
    name: "Grilled Chicken Salad",
    calories: 450,
    iconBg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
  },
  {
    type: "Dinner",
    icon: ChefHat,
    name: null,
    calories: null,
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
  },
  {
    type: "Snack",
    icon: Apple,
    name: "Mixed Nuts",
    calories: 180,
    iconBg: "bg-rose-50 dark:bg-rose-950/30",
    iconColor: "text-rose-500",
  },
];

export function TodaysMeals() {
  const totalCalories = meals.reduce((sum, m) => sum + (m.calories ?? 0), 0);

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/30">
              <CalendarDays size={15} className="text-violet-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Today&apos;s Meals
            </h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--color-text)] tabular-nums">
              {totalCalories} kcal
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">total planned</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {meals.map((meal) => {
            const Icon = meal.icon;
            const isEmpty = !meal.name;
            return (
              <div
                key={meal.type}
                className={cn(
                  "rounded-xl p-3.5 flex items-start gap-3 transition-colors cursor-pointer",
                  isEmpty
                    ? "border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-secondary)]"
                    : "bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-tertiary)]"
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                    meal.iconBg
                  )}
                >
                  <Icon size={15} className={meal.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-0.5">
                    {meal.type}
                  </p>
                  {isEmpty ? (
                    <div className="flex items-center gap-1.5">
                      <Plus size={12} className="text-[var(--color-text-tertiary)]" />
                      <p className="text-sm text-[var(--color-text-tertiary)]">
                        Plan a meal
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[var(--color-text)] truncate">
                        {meal.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-0.5 tabular-nums">
                        {meal.calories} kcal
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
