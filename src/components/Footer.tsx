import React from 'react';
import { 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  QrCode, 
  Clock, 
  Heart 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TAZYO_WHATSAPP_NUMBER } from '../utils/orderState';

export const Footer: React.FC = () => {
  const { setIsWhatsAppQrOpen, openWhatsApp, language } = useApp();

  return (
    <footer className="bg-stone-950 text-stone-300 pt-12 pb-16 border-t border-emerald-950/80 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Slogan */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/IMG-20261024-WA0005_d15f62d5.jpg"
                alt="TAZYO Logo"
                className="h-14 w-auto object-contain rounded-xl bg-white p-1"
              />
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">TAZYO</h3>
                <p className="text-xs text-orange-400 font-bold">
                  Home Delivery Service
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              <b>Fresh, Wash, Hygienic & Ready to Cut</b> – Triple ozone washed, sanitized, vacuum sealed, and delivered directly to your doorstep in temperature-safe packs.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => openWhatsApp('Hello TAZYO, I want to order fresh vegetables')}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp: {TAZYO_WHATSAPP_NUMBER}</span>
              </button>

              <button
                onClick={() => setIsWhatsAppQrOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs transition-colors"
              >
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Scan WhatsApp QR</span>
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Fresh Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>• Ready-to-Cut Cleaned Vegetables</li>
              <li>• Farm Fresh Whole Vegetables</li>
              <li>• Prepared Fresh Cut Fruit Bowls</li>
              <li>• Premium Whole Fruits</li>
              <li>• Leafy Herbs & Spinach (Palak)</li>
              <li>• Daily Cooking Value Baskets</li>
            </ul>
          </div>

          {/* Service & Hub Info */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              TAZYO Fulfillment Hub
            </h4>
            <div className="space-y-2 text-stone-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Central Produce Hub, Dadar West, Mumbai, Maharashtra 400028</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Morning Dispatch: 6:00 AM – 10:00 PM Daily</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct Customer Line: +91 {TAZYO_WHATSAPP_NUMBER}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-[11px] text-stone-400 mt-2">
              <span className="text-emerald-400 font-bold block mb-0.5">Google Search & Business Listing:</span>
              Listed on Google as <b>TAZYO Fresh Fruits & Vegetables Delivery</b>.
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} TAZYO. Fresh • Wash • Hygienic • Ready to Cut. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Ozone Sanitized</span>
            <span>•</span>
            <span>Two-Step Delivery OTP</span>
            <span>•</span>
            <span>Google Maps Live Route</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
