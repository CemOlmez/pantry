"use client";

import { TrendingUp } from "lucide-react";

const data = [
  { day: "Mon", calories: 1800 },
  { day: "Tue", calories: 2100 },
  { day: "Wed", calories: 1650 },
  { day: "Thu", calories: 1950 },
  { day: "Fri", calories: 2200 },
  { day: "Sat", calories: 1750 },
  { day: "Sun", calories: 1450 },
];

const GOAL = 2000;
const max = Math.max(...data.map((d) => d.calories), GOAL);

export function WeeklyTrend() {
  const avg = Math.round(data.reduce((s, d) => s + d.calories, 0) / data.length);
  const todayIdx = new Date().getDay();
  const todayLabel = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][todayIdx];

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
              <TrendingUp size={15} className="text-indigo-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Weekly Calories</h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--color-text)] tabular-nums">{avg}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">avg kcal/day</p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-2 h-28">
          {data.map((d) => {
            const h = (d.calories / max) * 100;
            const isToday = d.day === todayLabel;
            const overGoal = d.calories > GOAL;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center">
                <div className="w-full relative" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-1 right-1 rounded-md transition-all duration-500 ease-out"
                    style={{
                      height: `${h}%`,
                      backgroundColor: isToday
                        ? "#E8913A"
                        : overGoal
                          ? "#EF444480"
                          : "var(--color-bg-tertiary)",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Day labels */}
        <div className="flex gap-2 mt-2">
          {data.map((d) => {
            const isToday = d.day === todayLabel;
            return (
              <span key={d.day} className={`flex-1 text-center text-xs font-medium ${isToday ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)]"}`}>
                {d.day}
              </span>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--color-border)]">
          <span className="text-xs text-[var(--color-text-tertiary)]">Goal: {GOAL} kcal/day</span>
          <span className="text-xs text-[var(--color-text-tertiary)]">This week</span>
        </div>
      </div>
    </div>
  );
}
