"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  ChevronDown,
  X,
  Milk,
  Apple,
  Carrot,
  CupSoda,
  Wheat,
  Cookie,
  Package,
  Droplets,
  Flame,
  Fish,
  Beef,
  Snowflake,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  per: string; // e.g. "100g", "1 piece", "250ml"
};

type PantryItem = {
  id: string;
  name: string;
  quantity?: number;
  unit?: string;
  expiry?: string;
  addedAt: string; // ISO date
  macros?: Macros;
};

type Category = {
  key: string;
  label: string;
  icon: React.ElementType;
  color: string; // accent color
  items: PantryItem[];
};

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const UNITS = ["pieces", "g", "kg", "ml", "L", "packs", "cans", "bottles"];

function id() {
  return Math.random().toString(36).slice(2, 9);
}

const todayISO = new Date().toISOString().split("T")[0];

function mockItem(name: string, quantity?: number, unit?: string, expiryDays?: number): PantryItem {
  return {
    id: id(),
    name,
    quantity,
    unit,
    expiry: expiryDays != null ? daysFromNow(expiryDays) : undefined,
    addedAt: todayISO,
    macros: nutritionDB[name],
  };
}

const today = new Date();
const daysFromNow = (d: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
};

/* ------------------------------------------------------------------ */
/*  Common items per category (for autocomplete)                       */
/* ------------------------------------------------------------------ */

const categorySuggestions: Record<string, string[]> = {
  dairy: ["Whole Milk", "Skim Milk", "Oat Milk", "Almond Milk", "Greek Yogurt", "Plain Yogurt", "Butter", "Cream Cheese", "Cheddar Cheese", "Mozzarella", "Parmesan", "Feta Cheese", "Eggs", "Egg Whites", "Heavy Cream", "Sour Cream", "Cottage Cheese", "Brie", "Gouda", "Swiss Cheese", "Ricotta", "Whipped Cream"],
  fruits: ["Apples", "Bananas", "Oranges", "Strawberries", "Blueberries", "Raspberries", "Grapes", "Watermelon", "Mango", "Pineapple", "Peaches", "Pears", "Cherries", "Kiwi", "Lemons", "Limes", "Avocado", "Pomegranate", "Plums", "Grapefruit", "Coconut", "Figs", "Dates", "Passion Fruit", "Papaya"],
  vegetables: ["Tomatoes", "Onions", "Garlic", "Potatoes", "Carrots", "Broccoli", "Spinach", "Lettuce", "Cucumber", "Bell Peppers", "Zucchini", "Mushrooms", "Celery", "Corn", "Green Beans", "Peas", "Cauliflower", "Eggplant", "Asparagus", "Kale", "Cabbage", "Sweet Potato", "Beets", "Radishes", "Artichoke", "Leeks", "Brussels Sprouts"],
  beverages: ["Orange Juice", "Apple Juice", "Sparkling Water", "Coconut Water", "Lemonade", "Iced Tea", "Kombucha", "Almond Milk", "Cranberry Juice", "Grape Juice", "Ginger Beer", "Tonic Water", "Cola", "Energy Drink", "Smoothie"],
  grains: ["Sourdough Bread", "White Bread", "Whole Wheat Bread", "Basmati Rice", "Brown Rice", "Jasmine Rice", "Pasta", "Spaghetti", "Penne", "Fusilli", "Oats", "Quinoa", "Couscous", "Flour", "Cornmeal", "Tortillas", "Pita Bread", "Bagels", "Croissants", "Naan", "Rice Noodles"],
  snacks: ["Mixed Nuts", "Almonds", "Cashews", "Walnuts", "Peanuts", "Trail Mix", "Dark Chocolate", "Milk Chocolate", "Granola Bars", "Popcorn", "Chips", "Crackers", "Pretzels", "Dried Fruit", "Rice Cakes", "Peanut Butter Cups", "Cookies", "Protein Bars"],
  canned: ["Chickpeas", "Black Beans", "Kidney Beans", "Lentils", "Diced Tomatoes", "Tomato Paste", "Tomato Sauce", "Coconut Milk", "Tuna", "Salmon", "Sardines", "Corn", "Green Beans", "Peas", "Pumpkin Puree", "Artichoke Hearts", "Olives", "Baked Beans"],
  oils: ["Olive Oil", "Vegetable Oil", "Coconut Oil", "Sesame Oil", "Avocado Oil", "Soy Sauce", "Vinegar", "Balsamic Vinegar", "Hot Sauce", "Ketchup", "Mustard", "Mayonnaise", "BBQ Sauce", "Worcestershire Sauce", "Fish Sauce", "Sriracha", "Ranch Dressing", "Honey", "Maple Syrup", "Tahini"],
  spices: ["Salt", "Black Pepper", "Cumin", "Paprika", "Garlic Powder", "Onion Powder", "Chili Powder", "Oregano", "Basil", "Thyme", "Rosemary", "Cinnamon", "Turmeric", "Ginger", "Cayenne Pepper", "Nutmeg", "Coriander", "Bay Leaves", "Dill", "Parsley", "Italian Seasoning", "Curry Powder", "Smoked Paprika"],
  fish: ["Salmon Fillet", "Tuna Steak", "Shrimp", "Cod", "Tilapia", "Sea Bass", "Trout", "Halibut", "Swordfish", "Mahi Mahi", "Crab", "Lobster", "Mussels", "Clams", "Scallops", "Calamari", "Anchovies", "Sardines", "Prawns", "Oysters"],
  meat: ["Chicken Breast", "Chicken Thighs", "Ground Beef", "Beef Steak", "Pork Chops", "Ground Turkey", "Turkey Breast", "Lamb Chops", "Bacon", "Ham", "Sausage", "Salami", "Prosciutto", "Beef Ribs", "Pork Tenderloin", "Ground Pork", "Veal", "Duck Breast", "Chorizo", "Pepperoni"],
  frozen: ["Frozen Peas", "Frozen Corn", "Frozen Berries", "Frozen Spinach", "Frozen Broccoli", "Ice Cream", "Frozen Pizza", "Frozen Fries", "Frozen Waffles", "Frozen Fish Sticks", "Frozen Dumplings", "Frozen Edamame", "Frozen Mango", "Frozen Shrimp", "Frozen Chicken Nuggets", "Frozen Burritos", "Sorbet", "Frozen Vegetables Mix"],
};

