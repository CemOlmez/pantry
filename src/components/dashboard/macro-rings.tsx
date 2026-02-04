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
  const caloriesPercent = Math.round(
    (macros.calories.consumed / macros.calories.goal) * 100
  );

  const macroItems = [
    { key: "protein" as const, label: "Protein", color: "#4A90D9", dotClass: "bg-[#4A90D9]" },
    { key: "carbs" as const, label: "Carbs", color: "var(--color-accent)", dotClass: "bg-[var(--color-accent)]" },
    { key: "fat" as const, label: "Fat", color: "#D4A03E", dotClass: "bg-[#D4A03E]" },
  ];

  return (
    <div
      className={cn(
        "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]",
        "shadow-sm overflow-hidden"
      )}
    >
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400" />

      <div className={cn("p-5 sm:p-6")}>
        {/* Header */}
        <div className={cn("flex items-center justify-between mb-5")}>
          <div className={cn("flex items-center gap-2.5")}>
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-lg",
                "bg-orange-50 dark:bg-orange-950/30"
              )}
            >
              <Flame size={15} className="text-orange-500" />
            </div>
            <h2 className={cn("text-sm font-semibold text-[var(--color-text)]")}>
              Daily Nutrition
            </h2>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-xs font-semibold text-[var(--color-text)] tabular-nums"
              )}
            >
              {macros.calories.consumed}/{macros.calories.goal}
            </p>
            <p className={cn("text-xs text-[var(--color-text-tertiary)]")}>
              kcal today
            </p>
          </div>
        </div>

        {/* Rings area */}
        <div className={cn("flex flex-col sm:flex-row items-center gap-6")}>
          {/* Main calorie ring */}
          <div className={cn("flex flex-col items-center gap-2")}>
            <Ring
              size={150}
              strokeWidth={12}
              progress={macros.calories.consumed / macros.calories.goal}
              color="var(--color-primary)"
            >
              <span
                className={cn(
                  "text-2xl font-bold text-[var(--color-text)]"
                )}
              >
                {caloriesRemaining}
              </span>
              <span
                className={cn("text-xs text-[var(--color-text-secondary)]")}
              >
                remaining
              </span>
            </Ring>
            <span
              className={cn(
                "text-xs font-medium text-[var(--color-primary)]"
              )}
            >
              {caloriesPercent}% of daily goal
            </span>
          </div>

          {/* Macro rings */}
          <div className={cn("flex gap-6")}>
            {macroItems.map(({ key, label, color, dotClass }) => {
              const data = macros[key];
              const percent = Math.round((data.consumed / data.goal) * 100);
              return (
                <div
                  key={key}
                  className={cn("flex flex-col items-center gap-1.5")}
                >
                  <Ring
                    size={80}
                    strokeWidth={8}
                    progress={data.consumed / data.goal}
                    color={color}
                  >
                    <span
                      className={cn(
                        "text-xs font-semibold text-[var(--color-text)]"
                      )}
                    >
                      {percent}%
                    </span>
                  </Ring>
                  <div className={cn("flex items-center gap-1.5")}>
                    <span
                      className={cn("inline-block w-2 h-2 rounded-full", dotClass)}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium text-[var(--color-text)]"
                      )}
                    >
                      {label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] tabular-nums text-[var(--color-text-secondary)]"
                    )}
                  >
                    {data.consumed}
                    {data.unit} / {data.goal}
                    {data.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className={cn(
          "flex items-center justify-between px-5 sm:px-6 py-3",
          "border-t border-[var(--color-border)]"
        )}
      >
        <span className={cn("text-xs text-[var(--color-text-tertiary)]")}>
          Updated 2 hours ago
        </span>
        <button
          className={cn(
            "text-xs font-medium text-[var(--color-primary)] hover:underline"
          )}
        >
          Log Food
        </button>
      </div>
    </div>
  );
}
