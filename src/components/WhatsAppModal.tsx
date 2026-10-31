import React from 'react';
import { X, MessageCircle, Phone, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TAZYO_WHATSAPP_NUMBER, TAZYO_WHATSAPP_INTL } from '../utils/orderState';

export const WhatsAppModal: React.FC = () => {
  const { isWhatsAppQrOpen, setIsWhatsAppQrOpen, openWhatsApp } = useApp();

  if (!isWhatsAppQrOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4 animate-scale-up">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm">TAZYO WhatsApp</h3>
              <p className="text-[11px] text-stone-500">Official Business Account</p>
            </div>
          </div>
          <button
            onClick={() => setIsWhatsAppQrOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp QR Image Display */}
        <div className="relative mx-auto w-56 h-56 rounded-2xl overflow-hidden border-2 border-emerald-100 shadow-md bg-stone-50 p-2">
          <img
            src="/assets/aistudio/IMG-20261030-WA0004_0ec17ded.jpg"
            alt="TAZYO WhatsApp Business QR Code"
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div>
          <div className="font-black text-stone-900 text-base">
            +91 {TAZYO_WHATSAPP_NUMBER}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Scan with your mobile camera or WhatsApp to start ordering or request quick live support.
          </p>
        </div>

        {/* Direct Link button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              openWhatsApp('Hello TAZYO, I want to order fresh washed and ready-to-cut vegetables.');
              setIsWhatsAppQrOpen(false);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Open WhatsApp Chat Directly</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </button>

          <a
            href={`tel:${TAZYO_WHATSAPP_NUMBER}`}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer Helpline ({TAZYO_WHATSAPP_NUMBER})</span>
          </a>
        </div>
      </div>
    </div>
  );
};
