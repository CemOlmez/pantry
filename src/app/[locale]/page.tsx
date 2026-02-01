import { useTranslations } from "next-intl";
import { MacroRings } from "@/components/dashboard/macro-rings";
import { TodaysMeals } from "@/components/dashboard/todays-meals";
import { ExpiringItems } from "@/components/dashboard/expiring-items";
import { CanCookNow } from "@/components/dashboard/can-cook-now";

export default function DashboardPage() {
  const t = useTranslations("pages");
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("pantry")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MacroRings />
        <TodaysMeals />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpiringItems />
        <CanCookNow />
      </div>
    </div>
  );
}
