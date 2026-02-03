"use client";

import { RecipeCard } from "./recipe-card";
import type { Recipe } from "./types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type RecipeGridProps = {
  recipes: Recipe[];
  onToggleFavorite?: (id: string) => void;
  showPantryMatch?: boolean;
  emptyState?: React.ReactNode;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RecipeGrid({
  recipes,
  onToggleFavorite,
  showPantryMatch = true,
  emptyState,
}: RecipeGridProps) {
  if (recipes.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onToggleFavorite={onToggleFavorite}
          showPantryMatch={showPantryMatch}
        />
      ))}
    </div>
  );
}
