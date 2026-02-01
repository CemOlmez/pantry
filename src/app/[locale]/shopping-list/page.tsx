import { useTranslations } from "next-intl";

export default function ShoppingListPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("shoppingList")}
      </h1>
    </div>
  );
}
