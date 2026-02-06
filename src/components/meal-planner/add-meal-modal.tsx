"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { X, Search, BookOpen, UtensilsCrossed, PenLine, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRecipes } from "@/components/recipes/mock-data";
import { mockMealPreps } from "@/components/meal-prep/mock-data";
import { nutritionDB } from "@/lib/nutrition-db";
import type { Macros } from "@/components/recipes/types";
import type { AddMealTarget, AddMealMode, PlannerMeal } from "./types";
import { genPlannerId } from "./utils";

interface AddMealModalProps {
  target: AddMealTarget;
  onClose: () => void;
  onAddMeal: (date: string, slotType: string, meal: PlannerMeal) => void;
  onImportMealPrep: (mealPrepId: string, startDate: string) => void;
}

export function AddMealModal({ target, onClose, onAddMeal, onImportMealPrep }: AddMealModalProps) {
  const t = useTranslations("mealPlanner");
  const [mode, setMode] = useState<AddMealMode>("recipe");

  const tabs: { mode: AddMealMode; icon: typeof BookOpen; label: string }[] = [
    { mode: "recipe", icon: BookOpen, label: t("modal.addRecipe") },
    { mode: "meal-prep", icon: UtensilsCrossed, label: t("modal.importMealPrep") },
    { mode: "custom", icon: PenLine, label: t("modal.customMeal") },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-[var(--color-surface)] rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            {t("modal.title")}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <X size={18} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-[var(--color-border)]">
          {tabs.map(({ mode: m, icon: Icon, label }) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                mode === m
                  ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                  : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]",
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto">
          {mode === "recipe" && (
            <RecipeTab target={target} onAddMeal={onAddMeal} onClose={onClose} />
          )}
          {mode === "meal-prep" && (
            <MealPrepTab target={target} onImportMealPrep={onImportMealPrep} onClose={onClose} />
          )}
          {mode === "custom" && (
            <CustomMealTab target={target} onAddMeal={onAddMeal} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1: Add Recipe                                                  */
/* ------------------------------------------------------------------ */

function RecipeTab({
  target,
  onAddMeal,
  onClose,
}: {
  target: AddMealTarget;
  onAddMeal: AddMealModalProps["onAddMeal"];
  onClose: () => void;
}) {
  const t = useTranslations("mealPlanner");
  const [search, setSearch] = useState("");

  const recipes = useMemo(() => {
    const q = search.toLowerCase();
    return mockRecipes
      .filter((r) => r.isPublished)
      .filter((r) => !q || r.title.toLowerCase().includes(q));
  }, [search]);

  function handleSelect(recipe: (typeof mockRecipes)[0]) {
    const meal: PlannerMeal = {
      id: genPlannerId(),
      name: recipe.title,
      recipeId: recipe.id,
      nutrition: recipe.nutrition,
      servings: 1,
      source: "recipe",
    };
    onAddMeal(target.date, target.slotType, meal);
    onClose();
  }

  return (
    <div className="p-4 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("modal.searchRecipes")}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Recipe list */}
      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            onClick={() => handleSelect(recipe)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--color-text)] truncate">
                {recipe.title}
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {recipe.nutrition.calories} cal · {recipe.nutrition.protein}g protein
              </div>
            </div>
            <Plus size={16} className="shrink-0 text-[var(--color-text-tertiary)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Import Meal Prep                                            */
/* ------------------------------------------------------------------ */

function MealPrepTab({
  target,
  onImportMealPrep,
  onClose,
}: {
  target: AddMealTarget;
  onImportMealPrep: AddMealModalProps["onImportMealPrep"];
  onClose: () => void;
}) {
  const t = useTranslations("mealPlanner");
  const [search, setSearch] = useState("");

  const preps = useMemo(() => {
    const q = search.toLowerCase();
    return mockMealPreps
      .filter((p) => p.isPublished)
      .filter((p) => !q || p.title.toLowerCase().includes(q));
  }, [search]);

  function handleSelect(prep: (typeof mockMealPreps)[0]) {
    onImportMealPrep(prep.id, target.date);
    onClose();
  }

  return (
    <div className="p-4 space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("modal.searchMealPreps")}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {preps.map((prep) => (
          <button
            key={prep.id}
            onClick={() => handleSelect(prep)}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--color-text)] truncate">
                {prep.title}
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                {prep.days.length} days · {prep.planType} · {prep.difficulty}
              </div>
            </div>
            <Plus size={16} className="shrink-0 text-[var(--color-text-tertiary)]" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3: Custom Meal                                                 */
/* ------------------------------------------------------------------ */

type CustomIngredient = {
  name: string;
  quantity: number;
};

function CustomMealTab({
  target,
  onAddMeal,
  onClose,
}: {
  target: AddMealTarget;
  onAddMeal: AddMealModalProps["onAddMeal"];
  onClose: () => void;
}) {
  const t = useTranslations("mealPlanner");
  const [mealName, setMealName] = useState("");
  const [ingredients, setIngredients] = useState<CustomIngredient[]>([]);
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [servings, setServings] = useState(1);

  const availableIngredients = useMemo(() => {
    const q = ingredientSearch.toLowerCase();
    if (!q) return [];
    return Object.keys(nutritionDB)
      .filter((name) => name.toLowerCase().includes(q))
      .filter((name) => !ingredients.some((i) => i.name === name))
      .slice(0, 8);
  }, [ingredientSearch, ingredients]);

  const calculatedNutrition = useMemo((): Macros => {
    return ingredients.reduce(
      (acc, ing) => {
        const entry = nutritionDB[ing.name];
        if (!entry) return acc;
        const mult = ing.quantity;
        return {
          calories: acc.calories + Math.round(entry.calories * mult),
          protein: acc.protein + Math.round(entry.protein * mult),
          carbs: acc.carbs + Math.round(entry.carbs * mult),
          fat: acc.fat + Math.round(entry.fat * mult),
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [ingredients]);

  function addIngredient(name: string) {
    setIngredients((prev) => [...prev, { name, quantity: 1 }]);
    setIngredientSearch("");
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function updateQuantity(index: number, delta: number) {
    setIngredients((prev) =>
      prev.map((ing, i) =>
        i === index ? { ...ing, quantity: Math.max(0.5, ing.quantity + delta) } : ing,
      ),
    );
  }

  function handleSubmit() {
    if (!mealName.trim()) return;
    const meal: PlannerMeal = {
      id: genPlannerId(),
      name: mealName.trim(),
      nutrition: calculatedNutrition,
      servings,
      source: "custom",
    };
    onAddMeal(target.date, target.slotType, meal);
    onClose();
  }

  const isValid = mealName.trim().length > 0;

  return (
    <div className="p-4 space-y-4">
      {/* Meal name */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          {t("modal.mealName")}
        </label>
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder={t("modal.mealNamePlaceholder")}
          className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      {/* Servings */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          {t("modal.servings")}
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="text-sm font-medium text-[var(--color-text)] w-8 text-center">
            {servings}
          </span>
          <button
            onClick={() => setServings((s) => s + 1)}
            className="p-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Ingredient search */}
      <div>
        <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
          {t("modal.addIngredient")}
        </label>
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]"
          />
          <input
            type="text"
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            placeholder={t("modal.searchIngredients")}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
          />
        </div>
        {availableIngredients.length > 0 && (
          <div className="mt-1 border border-[var(--color-border)] rounded-xl overflow-hidden bg-[var(--color-surface)]">
            {availableIngredients.map((name) => {
              const entry = nutritionDB[name];
              return (
                <button
                  key={name}
                  onClick={() => addIngredient(name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                >
                  <span className="text-[var(--color-text)]">{name}</span>
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {entry.calories} cal / {entry.per}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Ingredient list */}
      {ingredients.length > 0 && (
        <div className="space-y-1.5">
          {ingredients.map((ing, index) => {
            const entry = nutritionDB[ing.name];
            return (
              <div
                key={ing.name}
                className="flex items-center gap-2 p-2 rounded-lg bg-[var(--color-bg-secondary)]"
              >
                <span className="flex-1 text-sm text-[var(--color-text)] truncate">
                  {ing.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(index, -0.5)}
                    className="p-1 rounded hover:bg-[var(--color-surface-hover)] cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-xs font-medium w-6 text-center text-[var(--color-text)]">
                    {ing.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(index, 0.5)}
                    className="p-1 rounded hover:bg-[var(--color-surface-hover)] cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)] w-14 text-right">
                  {entry ? `${Math.round(entry.calories * ing.quantity)} cal` : ""}
                </span>
                <button
                  onClick={() => removeIngredient(index)}
                  className="p-1 rounded hover:bg-[var(--color-surface-hover)] cursor-pointer"
                >
                  <X size={12} className="text-[var(--color-text-tertiary)]" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Nutrition summary */}
      {ingredients.length > 0 && (
        <div className="grid grid-cols-4 gap-2 p-3 rounded-xl bg-[var(--color-bg-secondary)]">
          <div className="text-center">
            <div className="text-sm font-bold text-[var(--color-primary)]">{calculatedNutrition.calories}</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">{t("nutrition.cal")}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-blue-500">{calculatedNutrition.protein}g</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">{t("nutrition.protein")}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-amber-500">{calculatedNutrition.carbs}g</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">{t("nutrition.carbs")}</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-emerald-500">{calculatedNutrition.fat}g</div>
            <div className="text-[10px] text-[var(--color-text-tertiary)]">{t("nutrition.fat")}</div>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={cn(
          "w-full py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer",
          isValid
            ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]"
            : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed",
        )}
      >
        {t("modal.addToPlan")}
      </button>
    </div>
  );
}
