# Clean Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up a clean Next.js project with custom UI components, light/dark theming, i18n, responsive layout (sidebar + bottom tabs), and empty page shells for all routes.

**Architecture:** Next.js 16 App Router with `[locale]` dynamic routing. CSS variables for theming (light/dark). Radix UI for headless interactive primitives. Custom components styled with Tailwind. Responsive layout switches between sidebar (desktop) and bottom tab bar (mobile).

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, next-themes, next-intl, @radix-ui/react-dropdown-menu, @radix-ui/react-tooltip

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`

**Step 1: Create Next.js app**

Run from `/home/cem/projects/pantry`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```
When prompted, accept defaults. This will skip existing files like `pantry_logo.png`.

Expected: Project scaffolded with `package.json`, `src/app/`, `tailwind.config.ts`, etc.

**Step 2: Verify it runs**

```bash
cd /home/cem/projects/pantry && npm run dev
```
Visit http://localhost:3000 — should show the default Next.js page.

**Step 3: Clean up default files**

- Delete `src/app/page.tsx` content, replace with a simple "Pantry" heading
- Delete default CSS from `src/app/globals.css` except Tailwind directives
- Copy `pantry_logo.png` to `public/logo.png`

**Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: initialize Next.js 16 with TypeScript and Tailwind"
```

---

### Task 2: Set Up Theming (CSS Variables + next-themes)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/providers.tsx`
- Create: `src/lib/utils.ts`

**Step 1: Install dependencies**

```bash
npm install next-themes clsx tailwind-merge
```

**Step 2: Create utility function**

Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 3: Define CSS variables in globals.css**

Replace `src/app/globals.css` with brand colors derived from the logo:

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  /* Brand colors from logo */
  --color-primary: #E8913A;
  --color-primary-hover: #D4802E;
  --color-primary-light: #F5C88A;
  --color-accent: #5B8C3E;
  --color-accent-hover: #4A7332;
  --color-accent-light: #A3C98A;
  --color-danger: #D45A3A;
  --color-danger-hover: #B94A2E;
  --color-warning: #E8913A;

  /* Surfaces */
  --color-bg: #FDFAF6;
  --color-bg-secondary: #F5F0E8;
  --color-bg-tertiary: #EDE6DA;
  --color-surface: #FFFFFF;
  --color-surface-hover: #F9F5EF;

  /* Text */
  --color-text: #3D2E1F;
  --color-text-secondary: #7A6B5A;
  --color-text-tertiary: #A69882;
  --color-text-inverse: #FDFAF6;

  /* Borders */
  --color-border: #E0D6C8;
  --color-border-hover: #C9BBAA;

  /* Sidebar */
  --color-sidebar-bg: #FFFFFF;
  --color-sidebar-border: #E0D6C8;
  --color-sidebar-item-hover: #F5F0E8;
  --color-sidebar-item-active: #FDF0E0;
  --color-sidebar-item-active-text: #E8913A;

  /* Bottom tabs */
  --color-tabs-bg: #FFFFFF;
  --color-tabs-border: #E0D6C8;
  --color-tabs-active: #E8913A;
  --color-tabs-inactive: #A69882;
}

