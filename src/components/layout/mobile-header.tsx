"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Link } from "@/i18n/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import {
  ChevronDown,
  Settings,
  User,
  HelpCircle,
  Crown,
  Globe,
  Palette,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const itemClass =
  "flex w-full items-center gap-3 text-left rounded-lg px-3 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] cursor-pointer transition-colors";

export function MobileHeader() {
  const t = useTranslations("user");
  const tc = useTranslations("common");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentLocale = useLocale();

  useEffect(() => { setMounted(true); }, []);
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<"language" | "theme" | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setExpanded(null);
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
        setExpanded(null);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function close() {
    setOpen(false);
    setExpanded(null);
  }

  return (
    <div className="md:hidden flex items-center justify-between px-4 pt-4" ref={menuRef}>
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Pantry" width={28} height={28} className="w-7 h-7" />
        <span className="text-lg font-bold text-[var(--color-text)]">Pantry</span>
      </div>

      <div className="relative">
        <button
          onClick={() => { setOpen(!open); setExpanded(null); }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-xs font-bold cursor-pointer"
        >
          C
        </button>

        {open && (
          <div className="absolute top-full right-0 mt-2 z-50 w-[260px] max-h-[calc(100vh-80px)] overflow-y-auto rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-2 shadow-xl">
            {/* Profile header */}
            <Link
              href="/profile"
              onClick={close}
              className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-sm font-bold">
                C
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--color-text)] truncate">Cem Olmez</div>
                <div className="text-xs text-[var(--color-text-tertiary)] truncate">cem@pantry.app</div>
              </div>
            </Link>

            <div className="my-1.5 h-px bg-[var(--color-border)]" />

            {/* Nav items */}
            <Link href="/profile" className={itemClass} onClick={close}>
              <User size={16} />
              {t("profile")}
            </Link>
            <Link href="/settings" className={itemClass} onClick={close}>
              <Settings size={16} />
              {t("settings")}
            </Link>

            {/* Language — inline expand */}
            <button
              className={cn(itemClass, "justify-between")}
              onClick={() => setExpanded(expanded === "language" ? null : "language")}
            >
              <span className="flex items-center gap-3">
                <Globe size={16} />
                {tc("language")}
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  "text-[var(--color-text-tertiary)] transition-transform duration-200",
                  expanded === "language" && "rotate-180"
                )}
              />
            </button>
            {expanded === "language" && (
              <div className="ml-7 mb-1 space-y-0.5">
                <button
                  className={cn(itemClass, "text-xs py-2", currentLocale === "en" && "text-[var(--color-primary)] font-medium")}
                  onClick={() => { router.replace(pathname, { locale: "en" }); close(); }}
                >
                  English
                </button>
                <button
                  className={cn(itemClass, "text-xs py-2", currentLocale === "tr" && "text-[var(--color-primary)] font-medium")}
                  onClick={() => { router.replace(pathname, { locale: "tr" }); close(); }}
                >
                  Türkçe
                </button>
              </div>
            )}

            {/* Theme — inline expand */}
            {mounted && (
              <>
                <button
                  className={cn(itemClass, "justify-between")}
                  onClick={() => setExpanded(expanded === "theme" ? null : "theme")}
                >
                  <span className="flex items-center gap-3">
                    <Palette size={16} />
                    {tc("theme")}
                  </span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-[var(--color-text-tertiary)] transition-transform duration-200",
                      expanded === "theme" && "rotate-180"
                    )}
                  />
                </button>
                {expanded === "theme" && (
                  <div className="ml-7 mb-1 space-y-0.5">
                    <button
                      className={cn(itemClass, "text-xs py-2", theme === "light" && "text-[var(--color-primary)] font-medium")}
                      onClick={() => { setTheme("light"); close(); }}
                    >
                      {tc("light")}
                    </button>
                    <button
                      className={cn(itemClass, "text-xs py-2", theme === "dark" && "text-[var(--color-primary)] font-medium")}
                      onClick={() => { setTheme("dark"); close(); }}
                    >
                      {tc("dark")}
                    </button>
                    <button
                      className={cn(itemClass, "text-xs py-2", theme === "system" && "text-[var(--color-primary)] font-medium")}
                      onClick={() => { setTheme("system"); close(); }}
                    >
                      {tc("system")}
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="my-1.5 h-px bg-[var(--color-border)]" />

            <Link href="/help" className={itemClass} onClick={close}>
              <HelpCircle size={16} />
              {t("help")}
            </Link>
            <Link href="/upgrade" className={itemClass} onClick={close}>
              <Crown size={16} />
              {t("upgrade")}
            </Link>

            <div className="my-1.5 h-px bg-[var(--color-border)]" />

            <button
              className="flex w-full items-center gap-3 text-left rounded-lg px-3 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors"
              onClick={close}
            >
              <LogOut size={16} />
              {t("logout")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
