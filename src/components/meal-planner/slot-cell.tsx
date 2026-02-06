"use client";

import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerSlot } from "./types";
import { MealChip } from "./meal-chip";
import { getSlotNutrition } from "./utils";

interface SlotCellProps {
  slot: PlannerSlot;
  isToday: boolean;
  onAddMeal: () => void;
  onRemoveMeal: (mealId: string) => void;
}

export function SlotCell({ slot, isToday, onAddMeal, onRemoveMeal }: SlotCellProps) {
  const nutrition = getSlotNutrition(slot);
  const hasMeals = slot.meals.length > 0;

  return (
    <div
      className={cn(
        "min-h-[72px] p-1.5 rounded-xl border border-[var(--color-border)] transition-all group/cell",
        isToday
          ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20"
          : "bg-[var(--color-surface)] hover:border-[var(--color-border-hover)]",
      )}
    >
      <div className="flex flex-col gap-1 h-full">
        {/* Meal chips */}
        {slot.meals.map((meal) => (
          <MealChip
            key={meal.id}
            meal={meal}
            onRemove={() => onRemoveMeal(meal.id)}
          />
        ))}

        {/* Add button */}
        <button
          onClick={onAddMeal}
          className={cn(
            "flex items-center justify-center gap-1 rounded-lg border border-dashed transition-all cursor-pointer",
            "border-[var(--color-border)] text-[var(--color-text-tertiary)]",
            "hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
            hasMeals ? "py-0.5 text-xs" : "py-3 text-sm",
          )}
        >
          <Plus size={14} />
        </button>

        {/* Calorie total */}
        {hasMeals && (
          <div className="text-[10px] text-[var(--color-text-tertiary)] text-right mt-auto">
            {nutrition.calories} cal
          </div>
        )}
      </div>
    </div>
  );
}
