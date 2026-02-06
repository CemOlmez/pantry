"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Shield,
  Lock,
  CreditCard,
  Zap,
  Crown,
  Gem,
  Check,
  PartyPopper,
} from "lucide-react";

const inputClass =
  "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-primary)] transition-colors";

const planConfig = {
  plus: {
    icon: <Zap size={24} />,
    color: "text-blue-500",
    bg: "bg-blue-500",
    bgLight: "bg-blue-500/10",
  },
  pro: {
    icon: <Crown size={24} />,
    color: "text-[var(--color-primary)]",
    bg: "bg-[var(--color-primary)]",
    bgLight: "bg-[var(--color-primary)]/10",
  },
  premium: {
    icon: <Gem size={24} />,
    color: "text-purple-500",
    bg: "bg-purple-500",
    bgLight: "bg-purple-500/10",
  },
} as const;

type PlanId = keyof typeof planConfig;

export default function CheckoutPage() {
  const t = useTranslations("upgrade");
  const searchParams = useSearchParams();

  const planId = (searchParams.get("plan") || "pro") as PlanId;
  const billing = (searchParams.get("billing") || "annual") as "monthly" | "annual";

  const plan = planConfig[planId] || planConfig.pro;
  const planName = t(`plans.${planId}.name`);

  const price =
    billing === "monthly"
      ? t(`plans.${planId}.monthlyPrice`)
      : t(`plans.${planId}.annualMonthly`);
  const totalPrice =
    billing === "monthly"
      ? t(`plans.${planId}.monthlyPrice`)
      : t(`plans.${planId}.annualPrice`);
  const cycleSuffix = billing === "monthly" ? t("perMonth") : t("perYear");

  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-accent)]/10">
          <PartyPopper size={36} className="text-[var(--color-accent)]" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            {t("checkout.success", { plan: planName })}
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            {t("checkout.successDesc")}
          </p>
        </div>
        <Link
          href="/"
          className={cn(
            "inline-block rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90",
            plan.bg
          )}
        >
          {t("checkout.goToDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10">
      {/* Back link */}
      <Link
        href="/upgrade"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
      >
        <ArrowLeft size={16} />
        {t("checkout.backToPlans")}
      </Link>

      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("checkout.title")}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Payment Form — spans 3 cols */}
        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 space-y-5">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[var(--color-text-secondary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {t("checkout.paymentMethod")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                  {t("checkout.nameOnCard")}
                </label>
                <input
                  type="text"
                  placeholder={t("checkout.nameOnCardPlaceholder")}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                  {t("checkout.cardNumber")}
                </label>
                <input
                  type="text"
                  placeholder={t("checkout.cardNumberPlaceholder")}
                  className={inputClass}
                  required
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                    {t("checkout.expiry")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("checkout.expiryPlaceholder")}
                    className={inputClass}
                    required
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]">
                    {t("checkout.cvc")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("checkout.cvcPlaceholder")}
                    className={inputClass}
                    required
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className={cn(
              "w-full rounded-full py-3.5 text-sm font-semibold text-white transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed",
              plan.bg
            )}
          >
            {processing ? t("checkout.processing") : t("checkout.confirmUpgrade")}
          </button>

          {/* Trust signals */}
          <div className="space-y-2">
            {[
              { icon: <Lock size={14} />, text: t("checkout.securePayment") },
              { icon: <Shield size={14} />, text: t("checkout.moneyBack") },
              { icon: <Check size={14} />, text: t("checkout.cancelAnytime") },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)]">
                {icon}
                {text}
              </div>
            ))}
          </div>
        </form>

        {/* Order Summary — spans 2 cols */}
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-6 space-y-5 md:sticky md:top-8">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              {t("checkout.orderSummary")}
            </h2>

            {/* Plan info */}
            <div className="flex items-center gap-3 rounded-xl bg-[var(--color-bg-secondary)] p-4">
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", plan.bgLight)}>
                <span className={plan.color}>{plan.icon}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">
                  {planName}
                </div>
                <div className="text-xs text-[var(--color-text-tertiary)]">
                  {t(`plans.${planId}.description`)}
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">{t("checkout.plan")}</span>
                <span className="font-medium text-[var(--color-text)]">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">{t("checkout.billingCycle")}</span>
                <span className="font-medium text-[var(--color-text)]">
                  {billing === "monthly" ? t("monthly") : t("annual")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">{t("checkout.price")}</span>
                <span className="font-medium text-[var(--color-text)]">
                  ${price}{t("perMonth")}
                </span>
              </div>
              <div className="h-px bg-[var(--color-border)]" />
              <div className="flex justify-between">
                <span className="font-semibold text-[var(--color-text)]">{t("checkout.total")}</span>
                <span className="font-bold text-lg text-[var(--color-text)]">
                  ${totalPrice}{cycleSuffix}
                </span>
              </div>
            </div>

            {billing === "annual" && (
              <div className="rounded-lg bg-[var(--color-accent)]/10 px-3 py-2 text-xs text-[var(--color-accent)] font-medium text-center">
                {t("savePercent")} — {t("billedAnnually")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
