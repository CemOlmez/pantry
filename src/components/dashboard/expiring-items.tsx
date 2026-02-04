"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

const items = [
  { name: "Milk", quantity: 1, unit: "L", daysLeft: 0 },
  { name: "Chicken Breast", quantity: 500, unit: "g", daysLeft: 1 },
  { name: "Spinach", quantity: 200, unit: "g", daysLeft: 2 },
  { name: "Greek Yogurt", quantity: 2, unit: "cups", daysLeft: 3 },
];

/* ------------------------------------------------------------------ */
/*  Urgency config                                                     */
/* ------------------------------------------------------------------ */

function getUrgencyConfig(daysLeft: number) {
  if (daysLeft === 0) {
    return {
      dot: "bg-red-500",
      pulse: true,
      border: "border-l-red-500",
    };
  }
  if (daysLeft === 1) {
    return {
      dot: "bg-orange-500",
      pulse: false,
      border: "border-l-orange-500",
    };
  }
  return {
    dot: "bg-yellow-400",
    pulse: false,
    border: "border-l-yellow-400",
  };
}

/* ------------------------------------------------------------------ */
/*  ExpiryBadge                                                        */
/* ------------------------------------------------------------------ */

function ExpiryBadge({ daysLeft }: { daysLeft: number }) {
  const config =
    daysLeft === 0
      ? { label: "Today", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" }
      : daysLeft === 1
        ? { label: "Tomorrow", classes: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" }
        : { label: `${daysLeft} days`, classes: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" };

  return (
    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap", config.classes)}>
      {config.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  UrgencyDot                                                         */
/* ------------------------------------------------------------------ */

function UrgencyDot({ daysLeft }: { daysLeft: number }) {
  const urgency = getUrgencyConfig(daysLeft);

  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      {urgency.pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            urgency.dot
          )}
        />
      )}
      <span
        className={cn(
          "relative inline-flex h-2.5 w-2.5 rounded-full",
          urgency.dot
        )}
      />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ExpiringItems                                                      */
/* ------------------------------------------------------------------ */

export function ExpiringItems() {
  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Gradient accent bar */}
      <div className="h-1 bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400" />

      {/* Header */}
      <div className="px-5 pt-5 pb-1 sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 shadow-sm">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Expiring Soon
            </h2>
          </div>
          <span className="flex items-center justify-center min-w-[1.75rem] h-6 px-2 rounded-full bg-red-100 dark:bg-red-900/30 text-xs font-semibold text-red-600 dark:text-red-400">
            {items.length}
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="px-5 pb-2 sm:px-6 space-y-1.5">
        {items.map((item) => {
          const urgency = getUrgencyConfig(item.daysLeft);

          return (
            <div
              key={item.name}
              className={cn(
                "flex items-center justify-between rounded-xl px-3.5 py-3",
                "border-l-[3px]",
                "hover:bg-[var(--color-bg-secondary)] transition-all duration-150 cursor-pointer",
                "group",
                urgency.border
              )}
            >
              {/* Left: urgency dot + name + quantity */}
              <div className="flex items-center gap-3 min-w-0">
                <UrgencyDot daysLeft={item.daysLeft} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text)] truncate group-hover:text-[var(--color-primary)] transition-colors">
                    {item.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    {item.quantity} {item.unit}
                  </p>
                </div>
              </div>

              {/* Right: expiry badge */}
              <ExpiryBadge daysLeft={item.daysLeft} />
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] mt-2">
        <Link
          href="/pantry"
          className="flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors group"
        >
          <span>View all pantry items</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
