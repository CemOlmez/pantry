"use client";

import {
  ChefHat,
  Clock,
  Star,
  Flame,
  Salad,
  UtensilsCrossed,
  Soup,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock recipes you can cook right now (100% ingredient match)        */
/* ------------------------------------------------------------------ */

const recipes = [
  {
    id: "r1",
    title: "Grilled Chicken Salad",
    cookTime: 20,
    rating: 4.5,
    calories: 350,
    matchingIngredients: ["Chicken Breast", "Spinach", "Tomatoes"],
    gradient: "from-emerald-400 to-green-500",
    icon: Salad,
  },
  {
    id: "r3",
    title: "Vegetable Stir Fry",
    cookTime: 15,
    rating: 4.2,
    calories: 280,
    matchingIngredients: ["Bell Peppers", "Onions", "Rice"],
    gradient: "from-amber-400 to-orange-500",
    icon: Soup,
  },
  {
    id: "r5",
    title: "Tomato Basil Pasta",
    cookTime: 25,
    rating: 4.7,
    calories: 420,
    matchingIngredients: ["Pasta", "Tomatoes", "Basil", "Garlic"],
    gradient: "from-yellow-400 to-amber-500",
    icon: UtensilsCrossed,
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CanCookNow() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-green-500" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <ChefHat size={18} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Ready to Cook
            </h2>
          </div>
          <Link
            href="/recipes"
            className="text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            See all &rarr;
          </Link>
        </div>

        {/* Recipe cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => {
            const Icon = recipe.icon;

            return (
              <Link
                key={recipe.id}
                href={`/recipes/${recipe.id}`}
                className="group block rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Gradient placeholder image */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    className={cn(
                      "w-full h-full bg-gradient-to-br flex items-center justify-center",
                      recipe.gradient
                    )}
                  >
                    <Icon
                      className="w-14 h-14 text-white/40"
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* 100% match badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-semibold shadow-sm">
                    100% match
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-semibold text-[var(--color-text)] leading-snug mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                    {recipe.title}
                  </h3>

                  {/* Stats row */}
                  <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-3">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {recipe.cookTime} min
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {recipe.rating}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4" />
                      {recipe.calories} cal
                    </span>
                  </div>

                  {/* Ingredient pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.matchingIngredients.map((ing) => (
                      <span
                        key={ing}
                        className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
