import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Leaf, 
  MessageCircle, 
  QrCode, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { language, setIsWhatsAppQrOpen, openWhatsApp } = useApp();

  const quickSearches = [
    { label: 'French Beans', cat: 'ready_to_cut' },
    { label: 'Diced Lauki', cat: 'ready_to_cut' },
    { label: 'Peeled Garlic', cat: 'ready_to_cut' },
    { label: 'Papaya Bowl', cat: 'cut_fruits' },
    { label: 'Desi Tomatoes', cat: 'fresh_vegetables' },
  ];

  return (
    <section className="relative overflow-hidden bg-radial from-emerald-800 via-emerald-900 to-stone-950 text-white pt-6 pb-10 px-4 sm:px-6 lg:px-8 border-b border-emerald-950">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-7 space-y-4 text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>
                {language === 'hi' 
                  ? 'ताज़ा • धुला • स्वच्छ • पकाने के लिए तैयार' 
                  : 'Fresh • Wash • Hygienic • Ready to Cut'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {language === 'hi' ? (
                <>
                  घर बैठे पाएं <span className="text-orange-400 underline decoration-emerald-400">धुली व कटी</span> ताज़ा सब्ज़ियां
                </>
              ) : (
                <>
                  Fresh Fruits & Vegetables –{' '}
                  <span className="text-orange-400">Wash, Hygienic</span> & Ready to Cut
                </>
              )}
            </h1>

            <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
              {language === 'hi'
                ? 'ओज़ोन वॉश तकनीक से पूरी तरह स्वच्छ, छिले और कटे फल-सब्जियां सीधे आपके दरवाजे तक। समय बचाएं और सेहतमंद खाएं।'
                : '100% Ozone-purified, triple-washed, and cut-to-cook fresh produce delivered to your doorstep. Save 30+ minutes of tedious kitchen prep everyday.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openWhatsApp('Hello TAZYO, I want to order fresh washed vegetables')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-stone-950" />
                <span>Order via WhatsApp (8451887785)</span>
              </button>

              <button
                onClick={() => setIsWhatsAppQrOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/20 font-semibold text-sm backdrop-blur-sm transition-all"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Scan WhatsApp QR</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-800/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-stone-200">100% Ozone Washed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-stone-200">Ready-to-Cook Packs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-stone-200">Zero Touch Sealing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs text-stone-200">45-Min Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Feature Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-b from-white/15 to-white/5 border border-white/20 rounded-3xl p-5 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold tracking-wide uppercase">
                  TAZYO Quality Promise
                </span>
                <span className="text-xs text-emerald-300 font-medium">WhatsApp: 8451887785</span>
              </div>

              {/* Produce image showcase */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-4 shadow-inner group">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80"
                  alt="Fresh farm produce basket"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <p className="text-xs font-semibold text-emerald-300">Cleaned & Hygienic</p>
                  <p className="text-sm font-bold text-white">Triple Ozone Purified Farm Produce</p>
                </div>
              </div>

              {/* Quick search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'hi' 
                      ? 'ताज़ा सब्ज़ियां या फल खोजें (उदा. लौकी, भिंडी, बीन्स)...' 
                      : 'Search washed vegetables or fruits (e.g. French Beans, Lauki)...'
                  }
                  className="w-full pl-9 pr-4 py-2.5 bg-stone-900/90 text-white placeholder-stone-400 text-xs sm:text-sm rounded-xl border border-stone-700 focus:outline-hidden focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Quick search pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                <span className="text-[11px] text-stone-400">Popular:</span>
                {quickSearches.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSearchQuery(item.label);
                      setSelectedCategory('all');
                    }}
                    className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[11px] text-stone-200 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
