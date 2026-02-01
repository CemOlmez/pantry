# Pantry - Data Model & Backend Information

All data is currently mock data defined in `src/lib/mock-data.ts`. When a backend is wired up, these exports will be replaced with API calls. The planned backend stack is PostgreSQL via Supabase, Redis caching, and Spoonacular API for recipe imports.

---

## Data Types

### PantryItem
Represents an ingredient in the user's pantry.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Ingredient name |
| category | `"vegetables" \| "proteins" \| "dairy" \| "spices" \| "grains" \| "fruits"` | Category |
| quantity | number | Amount |
| unit | string | Unit of measurement |
| expiryDate | string | ISO date string |
| addedDate | string | ISO date string |

### Recipe
Represents a recipe (user-created or API-sourced).

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| title | string | Recipe name |
| image | string | Image URL |
| prepTime | number | Prep time in minutes |
| cookTime | number | Cook time in minutes |
| servings | number | Default serving count |
| ingredients | RecipeIngredient[] | List of ingredients |
| macros | object | `{ calories, protein, carbs, fat, fiber }` per serving |
| diets | string[] | Diet tags (keto, vegan, etc.) |
| steps | string[] | Cooking instructions |
| rating | number | Rating 1-5 |
| author | string | Author name |

### RecipeIngredient

| Field | Type | Description |
|-------|------|-------------|
| name | string | Ingredient name |
| quantity | number | Amount needed |
| unit | string | Unit of measurement |

### MealPlanEntry
Represents a recipe or custom meal assigned to a day/meal slot.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| recipeId | string? | Reference to a Recipe (optional if custom meal) |
| customMeal | object? | `{ title, items: CustomMealItem[] }` |
| dayOfWeek | number | 0 = Monday, 6 = Sunday |
| mealType | `"breakfast" \| "lunch" \| "dinner" \| "snack"` | Meal slot |
| servings | number? | Custom serving size |
| synced | boolean? | Whether synced to Google Calendar |

### CustomMealItem

| Field | Type | Description |
|-------|------|-------------|
| name | string | Item name |
| quantity | number | Amount |
| unit | string | Unit |
| calories | number? | Optional macro |
| protein | number? | Optional macro |
| carbs | number? | Optional macro |
| fat | number? | Optional macro |

---

## Mock Data

### Pantry Items — 21 items
Across 6 categories:
- **Vegetables** (5): Tomatoes, Onions, Bell Peppers, Spinach, Broccoli
- **Proteins** (4): Chicken Breast, Ground Beef, Eggs, Salmon
- **Dairy** (4): Milk, Cheddar Cheese, Greek Yogurt, Butter
- **Spices** (4): Salt, Black Pepper, Cumin, Paprika
- **Grains** (3): Rice, Pasta, Bread
- **Fruits** (2): Apples, Lemons

Expiry dates are generated relative to today using a `daysFromNow()` helper, ranging from 0 to 365 days.

### Recipes — 15 recipes
Grilled Chicken Salad, Pasta Carbonara, Vegetable Stir Fry, Greek Salad, Beef Tacos, Scrambled Eggs, Salmon with Rice, Tomato Soup, Chicken Curry, Veggie Burger, Omelette, Spaghetti Bolognese, Quinoa Bowl, Caesar Salad, Lemon Chicken.

Each recipe has full macro data per serving, diet tags, and step-by-step instructions. Ratings range from 4.0 to 4.8.

### Meal Plan Entries — 10 entries
Spans Monday through Sunday, covering breakfast, lunch, dinner, and snack slots. Maps to existing recipe IDs.

### Bookmarks
- Bookmarked recipe IDs: `["r1", "r5", "r7"]`
- Bookmarked meal prep IDs: `["prep-3"]`

### Current User
`CURRENT_USER = "Chef Maria"`

---

## Context Providers

### GoogleConnectionContext
Tracks whether the user has connected their Google Calendar account. Simple boolean state.

- Provider: `GoogleConnectionProvider`
- Hook: `useGoogleConnection()` returns `{ isConnected, setConnected }`

### MealTimesContext
Stores the user's preferred meal times for calendar sync.

- Provider: `MealTimesProvider`
- Hook: `useMealTimes()` returns `{ mealTimes, setMealTimes }`
- Defaults: breakfast 08:00, lunch 12:30, dinner 19:00, snack 15:30

---

## Constants

### Diet Types
Supported dietary preferences: keto, vegan, vegetarian, gluten-free, dairy-free, halal, kosher.

Defined in `src/lib/constants.ts` as `DIET_KEYS` with a `DIET_TRANSLATION_MAP` mapping keys to translation message keys.

### Common Ingredients
Categorized ingredient suggestions used for UI autocomplete in the add ingredient dialog. Each category has 10-15 common items. Defined in `src/lib/constants.ts` as `COMMON_INGREDIENTS`.

---

## Google Calendar Integration

Defined in `src/lib/google-calendar.ts`. Currently stub functions only — the actual OAuth and Google Calendar API integration is not yet implemented.

Types:
- `MealTimes` — HH:mm strings for each meal type
- `SyncedEvent` — Tracks synced calendar events with Google event IDs
- `SyncResult` — Reports created/updated/deleted counts after a sync

---

## Data Relationships

```
User
  -> PantryItem[] (what's at home)
  -> Recipe[] (created or from API)
  -> Bookmarks (recipe IDs, prep IDs)
  -> MealPlanEntry[] (weekly schedule, references recipes)
  -> MealTimes (preferred meal times)
  -> GoogleCalendarSync (connection status)
  -> Settings (diet, allergies, macros, notifications, privacy, billing)
```

Pantry items connect to recipes through ingredient matching — this enables "Can Cook Now" and "Smart Suggestion" features. Meal plan entries reference recipes by ID, allowing macro calculations to scale with custom serving sizes.

---

## Future Backend Plan

- **Database:** PostgreSQL via Supabase
- **Caching:** Redis
- **Recipe API:** Spoonacular for importing external recipes
- **Auth:** Supabase Auth (email, Google, Apple)
- **Location:** PostGIS extension for the Store marketplace feature
- **Measurement:** Support for both metric (g, kg, ml, L) and imperial (oz, lb, cups)
