"use client";

import { CalendarDays, Heart, Star } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type MealPrepStatsProps = {
  publishedCount: number;
  draftCount: number;
  totalSaves: number;
  avgRating: number;
  labels: {
    published: string;
    drafts: string;
    totalSaves: string;
    avgRating: string;
  };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MealPrepStats({
  publishedCount,
  draftCount,
  totalSaves,
  avgRating,
}: MealPrepStatsProps) {
  return (
    <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl p-4 text-white mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-5 h-5" />
        <span className="font-medium">Your Meal Preps</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <div className="text-2xl font-bold">{publishedCount}</div>
          <div className="text-sm text-white/80">Published</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{draftCount}</div>
          <div className="text-sm text-white/80">Drafts</div>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 fill-current" />
          <div>
            <div className="text-2xl font-bold">{totalSaves}</div>
            <div className="text-sm text-white/80">Total Saves</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 fill-current" />
          <div>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <div className="text-sm text-white/80">Avg Rating</div>
          </div>
        </div>
      </div>
    </div>
  );
}