.dark {
  /* Surfaces */
  --color-bg: #1A1510;
  --color-bg-secondary: #241E17;
  --color-bg-tertiary: #2E2720;
  --color-surface: #2E2720;
  --color-surface-hover: #3A322A;

  /* Text */
  --color-text: #F0E8DD;
  --color-text-secondary: #B5A898;
  --color-text-tertiary: #7A6B5A;
  --color-text-inverse: #1A1510;

  /* Borders */
  --color-border: #3A322A;
  --color-border-hover: #4D4338;

  /* Brand colors stay the same */
  --color-primary: #E8913A;
  --color-primary-hover: #F0A050;
  --color-primary-light: #4D3820;
  --color-accent: #6BA348;
  --color-accent-hover: #7DB85A;
  --color-accent-light: #2A3A20;
  --color-danger: #E06050;
  --color-danger-hover: #F07060;

  /* Sidebar */
  --color-sidebar-bg: #241E17;
  --color-sidebar-border: #3A322A;
  --color-sidebar-item-hover: #2E2720;
  --color-sidebar-item-active: #3A2E1E;
  --color-sidebar-item-active-text: #E8913A;

  /* Bottom tabs */
  --color-tabs-bg: #241E17;
  --color-tabs-border: #3A322A;
  --color-tabs-active: #E8913A;
  --color-tabs-inactive: #7A6B5A;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

**Step 4: Create providers wrapper**

Create `src/components/providers.tsx`:
```tsx
"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
```

**Step 5: Update root layout**

Update `src/app/layout.tsx` to wrap with Providers:
```tsx
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pantry",
  description: "Smart Kitchen Companion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Step 6: Verify theming works**

Run `npm run dev`, open browser DevTools, add class `dark` to `<html>` element. Background should change from cream to dark brown.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add light/dark theming with CSS variables and next-themes"
```

---

### Task 3: Set Up Internationalization (next-intl)

**Files:**
- Create: `src/i18n/routing.ts`
- Create: `src/i18n/request.ts`
- Create: `src/i18n/navigation.ts`
- Create: `src/middleware.ts`
- Create: `messages/en.json`
- Create: `messages/tr.json`
- Modify: `next.config.ts`
- Create: `src/app/[locale]/layout.tsx`
- Create: `src/app/[locale]/page.tsx`
- Delete: `src/app/page.tsx` and `src/app/layout.tsx` (moved under `[locale]`)

**Step 1: Install next-intl**

```bash
npm install next-intl
```

**Step 2: Create i18n routing config**

Create `src/i18n/routing.ts`:
```typescript
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
});
```

**Step 3: Create i18n request handler**

Create `src/i18n/request.ts`:
```typescript
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "tr")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

**Step 4: Create i18n navigation helpers**

Create `src/i18n/navigation.ts`:
```typescript
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
```

**Step 5: Create middleware**

Create `src/middleware.ts`:
```typescript
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
```

**Step 6: Update next.config.ts**

```typescript
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {};

export default withNextIntl(nextConfig);
```

**Step 7: Create translation files**

Create `messages/en.json`:
```json
{
  "nav": {
    "pantry": "My Pantry",
    "recipes": "Recipes",
    "mealPlanner": "Meal Planner",
    "mealPrep": "Meal Prep",
    "shoppingList": "Shopping List",
    "settings": "Settings"
  },
  "pages": {
    "pantry": "My Pantry",
    "recipes": "Recipes",
    "recipeDetail": "Recipe Detail",
    "mealPlanner": "Meal Planner",
    "mealPrep": "Meal Prep",
    "shoppingList": "Shopping List",
    "settings": "Settings"
  },
  "common": {
    "appName": "Pantry",
    "language": "Language",
    "theme": "Theme",
    "light": "Light",
    "dark": "Dark",
    "system": "System"
  },
  "user": {
    "guest": "Guest",
    "settings": "Settings",
    "profile": "Profile",
    "notifications": "Notifications",
    "analytics": "Analytics",
    "store": "Store",
    "help": "Get Help",
    "upgrade": "Upgrade Plan",
    "logout": "Log out"
  }
}
```

Create `messages/tr.json`:
```json
{
  "nav": {
    "pantry": "Kilerim",
    "recipes": "Tarifler",
    "mealPlanner": "Yemek Planlayici",
    "mealPrep": "Yemek Hazirlik",
    "shoppingList": "Alisveris Listesi",
    "settings": "Ayarlar"
  },
  "pages": {
    "pantry": "Kilerim",
    "recipes": "Tarifler",
    "recipeDetail": "Tarif Detayi",
    "mealPlanner": "Yemek Planlayici",
    "mealPrep": "Yemek Hazirlik",
    "shoppingList": "Alisveris Listesi",
    "settings": "Ayarlar"
  },
  "common": {
    "appName": "Pantry",
    "language": "Dil",
    "theme": "Tema",
    "light": "Acik",
    "dark": "Koyu",
    "system": "Sistem"
  },
  "user": {
    "guest": "Misafir",
    "settings": "Ayarlar",
    "profile": "Profil",
    "notifications": "Bildirimler",
    "analytics": "Analizler",
    "store": "Magaza",
    "help": "Yardim Al",
    "upgrade": "Plani Yukselt",
    "logout": "Cikis Yap"
  }
}
```

**Step 8: Move layout and page under [locale]**

Delete `src/app/layout.tsx` and `src/app/page.tsx`.

Create `src/app/[locale]/layout.tsx`:
```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import "../globals.css";

export const metadata: Metadata = {
  title: "Pantry",
  description: "Smart Kitchen Companion",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "tr")) {
    notFound();
  }

  const messages = (await import(`../../../messages/${locale}.json`)).default;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
