/* ------------------------------------------------------------------ */
/*  Meal Planner Types                                                 */
/* ------------------------------------------------------------------ */

import type { Macros } from "@/components/recipes/types";
import type { MealSlotType } from "@/components/meal-prep/types";

export type PlannerMeal = {
  id: string;
  name: string;
  recipeId?: string;
  mealPrepId?: string;
  nutrition: Macros;
  servings: number;
  source: "recipe" | "meal-prep" | "custom";
};

export type PlannerSlot = {
  type: MealSlotType;
  meals: PlannerMeal[];
};

export type PlannerDay = {
  date: string; // YYYY-MM-DD
  slots: PlannerSlot[];
};

export type PlannerWeek = {
  startDate: string; // YYYY-MM-DD (Monday)
  days: PlannerDay[];
};

export type AddMealTarget = {
  date: string;
  slotType: MealSlotType;
};

export type AddMealMode = "recipe" | "meal-prep" | "custom";
