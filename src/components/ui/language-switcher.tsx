"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const locales = [
  { code: "en", label: "EN" },
  { code: "tr", label: "TR" },
] as const;

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(locale: string) {
    router.replace(pathname, { locale });
  }

  return (
    <div className="flex gap-1 rounded-lg bg-[var(--color-bg-secondary)] p-1">
      {locales.map((locale) => (
        <button
          key={locale.code}
          onClick={() => switchLocale(locale.code)}
          className={cn(
            "rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
            currentLocale === locale.code
              ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          )}
        >
          {locale.label}
        </button>
      ))}
    </div>
  );
}
