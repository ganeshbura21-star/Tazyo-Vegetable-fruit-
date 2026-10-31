import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  QrCode, 
  ShieldCheck, 
  Truck, 
  Sliders, 
  Sparkles,
  ChevronDown,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsWhatsAppQrOpen,
    setIsAuthModalOpen,
    setIsAddressModalOpen,
    selectedAddress,
    currentRole,
    setCurrentRole,
    language,
    setLanguage,
    isLoggedIn,
    userName,
    openWhatsApp,
    orders,
    setIsOrderTrackerOpen,
    setActiveOrder,
  } = useApp();

  const activeOrdersCount = orders.filter(
    (o) => o.stage !== 'ORDER_DELIVERED' && o.stage !== 'CANCELLED'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Announcements & Role Switcher Bar */}
      <div className="bg-emerald-900 text-white text-xs px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-800">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1 text-emerald-300 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Ozone Washed & Hygienic
          </span>
          <span className="hidden sm:inline text-emerald-400/60">•</span>
          <span className="hidden sm:inline text-emerald-100">Ready to Cut & Cook Produce</span>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="text-emerald-300/80 text-[11px] hidden md:inline">Mode:</span>
          <button
            onClick={() => setCurrentRole('customer')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
              currentRole === 'customer'
                ? 'bg-emerald-500 text-white shadow-xs ring-1 ring-emerald-300'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            🛒 Customer
          </button>
          <button
            onClick={() => setCurrentRole('delivery')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
              currentRole === 'delivery'
                ? 'bg-orange-500 text-white shadow-xs ring-1 ring-orange-300'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span>Delivery Partner</span>
          </button>
          <button
            onClick={() => setCurrentRole('admin')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 ${
              currentRole === 'admin'
                ? 'bg-stone-800 text-amber-300 shadow-xs ring-1 ring-amber-400'
                : 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-800'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setCurrentRole('customer')} 
            className="flex items-center gap-3 text-left focus:outline-hidden"
          >
            <img
              src="/assets/aistudio/IMG-20261024-WA0005_d15f62d5.jpg"
              alt="TAZYO Fresh Fruits & Vegetables Logo"
              className="h-11 sm:h-12 w-auto object-contain rounded-lg border border-emerald-100/80 shadow-xs"
            />
            <div className="hidden min-[420px]:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-800">
                  TAZYO
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-md">
                  Fresh
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium leading-tight">
                {language === 'hi' 
                  ? 'धुली, स्वच्छ और पकाने के लिए तैयार सब्जियां' 
                  : 'Wash, Hygienic & Ready to Cut'}
              </p>
            </div>
          </button>
        </div>

        {/* Location selector (Middle) */}
        <button
          onClick={() => setIsAddressModalOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 rounded-xl text-left border border-stone-200/70 transition-colors max-w-xs"
          title="Change delivery location"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="text-[11px] font-bold text-stone-800 flex items-center gap-1">
              <span>Deliver to {selectedAddress?.tag || 'Home'}</span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </div>
            <p className="text-[11px] text-stone-500 truncate">
              {selectedAddress?.area || 'Dadar West, Mumbai'}
            </p>
          </div>
        </button>

        {/* Action icons (Right) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-emerald-300 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-white transition-colors"
            title="Switch language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* WhatsApp Direct & QR Button */}
          <button
            onClick={() => setIsWhatsAppQrOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-semibold transition-all shadow-xs"
            title="WhatsApp Orders: 8451887785"
          >
            <QrCode className="w-4 h-4 text-emerald-600" />
            <span className="hidden lg:inline">WhatsApp</span>
            <span className="text-emerald-700 font-bold">8451887785</span>
          </button>

          {/* Active Order Tracker Button (if exists) */}
          {orders.length > 0 && (
            <button
              onClick={() => {
                setActiveOrder(orders[0]);
                setIsOrderTrackerOpen(true);
              }}
              className="relative p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
              title="Track Active Order"
            >
              <Truck className="w-5 h-5 text-amber-700" />
              {activeOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {activeOrdersCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Login */}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/70 text-stone-800 text-xs font-semibold transition-colors"
          >
            <User className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline truncate max-w-[90px]">
              {isLoggedIn ? userName.split(' ')[0] : 'Login'}
            </span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'hi' ? 'कार्ट' : 'Cart'}
            </span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-xs font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
