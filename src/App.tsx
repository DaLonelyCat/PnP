/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ShoppingCart, Info, Receipt, CheckCircle2, X } from 'lucide-react';
import { MENU_ITEMS as initialMenuItems, CATEGORIES as initialCategories, RESTAURANT_PROFILE } from './data';
import { MenuItem, CartItem, Order, RestaurantConfig } from './types';
import appConfig from './restaurant-config.json';
import { getThemeClasses } from './utils/theme';
import { clearOrderSession } from './utils/storage';

// Components
import MenuList from './components/MenuList';
import ItemDetail from './components/ItemDetail';
import CartView from './components/CartView';
import OrderConfirmed from './components/OrderConfirmed';

type ViewState = 'menu' | 'detail' | 'cart' | 'order';

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Restaurant configuration loaded directly from restaurant-config.json and menu.json
  const config: RestaurantConfig = {
    name: RESTAURANT_PROFILE.name || (appConfig as any).name || 'RestoKu',
    tagline: RESTAURANT_PROFILE.tagline || (appConfig as any).tagline || '',
    description: RESTAURANT_PROFILE.description || (appConfig as any).description || '',
    themeColor: (appConfig as any).themeColor || 'amber',
    layout: (appConfig as any).layout || 'grid',
    tableNumber: (appConfig as any).tableNumber || '12',
    currencySymbol: (appConfig as any).currencySymbol || 'Rp ',
    taxRate: (appConfig as any).taxRate ?? 0.1,
  };

  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (noticeMessage) {
      const timer = setTimeout(() => setNoticeMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [noticeMessage]);
  
  // Clean up any previous client-side config override so config JSON always prevails
  useEffect(() => {
    localStorage.removeItem('restoku_custom_config');
  }, []);
  
  // Shopping State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('restoku_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('restoku_order');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.createdAt = new Date(parsed.createdAt);
      return parsed;
    }
    return null;
  });
  const [activeCategory, setActiveCategory] = useState('All');

  // Persist State
  useEffect(() => {
    localStorage.setItem('restoku_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('restoku_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('restoku_order');
    }
  }, [activeOrder]);
  
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

  const placeOrder = (tableNo: string) => {
    const newSubtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
    
    if (activeOrder) {
      const mergedItems = [...activeOrder.items];
      cart.forEach(cartItem => {
        const existing = mergedItems.find(i => 
          i.menuItem.id === cartItem.menuItem.id && 
          i.notes === cartItem.notes && 
          i.spiceLevel === cartItem.spiceLevel
        );
        if (existing) {
          existing.quantity += cartItem.quantity;
        } else {
          mergedItems.push(cartItem);
        }
      });
      
      const subtotal = activeOrder.subtotal + newSubtotal;
      const tax = subtotal * 0.11;
      
      setActiveOrder({
        ...activeOrder,
        items: mergedItems,
        subtotal,
        tax,
        total: subtotal + tax,
        tableNo: tableNo || activeOrder.tableNo
      });
    } else {
      const tax = newSubtotal * 0.11;
      setActiveOrder({
        id: 'AB' + Math.floor(Math.random() * 10000),
        items: [...cart],
        subtotal: newSubtotal,
        tax,
        total: newSubtotal + tax,
        status: 'pending',
        tableNo: tableNo || 'N/A',
        createdAt: new Date()
      });
    }
    
    clearCart();
    setView('order');
  };

  const openItemDetail = (item: MenuItem) => {
    setSelectedItem(item);
    setView('detail');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Active Theme Object
  const theme = getThemeClasses(config.themeColor);
  const titleColor = theme.title;

  return (
    <div className={`min-h-screen ${theme.bgClass} text-gray-900 dark:text-gray-100 transition-colors duration-200 font-sans`}>
      
      {/* Dynamic Header */}
      {view === 'menu' && (
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-zinc-800 px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className={`text-xl font-black uppercase tracking-tight ${titleColor}`}>
              {config.name}
            </h1>
            {config.tagline && (
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 font-medium">
                {config.tagline}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setView('cart')}
              className="relative p-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-85 transition-opacity cursor-pointer"
              aria-label="Open cart"
            >
              <ShoppingCart size={17} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={view === 'menu' ? 'pb-24' : ''}>
        {view === 'menu' && (
          <MenuList 
            config={config}
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            items={menuItems}
            onItemClick={openItemDetail}
          />
        )}

        {view === 'detail' && selectedItem && (
          <ItemDetail 
            config={config}
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
            config={config}
            cart={cart}
            activeTableNo={activeOrder?.tableNo}
            activeOrderId={activeOrder?.id}
            onBack={() => setView('menu')}
            onUpdateQuantity={updateQuantity}
            onPlaceOrder={placeOrder}
          />
        )}

        {view === 'order' && (
          activeOrder ? (
            <OrderConfirmed 
              config={config}
              order={activeOrder}
              onBack={() => setView('menu')}
              onRequestBill={() => {
                clearOrderSession();
                setActiveOrder(null);
                setCart([]);
                setNoticeMessage('Bill requested! Order completed and browser cookies cleared.');
                setView('menu');
              }}
            />
          ) : (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
              <Receipt size={48} className="text-gray-400 mb-3" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Active Order</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">You don't have an open table tab right now.</p>
              <button 
                onClick={() => setView('menu')}
                className="px-6 py-2.5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          )
        )}
      </main>

      {/* Finished Order Notice Toast */}
      {noticeMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 size={16} />
          <span>{noticeMessage}</span>
          <button 
            onClick={() => setNoticeMessage(null)}
            className="p-1 hover:bg-emerald-700 rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss notice"
          >
            <X size={13} />
          </button>
        </div>
      )}
      
      {/* Floating Bottom Nav */}
      {view === 'menu' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md shadow-xl rounded-full px-6 py-2.5 flex items-center gap-7 border border-gray-200/60 dark:border-zinc-700/60 z-30">
          <button className={`flex flex-col items-center gap-0.5 ${theme.text} cursor-pointer`}>
            <Info size={18} />
            <span className="text-[10px] font-bold">Menu</span>
          </button>

          <button 
            onClick={() => setView('cart')}
            className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">Cart</span>
          </button>

          {activeOrder && (
            <button 
              onClick={() => setView('order')}
              className="flex flex-col items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold transition-colors cursor-pointer"
              title={`Active Order #${activeOrder.id}`}
            >
              <div className="relative">
                <Receipt size={18} />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold">#{activeOrder.id}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
