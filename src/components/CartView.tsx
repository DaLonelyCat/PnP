import { useState } from 'react';
import { CartItem, RestaurantConfig } from '../types';
import { formatCurrency } from '../data';
import { ArrowLeft, Plus, Minus, ShoppingCart, Trash2, Utensils, Clock, ArrowRight, Store, Check, User } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';
import { Language, useTranslation } from '../utils/i18n';

interface CartViewProps {
  config: RestaurantConfig;
  lang: Language;
  cart: CartItem[];
  activeTableNo?: string;
  activeOrderId?: string;
  onBack: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem?: (id: string) => void;
  onPlaceOrder: (tableNo: string) => void;
}

export default function CartView({ 
  config, 
  lang,
  cart, 
  activeTableNo, 
  activeOrderId, 
  onBack, 
  onUpdateQuantity, 
  onRemoveItem,
  onPlaceOrder 
}: CartViewProps) {
  const t = useTranslation(lang);
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [customerName, setCustomerName] = useState(activeTableNo || config.tableNumber || '');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputError, setInputError] = useState(false);

  const theme = getThemeClasses(config.themeColor);

  const computeCartItemPrice = (item: CartItem) => {
    let price = item.menuItem.price;
    if (item.selectedOptions) {
      Object.values(item.selectedOptions).forEach(opt => {
        price += (opt.priceDelta || 0);
      });
    }
    return price;
  };

  const subtotal = cart.reduce((sum, item) => sum + (computeCartItemPrice(item) * item.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = () => {
    const trimmed = customerName.trim();
    if (!trimmed) {
      setInputError(true);
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onPlaceOrder(trimmed);
    }, 150);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm flex items-center justify-center mb-5 text-gray-400">
          <ShoppingCart size={36} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Your cart is empty</h2>
        <p className="text-xs text-gray-500 dark:text-zinc-400 text-center max-w-xs mb-6">
          Looks like you haven't added any delicious dishes or refreshing drinks yet.
        </p>
        <button 
          onClick={onBack}
          className={`${theme.primary} ${theme.buttonText} px-7 py-3 rounded-2xl text-sm font-bold shadow-sm ${theme.hover} transition-all active:scale-95 flex items-center gap-2`}
        >
          <Utensils size={16} />
          Explore Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Back to menu"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-none">Your Cart</h1>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} selected</span>
          </div>
        </div>

        {activeOrderId && (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            Appending #{activeOrderId}
          </span>
        )}
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 space-y-4">
        
        {/* Active Order Notice if Appending */}
        {activeOrderId && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center gap-3 text-xs text-blue-800 dark:text-blue-300">
            <Utensils size={18} className="shrink-0 text-blue-600 dark:text-blue-400" />
            <span>You have an open table tab! Ordering these items will add them directly to your existing order.</span>
          </div>
        )}

        {/* Dining Type & Customer / Table Input */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Dining Option
            </span>
            <div className="flex bg-gray-100 dark:bg-zinc-700/60 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setDiningMode('dine-in');
                  setInputError(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  diningMode === 'dine-in' 
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs font-bold' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
                }`}
              >
                Dine In
              </button>
              <button
                type="button"
                onClick={() => {
                  setDiningMode('takeaway');
                  setInputError(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  diningMode === 'takeaway' 
                    ? 'bg-white dark:bg-zinc-800 text-gray-900 dark:text-white shadow-xs font-bold' 
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
                }`}
              >
                Takeaway
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-700 dark:text-zinc-300 font-semibold mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User size={13} className={theme.text} />
                <span>{diningMode === 'dine-in' ? 'Table Name or Customer Name' : 'Customer Name'}</span>
                <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-normal">Type to identify your order</span>
            </label>
            <input 
              type="text" 
              value={customerName}
              onChange={e => {
                setCustomerName(e.target.value.substring(0, 20));
                if (inputError && e.target.value.trim()) setInputError(false);
              }}
              maxLength={20}
              placeholder={diningMode === 'dine-in' ? 'Type your table name or your name (e.g. Table 04, Sarah, Booth 2)...' : 'Type customer name for pickup (e.g. Alex, Sarah)...'}
              className={`w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-700/50 rounded-xl text-xs sm:text-sm text-gray-900 dark:text-white outline-none border transition-colors placeholder-gray-400 font-medium ${
                inputError 
                  ? 'border-red-500 ring-2 ring-red-500/20' 
                  : 'border-gray-200/80 dark:border-zinc-700 focus:border-amber-500 dark:focus:border-amber-500'
              }`}
            />
            {inputError && (
              <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">
                Please type your {diningMode === 'dine-in' ? 'table name or customer name' : 'customer name'} before placing the order.
              </p>
            )}
          </div>

          {diningMode === 'takeaway' && (
            <div className="flex items-center gap-2 p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-xs text-amber-800 dark:text-amber-300">
              <Store size={16} className="shrink-0" />
              <span>We'll pack everything safely in takeaway packaging ready for pickup at the counter.</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Selected Items ({totalItemsCount})
            </span>
            <button
              onClick={onBack}
              className={`text-xs font-bold ${theme.text} hover:opacity-80 flex items-center gap-1 cursor-pointer`}
            >
              <Plus size={13} />
              Add More
            </button>
          </div>

          {cart.map(item => {
            let unitPrice = item.menuItem.price;
            let optionsDesc = '';
            if (item.selectedOptions) {
              const opts = Object.values(item.selectedOptions);
              opts.forEach((opt: any) => { unitPrice += (opt.priceDelta || 0); });
              optionsDesc = opts.map((opt: any) => opt.name).join(', ');
            }

            return (
            <div 
              key={item.id} 
              className="bg-white dark:bg-zinc-800 p-3 sm:p-3.5 rounded-2xl shadow-xs flex gap-3.5 items-center relative transition-all"
            >
              {/* Dish Image */}
              <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700">
                <img 
                  src={item.menuItem.image} 
                  alt={item.menuItem.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                    {item.menuItem.name}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                      {formatCurrency(unitPrice * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveItem ? onRemoveItem(item.id) : onUpdateQuantity(item.id, -item.quantity)}
                      className="p-1 rounded-lg text-gray-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-gray-400 dark:text-zinc-400 mt-0.5">
                  {formatCurrency(unitPrice)} each
                </p>

                {/* Options / Notes */}
                {(optionsDesc || item.notes || (item.spiceLevel !== undefined && item.spiceLevel > 0)) && (
                  <div className="flex flex-col gap-1 mt-1.5">
                    {optionsDesc && (
                      <span className="text-[10px] text-gray-500 dark:text-zinc-400 leading-tight">
                        {optionsDesc}
                      </span>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                          🌶️ Level {item.spiceLevel}
                        </span>
                      )}
                      {item.notes && (
                        <span className="text-[10px] text-gray-500 dark:text-zinc-400 italic truncate max-w-[200px]">
                          "{item.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stepper Controls */}
                <div className="flex justify-end items-center mt-2.5">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-700/80 rounded-xl p-1">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      {item.quantity === 1 ? <Trash2 size={13} className="text-red-500" /> : <Minus size={13} />}
                    </button>
                    <span className="w-5 text-center text-xs font-extrabold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-600 dark:text-zinc-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Special Cooking Notes for Kitchen */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-xs">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1.5">
            Table / Kitchen Notes
          </label>
          <input
            type="text"
            value={orderNotes}
            onChange={e => {
              const val = e.target.value.substring(0, 120);
              // Strip HTML tags for security
              const sanitized = val.replace(/<[^>]*>?/gm, '');
              setOrderNotes(sanitized);
            }}
            maxLength={120}
            placeholder="e.g. Serve drinks first, extra napkins (max 120 chars)..."
            className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-700/50 rounded-xl text-xs text-gray-900 dark:text-white outline-none border border-transparent focus:border-gray-300 dark:focus:border-zinc-600 transition-colors placeholder-gray-400"
          />
          <div className="text-right mt-1 text-[10px] text-gray-400">
            {orderNotes.length}/120
          </div>
        </div>

        {/* Cost Summary Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 block mb-1">
            Payment Breakdown
          </span>
          <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-300">
            <span>Items Subtotal ({totalItemsCount} items)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-300">
            <span>Restaurant Tax (PPn 11%)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(tax)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-zinc-500 pt-1">
            <Clock size={12} />
            <span>Estimated preparation time: ~15-20 minutes</span>
          </div>
          <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-zinc-700">
            <span className="font-bold text-gray-900 dark:text-white">Total Amount</span>
            <span className={`text-base font-extrabold ${theme.text}`}>
              {formatCurrency(total)}
            </span>
          </div>
        </div>

      </div>

      {/* Floating Bottom Order CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200/70 dark:border-zinc-800 p-4 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Bill</span>
            <span className="text-lg font-black text-gray-900 dark:text-white leading-tight">
              {formatCurrency(total)}
            </span>
          </div>

          <button 
            type="button"
            disabled={isSubmitting}
            onClick={handleConfirmOrder}
            className={`flex-1 h-13 ${theme.primary} ${theme.hover} ${theme.buttonText} font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 transition-all disabled:opacity-70 cursor-pointer`}
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <span>Confirm & Place Order</span>
                <ArrowRight size={16} strokeWidth={2.5} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
