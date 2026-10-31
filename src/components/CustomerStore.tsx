import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Leaf, 
  Filter, 
  ShoppingBag, 
  CheckCircle2, 
  ArrowRight,
  UtensilsCrossed,
  Droplets,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { ProductCategory } from '../types';

export const CustomerStore: React.FC = () => {
  const { products, cart, cartCount, setIsCartOpen, language } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReadyToCutOnly, setFilterReadyToCutOnly] = useState(false);
  const [filterInStockOnly, setFilterInStockOnly] = useState(false);

  const categories: { id: string; labelEn: string; labelHi: string; icon: string }[] = [
    { id: 'all', labelEn: 'All Products', labelHi: 'सभी उत्पाद', icon: '🧺' },
    { id: 'ready_to_cut', labelEn: 'Ready to Cut & Cook', labelHi: 'कटी व धुली सब्जियां', icon: '🔪' },
    { id: 'fresh_vegetables', labelEn: 'Fresh Vegetables', labelHi: 'ताज़ा सब्जियां', icon: '🥦' },
    { id: 'cut_fruits', labelEn: 'Prepared Fruit Bowls', labelHi: 'कटे हुए फल', icon: '🍉' },
    { id: 'fresh_fruits', labelEn: 'Fresh Fruits', labelHi: 'ताज़े फल', icon: '🍎' },
    { id: 'leafy_herbs', labelEn: 'Leafy & Herbs', labelHi: 'हरी पत्तेदार सब्जियां', icon: '🌿' },
    { id: 'combos', labelEn: 'Daily Veggie Combos', labelHi: 'कॉम्बो पैक्स', icon: '🥕' },
  ];

  // Filtering products
  const filtered = products.filter((p) => {
    // Category match
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchHindi = p.hindiName.includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchHindi && !matchDesc) return false;
    }
    // Ready to cut filter
    if (filterReadyToCutOnly && !p.isReadyToCut) {
      return false;
    }
    // In stock filter
    if (filterInStockOnly && !p.inStock) {
      return false;
    }
    return true;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner with Search */}
      <HeroBanner
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Hygiene & Value Highlight Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-2xl p-4 flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Ozone Microbe Cleansing</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Triple-washed with active oxygen bubblers to remove 99.9% pesticides and contaminants.
              </p>
            </div>
          </div>

          <div className="bg-orange-50/70 border border-orange-200/90 rounded-2xl p-4 flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Cut & Ready to Cook</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Peeled, trimmed and diced by sanitised kitchen machines. Toss directly into the pan!
              </p>
            </div>
          </div>

          <div className="bg-stone-100 border border-stone-200/90 rounded-2xl p-4 flex items-start gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Two-Step OTP Security</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Every delivery requires verified OTP confirmation at the doorstep before handover.
              </p>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toggles Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterReadyToCutOnly(!filterReadyToCutOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all ${
                filterReadyToCutOnly
                  ? 'bg-orange-500 text-white border-orange-600 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to Cut Only</span>
            </button>

            <button
              onClick={() => setFilterInStockOnly(!filterInStockOnly)}
              className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                filterInStockOnly
                  ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>In Stock Only</span>
            </button>
          </div>

          <div className="text-stone-500 font-medium">
            Showing <b className="text-stone-900">{filtered.length}</b> fresh items
          </div>
        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="font-bold text-stone-800 text-base">No matching products found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try searching with another keyword (e.g. Beans, Lauki, Garlic, Apple) or reset your active filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setFilterReadyToCutOnly(false);
                setFilterInStockOnly(false);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Cart Bar (Mobile) */}
      {cartCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between font-bold text-sm ring-2 ring-emerald-400 animate-slide-up"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs font-black">
                {cartCount}
              </div>
              <span className="text-xs">
                {cartCount === 1 ? '1 item' : `${cartCount} items`} • ₹{cartSubtotal}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span>View Basket</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
