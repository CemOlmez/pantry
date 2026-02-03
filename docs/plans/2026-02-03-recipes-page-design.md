# Recipes Page Design

> Design document for the Recipes feature in the Pantry app.
> Created: 2026-02-03

## Overview

The Recipes page is a recipe hub where users can discover community recipes, save favorites, and create their own recipes. It integrates with the pantry to show ingredient matching.

## Page Structure

### Navigation

Three horizontal tabs with sticky header:

- **Discover** — Browse all public recipes with search & filters
- **Favorites** — Saved recipes
- **My Recipes** — User-created recipes (published & drafts)

```
┌─────────────────────────────────────────┐
│  Recipes                    [+ Create]  │
├─────────────────────────────────────────┤
│  [Discover]  [Favorites]  [My Recipes]  │
├─────────────────────────────────────────┤
│  Search bar + Filter chips              │
├─────────────────────────────────────────┤
│  Recipe card grid                       │
│  (1 col mobile, 2-3 col desktop)        │
└─────────────────────────────────────────┘
```

- "+ Create Recipe" button in header (desktop) or FAB (mobile)
- Each tab preserves scroll position

## Recipe Cards

Vertical cards with shadow, rounded-xl, hover lift effect.

```
┌─────────────────────────────┐
│  ┌───────────────────────┐  │
│  │      Recipe Image     │  │  16:10 aspect ratio
│  │  ♡ (save button)      │  │  Top-right overlay
│  └───────────────────────┘  │
│                             │
│  Creamy Tuscan Chicken      │  Title (2 lines max)
│  by @maria · ★ 4.8 (124)    │  Author + rating
│                             │
│  🕐 35 min  ·  Medium       │  Cook time + difficulty
│  🔥 485 cal                 │  Calories per serving
│                             │
│  ┌───────────────────────┐  │
│  │ ✓ 8/10 ingredients    │  │  Pantry match indicator
│  └───────────────────────┘  │
└─────────────────────────────┘
```

### Pantry Match Indicator

- Compares recipe ingredients against user's pantry
- Shows "You have X/Y ingredients"
- Color-coded: green (80%+), orange (50-79%), muted (below 50%)
- Special badge "Ready to cook!" when 100% match

### Placeholder Images

When no photo exists, show warm gradient background with subtle food category icon (pot for soups, salad bowl for salads, etc.)

## Search & Filters (Discover Tab)

### Search Bar

- Full-width, rounded-full, search icon
- Placeholder: "Search recipes..."
- X button to clear

### Filter Chips (horizontal scroll)

```
[Can Cook Now ✓] [Meal ▾] [Cuisine ▾] [Time ▾] [Difficulty ▾] [Diet ▾]
```

| Filter | Options |
|--------|---------|
| Can Cook Now | Toggle — shows recipes with 80%+ pantry match |
| Meal Type | Breakfast, Lunch, Dinner, Snack, Dessert |
| Cuisine | Italian, Mexican, Asian, Mediterranean, American, Indian, French, Other |
| Time | Under 15 min, 15-30 min, 30-60 min, 1+ hour |
| Difficulty | Easy, Medium, Hard |
| Diet | Vegetarian, Vegan, Gluten-free, Dairy-free, Keto, Low-carb |

- Active filters show filled chip with selection count
- "Clear all" link when filters active
- Summary text: "Showing 24 recipes"

## Recipe Creation Flow

Multi-step modal/page with progress indicator.

### Step 1 — Basic Info

- Title (required)
- Description (optional)
- Image upload with crop
- Servings (default 4)
- Prep time + Cook time (minutes)
- Difficulty selector

### Step 2 — Ingredients

- Add ingredients one by one
- Row: Quantity + Unit dropdown + Ingredient name (autocomplete)
- Drag to reorder, swipe to delete
- "Add from your pantry" quick-add chips

### Step 3 — Instructions

- Numbered steps
- Text area + optional image per step
- Drag to reorder

### Step 4 — Details & Publish

- Meal type (multi-select)
- Cuisine (single select)
- Dietary tags (multi-select)
- Auto-calculated nutrition
- Toggle: "Publish to community"
- Save button

