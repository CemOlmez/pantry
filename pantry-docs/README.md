# Pantry - Smart Kitchen Companion

Pantry is a recipe and meal planning web app. Users manage their pantry inventory, discover recipes based on what they have, plan weekly meals around macro goals, prep meals in advance, build shopping lists, and share with a community.

The app currently runs as an MVP frontend with mock data — no backend is wired up yet. It supports English and Turkish, with dark and light themes.

---

## Pages

### Main Navigation

#### My Pantry (`/`)
The home page. Users store and track everything they have at home — ingredients with quantities, categories, and expiry dates. The page shows a hero section with stats (total items, expiring soon, categories in use), an expiring-soon alert banner, and a grid of ingredient cards grouped by category. Items can be added, edited, and deleted. Filters allow sorting by category, expiry date, or alphabetically.

#### Recipes (`/recipes`)
A recipe discovery hub. Users can browse all recipes, filter by diet preferences (keto, vegan, vegetarian, gluten-free, etc.), macros, cook time, and ingredients. Three main tabs:
- **All Recipes** — Browse and search the full recipe catalog
- **Can Cook Now** — Shows recipes the user can make with their current pantry items
- **Favorites** — Bookmarked recipes

A "Smart Suggestion" feature recommends buying specific items to unlock more recipes.

#### Recipe Detail (`/recipes/[id]`)
Full recipe view with ingredients, step-by-step instructions, and nutrition info per serving. Shows which ingredients are already in the pantry and which are missing. Missing ingredients can be added to the shopping list.

#### Meal Planner (`/meal-planner`)
A weekly calendar view for planning meals. Each day has slots for breakfast, lunch, dinner, and snacks. Users assign recipes to slots or create custom meals. The page shows daily and weekly macro totals. Features include auto-generating a weekly plan and Google Calendar sync integration.

#### Meal Prep (`/meal-prep`)
Create and manage meal prep plans that contain multiple meals. Supports both custom items and recipes from the catalog. Includes nutrition calculation, tagging (keto, vegan, etc.), and the ability to share preps with the community. Users can also discover and favorite community meal preps.

#### Shopping List (`/shopping-list`)
A shopping list that can be auto-generated from the meal plan or manually populated. Items are organized by category and indicate whether they're already in the pantry. Items can be checked off as purchased.

#### Community (`/community`)
A social feed showing shared recipes and meal preps from other users. Users can browse, like, and comment on content. Tabs for all content, recipes only, and meal preps only.

---

### User Menu (Sidebar Footer Dropdown)

#### Settings (`/settings`)
Comprehensive settings with six sections:
- **General** — Display name, username, bio, language preference, theme (light/dark/system), measurement system (metric/imperial)
- **Diet & Preferences** — Default diet selection, allergies and exclusions, daily macro targets (calories, protein, carbs, fat), preferred meal times, meal types to plan
- **Notifications** — Toggles for expiry reminders, meal plan reminders, social notifications, weekly summary email
- **Privacy** — Profile visibility (public/private), whether to show recipes and meal plans publicly, allow followers
- **Connected Accounts** — Manage sign-in methods (email, Google, Apple), connect/disconnect accounts
- **Billing** — Current plan (Free/Premium), upgrade/downgrade, payment methods, invoice history

#### Profile (`/profile`)
User profile showing published recipes, meal preps, bookmarks, follower/following counts. Edit profile option available.

#### Notifications (`/notifications`)
Notification center organized by time (Today, This Week, Earlier). Includes expiry warnings, meal reminders, and social notifications (likes, comments, follows). Notifications can be marked as read.

#### Analytics (`/analytics`)
Dashboard with usage stats and insights: total recipes count, pantry items count, meals planned, expiring soon items, weekly nutrition charts, pantry breakdown by category, and top ingredients used.

#### Store (`/store`)
Marketplace feature — currently a "Coming Soon" page. Will provide local ingredient delivery, specialty items, and meal kit partnerships. Users can sign up for launch notification.

#### Get Help
Help and support (not yet a separate page, menu item only).

#### Upgrade Plan
Premium subscription upsell (not yet a separate page, menu item only).

---

## Sidebar

The sidebar contains:
- **Logo** — Pantry logo image + "Pantry" text at the top
- **Main nav** — My Pantry, Recipes, Meal Planner, Meal Prep, Shopping List, Community
- **User menu** (footer) — Avatar + guest name, opens a dropdown with: Settings, Language switcher (English/Turkish), Theme switcher (Light/Dark/System), Profile, Notifications, Analytics, Store, Get Help, Upgrade Plan, Logout

---

## Internationalization

The app supports two languages:
- **English** (`/en/...`)
- **Turkish** (`/tr/...`)

All user-facing text goes through the translation system. Language can be switched from the sidebar user menu.

---

## Theming

Three theme options available from the sidebar user menu:
- **Light**
- **Dark**
- **System** (follows OS preference)

The app uses a warm orange accent color throughout.
