# Restaurant Configuration & Menu Integration Guide

This application is built with a headless, file-based configuration architecture. All customization and menu management are performed via clean JSON files, ensuring that customers viewing the menu enjoy a fast, clutter-free dining experience with no customer-facing customization controls.

---

## 1. Restaurant Config (`src/restaurant-config.json`)

Controls visual branding, color palettes, and menu layout patterns:

```json
{
  "name": "RestoKu",
  "tagline": "Authentic Asian & Local Fusion Street Food",
  "description": "Authentic local flavors served fresh daily. Scan, order, and enjoy!",
  "themeColor": "amber",
  "layout": "grid",
  "tableNumber": "12",
  "currencySymbol": "Rp ",
  "taxRate": 0.1
}
```

### Available Theme Colors (`themeColor`):
- `"amber"`: Warm Bistro Amber (golden warm cream canvas with amber accents)
- `"terracotta"`: Tuscan Terracotta (sunbaked red clay & trattoria warmth)
- `"emerald"`: Matcha Zen Garden (botanical emerald greens & tea house serenity)
- `"sapphire"`: Ocean Sapphire (coastal azure blues & crisp contrast)
- `"amethyst"`: Velvet Plum & Wine (rich berry & royal purple luxury)
- `"espresso"`: Artisan Espresso Roast (warm roasted mocha, hazelnut, & oak)
- `"midnight"`: Tokyo Midnight Noir (deep noir night canvas with neon glow)
- `"monochrome"`: Nordic Minimalist (high-contrast gallery aesthetic)
- `"yellow"`: Classic Sunny Yellow
- `"red"`: Spicy Chili Red
- `"green"`: Fresh Bistro Green
- `"blue"`: Cobalt Blue
- `"purple"`: Deep Violet Purple

### Available Layouts (`layout`):
- `"grid"`: Photo Card Grid (modern 2-to-4 column cards with 4:3 photography)
- `"sidebar"`: Category Sidebar (persistent left category drawer with live counters)
- `"compact"`: Bistro Dense List (clean horizontal rows with quick-order buttons)
- `"showcase"`: Magazine Hero Showcase (wide 16:9 hero photography with highlights)
- `"sections"`: Categorized Continuous Flow (continuous sections with sticky jump bar)

---

## 2. External Menu & Profile Sync (`src/menu.json`)

External programs (POS systems, inventory scripts, Python sync workers, spreadsheets) can directly generate or edit `src/menu.json`.

### Structure:

```json
{
  "restaurant": {
    "name": "RestoKu",
    "tagline": "Authentic Asian & Local Fusion Street Food",
    "description": "Authentic local flavors served fresh daily. Scan, order, and enjoy!",
    "address": "Jl. Boulevard Raya No. 79, Jakarta",
    "phone": "+62 812-3456-7890",
    "instagram": "@restoku.official"
  },
  "categories": [
    "All",
    "Rice",
    "Noodle",
    "Chicken",
    "Beef",
    "Veggies",
    "Drinks"
  ],
  "items": [
    {
      "id": "r1",
      "name": "Nasi Goreng Spesial",
      "description": "Wok-tossed Indonesian fried rice with shredded chicken, sunny-side-up egg, chicken satay, and crispy prawn crackers.",
      "price": 48000,
      "image": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=800&auto=format&fit=crop",
      "category": "Rice",
      "popular": true,
      "calories": 620,
      "allergens": "Egg, Crustaceans"
    }
  ]
}
```

### Menu Item Fields:
- `id` (string, required): Unique identifier (e.g., `"r1"`, `"pos-1049"`).
- `name` (string, required): Name of the dish or drink.
- `description` (string, required): Culinary description or ingredients.
- `price` (number, required): Numeric price in standard units (e.g., `48000`).
- `image` (string, required): Image URL or asset path.
- `category` (string, required): Must match one of the categories (e.g., `"Rice"`, `"Drinks"`).
- `popular` (boolean, optional): Set to `true` to display the "Popular" flame badge and priority sorting.
- `calories` (number, optional): Calorie count in kcal.
- `allergens` (string, optional): Allergen tags (e.g., `"Egg, Crustaceans"`).
