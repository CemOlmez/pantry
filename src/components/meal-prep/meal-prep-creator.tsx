"use client";

import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  MealPrepPlan,
  MealPrepDay,
  MealSlot,
  MealSlotType,
  MealItem,
  MealIngredient,
  PlanType,
  DietaryTag,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

const planTypeOptions: PlanType[] = ["daily", "weekly", "monthly"];

const difficultyOptions = [
  { value: "easy" as const, label: "Easy" },
  { value: "medium" as const, label: "Medium" },
  { value: "hard" as const, label: "Hard" },
];

const dietaryOptions: { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "keto", label: "Keto" },
  { value: "low-carb", label: "Low-carb" },
  { value: "high-protein", label: "High Protein" },
];

const slotTypeOptions: MealSlotType[] = ["breakfast", "lunch", "dinner", "snack"];

const dayLabels = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

const unitOptions = ["pieces", "g", "kg", "ml", "L", "tbsp", "tsp", "cups", "oz", "lb", "cans", "cloves", "scoop"];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Step = 1 | 2 | 3 | 4;

type FormDay = {
  label: string;
  enabled: boolean;
  meals: FormSlot[];
};

type FormSlot = {
  type: MealSlotType;
  items: FormItem[];
};

type FormItem = {
  name: string;
  servings: number;
  ingredients: FormIngredient[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type FormIngredient = {
  name: string;
  quantity: number;
  unit: string;
};

type FormData = {
  title: string;
  description: string;
  planType: PlanType;
  difficulty: "easy" | "medium" | "hard";
  dietaryTags: DietaryTag[];
  days: FormDay[];
  isPublished: boolean;
};

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

type MealPrepCreatorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Partial<MealPrepPlan>, isDraft: boolean) => void;
  labels: {
    title: string;
    steps: {
      basicInfo: string;
      planDays: string;
      meals: string;
      review: string;
    };
    fields: {
      title: string;
      titlePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      planType: string;
      difficulty: string;
      dietaryTags: string;
      selectDays: string;
      addMealSlot: string;
      mealName: string;
      mealNamePlaceholder: string;
      servings: string;
      addIngredient: string;
      ingredient: string;
      quantity: string;
      unit: string;
      nutritionSummary: string;
      totalIngredients: string;
      publishToCommunity: string;
    };
    actions: {
      back: string;
      next: string;
      saveAsDraft: string;
      publish: string;
    };
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
    };
    planTypes: {
      daily: string;
      weekly: string;
      monthly: string;
    };
    slotTypes: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snack: string;
    };
  };
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function defaultDays(planType: PlanType): FormDay[] {
  const count = planType === "daily" ? 1 : planType === "weekly" ? 7 : 30;
  return Array.from({ length: count }, (_, i) => ({
    label: planType === "weekly" ? dayLabels[i % 7] : `Day ${i + 1}`,
    enabled: planType === "daily" ? true : i < (planType === "weekly" ? 5 : 7),
    meals: [
      { type: "breakfast" as MealSlotType, items: [] },
      { type: "lunch" as MealSlotType, items: [] },
      { type: "dinner" as MealSlotType, items: [] },
    ],
  }));
}

