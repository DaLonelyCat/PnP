import { useState, useMemo } from 'react';
import { MenuItem, RestaurantConfig, CustomizationOption } from '../types';
import { formatCurrency } from '../data';
import { ArrowLeft, ShoppingCart, Users, Flame, Plus, Minus, Info } from 'lucide-react';
import { getThemeClasses } from '../utils/theme';
import { Language, useTranslation } from '../utils/i18n';

interface ItemDetailProps {
  config: RestaurantConfig;
  lang: Language;
  item: MenuItem;
  onBack: () => void;
  onAddToCart: (quantity: number, notes: string, spiceLevel: number, selectedOptions?: Record<string, CustomizationOption>) => void;
}

export default function ItemDetail({ config, lang, item, onBack, onAddToCart }: ItemDetailProps) {
  const t = useTranslation(lang);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [spiceLevel, setSpiceLevel] = useState(0);
  
  // Initialize default options for required groups
  const defaultOptions = useMemo(() => {
    const defaults: Record<string, CustomizationOption> = {};
    item.customizationGroups?.forEach(group => {
      if (group.required && group.options.length > 0) {
        defaults[group.id] = group.options[0];
      }
    });
    return defaults;
  }, [item]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, CustomizationOption>>(defaultOptions);

  const theme = getThemeClasses(config.themeColor);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const handleOptionSelect = (groupId: string, option: CustomizationOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupId]: option
    }));
  };

  // Calculate total price based on base price + selected options price deltas
  const unitPrice = useMemo(() => {
    let total = item.price;
    Object.values(selectedOptions).forEach((opt: CustomizationOption) => {
      total += opt.priceDelta;
    });
    return total;
  }, [item.price, selectedOptions]);

  // Check if all required groups have a selected option
  const isAddToCartDisabled = useMemo(() => {
    if (!item.customizationGroups) return false;
    return item.customizationGroups.some(group => group.required && !selectedOptions[group.id]);
  }, [item.customizationGroups, selectedOptions]);

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
      <div className="flex-1 bg-white dark:bg-zinc-900 -mt-6 rounded-t-3xl relative flex flex-col pt-6 pb-32 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="px-6 mb-6">
          <div className="flex justify-between items-start gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
              {item.name}
            </h1>
            <span className={`text-lg font-bold ${theme.text} whitespace-nowrap`}>
              {formatCurrency(unitPrice)}
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
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('allergens')}</span>
                  <div className="flex flex-wrap gap-1 justify-end">
                    {item.allergens.split(',').map(a => a.trim()).map((allergen, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-md text-xs font-medium">
                        {allergen}
                      </span>
                    ))}
                  </div>
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
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer
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

        {/* Customization Groups */}
        {item.customizationGroups?.map(group => (
          <div key={group.id} className="border-b border-gray-100 dark:border-zinc-800">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-900 dark:text-white">{group.name}</h3>
                {group.required && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${theme.light} ${theme.text}`}>Required</span>
                )}
              </div>
              <div className="space-y-2">
                {group.options.map(opt => (
                  <label key={opt.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50 cursor-pointer hover:border-gray-300 dark:hover:border-zinc-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedOptions[group.id]?.id === opt.id ? `${theme.primary} border-transparent` : 'border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900'}`}>
                        {selectedOptions[group.id]?.id === opt.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">{opt.name}</span>
                    </div>
                    {opt.priceDelta > 0 && (
                      <span className="text-sm text-gray-500 dark:text-zinc-400">+{formatCurrency(opt.priceDelta)}</span>
                    )}
                    <input 
                      type="radio" 
                      name={group.id}
                      className="hidden"
                      checked={selectedOptions[group.id]?.id === opt.id}
                      onChange={() => handleOptionSelect(group.id, opt)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Notes */}
        <div className="px-6 mt-6">
          <label className="text-sm font-bold text-gray-900 dark:text-white mb-2 block">Special Instructions</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.substring(0, 120))} // Enforce length limit
            placeholder="Write note to chef (optional, max 120 chars)..."
            className={`w-full h-24 ${theme.light} bg-opacity-30 border border-gray-200 dark:border-zinc-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10 resize-none text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none`}
            maxLength={120}
          />
          <div className="text-right mt-1 text-[10px] text-gray-400">
            {notes.length}/120
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 p-4 flex gap-4 items-center border-t border-gray-100 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-full h-14 shadow-inner">
          <button onClick={decrement} className="w-12 h-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 transition-colors cursor-pointer">
            <Minus size={20} />
          </button>
          <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-white">{quantity}</span>
          <button onClick={increment} className={`w-12 h-full flex items-center justify-center ${theme.text} hover:opacity-80 transition-opacity cursor-pointer`}>
            <Plus size={20} />
          </button>
        </div>
        
        <button 
          onClick={() => {
            // strip HTML from notes for security
            const sanitizedNotes = notes.replace(/<[^>]*>?/gm, '');
            onAddToCart(quantity, sanitizedNotes, spiceLevel, Object.keys(selectedOptions).length > 0 ? selectedOptions : undefined);
          }}
          disabled={isAddToCartDisabled}
          className={`flex-1 ${isAddToCartDisabled ? 'bg-gray-300 dark:bg-zinc-700 text-gray-500 cursor-not-allowed' : `${theme.primary} ${theme.hover} ${theme.buttonText} cursor-pointer shadow-sm`} font-bold h-14 rounded-full flex items-center justify-center gap-2 transition-colors`}
        >
          <ShoppingCart size={20} />
          {isAddToCartDisabled ? 'Select Options' : `Add ${formatCurrency(unitPrice * quantity)}`}
        </button>
      </div>
    </div>
  );
}
