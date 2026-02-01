import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("settings")}
      </h1>
    </div>
  );
}
