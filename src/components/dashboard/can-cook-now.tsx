"use client";

import { ChefHat, Clock, Flame, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";

const recipes = [
  {
    id: "r1",
    title: "Grilled Chicken Salad",
    cookTime: 20,
    rating: 4.5,
    calories: 350,
    matchingIngredients: ["Chicken Breast", "Spinach", "Tomatoes"],
    gradient: "from-emerald-400 to-green-500",
  },
  {
    id: "r3",
    title: "Vegetable Stir Fry",
    cookTime: 15,
    rating: 4.2,
    calories: 280,
    matchingIngredients: ["Bell Peppers", "Onions", "Rice"],
    gradient: "from-amber-400 to-orange-500",
  },
];

export function CanCookNow() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <ChefHat size={15} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Cook Now
            </h2>
          </div>
          <Link
            href="/recipes"
            className="text-xs font-medium text-[var(--color-primary)] hover:underline"
          >
            See all &rarr;
          </Link>
        </div>

        {/* Recipe cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group block rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {/* Top accent gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${recipe.gradient}`} />

              <div className="p-4 flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {recipe.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {recipe.cookTime}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {recipe.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" />
                    {recipe.calories} cal
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {recipe.matchingIngredients.map((ing) => (
                    <span
                      key={ing}
                      className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
                <span className="text-xs font-medium text-[var(--color-primary)] group-hover:underline mt-auto pt-1">
                  View Recipe &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
