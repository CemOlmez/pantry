"use client";

import { Clock, Star } from "lucide-react";
import Link from "next/link";

const recipes = [
  {
    id: "r1",
    title: "Grilled Chicken Salad",
    cookTime: 20,
    rating: 4.5,
    calories: 350,
    matchingIngredients: ["Chicken Breast", "Spinach", "Tomatoes"],
  },
  {
    id: "r3",
    title: "Vegetable Stir Fry",
    cookTime: 15,
    rating: 4.2,
    calories: 280,
    matchingIngredients: ["Bell Peppers", "Onions", "Rice"],
  },
];

export function CanCookNow() {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5">
      <h2 className="text-sm font-semibold text-[var(--color-text)] mb-4">
        Cook Now
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="rounded-lg bg-[var(--color-bg-secondary)] p-4 flex flex-col gap-2"
          >
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              {recipe.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {recipe.cookTime}m
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#D4A03E] text-[#D4A03E]" />
                {recipe.rating}
              </span>
              <span>{recipe.calories} cal</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {recipe.matchingIngredients.map((ing) => (
                <span
                  key={ing}
                  className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                >
                  {ing}
                </span>
              ))}
            </div>
            <Link
              href={`/recipes/${recipe.id}`}
              className="text-xs font-medium text-[var(--color-primary)] hover:underline mt-auto pt-1"
            >
              View Recipe &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
