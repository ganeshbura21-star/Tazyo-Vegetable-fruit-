import React from 'react';
import { MessageCircle, QrCode } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TAZYO_WHATSAPP_NUMBER } from '../utils/orderState';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsApp, setIsWhatsAppQrOpen } = useApp();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
      {/* Floating Action Button */}
      <div className="flex items-center gap-2 bg-stone-900/90 text-white rounded-full pl-3 pr-1.5 py-1.5 shadow-2xl border border-emerald-500/50 backdrop-blur-md group hover:scale-105 transition-all">
        <button
          onClick={() => openWhatsApp('Hello TAZYO, I want to order fresh washed vegetables')}
          className="flex items-center gap-2 text-xs font-bold text-white hover:text-emerald-300 transition-colors pr-1"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-stone-950 shadow-md">
            <MessageCircle className="w-5 h-5 fill-stone-950" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] text-emerald-400 font-semibold leading-none">Order on WhatsApp</div>
            <div className="text-xs font-mono font-black">{TAZYO_WHATSAPP_NUMBER}</div>
          </div>
        </button>

        {/* QR Code button */}
        <button
          onClick={() => setIsWhatsAppQrOpen(true)}
          className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 transition-colors"
          title="Scan WhatsApp QR Code"
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