function emptyItem(): FormItem {
  return {
    name: "",
    servings: 1,
    ingredients: [{ name: "", quantity: 1, unit: "g" }],
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function MealPrepCreator({
  isOpen,
  onClose,
  onSave,
  labels,
}: MealPrepCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(() => ({
    title: "",
    description: "",
    planType: "weekly",
    difficulty: "medium",
    dietaryTags: [],
    days: defaultDays("weekly"),
    isPublished: false,
  }));

  // Step validation
  const isStep1Valid = formData.title.trim().length > 0;
  const isStep2Valid = formData.days.some((d) => d.enabled);
  const isStep3Valid = formData.days.some(
    (d) => d.enabled && d.meals.some((m) => m.items.some((i) => i.name.trim()))
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isStep1Valid;
      case 2: return isStep2Valid;
      case 3: return isStep3Valid;
      case 4: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (currentStep < 4 && canProceed()) {
      setCurrentStep((s) => (s + 1) as Step);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => (s - 1) as Step);
    }
  };

  // Plan type change resets days
  const handlePlanTypeChange = (planType: PlanType) => {
    setFormData((prev) => ({
      ...prev,
      planType,
      days: defaultDays(planType),
    }));
  };

  const toggleDietaryTag = (tag: DietaryTag) => {
    setFormData((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  const toggleDay = (dayIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx ? { ...d, enabled: !d.enabled } : d
      ),
    }));
  };

  const addSlotToDay = (dayIdx: number, slotType: MealSlotType) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx
          ? { ...d, meals: [...d.meals, { type: slotType, items: [] }] }
          : d
      ),
    }));
  };

  const removeSlotFromDay = (dayIdx: number, slotIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIdx
          ? { ...d, meals: d.meals.filter((_, si) => si !== slotIdx) }
          : d
      ),
    }));
  };

  const addItemToSlot = (dayIdx: number, slotIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? { ...m, items: [...m.items, emptyItem()] }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  const updateItem = (
    dayIdx: number,
    slotIdx: number,
    itemIdx: number,
    updates: Partial<FormItem>
  ) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? {
                      ...m,
                      items: m.items.map((item, ii) =>
                        ii === itemIdx ? { ...item, ...updates } : item
                      ),
                    }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  const removeItem = (dayIdx: number, slotIdx: number, itemIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? { ...m, items: m.items.filter((_, ii) => ii !== itemIdx) }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  const addIngredientToItem = (dayIdx: number, slotIdx: number, itemIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? {
                      ...m,
                      items: m.items.map((item, ii) =>
                        ii === itemIdx
                          ? {
                              ...item,
                              ingredients: [
                                ...item.ingredients,
                                { name: "", quantity: 1, unit: "g" },
                              ],
                            }
                          : item
                      ),
                    }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  const updateIngredient = (
    dayIdx: number,
    slotIdx: number,
    itemIdx: number,
    ingIdx: number,
    updates: Partial<FormIngredient>
  ) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? {
                      ...m,
                      items: m.items.map((item, ii) =>
                        ii === itemIdx
                          ? {
                              ...item,
                              ingredients: item.ingredients.map((ing, ij) =>
                                ij === ingIdx ? { ...ing, ...updates } : ing
                              ),
                            }
                          : item
                      ),
                    }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  const removeIngredient = (
    dayIdx: number,
    slotIdx: number,
    itemIdx: number,
    ingIdx: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.map((d, di) =>
        di === dayIdx
          ? {
              ...d,
              meals: d.meals.map((m, si) =>
                si === slotIdx
                  ? {
                      ...m,
                      items: m.items.map((item, ii) =>
                        ii === itemIdx
                          ? {
                              ...item,
                              ingredients: item.ingredients.filter((_, ij) => ij !== ingIdx),
                            }
                          : item
                      ),
                    }
                  : m
              ),
            }
          : d
      ),
    }));
  };

  // Build final plan data
  const buildPlan = (): Partial<MealPrepPlan> => {
    let itemId = 0;
    const days: MealPrepDay[] = formData.days
      .filter((d) => d.enabled)
      .map((d, dayIndex) => ({
        dayIndex,
        label: d.label,
        meals: d.meals
          .filter((m) => m.items.some((i) => i.name.trim()))
          .map((m) => ({
            type: m.type,
            items: m.items
              .filter((i) => i.name.trim())
              .map((i) => ({
                id: `item-${++itemId}`,
                name: i.name,
                servings: i.servings,
                ingredients: i.ingredients
                  .filter((ing) => ing.name.trim())
                  .map((ing) => ({ ...ing, inPantry: false })),
                nutrition: {
                  calories: i.calories,
                  protein: i.protein,
                  carbs: i.carbs,
                  fat: i.fat,
                },
              })),
          })),
      }));

    return {
      title: formData.title,
      description: formData.description,
      planType: formData.planType,
      difficulty: formData.difficulty,
      dietaryTags: formData.dietaryTags,
      days,
      isPublished: formData.isPublished,
    };
  };

  const handleSaveAsDraft = () => {
    onSave(buildPlan(), true);
    onClose();
  };

  const handlePublish = () => {
    onSave(buildPlan(), false);
    onClose();
  };

  // Review stats
  const enabledDays = formData.days.filter((d) => d.enabled);
  const totalItems = enabledDays.reduce(
    (sum, d) => sum + d.meals.reduce((s, m) => s + m.items.filter((i) => i.name.trim()).length, 0),
    0
  );
  const totalIngredients = enabledDays.reduce(
    (sum, d) =>
      sum +
      d.meals.reduce(
        (s, m) =>
          s + m.items.reduce((si, i) => si + i.ingredients.filter((ing) => ing.name.trim()).length, 0),
        0
      ),
    0
  );

  if (!isOpen) return null;

  const stepNames = [
    labels.steps.basicInfo,
    labels.steps.planDays,
    labels.steps.meals,
    labels.steps.review,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[var(--color-bg)] rounded-2xl shadow-xl overflow-hidden flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {labels.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[var(--color-bg-secondary)] flex items-center justify-center text-[var(--color-text-secondary)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step < currentStep
                      ? "bg-[var(--color-accent)] text-white"
                      : step === currentStep
                        ? "bg-[var(--color-primary)] text-white"
                        : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]"
                  )}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                <span
                  className={cn(
                    "ml-2 text-sm hidden sm:block",
                    step === currentStep
                      ? "text-[var(--color-text)] font-medium"
                      : "text-[var(--color-text-secondary)]"
                  )}
                >
                  {stepNames[step - 1]}
                </span>
                {step < 4 && (
                  <div
                    className={cn(
                      "w-8 sm:w-16 h-0.5 mx-2",
                      step < currentStep
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-border)]"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.title} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder={labels.fields.titlePlaceholder}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.description}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder={labels.fields.descriptionPlaceholder}
                  rows={3}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] resize-none"
                />
              </div>

              {/* Plan Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.planType}
                </label>
                <div className="flex gap-2">
                  {planTypeOptions.map((type) => (
                    <button
                      key={type}
                      onClick={() => handlePlanTypeChange(type)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-medium transition-colors capitalize",
                        formData.planType === type
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                      )}
                    >
                      {labels.planTypes[type]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.difficulty}
                </label>
                <div className="flex gap-2">
                  {difficultyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setFormData((prev) => ({ ...prev, difficulty: opt.value }))}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-sm font-medium transition-colors",
                        formData.difficulty === opt.value
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                      )}
                    >
                      {labels.difficulty[opt.value]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.dietaryTags}
                </label>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleDietaryTag(opt.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        formData.dietaryTags.includes(opt.value)
                          ? "bg-[var(--color-accent)] text-white"
                          : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Plan Days */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                {labels.fields.selectDays}
              </p>

              {formData.days.map((d, dayIdx) => (
                <div
                  key={dayIdx}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-colors cursor-pointer",
                    d.enabled
                      ? "bg-[var(--color-primary)]/5 border-[var(--color-primary)]"
                      : "bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)]"
                  )}
                  onClick={() => toggleDay(dayIdx)}
                >
                  <span className={cn(
                    "font-medium",
                    d.enabled ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"
                  )}>
                    {d.label}
                  </span>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      d.enabled
                        ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                        : "border-[var(--color-border)]"
                    )}
                  >
                    {d.enabled && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Meals */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {formData.days
                .map((d, dayIdx) => ({ ...d, dayIdx }))
                .filter((d) => d.enabled)
                .map(({ dayIdx, label: dayLabel, meals }) => (
                  <div key={dayIdx} className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                    {/* Day header */}
                    <div className="bg-[var(--color-surface)] px-4 py-3 border-b border-[var(--color-border)]">
                      <h3 className="font-semibold text-[var(--color-text)]">{dayLabel}</h3>
                    </div>

                    <div className="p-4 space-y-4">
                      {meals.map((meal, slotIdx) => (
                        <div key={slotIdx} className="bg-[var(--color-bg-secondary)] rounded-xl p-3 space-y-3">
                          {/* Slot header */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[var(--color-text)] capitalize">
                              {labels.slotTypes[meal.type]}
                            </span>
                            <button
                              onClick={() => removeSlotFromDay(dayIdx, slotIdx)}
                              className="text-red-500 hover:text-red-600 text-xs"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Meal items */}
                          {meal.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="bg-[var(--color-surface)] rounded-lg p-3 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => updateItem(dayIdx, slotIdx, itemIdx, { name: e.target.value })}
                                  placeholder={labels.fields.mealNamePlaceholder}
                                  className="flex-1 px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
                                />
                                <button
                                  onClick={() => removeItem(dayIdx, slotIdx, itemIdx)}
                                  className="text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Quick nutrition */}
                              <div className="grid grid-cols-4 gap-2">
                                <input
                                  type="number"
                                  min={0}
                                  value={item.calories || ""}
                                  onChange={(e) => updateItem(dayIdx, slotIdx, itemIdx, { calories: parseInt(e.target.value) || 0 })}
                                  placeholder="Cal"
                                  className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] text-center focus:outline-none focus:border-[var(--color-primary)]"
                                />
                                <input
                                  type="number"
                                  min={0}
                                  value={item.protein || ""}
                                  onChange={(e) => updateItem(dayIdx, slotIdx, itemIdx, { protein: parseInt(e.target.value) || 0 })}
                                  placeholder="P (g)"
                                  className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] text-center focus:outline-none focus:border-[var(--color-primary)]"
                                />
                                <input
                                  type="number"
                                  min={0}
                                  value={item.carbs || ""}
                                  onChange={(e) => updateItem(dayIdx, slotIdx, itemIdx, { carbs: parseInt(e.target.value) || 0 })}
                                  placeholder="C (g)"
                                  className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] text-center focus:outline-none focus:border-[var(--color-primary)]"
                                />
                                <input
                                  type="number"
                                  min={0}
                                  value={item.fat || ""}
                                  onChange={(e) => updateItem(dayIdx, slotIdx, itemIdx, { fat: parseInt(e.target.value) || 0 })}
                                  placeholder="F (g)"
                                  className="px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] text-center focus:outline-none focus:border-[var(--color-primary)]"
                                />
                              </div>

                              {/* Ingredients */}
                              {item.ingredients.map((ing, ingIdx) => (
                                <div key={ingIdx} className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    min={0}
                                    step={0.5}
                                    value={ing.quantity}
                                    onChange={(e) => updateIngredient(dayIdx, slotIdx, itemIdx, ingIdx, { quantity: parseFloat(e.target.value) || 0 })}
                                    className="w-16 px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                                  />
                                  <select
                                    value={ing.unit}
                                    onChange={(e) => updateIngredient(dayIdx, slotIdx, itemIdx, ingIdx, { unit: e.target.value })}
                                    className="w-20 px-1 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                                  >
                                    {unitOptions.map((u) => (
                                      <option key={u} value={u}>{u}</option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(dayIdx, slotIdx, itemIdx, ingIdx, { name: e.target.value })}
                                    placeholder={labels.fields.ingredient}
                                    className="flex-1 px-2 py-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)]"
                                  />
                                  {item.ingredients.length > 1 && (
                                    <button
                                      onClick={() => removeIngredient(dayIdx, slotIdx, itemIdx, ingIdx)}
                                      className="text-red-500"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              <button
                                onClick={() => addIngredientToItem(dayIdx, slotIdx, itemIdx)}
                                className="text-xs text-[var(--color-primary)] hover:underline"
                              >
                                + {labels.fields.addIngredient}
                              </button>
                            </div>
                          ))}

                          {/* Add meal item button */}
                          <button
                            onClick={() => addItemToSlot(dayIdx, slotIdx)}
                            className="w-full py-2 border border-dashed border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            {labels.fields.mealName}
                          </button>
                        </div>
                      ))}

                      {/* Add slot */}
                      <div className="flex gap-2">
                        {slotTypeOptions
                          .filter((st) => !meals.some((m) => m.type === st))
                          .map((st) => (
                            <button
                              key={st}
                              onClick={() => addSlotToDay(dayIdx, st)}
                              className="px-3 py-1.5 border border-dashed border-[var(--color-border)] rounded-full text-xs text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors capitalize"
                            >
                              + {labels.slotTypes[st]}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-[var(--color-text)]">{formData.title}</h3>
                {formData.description && (
                  <p className="text-sm text-[var(--color-text-secondary)]">{formData.description}</p>
                )}
                <div className="flex gap-2 text-sm">
                  <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded-full text-[var(--color-text-secondary)] capitalize">
                    {labels.planTypes[formData.planType]}
                  </span>
                  <span className="px-2 py-1 bg-[var(--color-bg-tertiary)] rounded-full text-[var(--color-text-secondary)] capitalize">
                    {labels.difficulty[formData.difficulty]}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--color-text)]">{enabledDays.length}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">Days</div>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--color-text)]">{totalItems}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">Meals</div>
                </div>
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-[var(--color-text)]">{totalIngredients}</div>
                  <div className="text-xs text-[var(--color-text-secondary)]">{labels.fields.totalIngredients}</div>
                </div>
              </div>

              {/* Dietary tags */}
              {formData.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.dietaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[var(--color-accent)]/10 text-[var(--color-accent)] rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Publish toggle */}
              <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">
                    {labels.fields.publishToCommunity}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Make your meal prep visible to others
                  </p>
                </div>
                <button
                  onClick={() => setFormData((prev) => ({ ...prev, isPublished: !prev.isPublished }))}
                  className={cn(
                    "w-12 h-7 rounded-full transition-colors relative",
                    formData.isPublished
                      ? "bg-[var(--color-accent)]"
                      : "bg-[var(--color-bg-tertiary)]"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform",
                      formData.isPublished ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
          <div>
            {currentStep > 1 && (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                {labels.actions.back}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveAsDraft}
              className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              {labels.actions.saveAsDraft}
            </button>

            {currentStep < 4 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors",
                  canProceed()
                    ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                )}
              >
                {labels.actions.next}
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                className="px-6 py-2 rounded-full font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-colors"
              >
                {labels.actions.publish}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
