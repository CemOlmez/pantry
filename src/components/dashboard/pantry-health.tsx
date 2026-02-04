"use client";

import { ShieldCheck, TrendingUp } from "lucide-react";

const score = 78;
const categories = [
  { label: "Freshness", score: 85, color: "#4D9A4A" },
  { label: "Variety", score: 72, color: "#3B82F6" },
  { label: "Stock Level", score: 68, color: "#E8913A" },
  { label: "Waste Risk", score: 88, color: "#8B5CF6" },
];

function ScoreRing({ value, size, color }: { value: number; size: number; color: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="-rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-bg-tertiary)" strokeWidth={5} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-[var(--color-text)]">{value}</span>
      </div>
    </div>
  );
}

export function PantryHealth() {
  const trend = 3;

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400" />
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
              <ShieldCheck size={15} className="text-emerald-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">Pantry Health</h2>
          </div>
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
            <TrendingUp size={12} />
            +{trend}%
          </div>
        </div>

        <div className="flex items-center justify-center mb-5">
          <ScoreRing value={score} size={88} color="#4D9A4A" />
        </div>

        <div className="space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-xs text-[var(--color-text-secondary)] w-20 shrink-0">{cat.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${cat.score}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-xs font-semibold text-[var(--color-text)] w-7 text-right tabular-nums">{cat.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
