"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Palette,
  Globe,
  Bell,
  Refrigerator,
  Shield,
  Info,
  Sun,
  Moon,
  Monitor,
  Download,
  Trash2,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer",
        checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]"
      )}
    >
      <span
        className={cn(
          "inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5.5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

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

const cardClass =
  "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden";

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

interface SettingsData {
  fontSize: "small" | "medium" | "large";
  measurementUnits: "metric" | "imperial";
  dateFormat: "dmy" | "mdy";
  expiryReminders: boolean;
  shoppingReminders: boolean;
  mealPlanReminders: boolean;
  recipeRecommendations: boolean;
  defaultExpiryDays: number;
  autoAddExpired: boolean;
  defaultSortOrder: "category" | "alphabetical" | "custom";
}

const defaultSettings: SettingsData = {
  fontSize: "medium",
  measurementUnits: "metric",
  dateFormat: "dmy",
  expiryReminders: true,
  shoppingReminders: true,
  mealPlanReminders: false,
  recipeRecommendations: true,
  defaultExpiryDays: 3,
  autoAddExpired: false,
  defaultSortOrder: "category",
};

export default function SettingsPage() {
  const t = useTranslations("settings");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentLocale = useLocale();

  useEffect(() => { setMounted(true); }, []);
  const router = useRouter();
  const pathname = usePathname();
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);

  const update = <K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const themeOptions: { key: string; icon: React.ReactNode }[] = [
    { key: "light", icon: <Sun size={24} /> },
    { key: "dark", icon: <Moon size={24} /> },
    { key: "system", icon: <Monitor size={24} /> },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-8">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("title")}
      </h1>

      {/* Appearance Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <Palette size={18} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("appearance")}
            </h2>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              {t("themeLabel")}
            </label>
            {mounted && (
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ key, icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTheme(key)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-4 transition-all cursor-pointer",
                      theme === key
                        ? "bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]"
                        : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                    )}
                  >
                    {icon}
                    <span className="text-sm font-medium">
                      {t(`themes.${key}`)}
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        theme === key
                          ? "text-white/70"
                          : "text-[var(--color-text-tertiary)]"
                      )}
                    >
                      {t(`themeDescriptions.${key}`)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              {t("fontSize")}
            </label>
            <SingleSelectChips
              options={["small", "medium", "large"] as const}
              value={settings.fontSize}
              onChange={(v) => update("fontSize", v)}
              labels={{
                small: t("fontSizes.small"),
                medium: t("fontSizes.medium"),
                large: t("fontSizes.large"),
              }}
            />
          </div>
        </div>
      </div>

      {/* Language & Region Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <Globe size={18} className="text-blue-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("languageRegion")}
            </h2>
          </div>

          {/* Language */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              {t("language")}
            </label>
            <div className="flex flex-wrap gap-2">
              {(["en", "tr"] as const).map((locale) => (
                <button
                  key={locale}
                  type="button"
                  onClick={() => router.replace(pathname, { locale })}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
                    currentLocale === locale
                      ? "bg-[var(--color-primary)] text-white"
                      : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                  )}
                >
                  {t(`languages.${locale}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Measurement Units */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              {t("measurementUnits")}
            </label>
            <SingleSelectChips
              options={["metric", "imperial"] as const}
              value={settings.measurementUnits}
              onChange={(v) => update("measurementUnits", v)}
              labels={{
                metric: t("units.metric"),
                imperial: t("units.imperial"),
              }}
            />
          </div>

          {/* Date Format */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
              {t("dateFormat")}
            </label>
            <SingleSelectChips
              options={["dmy", "mdy"] as const}
              value={settings.dateFormat}
              onChange={(v) => update("dateFormat", v)}
              labels={{
                dmy: t("dateFormats.dmy"),
                mdy: t("dateFormats.mdy"),
              }}
            />
          </div>
        </div>
      </div>

      {/* Notifications Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <Bell size={18} className="text-[var(--color-accent)]" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("notifications")}
            </h2>
          </div>

          <div className="space-y-4">
            {(
              [
                {
                  key: "expiryReminders" as const,
                  label: t("expiryReminders"),
                  desc: t("expiryRemindersDesc"),
                },
                {
                  key: "shoppingReminders" as const,
                  label: t("shoppingReminders"),
                  desc: t("shoppingRemindersDesc"),
                },
                {
                  key: "mealPlanReminders" as const,
                  label: t("mealPlanReminders"),
                  desc: t("mealPlanRemindersDesc"),
                },
                {
                  key: "recipeRecommendations" as const,
                  label: t("recipeRecommendations"),
                  desc: t("recipeRecommendationsDesc"),
                },
              ] as const
            ).map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text)]">
                    {label}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {desc}
                  </div>
                </div>
                <ToggleSwitch
                  checked={settings[key]}
                  onChange={(v) => update(key, v)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pantry & Shopping Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
              <Refrigerator size={18} className="text-amber-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("pantryAndShopping")}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("defaultExpiryWarning")}
              </label>
              <input
                type="number"
                value={settings.defaultExpiryDays}
                onChange={(e) =>
                  update("defaultExpiryDays", parseInt(e.target.value) || 0)
                }
                className={cn(inputClass, "max-w-[120px]")}
                min={1}
                max={30}
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium text-[var(--color-text)]">
                  {t("autoAddExpired")}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)]">
                  {t("autoAddExpiredDesc")}
                </div>
              </div>
              <ToggleSwitch
                checked={settings.autoAddExpired}
                onChange={(v) => update("autoAddExpired", v)}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                {t("defaultSortOrder")}
              </label>
              <SingleSelectChips
                options={["category", "alphabetical", "custom"] as const}
                value={settings.defaultSortOrder}
                onChange={(v) => update("defaultSortOrder", v)}
                labels={{
                  category: t("sortOrders.category"),
                  alphabetical: t("sortOrders.alphabetical"),
                  custom: t("sortOrders.custom"),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
              <Shield size={18} className="text-purple-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("dataPrivacy")}
            </h2>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-4 py-3.5 text-sm transition-colors hover:border-[var(--color-border-hover)] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download
                  size={16}
                  className="text-[var(--color-text-secondary)]"
                />
                <div className="text-left">
                  <div className="font-medium text-[var(--color-text)]">
                    {t("exportData")}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {t("exportDataDesc")}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-[var(--color-text-tertiary)]"
              />
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] px-4 py-3.5 text-sm transition-colors hover:border-[var(--color-border-hover)] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Trash2
                  size={16}
                  className="text-[var(--color-text-secondary)]"
                />
                <div className="text-left">
                  <div className="font-medium text-[var(--color-text)]">
                    {t("clearHistory")}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {t("clearHistoryDesc")}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-[var(--color-text-tertiary)]"
              />
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-between rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 px-4 py-3.5 text-sm transition-colors hover:bg-[var(--color-danger)]/10 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={16} className="text-[var(--color-danger)]" />
                <div className="text-left">
                  <div className="font-medium text-[var(--color-danger)]">
                    {t("deleteAccount")}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {t("deleteAccountDesc")}
                  </div>
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-[var(--color-text-tertiary)]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* About Card */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-gray-400 to-gray-300" />
        <div className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-500/10">
              <Info size={18} className="text-gray-500" />
            </div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("about")}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[var(--color-bg-secondary)] px-4 py-3">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {t("version")}
              </span>
              <span className="text-sm font-medium text-[var(--color-text)]">
                1.0.0
              </span>
            </div>

            {(
              [
                { label: t("termsOfService"), href: "#terms" },
                { label: t("privacyPolicy"), href: "#privacy" },
                { label: t("licenses"), href: "#licenses" },
              ] as const
            ).map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="flex items-center justify-between rounded-xl bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
              >
                <span>{label}</span>
                <ExternalLink
                  size={14}
                  className="text-[var(--color-text-tertiary)]"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
