"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const itemClass =
  "block w-full text-left rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer";

const subMenuClass =
  "absolute left-full top-0 ml-1 z-50 min-w-[140px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg";

export function UserMenu({ collapsed }: { collapsed?: boolean }) {
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

  const profileItems = [
    { label: t("profile"), href: "/profile" },
    { label: t("settings"), href: "/settings" },
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
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => { setOpen(!open); setSubMenu(null); }}
        className={cn(
          "flex items-center rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer",
          collapsed ? "justify-center p-2 w-full" : "gap-3 px-3 py-2 w-full"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-xs font-bold">
          C
        </div>
        {!collapsed && <span>Cem</span>}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-4 z-50 min-w-[220px] max-h-[calc(100vh-100px)] overflow-visible rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg">
          {/* Profile header */}
          <Link
            href="/profile"
            onClick={close}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-sm font-bold">
              C
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--color-text)] truncate">Cem Olmez</div>
              <div className="text-xs text-[var(--color-text-tertiary)] truncate">cem@pantry.app</div>
            </div>
          </Link>

          <div className="my-1 h-px bg-[var(--color-border)]" />

          {/* Settings */}
          {profileItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={itemClass}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}

          {/* Language sub-menu */}
          <div className="relative">
            <button
              className={cn(itemClass, "flex items-center justify-between")}
              onMouseEnter={() => setSubMenu("language")}
              onClick={() => setSubMenu(subMenu === "language" ? null : "language")}
            >
              <span>{tc("language")}</span>
              <ChevronRight size={14} className="text-[var(--color-text-tertiary)]" />
            </button>
            {subMenu === "language" && (
              <div className={subMenuClass}>
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

          {/* Theme sub-menu */}
          {mounted && (
            <div className="relative">
              <button
                className={cn(itemClass, "flex items-center justify-between")}
                onMouseEnter={() => setSubMenu("theme")}
                onClick={() => setSubMenu(subMenu === "theme" ? null : "theme")}
              >
                <span>{tc("theme")}</span>
                <ChevronRight size={14} className="text-[var(--color-text-tertiary)]" />
              </button>
              {subMenu === "theme" && (
                <div className={subMenuClass}>
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

          {/* Help & upgrade */}
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
  );
}
