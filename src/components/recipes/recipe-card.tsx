"use client";

import { Heart, Clock, Flame, ChefHat, Star, User, UtensilsCrossed, Salad, Soup, Beef, Cake, Coffee, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Recipe } from "./types";
import { Link } from "@/i18n/navigation";

/* ------------------------------------------------------------------ */
/*  Placeholder backgrounds by recipe type                             */
/* ------------------------------------------------------------------ */

const placeholderConfig: Record<string, { gradient: string; icon: React.ElementType }> = {
  soup: { gradient: "from-amber-400 to-orange-500", icon: Soup },
  salad: { gradient: "from-emerald-400 to-green-500", icon: Salad },
  pasta: { gradient: "from-yellow-400 to-amber-500", icon: UtensilsCrossed },
  meat: { gradient: "from-rose-400 to-red-500", icon: Beef },
  dessert: { gradient: "from-pink-400 to-rose-500", icon: Cake },
  breakfast: { gradient: "from-orange-300 to-amber-400", icon: Coffee },
  asian: { gradient: "from-red-400 to-orange-500", icon: UtensilsCrossed },
  mexican: { gradient: "from-yellow-500 to-red-500", icon: Flame },
};

const defaultPlaceholder = { gradient: "from-slate-400 to-slate-500", icon: ChefHat };

/* ------------------------------------------------------------------ */
/*  Difficulty badge colors                                            */
/* ------------------------------------------------------------------ */

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type RecipeCardProps = {
  recipe: Recipe;
  pantryMatchCount?: number; // How many ingredients user has
  onToggleFavorite?: (id: string) => void;
  showPantryMatch?: boolean;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RecipeCard({
  recipe,
  pantryMatchCount,
  onToggleFavorite,
  showPantryMatch = true,
}: RecipeCardProps) {
  const placeholder = placeholderConfig[recipe.placeholderType || ""] || defaultPlaceholder;
  const PlaceholderIcon = placeholder.icon;

  const totalIngredients = recipe.ingredients.length;
  const matchCount = pantryMatchCount ?? Math.floor(totalIngredients * 0.7); // Mock: 70% match by default
  const matchPercent = Math.round((matchCount / totalIngredients) * 100);

  const matchColor =
    matchPercent >= 80
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : matchPercent >= 50
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]";

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="group block rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br flex items-center justify-center",
              placeholder.gradient
            )}
          >
            <PlaceholderIcon className="w-16 h-16 text-white/40" strokeWidth={1.5} />
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(recipe.id);
          }}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all",
            recipe.isFavorite
              ? "bg-red-500 text-white"
              : "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          )}
          aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn("w-5 h-5", recipe.isFavorite && "fill-current")}
          />
        </button>

        {/* Draft badge for owned unpublished recipes */}
        {recipe.isOwned && !recipe.isPublished && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs font-medium">
            Draft
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 leading-snug mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {recipe.title}
        </h3>

        {/* Author & Rating */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-3">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {recipe.author.name}
          </span>
          {recipe.rating > 0 && (
            <>
              <span className="text-[var(--color-border)]">·</span>
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {recipe.rating.toFixed(1)}
                <span className="text-[var(--color-text-tertiary)]">
                  ({recipe.reviewCount})
                </span>
              </span>
            </>
          )}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Clock className="w-4 h-4" />
            {totalTime} min
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              difficultyColors[recipe.difficulty]
            )}
          >
            {recipe.difficulty}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Flame className="w-4 h-4" />
            {recipe.nutrition.calories} cal
          </span>
        </div>

        {/* Pantry match indicator */}
        {showPantryMatch && (
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
              matchColor
            )}
          >
            <CircleDot className="w-4 h-4" />
            <span>
              {matchPercent === 100
                ? "Ready to cook!"
                : `You have ${matchCount}/${totalIngredients} ingredients`}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
