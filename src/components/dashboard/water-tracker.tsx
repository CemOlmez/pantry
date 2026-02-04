"use client";

import { useState } from "react";
import { Droplets, Plus, Minus } from "lucide-react";

const GOAL = 8;

export function WaterTracker() {
  const [glasses, setGlasses] = useState(5);
  const pct = Math.min((glasses / GOAL) * 100, 100);

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <Droplets size={15} className="text-blue-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Water</h2>
          </div>
          <span className="text-xs font-medium text-[var(--color-text-tertiary)]">
            {glasses}/{GOAL} glasses
          </span>
        </div>

        {/* Visual dots */}
        <div className="flex items-center justify-center gap-2 mb-5">
          {Array.from({ length: GOAL }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 transition-all duration-300"
              style={{
                borderColor: i < glasses ? "#3B82F6" : "var(--color-bg-tertiary)",
                backgroundColor: i < glasses ? "#3B82F6" : "transparent",
              }}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden mb-5">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out bg-blue-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={() => setGlasses(Math.max(0, glasses - 1))}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] transition-colors cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <div className="text-center">
            <p className="text-2xl font-bold text-[var(--color-text)] tabular-nums">{glasses}</p>
            <p className="text-xs text-[var(--color-text-tertiary)] -mt-0.5">glasses</p>
          </div>
          <button
            onClick={() => setGlasses(Math.min(GOAL + 4, glasses + 1))}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
