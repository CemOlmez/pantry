import { useTranslations } from "next-intl";

export default function MealPlannerPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("mealPlanner")}
      </h1>
    </div>
  );
}
