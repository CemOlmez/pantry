"use client";

import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const macros = {
  calories: { consumed: 1450, goal: 2000 },
  protein: { consumed: 85, goal: 130, unit: "g" },
  carbs: { consumed: 160, goal: 250, unit: "g" },
  fat: { consumed: 52, goal: 70, unit: "g" },
};

function Ring({
  size,
  strokeWidth,
  progress,
  color,
  trackColor = "var(--color-bg-secondary)",
  children,
}: {
  size: number;
  strokeWidth: number;
  progress: number;
  color: string;
  trackColor?: string;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - Math.min(progress, 1) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export function MacroRings() {
  const caloriesRemaining = macros.calories.goal - macros.calories.consumed;

  return (
    <div className={cn(
      "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]",
      "shadow-sm overflow-hidden"
    )}>
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30">
              <Flame size={15} className="text-orange-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Daily Nutrition</h2>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--color-text)] tabular-nums">
              {macros.calories.consumed}/{macros.calories.goal}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">kcal today</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Ring
            size={140}
            strokeWidth={12}
            progress={macros.calories.consumed / macros.calories.goal}
            color="var(--color-primary)"
          >
            <span className="text-2xl font-bold text-[var(--color-text)]">
              {caloriesRemaining}
            </span>
            <span className="text-xs text-[var(--color-text-secondary)]">
              remaining
            </span>
          </Ring>

          <div className="flex gap-6">
            {([
              { key: "protein" as const, label: "Protein", color: "#4A90D9" },
              { key: "carbs" as const, label: "Carbs", color: "var(--color-accent)" },
              { key: "fat" as const, label: "Fat", color: "#D4A03E" },
            ]).map(({ key, label, color }) => {
              const data = macros[key];
              return (
                <div key={key} className="flex flex-col items-center gap-1">
                  <Ring
                    size={80}
                    strokeWidth={8}
                    progress={data.consumed / data.goal}
                    color={color}
                  >
                    <span className="text-xs font-semibold text-[var(--color-text)]">
                      {data.consumed}/{data.goal}
                    </span>
                  </Ring>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
