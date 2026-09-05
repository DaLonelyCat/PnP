import { useState } from 'react';
import { CartItem } from '../types';
import { formatCurrency } from '../data';
import { ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartViewProps {
  cart: CartItem[];
  onBack: () => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onPlaceOrder: () => void;
}

export default function CartView({ cart, onBack, onUpdateQuantity, onPlaceOrder }: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-center mb-8">Looks like you haven't added anything to your cart yet.</p>
        <button 
          onClick={onBack}
          className="bg-yellow-400 text-black px-8 py-3 rounded-full font-bold shadow-sm"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800 px-4 py-4 flex items-center gap-4">
        <button onClick={onBack} className="w-10 h-10 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <div className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-full font-medium text-sm">
          Your Cart
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
          <span>Table No : 5</span>
          <span>Order ID : {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map(item => (
            <div key={item.id} className="bg-[#FFF0F0] dark:bg-zinc-800/80 p-3 rounded-2xl flex gap-4 relative">
              <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <img src={item.menuItem.image} alt={item.menuItem.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 py-1">
                <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                  {item.menuItem.name}
                </h3>
                {item.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                    Notes : {item.notes}
                  </p>
                )}
                {!item.notes && item.spiceLevel > 0 && (
                   <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                   Spice level: {item.spiceLevel}
                 </p>
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <span className="font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.menuItem.price)}
                  </span>
                  
                  <div className="flex items-center bg-black dark:bg-black rounded-full px-1 py-1 h-8">
                    <button 
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-white"
                    >
                      <Minus size={14} className="text-red-500"/>
                    </button>
                    <span className="w-6 text-center text-white text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-white"
                    >
                      <Plus size={14} className="text-green-500"/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Promo Code */}
        <div className="flex gap-2 mb-8 relative">
          <input 
            type="text" 
            placeholder="Enter Promo Code" 
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            className="flex-1 h-12 rounded-full border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-6 text-sm focus:outline-none focus:border-yellow-400"
          />
          <button className="absolute right-1 top-1 bottom-1 px-6 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-white text-sm font-bold rounded-full transition-colors hover:bg-gray-200">
            Apply
          </button>
        </div>

        {/* Summary */}
        <div className="bg-[#FFF0F0] dark:bg-zinc-800/80 rounded-2xl p-5 mb-8">
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
            <span>Subtotal of products</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-red-100 dark:border-zinc-700">
            <span>PPn 11%</span>
            <span className="font-bold text-gray-900 dark:text-white">+ {formatCurrency(tax)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-gray-500 dark:text-gray-400">Total</span>
            <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(total)}</span>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-t border-gray-100 dark:border-zinc-800 p-4">
        <button 
          onClick={onPlaceOrder}
          className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-full transition-colors shadow-sm text-lg"
        >
          Order
        </button>
      </div>
    </div>
  );
}
