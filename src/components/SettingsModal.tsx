import { useState, FormEvent } from 'react';
import { 
  X, 
  Palette, 
  Layout, 
  Building2, 
  UtensilsCrossed, 
  Copy, 
  Check, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Star,
  DollarSign,
  Layers,
  Sparkles,
  Percent,
  Hash,
  Edit2
} from 'lucide-react';
import { RestaurantConfig, MenuItem, ThemeColorTemplate, MenuLayoutPattern } from '../types';
import { THEME_TEMPLATES, getThemeClasses } from '../utils/theme';
import { Language, useTranslation } from '../utils/i18n';

interface SettingsModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  config: RestaurantConfig;
  onUpdateConfig: (newConfig: RestaurantConfig) => void;
  menuItems: MenuItem[];
  onUpdateMenuItems: (items: MenuItem[]) => void;
  categories: string[];
  onUpdateCategories: (categories: string[]) => void;
  onResetToDefaults: () => void;
}

type TabKey = 'colors' | 'layout' | 'naming' | 'menu' | 'export';

const LAYOUT_OPTIONS: { id: MenuLayoutPattern; name: string; tag: string; description: string }[] = [
  {
    id: 'grid',
    name: 'Photo Card Grid',
    tag: 'Cafes & Bakeries',
    description: 'Modern 2 to 4 responsive columns with rich 4:3 food photography cards'
  },
  {
    id: 'sidebar',
    name: 'Category Sidebar',
    tag: 'Izakayas & Ramen Bars',
    description: 'Persistent left category drawer with live counters and social links'
  },
  {
    id: 'compact',
    name: 'Bistro Dense List',
    tag: 'Diners & Quick Service',
    description: 'Streamlined horizontal rows with fast visual scanning for dense menus'
  },
  {
    id: 'showcase',
    name: 'Magazine Hero Showcase',
    tag: 'Fine Dining & Steakhouses',
    description: 'Cinematic 16:9 hero photography cards with chef highlights and badges'
  },
  {
    id: 'sections',
    name: 'Categorized Continuous Flow',
    tag: 'All-Day Dining & Bistros',
    description: 'Continuous vertical sections with top sticky jump anchors'
  }
];

