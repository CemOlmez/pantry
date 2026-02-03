/* ------------------------------------------------------------------ */
/*  Recipe Types                                                       */
/* ------------------------------------------------------------------ */

export type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Ingredient = {
  name: string;
  quantity: number;
  unit: string;
  inPantry?: boolean;
};

export type Instruction = {
  step: number;
  text: string;
  image?: string;
};

export type Author = {
  id: string;
  name: string;
  avatar?: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  image?: string;
  placeholderType?: "soup" | "salad" | "pasta" | "meat" | "dessert" | "breakfast" | "asian" | "mexican";
  author: Author;
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "easy" | "medium" | "hard";
  ingredients: Ingredient[];
  instructions: Instruction[];
  nutrition: Macros;
  mealType: MealType[];
  cuisine: Cuisine;
  dietaryTags: DietaryTag[];
  rating: number;
  reviewCount: number;
  isPublished: boolean;
  isFavorite?: boolean;
  isOwned?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "dessert";

export type Cuisine =
  | "italian"
  | "mexican"
  | "asian"
  | "mediterranean"
  | "american"
  | "indian"
  | "french"
  | "other";

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "low-carb";

export type TimeFilter = "under15" | "15to30" | "30to60" | "over60";

export type DifficultyFilter = "easy" | "medium" | "hard";

export type RecipeFilterState = {
  search: string;
  canCookNow: boolean;
  mealType: MealType | null;
  cuisine: Cuisine | null;
  time: TimeFilter | null;
  difficulty: DifficultyFilter | null;
  dietary: DietaryTag[];
};

export type RecipeTab = "discover" | "favorites" | "my-recipes";
