"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Crown,
  Zap,
  Gem,
  Check,
  X,
  ChevronDown,
  Star,
  Quote,
} from "lucide-react";

type BillingCycle = "monthly" | "annual";

function BillingToggle({
  billing,
  onChange,
  monthlyLabel,
  annualLabel,
  saveBadge,
}: {
  billing: BillingCycle;
  onChange: (v: BillingCycle) => void;
  monthlyLabel: string;
  annualLabel: string;
  saveBadge: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const annualRef = useRef<HTMLButtonElement>(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const active = billing === "monthly" ? monthlyRef.current : annualRef.current;
    const container = containerRef.current;
    if (active && container) {
      const cRect = container.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      setPillStyle({
        left: aRect.left - cRect.left,
        width: aRect.width,
      });
    }
  }, [billing]);

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 rounded-full bg-[var(--color-bg-secondary)] p-1 border border-[var(--color-border)]"
      >
        {/* Sliding pill */}
        <div
          className="absolute top-1 h-[calc(100%-8px)] rounded-full bg-[var(--color-surface)] shadow-sm transition-all duration-300 ease-out"
          style={{ left: pillStyle.left, width: pillStyle.width }}
        />
        <button
          ref={monthlyRef}
          type="button"
          onClick={() => onChange("monthly")}
          className={cn(
            "relative z-10 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
            billing === "monthly"
              ? "text-[var(--color-text)]"
              : "text-[var(--color-text-secondary)]"
          )}
        >
          {monthlyLabel}
        </button>
        <button
          ref={annualRef}
          type="button"
          onClick={() => onChange("annual")}
          className={cn(
            "relative z-10 rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer flex items-center gap-2",
            billing === "annual"
              ? "text-[var(--color-text)]"
              : "text-[var(--color-text-secondary)]"
          )}
        >
          {annualLabel}
          <span className="rounded-full bg-[var(--color-accent)] px-2 py-0.5 text-xs font-semibold text-white">
            {saveBadge}
          </span>
        </button>
      </div>
    </div>
  );
}

const cardClass =
  "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden";

interface PlanFeature {
  key: string;
  category: string;
  free: string | boolean;
  plus: string | boolean;
  pro: string | boolean;
  premium: string | boolean;
}

const featureRows: PlanFeature[] = [
  { key: "pantryItems", category: "pantry", free: "free", plus: "paid", pro: "paid", premium: "paid" },
  { key: "barcodeScanning", category: "pantry", free: false, plus: true, pro: true, premium: true },
  { key: "expiryAlerts", category: "pantry", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "recipeSaves", category: "recipes", free: "free", plus: "plus", pro: "unlimited", premium: "unlimited" },
  { key: "recipeSuggestions", category: "recipes", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "mealPlanRange", category: "mealPlanning", free: "free", plus: "paid", pro: "paid", premium: "paid" },
  { key: "mealPlanTemplates", category: "mealPlanning", free: false, plus: false, pro: true, premium: true },
  { key: "aiMealPlanning", category: "mealPlanning", free: false, plus: false, pro: false, premium: true },
  { key: "mealPrepPlans", category: "mealPlanning", free: "free", plus: "plus", pro: "unlimited", premium: "premium" },
  { key: "nutritionTracking", category: "nutrition", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "nutritionGoals", category: "nutrition", free: false, plus: true, pro: true, premium: true },
  { key: "shoppingLists", category: "shopping", free: "free", plus: "plus", pro: "unlimited", premium: "premium" },
  { key: "familyProfiles", category: "extras", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "dataExport", category: "extras", free: false, plus: "plus", pro: "pro", premium: "premium" },
  { key: "themes", category: "extras", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "support", category: "extras", free: "free", plus: "plus", pro: "pro", premium: "premium" },
  { key: "ads", category: "extras", free: false, plus: true, pro: true, premium: true },
];

const categories = ["pantry", "recipes", "mealPlanning", "nutrition", "shopping", "extras"] as const;

function FeatureValue({ featureKey, value, t }: { featureKey: string; value: string | boolean; t: (key: string) => string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={18} className="text-[var(--color-accent)]" />
    ) : (
      <X size={18} className="text-[var(--color-text-tertiary)]" />
    );
  }
  const translationKey = `featureList.${featureKey}${value.charAt(0).toUpperCase() + value.slice(1)}`;
  return (
    <span className="text-xs text-[var(--color-text-secondary)]">
      {t(translationKey)}
    </span>
  );
}

