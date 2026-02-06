"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  const options = [
    { value: "light", label: t("light"), icon: "☀️" },
    { value: "dark", label: t("dark"), icon: "🌙" },
    { value: "system", label: t("system"), icon: "💻" },
  ] as const;

  return (
    <div className="flex gap-1 rounded-lg bg-[var(--color-bg-secondary)] p-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={cn(
            "flex-1 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer",
            theme === option.value
              ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
              : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
          )}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
