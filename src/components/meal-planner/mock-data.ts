/* ------------------------------------------------------------------ */
/*  Mock Meal Planner Data                                             */
/* ------------------------------------------------------------------ */

import type { PlannerWeek, PlannerMeal } from "./types";
import { getWeekStart, formatDateKey, getWeekDays } from "./utils";

let idCounter = 0;
function genId(): string {
  return `mock-planner-${++idCounter}`;
}

function meal(
  name: string,
  nutrition: { calories: number; protein: number; carbs: number; fat: number },
  source: PlannerMeal["source"] = "recipe",
  servings = 1,
  recipeId?: string,
): PlannerMeal {
  return { id: genId(), name, nutrition, source, servings, recipeId };
}

/** Create a sample week anchored to the current week */
export function createSampleWeek(): PlannerWeek {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const days = getWeekDays(weekStart);

  return {
    startDate: formatDateKey(weekStart),
    days: [
      // Monday
      {
        date: formatDateKey(days[0]),
        slots: [
          {
            type: "breakfast",
            meals: [meal("Scrambled Eggs & Turkey Bacon", { calories: 380, protein: 32, carbs: 4, fat: 26 }, "custom")],
          },
          {
            type: "lunch",
            meals: [meal("Grilled Chicken & Quinoa Bowl", { calories: 520, protein: 45, carbs: 48, fat: 16 }, "recipe", 1, "recipe-1")],
          },
          {
            type: "dinner",
            meals: [meal("Salmon with Sweet Potato", { calories: 580, protein: 42, carbs: 38, fat: 28 }, "recipe", 1, "recipe-5")],
          },
          { type: "snack", meals: [meal("Greek Yogurt & Almonds", { calories: 220, protein: 20, carbs: 12, fat: 12 }, "custom")] },
        ],
      },
      // Tuesday
      {
        date: formatDateKey(days[1]),
        slots: [
          {
            type: "breakfast",
            meals: [meal("Protein Oatmeal", { calories: 350, protein: 28, carbs: 42, fat: 10 }, "custom")],
          },
          {
            type: "lunch",
            meals: [meal("Turkey & Black Bean Wrap", { calories: 480, protein: 38, carbs: 52, fat: 14 }, "meal-prep")],
          },
          {
            type: "dinner",
            meals: [meal("Beef Stir-Fry with Rice", { calories: 550, protein: 40, carbs: 50, fat: 20 }, "recipe", 1, "recipe-9")],
          },
          { type: "snack", meals: [] },
        ],
      },
      // Wednesday
      {
        date: formatDateKey(days[2]),
        slots: [
          { type: "breakfast", meals: [] },
          {
            type: "lunch",
            meals: [meal("Chicken Caesar Salad", { calories: 450, protein: 42, carbs: 18, fat: 24 }, "recipe", 1, "recipe-7")],
          },
          {
            type: "dinner",
            meals: [meal("Butter Chicken", { calories: 520, protein: 38, carbs: 24, fat: 32 }, "recipe", 1, "recipe-11")],
          },
          { type: "snack", meals: [] },
        ],
      },
      // Thursday
      {
        date: formatDateKey(days[3]),
        slots: [
          {
            type: "breakfast",
            meals: [meal("Avocado Toast with Poached Eggs", { calories: 320, protein: 14, carbs: 28, fat: 18 }, "recipe", 1, "recipe-15")],
          },
          { type: "lunch", meals: [] },
          {
            type: "dinner",
            meals: [meal("Street-Style Chicken Tacos", { calories: 380, protein: 32, carbs: 28, fat: 18 }, "recipe", 1, "recipe-3")],
          },
          { type: "snack", meals: [] },
        ],
      },
      // Friday
      {
        date: formatDateKey(days[4]),
        slots: [
          { type: "breakfast", meals: [] },
          {
            type: "lunch",
            meals: [meal("Loaded Veggie Burrito Bowl", { calories: 520, protein: 18, carbs: 78, fat: 16 }, "recipe", 1, "recipe-4")],
          },
          { type: "dinner", meals: [] },
          { type: "snack", meals: [] },
        ],
      },
      // Saturday
      {
        date: formatDateKey(days[5]),
        slots: [
          { type: "breakfast", meals: [] },
          { type: "lunch", meals: [] },
          { type: "dinner", meals: [] },
          { type: "snack", meals: [] },
        ],
      },
      // Sunday
      {
        date: formatDateKey(days[6]),
        slots: [
          { type: "breakfast", meals: [] },
          { type: "lunch", meals: [] },
          { type: "dinner", meals: [] },
          { type: "snack", meals: [] },
        ],
      },
    ],
  };
}
