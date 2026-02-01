# Clean Rebuild Design

## Tech Stack
- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- `next-themes` for light/dark mode (CSS variables, system detection)
- `next-intl` for i18n (English/Turkish, `[locale]` routing)
- Radix UI primitives for accessible headless behavior (dialog, dropdown, tabs, etc.)
- No shadcn/ui, no component library — all components custom-styled

## Theming
- CSS variables in `globals.css` — one set for light, one for dark
- Brand colors from logo: warm orange primary, rich green accent, dark brown text, cream backgrounds, tomato red highlight
- Palette system designed for future expansion (add new variable sets)

## Layout
- **Desktop (768px+):** Fixed left sidebar (~240px) with logo, nav links, theme toggle, language switcher, user avatar
- **Mobile (<768px):** Bottom tab bar with 5 main nav icons + labels. Secondary actions in settings page.
- `src/components/layout/app-layout.tsx` handles responsive switching

## Pages (all under `src/app/[locale]/`)
| Route | Page |
|-------|------|
| `/` | My Pantry |
| `/recipes` | Recipes |
| `/recipes/[id]` | Recipe Detail |
| `/meal-planner` | Meal Planner |
| `/meal-prep` | Meal Prep |
| `/shopping-list` | Shopping List |
| `/settings` | Settings |

All pages are empty shells (title only) — content built later one by one.

## Components (`src/components/`)
- `ui/` — Button, ThemeToggle, LanguageSwitcher, NavItem (custom-built, Radix where needed)
- `layout/` — Sidebar, BottomTabs, AppLayout

## Data
- No backend, pure frontend
- Mock data later in `src/lib/mock-data.ts` with TypeScript interfaces
- React useState for local state, Context API only where truly shared

## Build Order
1. Initialize clean Next.js project
2. Set up theming (CSS variables, next-themes)
3. Set up i18n (next-intl, locale routing)
4. Build UI components
5. Build layout (sidebar + bottom tabs)
6. Create route shells
7. Wire navigation