Navigation: Back/Next + "Save as Draft" always accessible.

## Recipe Detail Page

Route: `/recipes/[id]`

```
┌─────────────────────────────────────────┐
│           Hero Image (40vh)             │
│  ← Back                          ♡ ⋮    │
└─────────────────────────────────────────┘
│  Creamy Tuscan Chicken                  │
│  by @maria · ★ 4.8 (124 reviews)        │
│                                         │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │
│  │35min │ │Medium│ │485cal│ │4 svgs│   │
│  └──────┘ └──────┘ └──────┘ └──────┘   │
│                                         │
│  Description text...                    │
├─────────────────────────────────────────┤
│  🥘 INGREDIENTS            [4 servings ▾]│
│  ┌─────────────────────────────────────┐│
│  │ ✓ You have 8/10 ingredients         ││
│  │   [Add 2 missing to shopping list]  ││
│  └─────────────────────────────────────┘│
│                                         │
│  ☑ 2 chicken breasts         ✓ in pantry│
│  ☑ 200g spinach              ✓ in pantry│
│  ☐ 100ml heavy cream         ✗ missing  │
├─────────────────────────────────────────┤
│  📝 INSTRUCTIONS                        │
│  1. Season chicken with salt...         │
│  2. Heat oil in a large pan...          │
├─────────────────────────────────────────┤
│  📊 NUTRITION (per serving)             │
│  Calories 485 · Protein 38g · Carbs 12g │
├─────────────────────────────────────────┤
│  💬 REVIEWS (124)            [Write ▸]  │
├─────────────────────────────────────────┤
│  🍽 YOU MIGHT ALSO LIKE                 │
│  [Card] [Card] [Card]  →                │
└─────────────────────────────────────────┘
```

### Key Interactions

- Servings adjuster recalculates ingredient quantities
- Ingredient checkboxes for cooking progress
- "Add missing to shopping list" one-tap action
- Overflow menu: Share, Report, Edit (if owner)

## Favorites Tab

- Same card grid as Discover
- Simple search bar only (no filters)
- Sort: "Recently saved" or "Recipe name"
- Empty state: Heart illustration + "No favorites yet" + "Discover recipes" button

## My Recipes Tab

- Same card grid
- Status badge on each card: **Published** (green) or **Draft** (gray)
- Tap → detail page (published) or edit mode (draft)
- Card overflow: Edit, Duplicate, Delete, Publish/Unpublish

### Stats Banner

```
┌─────────────────────────────────────────┐
│  📊 Your recipes: 12 published · 3 drafts │
│      ♡ 847 total saves · ★ 4.6 avg rating │
└─────────────────────────────────────────┘
```

## Data Structure

```typescript
type Recipe = {
  id: string;
  title: string;
  description: string;
  image?: string;
  author: { id: string; name: string; avatar?: string };
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Macros;
  mealType: string[];
  cuisine: string;
  dietaryTags: string[];
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
};

type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  inPantry?: boolean;
};

type Instruction = {
  step: number;
  text: string;
  image?: string;
};

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
```

## Mock Data

Start with 15-20 diverse recipes:
- Mix of cuisines (Italian, Mexican, Asian, American, Mediterranean)
- All meal types (breakfast, lunch, dinner, snacks, desserts)
- Various difficulty levels
- Some with high pantry match for "Can Cook Now" demo

## Component Structure

```
src/components/recipes/
├── recipe-tabs.tsx          # Tab navigation
├── recipe-card.tsx          # Recipe card component
├── recipe-grid.tsx          # Responsive grid wrapper
├── recipe-filters.tsx       # Search + filter chips
├── recipe-detail.tsx        # Full detail page content
├── recipe-creator.tsx       # Multi-step creation form
├── ingredient-list.tsx      # Checkable ingredient list
├── instruction-list.tsx     # Numbered instructions
├── pantry-match.tsx         # Ingredient match indicator
└── recipe-stats.tsx         # My Recipes stats banner
```

## Implementation Notes

- Use same design patterns as pantry-shelf.tsx
- All strings via useTranslations("recipes")
- CSS variables for colors, no hardcoded values
- Mobile-first responsive design
- Mock data embedded in component initially (like pantry)
