"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  RecipeTabs,
  RecipeFilters,
  RecipeGrid,
  RecipeStats,
  EmptyState,
  mockRecipes,
} from "@/components/recipes";
import type { RecipeTab, RecipeFilterState, Recipe } from "@/components/recipes";

/* ------------------------------------------------------------------ */
/*  Filter logic                                                       */
/* ------------------------------------------------------------------ */

function filterRecipes(recipes: Recipe[], filters: RecipeFilterState): Recipe[] {
  return recipes.filter((recipe) => {
    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesTitle = recipe.title.toLowerCase().includes(search);
      const matchesDescription = recipe.description.toLowerCase().includes(search);
      const matchesIngredient = recipe.ingredients.some((i) =>
        i.name.toLowerCase().includes(search)
      );
      if (!matchesTitle && !matchesDescription && !matchesIngredient) return false;
    }

    // Can Cook Now (mock: assume 70% match for all recipes, so filter for high match)
    if (filters.canCookNow) {
      // In real app, would check actual pantry match
      // For now, just show a subset
      const mockMatchPercent = 0.7;
      if (mockMatchPercent < 0.8) {
        // Randomly decide based on recipe id hash
        const hash = recipe.id.charCodeAt(recipe.id.length - 1);
        if (hash % 3 !== 0) return false;
      }
    }

    // Meal type
    if (filters.mealType && !recipe.mealType.includes(filters.mealType)) {
      return false;
    }

    // Cuisine
    if (filters.cuisine && recipe.cuisine !== filters.cuisine) {
      return false;
    }

    // Time
    if (filters.time) {
      const totalTime = recipe.prepTime + recipe.cookTime;
      switch (filters.time) {
        case "under15":
          if (totalTime >= 15) return false;
          break;
        case "15to30":
          if (totalTime < 15 || totalTime > 30) return false;
          break;
        case "30to60":
          if (totalTime < 30 || totalTime > 60) return false;
          break;
        case "over60":
          if (totalTime <= 60) return false;
          break;
      }
    }

    // Difficulty
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }

    // Dietary tags (must match ALL selected)
    if (filters.dietary.length > 0) {
      const hasAllTags = filters.dietary.every((tag) =>
        recipe.dietaryTags.includes(tag)
      );
      if (!hasAllTags) return false;
    }

    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function RecipesPage() {
  const t = useTranslations("recipes");

  // Tab state
  const [activeTab, setActiveTab] = useState<RecipeTab>("discover");

  // Filter state
  const [filters, setFilters] = useState<RecipeFilterState>({
    search: "",
    canCookNow: false,
    mealType: null,
    cuisine: null,
    time: null,
    difficulty: null,
    dietary: [],
  });

  // Recipes state (with favorites toggle)
  const [recipes, setRecipes] = useState(mockRecipes);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Get recipes for current tab
  const tabRecipes = useMemo(() => {
    switch (activeTab) {
      case "discover":
        return recipes.filter((r) => r.isPublished);
      case "favorites":
        return recipes.filter((r) => r.isFavorite);
      case "my-recipes":
        return recipes.filter((r) => r.isOwned);
      default:
        return [];
    }
  }, [activeTab, recipes]);

  // Apply filters (only on discover tab)
  const filteredRecipes = useMemo(() => {
    if (activeTab === "discover") {
      return filterRecipes(tabRecipes, filters);
    }
    // Simple search for other tabs
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return tabRecipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search)
      );
    }
    return tabRecipes;
  }, [activeTab, tabRecipes, filters]);

  // Counts for tabs
  const counts = {
    discover: recipes.filter((r) => r.isPublished).length,
    favorites: recipes.filter((r) => r.isFavorite).length,
    myRecipes: recipes.filter((r) => r.isOwned).length,
  };

  // My recipes stats
  const myRecipes = recipes.filter((r) => r.isOwned);
  const publishedCount = myRecipes.filter((r) => r.isPublished).length;
  const draftCount = myRecipes.filter((r) => !r.isPublished).length;
  const totalSaves = myRecipes.reduce((sum, r) => sum + (r.reviewCount * 2), 0); // Mock
  const avgRating = myRecipes.length > 0
    ? myRecipes.reduce((sum, r) => sum + r.rating, 0) / myRecipes.filter(r => r.rating > 0).length || 0
    : 0;

  // Handle create button
  const handleCreate = () => {
    // TODO: Open create modal or navigate to create page
    console.log("Create recipe");
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {t("title")}
        </h1>
        <button
          onClick={handleCreate}
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          {t("createRecipe")}
        </button>
      </div>

      {/* Tabs */}
      <RecipeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        labels={{
          discover: t("tabs.discover"),
          favorites: t("tabs.favorites"),
          myRecipes: t("tabs.myRecipes"),
        }}
        counts={counts}
      />

      {/* Content */}
      <div className="py-6">
        {/* Filters (Discover tab only) */}
        {activeTab === "discover" && (
          <div className="mb-6">
            <RecipeFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredRecipes.length}
              labels={{
                search: t("filters.search"),
                canCookNow: t("filters.canCookNow"),
                meal: t("filters.meal"),
                cuisine: t("filters.cuisine"),
                time: t("filters.time"),
                difficulty: t("filters.difficulty"),
                diet: t("filters.diet"),
                clearAll: t("filters.clearAll"),
                showing: t("filters.showing"),
                recipes: t("filters.recipes"),
              }}
            />
          </div>
        )}

        {/* My Recipes Stats */}
        {activeTab === "my-recipes" && myRecipes.length > 0 && (
          <RecipeStats
            publishedCount={publishedCount}
            draftCount={draftCount}
            totalSaves={totalSaves}
            avgRating={avgRating}
            labels={{
              published: t("stats.published"),
              drafts: t("stats.drafts"),
              totalSaves: t("stats.totalSaves"),
              avgRating: t("stats.avgRating"),
            }}
          />
        )}

        {/* Recipe Grid */}
        <RecipeGrid
          recipes={filteredRecipes}
          onToggleFavorite={toggleFavorite}
          showPantryMatch={activeTab === "discover"}
          emptyState={
            activeTab === "favorites" ? (
              <EmptyState
                type="favorites"
                title={t("empty.favoritesTitle")}
                description={t("empty.favoritesDescription")}
                actionLabel={t("empty.favoritesAction")}
                onAction={() => setActiveTab("discover")}
              />
            ) : activeTab === "my-recipes" ? (
              <EmptyState
                type="my-recipes"
                title={t("empty.myRecipesTitle")}
                description={t("empty.myRecipesDescription")}
                actionLabel={t("empty.myRecipesAction")}
                onAction={handleCreate}
              />
            ) : filters.search || filters.canCookNow || filters.mealType || filters.cuisine || filters.time || filters.difficulty || filters.dietary.length > 0 ? (
              <EmptyState
                type="no-results"
                title={t("empty.noResultsTitle")}
                description={t("empty.noResultsDescription")}
              />
            ) : null
          }
        />
      </div>

      {/* Mobile FAB */}
      <button
        onClick={handleCreate}
        className="sm:hidden fixed bottom-24 right-4 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-20"
        aria-label={t("createRecipe")}
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}
