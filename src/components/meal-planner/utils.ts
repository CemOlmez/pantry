/* ------------------------------------------------------------------ */
/*  Meal Planner Utilities                                             */
/* ------------------------------------------------------------------ */

import type { Macros } from "@/components/recipes/types";
import type { MealSlotType, MealPrepPlan } from "@/components/meal-prep/types";
import type { PlannerDay, PlannerSlot, PlannerWeek, PlannerMeal } from "./types";

const SLOT_TYPES: MealSlotType[] = ["breakfast", "lunch", "dinner", "snack"];

let plannerIdCounter = 0;
export function genPlannerId(): string {
  return `planner-${++plannerIdCounter}-${Date.now()}`;
}

/** Get the Monday of the week containing the given date */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // getDay: 0=Sun, 1=Mon ... 6=Sat  →  offset to Monday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Get array of 7 dates starting from startDate (Mon-Sun) */
export function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/** Format a Date as YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Create an empty PlannerWeek with 7 days, each having 4 empty slots */
export function createEmptyWeek(startDate: Date): PlannerWeek {
  const days = getWeekDays(startDate);
  return {
    startDate: formatDateKey(startDate),
    days: days.map((d) => ({
      date: formatDateKey(d),
      slots: SLOT_TYPES.map((type) => ({ type, meals: [] })),
    })),
  };
}

export function sumMacros(macros: Macros[]): Macros {
  return macros.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

/** Sum nutrition for a single slot */
export function getSlotNutrition(slot: PlannerSlot): Macros {
  return sumMacros(slot.meals.map((m) => m.nutrition));
}

/** Sum nutrition for a single day */
export function getDayNutrition(day: PlannerDay): Macros {
  return sumMacros(day.slots.map(getSlotNutrition));
}

/** Sum nutrition for the full week */
export function getWeekNutrition(week: PlannerWeek): Macros {
  return sumMacros(week.days.map(getDayNutrition));
}

/** Average daily nutrition for the week */
export function getWeekDailyAverage(week: PlannerWeek): Macros {
  const total = getWeekNutrition(week);
  const daysWithMeals = week.days.filter((d) =>
    d.slots.some((s) => s.meals.length > 0),
  ).length || 1;
  return {
    calories: Math.round(total.calories / daysWithMeals),
    protein: Math.round(total.protein / daysWithMeals),
    carbs: Math.round(total.carbs / daysWithMeals),
    fat: Math.round(total.fat / daysWithMeals),
  };
}

/** Import a MealPrepPlan into planner days starting from a given date */
export function importMealPrepToPlan(
  plan: MealPrepPlan,
  startDate: string,
): PlannerDay[] {
  const start = new Date(startDate + "T00:00:00");

  return plan.days.map((prepDay, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateKey = formatDateKey(d);

    const slots: PlannerSlot[] = SLOT_TYPES.map((slotType) => {
      const prepSlot = prepDay.meals.find((m) => m.type === slotType);
      const meals: PlannerMeal[] = prepSlot
        ? prepSlot.items.map((item) => ({
            id: genPlannerId(),
            name: item.name,
            recipeId: item.recipeId,
            mealPrepId: plan.id,
            nutrition: item.nutrition,
            servings: item.servings,
            source: "meal-prep" as const,
          }))
        : [];
      return { type: slotType, meals };
    });

    return { date: dateKey, slots };
  });
}
