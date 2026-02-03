"use client";

import { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  GripVertical,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  Recipe,
  Ingredient,
  Instruction,
  MealType,
  Cuisine,
  DietaryTag,
} from "./types";

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
] as const;

const mealTypeOptions: { value: MealType; label: string }[] = [
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

const dietaryOptions: { value: DietaryTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "keto", label: "Keto" },
  { value: "low-carb", label: "Low-carb" },
];

const unitOptions = ["pieces", "g", "kg", "ml", "L", "tbsp", "tsp", "cups", "oz", "lb"];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Step = 1 | 2 | 3 | 4;

type RecipeFormData = {
  title: string;
  description: string;
  image: string | null;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  instructions: Instruction[];
  mealType: MealType[];
  cuisine: Cuisine;
  dietaryTags: DietaryTag[];
  isPublished: boolean;
};

type RecipeCreatorProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Partial<Recipe>, isDraft: boolean) => void;
  editRecipe?: Recipe;
  labels: {
    title: string;
    editTitle: string;
    steps: {
      basicInfo: string;
      ingredients: string;
      instructions: string;
      details: string;
    };
    fields: {
      title: string;
      titlePlaceholder: string;
      description: string;
      descriptionPlaceholder: string;
      image: string;
      uploadImage: string;
      servings: string;
      prepTime: string;
      cookTime: string;
      difficulty: string;
      ingredient: string;
      quantity: string;
      unit: string;
      addIngredient: string;
      addFromPantry: string;
      step: string;
      addStep: string;
      mealType: string;
      cuisine: string;
      dietaryTags: string;
      publishToCommunity: string;
    };
    actions: {
      back: string;
      next: string;
      saveAsDraft: string;
      publish: string;
      save: string;
    };
    difficulty: {
      easy: string;
      medium: string;
      hard: string;
    };
  };
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function RecipeCreator({
  isOpen,
  onClose,
  onSave,
  editRecipe,
  labels,
}: RecipeCreatorProps) {
  const isEditing = !!editRecipe;

  // Form state
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<RecipeFormData>(() => ({
    title: editRecipe?.title ?? "",
    description: editRecipe?.description ?? "",
    image: editRecipe?.image ?? null,
    servings: editRecipe?.servings ?? 4,
    prepTime: editRecipe?.prepTime ?? 15,
    cookTime: editRecipe?.cookTime ?? 30,
    difficulty: editRecipe?.difficulty ?? "medium",
    ingredients: editRecipe?.ingredients ?? [{ name: "", quantity: 1, unit: "pieces" }],
    instructions: editRecipe?.instructions ?? [{ step: 1, text: "" }],
    mealType: editRecipe?.mealType ?? [],
    cuisine: editRecipe?.cuisine ?? "other",
    dietaryTags: editRecipe?.dietaryTags ?? [],
    isPublished: editRecipe?.isPublished ?? false,
  }));

  // Step validation
  const isStep1Valid = formData.title.trim().length > 0;
  const isStep2Valid = formData.ingredients.some((i) => i.name.trim().length > 0);
  const isStep3Valid = formData.instructions.some((i) => i.text.trim().length > 0);
  const isStep4Valid = formData.mealType.length > 0;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return isStep1Valid;
      case 2:
        return isStep2Valid;
      case 3:
        return isStep3Valid;
      case 4:
        return isStep4Valid;
      default:
        return false;
    }
  };

  // Navigation
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

  // Ingredient management
  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: "", quantity: 1, unit: "pieces" }],
    }));
  };

  const updateIngredient = (idx: number, field: keyof Ingredient, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === idx ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (idx: number) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== idx),
      }));
    }
  };

  // Instruction management
  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, text: "" },
      ],
    }));
  };

  const updateInstruction = (idx: number, text: string) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) =>
        i === idx ? { ...inst, text } : inst
      ),
    }));
  };

  const removeInstruction = (idx: number) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions
          .filter((_, i) => i !== idx)
          .map((inst, i) => ({ ...inst, step: i + 1 })),
      }));
    }
  };

  // Toggle helpers
  const toggleMealType = (type: MealType) => {
    setFormData((prev) => ({
      ...prev,
      mealType: prev.mealType.includes(type)
        ? prev.mealType.filter((t) => t !== type)
        : [...prev.mealType, type],
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

  // Save handlers
  const handleSaveAsDraft = () => {
    const recipe: Partial<Recipe> = {
      ...formData,
      image: formData.image ?? undefined,
      isPublished: false,
      ingredients: formData.ingredients.filter((i) => i.name.trim()),
      instructions: formData.instructions.filter((i) => i.text.trim()),
    };
    onSave(recipe, true);
    onClose();
  };

  const handlePublish = () => {
    const recipe: Partial<Recipe> = {
      ...formData,
      image: formData.image ?? undefined,
      isPublished: formData.isPublished,
      ingredients: formData.ingredients.filter((i) => i.name.trim()),
      instructions: formData.instructions.filter((i) => i.text.trim()),
    };
    onSave(recipe, false);
    onClose();
  };

  if (!isOpen) return null;

  const stepNames = [
    labels.steps.basicInfo,
    labels.steps.ingredients,
    labels.steps.instructions,
    labels.steps.details,
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
            {isEditing ? labels.editTitle : labels.title}
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

              {/* Image upload placeholder */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.image}
                </label>
                <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-8 text-center hover:border-[var(--color-primary)] transition-colors cursor-pointer">
                  <ImageIcon className="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-2" />
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {labels.fields.uploadImage}
                  </p>
                </div>
              </div>

              {/* Servings, Prep Time, Cook Time */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {labels.fields.servings}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.servings}
                    onChange={(e) => setFormData((prev) => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {labels.fields.prepTime}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.prepTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    {labels.fields.cookTime}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.cookTime}
                    onChange={(e) => setFormData((prev) => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
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
            </div>
          )}

          {/* Step 2: Ingredients */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-[var(--color-text-tertiary)] cursor-grab flex-shrink-0" />

                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={ing.quantity}
                    onChange={(e) => updateIngredient(idx, "quantity", parseFloat(e.target.value) || 0)}
                    placeholder={labels.fields.quantity}
                    className="w-20 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />

                  <select
                    value={ing.unit}
                    onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
                    className="w-24 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    {unitOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => updateIngredient(idx, "name", e.target.value)}
                    placeholder={labels.fields.ingredient}
                    className="flex-1 px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
                  />

                  <button
                    onClick={() => removeIngredient(idx)}
                    disabled={formData.ingredients.length === 1}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      formData.ingredients.length === 1
                        ? "text-[var(--color-text-tertiary)] cursor-not-allowed"
                        : "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addIngredient}
                className="w-full py-3 border-2 border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {labels.fields.addIngredient}
              </button>
            </div>
          )}

          {/* Step 3: Instructions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {formData.instructions.map((inst, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 font-semibold text-sm mt-1">
                    {inst.step}
                  </div>

                  <textarea
                    value={inst.text}
                    onChange={(e) => updateInstruction(idx, e.target.value)}
                    placeholder={`${labels.fields.step} ${inst.step}...`}
                    rows={2}
                    className="flex-1 px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  />

                  <button
                    onClick={() => removeInstruction(idx)}
                    disabled={formData.instructions.length === 1}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                      formData.instructions.length === 1
                        ? "text-[var(--color-text-tertiary)] cursor-not-allowed"
                        : "text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20"
                    )}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                onClick={addInstruction}
                className="w-full py-3 border-2 border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {labels.fields.addStep}
              </button>
            </div>
          )}

          {/* Step 4: Details & Publish */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Meal Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.mealType} *
                </label>
                <div className="flex flex-wrap gap-2">
                  {mealTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => toggleMealType(opt.value)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        formData.mealType.includes(opt.value)
                          ? "bg-[var(--color-primary)] text-white"
                          : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-bg-secondary)]"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cuisine */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                  {labels.fields.cuisine}
                </label>
                <select
                  value={formData.cuisine}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cuisine: e.target.value as Cuisine }))}
                  className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                >
                  {cuisineOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
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

              {/* Publish toggle */}
              <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                <div>
                  <h3 className="font-medium text-[var(--color-text)]">
                    {labels.fields.publishToCommunity}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Make your recipe visible to others
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
                disabled={!canProceed()}
                className={cn(
                  "px-6 py-2 rounded-full font-medium transition-colors",
                  canProceed()
                    ? "bg-[var(--color-primary)] text-white hover:opacity-90"
                    : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)] cursor-not-allowed"
                )}
              >
                {isEditing ? labels.actions.save : labels.actions.publish}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
