"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getWeekDays, formatDateKey } from "./utils";

interface WeekHeaderProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
}

const SHORT_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export function WeekHeader({ weekStart, onPrevWeek, onNextWeek, onToday }: WeekHeaderProps) {
  const t = useTranslations("mealPlanner");
  const days = getWeekDays(weekStart);
  const todayKey = formatDateKey(new Date());

  const weekEnd = days[6];
  const startMonth = weekStart.toLocaleString("en-US", { month: "short" });
  const endMonth = weekEnd.toLocaleString("en-US", { month: "short" });
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const year = weekEnd.getFullYear();

  const dateRange =
    startMonth === endMonth
      ? `${startMonth} ${startDay} – ${endDay}, ${year}`
      : `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;

  return (
    <div className="space-y-3">
      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <button
            onClick={onNextWeek}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
          >
            <ChevronRight size={20} className="text-[var(--color-text-secondary)]" />
          </button>
          <h2 className="text-lg font-semibold text-[var(--color-text)] ml-1">
            {dateRange}
          </h2>
        </div>
        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
        >
          {t("today")}
        </button>
      </div>

      {/* Day column headers — desktop only */}
      <div className="hidden md:grid grid-cols-[80px_repeat(7,1fr)] gap-1">
        <div /> {/* spacer for row labels */}
        {days.map((d, i) => {
          const isToday = formatDateKey(d) === todayKey;
          return (
            <div
              key={i}
              className={cn(
                "text-center py-1.5 rounded-lg text-sm font-medium",
                isToday
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)]",
              )}
            >
              <span className="block text-xs uppercase">
                {t(`days.${SHORT_DAYS[i]}`)}
              </span>
              <span className="block text-base font-semibold">
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
