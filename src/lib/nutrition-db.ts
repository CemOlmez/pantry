/* ------------------------------------------------------------------ */
/*  Shared Nutrition Database                                          */
/*  Macros per common pantry items                                     */
/* ------------------------------------------------------------------ */

export type NutritionMacros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  per: string; // e.g. "100g", "1 piece", "250ml"
};

export const nutritionDB: Record<string, NutritionMacros> = {
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
  // Additional items for meal preps
  "Tofu": { calories: 144, protein: 15, carbs: 3.5, fat: 8, per: "1/2 block (200g)" },
  "Lentils": { calories: 230, protein: 18, carbs: 40, fat: 0.8, per: "1 cup cooked" },
  "Sweet Potatoes": { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, per: "1 medium" },
  "Rice Noodles": { calories: 192, protein: 1.6, carbs: 44, fat: 0.4, per: "1 cup cooked" },
  "Peanut Butter": { calories: 188, protein: 8, carbs: 6, fat: 16, per: "2 tbsp" },
  "Protein Powder": { calories: 120, protein: 24, carbs: 3, fat: 1, per: "1 scoop (30g)" },
};