```

Create `src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function PantryPage() {
  const t = useTranslations("pages");
  return (
    <main>
      <h1>{t("pantry")}</h1>
    </main>
  );
}
```

**Step 9: Verify i18n works**

Run `npm run dev`. Visit http://localhost:3000/en — should show "My Pantry". Visit http://localhost:3000/tr — should show "Kilerim".

**Step 10: Commit**

```bash
git add -A && git commit -m "feat: add next-intl i18n with English and Turkish support"
```

---

### Task 4: Build UI Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/theme-toggle.tsx`
- Create: `src/components/ui/language-switcher.tsx`
- Create: `src/components/ui/nav-item.tsx`
- Create: `src/components/ui/user-menu.tsx`

**Step 1: Install Radix primitives**

```bash
npm install @radix-ui/react-dropdown-menu @radix-ui/react-tooltip
```

**Step 2: Create Button component**

Create `src/components/ui/button.tsx`:
```tsx
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-text-inverse)] hover:bg-[var(--color-primary-hover)]",
  secondary:
    "bg-[var(--color-bg-secondary)] text-[var(--color-text)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
  icon: "p-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
```

**Step 3: Create ThemeToggle component**

Create `src/components/ui/theme-toggle.tsx`:
```tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("common");

  useEffect(() => setMounted(true), []);
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
```

**Step 4: Create LanguageSwitcher component**

Create `src/components/ui/language-switcher.tsx`:
```tsx
"use client";

import { useLocale, useTranslations } from "next-intl";
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
```

**Step 5: Create NavItem component**

Create `src/components/ui/nav-item.tsx`:
```tsx
"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

export function NavItem({ href, icon, label }: NavItemProps) {
  const pathname = usePathname();
  const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-[var(--color-sidebar-item-active)] text-[var(--color-sidebar-item-active-text)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-sidebar-item-hover)] hover:text-[var(--color-text)]"
      )}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}
```

**Step 6: Create UserMenu component**

Create `src/components/ui/user-menu.tsx`:
```tsx
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
```

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add custom UI components (button, theme toggle, language switcher, nav, user menu)"
```

---

### Task 5: Build Layout (Sidebar + Bottom Tabs + AppLayout)

**Files:**
- Create: `src/components/layout/sidebar.tsx`
- Create: `src/components/layout/bottom-tabs.tsx`
- Create: `src/components/layout/app-layout.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Create Sidebar component**

Create `src/components/layout/sidebar.tsx`:
```tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { NavItem } from "@/components/ui/nav-item";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { UserMenu } from "@/components/ui/user-menu";

export function Sidebar() {
  const t = useTranslations("nav");

  const navItems = [
    { href: "/", icon: "🏠", label: t("pantry") },
    { href: "/recipes", icon: "📖", label: t("recipes") },
    { href: "/meal-planner", icon: "📅", label: t("mealPlanner") },
    { href: "/meal-prep", icon: "🍱", label: t("mealPrep") },
    { href: "/shopping-list", icon: "🛒", label: t("shoppingList") },
  ];

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Image src="/logo.png" alt="Pantry" width={36} height={36} />
        <span className="text-lg font-bold text-[var(--color-text)]">
          Pantry
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavItem key={item.href} {...item} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-3">
        <div className="px-2 space-y-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
        <div className="border-t border-[var(--color-sidebar-border)] pt-3">
          <UserMenu />
        </div>
      </div>
    </aside>
  );
}
```

