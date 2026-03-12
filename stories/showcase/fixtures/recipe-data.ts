/**
 * Recipe Builder — fixture data
 * Step-by-step wizard, ingredient lists, timers, nutritional info
 */
import { users as briarUsers } from './briar-cove-users'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface Ingredient {
  id: string
  name: string
  amount: number
  unit: string
  optional: boolean
  category: IngredientCategory
}

export type IngredientCategory =
  | 'produce'
  | 'protein'
  | 'dairy'
  | 'pantry'
  | 'spice'
  | 'liquid'

export interface Step {
  id: string
  order: number
  title: string
  description: string
  duration: number // minutes — 0 = no timer
  tip: string | null
}

export interface Recipe {
  id: string
  title: string
  description: string
  author: (typeof briarUsers)[number]
  difficulty: 'easy' | 'medium' | 'hard'
  prepTime: number   // minutes
  cookTime: number   // minutes
  servings: number
  tags: string[]
  ingredients: Ingredient[]
  steps: Step[]
  nutrition: NutritionInfo
  rating: number     // 0-5
  imageIcon: string  // codicon
}

export interface NutritionInfo {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sodium: number
}

// ---------------------------------------------------------------------------
// Category config
// ---------------------------------------------------------------------------
export const categoryConfig: Record<
  IngredientCategory,
  { label: string; icon: string; color: string }
> = {
  produce: { label: 'Produce', icon: 'codicon:leaf', color: 'var(--color-success, #4caf50)' },
  protein: { label: 'Protein', icon: 'codicon:flame', color: 'var(--color-danger, #e53935)' },
  dairy: { label: 'Dairy', icon: 'codicon:circle-filled', color: 'var(--color-warning, #ffc107)' },
  pantry: { label: 'Pantry', icon: 'codicon:package', color: 'var(--color-primary, #6366f1)' },
  spice: { label: 'Spice', icon: 'codicon:sparkle', color: 'var(--color-warning, #ff9800)' },
  liquid: { label: 'Liquid', icon: 'codicon:drop', color: 'var(--color-info, #2196f3)' },
}

export const difficultyConfig: Record<
  'easy' | 'medium' | 'hard',
  { label: string; icon: string; variant: string }
