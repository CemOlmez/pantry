"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function UserMenu() {
  const t = useTranslations("user");

  const menuItems = [
    { label: t("settings"), href: "/settings" },
    { label: t("profile"), href: "/profile" },
    { label: t("notifications"), href: "/notifications" },
    { label: t("analytics"), href: "/analytics" },
    { label: t("store"), href: "/store" },
  ];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text)] transition-colors cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-xs font-bold">
            G
          </div>
          <span>{t("guest")}</span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-1.5 shadow-lg"
          side="top"
          align="start"
          sideOffset={8}
        >
          {menuItems.map((item) => (
            <DropdownMenu.Item key={item.href} asChild>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] outline-none cursor-pointer"
              >
                {item.label}
              </Link>
            </DropdownMenu.Item>
          ))}

          <DropdownMenu.Separator className="my-1 h-px bg-[var(--color-border)]" />

          <DropdownMenu.Item className="rounded-lg px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-[var(--color-surface-hover)] outline-none cursor-pointer">
            {t("logout")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
