"use client";

import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { name: "Milk", quantity: 1, unit: "L", daysLeft: 0 },
  { name: "Chicken Breast", quantity: 500, unit: "g", daysLeft: 1 },
  { name: "Spinach", quantity: 200, unit: "g", daysLeft: 2 },
  { name: "Greek Yogurt", quantity: 2, unit: "cups", daysLeft: 3 },
];

function ExpiryBadge({ daysLeft }: { daysLeft: number }) {
  const config =
    daysLeft === 0
      ? { label: "Today", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
      : daysLeft === 1
        ? { label: "Tomorrow", classes: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" }
        : { label: `${daysLeft} days`, classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };

  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.classes)}>
      {config.label}
    </span>
  );
}

export function ExpiringItems() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30">
              <AlertTriangle size={15} className="text-red-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Expiring Soon
            </h2>
          </div>
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            {items.length} items
          </span>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-[var(--color-border)] px-3.5 py-3 hover:bg-[var(--color-bg-secondary)] transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {item.name}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {item.quantity} {item.unit}
                </p>
              </div>
              <ExpiryBadge daysLeft={item.daysLeft} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
