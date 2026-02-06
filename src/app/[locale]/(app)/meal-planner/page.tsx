"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import type { MealSlotType } from "@/components/meal-prep/types";
import { getMealPrepById } from "@/components/meal-prep/mock-data";
import {
  WeekHeader,
  CalendarGrid,
  NutritionBar,
  AddMealModal,
  createSampleWeek,
  getWeekStart,
  createEmptyWeek,
  importMealPrepToPlan,
} from "@/components/meal-planner";
import type { PlannerWeek, PlannerMeal, AddMealTarget } from "@/components/meal-planner";

export default function MealPlannerPage() {
  const t = useTranslations("mealPlanner");

  // Week state: map of startDate → PlannerWeek
  const [weeks, setWeeks] = useState<Record<string, PlannerWeek>>(() => {
    const sample = createSampleWeek();
    return { [sample.startDate]: sample };
  });

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => getWeekStart(new Date()));
  const [addMealTarget, setAddMealTarget] = useState<AddMealTarget | null>(null);

  // Get or create the current week
  const weekKey = `${currentWeekStart.getFullYear()}-${String(currentWeekStart.getMonth() + 1).padStart(2, "0")}-${String(currentWeekStart.getDate()).padStart(2, "0")}`;
  const currentWeek = weeks[weekKey] ?? createEmptyWeek(currentWeekStart);

  const navigateWeek = useCallback((offset: number) => {
    setCurrentWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + offset * 7);
      return d;
    });
  }, []);

  const goToToday = useCallback(() => {
    setCurrentWeekStart(getWeekStart(new Date()));
  }, []);

  const handleAddMeal = useCallback(
    (date: string, slotType: string, meal: PlannerMeal) => {
      setWeeks((prev) => {
        const week = prev[weekKey] ?? createEmptyWeek(currentWeekStart);
        const newDays = week.days.map((day) => {
          if (day.date !== date) return day;
          return {
            ...day,
            slots: day.slots.map((slot) => {
              if (slot.type !== slotType) return slot;
              return { ...slot, meals: [...slot.meals, meal] };
            }),
          };
        });
        return { ...prev, [weekKey]: { ...week, days: newDays } };
      });
    },
    [weekKey, currentWeekStart],
  );

  const handleRemoveMeal = useCallback(
    (date: string, slotType: MealSlotType, mealId: string) => {
      setWeeks((prev) => {
        const week = prev[weekKey];
        if (!week) return prev;
        const newDays = week.days.map((day) => {
          if (day.date !== date) return day;
          return {
            ...day,
            slots: day.slots.map((slot) => {
              if (slot.type !== slotType) return slot;
              return {
                ...slot,
                meals: slot.meals.filter((m) => m.id !== mealId),
              };
            }),
          };
        });
        return { ...prev, [weekKey]: { ...week, days: newDays } };
      });
    },
    [weekKey],
  );

  const handleImportMealPrep = useCallback(
    (mealPrepId: string, startDate: string) => {
      const prep = getMealPrepById(mealPrepId);
      if (!prep) return;

      const importedDays = importMealPrepToPlan(prep, startDate);

      setWeeks((prev) => {
        const week = prev[weekKey] ?? createEmptyWeek(currentWeekStart);
        const newDays = week.days.map((day) => {
          const importedDay = importedDays.find((d) => d.date === day.date);
          if (!importedDay) return day;
          return {
            ...day,
            slots: day.slots.map((slot) => {
              const importedSlot = importedDay.slots.find(
                (s) => s.type === slot.type,
              );
              if (!importedSlot || importedSlot.meals.length === 0) return slot;
              return {
                ...slot,
                meals: [...slot.meals, ...importedSlot.meals],
              };
            }),
          };
        });
        return { ...prev, [weekKey]: { ...week, days: newDays } };
      });
    },
    [weekKey, currentWeekStart],
  );

  return (
    <div className="space-y-4 pb-24 md:pb-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("title")}
      </h1>

      {/* Week header with navigation */}
      <WeekHeader
        weekStart={currentWeekStart}
        onPrevWeek={() => navigateWeek(-1)}
        onNextWeek={() => navigateWeek(1)}
        onToday={goToToday}
      />

      {/* Calendar grid */}
      <CalendarGrid
        week={currentWeek}
        weekStart={currentWeekStart}
        onOpenAddMeal={(target) => setAddMealTarget(target)}
        onRemoveMeal={handleRemoveMeal}
      />

      {/* Nutrition summary */}
      <NutritionBar week={currentWeek} />

      {/* Mobile FAB */}
      <button
        onClick={() => {
          // Default to today's breakfast when FAB is pressed
          const today = new Date();
          const y = today.getFullYear();
          const m = String(today.getMonth() + 1).padStart(2, "0");
          const d = String(today.getDate()).padStart(2, "0");
          setAddMealTarget({ date: `${y}-${m}-${d}`, slotType: "breakfast" });
        }}
        className="md:hidden fixed right-4 bottom-20 w-14 h-14 rounded-full bg-[var(--color-primary)] text-white shadow-lg hover:bg-[var(--color-primary-hover)] transition-colors flex items-center justify-center cursor-pointer z-30"
      >
        <Plus size={24} />
      </button>

      {/* Add Meal Modal */}
      {addMealTarget && (
        <AddMealModal
          target={addMealTarget}
          onClose={() => setAddMealTarget(null)}
          onAddMeal={handleAddMeal}
          onImportMealPrep={handleImportMealPrep}
        />
      )}
    </div>
  );
}
