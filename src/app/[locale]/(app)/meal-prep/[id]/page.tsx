"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  ArrowLeft,
  Heart,
  MoreHorizontal,
  Flame,
  Calendar,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Dumbbell,
  Leaf,
  Zap,
  Scale,
  Scissors,
  BarChart3,
  Share2,
  Flag,
  Pencil,
  Star,
  Coffee,
  Sun,
  Moon,
  Cookie,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import {
  mockMealPreps,
  getDayNutrition,
  getSlotNutrition,
  getPlanDailyAverage,
  getPlanNutrition,
  getTotalMeals,
  aggregateIngredients,
  MealPrepCard,
} from "@/components/meal-prep";
import type { MealPrepDay, MealSlot } from "@/components/meal-prep";

/* ------------------------------------------------------------------ */
/*  Placeholder backgrounds                                            */
/* ------------------------------------------------------------------ */

const placeholderConfig: Record<string, { gradient: string; icon: React.ElementType }> = {
  balanced: { gradient: "from-blue-400 to-indigo-500", icon: BarChart3 },
  protein: { gradient: "from-red-400 to-rose-500", icon: Dumbbell },
  vegan: { gradient: "from-emerald-400 to-green-500", icon: Leaf },
  keto: { gradient: "from-purple-400 to-violet-500", icon: Zap },
  bulk: { gradient: "from-amber-400 to-orange-500", icon: Scale },
  cut: { gradient: "from-cyan-400 to-teal-500", icon: Scissors },
};

const defaultPlaceholder = { gradient: "from-slate-400 to-slate-500", icon: UtensilsCrossed };

/* ------------------------------------------------------------------ */
/*  Slot icons                                                         */
/* ------------------------------------------------------------------ */

const slotIcons: Record<string, React.ElementType> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

/* ------------------------------------------------------------------ */
/*  Difficulty colors                                                  */
/* ------------------------------------------------------------------ */

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/* ------------------------------------------------------------------ */
/*  Nutrition Card                                                     */
/* ------------------------------------------------------------------ */

