"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  RecipeFilterState,
  MealType,
  Cuisine,
  TimeFilter,
  DifficultyFilter,
  DietaryTag,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Filter Options                                                     */
/* ------------------------------------------------------------------ */

const mealOptions: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
  { value: "dessert", label: "Dessert" },
];

const cuisineOptions: { value: Cuisine; label: string }[] = [
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "asian", label: "Asian" },
  { value: "mediterranean", label: "Mediterranean" },
  { value: "american", label: "American" },
  { value: "indian", label: "Indian" },
  { value: "french", label: "French" },
  { value: "other", label: "Other" },
];

const timeOptions: { value: TimeFilter; label: string }[] = [
  { value: "under15", label: "Under 15 min" },
  { value: "15to30", label: "15-30 min" },
  { value: "30to60", label: "30-60 min" },
  { value: "over60", label: "1+ hour" },
];

const difficultyOptions: { value: DifficultyFilter; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const dietaryOptions: { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "keto", label: "Keto" },
  { value: "low-carb", label: "Low-carb" },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type RecipeFiltersProps = {
  filters: RecipeFilterState;
  onFiltersChange: (filters: RecipeFilterState) => void;
  resultCount?: number;
  labels: {
    search: string;
    canCookNow: string;
    meal: string;
    cuisine: string;
    time: string;
    difficulty: string;
    diet: string;
    clearAll: string;
    showing: string;
    recipes: string;
  };
};

/* ------------------------------------------------------------------ */
/*  Dropdown Component                                                 */
/* ------------------------------------------------------------------ */

type DropdownProps<T extends string> = {
  label: string;
  value: T | null;
  options: { value: T; label: string }[];
  onChange: (value: T | null) => void;
  multiSelect?: false;
};

type MultiDropdownProps<T extends string> = {
  label: string;
  value: T[];
  options: { value: T; label: string }[];
  onChange: (value: T[]) => void;
  multiSelect: true;
};

function FilterDropdown<T extends string>(
  props: DropdownProps<T> | MultiDropdownProps<T>
) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMulti = props.multiSelect === true;
  const hasValue = isMulti
    ? (props.value as T[]).length > 0
    : props.value !== null;
  const displayCount = isMulti ? (props.value as T[]).length : 0;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
          hasValue
            ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"
        )}
      >
        {props.label}
        {isMulti && displayCount > 0 && (
          <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/20">
            {displayCount}
          </span>
        )}
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {!isMulti && (
            <button
              onClick={() => {
                (props as DropdownProps<T>).onChange(null);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] flex items-center justify-between",
                props.value === null && "text-[var(--color-primary)]"
              )}
            >
              All
              {props.value === null && <Check className="w-4 h-4" />}
            </button>
          )}
          {props.options.map((option) => {
            const isSelected = isMulti
              ? (props.value as T[]).includes(option.value)
              : props.value === option.value;

            return (
              <button
                key={option.value}
                onClick={() => {
                  if (isMulti) {
                    const current = props.value as T[];
                    const next = isSelected
                      ? current.filter((v) => v !== option.value)
                      : [...current, option.value];
                    (props as MultiDropdownProps<T>).onChange(next);
                  } else {
                    (props as DropdownProps<T>).onChange(option.value);
                    setIsOpen(false);
                  }
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-[var(--color-bg-secondary)] flex items-center justify-between",
                  isSelected && "text-[var(--color-primary)]"
                )}
              >
                {option.label}
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function RecipeFilters({
  filters,
  onFiltersChange,
  resultCount,
  labels,
}: RecipeFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.canCookNow ||
    filters.mealType ||
    filters.cuisine ||
    filters.time ||
    filters.difficulty ||
    filters.dietary.length > 0;

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      canCookNow: false,
      mealType: null,
      cuisine: null,
      time: null,
      difficulty: null,
      dietary: [],
    });
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          placeholder={labels.search}
          className="w-full pl-12 pr-10 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: "" })}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {/* Can Cook Now toggle */}
        <button
          onClick={() => onFiltersChange({ ...filters, canCookNow: !filters.canCookNow })}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
            filters.canCookNow
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]"
          )}
        >
          <Sparkles className="w-4 h-4" />
          {labels.canCookNow}
        </button>

        {/* Dropdown filters */}
        <FilterDropdown
          label={labels.meal}
          value={filters.mealType}
          options={mealOptions}
          onChange={(v) => onFiltersChange({ ...filters, mealType: v })}
        />
        <FilterDropdown
          label={labels.cuisine}
          value={filters.cuisine}
          options={cuisineOptions}
          onChange={(v) => onFiltersChange({ ...filters, cuisine: v })}
        />
        <FilterDropdown
          label={labels.time}
          value={filters.time}
          options={timeOptions}
          onChange={(v) => onFiltersChange({ ...filters, time: v })}
        />
        <FilterDropdown
          label={labels.difficulty}
          value={filters.difficulty}
          options={difficultyOptions}
          onChange={(v) => onFiltersChange({ ...filters, difficulty: v })}
        />
        <FilterDropdown<DietaryTag>
          label={labels.diet}
          value={filters.dietary}
          options={dietaryOptions}
          onChange={(v) => onFiltersChange({ ...filters, dietary: v })}
          multiSelect
        />
      </div>

      {/* Results summary */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--color-text-secondary)]">
            {labels.showing} {resultCount ?? 0} {labels.recipes}
          </span>
          <button
            onClick={clearAllFilters}
            className="text-[var(--color-primary)] hover:underline font-medium"
          >
            {labels.clearAll}
          </button>
        </div>
      )}
    </div>
  );
}
