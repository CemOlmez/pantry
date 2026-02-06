"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PlannerMeal } from "./types";

interface MealChipProps {
  meal: PlannerMeal;
  onRemove: () => void;
}

const SOURCE_STYLES: Record<PlannerMeal["source"], string> = {
  recipe: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300",
  "meal-prep": "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300",
  custom: "bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/40 dark:border-orange-800 dark:text-orange-300",
};

export function MealChip({ meal, onRemove }: MealChipProps) {
  return (
    <div
      className={cn(
        "group/chip flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all",
        SOURCE_STYLES[meal.source],
      )}
    >
      <span className="truncate max-w-[100px] font-medium">{meal.name}</span>
      <span className="shrink-0 opacity-70">{meal.nutrition.calories}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="shrink-0 ml-0.5 opacity-0 group-hover/chip:opacity-100 transition-opacity p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer"
      >
        <X size={12} />
      </button>
    </div>
  );
}