function AnimatedPrice({ value, suffix }: { value: string; suffix: string }) {
  const [display, setDisplay] = useState(value);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setPhase("out");
      const t1 = setTimeout(() => {
        setDisplay(value);
        setPhase("in");
      }, 200);
      const t2 = setTimeout(() => {
        setPhase("idle");
      }, 400);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [value]);

  return (
    <div className="flex items-baseline gap-1 overflow-hidden">
      <span
        className={cn(
          "text-4xl font-bold text-[var(--color-text)] transition-all duration-200 ease-out",
          phase === "out" && "opacity-0 -translate-y-3 scale-95",
          phase === "in" && "opacity-100 translate-y-0 scale-100",
          phase === "idle" && "opacity-100 translate-y-0 scale-100"
        )}
      >
        ${display}
      </span>
      <span className="text-sm text-[var(--color-text-tertiary)]">
        {suffix}
      </span>
    </div>
  );
}

export default function UpgradePage() {
  const t = useTranslations("upgrade");
  const [billing, setBilling] = useState<BillingCycle>("annual");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(categories)
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const plans = [
    {
      id: "plus" as const,
      icon: <Zap size={24} />,
      color: "text-blue-500",
      bg: "bg-blue-500",
      bgLight: "bg-blue-500/10",
      border: "border-blue-500/30",
      highlighted: false,
      badge: null as string | null,
      monthlyPrice: t("plans.plus.monthlyPrice"),
      annualMonthly: t("plans.plus.annualMonthly"),
      totalAnnual: t("plans.plus.annualPrice"),
    },
    {
      id: "pro" as const,
      icon: <Crown size={24} />,
      color: "text-[var(--color-primary)]",
      bg: "bg-[var(--color-primary)]",
      bgLight: "bg-[var(--color-primary)]/10",
      border: "border-[var(--color-primary)]",
      highlighted: true,
      badge: t("mostPopular"),
      monthlyPrice: t("plans.pro.monthlyPrice"),
      annualMonthly: t("plans.pro.annualMonthly"),
      totalAnnual: t("plans.pro.annualPrice"),
    },
    {
      id: "premium" as const,
      icon: <Gem size={24} />,
      color: "text-purple-500",
      bg: "bg-purple-500",
      bgLight: "bg-purple-500/10",
      border: "border-purple-500",
      highlighted: false,
      badge: t("bestValue"),
      monthlyPrice: t("plans.premium.monthlyPrice"),
      annualMonthly: t("plans.premium.annualMonthly"),
      totalAnnual: t("plans.premium.annualPrice"),
    },
  ];

  const planFeatures: Record<string, string[]> = {
    plus: [
      t("featureList.pantryItemsPaid"),
      t("featureList.recipeSavesPlus"),
      t("featureList.nutritionTrackingPlus"),
      t("featureList.barcodeScanning"),
      t("featureList.shoppingListsPlus"),
      t("featureList.ads"),
    ],
    pro: [
      t("featureList.recipeSavesUnlimited"),
      t("featureList.recipeSuggestionsPro"),
      t("featureList.mealPlanTemplates"),
      t("featureList.nutritionTrackingPro"),
      t("featureList.familyProfilesPro"),
      t("featureList.themesPro"),
    ],
    premium: [
      t("featureList.recipeSuggestionsPremium"),
      t("featureList.aiMealPlanning"),
      t("featureList.mealPrepPlansPremium"),
      t("featureList.nutritionTrackingPremium"),
      t("featureList.familyProfilesPremium"),
      t("featureList.supportPremium"),
    ],
  };

  const faqKeys = ["q1", "q2", "q3", "q4", "q5"] as const;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-10 md:p-14 text-white text-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Crown size={16} />
            {t("currentPlan")}: {t("free")}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>
      </div>

      {/* Billing Toggle */}
      <BillingToggle
        billing={billing}
        onChange={setBilling}
        monthlyLabel={t("monthly")}
        annualLabel={t("annual")}
        saveBadge={t("savePercent")}
      />

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {plans.map((plan) => {
          const price = billing === "monthly" ? plan.monthlyPrice : plan.annualMonthly;
          return (
            <div
              key={plan.id}
              className={cn(
                "group relative rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer",
                plan.highlighted
                  ? `${plan.border} shadow-lg md:-mt-2 md:mb-[-8px]`
                  : "border-[var(--color-border)] hover:border-[var(--color-border-hover)]"
              )}
            >
              {/* Badge area — fixed height so all cards align */}
              <div
                className={cn(
                  "h-8 flex items-center justify-center text-xs font-bold text-white",
                  plan.badge ? plan.bg : "bg-transparent"
                )}
              >
                {plan.badge ?? ""}
              </div>

              <div className="bg-[var(--color-surface)] p-6 md:p-8 flex flex-col">
                {/* Plan header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                        plan.bgLight
                      )}
                    >
                      <span className={plan.color}>{plan.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--color-text)]">
                      {t(`plans.${plan.id}.name`)}
                    </h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    {t(`plans.${plan.id}.description`)}
                  </p>
                </div>

                {/* Price — fixed height area, no layout shift */}
                <div className="mt-6 h-[72px]">
                  <AnimatedPrice value={price} suffix={t("perMonth")} />
                  <p
                    className={cn(
                      "text-xs text-[var(--color-text-tertiary)] mt-1 transition-opacity duration-300",
                      billing === "annual" ? "opacity-100" : "opacity-0"
                    )}
                  >
                    ${plan.totalAnnual}{t("perYear")} · {t("billedAnnually")}
                  </p>
                </div>

                {/* CTA — links to checkout */}
                <Link
                  href={`/upgrade/checkout?plan=${plan.id}&billing=${billing}`}
                  className={cn(
                    "mt-6 block w-full rounded-full py-3 text-sm font-semibold text-center transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
                    plan.highlighted
                      ? `${plan.bg} text-white hover:opacity-90`
                      : "bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-border-hover)]"
                  )}
                >
                  {t("upgradeTo")} {t(`plans.${plan.id}.name`)}
                </Link>

                {/* Key features */}
                <div className="mt-6 space-y-2.5 pt-4 border-t border-[var(--color-border)]">
                  {planFeatures[plan.id].map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <Check size={16} className={cn("shrink-0", plan.color)} />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />
        <div className="p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {t("features")}
          </h2>

          <div className="hidden sm:grid grid-cols-5 gap-2 px-3 py-3 rounded-xl bg-[var(--color-bg-secondary)] text-xs font-semibold text-[var(--color-text-secondary)]">
            <div className="col-span-1" />
            <div className="text-center">{t("free")}</div>
            <div className="text-center">{t("plans.plus.name")}</div>
            <div className="text-center">{t("plans.pro.name")}</div>
            <div className="text-center">{t("plans.premium.name")}</div>
          </div>

          {categories.map((cat) => {
            const isExpanded = expandedCategories.has(cat);
            const rows = featureRows.filter((r) => r.category === cat);
            return (
              <div key={cat}>
                <button
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors cursor-pointer"
                >
                  <span>{t(`featureCategories.${cat}`)}</span>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-[var(--color-text-tertiary)] transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="space-y-1 mt-1">
                    {rows.map((row) => (
                      <div
                        key={row.key}
                        className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors items-center"
                      >
                        <div className="text-sm text-[var(--color-text)] sm:col-span-1">
                          {t(`featureList.${row.key}`)}
                        </div>
                        <div className="sm:hidden flex flex-wrap gap-1.5">
                          {(["free", "plus", "pro", "premium"] as const).map((tier) => (
                            <span key={tier} className="text-xs text-[var(--color-text-tertiary)]">
                              <span className="font-medium">{tier === "free" ? t("free") : t(`plans.${tier}.name`)}: </span>
                              {typeof row[tier] === "boolean" ? (row[tier] ? <Check size={12} className="inline text-[var(--color-accent)]" /> : <X size={12} className="inline" />) : (
                                <FeatureValue featureKey={row.key} value={row[tier]} t={t} />
                              )}
                            </span>
                          ))}
                        </div>
                        {(["free", "plus", "pro", "premium"] as const).map((tier) => (
                          <div key={tier} className="hidden sm:flex justify-center">
                            <FeatureValue featureKey={row.key} value={row[tier]} t={t} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          {t("testimonials")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(["t1", "t2", "t3"] as const).map((key) => (
            <div
              key={key}
              className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 space-y-4"
            >
              <Quote size={24} className="text-[var(--color-primary)] opacity-40" />
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed italic">
                &ldquo;{t(`testimonialList.${key}Quote`)}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[var(--color-border)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                  {t(`testimonialList.${key}Name`).charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--color-text)]">
                    {t(`testimonialList.${key}Name`)}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)]">
                    {t(`testimonialList.${key}Role`)}
                  </div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[var(--color-primary)] text-[var(--color-primary)]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing FAQ */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
        <div className="p-6 md:p-8 space-y-5">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {t("faq")}
          </h2>
          <div className="space-y-3">
            {faqKeys.map((key) => {
              const isOpen = openFaq === key;
              return (
                <div
                  key={key}
                  className="rounded-xl border border-[var(--color-border)] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
                  >
                    <span>{t(`faqList.${key}`)}</span>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "shrink-0 text-[var(--color-text-tertiary)] transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] pt-4">
                      {t(`faqList.${key.replace("q", "a")}`)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
