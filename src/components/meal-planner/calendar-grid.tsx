"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { MealSlotType } from "@/components/meal-prep/types";
import type { PlannerWeek, AddMealTarget } from "./types";
import { SlotCell } from "./slot-cell";
import { formatDateKey, getDayNutrition, getWeekDays } from "./utils";

interface CalendarGridProps {
  week: PlannerWeek;
  weekStart: Date;
  onOpenAddMeal: (target: AddMealTarget) => void;
  onRemoveMeal: (date: string, slotType: MealSlotType, mealId: string) => void;
}

const SLOT_TYPES: MealSlotType[] = ["breakfast", "lunch", "dinner", "snack"];
const SHORT_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function CalendarGrid({ week, weekStart, onOpenAddMeal, onRemoveMeal }: CalendarGridProps) {
  const t = useTranslations("mealPlanner");
  const todayKey = formatDateKey(new Date());
  const days = getWeekDays(weekStart);

  return (
    <>
      {/* Desktop grid */}
      <div className="hidden md:block">
        <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-1">
          {SLOT_TYPES.map((slotType) => (
            <div key={slotType} className="contents">
              {/* Row label */}
              <div className="flex items-center justify-end pr-2 text-xs font-medium text-[var(--color-text-secondary)] capitalize">
                {t(`slots.${slotType}`)}
              </div>
              {/* 7 cells */}
              {week.days.map((day) => {
                const slot = day.slots.find((s) => s.type === slotType) ?? {
                  type: slotType,
                  meals: [],
                };
                return (
                  <SlotCell
                    key={`${day.date}-${slotType}`}
                    slot={slot}
                    isToday={day.date === todayKey}
                    onAddMeal={() =>
                      onOpenAddMeal({ date: day.date, slotType })
                    }
                    onRemoveMeal={(mealId) =>
                      onRemoveMeal(day.date, slotType, mealId)
                    }
                  />
                );
              })}
            </div>
          ))}

          {/* Daily totals row */}
          <div className="flex items-center justify-end pr-2 text-xs font-medium text-[var(--color-text-tertiary)]">
            {t("nutrition.total")}
          </div>
          {week.days.map((day) => {
            const dayNutrition = getDayNutrition(day);
            const hasMeals = day.slots.some((s) => s.meals.length > 0);
            return (
              <div
                key={`total-${day.date}`}
                className={cn(
                  "text-center py-1.5 rounded-lg text-xs font-medium",
                  day.date === todayKey
                    ? "text-[var(--color-primary)]"
                    : "text-[var(--color-text-tertiary)]",
                )}
              >
                {hasMeals ? `${dayNutrition.calories} cal` : "—"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical day cards */}
      <div className="md:hidden space-y-4">
        {week.days.map((day, dayIndex) => {
          const isToday = day.date === todayKey;
          const dayNutrition = getDayNutrition(day);
          const hasMeals = day.slots.some((s) => s.meals.length > 0);
          const dateObj = days[dayIndex];

          return (
            <div
              key={day.date}
              className={cn(
                "rounded-2xl border overflow-hidden",
                isToday
                  ? "border-[var(--color-primary)]/30 shadow-sm"
                  : "border-[var(--color-border)]",
              )}
            >
              {/* Day header */}
              <div
                className={cn(
                  "flex items-center justify-between px-4 py-2.5",
                  isToday
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text)]",
                )}
              >
                <div className="font-semibold text-sm">
                  {t(`days.${SHORT_DAYS[dayIndex]}`)} {dateObj.getDate()}
                </div>
                {hasMeals && (
                  <div className={cn("text-xs", isToday ? "text-white/80" : "text-[var(--color-text-tertiary)]")}>
                    {dayNutrition.calories} cal
                  </div>
                )}
              </div>

              {/* Slots */}
              <div className="p-3 space-y-2 bg-[var(--color-surface)]">
                {SLOT_TYPES.map((slotType) => {
                  const slot = day.slots.find((s) => s.type === slotType) ?? {
                    type: slotType,
                    meals: [],
                  };
                  return (
                    <div key={slotType}>
                      <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-1 capitalize">
                        {t(`slots.${slotType}`)}
                      </div>
                      <SlotCell
                        slot={slot}
                        isToday={isToday}
                        onAddMeal={() =>
                          onOpenAddMeal({ date: day.date, slotType })
                        }
                        onRemoveMeal={(mealId) =>
                          onRemoveMeal(day.date, slotType, mealId)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
