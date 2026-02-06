"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  User,
  Heart,
  Target,
  ChefHat,
  Activity,
  X,
  Check,
} from "lucide-react";

type DietType =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "paleo";
type AllergyType = "nuts" | "gluten" | "dairy" | "shellfish" | "soy" | "eggs";
type CuisineType =
  | "turkish"
  | "italian"
  | "mexican"
  | "japanese"
  | "chinese"
  | "indian"
  | "thai"
  | "french"
  | "mediterranean"
  | "korean"
  | "american"
  | "middleEastern";

interface ProfileData {
  fullName: string;
  email: string;
  householdSize: "1" | "2" | "3-4" | "5+";
  dietTypes: DietType[];
  allergies: AllergyType[];
  dislikedIngredients: string[];
  goalType: "maintain" | "lose" | "build";
  dailyCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  skillLevel: "beginner" | "intermediate" | "advanced";
  favoriteCuisines: CuisineType[];
  maxCookingTime: "15" | "30" | "45" | "60" | "none";
}

const defaultProfile: ProfileData = {
  fullName: "Cem Olmez",
  email: "cem@pantry.app",
  householdSize: "2",
  dietTypes: ["omnivore"],
  allergies: [],
  dislikedIngredients: ["cilantro", "olives"],
  goalType: "maintain",
  dailyCalories: 2000,
  proteinTarget: 130,
  carbsTarget: 250,
  fatTarget: 70,
  skillLevel: "intermediate",
  favoriteCuisines: ["italian", "mediterranean", "turkish"],
  maxCookingTime: "45",
};

function SingleSelectChips<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
            value === opt
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

