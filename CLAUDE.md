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

**Stack**: Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui (New York style) + next-intl + next-themes

**Routing**: All pages live under `src/app/[locale]/` with dynamic locale parameter (`en`, `tr`). Middleware at `src/middleware.ts` handles locale detection via next-intl.

**Data**: Currently frontend-only with mock data in `src/lib/mock-data.ts`. No backend yet. State managed with React useState and Context API (ThemeProvider, GoogleConnectionProvider, MealTimesProvider).

**Key paths**:
- `src/components/ui/` — shadcn/ui primitives (don't edit manually, use `npx shadcn@latest add`)
- `src/components/{pantry,recipes,meal-planner,meal-prep,settings}/` — feature components
- `src/lib/mock-data.ts` — all data interfaces (PantryItem, Recipe, MealPlanEntry, etc.) and seed data
- `src/i18n/` — routing, request handler, navigation helpers for next-intl
- `messages/{en,tr}.json` — translation strings (namespaced: nav, pantry, recipes, mealPlanner, etc.)

**Path alias**: `@/*` maps to `./src/*`

## Conventions

- Use `cn()` from `src/lib/utils.ts` for merging Tailwind classes
- All user-facing strings must use `useTranslations()` from next-intl with proper namespace
- Theme uses CSS variables with warm orange accent; support light/dark/system
- Components use "use client" directive when they need interactivity
