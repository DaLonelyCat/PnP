/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Info, Receipt, CheckCircle2, X, SlidersHorizontal, Globe } from 'lucide-react';
import { MENU_ITEMS as initialMenuItems, CATEGORIES as initialCategories, RESTAURANT_PROFILE } from './data';
import { MenuItem, CartItem, Order, RestaurantConfig } from './types';
import appConfig from './restaurant-config.json';
import { getThemeClasses } from './utils/theme';
import { clearOrderSession } from './utils/storage';
import { Language, useTranslation } from './utils/i18n';

// Components
import MenuList from './components/MenuList';
import ItemDetail from './components/ItemDetail';
import CartView from './components/CartView';
import OrderConfirmed from './components/OrderConfirmed';
import SettingsModal from './components/SettingsModal';
import PinModal from './components/PinModal';

type ViewState = 'menu' | 'detail' | 'cart' | 'order';

export default function App() {
  const [view, setView] = useState<ViewState>('menu');
  const [lang, setLang] = useState<Language>('en');
  const t = useTranslation(lang);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  
  // Restaurant configuration defaults loaded from restaurant-config.json and menu.json
  const defaultConfig: RestaurantConfig = {
    name: RESTAURANT_PROFILE.name || (appConfig as any).name || 'RestoKu',
    tagline: RESTAURANT_PROFILE.tagline || (appConfig as any).tagline || '',
    description: RESTAURANT_PROFILE.description || (appConfig as any).description || '',
    themeColor: (appConfig as any).themeColor || 'amber',
    layout: (appConfig as any).layout || 'grid',
    tableNumber: (appConfig as any).tableNumber || '12',
    currencySymbol: (appConfig as any).currencySymbol || 'Rp ',
    taxRate: (appConfig as any).taxRate ?? 0.1,
  };

  // State with temporary local persistence
  const [config, setConfig] = useState<RestaurantConfig>(() => {
    const saved = localStorage.getItem('restoku_temp_custom_config');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return defaultConfig;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('restoku_temp_menu_items_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialMenuItems;
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('restoku_temp_categories_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return initialCategories;
  });

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  useEffect(() => {
    if (noticeMessage) {
      const timer = setTimeout(() => setNoticeMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [noticeMessage]);

  // Persist temporary modifications across reloads
  useEffect(() => {
    localStorage.setItem('restoku_temp_custom_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('restoku_temp_menu_items_v3', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('restoku_temp_categories_v3', JSON.stringify(categories));
  }, [categories]);

  // Session Inactivity Timeout (90 minutes)
  useEffect(() => {
    let inactivityTimer: number;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Set timeout for 90 minutes (90 * 60 * 1000)
      inactivityTimer = window.setTimeout(() => {
        setCart([]);
        setActiveOrder(null);
        setView('menu');
        setNoticeMessage("Session expired due to inactivity.");
      }, 90 * 60 * 1000);
    };

    // Events to track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, { passive: true }));
    
    resetTimer(); // Initialize on mount

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, []);

  const handleResetToDefaults = () => {
    localStorage.removeItem('restoku_temp_custom_config');
    localStorage.removeItem('restoku_temp_menu_items');
    localStorage.removeItem('restoku_temp_categories');
    setConfig(defaultConfig);
    setMenuItems(initialMenuItems);
    setCategories(initialCategories);
    setNoticeMessage('Reset theme, layout, naming, and menu back to configuration files.');
    setIsSettingsOpen(false);
  };
  
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234') {
      setIsPinModalOpen(false);
      setIsSettingsOpen(true);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

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
  
  // Ensure dark mode class is cleaned up
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Ensure settings modal automatically closes if screen is resized below desktop breakpoint (1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSettingsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cart Actions
  const addToCart = (menuItem: MenuItem, quantity: number, notes: string = '', spiceLevel: number = 0, selectedOptions?: Record<string, any>) => {
    setCart(prev => {
      const existing = prev.find(item => {
        if (item.menuItem.id !== menuItem.id) return false;
        if (item.notes !== notes) return false;
        if (item.spiceLevel !== spiceLevel) return false;
        
        const currentOpts = item.selectedOptions || {};
        const newOpts = selectedOptions || {};
        const currentKeys = Object.keys(currentOpts);
        const newKeys = Object.keys(newOpts);
        
        if (currentKeys.length !== newKeys.length) return false;
        for (const key of currentKeys) {
          if (currentOpts[key].id !== newOpts[key]?.id) return false;
        }
        
        return true;
      });
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
        spiceLevel,
        selectedOptions
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return { ...item, quantity: newQ };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const computeCartItemPrice = (item: CartItem) => {
    let price = item.menuItem.price;
    if (item.selectedOptions) {
      Object.values(item.selectedOptions).forEach((opt: any) => {
        price += (opt.priceDelta || 0);
      });
    }
    return price;
  };

  const placeOrder = (tableNo: string) => {
    const newSubtotal = cart.reduce((sum, item) => sum + (computeCartItemPrice(item) * item.quantity), 0);
    
    if (activeOrder) {
      const mergedItems = [...activeOrder.items];
      cart.forEach(cartItem => {
        const existing = mergedItems.find(i => {
          if (i.menuItem.id !== cartItem.menuItem.id) return false;
          if (i.notes !== cartItem.notes) return false;
          if (i.spiceLevel !== cartItem.spiceLevel) return false;
          
          const currentOpts = i.selectedOptions || {};
          const newOpts = cartItem.selectedOptions || {};
          const currentKeys = Object.keys(currentOpts);
          const newKeys = Object.keys(newOpts);
          if (currentKeys.length !== newKeys.length) return false;
          for (const key of currentKeys) {
            if (currentOpts[key].id !== newOpts[key]?.id) return false;
          }
          return true;
        });
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
            {/* Language Toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'id' : 'en')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl ${theme.light} border ${theme.cardBorder} ${theme.text} hover:opacity-85 transition-opacity cursor-pointer text-xs font-bold shadow-xs`}
              title="Toggle Language"
            >
              <Globe size={15} className={theme.text} />
              <span className="uppercase">{lang}</span>
            </button>

            {/* Theming options - available only in desktop view (hidden on mobile and tablet) */}
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setIsPinModalOpen(true);
                  setPinInput('');
                  setPinError(false);
                }
              }}
              className={`hidden lg:inline-flex px-3 py-2 rounded-2xl ${theme.light} border ${theme.cardBorder} ${theme.text} hover:opacity-85 transition-opacity cursor-pointer items-center gap-1.5 text-xs font-bold shadow-xs`}
              title="Customize theme, layouts, naming and menu (Desktop only)"
            >
              <SlidersHorizontal size={15} className={theme.text} />
              <span>Theme & Menu</span>
            </button>

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
            lang={lang}
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
            lang={lang}
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
            lang={lang}
            cart={cart}
            activeTableNo={activeOrder?.tableNo}
            activeOrderId={activeOrder?.id}
            onBack={() => setView('menu')}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onPlaceOrder={placeOrder}
          />
        )}

        {view === 'order' && (
          activeOrder ? (
            <OrderConfirmed 
              config={config}
              lang={lang}
              order={activeOrder}
              onBack={() => setView('menu')}
              onRequestBill={() => {
                clearOrderSession();
                setActiveOrder(null);
                setCart([]);
                setNoticeMessage('Bill requested! Order completed. Thank you for dining with us!');
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md shadow-xl rounded-full px-6 py-2.5 flex items-center gap-6 sm:gap-7 border border-gray-200/60 dark:border-zinc-700/60 z-30">
          <button className={`flex flex-col items-center gap-0.5 ${theme.text} cursor-pointer`}>
            <Info size={18} />
            <span className="text-[10px] font-bold">{t('menu')}</span>
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
            <span className="text-[10px] font-medium">{t('cart')}</span>
          </button>

          {activeOrder && (
            <button 
              onClick={() => setView('order')}
              className={`flex flex-col items-center gap-0.5 ${theme.text} font-bold transition-colors cursor-pointer`}
              title={`Active Order #${activeOrder.id}`}
            >
              <div className="relative">
                <Receipt size={18} />
                <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${theme.primary} animate-pulse`} />
              </div>
              <span className="text-[10px] font-bold">#{activeOrder.id}</span>
            </button>
          )}
        </div>
      )}

      {/* Live Customizer & Settings Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setPinInput('');
          setPinError(false);
        }}
        config={config}
        pinInput={pinInput}
        setPinInput={setPinInput}
        pinError={pinError}
        onSubmit={handlePinSubmit}
      />

      <SettingsModal
        lang={lang}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onUpdateConfig={setConfig}
        menuItems={menuItems}
        onUpdateMenuItems={setMenuItems}
        categories={categories}
        onUpdateCategories={setCategories}
        onResetToDefaults={handleResetToDefaults}
      />
    </div>
  );
}