function MultiSelectChips<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T[];
  onChange: (v: T[]) => void;
  labels: Record<T, string>;
}) {
  const toggle = (opt: T) => {
    onChange(
      value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]
    );
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
            value.includes(opt)
              ? "bg-[var(--color-primary)] text-white"
              : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

const cardClass =
  "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden";

export default function ProfilePage() {
  const t = useTranslations("profile");
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [showSaved, setShowSaved] = useState(false);
  const [dislikedInput, setDislikedInput] = useState("");

  const update = useCallback(
    <K extends keyof ProfileData>(key: K, value: ProfileData[K]) => {
      setProfile((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const addDisliked = () => {
    const trimmed = dislikedInput.trim();
    if (trimmed && !profile.dislikedIngredients.includes(trimmed)) {
      update("dislikedIngredients", [...profile.dislikedIngredients, trimmed]);
    }
    setDislikedInput("");
  };

  const removeDisliked = (item: string) => {
    update(
      "dislikedIngredients",
      profile.dislikedIngredients.filter((i) => i !== item)
    );
  };

  const householdOptions: ("1" | "2" | "3-4" | "5+")[] = [
    "1",
    "2",
    "3-4",
    "5+",
  ];
  const dietOptions: DietType[] = [
    "omnivore",
    "vegetarian",
    "vegan",
    "pescatarian",
    "keto",
    "paleo",
  ];
  const allergyOptions: AllergyType[] = [
    "nuts",
    "gluten",
    "dairy",
    "shellfish",
    "soy",
    "eggs",
  ];
  const goalOptions: ("maintain" | "lose" | "build")[] = [
    "maintain",
    "lose",
    "build",
  ];
  const skillOptions: ("beginner" | "intermediate" | "advanced")[] = [
    "beginner",
    "intermediate",
    "advanced",
  ];
  const cuisineOptions: CuisineType[] = [
    "turkish",
    "italian",
    "mexican",
    "japanese",
    "chinese",
    "indian",
    "thai",
    "french",
    "mediterranean",
    "korean",
    "american",
    "middleEastern",
  ];
  const cookingTimeOptions: ("15" | "30" | "45" | "60" | "none")[] = [
    "15",
    "30",
    "45",
    "60",
    "none",
  ];

  const householdLabels = Object.fromEntries(
    householdOptions.map((o) => [o, t(`household.${o}`)])
  ) as Record<"1" | "2" | "3-4" | "5+", string>;

  const dietLabels = Object.fromEntries(
    dietOptions.map((o) => [o, t(`diets.${o}`)])
  ) as Record<DietType, string>;

  const allergyLabels = Object.fromEntries(
    allergyOptions.map((o) => [o, t(`allergyTypes.${o}`)])
  ) as Record<AllergyType, string>;

  const goalLabels = Object.fromEntries(
    goalOptions.map((o) => [o, t(`goals.${o}`)])
  ) as Record<"maintain" | "lose" | "build", string>;

  const skillLabels = Object.fromEntries(
    skillOptions.map((o) => [o, t(`skills.${o}`)])
  ) as Record<"beginner" | "intermediate" | "advanced", string>;

  const cuisineLabels = Object.fromEntries(
    cuisineOptions.map((o) => [o, t(`cuisines.${o}`)])
  ) as Record<CuisineType, string>;

  const cookingTimeLabels = Object.fromEntries(
    cookingTimeOptions.map((o) => [o, t(`cookingTimes.${o}`)])
  ) as Record<"15" | "30" | "45" | "60" | "none", string>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-8 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl font-bold backdrop-blur-sm">
            {profile.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-bold truncate">{profile.fullName}</h1>
            <p className="text-white/80 text-sm truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      {/* Save Success Banner */}
      {showSaved && (
        <div className="flex items-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-3 text-white text-sm font-medium animate-in fade-in slide-in-from-top-2">
          <Check size={16} />
          {t("saved")}
        </div>
      )}

      {/* Personal Info Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <User size={18} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("personalInfo")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("fullName")}
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("email")}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("householdSize")}
              </label>
              <SingleSelectChips
                options={householdOptions}
                value={profile.householdSize}
                onChange={(v) => update("householdSize", v)}
                labels={householdLabels}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dietary Preferences Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <Heart size={18} className="text-[var(--color-accent)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("dietaryPreferences")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("dietType")}
              </label>
              <MultiSelectChips
                options={dietOptions}
                value={profile.dietTypes}
                onChange={(v) => update("dietTypes", v)}
                labels={dietLabels}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("allergies")}
              </label>
              <MultiSelectChips
                options={allergyOptions}
                value={profile.allergies}
                onChange={(v) => update("allergies", v)}
                labels={allergyLabels}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("dislikedIngredients")}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {profile.dislikedIngredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-3 py-1.5 text-sm text-[var(--color-text-secondary)]"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeDisliked(item)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={dislikedInput}
                onChange={(e) => setDislikedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDisliked();
                  }
                }}
                placeholder={t("dislikedPlaceholder")}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nutrition Goals Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <Target size={18} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("nutritionGoals")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("goalType")}
              </label>
              <SingleSelectChips
                options={goalOptions}
                value={profile.goalType}
                onChange={(v) => update("goalType", v)}
                labels={goalLabels}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("dailyCalories")}
              </label>
              <input
                type="number"
                value={profile.dailyCalories}
                onChange={(e) =>
                  update("dailyCalories", parseInt(e.target.value) || 0)
                }
                className={inputClass}
                min={0}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("macroTargets")}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                    {t("protein")}
                  </label>
                  <input
                    type="number"
                    value={profile.proteinTarget}
                    onChange={(e) =>
                      update("proteinTarget", parseInt(e.target.value) || 0)
                    }
                    className={inputClass}
                    min={0}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                    {t("carbs")}
                  </label>
                  <input
                    type="number"
                    value={profile.carbsTarget}
                    onChange={(e) =>
                      update("carbsTarget", parseInt(e.target.value) || 0)
                    }
                    className={inputClass}
                    min={0}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-[var(--color-text-tertiary)]">
                    {t("fat")}
                  </label>
                  <input
                    type="number"
                    value={profile.fatTarget}
                    onChange={(e) =>
                      update("fatTarget", parseInt(e.target.value) || 0)
                    }
                    className={inputClass}
                    min={0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cooking Preferences Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <ChefHat size={18} className="text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("cookingPreferences")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("skillLevel")}
              </label>
              <SingleSelectChips
                options={skillOptions}
                value={profile.skillLevel}
                onChange={(v) => update("skillLevel", v)}
                labels={skillLabels}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("favoriteCuisines")}
              </label>
              <MultiSelectChips
                options={cuisineOptions}
                value={profile.favoriteCuisines}
                onChange={(v) => update("favoriteCuisines", v)}
                labels={cuisineLabels}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("maxCookingTime")}
              </label>
              <SingleSelectChips
                options={cookingTimeOptions}
                value={profile.maxCookingTime}
                onChange={(v) => update("maxCookingTime", v)}
                labels={cookingTimeLabels}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Stats Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
              <Activity size={18} className="text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("activityStats")}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-[var(--color-bg-secondary)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                12
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                {t("recipesSaved")}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-bg-secondary)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                5
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                {t("mealsPlanned")}
              </div>
            </div>
            <div className="rounded-xl bg-[var(--color-bg-secondary)] p-4 text-center">
              <div className="text-2xl font-bold text-[var(--color-text)]">
                3
              </div>
              <div className="text-xs text-[var(--color-text-tertiary)] mt-1">
                {t("mealPrepsCreated")}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        type="button"
        onClick={handleSave}
        className="w-full rounded-full bg-[var(--color-primary)] py-3.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)] transition-colors cursor-pointer"
      >
        {t("saveChanges")}
      </button>
    </div>
  );
}
