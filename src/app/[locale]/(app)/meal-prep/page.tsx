"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  MealPrepTabs,
  MealPrepFilters,
  MealPrepGrid,
  MealPrepStats,
  MealPrepEmptyState,
  MealPrepCreator,
  mockMealPreps,
  getPlanDailyAverage,
} from "@/components/meal-prep";
import type {
  MealPrepTab,
  MealPrepFilterState,
  MealPrepPlan,
} from "@/components/meal-prep";

/* ------------------------------------------------------------------ */
/*  Filter logic                                                       */
/* ------------------------------------------------------------------ */

function filterPlans(plans: MealPrepPlan[], filters: MealPrepFilterState): MealPrepPlan[] {
  return plans.filter((plan) => {
    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const matchesTitle = plan.title.toLowerCase().includes(search);
      const matchesDescription = plan.description.toLowerCase().includes(search);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Plan type
    if (filters.planType && plan.planType !== filters.planType) {
      return false;
    }

    // Difficulty
    if (filters.difficulty && plan.difficulty !== filters.difficulty) {
      return false;
    }

    // Dietary tags (must match ALL selected)
    if (filters.dietary.length > 0) {
      const hasAllTags = filters.dietary.every((tag) =>
        plan.dietaryTags.includes(tag)
      );
      if (!hasAllTags) return false;
    }

    // Calorie range
    if (filters.calorieRange) {
      const dailyAvg = getPlanDailyAverage(plan).calories;
      switch (filters.calorieRange) {
        case "under1500":
          if (dailyAvg >= 1500) return false;
          break;
        case "1500to2000":
          if (dailyAvg < 1500 || dailyAvg > 2000) return false;
          break;
        case "2000to2500":
          if (dailyAvg < 2000 || dailyAvg > 2500) return false;
          break;
        case "over2500":
          if (dailyAvg <= 2500) return false;
          break;
      }
    }

    return true;
  });
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MealPrepPage() {
  const t = useTranslations("mealPrep");

  // Tab state
  const [activeTab, setActiveTab] = useState<MealPrepTab>("discover");

  // Filter state
  const [filters, setFilters] = useState<MealPrepFilterState>({
    search: "",
    planType: null,
    difficulty: null,
    dietary: [],
    calorieRange: null,
  });

  // Plans state (with favorites toggle)
  const [plans, setPlans] = useState(mockMealPreps);

  // Creator modal state
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Get plans for current tab
  const tabPlans = useMemo(() => {
    switch (activeTab) {
      case "discover":
        return plans.filter((p) => p.isPublished);
      case "favorites":
        return plans.filter((p) => p.isFavorite);
      case "my-meal-preps":
        return plans.filter((p) => p.isOwned);
      default:
        return [];
    }
  }, [activeTab, plans]);

  // Apply filters (only on discover tab)
  const filteredPlans = useMemo(() => {
    if (activeTab === "discover") {
      return filterPlans(tabPlans, filters);
    }
    // Simple search for other tabs
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return tabPlans.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      );
    }
    return tabPlans;
  }, [activeTab, tabPlans, filters]);

  // Counts for tabs
  const counts = {
    discover: plans.filter((p) => p.isPublished).length,
    favorites: plans.filter((p) => p.isFavorite).length,
    myMealPreps: plans.filter((p) => p.isOwned).length,
  };

  // My meal preps stats
  const myPlans = plans.filter((p) => p.isOwned);
  const publishedCount = myPlans.filter((p) => p.isPublished).length;
  const draftCount = myPlans.filter((p) => !p.isPublished).length;
  const totalSaves = myPlans.reduce((sum, p) => sum + (p.reviewCount * 2), 0);
  const avgRating = myPlans.length > 0
    ? myPlans.reduce((sum, p) => sum + p.rating, 0) / (myPlans.filter(p => p.rating > 0).length || 1)
    : 0;

  // Handle create button
  const handleCreate = () => {
    setIsCreatorOpen(true);
  };

  // Handle save meal prep
  const handleSaveMealPrep = (planData: Partial<MealPrepPlan>, isDraft: boolean) => {
    const newPlan: MealPrepPlan = {
      id: `mp-${Date.now()}`,
      title: planData.title || "Untitled Meal Prep",
      description: planData.description || "",
      author: { id: "current", name: "You" },
      planType: planData.planType || "weekly",
      difficulty: planData.difficulty || "medium",
      dietaryTags: planData.dietaryTags || [],
      days: planData.days || [],
      rating: 0,
      reviewCount: 0,
      isPublished: isDraft ? false : (planData.isPublished ?? false),
      isOwned: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPlans((prev) => [newPlan, ...prev]);
    setActiveTab("my-meal-preps");
  };

  // Card labels
  const cardLabels = {
    days: t("card.days"),
    meals: t("card.meals"),
    calDay: t("card.calDay"),
    draft: t("card.draft"),
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
          {t("createMealPrep")}
        </button>
      </div>

      {/* Tabs */}
      <MealPrepTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        labels={{
          discover: t("tabs.discover"),
          favorites: t("tabs.favorites"),
          myMealPreps: t("tabs.myMealPreps"),
        }}
        counts={counts}
      />

      {/* Content */}
      <div className="py-6">
        {/* Filters (Discover tab only) */}
        {activeTab === "discover" && (
          <div className="mb-6">
            <MealPrepFilters
              filters={filters}
              onFiltersChange={setFilters}
              resultCount={filteredPlans.length}
              labels={{
                search: t("filters.search"),
                planType: t("filters.planType"),
                difficulty: t("filters.difficulty"),
                diet: t("filters.diet"),
                calories: t("filters.calories"),
                clearAll: t("filters.clearAll"),
                showing: t("filters.showing"),
                plans: t("filters.plans"),
              }}
            />
          </div>
        )}

        {/* My Meal Preps Stats */}
        {activeTab === "my-meal-preps" && myPlans.length > 0 && (
          <MealPrepStats
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

        {/* Plan Grid */}
        <MealPrepGrid
          plans={filteredPlans}
          onToggleFavorite={toggleFavorite}
          cardLabels={cardLabels}
          emptyState={
            activeTab === "favorites" ? (
              <MealPrepEmptyState
                type="favorites"
                title={t("empty.favoritesTitle")}
                description={t("empty.favoritesDescription")}
                actionLabel={t("empty.favoritesAction")}
                onAction={() => setActiveTab("discover")}
              />
            ) : activeTab === "my-meal-preps" ? (
              <MealPrepEmptyState
                type="my-meal-preps"
                title={t("empty.myMealPrepsTitle")}
                description={t("empty.myMealPrepsDescription")}
                actionLabel={t("empty.myMealPrepsAction")}
                onAction={handleCreate}
              />
            ) : filters.search || filters.planType || filters.difficulty || filters.dietary.length > 0 || filters.calorieRange ? (
              <MealPrepEmptyState
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
        aria-label={t("createMealPrep")}
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Meal Prep Creator Modal */}
      <MealPrepCreator
        isOpen={isCreatorOpen}
        onClose={() => setIsCreatorOpen(false)}
        onSave={handleSaveMealPrep}
        labels={{
          title: t("create.title"),
          steps: {
            basicInfo: t("create.steps.basicInfo"),
            planDays: t("create.steps.planDays"),
            meals: t("create.steps.meals"),
            review: t("create.steps.review"),
          },
          fields: {
            title: t("create.fields.title"),
            titlePlaceholder: t("create.fields.titlePlaceholder"),
            description: t("create.fields.description"),
            descriptionPlaceholder: t("create.fields.descriptionPlaceholder"),
            planType: t("create.fields.planType"),
            difficulty: t("create.fields.difficulty"),
            dietaryTags: t("create.fields.dietaryTags"),
            selectDays: t("create.fields.selectDays"),
            addMealSlot: t("create.fields.addMealSlot"),
            mealName: t("create.fields.mealName"),
            mealNamePlaceholder: t("create.fields.mealNamePlaceholder"),
            servings: t("create.fields.servings"),
            addIngredient: t("create.fields.addIngredient"),
            ingredient: t("create.fields.ingredient"),
            quantity: t("create.fields.quantity"),
            unit: t("create.fields.unit"),
            nutritionSummary: t("create.fields.nutritionSummary"),
            totalIngredients: t("create.fields.totalIngredients"),
            publishToCommunity: t("create.fields.publishToCommunity"),
          },
          actions: {
            back: t("create.actions.back"),
            next: t("create.actions.next"),
            saveAsDraft: t("create.actions.saveAsDraft"),
            publish: t("create.actions.publish"),
          },
          difficulty: {
            easy: t("difficulty.easy"),
            medium: t("difficulty.medium"),
            hard: t("difficulty.hard"),
          },
          planTypes: {
            daily: t("planTypes.daily"),
            weekly: t("planTypes.weekly"),
            monthly: t("planTypes.monthly"),
          },
          slotTypes: {
            breakfast: t("slotTypes.breakfast"),
            lunch: t("slotTypes.lunch"),
            dinner: t("slotTypes.dinner"),
            snack: t("slotTypes.snack"),
          },
        }}
      />
    </div>
  );
}
