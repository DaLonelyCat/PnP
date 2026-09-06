export interface CustomizationOption {
  id: string;
  name: string;
  priceDelta: number; // 0 if free
}

export interface CustomizationGroup {
  id: string;
  name: string; // e.g., "Noodle Type", "Ice Level"
  required: boolean;
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  allergens?: string;
  calories?: number;
  macros?: string;
  customizationGroups?: CustomizationGroup[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  notes: string;
  spiceLevel?: number;
  selectedOptions?: Record<string, CustomizationOption>; // GroupId -> Selected Option
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'pending' | 'preparing' | 'served' | 'paid';
  tableNo: string;
  createdAt: Date;
}

export type ThemeColorTemplate = 
  | 'yellow' | 'red' | 'green' | 'blue' | 'purple'
  | 'amber' | 'terracotta' | 'emerald' | 'sapphire' | 'amethyst' 
  | 'espresso' | 'midnight' | 'monochrome';

export type MenuLayoutPattern = 
  | 'grid' 
  | 'sidebar' 
  | 'compact' 
  | 'showcase' 
  | 'sections';

export interface RestaurantConfig {
  name: string;
  description: string;
  themeColor: ThemeColorTemplate;
  layout: MenuLayoutPattern;
  tagline?: string;
  tableNumber?: string;
  currencySymbol?: string;
  taxRate?: number;
}

export interface RestaurantProfile {
  name: string;
  tagline?: string;
  description?: string;
  address?: string;
  phone?: string;
  instagram?: string;
}

export interface MenuDataJson {
  restaurant: RestaurantProfile;
  categories: string[];
  items: MenuItem[];
}