function NutritionGrid({ calories, protein, carbs, fat, labels }: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  labels: { calories: string; protein: string; carbs: string; fat: string };
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-2 text-center">
        <div className="text-lg font-bold text-[var(--color-text)]">{calories}</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{labels.calories}</div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-2 text-center">
        <div className="text-lg font-bold text-[var(--color-text)]">{protein}g</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{labels.protein}</div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-2 text-center">
        <div className="text-lg font-bold text-[var(--color-text)]">{carbs}g</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{labels.carbs}</div>
      </div>
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-2 text-center">
        <div className="text-lg font-bold text-[var(--color-text)]">{fat}g</div>
        <div className="text-xs text-[var(--color-text-secondary)]">{labels.fat}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Day Accordion                                                      */
/* ------------------------------------------------------------------ */

function DayAccordion({
  day,
  isOpen,
  onToggle,
  slotLabels,
  nutritionLabels,
}: {
  day: MealPrepDay;
  isOpen: boolean;
  onToggle: () => void;
  slotLabels: Record<string, string>;
  nutritionLabels: { calories: string; protein: string; carbs: string; fat: string };
}) {
  const dayNutrition = getDayNutrition(day);

  return (
    <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
      {/* Day header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-[var(--color-surface)] hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-semibold text-sm">
            {day.dayIndex + 1}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-[var(--color-text)]">{day.label}</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {day.meals.length} meals · {dayNutrition.calories} cal
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-[var(--color-text-secondary)]" />
        ) : (
          <ChevronDown className="w-5 h-5 text-[var(--color-text-secondary)]" />
        )}
      </button>

      {/* Day content */}
      {isOpen && (
        <div className="p-4 space-y-4 bg-[var(--color-bg)]">
          {/* Meal slots */}
          {day.meals.map((meal, mealIdx) => {
            const SlotIcon = slotIcons[meal.type] || UtensilsCrossed;
            const slotNutrition = getSlotNutrition(meal);

            return (
              <div key={mealIdx} className="bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
                {/* Slot header */}
                <div className="flex items-center gap-2 mb-3">
                  <SlotIcon className="w-5 h-5 text-[var(--color-primary)]" />
                  <h4 className="font-medium text-[var(--color-text)] capitalize">
                    {slotLabels[meal.type] || meal.type}
                  </h4>
                  <span className="ml-auto text-sm text-[var(--color-text-secondary)]">
                    {slotNutrition.calories} cal
                  </span>
                </div>

                {/* Meal items */}
                {meal.items.map((item) => (
                  <div key={item.id} className="ml-7 mb-2 last:mb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--color-text)]">{item.name}</span>
                      {item.servings > 1 && (
                        <span className="text-xs text-[var(--color-text-tertiary)]">
                          x{item.servings} servings
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      <span>{item.nutrition.calories} cal</span>
                      <span>{item.nutrition.protein}g P</span>
                      <span>{item.nutrition.carbs}g C</span>
                      <span>{item.nutrition.fat}g F</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* Day nutrition total */}
          <div className="pt-2">
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">
              Day Total
            </p>
            <NutritionGrid
              calories={dayNutrition.calories}
              protein={dayNutrition.protein}
              carbs={dayNutrition.carbs}
              fat={dayNutrition.fat}
              labels={nutritionLabels}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function MealPrepDetailPage() {
  const params = useParams();
  const t = useTranslations("mealPrep.detail");
  const tDiff = useTranslations("mealPrep.difficulty");

  const planId = params.id as string;
  const plan = mockMealPreps.find((p) => p.id === planId);

  // State
  const [isFavorite, setIsFavorite] = useState(plan?.isFavorite ?? false);
  const [openDays, setOpenDays] = useState<Set<number>>(new Set([0]));
  const [showMenu, setShowMenu] = useState(false);

  // Toggle day accordion
  const toggleDay = (idx: number) => {
    setOpenDays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // Aggregated ingredients
  const allIngredients = useMemo(() => {
    if (!plan) return [];
    return aggregateIngredients(plan);
  }, [plan]);

  // Related plans
  const relatedPlans = useMemo(() => {
    if (!plan) return [];
    return mockMealPreps
      .filter(
        (p) =>
          p.id !== plan.id &&
          p.isPublished &&
          (p.planType === plan.planType ||
            p.dietaryTags.some((tag) => plan.dietaryTags.includes(tag)))
      )
      .slice(0, 3);
  }, [plan]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[var(--color-text-secondary)]">Meal prep plan not found</p>
        <Link
          href="/meal-prep"
          className="mt-4 text-[var(--color-primary)] hover:underline"
        >
          Back to meal preps
        </Link>
      </div>
    );
  }

  const placeholder = placeholderConfig[plan.placeholderType || ""] || defaultPlaceholder;
  const PlaceholderIcon = placeholder.icon;
  const dailyAvg = getPlanDailyAverage(plan);
  const planTotal = getPlanNutrition(plan);
  const totalMeals = getTotalMeals(plan);

  const nutritionLabels = {
    calories: t("calories"),
    protein: t("protein"),
    carbs: t("carbs"),
    fat: t("fat"),
  };

  const slotLabels: Record<string, string> = {
    breakfast: t("breakfast"),
    lunch: t("lunch"),
    dinner: t("dinner"),
    snack: t("snack"),
  };

  const cardLabels = {
    days: t("daysLabel"),
    meals: t("mealsLabel"),
    calDay: t("calDay"),
    draft: t("draft"),
  };

  return (
    <div className="-m-4 sm:-m-8">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[280px] max-h-[400px]">
        {plan.image ? (
          <img
            src={plan.image}
            alt={plan.title}
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
            href="/meal-prep"
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
                  {plan.isOwned && (
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
          {plan.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4">
          <span>
            {t("by")} <span className="font-medium text-[var(--color-text)]">{plan.author.name}</span>
          </span>
          {plan.rating > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {plan.rating.toFixed(1)}
                <span className="text-[var(--color-text-tertiary)]">
                  ({plan.reviewCount})
                </span>
              </span>
            </>
          )}
        </div>

        {/* Stats badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)] capitalize">{plan.planType}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Calendar className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{plan.days.length} {t("daysLabel")}</span>
          </div>
          <div
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium capitalize",
              difficultyColors[plan.difficulty]
            )}
          >
            {tDiff(plan.difficulty)}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <Flame className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{dailyAvg.calories} {t("calDay")}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-bg-secondary)] rounded-full text-sm">
            <UtensilsCrossed className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="text-[var(--color-text)]">{totalMeals} {t("mealsLabel")}</span>
          </div>
        </div>

        {/* Dietary tags */}
        {plan.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {plan.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <p className="text-[var(--color-text-secondary)] mb-8">{plan.description}</p>

        {/* Daily Average Nutrition */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {t("dailyAverage")}
          </h2>
          <NutritionGrid
            calories={dailyAvg.calories}
            protein={dailyAvg.protein}
            carbs={dailyAvg.carbs}
            fat={dailyAvg.fat}
            labels={nutritionLabels}
          />
        </section>

        {/* Day-by-Day Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {t("dayByDay")}
          </h2>

          <div className="space-y-3">
            {plan.days.map((day, idx) => (
              <DayAccordion
                key={idx}
                day={day}
                isOpen={openDays.has(idx)}
                onToggle={() => toggleDay(idx)}
                slotLabels={slotLabels}
                nutritionLabels={nutritionLabels}
              />
            ))}
          </div>
        </section>

        {/* Aggregated Ingredients */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("shoppingList")} ({allIngredients.length})
            </h2>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
              <ShoppingCart className="w-4 h-4" />
              {t("addToShoppingList")}
            </button>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl divide-y divide-[var(--color-border)]">
            {allIngredients.map((ing, idx) => (
              <div key={idx} className="flex items-center justify-between px-4 py-3">
                <span className="text-[var(--color-text)]">{ing.name}</span>
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {ing.quantity} {ing.unit}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Plan Total Nutrition */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
            {t("planTotal")}
          </h2>
          <NutritionGrid
            calories={planTotal.calories}
            protein={planTotal.protein}
            carbs={planTotal.carbs}
            fat={planTotal.fat}
            labels={nutritionLabels}
          />
        </section>

        {/* Related Plans */}
        {relatedPlans.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">
              {t("relatedPlans")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPlans.slice(0, 2).map((p) => (
                <MealPrepCard
                  key={p.id}
                  plan={p}
                  labels={cardLabels}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