**Step 2: Create BottomTabs component**

Create `src/components/layout/bottom-tabs.tsx`:
```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function BottomTabs() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const tabs = [
    { href: "/", icon: "🏠", label: t("pantry") },
    { href: "/recipes", icon: "📖", label: t("recipes") },
    { href: "/meal-planner", icon: "📅", label: t("mealPlanner") },
    { href: "/meal-prep", icon: "🍱", label: t("mealPrep") },
    { href: "/shopping-list", icon: "🛒", label: t("shoppingList") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t border-[var(--color-tabs-border)] bg-[var(--color-tabs-bg)]">
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors",
                isActive
                  ? "text-[var(--color-tabs-active)]"
                  : "text-[var(--color-tabs-inactive)]"
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

**Step 3: Create AppLayout component**

Create `src/components/layout/app-layout.tsx`:
```tsx
import { Sidebar } from "./sidebar";
import { BottomTabs } from "./bottom-tabs";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar />
      <main className="md:pl-60">
        <div className="p-4 pb-20 md:p-8 md:pb-8">{children}</div>
      </main>
      <BottomTabs />
    </div>
  );
}
```

**Step 4: Wire layout into [locale]/layout.tsx**

Update `src/app/[locale]/layout.tsx` to include `<AppLayout>` wrapping `{children}`.

**Step 5: Verify responsive layout**

Run `npm run dev`. Desktop: sidebar visible on left, main content offset. Mobile (resize to <768px): sidebar hidden, bottom tabs visible, content full width.

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add responsive layout with sidebar and bottom tab bar"
```

---

### Task 6: Create All Route Shells

**Files:**
- Already exists: `src/app/[locale]/page.tsx` (Pantry)
- Create: `src/app/[locale]/recipes/page.tsx`
- Create: `src/app/[locale]/recipes/[id]/page.tsx`
- Create: `src/app/[locale]/meal-planner/page.tsx`
- Create: `src/app/[locale]/meal-prep/page.tsx`
- Create: `src/app/[locale]/shopping-list/page.tsx`
- Create: `src/app/[locale]/settings/page.tsx`

**Step 1: Create all page shells**

Each page follows the same pattern — displays the translated page title:

`src/app/[locale]/recipes/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function RecipesPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("recipes")}
      </h1>
    </div>
  );
}
```

`src/app/[locale]/recipes/[id]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function RecipeDetailPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("recipeDetail")}
      </h1>
    </div>
  );
}
```

`src/app/[locale]/meal-planner/page.tsx`:
```tsx
import { useTranslations } from "next-intl";

export default function MealPlannerPage() {
  const t = useTranslations("pages");
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-text)]">
        {t("mealPlanner")}
      </h1>
    </div>
  );
}
```

`src/app/[locale]/meal-prep/page.tsx`:
```tsx
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
```

`src/app/[locale]/shopping-list/page.tsx`:
```tsx
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
```

`src/app/[locale]/settings/page.tsx`:
```tsx
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
```

**Step 2: Verify all routes**

Run `npm run dev` and visit each:
- http://localhost:3000/en → "My Pantry"
- http://localhost:3000/en/recipes → "Recipes"
- http://localhost:3000/en/recipes/test → "Recipe Detail"
- http://localhost:3000/en/meal-planner → "Meal Planner"
- http://localhost:3000/en/meal-prep → "Meal Prep"
- http://localhost:3000/en/shopping-list → "Shopping List"
- http://localhost:3000/en/settings → "Settings"

Click sidebar nav links — all should navigate correctly.

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: add all route shells with translated page titles"
```

---

### Task 7: Final Verification & Cleanup

**Step 1: Run lint**

```bash
npm run lint
```

Fix any warnings or errors.

**Step 2: Run production build**

```bash
npm run build
```

Should complete with no errors.

**Step 3: Update CLAUDE.md**

Update `/home/cem/projects/pantry/CLAUDE.md` to reflect the new clean project structure.

**Step 4: Final commit**

```bash
git add -A && git commit -m "chore: lint, build verify, update CLAUDE.md"
```
