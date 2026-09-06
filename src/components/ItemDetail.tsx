import { useState } from 'react';
import { MenuItem, RestaurantConfig } from '../types';
import { formatCurrency } from '../data';
import { ArrowLeft, ShoppingCart, Users, Flame, Plus, Minus } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';

interface ItemDetailProps {
  config: RestaurantConfig;
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (quantity: number, notes: string, spiceLevel: number) => void;
}

export default function ItemDetail({ config, item, onBack, onAddToCart }: ItemDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [spiceLevel, setSpiceLevel] = useState(0);
  const theme = getThemeClasses(config.themeColor);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900 overflow-y-auto flex flex-col">
      {/* Hero Image */}
      <div className="relative h-[40vh] w-full shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        
        {/* Top bar over image */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
          <button 
            onClick={onBack}
            className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <button className="h-10 px-4 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-sm font-medium">
            Menu
          </button>
          <button className="w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>

      {/* Content Container (Card overlaying image) */}
      <div className="flex-1 bg-white dark:bg-zinc-900 -mt-6 rounded-t-3xl relative flex flex-col pt-6 pb-24 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="px-6 mb-6">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {item.name}
            </h1>
            <span className={`text-lg font-bold ${theme.text} whitespace-nowrap`}>
              {formatCurrency(item.price)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Info Rows */}
        {(item.calories || item.macros || item.allergens) && (
          <div className="border-t border-gray-100 dark:border-zinc-800">
            <div className="px-6 py-4 space-y-2">
              {item.calories && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Calories</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.calories} kcal</span>
                </div>
              )}
              {item.macros && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Macros</span>
                  <span className="font-medium text-gray-900 dark:text-white">{item.macros}</span>
                </div>
              )}
              {item.allergens && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Allergens</span>
                  <span className="font-medium text-red-500 dark:text-red-400">{item.allergens}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-zinc-800">
          <div className="px-6 py-4 flex items-center gap-4 text-gray-500 dark:text-gray-400">
            <Users size={20} />
            <span className="text-sm font-medium">Feeds 2 - 4 pax</span>
          </div>
        </div>
        <div className="border-t border-b border-gray-100 dark:border-zinc-800">
          <div className="px-6 py-4 flex items-center justify-between text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <Flame size={20} />
              <span className="text-sm font-medium">Spice Level : {spiceLevel}</span>
            </div>
            
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map(level => (
                <button 
                  key={level}
                  onClick={() => setSpiceLevel(level)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors
                    ${level === spiceLevel 
                      ? `${theme.primary} text-white` 
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-400'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="px-6 mt-6">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write note to chef..."
            className={`w-full h-32 ${theme.light} bg-opacity-30 border-0 rounded-2xl p-4 text-sm focus:ring-0 resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400`}
          />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 p-4 flex gap-4 items-center border-t border-gray-100 dark:border-zinc-800">
        <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full h-14 shadow-inner">
          <button onClick={decrement} className="w-12 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors">
            <Minus size={20} />
          </button>
          <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-white">{quantity}</span>
          <button onClick={increment} className={`w-12 h-full flex items-center justify-center ${theme.text} hover:opacity-80 transition-opacity`}>
            <Plus size={20} />
          </button>
        </div>
        
        <button 
          onClick={() => onAddToCart(quantity, notes, spiceLevel)}
          className={`flex-1 ${theme.primary} ${theme.hover} ${theme.buttonText} font-bold h-14 rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm`}
        >
          <ShoppingCart size={20} />
          Add to cart
        </button>
      </div>
    </div>
  );
}
