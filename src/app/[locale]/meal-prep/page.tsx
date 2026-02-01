import { useTranslations } from "next-intl";

export default function MealPrepPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("mealPrep")}
      </h1>
    </div>
  );
}
