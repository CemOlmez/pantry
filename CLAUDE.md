# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm start            # Start production server
npm run lint         # ESLint (v9, flat config)
```

No test framework is configured yet.

## Architecture

**Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + next-intl + next-themes + Radix UI primitives

**Routing**: All pages live under `src/app/[locale]/` with dynamic locale parameter (`en`, `tr`). Middleware at `src/middleware.ts` handles locale detection via next-intl.

**Data**: Currently frontend-only with no backend. Mock data will be added later in `src/lib/mock-data.ts`. State managed with React useState and Context API.

**Theming**: CSS variables in `src/app/globals.css` — one set for `:root` (light), one for `.dark`. Brand colors derived from logo: warm orange primary, rich green accent. `next-themes` handles toggle + system detection. Palette expansion planned.

**i18n**: next-intl with `src/i18n/` config files and `messages/{en,tr}.json`. All user-facing strings use `useTranslations()` with namespaces (nav, pages, common, user).

**Key paths**:
- `src/components/ui/` — Custom components (Button, ThemeToggle, LanguageSwitcher, NavItem, UserMenu) built with Tailwind + Radix UI primitives
- `src/components/layout/` — Sidebar (desktop), BottomTabs (mobile), AppLayout (responsive wrapper)
- `src/i18n/` — routing, request handler, navigation helpers
- `messages/{en,tr}.json` — translation strings
- `src/lib/utils.ts` — `cn()` utility for Tailwind class merging

**Path alias**: `@/*` maps to `./src/*`

## Layout

- Desktop (md+): Fixed left sidebar (240px) with nav, theme toggle, language switcher, user menu
- Mobile (<md): Bottom tab bar with 5 main nav items. Secondary actions in settings/user menu.

## Conventions

- Use `cn()` from `src/lib/utils.ts` for merging Tailwind classes
- All user-facing strings must use `useTranslations()` from next-intl with proper namespace
- CSS variables for all colors — never hardcode color values in components
- Radix UI for headless interactive behavior (dropdowns, dialogs, tooltips) — style with Tailwind
- Components use "use client" directive when they need interactivity
