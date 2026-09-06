import { useState, useRef } from 'react';
import { MenuItem, RestaurantConfig } from '../types';
import { formatCurrency } from '../data';
import { getThemeClasses } from '../utils/theme';
import { 
  Plus, 
  Instagram, 
  MessageCircle, 
  MapPin, 
  Search, 
  Star, 
  Flame, 
  X, 
  ArrowUpDown, 
  UtensilsCrossed, 
  Check, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

interface MenuListProps {
  config: RestaurantConfig;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export default function MenuList({ 
  config, 
  categories, 
  activeCategory, 
  setActiveCategory, 
  items, 
  onItemClick 
}: MenuListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'default' | 'price-asc' | 'price-desc' | 'popular'>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const theme = getThemeClasses(config.themeColor);

  let filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (sortOption === 'price-asc') {
    filteredItems.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredItems.sort((a, b) => b.price - a.price);
  } else if (sortOption === 'popular') {
    filteredItems.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  // Category counts
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return items.length;
    return items.filter(i => i.category === cat).length;
  };

  // Scroll to section in 'sections' layout
  const scrollToCategorySection = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = sectionRefs.current[cat];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Common Search & Sort Component
  const renderSearchAndSort = (extraClass = "px-4 sm:px-6 mb-3") => (
    <div className={`${extraClass} flex gap-2.5 relative`}>
      <div className={`flex-1 ${theme.cardClass} rounded-2xl h-12 flex items-center px-4 gap-2.5 shadow-xs border ${theme.cardBorder} focus-within:ring-2 focus-within:ring-gray-300 dark:focus-within:ring-zinc-600 transition-all`}>
        <Search size={18} className="text-gray-400 shrink-0" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes, drinks, ingredients..."
          className="flex-1 w-full bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 cursor-pointer"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {/* Sort Dropdown */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setIsSortOpen(!isSortOpen)}
          className={`h-12 px-3.5 rounded-2xl ${theme.cardClass} border ${theme.cardBorder} flex items-center gap-2 shadow-xs text-xs font-semibold transition-all hover:bg-gray-50 dark:hover:bg-zinc-700/60 cursor-pointer ${
            sortOption !== 'default' 
              ? `${theme.text} font-bold` 
              : 'text-gray-700 dark:text-zinc-200'
          }`}
        >
          <ArrowUpDown size={14} className={sortOption !== 'default' ? theme.text : 'text-gray-400'} />
          <span>
            {sortOption === 'default' ? 'Sort' : sortOption === 'popular' ? 'Popular' : sortOption === 'price-asc' ? 'Price ↑' : 'Price ↓'}
          </span>
        </button>

        {isSortOpen && (
          <>
            <div 
              className="fixed inset-0 z-20" 
              onClick={() => setIsSortOpen(false)} 
            />
            <div className={`absolute right-0 top-14 z-30 w-48 ${theme.cardClass} rounded-2xl shadow-xl border ${theme.cardBorder} p-1.5 animate-in fade-in zoom-in-95 duration-100`}>
              <div className="text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500 px-3 py-1.5">
                Sort Dishes
              </div>
              {[
                { value: 'default', label: 'Default Order' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
              ].map(option => {
                const isSelected = sortOption === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortOption(option.value as any);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left cursor-pointer ${
                      isSelected 
                        ? `${theme.light} ${theme.text}` 
                        : 'text-gray-700 dark:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-700/60'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={14} className={theme.text} />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Common Category Horizontal Tabs
  const renderHorizontalCategories = () => (
    <div className="flex overflow-x-auto gap-2 px-4 sm:px-6 pb-3 pt-1 no-scrollbar scroll-smooth">
      {categories.map(cat => {
        const count = getCategoryCount(cat);
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              isActive 
                ? `${theme.primary} ${theme.btnText} shadow-xs font-bold` 
                : `${theme.cardClass} text-gray-600 dark:text-zinc-300 border ${theme.cardBorder} hover:opacity-80`
            }`}
          >
            <span>{cat}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              isActive 
                ? 'bg-black/15 dark:bg-white/20' 
                : 'bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400'
            }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );

  // Common Empty State
  const renderEmptyState = () => (
    <div className={`mx-4 sm:px-6 mt-6 p-10 ${theme.cardClass} rounded-2xl border ${theme.cardBorder} text-center flex flex-col items-center justify-center shadow-xs`}>
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-gray-400 mb-3">
        <UtensilsCrossed size={22} />
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">No dishes found</h3>
      <p className="text-xs text-gray-500 dark:text-zinc-400 max-w-xs mb-4">
        {searchQuery 
          ? `We couldn't find any dishes matching "${searchQuery}".` 
          : `No dishes found in category ${activeCategory}.`}
      </p>
      <button
        type="button"
        onClick={() => {
          setSearchQuery('');
          setActiveCategory('All');
        }}
        className={`px-4 py-2 rounded-xl text-xs font-bold ${theme.primary} ${theme.btnText} transition-all shadow-xs cursor-pointer`}
      >
        Reset Filters
      </button>
    </div>
  );

  // ==========================================
  // 1. SIDEBAR LAYOUT
  // ==========================================
  if (config.layout === 'sidebar') {
    return (
      <div className={`flex h-[calc(100vh-64px)] overflow-hidden ${theme.bgClass}`}>
        {/* Modern Sidebar Categories */}
        <aside className={`w-24 sm:w-28 shrink-0 ${theme.cardClass} border-r ${theme.cardBorder} flex flex-col items-center py-4 overflow-y-auto no-scrollbar shadow-xs z-20`}>
          <div className="flex flex-col gap-2 w-full px-2">
            {categories.map(cat => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full py-2.5 px-1.5 rounded-2xl transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isActive 
                      ? `${theme.primary} ${theme.btnText} font-bold shadow-xs scale-[1.02]` 
                      : 'bg-transparent text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="text-xs tracking-tight text-center leading-tight">
                    {cat}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive 
                      ? 'bg-black/15 dark:bg-white/20 font-bold' 
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-auto pt-6 flex flex-col items-center gap-4">
            <div className="w-8 h-[1px] bg-gray-200 dark:bg-zinc-800"></div>
            <a href="#" className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors" aria-label="Contact">
              <MessageCircle size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 transition-colors" aria-label="Location">
              <MapPin size={16} />
            </a>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={`flex-1 ${theme.bgClass} overflow-y-auto px-4 sm:px-6 py-4 no-scrollbar`}>
          {renderSearchAndSort("mb-4")}

          <div className="mb-3.5 flex justify-between items-center">
            <div>
              <h2 className={`text-lg font-black ${theme.title} leading-tight`}>
                {activeCategory === 'All' ? 'All Menu Items' : `${activeCategory} Specials`}
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                Showing {filteredItems.length} dishes
              </p>
            </div>
            {sortOption !== 'default' && (
              <span className={`text-[11px] font-bold ${theme.text}`}>
                {sortOption === 'popular' ? 'Popular first' : sortOption === 'price-asc' ? 'Lowest price' : 'Highest price'}
              </span>
            )}
          </div>
          
          <div className="space-y-3 pb-32">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`${theme.cardClass} p-3 rounded-2xl flex gap-3.5 cursor-pointer hover:shadow-md transition-all shadow-xs border ${theme.cardBorder} group relative`}
                onClick={() => onItemClick(item)}
              >
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-700">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    loading="lazy"
                  />
                  {item.popular && (
                    <span className="absolute top-1.5 left-1.5 bg-black/65 dark:bg-black/75 backdrop-blur-md text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Flame size={10} className="fill-amber-400 text-amber-400" /> Pop
                    </span>
                  )}
                  {item.calories && (
                    <span className="absolute bottom-1.5 left-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-gray-700 dark:text-zinc-300 text-[8px] font-semibold px-1.5 py-0.5 rounded shadow-xs">
                      {item.calories} kcal
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col justify-between py-0.5 flex-1 min-w-0">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-gray-400 dark:text-zinc-500">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white leading-tight truncate group-hover:opacity-80 transition-opacity">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-1.5">
                    <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemClick(item);
                      }}
                      className={`w-8 h-8 ${theme.primary} ${theme.btnText} hover:opacity-90 active:scale-90 rounded-xl flex items-center justify-center shadow-xs transition-transform cursor-pointer`}
                      aria-label={`Select ${item.name}`}
                    >
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && renderEmptyState()}
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // 2. COMPACT / BISTRO DENSE LIST LAYOUT
  // ==========================================
  if (config.layout === 'compact') {
    return (
      <div className={`flex flex-col min-h-[calc(100vh-64px)] ${theme.bgClass} pt-2 pb-28`}>
        {renderSearchAndSort()}
        {renderHorizontalCategories()}

        <div className="px-4 sm:px-6 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-zinc-400">
          <span className="font-medium">
            {activeCategory === 'All' ? 'Bistro Menu' : activeCategory} • {filteredItems.length} items
          </span>
          {sortOption !== 'default' && (
            <span className={`font-semibold ${theme.text}`}>
              Sorted by {sortOption === 'popular' ? 'Popular' : sortOption === 'price-asc' ? 'Price ↑' : 'Price ↓'}
            </span>
          )}
        </div>

        {/* Compact Dense Rows */}
        <div className="px-4 sm:px-6 space-y-2.5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={`${theme.cardClass} p-3 rounded-2xl flex items-center gap-3.5 border ${theme.cardBorder} hover:shadow-md transition-all cursor-pointer group shadow-xs`}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-700 relative">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy" 
                />
                {item.popular && (
                  <span className="absolute bottom-1 left-1 bg-black/70 text-amber-300 text-[8px] font-bold px-1 rounded">
                    ★
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {item.name}
                  </h3>
                  {item.popular && (
                    <span className="text-[10px] text-amber-500 font-bold shrink-0">Popular</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {item.calories && (
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500">
                      {item.calories} kcal
                    </span>
                  )}
                  {item.allergens && (
                    <span className="text-[10px] text-gray-400 dark:text-zinc-500 truncate">
                      • {item.allergens}
                    </span>
                  )}
                </div>
              </div>

              {/* Price & Add Action */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm sm:text-base font-black text-gray-900 dark:text-white">
                  {formatCurrency(item.price)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                  className={`w-8 h-8 rounded-xl ${theme.primary} ${theme.btnText} hover:opacity-90 active:scale-95 flex items-center justify-center shadow-xs cursor-pointer`}
                  aria-label={`Select ${item.name}`}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && renderEmptyState()}
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. SHOWCASE / MAGAZINE HERO LAYOUT
  // ==========================================
  if (config.layout === 'showcase') {
    return (
      <div className={`flex flex-col min-h-[calc(100vh-64px)] ${theme.bgClass} pt-2 pb-28`}>
        {renderSearchAndSort()}
        {renderHorizontalCategories()}

        <div className="px-4 sm:px-6 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className={theme.text} />
            <span className="font-bold text-gray-900 dark:text-white">
              Chef's Culinary Showcase ({filteredItems.length})
            </span>
          </div>
          {sortOption !== 'default' && (
            <span className={`font-semibold ${theme.text}`}>
              Sorted by {sortOption === 'popular' ? 'Popularity' : sortOption === 'price-asc' ? 'Price ↑' : 'Price ↓'}
            </span>
          )}
        </div>

        {/* Large Hero Photography Cards */}
        <div className="px-4 sm:px-6 space-y-6 max-w-3xl mx-auto w-full">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => onItemClick(item)}
              className={`${theme.cardClass} rounded-3xl overflow-hidden border ${theme.cardBorder} shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col`}
            >
              {/* 16:9 Hero Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 dark:bg-zinc-800">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>

                  {item.popular && (
                    <span className="bg-amber-400 text-zinc-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                      <Flame size={13} className="fill-zinc-950" /> Chef's Choice
                    </span>
                  )}
                </div>

                {/* Bottom Overlay Title & Price */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black drop-shadow-md leading-tight">
                      {item.name}
                    </h3>
                    {item.calories && (
                      <span className="text-xs text-gray-200 drop-shadow-sm font-medium">
                        {item.calories} kcal {item.macros && `• ${item.macros}`}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-lg sm:text-xl font-black drop-shadow-md">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Description & Quick Add Footer */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-zinc-300 leading-relaxed flex-1">
                  {item.description}
                </p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                  className={`px-5 py-2.5 rounded-2xl ${theme.primary} ${theme.btnText} font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 shadow-sm transition-all cursor-pointer shrink-0`}
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Customize & Order</span>
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && renderEmptyState()}
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. SECTIONS / CONTINUOUS CATEGORIZED FLOW
  // ==========================================
  if (config.layout === 'sections') {
    // Categories to display
    const targetCategories = activeCategory === 'All' 
      ? categories.filter(c => c !== 'All') 
      : [activeCategory];

    return (
      <div className={`flex flex-col min-h-[calc(100vh-64px)] ${theme.bgClass} pt-2 pb-28`}>
        {renderSearchAndSort()}
        
        {/* Sticky Category Quick Jump Anchor Bar */}
        <div className={`sticky top-14 z-30 ${theme.bgClass} py-2 border-b ${theme.cardBorder} backdrop-blur-md`}>
          <div className="flex overflow-x-auto gap-2 px-4 sm:px-6 no-scrollbar">
            {categories.map(cat => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategorySection(cat)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                    isActive 
                      ? `${theme.primary} ${theme.btnText} shadow-xs` 
                      : `${theme.cardClass} text-gray-600 dark:text-zinc-300 border ${theme.cardBorder} hover:opacity-80`
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] opacity-70">
                    ({getCategoryCount(cat)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continuous Categorized Sections */}
        <div className="px-4 sm:px-6 mt-4 space-y-8">
          {targetCategories.map(cat => {
            const catItems = items.filter(item => {
              const matchesCat = item.category === cat;
              const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    item.description.toLowerCase().includes(searchQuery.toLowerCase());
              return matchesCat && matchesSearch;
            });

            if (catItems.length === 0 && searchQuery) return null;

            return (
              <div 
                key={cat} 
                ref={(el) => (sectionRefs.current[cat] = el)}
                className="scroll-mt-32"
              >
                {/* Category Section Header */}
                <div className="flex items-center justify-between mb-3 pb-1 border-b border-gray-200/60 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-black ${theme.title}`}>
                      {cat}
                    </h2>
                    <span className="text-xs text-gray-400 font-medium">
                      ({catItems.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    Section
                  </span>
                </div>

                {/* Section Items Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {catItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`${theme.cardClass} rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col group relative border ${theme.cardBorder}`}
                      onClick={() => onItemClick(item)}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-700">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy" 
                        />
                        {item.popular && (
                          <span className="absolute top-2 left-2 bg-black/60 dark:bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Flame size={11} className="fill-amber-400 text-amber-400" /> Pop
                          </span>
                        )}
                      </div>
                      
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:opacity-80 transition-opacity">
                          {item.name}
                        </h3>

                        <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-1 mb-3 flex-1">
                          {item.description}
                        </p>

                        <div className="flex justify-between items-center pt-2 mt-auto">
                          <span className="text-sm font-extrabold text-gray-900 dark:text-white">
                            {formatCurrency(item.price)}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onItemClick(item);
                            }}
                            className={`w-7 h-7 ${theme.primary} ${theme.btnText} hover:opacity-90 active:scale-90 rounded-xl flex items-center justify-center shadow-xs transition-transform cursor-pointer`}
                            aria-label={`Select ${item.name}`}
                          >
                            <Plus size={15} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && renderEmptyState()}
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. DEFAULT GRID LAYOUT
  // ==========================================
  return (
    <div className={`flex flex-col min-h-[calc(100vh-64px)] ${theme.bgClass} pt-2 pb-28`}>
      {renderSearchAndSort()}
      {renderHorizontalCategories()}

      {/* Section Header */}
      <div className="px-4 sm:px-6 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-zinc-400">
        <span>
          {activeCategory === 'All' ? 'All Dishes' : activeCategory} ({filteredItems.length})
        </span>
        {sortOption !== 'default' && (
          <span className={`font-semibold ${theme.text}`}>
            Sorted by {sortOption === 'popular' ? 'Popularity' : sortOption === 'price-asc' ? 'Lowest Price' : 'Highest Price'}
          </span>
        )}
      </div>

      {/* Grid Items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 px-4 sm:px-6">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            className={`${theme.cardClass} rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col group relative border ${theme.cardBorder}`}
            onClick={() => onItemClick(item)}
          >
            {/* Image Area with 4:3 Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-zinc-700">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy" 
              />
              
              {item.popular && (
                <span className="absolute top-2 left-2 bg-black/60 dark:bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Flame size={11} className="fill-amber-400 text-amber-400" />
                  Popular
                </span>
              )}

              {item.calories && (
                <span className="absolute top-2 right-2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md text-gray-700 dark:text-zinc-300 text-[9px] font-medium px-1.5 py-0.5 rounded-md shadow-xs">
                  {item.calories} kcal
                </span>
              )}
            </div>
            
            {/* Card Body */}
            <div className="p-3 sm:p-3.5 flex flex-col flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-zinc-500">
                  {item.category}
                </span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:opacity-80 transition-opacity">
                {item.name}
              </h3>

              <p className="text-[11px] text-gray-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mt-1 mb-3 flex-1">
                {item.description}
              </p>

              {/* Price & Add to Cart Button */}
              <div className="flex justify-between items-center pt-2 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-medium">Price</span>
                  <span className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemClick(item);
                  }}
                  className={`w-8 h-8 ${theme.primary} ${theme.btnText} hover:opacity-90 active:scale-90 rounded-xl flex items-center justify-center shadow-xs transition-transform cursor-pointer`}
                  aria-label={`Select ${item.name}`}
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && renderEmptyState()}
    </div>
  );
}
