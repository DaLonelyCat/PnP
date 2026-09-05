/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingCart, Moon, Sun, ArrowLeft, Plus, Minus, Info } from 'lucide-react';
import { MENU_ITEMS, CATEGORIES, formatCurrency } from './data';
import { MenuItem, CartItem, Order } from './types';

// Components
import MenuList from './components/MenuList';
import ItemDetail from './components/ItemDetail';
import CartView from './components/CartView';
import OrderConfirmed from './components/OrderConfirmed';

type ViewState = 'menu' | 'detail' | 'cart' | 'order';

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Theme Toggle Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Cart Actions
  const addToCart = (menuItem: MenuItem, quantity: number, notes: string = '', spiceLevel: number = 0) => {
    setCart(prev => {
      const existing = prev.find(item => item.menuItem.id === menuItem.id && item.notes === notes && item.spiceLevel === spiceLevel);
      if (existing) {
        return prev.map(item => 
          item.id === existing.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        menuItem,
        quantity,
        notes,
        spiceLevel
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  const placeOrder = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    const tax = subtotal * 0.11;
    
    const newOrder: Order = {
      id: 'AB' + Math.floor(Math.random() * 10000),
      items: [...cart],
      subtotal,
      tax,
      total: subtotal + tax,
      status: 'pending',
      tableNo: '5',
      createdAt: new Date()
    };
    
    setActiveOrder(newOrder);
    clearCart();
    setView('order');
  };

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setView('detail');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans">
      
      {/* Dynamic Header */}
      {view === 'menu' && (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">KWETIAO 79</h1>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setView('cart')}
              className="relative p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="pb-24">
        {view === 'menu' && (
          <MenuList 
            categories={CATEGORIES}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            items={MENU_ITEMS}
            onItemClick={openItemDetail}
          />
        )}

        {view === 'detail' && selectedItem && (
          <ItemDetail 
            item={selectedItem} 
            onBack={() => setView('menu')}
            onAddToCart={(qty, notes, spice) => {
              addToCart(selectedItem, qty, notes, spice);
              setView('menu');
            }}
          />
        )}

        {view === 'cart' && (
          <CartView 
            cart={cart}
            onBack={() => setView('menu')}
            onUpdateQuantity={updateQuantity}
            onPlaceOrder={placeOrder}
          />
        )}

        {view === 'order' && activeOrder && (
          <OrderConfirmed 
            order={activeOrder}
            onBack={() => setView('menu')}
          />
        )}
      </main>
      
      {/* Floating Bottom Nav (Optional, based on Rainforest Cafe design) */}
      {view === 'menu' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-zinc-800/90 backdrop-blur shadow-xl rounded-full px-6 py-3 flex items-center gap-8 border border-gray-100 dark:border-zinc-700">
          <button className="flex flex-col items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Info size={20} />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
          <button 
            onClick={() => setView('cart')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}