/* ------------------------------------------------------------------ */
/*  Default expiry days per category                                   */
/* ------------------------------------------------------------------ */

const defaultExpiryDays: Record<string, number> = {
  dairy: 10,       // Milk ~7-10d, yogurt ~14d, eggs ~21d
  fruits: 7,       // Most fresh fruit 5-10 days
  vegetables: 7,   // Leafy greens ~5d, others ~7-10d
  beverages: 14,   // Juice ~7-14d, opened bottles ~14d
  grains: 5,       // Bread ~5-7d (dry goods last longer)
  snacks: 90,      // Nuts, chocolate, dry goods
  canned: 365,     // 1-2 years unopened
  oils: 180,       // 6-12 months
  spices: 365,     // 1-2 years
  fish: 2,         // Very perishable, 1-3 days
  meat: 3,         // Raw meat 2-4 days
  frozen: 180,     // 3-6 months frozen
};

function getDefaultExpiry(categoryKey: string): string {
  const days = defaultExpiryDays[categoryKey] ?? 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function formatRemainingTime(expiry: string): string {
  const diff = new Date(expiry).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  if (days < 7) return `${days} days`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week" : `${weeks} weeks`;
  }
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year" : `${years} years`;
}

/* ------------------------------------------------------------------ */
/*  Nutrition database (macros per common items)                       */
/* ------------------------------------------------------------------ */