export default function SettingsModal({
  lang,
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  menuItems,
  onUpdateMenuItems,
  categories,
  onUpdateCategories,
  onResetToDefaults
}: SettingsModalProps) {
  const t = useTranslation(lang);
  const [activeTab, setActiveTab] = useState<TabKey>('colors');
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedMenu, setCopiedMenu] = useState(false);

  // Dynamic theme derived from active configuration
  const theme = getThemeClasses(config.themeColor);

  // Edit Dish State
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editDishName, setEditDishName] = useState('');
  const [editDishCategory, setEditDishCategory] = useState('');
  const [editDishPrice, setEditDishPrice] = useState<number | ''>('');
  const [editDishDesc, setEditDishDesc] = useState('');
  const [editDishImage, setEditDishImage] = useState('');
  const [editDishPopular, setEditDishPopular] = useState(false);
  const [editDishAllergens, setEditDishAllergens] = useState<string[]>([]);
  const [editDishCalories, setEditDishCalories] = useState<number | ''>('');

  // New Dish Form State
  const [isAddingDish, setIsAddingDish] = useState(false);
  const [newDishName, setNewDishName] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(categories[1] || 'Rice');
  const [newDishPrice, setNewDishPrice] = useState<number>(35000);
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishImage, setNewDishImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop');
  const [newDishPopular, setNewDishPopular] = useState(false);
  const [newDishAllergens, setNewDishAllergens] = useState<string[]>([]);
  const [newDishCalories, setNewDishCalories] = useState<number | ''>('');

  // New Category State
  const [newCategoryInput, setNewCategoryInput] = useState('');

  if (!isOpen) return null;
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  // Handlers for config
  const updateConfigField = <K extends keyof RestaurantConfig>(field: K, value: RestaurantConfig[K]) => {
    onUpdateConfig({
      ...config,
      [field]: value
    });
  };

  // Dish Handlers
  const handleTogglePopular = (id: string) => {
    const updated = menuItems.map(item => 
      item.id === id ? { ...item, popular: !item.popular } : item
    );
    onUpdateMenuItems(updated);
  };

  const handleUpdatePrice = (id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    const updated = menuItems.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    );
    onUpdateMenuItems(updated);
  };

  const handleDeleteDish = (id: string) => {
    onUpdateMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleEditDishInit = (item: MenuItem) => {
    setEditingDishId(item.id);
    setEditDishName(item.name);
    setEditDishCategory(item.category);
    setEditDishPrice(item.price);
    setEditDishDesc(item.description);
    setEditDishImage(item.image);
    setEditDishPopular(!!item.popular);
    setEditDishAllergens(item.allergens ? item.allergens.split(',').map(s=>s.trim()) : []);
    setEditDishCalories(item.calories || '');
  };

  const handleEditDishSave = (e: FormEvent) => {
    e.preventDefault();
    if (!editDishName.trim() || !editingDishId) return;

    const updatedDish: MenuItem = {
      ...(menuItems.find(i => i.id === editingDishId) as MenuItem),
      name: editDishName.trim(),
      category: editDishCategory,
      price: Number(editDishPrice) || 20000,
      description: editDishDesc.trim(),
      image: editDishImage.trim(),
      popular: editDishPopular,
      allergens: editDishAllergens.length > 0 ? editDishAllergens.join(', ') : undefined,
      calories: typeof editDishCalories === 'number' && editDishCalories > 0 ? editDishCalories : undefined,
    };

    onUpdateMenuItems(menuItems.map(item => item.id === editingDishId ? updatedDish : item));
    setEditingDishId(null);
  };

  const handleCreateDish = (e: FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const newDish: MenuItem = {
      id: `custom-${Date.now()}`,
      name: newDishName.trim(),
      category: newDishCategory,
      price: Number(newDishPrice) || 20000,
      description: newDishDesc.trim() || 'Freshly prepared specialty dish.',
      image: newDishImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
      popular: newDishPopular,
      ...(newDishAllergens.length > 0 ? { allergens: newDishAllergens.join(', ') } : {}),
      ...(typeof newDishCalories === 'number' && newDishCalories > 0 ? { calories: newDishCalories } : {})
    };

    onUpdateMenuItems([newDish, ...menuItems]);
    setIsAddingDish(false);
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPopular(false);
    setNewDishAllergens([]);
    setNewDishCalories('');
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onUpdateCategories([...categories, trimmed]);
    setNewCategoryInput('');
  };

  // Copy Config JSON
  const handleCopyConfig = () => {
    const exportable = {
      name: config.name,
      tagline: config.tagline,
      description: config.description,
      themeColor: config.themeColor,
      layout: config.layout,
      tableNumber: config.tableNumber,
      currencySymbol: config.currencySymbol,
      taxRate: config.taxRate
    };
    navigator.clipboard.writeText(JSON.stringify(exportable, null, 2));
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2500);
  };

  // Copy Menu JSON
  const handleCopyMenu = () => {
    const exportable = {
      restaurant: {
        name: config.name,
        tagline: config.tagline,
        description: config.description
      },
      categories,
      items: menuItems
    };
    navigator.clipboard.writeText(JSON.stringify(exportable, null, 2));
    setCopiedMenu(true);
    setTimeout(() => setCopiedMenu(false), 2500);
  };

  return (
    <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className={`w-full max-w-3xl max-h-[92vh] ${theme.cardClass} rounded-3xl shadow-2xl flex flex-col border ${theme.cardBorder} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-5 sm:px-6 py-4 border-b ${theme.cardBorder} flex items-center justify-between ${theme.cardClass}`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl ${theme.primary} ${theme.btnText} flex items-center justify-center shadow-xs`}>
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {t('liveCustomizer')}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${theme.light} ${theme.text}`}>
                  {t('tempTesting')}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                {t('liveDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-zinc-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`px-5 sm:px-6 pt-2 border-b ${theme.cardBorder} ${theme.cardClass} flex gap-1 overflow-x-auto no-scrollbar`}>
          {[
            { id: 'colors', label: t('colorsTab13'), icon: Palette },
            { id: 'layout', label: t('layoutsTab5'), icon: Layout },
            { id: 'naming', label: t('namingTab'), icon: Building2 },
            { id: 'menu', label: t('menuTab'), icon: UtensilsCrossed },
            { id: 'export', label: t('exportTab'), icon: Copy }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                  isActive
                    ? `${theme.border} ${theme.text} font-black`
                    : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Select Visual Palette (13 Color Themes)
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Click any palette to instantly apply it to the restaurant header, cards, background, and buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_TEMPLATES.map(tmpl => {
                  const isSelected = config.themeColor === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => updateConfigField('themeColor', tmpl.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? `${theme.border} ring-2 ring-black/10 dark:ring-white/10 ${theme.light} shadow-xs`
                          : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white hover:bg-gray-50/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Swatch Preview Pill */}
                        <div 
                          className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-xs border border-black/10"
                          style={{ backgroundColor: tmpl.swatchPrimary }}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-white/60 shadow-xs" 
                            style={{ backgroundColor: tmpl.swatchBg }}
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-gray-900 dark:text-white">
                              {tmpl.name}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-zinc-300">
                              {tmpl.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-snug">
                            {tmpl.tagline}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full ${theme.primary} ${theme.btnText} flex items-center justify-center shrink-0`}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LAYOUT */}
          {activeTab === 'layout' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Select Menu Presentation Archetype (5 Layouts)
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Change the structural layout of dishes and navigation for your restaurant concept.
                </p>
              </div>

              <div className="space-y-3">
                {LAYOUT_OPTIONS.map(opt => {
                  const isSelected = config.layout === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateConfigField('layout', opt.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start justify-between gap-4 cursor-pointer ${
                        isSelected
                          ? `${theme.border} ring-2 ring-black/10 dark:ring-white/10 ${theme.light} shadow-xs`
                          : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 bg-white hover:bg-gray-50/80 dark:bg-zinc-800/80 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-gray-900 dark:text-white">
                            {opt.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed">
                          {opt.description}
                        </p>
                      </div>

                      {isSelected && (
                        <div className={`w-6 h-6 rounded-full ${theme.primary} ${theme.btnText} flex items-center justify-center shrink-0 mt-0.5`}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: NAMING & INFO */}
          {activeTab === 'naming' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Restaurant Identity & Dining Parameters
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Update the restaurant name, tagline, table number, currency, and tax rate.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* {t('restaurantName')} */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Building2 size={14} className={theme.text} />
                    {t('restaurantName')}
                  </label>
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => updateConfigField('name', e.target.value)}
                    placeholder="e.g. RestoKu"
                    className={`w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border}`}
                  />
                </div>

                {/* {t('tagline')} */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                    {t('tagline')} / Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.tagline || ''}
                    onChange={(e) => updateConfigField('tagline', e.target.value)}
                    placeholder="e.g. Authentic Asian & Local Fusion Street Food"
                    className={`w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border}`}
                  />
                </div>

                {/* Welcome Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300">
                    Welcome Description
                  </label>
                  <textarea
                    rows={2}
                    value={config.description || ''}
                    onChange={(e) => updateConfigField('description', e.target.value)}
                    placeholder="e.g. Authentic local flavors served fresh daily. Scan, order, and enjoy!"
                    className={`w-full p-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border} resize-none`}
                  />
                </div>

                {/* {t('tableNumber')} */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <Hash size={14} className={theme.text} />
                    Table Identifier
                  </label>
                  <input
                    type="text"
                    value={config.tableNumber || '12'}
                    onChange={(e) => updateConfigField('tableNumber', e.target.value)}
                    placeholder="e.g. 12 or Table 4"
                    className={`w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border}`}
                  />
                </div>

                {/* {t('currencySymbol')} */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                    <DollarSign size={14} className={theme.text} />
                    {t('currencySymbol')}
                  </label>
                  <input
                    type="text"
                    value={config.currencySymbol || 'Rp '}
                    onChange={(e) => updateConfigField('currencySymbol', e.target.value)}
                    placeholder="e.g. Rp or $ or € "
                    className={`w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border}`}
                  />
                </div>

                {/* Tax Rate */}
                <div className="space-y-1.5 sm:col-span-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <Percent size={14} className={theme.text} />
                      Tax Rate ({Math.round(((config.taxRate ?? 0.1) * 100))}% )
                    </label>
                    <span className="text-[11px] font-mono text-gray-500">
                      Multiplier: {config.taxRate ?? 0.1}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={config.taxRate ?? 0.1}
                    onChange={(e) => updateConfigField('taxRate', parseFloat(e.target.value) || 0)}
                    className={`w-full h-11 px-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/15 focus:${theme.border}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MENU & DISHES */}
          {activeTab === 'menu' && (
            <div className="space-y-5">
              {/* Category Management */}
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Layers size={14} className={theme.text} />
                    Categories ({categories.length})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categories.map(cat => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-zinc-700 text-xs font-semibold text-gray-800 dark:text-zinc-200 border border-gray-200/80 dark:border-zinc-600 shadow-xs"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="New category name (e.g. Desserts)..."
                    className="flex-1 h-9 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className={`px-3 h-9 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold flex items-center gap-1 cursor-pointer transition-opacity hover:opacity-90`}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Add New Dish Accordion */}
              <div>
                {!isAddingDish ? (
                  <button
                    type="button"
                    onClick={() => setIsAddingDish(true)}
                    className={`w-full py-2.5 rounded-2xl border-2 border-dashed border-gray-300 dark:border-zinc-700 hover:${theme.border} hover:${theme.text} text-xs font-bold text-gray-700 dark:text-zinc-300 flex items-center justify-center gap-2 transition-colors cursor-pointer`}
                  >
                    <Plus size={15} />
                    <span>{t('addNewMenuItem')}</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateDish} className={`p-4 rounded-2xl ${theme.light} border ${theme.cardBorder} space-y-3`}>
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs font-bold ${theme.text}`}>
                        {t('addNewMenuItem')}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsAddingDish(false)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-xs"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newDishName}
                        onChange={(e) => setNewDishName(e.target.value)}
                        placeholder="Dish name (e.g. Sate Ayam Madura)..."
                        className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      />

                      <select
                        value={newDishCategory}
                        onChange={(e) => setNewDishCategory(e.target.value)}
                        className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>

                      <input
                        type="number"
                        value={newDishPrice}
                        onChange={(e) => setNewDishPrice(Number(e.target.value))}
                        placeholder="Price numeric (e.g. 45000)..."
                        className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      />

                      <input
                        type="url"
                        value={newDishImage}
                        onChange={(e) => setNewDishImage(e.target.value)}
                        placeholder="Image URL..."
                        className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      />

                      <input
                        type="text"
                        value={newDishDesc}
                        onChange={(e) => setNewDishDesc(e.target.value)}
                        placeholder="Short description..."
                        className="sm:col-span-2 h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      />

                      <input
                        type="number"
                        value={newDishCalories}
                        onChange={(e) => setNewDishCalories(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Calories (e.g. 450)..."
                        className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                      />

                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] uppercase font-bold text-gray-500">{t('allergens')}</label>
                        <div className="flex flex-wrap gap-2">
                          {['Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy', 'Egg', 'Fish'].map(allergen => (
                            <label key={allergen} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${newDishAllergens.includes(allergen) ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-gray-400'}`}>
                              <input 
                                type="checkbox" 
                                className="hidden" 
                                checked={newDishAllergens.includes(allergen)}
                                onChange={(e) => {
                                  if (e.target.checked) setNewDishAllergens([...newDishAllergens, allergen]);
                                  else setNewDishAllergens(newDishAllergens.filter(a => a !== allergen));
                                }}
                              />
                              {allergen}
                            </label>
                          ))}
                        </div>
                      </div>

                      <label className="sm:col-span-2 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newDishPopular}
                          onChange={(e) => setNewDishPopular(e.target.checked)}
                          className="rounded"
                        />
                        <span>Mark as Popular / Chef Highlight</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer`}
                    >
                      Save Dish to Active Menu
                    </button>
                  </form>
                )}
              </div>

              {/* Existing Dishes List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                    Active Menu Items ({menuItems.length})
                  </h4>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {menuItems.map(item => {
                    if (editingDishId === item.id) {
                      return (
                        <form key={item.id} onSubmit={handleEditDishSave} className={`p-4 rounded-2xl ${theme.light} border ${theme.cardBorder} space-y-3`}>
                          <div className="flex items-center justify-between">
                            <h4 className={`text-xs font-bold ${theme.text}`}>{t('editDish')}</h4>
                            <button
                              type="button"
                              onClick={() => setEditingDishId(null)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={editDishName}
                              onChange={(e) => setEditDishName(e.target.value)}
                              placeholder={t('dishName')}
                              className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                              required
                            />
                            <div className="flex gap-2">
                              <span className="h-10 flex items-center justify-center px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-500 text-xs">
                                {config.currencySymbol}
                              </span>
                              <input
                                type="number"
                                value={editDishPrice}
                                onChange={(e) => setEditDishPrice(e.target.value ? Number(e.target.value) : '')}
                                placeholder={t('price')}
                                className="flex-1 h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                                required
                              />
                            </div>
                            <input
                              type="text"
                              value={editDishCategory}
                              onChange={(e) => setEditDishCategory(e.target.value)}
                              placeholder={t('category')}
                              className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                              required
                            />
                            <input
                              type="text"
                              value={editDishImage}
                              onChange={(e) => setEditDishImage(e.target.value)}
                              placeholder="Image URL"
                              className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                            />
                            <textarea
                              value={editDishDesc}
                              onChange={(e) => setEditDishDesc(e.target.value)}
                              placeholder={t('description')}
                              className="sm:col-span-2 h-10 px-3 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white resize-none"
                            />
                            <input
                              type="number"
                              value={editDishCalories}
                              onChange={(e) => setEditDishCalories(e.target.value ? Number(e.target.value) : '')}
                              placeholder="Calories (e.g. 450)..."
                              className="h-10 px-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs text-gray-900 dark:text-white"
                            />
                            <div className="sm:col-span-2 space-y-2">
                              <label className="text-[10px] uppercase font-bold text-gray-500">{t('allergens')}</label>
                              <div className="flex flex-wrap gap-2">
                                {['Dairy', 'Gluten', 'Nuts', 'Shellfish', 'Soy', 'Egg', 'Fish'].map(allergen => (
                                  <label key={allergen} className={`px-3 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${editDishAllergens.includes(allergen) ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-gray-900' : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-zinc-800/50 dark:border-zinc-700 dark:text-gray-400'}`}>
                                    <input 
                                      type="checkbox" 
                                      className="hidden" 
                                      checked={editDishAllergens.includes(allergen)}
                                      onChange={(e) => {
                                        if (e.target.checked) setEditDishAllergens([...editDishAllergens, allergen]);
                                        else setEditDishAllergens(editDishAllergens.filter(a => a !== allergen));
                                      }}
                                    />
                                    {allergen}
                                  </label>
                                ))}
                              </div>
                            </div>
                            <label className="sm:col-span-2 flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-zinc-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editDishPopular}
                                onChange={(e) => setEditDishPopular(e.target.checked)}
                                className="rounded"
                              />
                              <span>Mark as Popular / Chef Highlight</span>
                            </label>
                          </div>
                          <button
                            type="submit"
                            className={`w-full py-2.5 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold transition-opacity hover:opacity-90 cursor-pointer`}
                          >
                            Save Changes
                          </button>
                        </form>
                      );
                    }

                    return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-white dark:bg-zinc-800/80 border border-gray-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-11 h-11 rounded-xl object-cover shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </span>
                            {item.popular && (
                              <span className={`px-1.5 py-0.2 rounded ${theme.light} ${theme.text} text-[9px] font-bold`}>
                                Popular
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 dark:text-zinc-500">
                            {item.category} • {config.currencySymbol}{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePopular(item.id)}
                          className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                            item.popular
                              ? `${theme.light} ${theme.text} border ${theme.cardBorder}`
                              : 'bg-gray-100 dark:bg-zinc-800 text-gray-400 border-transparent hover:text-gray-700'
                          }`}
                          title="Toggle Popular Badge"
                        >
                          <Star size={14} className={item.popular ? 'fill-current' : ''} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditDishInit(item)}
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 hover:text-gray-900 text-gray-400 transition-colors cursor-pointer"
                          title={t('editDish')}
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDish(item.id)}
                          className="p-1.5 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-red-50 hover:text-red-600 text-gray-400 transition-colors cursor-pointer"
                          title={t('deleteDish')}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EXPORT JSON */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
                  Export JSON Configuration
                </h4>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Copy your customized JSON payloads to replace files in <code className={`font-mono ${theme.text}`}>src/</code> or load into your custom Java/desktop software.
                </p>
              </div>

              {/* restaurant-config.json Box */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-mono">
                    src/restaurant-config.json
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyConfig}
                    className={`px-3 py-1 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer shadow-xs`}
                  >
                    {copiedConfig ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                    <span>{copiedConfig ? 'Copied!' : 'Copy Config JSON'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-gray-900 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed border border-gray-800">
{JSON.stringify({
  name: config.name,
  tagline: config.tagline,
  description: config.description,
  themeColor: config.themeColor,
  layout: config.layout,
  tableNumber: config.tableNumber,
  currencySymbol: config.currencySymbol,
  taxRate: config.taxRate
}, null, 2)}
                </pre>
              </div>

              {/* menu.json Box */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 font-mono">
                    src/menu.json
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyMenu}
                    className={`px-3 py-1 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold flex items-center gap-1.5 transition-opacity hover:opacity-90 cursor-pointer shadow-xs`}
                  >
                    {copiedMenu ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                    <span>{copiedMenu ? 'Copied!' : 'Copy Menu JSON'}</span>
                  </button>
                </div>
                <pre className="p-3.5 rounded-2xl bg-gray-900 text-emerald-300 font-mono text-[11px] overflow-x-auto max-h-48 leading-relaxed border border-gray-800">
{JSON.stringify({
  restaurant: {
    name: config.name,
    tagline: config.tagline,
    description: config.description
  },
  categories,
  items: menuItems
}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className={`px-5 sm:px-6 py-3.5 border-t ${theme.cardBorder} ${theme.cardClass} flex items-center justify-between gap-3`}>
          <button
            type="button"
            onClick={onResetToDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reset to Config File</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl ${theme.primary} ${theme.btnText} text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer hover:opacity-90`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