> = {
  easy: { label: 'Easy', icon: 'codicon:check', variant: 'success' },
  medium: { label: 'Medium', icon: 'codicon:warning', variant: 'warning' },
  hard: { label: 'Hard', icon: 'codicon:flame', variant: 'danger' },
}

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------
export const recipes: Recipe[] = [
  {
    id: 'recipe-1',
    title: 'Herb-Crusted Salmon',
    description:
      'Pan-seared salmon fillets with a crispy herb crust, served with lemon-butter sauce. A weeknight favourite that looks restaurant-worthy.',
    author: briarUsers[2]!, // Theron Ashwood
    difficulty: 'medium',
    prepTime: 15,
    cookTime: 12,
    servings: 4,
    tags: ['seafood', 'dinner', 'gluten-free', 'high-protein'],
    rating: 4.7,
    imageIcon: 'codicon:beaker',
    nutrition: {
      calories: 420,
      protein: 38,
      carbs: 6,
      fat: 28,
      fiber: 1,
      sodium: 380,
    },
    ingredients: [
      { id: 'i-1', name: 'Salmon fillets', amount: 4, unit: 'pieces', optional: false, category: 'protein' },
      { id: 'i-2', name: 'Fresh dill', amount: 2, unit: 'tbsp', optional: false, category: 'produce' },
      { id: 'i-3', name: 'Fresh parsley', amount: 2, unit: 'tbsp', optional: false, category: 'produce' },
      { id: 'i-4', name: 'Garlic cloves', amount: 3, unit: 'pieces', optional: false, category: 'produce' },
      { id: 'i-5', name: 'Lemon', amount: 1, unit: 'whole', optional: false, category: 'produce' },
      { id: 'i-6', name: 'Olive oil', amount: 3, unit: 'tbsp', optional: false, category: 'liquid' },
      { id: 'i-7', name: 'Butter', amount: 2, unit: 'tbsp', optional: false, category: 'dairy' },
      { id: 'i-8', name: 'Panko breadcrumbs', amount: 0.5, unit: 'cup', optional: false, category: 'pantry' },
      { id: 'i-9', name: 'Dijon mustard', amount: 1, unit: 'tbsp', optional: false, category: 'pantry' },
      { id: 'i-10', name: 'Salt', amount: 1, unit: 'tsp', optional: false, category: 'spice' },
      { id: 'i-11', name: 'Black pepper', amount: 0.5, unit: 'tsp', optional: false, category: 'spice' },
      { id: 'i-12', name: 'Capers', amount: 1, unit: 'tbsp', optional: true, category: 'pantry' },
    ],
    steps: [
      {
        id: 's-1',
        order: 1,
        title: 'Prepare the herb crust',
        description:
          'Finely chop dill, parsley, and garlic. Mix with panko breadcrumbs, 1 tbsp olive oil, and a pinch of salt. Set aside.',
        duration: 5,
        tip: 'A food processor makes quick work of this — pulse until just combined, not pasty.',
      },
      {
        id: 's-2',
        order: 2,
        title: 'Season the salmon',
        description:
          'Pat salmon fillets dry with paper towels. Season with salt and pepper. Brush the top of each fillet with Dijon mustard.',
        duration: 3,
        tip: 'Drying the salmon ensures a better sear.',
      },
      {
        id: 's-3',
        order: 3,
        title: 'Apply the crust',
        description:
          'Press the herb-panko mixture firmly onto the mustard-coated side of each fillet. Pack it down gently so it adheres.',
        duration: 2,
        tip: null,
      },
      {
        id: 's-4',
        order: 4,
        title: 'Sear the salmon',
        description:
          'Heat remaining olive oil in a large oven-safe skillet over medium-high heat. Place salmon crust-side up. Sear for 3 minutes until the bottom is golden.',
        duration: 3,
        tip: 'Don\'t move the fillets while they sear — let the crust form naturally.',
      },
      {
        id: 's-5',
        order: 5,
        title: 'Finish in the oven',
        description:
          'Transfer the skillet to a preheated 200°C (400°F) oven. Bake for 8-10 minutes until the internal temperature reaches 62°C (145°F).',
        duration: 9,
        tip: 'Use an instant-read thermometer for perfect doneness.',
      },
      {
        id: 's-6',
        order: 6,
        title: 'Make the lemon-butter sauce',
        description:
          'While salmon bakes, melt butter in a small saucepan. Add lemon juice and capers (if using). Swirl until emulsified.',
        duration: 2,
        tip: null,
      },
      {
        id: 's-7',
        order: 7,
        title: 'Plate and serve',
        description:
          'Transfer salmon to plates. Drizzle with lemon-butter sauce and garnish with fresh herbs and a lemon wedge.',
        duration: 0,
        tip: 'Serve immediately while the crust is still crispy.',
      },
    ],
  },
  {
    id: 'recipe-2',
    title: 'Roasted Vegetable Grain Bowl',
    description:
      'A hearty and colourful grain bowl with roasted seasonal vegetables, farro, and a tangy tahini dressing.',
    author: briarUsers[5]!, // Isolde Fenwick
    difficulty: 'easy',
    prepTime: 10,
    cookTime: 30,
    servings: 2,
    tags: ['vegetarian', 'lunch', 'meal-prep', 'healthy'],
    rating: 4.3,
    imageIcon: 'codicon:mortar-board',
    nutrition: {
      calories: 480,
      protein: 14,
      carbs: 62,
      fat: 20,
      fiber: 9,
      sodium: 290,
    },
    ingredients: [
      { id: 'i-20', name: 'Farro', amount: 1, unit: 'cup', optional: false, category: 'pantry' },
      { id: 'i-21', name: 'Sweet potato', amount: 1, unit: 'large', optional: false, category: 'produce' },
      { id: 'i-22', name: 'Broccoli florets', amount: 2, unit: 'cups', optional: false, category: 'produce' },
      { id: 'i-23', name: 'Red onion', amount: 1, unit: 'medium', optional: false, category: 'produce' },
      { id: 'i-24', name: 'Chickpeas (canned)', amount: 1, unit: 'can', optional: false, category: 'pantry' },
      { id: 'i-25', name: 'Tahini', amount: 3, unit: 'tbsp', optional: false, category: 'pantry' },
      { id: 'i-26', name: 'Lemon juice', amount: 2, unit: 'tbsp', optional: false, category: 'liquid' },
      { id: 'i-27', name: 'Olive oil', amount: 2, unit: 'tbsp', optional: false, category: 'liquid' },
      { id: 'i-28', name: 'Cumin', amount: 1, unit: 'tsp', optional: false, category: 'spice' },
      { id: 'i-29', name: 'Smoked paprika', amount: 0.5, unit: 'tsp', optional: false, category: 'spice' },
      { id: 'i-30', name: 'Avocado', amount: 1, unit: 'whole', optional: true, category: 'produce' },
      { id: 'i-31', name: 'Feta cheese', amount: 0.25, unit: 'cup', optional: true, category: 'dairy' },
    ],
    steps: [
      {
        id: 's-10',
        order: 1,
        title: 'Cook the farro',
        description:
          'Bring a pot of salted water to a boil. Add farro and cook until tender, about 25-30 minutes. Drain and set aside.',
        duration: 30,
        tip: 'Toast the farro in a dry pan for 2 minutes before boiling for extra nuttiness.',
      },
      {
        id: 's-11',
        order: 2,
        title: 'Prepare and roast vegetables',
        description:
          'Cube the sweet potato. Toss sweet potato, broccoli, red onion, and drained chickpeas with olive oil, cumin, and smoked paprika. Spread on a baking sheet. Roast at 220°C (425°F).',
        duration: 25,
        tip: 'Don\'t overcrowd the pan — use two sheets if needed for proper browning.',
      },
      {
        id: 's-12',
        order: 3,
        title: 'Make tahini dressing',
        description:
          'Whisk together tahini, lemon juice, 2 tbsp water, and a pinch of salt until smooth and drizzle-ready. Add more water if too thick.',
        duration: 2,
        tip: null,
      },
      {
        id: 's-13',
        order: 4,
        title: 'Assemble bowls',
        description:
          'Divide farro between bowls. Top with roasted vegetables and chickpeas. Add sliced avocado and crumbled feta if using. Drizzle generously with tahini dressing.',
        duration: 0,
        tip: 'These bowls keep well for meal prep — store dressing separately.',
      },
    ],
  },
  {
    id: 'recipe-3',
    title: 'Classic Beef Burgundy',
    description:
      'Rich, slow-braised beef stew with red wine, mushrooms, pearl onions, and aromatic herbs. The ultimate comfort dish.',
    author: briarUsers[1]!, // Marcus Thorne
    difficulty: 'hard',
    prepTime: 30,
    cookTime: 180,
    servings: 6,
    tags: ['beef', 'dinner', 'comfort-food', 'french'],
    rating: 4.9,
    imageIcon: 'codicon:zap',
    nutrition: {
      calories: 580,
      protein: 42,
      carbs: 18,
      fat: 32,
      fiber: 3,
      sodium: 520,
    },
    ingredients: [
      { id: 'i-40', name: 'Beef chuck', amount: 1.5, unit: 'kg', optional: false, category: 'protein' },
      { id: 'i-41', name: 'Red wine (Burgundy)', amount: 750, unit: 'ml', optional: false, category: 'liquid' },
      { id: 'i-42', name: 'Pearl onions', amount: 200, unit: 'g', optional: false, category: 'produce' },
      { id: 'i-43', name: 'Cremini mushrooms', amount: 300, unit: 'g', optional: false, category: 'produce' },
      { id: 'i-44', name: 'Carrots', amount: 3, unit: 'large', optional: false, category: 'produce' },
      { id: 'i-45', name: 'Bacon lardons', amount: 150, unit: 'g', optional: false, category: 'protein' },
      { id: 'i-46', name: 'Beef stock', amount: 500, unit: 'ml', optional: false, category: 'liquid' },
      { id: 'i-47', name: 'Tomato paste', amount: 2, unit: 'tbsp', optional: false, category: 'pantry' },
      { id: 'i-48', name: 'Flour', amount: 3, unit: 'tbsp', optional: false, category: 'pantry' },
      { id: 'i-49', name: 'Thyme sprigs', amount: 4, unit: 'pieces', optional: false, category: 'produce' },
      { id: 'i-50', name: 'Bay leaves', amount: 2, unit: 'pieces', optional: false, category: 'spice' },
      { id: 'i-51', name: 'Garlic cloves', amount: 4, unit: 'pieces', optional: false, category: 'produce' },
      { id: 'i-52', name: 'Butter', amount: 2, unit: 'tbsp', optional: false, category: 'dairy' },
    ],
    steps: [
      {
        id: 's-20',
        order: 1,
        title: 'Marinate the beef',
        description:
          'Cut beef into 5cm cubes. Place in a bowl with half the wine, thyme, and bay leaves. Cover and refrigerate for at least 2 hours (overnight is best).',
        duration: 0,
        tip: 'Patting the beef very dry after marinating is critical for a good sear.',
      },
      {
        id: 's-21',
        order: 2,
        title: 'Render the bacon',
        description:
          'Cook bacon lardons in a Dutch oven over medium heat until crispy, about 5 minutes. Remove with a slotted spoon and reserve.',
        duration: 5,
        tip: null,
      },
      {
        id: 's-22',
        order: 3,
        title: 'Sear the beef',
        description:
          'Remove beef from marinade (reserve the liquid). Pat dry. Working in batches, sear beef in the bacon fat until deeply browned on all sides. Remove and set aside.',
        duration: 12,
        tip: 'Don\'t crowd the pan — sear in 3-4 batches for proper Maillard reaction.',
      },
      {
        id: 's-23',
        order: 4,
        title: 'Build the base',
        description:
          'Add chopped carrots and garlic to the pot. Cook 3 minutes. Stir in tomato paste and flour, cook 1 minute. Deglaze with reserved marinade and remaining wine.',
        duration: 5,
        tip: null,
      },
      {
        id: 's-24',
        order: 5,
        title: 'Braise',
        description:
          'Return beef and bacon to the pot. Add beef stock. Bring to a simmer. Cover and transfer to a 160°C (325°F) oven for 2.5-3 hours.',
        duration: 165,
        tip: 'Check every 45 minutes and add stock if the liquid drops below the meat level.',
      },
      {
        id: 's-25',
        order: 6,
        title: 'Prepare garnishes',
        description:
          'In the last 30 minutes of braising, sauté pearl onions and mushrooms in butter until golden brown. Set aside.',
        duration: 10,
        tip: null,
      },
      {
        id: 's-26',
        order: 7,
        title: 'Finish and serve',
        description:
          'Remove from oven. Discard thyme stems and bay leaves. Fold in mushrooms and pearl onions. Adjust seasoning. Serve over mashed potatoes or egg noodles.',
        duration: 0,
        tip: 'This dish tastes even better the next day. Rewarm gently over low heat.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function getTotalTime(recipe: Recipe): number {
  return recipe.prepTime + recipe.cookTime
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
}

export function getIngredientsByCategory(recipe: Recipe): Map<IngredientCategory, Ingredient[]> {
  const grouped = new Map<IngredientCategory, Ingredient[]>()
  for (const ing of recipe.ingredients) {
    const list = grouped.get(ing.category) ?? []
    list.push(ing)
    grouped.set(ing.category, list)
  }
  return grouped
}

/** Percentage of daily value (rough 2000 cal reference) */
export function getDailyPercent(key: keyof NutritionInfo, value: number): number {
  const daily: Record<keyof NutritionInfo, number> = {
    calories: 2000,
    protein: 50,
    carbs: 300,
    fat: 65,
    fiber: 25,
    sodium: 2300,
  }
  return Math.round((value / daily[key]) * 100)
}