const nutritionDB: Record<string, Macros> = {
  // Dairy & Eggs
  "Whole Milk": { calories: 149, protein: 8, carbs: 12, fat: 8, per: "250ml" },
  "Skim Milk": { calories: 83, protein: 8, carbs: 12, fat: 0.2, per: "250ml" },
  "Oat Milk": { calories: 120, protein: 3, carbs: 16, fat: 5, per: "250ml" },
  "Almond Milk": { calories: 39, protein: 1, carbs: 3.4, fat: 2.5, per: "250ml" },
  "Greek Yogurt": { calories: 100, protein: 17, carbs: 6, fat: 0.7, per: "170g" },
  "Plain Yogurt": { calories: 61, protein: 3.5, carbs: 4.7, fat: 3.3, per: "100g" },
  "Butter": { calories: 102, protein: 0.1, carbs: 0, fat: 11.5, per: "1 tbsp" },
  "Cream Cheese": { calories: 99, protein: 1.7, carbs: 1.6, fat: 9.8, per: "1 oz" },
  "Cheddar Cheese": { calories: 113, protein: 7, carbs: 0.4, fat: 9.3, per: "1 slice (28g)" },
  "Cheddar": { calories: 113, protein: 7, carbs: 0.4, fat: 9.3, per: "1 slice (28g)" },
  "Mozzarella": { calories: 85, protein: 6.3, carbs: 0.7, fat: 6.3, per: "1 slice (28g)" },
  "Parmesan": { calories: 110, protein: 10, carbs: 0.9, fat: 7.3, per: "28g" },
  "Feta Cheese": { calories: 75, protein: 4, carbs: 1.1, fat: 6, per: "28g" },
  "Eggs": { calories: 72, protein: 6.3, carbs: 0.4, fat: 4.8, per: "1 large egg" },
  "Heavy Cream": { calories: 51, protein: 0.4, carbs: 0.4, fat: 5.4, per: "1 tbsp" },
  "Sour Cream": { calories: 23, protein: 0.3, carbs: 0.5, fat: 2.4, per: "1 tbsp" },
  "Cottage Cheese": { calories: 98, protein: 11, carbs: 3.4, fat: 4.3, per: "100g" },
  // Fruits
  "Apples": { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, per: "1 medium" },
  "Bananas": { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, per: "1 medium" },
  "Oranges": { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, per: "1 medium" },
  "Strawberries": { calories: 49, protein: 1, carbs: 12, fat: 0.5, per: "1 cup (150g)" },
  "Blueberries": { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, per: "1 cup (148g)" },
  "Raspberries": { calories: 64, protein: 1.5, carbs: 15, fat: 0.8, per: "1 cup (123g)" },
  "Grapes": { calories: 104, protein: 1.1, carbs: 27, fat: 0.2, per: "1 cup (151g)" },
  "Mango": { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, per: "1 cup (165g)" },
  "Pineapple": { calories: 82, protein: 0.9, carbs: 22, fat: 0.2, per: "1 cup (165g)" },
  "Avocado": { calories: 240, protein: 3, carbs: 13, fat: 22, per: "1 medium" },
  "Lemons": { calories: 17, protein: 0.6, carbs: 5.4, fat: 0.2, per: "1 medium" },
  "Watermelon": { calories: 46, protein: 0.9, carbs: 11.5, fat: 0.2, per: "1 cup (152g)" },
  "Peaches": { calories: 59, protein: 1.4, carbs: 14, fat: 0.4, per: "1 medium" },
  "Cherries": { calories: 87, protein: 1.5, carbs: 22, fat: 0.3, per: "1 cup (138g)" },
  "Kiwi": { calories: 42, protein: 0.8, carbs: 10, fat: 0.4, per: "1 medium" },
  // Vegetables
  "Tomatoes": { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, per: "1 medium" },
  "Onions": { calories: 44, protein: 1.2, carbs: 10, fat: 0.1, per: "1 medium" },
  "Garlic": { calories: 4, protein: 0.2, carbs: 1, fat: 0, per: "1 clove" },
  "Potatoes": { calories: 163, protein: 4.3, carbs: 37, fat: 0.2, per: "1 medium" },
  "Carrots": { calories: 25, protein: 0.6, carbs: 6, fat: 0.1, per: "1 medium" },
  "Broccoli": { calories: 31, protein: 2.6, carbs: 6, fat: 0.3, per: "1 cup (91g)" },
  "Spinach": { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, per: "1 cup (30g)" },
  "Lettuce": { calories: 5, protein: 0.5, carbs: 1, fat: 0.1, per: "1 cup (36g)" },
  "Cucumber": { calories: 16, protein: 0.7, carbs: 3.6, fat: 0.1, per: "1 cup (104g)" },
  "Bell Peppers": { calories: 31, protein: 1, carbs: 6, fat: 0.3, per: "1 medium" },
  "Mushrooms": { calories: 15, protein: 2.2, carbs: 2.3, fat: 0.2, per: "1 cup (70g)" },
  "Sweet Potato": { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, per: "1 medium" },
  // Beverages
  "Orange Juice": { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, per: "250ml" },
  "OJ": { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, per: "250ml" },
  "Apple Juice": { calories: 114, protein: 0.3, carbs: 28, fat: 0.3, per: "250ml" },
  "Sparkling Water": { calories: 0, protein: 0, carbs: 0, fat: 0, per: "250ml" },
  "Coconut Water": { calories: 46, protein: 1.7, carbs: 9, fat: 0.5, per: "250ml" },
  // Grains & Bread
  "Sourdough Bread": { calories: 120, protein: 4, carbs: 24, fat: 0.6, per: "1 slice" },
  "White Bread": { calories: 79, protein: 2.7, carbs: 15, fat: 1, per: "1 slice" },
  "Whole Wheat Bread": { calories: 81, protein: 4, carbs: 14, fat: 1.1, per: "1 slice" },
  "Basmati Rice": { calories: 210, protein: 4.4, carbs: 46, fat: 0.5, per: "1 cup cooked" },
  "Brown Rice": { calories: 216, protein: 5, carbs: 45, fat: 1.8, per: "1 cup cooked" },
  "Pasta": { calories: 220, protein: 8.1, carbs: 43, fat: 1.3, per: "1 cup cooked" },
  "Oats": { calories: 154, protein: 5.3, carbs: 27, fat: 2.6, per: "1/2 cup dry" },
  "Quinoa": { calories: 222, protein: 8.1, carbs: 39, fat: 3.6, per: "1 cup cooked" },
  "Tortillas": { calories: 140, protein: 3.6, carbs: 24, fat: 3.5, per: "1 large" },
  // Snacks
  "Mixed Nuts": { calories: 172, protein: 5, carbs: 7, fat: 15, per: "28g" },
  "Almonds": { calories: 164, protein: 6, carbs: 6, fat: 14, per: "28g (23 almonds)" },
  "Dark Chocolate": { calories: 170, protein: 2.2, carbs: 13, fat: 12, per: "28g" },
  "Granola Bars": { calories: 140, protein: 3, carbs: 24, fat: 5, per: "1 bar" },
  "Popcorn": { calories: 31, protein: 1, carbs: 6.2, fat: 0.4, per: "1 cup popped" },
  // Canned Goods
  "Chickpeas": { calories: 210, protein: 11, carbs: 35, fat: 3.8, per: "1 cup (164g)" },
  "Black Beans": { calories: 227, protein: 15, carbs: 41, fat: 0.9, per: "1 cup" },
  "Diced Tomatoes": { calories: 41, protein: 2, carbs: 9, fat: 0.3, per: "1 cup (240g)" },
  "Tuna": { calories: 90, protein: 20, carbs: 0, fat: 1, per: "1 can (85g)" },
  "Coconut Milk": { calories: 445, protein: 4.6, carbs: 6.4, fat: 48, per: "1 cup (240ml)" },
  // Oils & Sauces
  "Olive Oil": { calories: 119, protein: 0, carbs: 0, fat: 13.5, per: "1 tbsp" },
  "Soy Sauce": { calories: 8.5, protein: 1.3, carbs: 0.8, fat: 0, per: "1 tbsp" },
  "Honey": { calories: 64, protein: 0.1, carbs: 17, fat: 0, per: "1 tbsp" },
  "Ketchup": { calories: 20, protein: 0.2, carbs: 5, fat: 0, per: "1 tbsp" },
  "Mustard": { calories: 3, protein: 0.2, carbs: 0.3, fat: 0.2, per: "1 tsp" },
  "Mayonnaise": { calories: 94, protein: 0.1, carbs: 0.1, fat: 10, per: "1 tbsp" },
  "Sriracha": { calories: 5, protein: 0.1, carbs: 1, fat: 0.1, per: "1 tsp" },
  // Spices (per 1 tsp)
  "Black Pepper": { calories: 6, protein: 0.2, carbs: 1.5, fat: 0.1, per: "1 tsp" },
  "Cumin": { calories: 8, protein: 0.4, carbs: 0.9, fat: 0.5, per: "1 tsp" },
  "Paprika": { calories: 6, protein: 0.3, carbs: 1.2, fat: 0.3, per: "1 tsp" },
  "Garlic Powder": { calories: 10, protein: 0.5, carbs: 2.3, fat: 0, per: "1 tsp" },
  "Cinnamon": { calories: 6, protein: 0.1, carbs: 2.1, fat: 0, per: "1 tsp" },
  "Turmeric": { calories: 8, protein: 0.3, carbs: 1.4, fat: 0.2, per: "1 tsp" },
  // Fish & Seafood
  "Salmon Fillet": { calories: 208, protein: 20, carbs: 0, fat: 13, per: "100g" },
  "Salmon": { calories: 208, protein: 20, carbs: 0, fat: 13, per: "100g" },
  "Shrimp": { calories: 85, protein: 20, carbs: 0.2, fat: 0.5, per: "100g" },
  "Cod": { calories: 82, protein: 18, carbs: 0, fat: 0.7, per: "100g" },
  "Tuna Steak": { calories: 132, protein: 28, carbs: 0, fat: 1.3, per: "100g" },
  "Tilapia": { calories: 96, protein: 20, carbs: 0, fat: 1.7, per: "100g" },
  // Meat & Poultry
  "Chicken Breast": { calories: 165, protein: 31, carbs: 0, fat: 3.6, per: "100g" },
  "Chicken": { calories: 165, protein: 31, carbs: 0, fat: 3.6, per: "100g" },
  "Chicken Thighs": { calories: 209, protein: 26, carbs: 0, fat: 11, per: "100g" },
  "Ground Beef": { calories: 254, protein: 17, carbs: 0, fat: 20, per: "100g" },
  "Beef Steak": { calories: 271, protein: 26, carbs: 0, fat: 18, per: "100g" },
  "Turkey Breast": { calories: 104, protein: 24, carbs: 0, fat: 0.7, per: "100g" },
  "Turkey Slices": { calories: 104, protein: 24, carbs: 0, fat: 0.7, per: "100g" },
  "Ground Turkey": { calories: 170, protein: 21, carbs: 0, fat: 9.4, per: "100g" },
  "Bacon": { calories: 541, protein: 37, carbs: 1.4, fat: 42, per: "100g" },
  "Pork Chops": { calories: 231, protein: 25, carbs: 0, fat: 14, per: "100g" },
  "Lamb Chops": { calories: 282, protein: 25, carbs: 0, fat: 20, per: "100g" },
  // Frozen
  "Frozen Peas": { calories: 62, protein: 4.1, carbs: 11, fat: 0.3, per: "1/2 cup (80g)" },
  "Frozen Berries": { calories: 48, protein: 0.6, carbs: 12, fat: 0.3, per: "1/2 cup (75g)" },
  "Frozen Corn": { calories: 66, protein: 2.3, carbs: 16, fat: 0.5, per: "1/2 cup (82g)" },
  "Ice Cream": { calories: 207, protein: 3.5, carbs: 24, fat: 11, per: "1/2 cup (66g)" },
  "Frozen Pizza": { calories: 280, protein: 12, carbs: 34, fat: 11, per: "1 slice" },
};

