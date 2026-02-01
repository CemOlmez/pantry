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
      ? { label: "Today", classes: "bg-red-100 text-red-700" }
      : daysLeft === 1
        ? { label: "Tomorrow", classes: "bg-orange-100 text-orange-700" }
        : { label: `${daysLeft} days`, classes: "bg-yellow-100 text-yellow-700" };

  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", config.classes)}>
      {config.label}
    </span>
  );
}

export function ExpiringItems() {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-4 h-4 text-[var(--color-primary)]" />
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          Expiring Soon
        </h2>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between">
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
  );
}
