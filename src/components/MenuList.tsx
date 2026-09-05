import { MenuItem } from '../types';
import { formatCurrency } from '../data';
import { Plus } from 'lucide-react';
import { Instagram, MessageCircle, MapPin } from 'lucide-react';

interface MenuListProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export default function MenuList({ categories, activeCategory, setActiveCategory, items, onItemClick }: MenuListProps) {
  
  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar Categories */}
      <div className="w-24 bg-[#E0AA3E] dark:bg-zinc-800 flex flex-col items-center py-4 overflow-y-auto shrink-0 no-scrollbar rounded-tr-3xl">
        <h2 className="text-sm font-bold text-black dark:text-yellow-500 mb-4 px-2 text-center">Category</h2>
        <div className="flex flex-col gap-3 w-full px-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full py-2 px-1 text-xs font-bold rounded-lg transition-colors ${
                activeCategory === cat 
                  ? 'bg-[#F2C94C] text-black shadow-sm' 
                  : 'bg-transparent text-black/80 hover:bg-[#F2C94C]/50 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="mt-auto pt-8 flex flex-col items-center gap-4">
          <h3 className="text-sm font-bold text-black dark:text-yellow-500">Contacts</h3>
          <a href="#" className="text-black dark:text-zinc-300 hover:opacity-80">
            <Instagram size={24} />
          </a>
          <a href="#" className="text-black dark:text-zinc-300 hover:opacity-80">
            <MessageCircle size={24} />
          </a>
          <a href="#" className="text-black dark:text-zinc-300 hover:opacity-80">
            <MapPin size={24} />
          </a>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="flex-1 bg-white dark:bg-zinc-900 overflow-y-auto px-4 py-4 rounded-tl-3xl shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="space-y-4 pb-20">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-[#F8F9FA] dark:bg-zinc-800/50 p-2 rounded-2xl flex gap-3 cursor-pointer hover:shadow-md transition-shadow relative"
              onClick={() => onItemClick(item)}
            >
              <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.popular && (
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm uppercase">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="flex flex-col justify-between py-1 pr-2 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatCurrency(item.price)}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick(item);
                    }}
                    className="w-7 h-7 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-sm transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center text-gray-500 py-10">
              No items in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
