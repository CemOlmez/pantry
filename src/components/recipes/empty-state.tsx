"use client";

import { Heart, ChefHat, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type EmptyStateProps = {
  type: "favorites" | "my-recipes" | "no-results";
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const icons = {
  favorites: Heart,
  "my-recipes": ChefHat,
  "no-results": Search,
};

const gradients = {
  favorites: "from-rose-400 to-pink-500",
  "my-recipes": "from-amber-400 to-orange-500",
  "no-results": "from-slate-400 to-slate-500",
};

export function EmptyState({
  type,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const Icon = icons[type];
  const gradient = gradients[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon container */}
      <div
        className={cn(
          "w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center mb-6",
          gradient
        )}
      >
        <Icon className="w-12 h-12 text-white" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
        {title}
      </h3>

      {/* Description */}
      <p className="text-[var(--color-text-secondary)] max-w-sm mb-6">
        {description}
      </p>

      {/* Action button */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
