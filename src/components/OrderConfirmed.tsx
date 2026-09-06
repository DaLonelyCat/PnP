import { useState } from 'react';
import { Order, RestaurantConfig } from '../types';
import { formatCurrency } from '../data';
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  ChefHat, 
  Receipt, 
  Utensils, 
  X, 
  Check,
  BellRing,
  Cookie
} from 'lucide-react';
import { getThemeClasses } from '../utils/theme';

interface OrderConfirmedProps {
  config: RestaurantConfig;
  order: Order;
  onBack: () => void;
  onRequestBill: () => void;
}

export default function OrderConfirmed({ 
  config, 
  order, 
  onBack, 
  onRequestBill 
}: OrderConfirmedProps) {
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const theme = getThemeClasses(config.themeColor);

  const formatOrderTime = (date: Date) => {
    try {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  const handleConfirmRequestBill = () => {
    setIsBillModalOpen(false);
    onRequestBill();
  };

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-200/70 dark:border-zinc-800 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="w-9 h-9 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back to menu"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900 dark:text-white leading-none">Your Order</h1>
            <span className="text-[11px] text-gray-500 dark:text-zinc-400">Order #{order.id} • {order.tableNo}</span>
          </div>
        </div>

        <button
          onClick={onBack}
          className={`text-xs font-bold ${theme.text} hover:opacity-80 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 shadow-xs border border-gray-200/60 dark:border-zinc-700/60 cursor-pointer`}
        >
          <Plus size={14} />
          <span>Add Food</span>
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 space-y-4">
        
        {/* Order Status & Progress Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Kitchen Preparing
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 flex items-center gap-1">
              <Clock size={13} />
              Placed at {formatOrderTime(order.createdAt)}
            </span>
          </div>

          {/* Stepper */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold mb-1 shadow-xs">
                <Check size={16} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold text-gray-900 dark:text-white">Received</span>
              <span className="text-[9px] text-gray-400">Order confirmed</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className={`w-8 h-8 rounded-full ${theme.primary} ${theme.buttonText} flex items-center justify-center text-xs font-bold mb-1 shadow-xs ring-4 ring-amber-400/20 dark:ring-amber-500/20`}>
                <ChefHat size={16} />
              </div>
              <span className="text-[11px] font-bold text-gray-900 dark:text-white">Cooking</span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-medium">In the kitchen</span>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500 flex items-center justify-center text-xs font-bold mb-1">
                <Utensils size={15} />
              </div>
              <span className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">Serving</span>
              <span className="text-[9px] text-gray-400 dark:text-zinc-500">To your table</span>
            </div>
          </div>
        </div>

        {/* Order Details Header */}
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Ordered Items ({totalItems})
          </span>
          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">
            {order.tableNo}
          </span>
        </div>

        {/* Ordered Items List */}
        <div className="space-y-2.5">
          {order.items.map(item => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-zinc-800 p-3 sm:p-3.5 rounded-2xl shadow-xs flex items-center gap-3.5"
            >
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700 shrink-0">
                <img 
                  src={item.menuItem.image} 
                  alt={item.menuItem.name} 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {item.menuItem.name}
                  </h3>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white shrink-0">
                    {formatCurrency(item.menuItem.price * item.quantity)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded-md">
                    {item.quantity}x
                  </span>
                  <span className="text-xs text-gray-400 dark:text-zinc-400">
                    @ {formatCurrency(item.menuItem.price)}
                  </span>
                </div>

                {/* Customizations / Spice info */}
                {(item.notes || (item.spiceLevel !== undefined && item.spiceLevel > 0)) && (
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
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
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add More Items Button */}
        <button
          onClick={onBack}
          className="w-full py-3 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-750 text-gray-800 dark:text-zinc-200 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Still hungry? Add more dishes to this tab</span>
        </button>

        {/* Bill Summary */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              Bill Summary
            </span>
            <span className="text-[11px] font-mono text-gray-400">ID: {order.id}</span>
          </div>

          <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-300">
            <span>Subtotal ({totalItems} items)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-xs text-gray-600 dark:text-zinc-300">
            <span>Restaurant Tax (PPn 11%)</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(order.tax)}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100 dark:border-zinc-700">
            <span className="font-bold text-gray-900 dark:text-white">Total Bill</span>
            <span className={`text-base font-extrabold ${theme.text}`}>
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

      </div>

      {/* Floating Request Bill CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-gray-200/70 dark:border-zinc-800 p-4 z-40">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 h-13 rounded-2xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Dishes</span>
          </button>

          <button 
            type="button"
            onClick={() => setIsBillModalOpen(true)}
            className={`flex-1 h-13 ${theme.primary} ${theme.hover} ${theme.buttonText} font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 transition-all cursor-pointer`}
          >
            <Receipt size={18} />
            <span>Request Bill & Pay</span>
          </button>
        </div>
      </div>

      {/* Request Bill Confirmation Modal */}
      {isBillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div 
            className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-4 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className={theme.text} size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Request Bill & Pay</h3>
              </div>
              <button 
                onClick={() => setIsBillModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
              Confirming will notify our floor staff to bring the printed receipt to <strong>{order.tableNo}</strong> for payment, conclude your order, and automatically clear your browser cookies and table session.
            </p>

            {/* Reconfirmation Summary Card */}
            <div className="p-4 bg-gray-50 dark:bg-zinc-700/50 rounded-2xl space-y-2.5 border border-gray-100 dark:border-zinc-700/60">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400">Table</span>
                <span className="font-bold text-gray-900 dark:text-white bg-white dark:bg-zinc-800 px-2.5 py-1 rounded-lg shadow-xs">
                  {order.tableNo}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 dark:text-zinc-400">Total Items</span>
                <span className="font-semibold text-gray-900 dark:text-white">{totalItems} dishes & drinks</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200/70 dark:border-zinc-600">
                <span className="font-bold text-gray-900 dark:text-white">Total to Pay</span>
                <span className={`text-base font-black ${theme.text}`}>
                  {formatCurrency(order.total)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200/70 dark:border-zinc-600 text-[11px] text-gray-500 dark:text-zinc-400">
                <Cookie size={13} className="text-amber-500 shrink-0" />
                <span>Auto-finishes order and clears browser cookies.</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleConfirmRequestBill}
                className={`w-full h-12 ${theme.primary} ${theme.hover} ${theme.buttonText} font-bold rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md active:scale-98 transition-all cursor-pointer`}
              >
                <BellRing size={17} />
                <span>Confirm Bill & Finish Order</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBillModalOpen(false)}
                className="w-full h-11 bg-gray-100 dark:bg-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-600 text-gray-700 dark:text-zinc-300 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Keep Tab Open (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
