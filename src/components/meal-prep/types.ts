/* ------------------------------------------------------------------ */
/*  Meal Prep Types                                                    */
/* ------------------------------------------------------------------ */

import type { Macros } from "@/components/recipes/types";

export type MealPrepTab = "discover" | "favorites" | "my-meal-preps";

export type PlanType = "daily" | "weekly" | "monthly";

export type MealSlotType = "breakfast" | "lunch" | "dinner" | "snack";

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "low-carb"
  | "high-protein";

export type MealIngredient = {
  name: string;
  quantity: number;
  unit: string;
  inPantry?: boolean;
};

export type MealItem = {
  id: string;
  name: string;
  recipeId?: string; // links to a recipe from mockRecipes
  servings: number;
  ingredients: MealIngredient[];
  nutrition: Macros;
};

export type MealSlot = {
  type: MealSlotType;
  items: MealItem[];
};

export type MealPrepDay = {
  dayIndex: number; // 0-based
  label: string; // e.g. "Monday", "Day 1"
  meals: MealSlot[];
};

export type Author = {
  id: string;
  name: string;
  avatar?: string;
};

export type MealPrepPlan = {
  id: string;
  title: string;
  description: string;
  image?: string;
  placeholderType?: "balanced" | "protein" | "vegan" | "keto" | "bulk" | "cut";
  author: Author;
  planType: PlanType;
  difficulty: "easy" | "medium" | "hard";
  dietaryTags: DietaryTag[];
  days: MealPrepDay[];
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFavorite?: boolean;
  isOwned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MealPrepFilterState = {
  search: string;
  planType: PlanType | null;
  difficulty: "easy" | "medium" | "hard" | null;
  dietary: DietaryTag[];
  calorieRange: "under1500" | "1500to2000" | "2000to2500" | "over2500" | null;
};

export type CalorieRangeFilter = "under1500" | "1500to2000" | "2000to2500" | "over2500";
