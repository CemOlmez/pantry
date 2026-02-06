"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  Search,
  HelpCircle,
  MessageCircle,
  Lightbulb,
  Rocket,
  Refrigerator,
  BookOpen,
  CalendarDays,
  ShoppingCart,
  Settings,
  ChevronDown,
  Mail,
  MessageSquare,
} from "lucide-react";

const cardClass =
  "rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden";

const quickLinkItems = [
  {
    key: "gettingStarted",
    icon: <Rocket size={28} />,
    href: "/",
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]/10",
  },
  {
    key: "managePantry",
    icon: <Refrigerator size={28} />,
    href: "/pantry",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    key: "recipesAndCooking",
    icon: <BookOpen size={28} />,
    href: "/recipes",
    color: "text-[var(--color-accent)]",
    bg: "bg-[var(--color-accent)]/10",
  },
  {
    key: "mealPlanning",
    icon: <CalendarDays size={28} />,
    href: "/meal-planner",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    key: "shoppingList",
    icon: <ShoppingCart size={28} />,
    href: "/shopping-list",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    key: "accountSettings",
    icon: <Settings size={28} />,
    href: "/settings",
    color: "text-gray-500",
    bg: "bg-gray-500/10",
  },
] as const;

const faqKeys = [
  "q1",
  "q2",
  "q3",
  "q4",
  "q5",
  "q6",
  "q7",
  "q8",
  "q9",
  "q10",
] as const;

const tipKeys = ["tip1", "tip2", "tip3", "tip4"] as const;

const tipColors = [
  {
    border: "border-[var(--color-primary)]/20",
    bg: "bg-[var(--color-primary)]/5",
    icon: "text-[var(--color-primary)]",
  },
  {
    border: "border-[var(--color-accent)]/20",
    bg: "bg-[var(--color-accent)]/5",
    icon: "text-[var(--color-accent)]",
  },
  {
    border: "border-amber-500/20",
    bg: "bg-amber-500/5",
    icon: "text-amber-500",
  },
  {
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    icon: "text-blue-500",
  },
];

export default function HelpPage() {
  const t = useTranslations("help");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const filteredFaqKeys = faqKeys.filter((key) => {
    if (!search.trim()) return true;
    const q = t(`questions.${key}`).toLowerCase();
    const aKey = key.replace("q", "a") as `a${string}`;
    const a = t(`questions.${aKey}`).toLowerCase();
    return (
      q.includes(search.toLowerCase()) || a.includes(search.toLowerCase())
    );
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Search Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] p-10 md:p-14 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative space-y-5 max-w-xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full rounded-xl bg-white/15 pl-12 pr-4 py-4 text-base text-white placeholder:text-white/50 backdrop-blur-sm border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      {!search.trim() && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            {t("quickLinks")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickLinkItems.map(({ key, icon, href, color, bg }) => (
              <Link
                key={key}
                href={href}
                className="flex flex-col items-center gap-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 text-center transition-all hover:border-[var(--color-border-hover)] hover:shadow-md"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl",
                    bg
                  )}
                >
                  <span className={color}>{icon}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[var(--color-text)]">
                    {t(`links.${key}`)}
                  </div>
                  <div className="text-xs text-[var(--color-text-tertiary)] mt-1 leading-relaxed">
                    {t(`links.${key}Desc`)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)]" />
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
              <HelpCircle size={20} className="text-[var(--color-primary)]" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {t("faq")}
            </h2>
          </div>

          {filteredFaqKeys.length === 0 ? (
            <p className="text-sm text-[var(--color-text-tertiary)] py-8 text-center">
              {t("noResults")}
            </p>
          ) : (
            <div className="space-y-3">
              {filteredFaqKeys.map((key) => {
                const aKey = key.replace("q", "a") as `a${string}`;
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
                      <span>{t(`questions.${key}`)}</span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "shrink-0 text-[var(--color-text-tertiary)] transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)] pt-4">
                        {t(`questions.${aKey}`)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)]" />
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
              <MessageCircle
                size={20}
                className="text-[var(--color-accent)]"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                {t("contactSupport")}
              </h2>
              <p className="text-sm text-[var(--color-text-tertiary)]">
                {t("contactDesc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:support@pantry.app"
              className="flex items-center gap-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5 hover:border-[var(--color-border-hover)] transition-colors"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                <Mail size={22} className="text-[var(--color-accent)]" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {t("emailSupport")}
                </div>
                <div className="text-sm text-[var(--color-text-tertiary)] truncate mt-0.5">
                  {t("emailAddress")}
                </div>
              </div>
            </a>
            <button
              type="button"
              className="flex items-center gap-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] p-5 hover:border-[var(--color-border-hover)] transition-colors text-left cursor-pointer"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
                <MessageSquare size={22} className="text-blue-500" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {t("sendFeedback")}
                </div>
                <div className="text-sm text-[var(--color-text-tertiary)] truncate mt-0.5">
                  {t("feedbackDesc")}
                </div>
              </div>
            </button>
          </div>

          <p className="text-sm text-[var(--color-text-tertiary)] text-center">
            {t("responseTime")}
          </p>
        </div>
      </div>

      {/* App Tips */}
      <div className={cardClass}>
        <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300" />
        <div className="p-6 md:p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <Lightbulb size={20} className="text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-text)]">
              {t("appTips")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tipKeys.map((key, i) => {
              const colors = tipColors[i];
              return (
                <div
                  key={key}
                  className={cn(
                    "rounded-xl border p-5 space-y-2",
                    colors.border,
                    colors.bg
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Lightbulb size={16} className={colors.icon} />
                    <span className="text-sm font-semibold text-[var(--color-text)]">
                      {t(`tips.${key}Title`)}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {t(`tips.${key}Desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
