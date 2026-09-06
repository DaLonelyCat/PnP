import { MenuItem, MenuDataJson, RestaurantProfile } from './types';
import rawMenuData from './menu.json';

const menuData = rawMenuData as unknown as MenuDataJson;

export const RESTAURANT_PROFILE: RestaurantProfile = menuData.restaurant || {
  name: 'RestoKu',
  tagline: 'Authentic Asian & Local Fusion Street Food',
  description: 'Authentic local flavors served fresh daily. Scan, order, and enjoy!'
};

// Derive or load categories from menu.json
const rawCategories = Array.isArray(menuData.categories) && menuData.categories.length > 0
  ? menuData.categories
  : ['All', ...Array.from(new Set((menuData.items || []).map(i => i.category).filter(Boolean)))];

// Ensure 'All' is always the first tab
export const CATEGORIES: string[] = rawCategories.includes('All') 
  ? ['All', ...rawCategories.filter(c => c !== 'All')] 
  : ['All', ...rawCategories];

export const MENU_ITEMS: MenuItem[] = (menuData.items || []) as MenuItem[];

export const formatCurrency = (amount: number) => {
  return 'Rp ' + (amount || 0).toLocaleString('id-ID');
};
