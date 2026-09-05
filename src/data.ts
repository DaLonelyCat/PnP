import { MenuItem } from './types';

export const CATEGORIES = [
  'All',
  'Rice',
  'Noodle',
  'Chicken',
  'Beef',
  'Veggies',
  'Drinks'
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Chicken Tikka Masala',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales nibh et sapien tempus condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    price: 250000,
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000&auto=format&fit=crop',
    category: 'Chicken',
    popular: true
  },
  {
    id: '2',
    name: 'Ayam Goreng BaPut',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales nibh et sapien tempus condimentum.',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1000&auto=format&fit=crop',
    category: 'Chicken',
    popular: true
  },
  {
    id: '3',
    name: 'Nasi Goreng Ikan Asin',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 54000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?q=80&w=1000&auto=format&fit=crop',
    category: 'Rice'
  },
  {
    id: '4',
    name: 'Japanese Curry',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales nibh et sapien.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1605333396914-232151711200?q=80&w=1000&auto=format&fit=crop',
    category: 'Rice'
  },
  {
    id: '5',
    name: 'Ayam Cabe Garam',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=1000&auto=format&fit=crop',
    category: 'Chicken'
  },
  {
    id: '6',
    name: 'Chicken Katsu Set',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1593922756855-4428059e19d2?q=80&w=1000&auto=format&fit=crop',
    category: 'Chicken'
  },
  {
    id: '7',
    name: 'Tom Yum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b4859?q=80&w=1000&auto=format&fit=crop',
    category: 'Soup'
  },
  {
    id: '8',
    name: 'Fuyunghai',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1000&auto=format&fit=crop',
    category: 'Chicken'
  }
];

export const formatCurrency = (amount: number) => {
  return 'Rp ' + amount.toLocaleString('id-ID');
};
