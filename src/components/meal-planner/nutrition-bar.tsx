"use client";

import { useTranslations } from "next-intl";
import type { PlannerWeek } from "./types";
import { getWeekNutrition, getWeekDailyAverage } from "./utils";

interface NutritionBarProps {
  week: PlannerWeek;
}

export function NutritionBar({ week }: NutritionBarProps) {
  const t = useTranslations("mealPlanner");
  const total = getWeekNutrition(week);
  const avg = getWeekDailyAverage(week);

  const stats = [
    { label: t("nutrition.cal"), value: avg.calories, total: total.calories, color: "var(--color-primary)" },
    { label: t("nutrition.protein"), value: avg.protein, total: total.protein, unit: "g", color: "#3B82F6" },
    { label: t("nutrition.carbs"), value: avg.carbs, total: total.carbs, unit: "g", color: "#F59E0B" },
    { label: t("nutrition.fat"), value: avg.fat, total: total.fat, unit: "g", color: "#10B981" },
  ];

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("nutrition.weeklyAverage")}
        </h3>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          {t("nutrition.weeklyTotal")}: {total.calories} {t("nutrition.cal")}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="text-xl font-bold"
              style={{ color: s.color }}
            >
              {s.value}
              {s.unit && <span className="text-xs font-normal ml-0.5">{s.unit}</span>}
            </div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
