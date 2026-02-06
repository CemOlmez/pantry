"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Heart,
  MoreHorizontal,
  Clock,
  ChefHat,
  Flame,
  Users,
  Check,
  X,
  ShoppingCart,
  Share2,
  Flag,
  Pencil,
  Star,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Salad,
  Soup,
  Beef,
  Cake,
  Coffee,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { mockRecipes, RecipeCard } from "@/components/recipes";
import type { Recipe } from "@/components/recipes";

/* ------------------------------------------------------------------ */
/*  Placeholder backgrounds                                            */
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
/*  Difficulty colors                                                  */
/* ------------------------------------------------------------------ */

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function RecipeDetailPage() {
  const params = useParams();
  const t = useTranslations("recipes.detail");
  const tDiff = useTranslations("recipes.difficulty");

  const recipeId = params.id as string;
  const recipe = mockRecipes.find((r) => r.id === recipeId);

  // State
  const [isFavorite, setIsFavorite] = useState(recipe?.isFavorite ?? false);
  const [servings, setServings] = useState(recipe?.servings ?? 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
  const [showMenu, setShowMenu] = useState(false);

  // Compute pantry match (mock: random based on index)
  const ingredientsWithPantry = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ing, idx) => ({
      ...ing,
      inPantry: idx % 3 !== 2, // Mock: 2/3 items in pantry
    }));
  }, [recipe]);

  const inPantryCount = ingredientsWithPantry.filter((i) => i.inPantry).length;
  const totalIngredients = ingredientsWithPantry.length;
  const missingCount = totalIngredients - inPantryCount;

  // Scale ingredient quantities based on servings
  const scaleFactor = recipe ? servings / recipe.servings : 1;

  // Get related recipes (same cuisine or meal type)
  const relatedRecipes = useMemo(() => {
    if (!recipe) return [];
    return mockRecipes
      .filter(
        (r) =>
          r.id !== recipe.id &&
          r.isPublished &&
          (r.cuisine === recipe.cuisine ||
            r.mealType.some((m) => recipe.mealType.includes(m)))
      )
      .slice(0, 4);
  }, [recipe]);

  // Toggle ingredient check
  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  if (!recipe) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[var(--color-text-secondary)]">Recipe not found</p>
        <Link
          href="/recipes"
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          Back to recipes
        </Link>
      </div>
    );
  }

  const placeholder = placeholderConfig[recipe.placeholderType || ""] || defaultPlaceholder;
  const PlaceholderIcon = placeholder.icon;
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="-m-4 sm:-m-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[280px] max-h-[400px]">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br flex items-center justify-center",
              placeholder.gradient
            )}
          >
            <PlaceholderIcon className="w-24 h-24 text-white/30" strokeWidth={1.5} />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Navigation overlay */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <Link
            href="/recipes"
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                isFavorite
                  ? "bg-red-500 text-white"
                  : "bg-black/30 backdrop-blur-sm text-white hover:bg-black/50"
              )}
            >
              <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg py-1 z-20">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 text-[var(--color-text)]">
                    <Share2 className="w-4 h-4" />
                    {t("share")}
                  </button>
                  {recipe.isOwned && (
                    <button className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 text-[var(--color-text)]">
                      <Pencil className="w-4 h-4" />
                      {t("edit")}
                    </button>
                  )}
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] flex items-center gap-3 text-[var(--color-text-secondary)]">
                    <Flag className="w-4 h-4" />
                    {t("report")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[var(--color-bg)] relative -mt-6 rounded-t-3xl px-4 sm:px-8 pt-6 pb-8">
        {/* Title & Author */}
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-2">
          {recipe.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
          <span>
            {t("by")} <span className="font-medium text-[var(--color-text)]">{recipe.author.name}</span>
          </span>
          {recipe.rating > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {recipe.rating.toFixed(1)}
                <span className="text-[var(--color-text-tertiary)]">
                  ({recipe.reviewCount} {t("reviews")})
                </span>
              </span>
            </>
          )}
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Clock className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{totalTime} {t("minutes")}</span>
          </div>
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium capitalize",
              difficultyColors[recipe.difficulty]
            )}
          >
            {tDiff(recipe.difficulty)}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Flame className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{recipe.nutrition.calories} {t("calories")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Users className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{recipe.servings} {t("servings")}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-[var(--color-text-secondary)] mb-8">{recipe.description}</p>

        {/* Ingredients Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
              <span>🥘</span> {t("ingredients")}
            </h2>

            {/* Servings adjuster */}
            <div className="flex items-center gap-2 bg-[var(--color-bg-secondary)] rounded-full px-3 py-1">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-6 h-6 rounded-full hover:bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-[var(--color-text)] min-w-[70px] text-center">
                {servings} {t("servings")}
              </span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-6 h-6 rounded-full hover:bg-[var(--color-bg-tertiary)] flex items-center justify-center text-[var(--color-text-secondary)]"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pantry match banner */}
          <div
            className={cn(
              "flex items-center justify-between p-4 rounded-xl mb-4",
              inPantryCount === totalIngredients
                ? "bg-green-100 dark:bg-green-900/20"
                : "bg-amber-100 dark:bg-amber-900/20"
            )}
          >
            <div className="flex items-center gap-2">
              <Check
                className={cn(
                  "w-5 h-5",
                  inPantryCount === totalIngredients
                    ? "text-green-600 dark:text-green-400"
                    : "text-amber-600 dark:text-amber-400"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  inPantryCount === totalIngredients
                    ? "text-green-700 dark:text-green-400"
                    : "text-amber-700 dark:text-amber-400"
                )}
              >
                {inPantryCount === totalIngredients
                  ? t("readyToCook")
                  : `${t("youHave")} ${inPantryCount}${t("of")}${totalIngredients} ${t("ingredientsLabel")}`}
              </span>
            </div>

            {missingCount > 0 && (
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                <ShoppingCart className="w-4 h-4" />
                {t("addMissingToList")}
              </button>
            )}
          </div>

          {/* Ingredient list */}
          <div className="space-y-2">
            {ingredientsWithPantry.map((ing, idx) => {
              const scaledQty = Math.round(ing.quantity * scaleFactor * 10) / 10;
              const isChecked = checkedIngredients.has(idx);

              return (
                <button
                  key={idx}
                  onClick={() => toggleIngredient(idx)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left",
                    isChecked
                      ? "bg-[var(--color-bg-tertiary)]"
                      : "bg-[var(--color-surface)] hover:bg-[var(--color-bg-secondary)]"
                  )}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isChecked
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    )}
                  >
                    {isChecked && <Check className="w-4 h-4 text-white" />}
                  </div>

                  <span
                    className={cn(
                      "flex-1 text-[var(--color-text)]",
                      isChecked && "line-through text-[var(--color-text-tertiary)]"
                    )}
                  >
                    <span className="font-medium">{scaledQty} {ing.unit}</span> {ing.name}
                  </span>

                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      ing.inPantry
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {ing.inPantry ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3 h-3" /> in pantry
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <X className="w-3 h-3" /> missing
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Instructions Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
            <span>📝</span> {t("instructions")}
          </h2>

          <div className="space-y-4">
            {recipe.instructions.map((step) => (
              <div key={step.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm">
                  {step.step}
                </div>
                <p className="text-[var(--color-text)] pt-1 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Nutrition Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
            <span>📊</span> {t("nutrition")} <span className="text-sm font-normal text-[var(--color-text-secondary)]">({t("perServing")})</span>
          </h2>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {recipe.nutrition.calories}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">{t("calories")}</div>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {recipe.nutrition.protein}g
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">{t("protein")}</div>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {recipe.nutrition.carbs}g
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">{t("carbs")}</div>
            </div>
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                {recipe.nutrition.fat}g
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">{t("fat")}</div>
            </div>
          </div>
        </section>

        {/* Reviews Section Placeholder */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
              <span>💬</span> {t("reviews")} ({recipe.reviewCount})
            </h2>
            <button className="text-[var(--color-primary)] text-sm font-medium hover:underline">
              {t("writeReview")}
            </button>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6 text-center text-[var(--color-text-secondary)]">
            Reviews coming soon...
          </div>
        </section>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2 mb-4">
              <span>🍽</span> {t("relatedRecipes")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedRecipes.slice(0, 2).map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  showPantryMatch={false}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