const initialCategories: Category[] = [
  {
    key: "dairy",
    label: "Dairy & Eggs",
    icon: Milk,
    color: "#4A90D9",
    items: [
      mockItem("Whole Milk", 1, "L", 5),
      mockItem("Greek Yogurt", 3, "pieces", 2),
      mockItem("Eggs", 12, "pieces", 10),
      mockItem("Cheddar Cheese", 200, "g", 14),
    ],
  },
  {
    key: "fruits",
    label: "Fruits",
    icon: Apple,
    color: "#E25B45",
    items: [
      mockItem("Bananas", 6, "pieces", 3),
      mockItem("Apples", 4, "pieces", 7),
      mockItem("Blueberries", 150, "g", 1),
    ],
  },
  {
    key: "vegetables",
    label: "Vegetables",
    icon: Carrot,
    color: "#5B8C3E",
    items: [
      mockItem("Spinach", 200, "g", 2),
      mockItem("Tomatoes", 5, "pieces", 4),
      mockItem("Onions", 3, "pieces", 20),
    ],
  },
  {
    key: "beverages",
    label: "Beverages",
    icon: CupSoda,
    color: "#7C5CBF",
    items: [
      mockItem("Orange Juice", 1, "L", 6),
      mockItem("Sparkling Water", 6, "bottles"),
    ],
  },
  {
    key: "grains",
    label: "Grains & Bread",
    icon: Wheat,
    color: "#D4A03E",
    items: [
      mockItem("Sourdough Bread", 1, "pieces", 2),
      mockItem("Basmati Rice", 1, "kg"),
      mockItem("Pasta", 500, "g"),
    ],
  },
  {
    key: "snacks",
    label: "Snacks",
    icon: Cookie,
    color: "#E8913A",
    items: [
      mockItem("Mixed Nuts", 300, "g"),
      mockItem("Dark Chocolate", 2, "pieces", 60),
    ],
  },
  {
    key: "canned",
    label: "Canned Goods",
    icon: Package,
    color: "#8B7355",
    items: [
      mockItem("Chickpeas", 3, "cans"),
      mockItem("Diced Tomatoes", 2, "cans"),
    ],
  },
  {
    key: "oils",
    label: "Oils & Sauces",
    icon: Droplets,
    color: "#C4A35A",
    items: [
      mockItem("Olive Oil", 500, "ml"),
      mockItem("Soy Sauce", 250, "ml"),
    ],
  },
  {
    key: "spices",
    label: "Spices & Condiments",
    icon: Flame,
    color: "#D4573E",
    items: [
      mockItem("Black Pepper"),
      mockItem("Cumin"),
      mockItem("Paprika"),
      mockItem("Garlic Powder"),
    ],
  },
  {
    key: "fish",
    label: "Fish & Seafood",
    icon: Fish,
    color: "#3D8B99",
    items: [
      mockItem("Salmon Fillet", 400, "g", 1),
      mockItem("Shrimp", 300, "g", 2),
    ],
  },
  {
    key: "meat",
    label: "Meat & Poultry",
    icon: Beef,
    color: "#B5444B",
    items: [
      mockItem("Chicken Breast", 500, "g", 2),
      mockItem("Ground Beef", 400, "g", 1),
      mockItem("Turkey Slices", 200, "g", 4),
    ],
  },
  {
    key: "frozen",
    label: "Frozen",
    icon: Snowflake,
    color: "#6BA3D6",
    items: [
      mockItem("Frozen Peas", 500, "g"),
      mockItem("Ice Cream", 1, "L"),
      mockItem("Frozen Berries", 400, "g"),
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Expiry helpers                                                     */
/* ------------------------------------------------------------------ */

function daysUntilExpiry(expiry?: string): number | null {
  if (!expiry) return null;
  const diff = new Date(expiry).getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function expiryStatus(expiry?: string): "fresh" | "soon" | "expired" | null {
  const days = daysUntilExpiry(expiry);
  if (days === null) return null;
  if (days <= 0) return "expired";
  if (days <= 3) return "soon";
  return "fresh";
}

const expiryDotColor = {
  fresh: "bg-green-500",
  soon: "bg-orange-400",
  expired: "bg-red-500",
};

const expiryChipBg = {
  fresh: "",
  soon: "bg-orange-50 dark:bg-orange-950/20",
  expired: "bg-red-50 dark:bg-red-950/20",
};

/* ------------------------------------------------------------------ */
/*  Item Chip                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Details Step with Autocomplete                                     */
/* ------------------------------------------------------------------ */

function DetailsStep({
  selected,
  name,
  setName,
  quantity,
  setQuantity,
  unit,
  setUnit,
  expiry,
  setExpiry,
  nameRef,
  onSubmit,
  onAddAnother,
  existingItems,
}: {
  selected: Category;
  name: string;
  setName: (v: string) => void;
  quantity: string;
  setQuantity: (v: string) => void;
  unit: string;
  setUnit: (v: string) => void;
  expiry: string;
  setExpiry: (v: string) => void;
  nameRef: React.RefObject<HTMLInputElement | null>;
  onSubmit: () => void;
  onAddAnother: () => void;
  existingItems: PantryItem[];
}) {
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Auto-set expiry when entering this step if empty
  useEffect(() => {
    if (!expiry) {
      setExpiry(getDefaultExpiry(selected.key));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.key]);

  const suggestions = categorySuggestions[selected.key] ?? [];
  const existingNames = new Set(existingItems.map((i) => i.name.toLowerCase()));

  const filtered = name.trim()
    ? suggestions.filter(
        (s) =>
          s.toLowerCase().includes(name.toLowerCase()) &&
          !existingNames.has(s.toLowerCase())
      )
    : suggestions.filter((s) => !existingNames.has(s.toLowerCase()));

  const visibleSuggestions = showSuggestions && name.trim()
    ? filtered.slice(0, 8)
    : [];

  function selectSuggestion(suggestion: string) {
    setName(suggestion);
    setShowSuggestions(false);
    setHighlightIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || visibleSuggestions.length === 0) {
      if (e.key === "Enter") onSubmit();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < visibleSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : visibleSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < visibleSuggestions.length) {
        selectSuggestion(visibleSuggestions[highlightIndex]);
      } else {
        onSubmit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  const Icon = selected.icon;

  return (
    <div className="p-5 space-y-4">
      {/* Category indicator */}
      <div className="flex items-center gap-2">
        <Icon size={14} style={{ color: selected.color }} />
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">{selected.label}</span>
      </div>

      {/* Name search with autocomplete */}
      <div className="relative">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setShowSuggestions(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${selected.label.toLowerCase()}...`}
            className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] pl-9 pr-8 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
          {name && (
            <button
              onClick={() => { setName(""); setShowSuggestions(true); setHighlightIndex(-1); nameRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && visibleSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 left-0 right-0 mt-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg overflow-hidden max-h-56 overflow-y-auto"
          >
            {visibleSuggestions.map((suggestion, i) => (
              <button
                key={suggestion}
                onClick={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setHighlightIndex(i)}
                className={cn(
                  "flex items-center gap-2 w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors",
                  i === highlightIndex
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]"
                )}
              >
                <Plus size={12} className="shrink-0 text-[var(--color-text-tertiary)]" />
                {name.trim() ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: suggestion.replace(
                        new RegExp(`(${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
                        `<span class="font-semibold" style="color: var(--color-primary)">$1</span>`
                      ),
                    }}
                  />
                ) : (
                  suggestion
                )}
              </button>
            ))}
            {filtered.length > 8 && (
              <div className="px-3 py-1.5 text-xs text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
                {name.trim() ? `+${filtered.length - 8} more` : `Showing 8 of ${filtered.length}`}
              </div>
            )}
            {name.trim() && filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-[var(--color-text-secondary)]">
                No matches — press Enter to add &quot;{name}&quot;
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quantity + Unit */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Optional"
            className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5 text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:border-[var(--color-primary)] transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">Unit</label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5 text-[var(--color-text)] outline-none cursor-pointer focus:border-[var(--color-primary)] transition-colors"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Expiry */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-[var(--color-text-secondary)]">Expiry date</label>
          {expiry && (
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              (() => {
                const d = Math.ceil((new Date(expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                if (d <= 0) return "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400";
                if (d <= 3) return "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400";
                return "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400";
              })()
            )}>
              {formatRemainingTime(expiry)}
            </span>
          )}
        </div>
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-3 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
          Default: {defaultExpiryDays[selected.key]} days for {selected.label.toLowerCase()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onAddAnother}
          disabled={!name.trim()}
          className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] disabled:opacity-40 cursor-pointer transition-colors"
        >
          Add & add another
        </button>
        <button
          onClick={onSubmit}
          disabled={!name.trim()}
          className="flex-1 text-sm font-medium px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-amber-500 text-white shadow-sm disabled:opacity-40 cursor-pointer transition-opacity"
        >
          Add item
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Add Item Modal (multi-step)                                        */
/* ------------------------------------------------------------------ */

function AddItemModal({
  categories,
  onAdd,
  onClose,
}: {
  categories: Category[];
  onAdd: (categoryKey: string, item: PantryItem) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"category" | "details">("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [expiry, setExpiry] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step === "details") {
      nameRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function selectCategory(key: string) {
    setSelectedCategory(key);
    setStep("details");
  }

  function buildItem(): PantryItem {
    const trimmed = name.trim();
    return {
      id: id(),
      name: trimmed,
      quantity: quantity ? Number(quantity) : undefined,
      unit: quantity ? unit : undefined,
      expiry: expiry || undefined,
      addedAt: todayISO,
      macros: nutritionDB[trimmed],
    };
  }

  function submit() {
    if (!name.trim() || !selectedCategory) return;
    onAdd(selectedCategory, buildItem());
    setName("");
    setQuantity("");
    setUnit("pieces");
    setExpiry("");
    setStep("category");
    setSelectedCategory(null);
  }

  function handleAddAnother() {
    if (!name.trim() || !selectedCategory) return;
    onAdd(selectedCategory, buildItem());
    setName("");
    setQuantity("");
    setExpiry("");
    nameRef.current?.focus();
  }

  const selected = categories.find((c) => c.key === selectedCategory);

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[var(--color-surface)] shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[var(--color-bg-tertiary)]" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-0">
          <div className="flex items-center gap-2">
            {step === "details" && (
              <button
                onClick={() => { setStep("category"); setSelectedCategory(null); }}
                className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
              >
                <ChevronDown size={16} className="rotate-90" />
              </button>
            )}
            <h2 className="text-base font-semibold text-[var(--color-text)]">
              {step === "category" ? "Add Item" : `Add to ${selected?.label}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />

        {/* Step 1: Pick category */}
        {step === "category" && (
          <div className="p-3 grid grid-cols-2 gap-2 max-h-[60vh] overflow-y-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => selectCategory(cat.key)}
                  className="flex items-center gap-3 rounded-xl px-3.5 py-3.5 text-left border border-[var(--color-border)] hover:bg-[var(--color-bg-secondary)] hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  <div
                    className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
                    style={{ backgroundColor: cat.color + "15" }}
                  >
                    <Icon size={16} style={{ color: cat.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text)] truncate">{cat.label}</p>
                    <p className="text-xs text-[var(--color-text-tertiary)]">{cat.items.length} items</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Item details */}
        {step === "details" && selected && (
          <DetailsStep
            selected={selected}
            name={name}
            setName={setName}
            quantity={quantity}
            setQuantity={setQuantity}
            unit={unit}
            setUnit={setUnit}
            expiry={expiry}
            setExpiry={setExpiry}
            nameRef={nameRef}
            onSubmit={submit}
            onAddAnother={handleAddAnother}
            existingItems={selected.items}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Item Row                                                            */
/* ------------------------------------------------------------------ */

function ItemRow({
  item,
  categoryColor,
  onEdit,
  onDelete,
}: {
  item: PantryItem;
  categoryColor: string;
  onEdit: (item: PantryItem) => void;
  onDelete: (id: string) => void;
}) {
  const status = expiryStatus(item.expiry);

  const macros = item.macros;

  return (
    <button
      onClick={() => onEdit(item)}
      className="group/row w-full text-left rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3.5 hover:bg-[var(--color-bg-tertiary)] hover:shadow-sm hover:-translate-y-[1px] transition-all duration-150 cursor-pointer"
    >
      {/* Top: name + expiry + delete */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: categoryColor }} />
        <p className="text-sm font-semibold text-[var(--color-text)] truncate flex-1">{item.name}</p>
        {item.expiry && (
          <span className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full shrink-0",
            status === "expired"
              ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400"
              : status === "soon"
                ? "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                : "bg-[var(--color-surface)] text-[var(--color-text-tertiary)]"
          )}>
            {formatRemainingTime(item.expiry)}
          </span>
        )}
        <span
          onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
          className="opacity-0 group-hover/row:opacity-100 transition-opacity text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-red-50 dark:hover:bg-red-950/30 p-1 rounded-lg shrink-0"
        >
          <X size={13} />
        </span>
      </div>

      {/* Bottom: info chips */}
      <div className="flex items-center gap-1.5 ml-[18px] flex-wrap">
        {item.quantity != null && item.unit && (
          <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-lg">
            {item.quantity} {item.unit}
          </span>
        )}
        {macros && (
          <>
            <span className="text-xs font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface)] border border-[var(--color-border)] px-2.5 py-1 rounded-lg tabular-nums">
              {macros.calories} cal
            </span>
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 px-2.5 py-1 rounded-lg tabular-nums">
              Protein {macros.protein}g
            </span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-2.5 py-1 rounded-lg tabular-nums">
              Carbs {macros.carbs}g
            </span>
            <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 px-2.5 py-1 rounded-lg tabular-nums">
              Fat {macros.fat}g
            </span>
          </>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick Add Input                                                    */
/* ------------------------------------------------------------------ */

function QuickAdd({
  onAdd,
  onClose,
}: {
  onAdd: (item: PantryItem) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("pieces");
  const [expiry, setExpiry] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function submit() {
    if (!name.trim()) return;
    const trimmed = name.trim();
    onAdd({
      id: id(),
      name: trimmed,
      quantity: quantity ? Number(quantity) : undefined,
      unit: quantity ? unit : undefined,
      expiry: expiry || undefined,
      addedAt: todayISO,
      macros: nutritionDB[trimmed],
    });
    setName("");
    setQuantity("");
    setUnit("pieces");
    setExpiry("");
    setExpanded(false);
    inputRef.current?.focus();
  }

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 space-y-2">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Item name..."
          className="flex-1 text-sm bg-transparent text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none"
        />
        <button
          onClick={submit}
          disabled={!name.trim()}
          className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--color-primary)] text-[var(--color-text-inverse)] disabled:opacity-40 cursor-pointer"
        >
          Add
        </button>
        <button
          onClick={onClose}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
      >
        {expanded ? "Less details" : "More details"}
      </button>

      {expanded && (
        <div className="flex flex-wrap gap-2">
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Qty"
            className="w-16 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2 py-1 text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2 py-1 text-[var(--color-text)] outline-none cursor-pointer"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-2 py-1 text-[var(--color-text)] outline-none"
          />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Item Detail Modal                                                   */
/* ------------------------------------------------------------------ */

function MacroBar({ label, value, color, unit: u }: { label: string; value: number; color: string; unit: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="text-xs text-[var(--color-text-secondary)] w-14 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-bg-tertiary)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${Math.min((value / 50) * 100, 100)}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-semibold text-[var(--color-text)] tabular-nums w-10 text-right">{value}{u}</span>
    </div>
  );
}

function ItemDetailModal({
  item,
  onSave,
  onDelete,
  onClose,
}: {
  item: PantryItem;
  onSave: (item: PantryItem) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [quantity, setQuantity] = useState(item.quantity?.toString() ?? "");
  const [unit, setUnit] = useState(item.unit ?? "pieces");
  const [expiry, setExpiry] = useState(item.expiry ?? "");
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const macros = item.macros;
  const status = expiryStatus(item.expiry);

  function save() {
    const trimmed = name.trim() || item.name;
    onSave({
      ...item,
      name: trimmed,
      quantity: quantity ? Number(quantity) : undefined,
      unit: quantity ? unit : undefined,
      expiry: expiry || undefined,
      macros: nutritionDB[trimmed] ?? item.macros,
    });
    setEditing(false);
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
    >
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl bg-[var(--color-surface)] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[var(--color-bg-tertiary)]" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 sm:pt-6 pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg font-bold text-[var(--color-text)] bg-transparent border-b-2 border-[var(--color-primary)] outline-none w-full pb-1"
                  autoFocus
                />
              ) : (
                <h2 className="text-lg font-bold text-[var(--color-text)]">{item.name}</h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                {item.quantity != null && item.unit && (
                  <span className="text-xs text-[var(--color-text-tertiary)]">
                    {item.quantity} {item.unit}
                  </span>
                )}
                {item.expiry && (
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    status === "expired"
                      ? "bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                      : status === "soon"
                        ? "bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                        : "bg-[var(--color-bg-secondary)] text-[var(--color-text-tertiary)]"
                  )}>
                    {status === "expired" ? "Expired" : `Expires ${formatRemainingTime(item.expiry)}`}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Nutrition */}
        {macros && !editing && (
          <div className="px-6 py-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">Nutrition</p>
                <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-surface)] px-2.5 py-1 rounded-full">per {macros.per}</span>
              </div>
              <div className="flex items-baseline gap-1.5 mb-5">
                <span className="text-3xl font-bold text-[var(--color-text)] tabular-nums">{macros.calories}</span>
                <span className="text-xs text-[var(--color-text-tertiary)]">kcal</span>
              </div>
              <div className="space-y-3">
                <MacroBar label="Protein" value={macros.protein} color="#3B82F6" unit="g" />
                <MacroBar label="Carbs" value={macros.carbs} color="#F59E0B" unit="g" />
                <MacroBar label="Fat" value={macros.fat} color="#EF4444" unit="g" />
              </div>
            </div>
          </div>
        )}

        {/* Details / Edit */}
        {/* Details / Edit */}
        <div className="px-6 py-3">
          {editing ? (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 space-y-3">
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1">Edit Details</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Quantity</label>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qty"
                    className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Unit</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)}
                    className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text)] outline-none cursor-pointer focus:border-[var(--color-primary)] transition-colors">
                    {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1">Expiry date</label>
                <input type="date" value={expiry} onChange={(e) => setExpiry(e.target.value)}
                  className="w-full text-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] transition-colors" />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5">
              <p className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3">Details</p>
              <div className="grid grid-cols-2 gap-4">
                {item.expiry && (
                  <div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">Expires</p>
                    <p className={cn(
                      "text-sm font-semibold",
                      status === "expired" ? "text-red-500" : status === "soon" ? "text-orange-500" : "text-[var(--color-text)]"
                    )}>
                      {formatRemainingTime(item.expiry)}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{item.expiry}</p>
                  </div>
                )}
                {item.addedAt && (
                  <div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">Added</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {formatRemainingTime(item.addedAt) === "Expired" ? "Today" : `${formatRemainingTime(item.addedAt)} ago`}
                    </p>
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">{item.addedAt}</p>
                  </div>
                )}
                {item.quantity != null && item.unit && (
                  <div>
                    <p className="text-xs text-[var(--color-text-tertiary)] mb-0.5">Quantity</p>
                    <p className="text-sm font-semibold text-[var(--color-text)]">{item.quantity} {item.unit}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[var(--color-border)]">
          <button
            onClick={() => { onDelete(item.id); onClose(); }}
            className="text-sm font-medium text-[var(--color-danger)] hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            Delete
          </button>
          <div className="flex-1" />
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="text-sm font-medium px-4 py-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] cursor-pointer transition-colors">Cancel</button>
              <button onClick={save} className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-amber-500 text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">Save</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-amber-500 text-white shadow-sm cursor-pointer hover:opacity-90 transition-opacity">Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shelf Card                                                         */
/* ------------------------------------------------------------------ */

function ShelfCard({
  category,
  onUpdate,
  searchQuery,
}: {
  category: Category;
  onUpdate: (cat: Category) => void;
  searchQuery: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState<PantryItem | null>(null);
  const Icon = category.icon;

  const filtered = searchQuery
    ? category.items.filter((i) =>
        i.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : category.items;

  if (searchQuery && filtered.length === 0) return null;

  const expiringCount = category.items.filter(
    (i) => expiryStatus(i.expiry) === "soon" || expiryStatus(i.expiry) === "expired"
  ).length;

  function updateItem(updated: PantryItem) {
    onUpdate({
      ...category,
      items: category.items.map((i) => (i.id === updated.id ? updated : i)),
    });
  }

  function deleteItem(itemId: string) {
    onUpdate({
      ...category,
      items: category.items.filter((i) => i.id !== itemId),
    });
  }

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Accent bar using category color */}
      <div className="h-1" style={{ background: `linear-gradient(to right, ${category.color}, ${category.color}88)` }} />
      {/* Shelf header */}
      <button
        className="flex items-center gap-3 w-full px-5 py-4 cursor-pointer select-none hover:bg-[var(--color-surface-hover)]/50 transition-colors"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-sm"
          style={{ backgroundColor: category.color + "15" }}
        >
          <Icon size={18} style={{ color: category.color }} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[15px] font-semibold text-[var(--color-text)]">{category.label}</p>
          <p className="text-xs text-[var(--color-text-tertiary)]">
            {category.items.length} item{category.items.length !== 1 ? "s" : ""}
            {expiringCount > 0 && (
              <span className="text-orange-500"> · {expiringCount} expiring</span>
            )}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={cn(
            "text-[var(--color-text-tertiary)] transition-transform duration-200 shrink-0",
            collapsed && "-rotate-90"
          )}
        />
      </button>

      {/* Shelf content */}
      {!collapsed && (
        <div className="border-t border-[var(--color-border)]">
          <div className="px-5 py-3 space-y-2">
            {filtered.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                categoryColor={category.color}
                onEdit={setEditing}
                onDelete={deleteItem}
              />
            ))}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Package size={20} className="text-[var(--color-text-tertiary)]" />
                <p className="text-xs text-[var(--color-text-tertiary)]">No items yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {editing && (
        <ItemDetailModal
          item={editing}
          onSave={updateItem}
          onDelete={deleteItem}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main PantryShelf                                                   */
/* ------------------------------------------------------------------ */

export function PantryShelf() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);
  const expiringItems = categories.reduce(
    (sum, c) =>
      sum +
      c.items.filter(
        (i) =>
          expiryStatus(i.expiry) === "soon" || expiryStatus(i.expiry) === "expired"
      ).length,
    0
  );
  const expiredItems = categories.reduce(
    (sum, c) => sum + c.items.filter((i) => expiryStatus(i.expiry) === "expired").length,
    0
  );
  const categoriesUsed = categories.filter((c) => c.items.length > 0).length;

  const visibleCategories = activeFilter
    ? categories.filter((c) => c.key === activeFilter)
    : categories;

  function updateCategory(updated: Category) {
    setCategories((prev) =>
      prev.map((c) => (c.key === updated.key ? updated : c))
    );
  }

  function addItemToCategory(categoryKey: string, item: PantryItem) {
    setCategories((prev) =>
      prev.map((c) =>
        c.key === categoryKey ? { ...c, items: [...c.items, item] } : c
      )
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl overflow-hidden relative bg-gradient-to-br from-[#E8913A] via-[#D47E2A] to-[#B5652A]">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />

        <div className="relative p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white">My Pantry</h1>
              <p className="text-xs text-white/70 mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""} across {categoriesUsed} categories
              </p>
            </div>
            <div className="relative hidden sm:block w-52">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-lg bg-white/15 backdrop-blur-sm border-none py-2 pl-8 pr-8 text-sm text-white placeholder:text-white/50 outline-none focus:ring-1 focus:ring-white/30 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 shrink-0 rounded-xl bg-white text-[#E8913A] px-4 py-2.5 text-sm font-medium cursor-pointer hover:bg-white/90 transition-opacity"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="relative sm:hidden shadow-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] py-2.5 pl-8 pr-8 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] outline-none focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)] hover:text-[var(--color-text)] cursor-pointer"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[var(--color-primary)] to-amber-400" />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 shrink-0">
                <Package size={18} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[var(--color-text)] tabular-nums">{totalItems}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Total items</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-orange-400 to-amber-400" />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/30 shrink-0">
                <AlertTriangle size={18} className="text-orange-500" />
              </div>
              <div>
                <p className={cn("text-xl font-bold tabular-nums", expiringItems > 0 ? "text-orange-500" : "text-[var(--color-text)]")}>{expiringItems}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Expiring soon</p>
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-red-400 to-orange-400" />
          <div className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/30 shrink-0">
                <X size={18} className="text-red-500" />
              </div>
              <div>
                <p className={cn("text-xl font-bold tabular-nums", expiredItems > 0 ? "text-red-500" : "text-[var(--color-text)]")}>{expiredItems}</p>
                <p className="text-xs text-[var(--color-text-tertiary)]">Expired</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "shrink-0 text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer",
              activeFilter === null
                ? "bg-gradient-to-r from-[var(--color-primary)] to-amber-500 text-[var(--color-text-inverse)] shadow-sm"
                : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
            )}
          >
            All ({totalItems})
          </button>
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            const isActive = activeFilter === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveFilter(isActive ? null : cat.key)}
                className={cn(
                  "shrink-0 flex items-center gap-1 text-xs font-medium px-3.5 py-2 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive
                    ? "text-[var(--color-text-inverse)] shadow-sm"
                    : "bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] border border-[var(--color-border)]"
                )}
                style={isActive ? { backgroundColor: cat.color } : undefined}
              >
                <CatIcon size={11} />
                {cat.label}
              </button>
            );
          })}
        </div>

      {/* Shelves */}
      <div className="space-y-3">
        {visibleCategories.map((cat) => (
          <ShelfCard
            key={cat.key}
            category={cat}
            onUpdate={updateCategory}
            searchQuery={search}
          />
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          categories={categories}
          onAdd={addItemToCategory}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
