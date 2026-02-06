"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const itemClass =
  "block w-full text-left rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer";

export function MobileHeader() {
  const t = useTranslations("user");
  const tc = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [subMenu, setSubMenu] = useState<"language" | "theme" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSubMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setSubMenu(null);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const topItems = [
    { label: t("settings"), href: "/settings" },
    { label: t("profile"), href: "/profile" },
  ];

  const bottomItems = [
    { label: t("help"), href: "/help" },
    { label: t("upgrade"), href: "/upgrade" },
  ];

  function close() {
    setOpen(false);
    setSubMenu(null);
  }

  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-4" ref={menuRef}>
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Pantry" width={28} height={28} className="w-7 h-7" />
        <span className="text-lg font-bold text-[var(--color-text)]">Pantry</span>
      </div>

      <div className="relative">
        <button
          onClick={() => { setOpen(!open); setSubMenu(null); }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-xs font-bold cursor-pointer"
        >
          G
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 z-50 min-w-[220px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg">
            {topItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={itemClass}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}

            {/* Language */}
            <div className="relative">
              <button
                className={cn(itemClass, "flex items-center justify-between")}
                onClick={() => setSubMenu(subMenu === "language" ? null : "language")}
              >
                <span>{tc("language")}</span>
                <ChevronRight size={14} className="text-[var(--color-text-tertiary)]" />
              </button>
              {subMenu === "language" && (
                <div className="absolute right-full top-0 mr-1 z-50 min-w-[140px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg">
                  <button
                    className={cn(itemClass, currentLocale === "en" && "text-[var(--color-primary)]")}
                    onClick={() => { router.replace(pathname, { locale: "en" }); close(); }}
                  >
                    English
                  </button>
                  <button
                    className={cn(itemClass, currentLocale === "tr" && "text-[var(--color-primary)]")}
                    onClick={() => { router.replace(pathname, { locale: "tr" }); close(); }}
                  >
                    Türkçe
                  </button>
                </div>
              )}
            </div>

            {/* Theme */}
            {mounted && (
              <div className="relative">
                <button
                  className={cn(itemClass, "flex items-center justify-between")}
                  onClick={() => setSubMenu(subMenu === "theme" ? null : "theme")}
                >
                  <span>{tc("theme")}</span>
                  <ChevronRight size={14} className="text-[var(--color-text-tertiary)]" />
                </button>
                {subMenu === "theme" && (
                  <div className="absolute right-full top-0 mr-1 z-50 min-w-[140px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg">
                    <button
                      className={cn(itemClass, theme === "light" && "text-[var(--color-primary)]")}
                      onClick={() => { setTheme("light"); close(); }}
                    >
                      {tc("light")}
                    </button>
                    <button
                      className={cn(itemClass, theme === "dark" && "text-[var(--color-primary)]")}
                      onClick={() => { setTheme("dark"); close(); }}
                    >
                      {tc("dark")}
                    </button>
                    <button
                      className={cn(itemClass, theme === "system" && "text-[var(--color-primary)]")}
                      onClick={() => { setTheme("system"); close(); }}
                    >
                      {tc("system")}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="my-1 h-px bg-[var(--color-border)]" />

            {bottomItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={itemClass}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-1 h-px bg-[var(--color-border)]" />

            <button
              className="block w-full text-left rounded-lg px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
              onClick={close}
            >
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
