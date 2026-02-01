import { useTranslations } from "next-intl";

export default function PantryPage() {
  const t = useTranslations("pages");
  return (
    <main>
      <h1>{t("pantry")}</h1>
    </main>
  );
}
