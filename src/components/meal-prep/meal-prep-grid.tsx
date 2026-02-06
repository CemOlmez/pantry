"use client";

import { MealPrepCard } from "./meal-prep-card";
import type { MealPrepPlan } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type MealPrepGridProps = {
  plans: MealPrepPlan[];
  onToggleFavorite?: (id: string) => void;
  emptyState?: React.ReactNode;
  cardLabels: {
    days: string;
    meals: string;
    calDay: string;
    draft: string;
  };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MealPrepGrid({
  plans,
  onToggleFavorite,
  emptyState,
  cardLabels,
}: MealPrepGridProps) {
  if (plans.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {plans.map((plan) => (
        <MealPrepCard
          key={plan.id}
          plan={plan}
          onToggleFavorite={onToggleFavorite}
          labels={cardLabels}
        />
      ))}
    </div>
  );
}
