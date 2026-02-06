"use client";

import {
  Heart,
  Flame,
  Calendar,
  UtensilsCrossed,
  Dumbbell,
  Leaf,
  Zap,
  Scale,
  Scissors,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MealPrepPlan } from "./types";
import { getPlanDailyAverage, getTotalMeals } from "./mock-data";
import { Link } from "@/i18n/navigation";

/* ------------------------------------------------------------------ */
/*  Placeholder backgrounds by plan type                               */
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
/*  Difficulty badge colors                                            */
/* ------------------------------------------------------------------ */

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

/* ------------------------------------------------------------------ */
/*  Plan type labels                                                   */
/* ------------------------------------------------------------------ */

const planTypeIcons: Record<string, React.ElementType> = {
  daily: Calendar,
  weekly: Calendar,
  monthly: Calendar,
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type MealPrepCardProps = {
  plan: MealPrepPlan;
  onToggleFavorite?: (id: string) => void;
  labels: {
    days: string;
    meals: string;
    calDay: string;
    draft: string;
  };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MealPrepCard({ plan, onToggleFavorite, labels }: MealPrepCardProps) {
  const placeholder = placeholderConfig[plan.placeholderType || ""] || defaultPlaceholder;
  const PlaceholderIcon = placeholder.icon;
  const PlanIcon = planTypeIcons[plan.planType] || Calendar;

  const dailyAvg = getPlanDailyAverage(plan);
  const totalMeals = getTotalMeals(plan);

  return (
    <Link
      href={`/meal-prep/${plan.id}`}
      className="group block rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      {/* Image / Placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden">
        {plan.image ? (
          <img
            src={plan.image}
            alt={plan.title}
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
            onToggleFavorite?.(plan.id);
          }}
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all",
            plan.isFavorite
              ? "bg-red-500 text-white"
              : "bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
          )}
          aria-label={plan.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("w-5 h-5", plan.isFavorite && "fill-current")} />
        </button>

        {/* Draft badge */}
        {plan.isOwned && !plan.isPublished && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-xs font-medium">
            {labels.draft}
          </div>
        )}

        {/* Gradient accent bar */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
            placeholder.gradient
          )}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-[var(--color-text)] line-clamp-2 leading-snug mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {plan.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-[var(--color-text-secondary)] mb-3">
          {plan.author.name}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-sm mb-3">
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <PlanIcon className="w-4 h-4" />
            {plan.days.length} {labels.days}
          </span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
              difficultyColors[plan.difficulty]
            )}
          >
            {plan.difficulty}
          </span>
          <span className="flex items-center gap-1.5 text-[var(--color-text-secondary)]">
            <Flame className="w-4 h-4" />
            {dailyAvg.calories} {labels.calDay}
          </span>
        </div>

        {/* Meals count */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
          <UtensilsCrossed className="w-4 h-4" />
          <span>
            {totalMeals} {labels.meals}
          </span>
        </div>
      </div>
    </Link>
  );
}
