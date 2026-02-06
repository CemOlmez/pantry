import type { Macros } from "@/components/recipes/types";
import type {
  MealPrepPlan,
  MealPrepDay,
  MealSlot,
  MealItem,
  Author,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Authors                                                            */
/* ------------------------------------------------------------------ */

const authors: Author[] = [
  { id: "1", name: "Maria Chen" },
  { id: "2", name: "James Wilson" },
  { id: "3", name: "Sofia Rodriguez" },
  { id: "4", name: "Alex Kim" },
  { id: "current", name: "You" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

let idCounter = 0;
function genId(prefix = "mp") {
  return `${prefix}-${++idCounter}`;
}

const today = new Date().toISOString();

function item(
  name: string,
  servings: number,
  nutrition: Macros,
  ingredients: { name: string; quantity: number; unit: string }[],
  recipeId?: string
): MealItem {
  return {
    id: genId("item"),
    name,
    recipeId,
    servings,
    ingredients: ingredients.map((i) => ({ ...i, inPantry: false })),
    nutrition,
  };
}

function slot(type: MealSlot["type"], items: MealItem[]): MealSlot {
  return { type, items };
}

function day(dayIndex: number, label: string, meals: MealSlot[]): MealPrepDay {
  return { dayIndex, label, meals };
}

/* ------------------------------------------------------------------ */
/*  Nutrition calculation helpers                                      */
/* ------------------------------------------------------------------ */

export function sumMacros(macros: Macros[]): Macros {
  return macros.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein: acc.protein + m.protein,
      carbs: acc.carbs + m.carbs,
      fat: acc.fat + m.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export function getSlotNutrition(s: MealSlot): Macros {
  return sumMacros(s.items.map((i) => i.nutrition));
}

export function getDayNutrition(d: MealPrepDay): Macros {
  return sumMacros(d.meals.map(getSlotNutrition));
}

export function getPlanNutrition(plan: MealPrepPlan): Macros {
  return sumMacros(plan.days.map(getDayNutrition));
}

export function getPlanDailyAverage(plan: MealPrepPlan): Macros {
  const total = getPlanNutrition(plan);
  const numDays = plan.days.length || 1;
  return {
    calories: Math.round(total.calories / numDays),
    protein: Math.round(total.protein / numDays),
    carbs: Math.round(total.carbs / numDays),
    fat: Math.round(total.fat / numDays),
  };
}

export function getTotalMeals(plan: MealPrepPlan): number {
  return plan.days.reduce(
    (sum, d) => sum + d.meals.reduce((s, m) => s + m.items.length, 0),
    0
  );
}

export function aggregateIngredients(
  plan: MealPrepPlan
): { name: string; quantity: number; unit: string }[] {
  const map = new Map<string, { quantity: number; unit: string }>();
  for (const d of plan.days) {
    for (const m of d.meals) {
      for (const it of m.items) {
        for (const ing of it.ingredients) {
          const key = `${ing.name}__${ing.unit}`;
          const existing = map.get(key);
          if (existing) {
            existing.quantity += ing.quantity;
          } else {
            map.set(key, { quantity: ing.quantity, unit: ing.unit });
          }
        }
      }
    }
  }
  return Array.from(map.entries()).map(([key, val]) => ({
    name: key.split("__")[0],
    quantity: Math.round(val.quantity * 10) / 10,
    unit: val.unit,
  }));
}

/* ------------------------------------------------------------------ */
/*  Mock Meal Prep Plans                                               */
/* ------------------------------------------------------------------ */

export const mockMealPreps: MealPrepPlan[] = [
  // 1. High Protein Weekly Prep
  {
    id: genId(),
    title: "High Protein Weekly Prep",
    description:
      "A 7-day high-protein meal plan designed for muscle building and recovery. Packed with lean meats, eggs, and legumes.",
    placeholderType: "protein",
    author: authors[0],
    planType: "weekly",
    difficulty: "medium",
    dietaryTags: ["high-protein", "gluten-free"],
    rating: 4.8,
    reviewCount: 156,
    isPublished: true,
    isFavorite: true,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Monday", [
        slot("breakfast", [
          item("Scrambled Eggs & Turkey Bacon", 1, { calories: 380, protein: 32, carbs: 4, fat: 26 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Turkey Breast", quantity: 100, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Grilled Chicken & Quinoa Bowl", 1, { calories: 520, protein: 45, carbs: 48, fat: 16 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Salmon with Sweet Potato", 1, { calories: 580, protein: 42, carbs: 38, fat: 28 }, [
            { name: "Salmon Fillet", quantity: 200, unit: "g" },
            { name: "Sweet Potato", quantity: 200, unit: "g" },
            { name: "Asparagus", quantity: 100, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Greek Yogurt & Almonds", 1, { calories: 220, protein: 20, carbs: 12, fat: 12 }, [
            { name: "Greek Yogurt", quantity: 200, unit: "g" },
            { name: "Almonds", quantity: 30, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tsp" },
          ]),
        ]),
      ]),
      day(1, "Tuesday", [
        slot("breakfast", [
          item("Protein Oatmeal", 1, { calories: 350, protein: 28, carbs: 42, fat: 10 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Protein Powder", quantity: 1, unit: "scoop" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Peanut Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Turkey & Black Bean Wrap", 1, { calories: 480, protein: 38, carbs: 52, fat: 14 }, [
            { name: "Ground Turkey", quantity: 150, unit: "g" },
            { name: "Black Beans", quantity: 100, unit: "g" },
            { name: "Tortillas", quantity: 2, unit: "pieces" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
          ]),
        ]),
        slot("dinner", [
          item("Beef Stir-Fry with Rice", 1, { calories: 550, protein: 40, carbs: 50, fat: 20 }, [
            { name: "Beef Steak", quantity: 200, unit: "g" },
            { name: "Basmati Rice", quantity: 150, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Cottage Cheese & Berries", 1, { calories: 180, protein: 18, carbs: 16, fat: 6 }, [
            { name: "Cottage Cheese", quantity: 150, unit: "g" },
            { name: "Blueberries", quantity: 100, unit: "g" },
          ]),
        ]),
      ]),
      day(2, "Wednesday", [
        slot("breakfast", [
          item("Egg White Omelette", 1, { calories: 300, protein: 30, carbs: 8, fat: 16 }, [
            { name: "Eggs", quantity: 4, unit: "pieces" },
            { name: "Mushrooms", quantity: 80, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Feta Cheese", quantity: 30, unit: "g" },
          ]),
        ]),
        slot("lunch", [
          item("Chicken Caesar Salad", 1, { calories: 450, protein: 42, carbs: 18, fat: 24 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Lettuce", quantity: 150, unit: "g" },
            { name: "Parmesan", quantity: 30, unit: "g" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Grilled Cod with Vegetables", 1, { calories: 420, protein: 38, carbs: 28, fat: 18 }, [
            { name: "Cod", quantity: 200, unit: "g" },
            { name: "Potatoes", quantity: 200, unit: "g" },
            { name: "Carrots", quantity: 100, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Protein Shake", 1, { calories: 200, protein: 30, carbs: 8, fat: 4 }, [
            { name: "Protein Powder", quantity: 1, unit: "scoop" },
            { name: "Almond Milk", quantity: 250, unit: "ml" },
            { name: "Bananas", quantity: 0.5, unit: "pieces" },
          ]),
        ]),
      ]),
      day(3, "Thursday", [
        slot("breakfast", [
          item("Scrambled Eggs & Turkey Bacon", 1, { calories: 380, protein: 32, carbs: 4, fat: 26 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Turkey Breast", quantity: 100, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Tuna Salad Bowl", 1, { calories: 400, protein: 36, carbs: 22, fat: 20 }, [
            { name: "Tuna", quantity: 2, unit: "cans" },
            { name: "Quinoa", quantity: 100, unit: "g" },
            { name: "Cucumber", quantity: 1, unit: "pieces" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Chicken Thigh & Brown Rice", 1, { calories: 560, protein: 44, carbs: 50, fat: 22 }, [
            { name: "Chicken Thighs", quantity: 250, unit: "g" },
            { name: "Brown Rice", quantity: 150, unit: "g" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
            { name: "Soy Sauce", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Greek Yogurt & Almonds", 1, { calories: 220, protein: 20, carbs: 12, fat: 12 }, [
            { name: "Greek Yogurt", quantity: 200, unit: "g" },
            { name: "Almonds", quantity: 30, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tsp" },
          ]),
        ]),
      ]),
      day(4, "Friday", [
        slot("breakfast", [
          item("Protein Oatmeal", 1, { calories: 350, protein: 28, carbs: 42, fat: 10 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Protein Powder", quantity: 1, unit: "scoop" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Peanut Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Grilled Chicken & Quinoa Bowl", 1, { calories: 520, protein: 45, carbs: 48, fat: 16 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Shrimp Stir-Fry", 1, { calories: 420, protein: 36, carbs: 40, fat: 14 }, [
            { name: "Shrimp", quantity: 200, unit: "g" },
            { name: "Basmati Rice", quantity: 150, unit: "g" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Mixed Nuts", 1, { calories: 180, protein: 6, carbs: 8, fat: 16 }, [
            { name: "Mixed Nuts", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(5, "Saturday", [
        slot("breakfast", [
          item("Egg White Omelette", 1, { calories: 300, protein: 30, carbs: 8, fat: 16 }, [
            { name: "Eggs", quantity: 4, unit: "pieces" },
            { name: "Mushrooms", quantity: 80, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Feta Cheese", quantity: 30, unit: "g" },
          ]),
        ]),
        slot("lunch", [
          item("Turkey & Black Bean Wrap", 1, { calories: 480, protein: 38, carbs: 52, fat: 14 }, [
            { name: "Ground Turkey", quantity: 150, unit: "g" },
            { name: "Black Beans", quantity: 100, unit: "g" },
            { name: "Tortillas", quantity: 2, unit: "pieces" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
          ]),
        ]),
        slot("dinner", [
          item("Salmon with Sweet Potato", 1, { calories: 580, protein: 42, carbs: 38, fat: 28 }, [
            { name: "Salmon Fillet", quantity: 200, unit: "g" },
            { name: "Sweet Potato", quantity: 200, unit: "g" },
            { name: "Asparagus", quantity: 100, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Protein Shake", 1, { calories: 200, protein: 30, carbs: 8, fat: 4 }, [
            { name: "Protein Powder", quantity: 1, unit: "scoop" },
            { name: "Almond Milk", quantity: 250, unit: "ml" },
            { name: "Bananas", quantity: 0.5, unit: "pieces" },
          ]),
        ]),
      ]),
      day(6, "Sunday", [
        slot("breakfast", [
          item("Scrambled Eggs & Turkey Bacon", 1, { calories: 380, protein: 32, carbs: 4, fat: 26 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Turkey Breast", quantity: 100, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Chicken Caesar Salad", 1, { calories: 450, protein: 42, carbs: 18, fat: 24 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Lettuce", quantity: 150, unit: "g" },
            { name: "Parmesan", quantity: 30, unit: "g" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Beef Stir-Fry with Rice", 1, { calories: 550, protein: 40, carbs: 50, fat: 20 }, [
            { name: "Beef Steak", quantity: 200, unit: "g" },
            { name: "Basmati Rice", quantity: 150, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Cottage Cheese & Berries", 1, { calories: 180, protein: 18, carbs: 16, fat: 6 }, [
            { name: "Cottage Cheese", quantity: 150, unit: "g" },
            { name: "Blueberries", quantity: 100, unit: "g" },
          ]),
        ]),
      ]),
    ],
  },

  // 2. Budget Vegan Meal Prep
  {
    id: genId(),
    title: "Budget Vegan Meal Prep",
    description:
      "An affordable 5-day vegan meal plan using simple, budget-friendly ingredients. Rich in fiber and plant protein.",
    placeholderType: "vegan",
    author: authors[1],
    planType: "weekly",
    difficulty: "easy",
    dietaryTags: ["vegan", "vegetarian", "dairy-free"],
    rating: 4.6,
    reviewCount: 98,
    isPublished: true,
    isFavorite: false,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Monday", [
        slot("breakfast", [
          item("Overnight Oats with Banana", 1, { calories: 320, protein: 10, carbs: 56, fat: 8 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Oat Milk", quantity: 200, unit: "ml" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Cinnamon", quantity: 1, unit: "tsp" },
          ]),
        ]),
        slot("lunch", [
          item("Chickpea Curry with Rice", 1, { calories: 480, protein: 16, carbs: 72, fat: 14 }, [
            { name: "Chickpeas", quantity: 200, unit: "g" },
            { name: "Basmati Rice", quantity: 150, unit: "g" },
            { name: "Diced Tomatoes", quantity: 200, unit: "g" },
            { name: "Cumin", quantity: 1, unit: "tsp" },
            { name: "Turmeric", quantity: 0.5, unit: "tsp" },
          ]),
        ]),
        slot("dinner", [
          item("Black Bean Tacos", 1, { calories: 420, protein: 18, carbs: 62, fat: 12 }, [
            { name: "Black Beans", quantity: 200, unit: "g" },
            { name: "Tortillas", quantity: 3, unit: "pieces" },
            { name: "Avocado", quantity: 0.5, unit: "pieces" },
            { name: "Tomatoes", quantity: 1, unit: "pieces" },
          ]),
        ]),
        slot("snack", [
          item("Apple & Peanut Butter", 1, { calories: 280, protein: 8, carbs: 30, fat: 16 }, [
            { name: "Apples", quantity: 1, unit: "pieces" },
            { name: "Peanut Butter", quantity: 2, unit: "tbsp" },
          ]),
        ]),
      ]),
      day(1, "Tuesday", [
        slot("breakfast", [
          item("Tofu Scramble", 1, { calories: 300, protein: 20, carbs: 12, fat: 20 }, [
            { name: "Tofu", quantity: 200, unit: "g" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Turmeric", quantity: 0.5, unit: "tsp" },
          ]),
        ]),
        slot("lunch", [
          item("Lentil Soup", 1, { calories: 380, protein: 22, carbs: 56, fat: 6 }, [
            { name: "Lentils", quantity: 200, unit: "g" },
            { name: "Carrots", quantity: 2, unit: "pieces" },
            { name: "Onions", quantity: 1, unit: "pieces" },
            { name: "Garlic", quantity: 3, unit: "cloves" },
          ]),
        ]),
        slot("dinner", [
          item("Veggie Stir-Fry with Noodles", 1, { calories: 440, protein: 12, carbs: 68, fat: 14 }, [
            { name: "Rice Noodles", quantity: 200, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Carrots", quantity: 1, unit: "pieces" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Mixed Nuts", 1, { calories: 180, protein: 6, carbs: 8, fat: 16 }, [
            { name: "Mixed Nuts", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(2, "Wednesday", [
        slot("breakfast", [
          item("Overnight Oats with Banana", 1, { calories: 320, protein: 10, carbs: 56, fat: 8 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Oat Milk", quantity: 200, unit: "ml" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Cinnamon", quantity: 1, unit: "tsp" },
          ]),
        ]),
        slot("lunch", [
          item("Quinoa & Black Bean Salad", 1, { calories: 420, protein: 18, carbs: 60, fat: 12 }, [
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Black Beans", quantity: 150, unit: "g" },
            { name: "Tomatoes", quantity: 2, unit: "pieces" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Chickpea Curry with Rice", 1, { calories: 480, protein: 16, carbs: 72, fat: 14 }, [
            { name: "Chickpeas", quantity: 200, unit: "g" },
            { name: "Basmati Rice", quantity: 150, unit: "g" },
            { name: "Diced Tomatoes", quantity: 200, unit: "g" },
            { name: "Cumin", quantity: 1, unit: "tsp" },
          ]),
        ]),
        slot("snack", [
          item("Apple & Peanut Butter", 1, { calories: 280, protein: 8, carbs: 30, fat: 16 }, [
            { name: "Apples", quantity: 1, unit: "pieces" },
            { name: "Peanut Butter", quantity: 2, unit: "tbsp" },
          ]),
        ]),
      ]),
      day(3, "Thursday", [
        slot("breakfast", [
          item("Tofu Scramble", 1, { calories: 300, protein: 20, carbs: 12, fat: 20 }, [
            { name: "Tofu", quantity: 200, unit: "g" },
            { name: "Bell Peppers", quantity: 1, unit: "pieces" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Turmeric", quantity: 0.5, unit: "tsp" },
          ]),
        ]),
        slot("lunch", [
          item("Lentil Soup", 1, { calories: 380, protein: 22, carbs: 56, fat: 6 }, [
            { name: "Lentils", quantity: 200, unit: "g" },
            { name: "Carrots", quantity: 2, unit: "pieces" },
            { name: "Onions", quantity: 1, unit: "pieces" },
            { name: "Garlic", quantity: 3, unit: "cloves" },
          ]),
        ]),
        slot("dinner", [
          item("Black Bean Tacos", 1, { calories: 420, protein: 18, carbs: 62, fat: 12 }, [
            { name: "Black Beans", quantity: 200, unit: "g" },
            { name: "Tortillas", quantity: 3, unit: "pieces" },
            { name: "Avocado", quantity: 0.5, unit: "pieces" },
            { name: "Tomatoes", quantity: 1, unit: "pieces" },
          ]),
        ]),
        slot("snack", [
          item("Mixed Nuts", 1, { calories: 180, protein: 6, carbs: 8, fat: 16 }, [
            { name: "Mixed Nuts", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(4, "Friday", [
        slot("breakfast", [
          item("Overnight Oats with Banana", 1, { calories: 320, protein: 10, carbs: 56, fat: 8 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Oat Milk", quantity: 200, unit: "ml" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Cinnamon", quantity: 1, unit: "tsp" },
          ]),
        ]),
        slot("lunch", [
          item("Veggie Stir-Fry with Noodles", 1, { calories: 440, protein: 12, carbs: 68, fat: 14 }, [
            { name: "Rice Noodles", quantity: 200, unit: "g" },
            { name: "Broccoli", quantity: 100, unit: "g" },
            { name: "Carrots", quantity: 1, unit: "pieces" },
            { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("dinner", [
          item("Quinoa & Black Bean Salad", 1, { calories: 420, protein: 18, carbs: 60, fat: 12 }, [
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Black Beans", quantity: 150, unit: "g" },
            { name: "Tomatoes", quantity: 2, unit: "pieces" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Apple & Peanut Butter", 1, { calories: 280, protein: 8, carbs: 30, fat: 16 }, [
            { name: "Apples", quantity: 1, unit: "pieces" },
            { name: "Peanut Butter", quantity: 2, unit: "tbsp" },
          ]),
        ]),
      ]),
    ],
  },

  // 3. Keto 5-Day Plan
  {
    id: genId(),
    title: "Keto 5-Day Plan",
    description:
      "A strict ketogenic meal plan with under 25g net carbs per day. High fat, moderate protein for ketosis.",
    placeholderType: "keto",
    author: authors[2],
    planType: "weekly",
    difficulty: "hard",
    dietaryTags: ["keto", "low-carb", "gluten-free"],
    rating: 4.5,
    reviewCount: 87,
    isPublished: true,
    isFavorite: true,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Monday", [
        slot("breakfast", [
          item("Bacon & Eggs", 1, { calories: 450, protein: 28, carbs: 2, fat: 38 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Bacon", quantity: 80, unit: "g" },
            { name: "Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Avocado Chicken Salad", 1, { calories: 520, protein: 35, carbs: 8, fat: 40 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Avocado", quantity: 1, unit: "pieces" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
            { name: "Lettuce", quantity: 100, unit: "g" },
          ]),
        ]),
        slot("dinner", [
          item("Salmon with Buttered Asparagus", 1, { calories: 520, protein: 38, carbs: 6, fat: 38 }, [
            { name: "Salmon Fillet", quantity: 200, unit: "g" },
            { name: "Asparagus", quantity: 150, unit: "g" },
            { name: "Butter", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Cheese & Almonds", 1, { calories: 250, protein: 14, carbs: 4, fat: 22 }, [
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
            { name: "Almonds", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(1, "Tuesday", [
        slot("breakfast", [
          item("Keto Egg Muffins", 1, { calories: 380, protein: 24, carbs: 4, fat: 30 }, [
            { name: "Eggs", quantity: 4, unit: "pieces" },
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Mushrooms", quantity: 50, unit: "g" },
          ]),
        ]),
        slot("lunch", [
          item("Beef Lettuce Wraps", 1, { calories: 480, protein: 32, carbs: 6, fat: 36 }, [
            { name: "Ground Beef", quantity: 200, unit: "g" },
            { name: "Lettuce", quantity: 100, unit: "g" },
            { name: "Sour Cream", quantity: 2, unit: "tbsp" },
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
          ]),
        ]),
        slot("dinner", [
          item("Pork Chops with Cauliflower Mash", 1, { calories: 500, protein: 36, carbs: 8, fat: 38 }, [
            { name: "Pork Chops", quantity: 200, unit: "g" },
            { name: "Cauliflower", quantity: 200, unit: "g" },
            { name: "Butter", quantity: 2, unit: "tbsp" },
            { name: "Heavy Cream", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Dark Chocolate Square", 1, { calories: 170, protein: 2, carbs: 6, fat: 14 }, [
            { name: "Dark Chocolate", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(2, "Wednesday", [
        slot("breakfast", [
          item("Bacon & Eggs", 1, { calories: 450, protein: 28, carbs: 2, fat: 38 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Bacon", quantity: 80, unit: "g" },
            { name: "Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Tuna Salad Lettuce Wrap", 1, { calories: 380, protein: 30, carbs: 4, fat: 28 }, [
            { name: "Tuna", quantity: 2, unit: "cans" },
            { name: "Mayonnaise", quantity: 2, unit: "tbsp" },
            { name: "Lettuce", quantity: 100, unit: "g" },
            { name: "Cucumber", quantity: 0.5, unit: "pieces" },
          ]),
        ]),
        slot("dinner", [
          item("Chicken Thighs with Broccoli", 1, { calories: 520, protein: 40, carbs: 8, fat: 36 }, [
            { name: "Chicken Thighs", quantity: 250, unit: "g" },
            { name: "Broccoli", quantity: 150, unit: "g" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
            { name: "Garlic", quantity: 3, unit: "cloves" },
          ]),
        ]),
        slot("snack", [
          item("Cheese & Almonds", 1, { calories: 250, protein: 14, carbs: 4, fat: 22 }, [
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
            { name: "Almonds", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(3, "Thursday", [
        slot("breakfast", [
          item("Keto Egg Muffins", 1, { calories: 380, protein: 24, carbs: 4, fat: 30 }, [
            { name: "Eggs", quantity: 4, unit: "pieces" },
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
            { name: "Spinach", quantity: 50, unit: "g" },
            { name: "Mushrooms", quantity: 50, unit: "g" },
          ]),
        ]),
        slot("lunch", [
          item("Avocado Chicken Salad", 1, { calories: 520, protein: 35, carbs: 8, fat: 40 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Avocado", quantity: 1, unit: "pieces" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
            { name: "Lettuce", quantity: 100, unit: "g" },
          ]),
        ]),
        slot("dinner", [
          item("Salmon with Buttered Asparagus", 1, { calories: 520, protein: 38, carbs: 6, fat: 38 }, [
            { name: "Salmon Fillet", quantity: 200, unit: "g" },
            { name: "Asparagus", quantity: 150, unit: "g" },
            { name: "Butter", quantity: 2, unit: "tbsp" },
          ]),
        ]),
        slot("snack", [
          item("Dark Chocolate Square", 1, { calories: 170, protein: 2, carbs: 6, fat: 14 }, [
            { name: "Dark Chocolate", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
      day(4, "Friday", [
        slot("breakfast", [
          item("Bacon & Eggs", 1, { calories: 450, protein: 28, carbs: 2, fat: 38 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Bacon", quantity: 80, unit: "g" },
            { name: "Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Beef Lettuce Wraps", 1, { calories: 480, protein: 32, carbs: 6, fat: 36 }, [
            { name: "Ground Beef", quantity: 200, unit: "g" },
            { name: "Lettuce", quantity: 100, unit: "g" },
            { name: "Sour Cream", quantity: 2, unit: "tbsp" },
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
          ]),
        ]),
        slot("dinner", [
          item("Lamb Chops with Spinach", 1, { calories: 540, protein: 38, carbs: 4, fat: 42 }, [
            { name: "Lamb Chops", quantity: 200, unit: "g" },
            { name: "Spinach", quantity: 150, unit: "g" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
            { name: "Garlic", quantity: 2, unit: "cloves" },
          ]),
        ]),
        slot("snack", [
          item("Cheese & Almonds", 1, { calories: 250, protein: 14, carbs: 4, fat: 22 }, [
            { name: "Cheddar Cheese", quantity: 40, unit: "g" },
            { name: "Almonds", quantity: 30, unit: "g" },
          ]),
        ]),
      ]),
    ],
  },

  // 4. Mediterranean Daily Prep
  {
    id: genId(),
    title: "Mediterranean Daily Prep",
    description:
      "A single-day Mediterranean meal plan featuring fresh vegetables, olive oil, whole grains, and lean proteins.",
    placeholderType: "balanced",
    author: authors[3],
    planType: "daily",
    difficulty: "easy",
    dietaryTags: [],
    rating: 4.7,
    reviewCount: 64,
    isPublished: true,
    isFavorite: false,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Day 1", [
        slot("breakfast", [
          item("Greek Yogurt Bowl", 1, { calories: 300, protein: 20, carbs: 38, fat: 8 }, [
            { name: "Greek Yogurt", quantity: 200, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tbsp" },
            { name: "Mixed Nuts", quantity: 20, unit: "g" },
            { name: "Blueberries", quantity: 100, unit: "g" },
          ]),
        ]),
        slot("lunch", [
          item("Mediterranean Quinoa Salad", 1, { calories: 440, protein: 16, carbs: 52, fat: 20 }, [
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Cucumber", quantity: 1, unit: "pieces" },
            { name: "Tomatoes", quantity: 2, unit: "pieces" },
            { name: "Feta Cheese", quantity: 50, unit: "g" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
          ], "recipe-8"),
        ]),
        slot("dinner", [
          item("Greek Chicken Souvlaki", 1, { calories: 510, protein: 42, carbs: 36, fat: 22 }, [
            { name: "Chicken Breast", quantity: 200, unit: "g" },
            { name: "Greek Yogurt", quantity: 100, unit: "g" },
            { name: "Cucumber", quantity: 0.5, unit: "pieces" },
            { name: "Tomatoes", quantity: 1, unit: "pieces" },
            { name: "Olive Oil", quantity: 2, unit: "tbsp" },
          ], "recipe-7"),
        ]),
        slot("snack", [
          item("Hummus & Veggies", 1, { calories: 220, protein: 8, carbs: 22, fat: 12 }, [
            { name: "Chickpeas", quantity: 100, unit: "g" },
            { name: "Carrots", quantity: 2, unit: "pieces" },
            { name: "Cucumber", quantity: 0.5, unit: "pieces" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
      ]),
    ],
  },

  // 5. Student Bulk Cook Sunday
  {
    id: genId(),
    title: "Student Bulk Cook Sunday",
    description:
      "Cook once on Sunday, eat all week! Simple, budget-friendly meals that reheat well. Perfect for busy students.",
    placeholderType: "bulk",
    author: authors[0],
    planType: "daily",
    difficulty: "easy",
    dietaryTags: [],
    rating: 4.9,
    reviewCount: 203,
    isPublished: true,
    isFavorite: false,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Cook Day", [
        slot("breakfast", [
          item("Fluffy Blueberry Pancakes (batch)", 5, { calories: 380, protein: 10, carbs: 58, fat: 12 }, [
            { name: "Flour", quantity: 400, unit: "g" },
            { name: "Eggs", quantity: 4, unit: "pieces" },
            { name: "Whole Milk", quantity: 500, unit: "ml" },
            { name: "Blueberries", quantity: 300, unit: "g" },
            { name: "Butter", quantity: 60, unit: "g" },
          ], "recipe-14"),
        ]),
        slot("lunch", [
          item("Loaded Veggie Burrito Bowl (batch)", 5, { calories: 520, protein: 18, carbs: 78, fat: 16 }, [
            { name: "Basmati Rice", quantity: 500, unit: "g" },
            { name: "Black Beans", quantity: 600, unit: "g" },
            { name: "Bell Peppers", quantity: 4, unit: "pieces" },
            { name: "Avocado", quantity: 3, unit: "pieces" },
            { name: "Tomatoes", quantity: 4, unit: "pieces" },
          ], "recipe-4"),
        ]),
        slot("dinner", [
          item("Butter Chicken (batch)", 5, { calories: 520, protein: 38, carbs: 24, fat: 32 }, [
            { name: "Chicken Thighs", quantity: 1000, unit: "g" },
            { name: "Diced Tomatoes", quantity: 800, unit: "g" },
            { name: "Heavy Cream", quantity: 400, unit: "ml" },
            { name: "Basmati Rice", quantity: 500, unit: "g" },
            { name: "Butter", quantity: 100, unit: "g" },
          ], "recipe-11"),
        ]),
        slot("snack", [
          item("Hummus & Crackers Snack Packs", 5, { calories: 200, protein: 6, carbs: 24, fat: 10 }, [
            { name: "Chickpeas", quantity: 400, unit: "g" },
            { name: "Carrots", quantity: 5, unit: "pieces" },
            { name: "Cucumber", quantity: 2, unit: "pieces" },
          ]),
        ]),
      ]),
    ],
  },

  // 6. My Custom Week Plan (user's draft)
  {
    id: genId(),
    title: "My Custom Week Plan",
    description:
      "Work in progress - planning my meals for next week.",
    placeholderType: "balanced",
    author: authors[4],
    planType: "weekly",
    difficulty: "medium",
    dietaryTags: [],
    rating: 0,
    reviewCount: 0,
    isPublished: false,
    isFavorite: false,
    isOwned: true,
    createdAt: today,
    updatedAt: today,
    days: [
      day(0, "Monday", [
        slot("breakfast", [
          item("Oatmeal with Fruit", 1, { calories: 350, protein: 12, carbs: 58, fat: 8 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Blueberries", quantity: 50, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Chicken Wrap", 1, { calories: 450, protein: 32, carbs: 42, fat: 18 }, [
            { name: "Chicken Breast", quantity: 150, unit: "g" },
            { name: "Tortillas", quantity: 2, unit: "pieces" },
            { name: "Lettuce", quantity: 50, unit: "g" },
            { name: "Tomatoes", quantity: 1, unit: "pieces" },
          ]),
        ]),
        slot("dinner", [
          item("Pasta with Tomato Sauce", 1, { calories: 480, protein: 16, carbs: 72, fat: 14 }, [
            { name: "Pasta", quantity: 200, unit: "g" },
            { name: "Diced Tomatoes", quantity: 200, unit: "g" },
            { name: "Onions", quantity: 1, unit: "pieces" },
            { name: "Garlic", quantity: 2, unit: "cloves" },
          ]),
        ]),
      ]),
      day(1, "Tuesday", [
        slot("breakfast", [
          item("Scrambled Eggs", 1, { calories: 280, protein: 18, carbs: 2, fat: 22 }, [
            { name: "Eggs", quantity: 3, unit: "pieces" },
            { name: "Butter", quantity: 1, unit: "tbsp" },
          ]),
        ]),
        slot("lunch", [
          item("Quinoa Salad", 1, { calories: 380, protein: 14, carbs: 52, fat: 14 }, [
            { name: "Quinoa", quantity: 150, unit: "g" },
            { name: "Cucumber", quantity: 1, unit: "pieces" },
            { name: "Tomatoes", quantity: 2, unit: "pieces" },
            { name: "Olive Oil", quantity: 1, unit: "tbsp" },
          ]),
        ]),
      ]),
      day(2, "Wednesday", [
        slot("breakfast", [
          item("Oatmeal with Fruit", 1, { calories: 350, protein: 12, carbs: 58, fat: 8 }, [
            { name: "Oats", quantity: 80, unit: "g" },
            { name: "Bananas", quantity: 1, unit: "pieces" },
            { name: "Blueberries", quantity: 50, unit: "g" },
            { name: "Honey", quantity: 1, unit: "tbsp" },
          ]),
        ]),
      ]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                     */
/* ------------------------------------------------------------------ */

export function getMealPrepById(id: string): MealPrepPlan | undefined {
  return mockMealPreps.find((p) => p.id === id);
}

export function getFavoriteMealPreps(): MealPrepPlan[] {
  return mockMealPreps.filter((p) => p.isFavorite);
}

export function getMyMealPreps(): MealPrepPlan[] {
  return mockMealPreps.filter((p) => p.isOwned);
}

export function getPublishedMealPreps(): MealPrepPlan[] {
  return mockMealPreps.filter((p) => p.isPublished);
}
