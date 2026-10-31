import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Copy, 
  Printer, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  ExternalLink,
  Lock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ORDER_STAGES_INFO, formatWhatsAppOrderMessage, TAZYO_WHATSAPP_NUMBER } from '../utils/orderState';
import { GoogleDeliveryMap } from './GoogleDeliveryMap';

export const OrderTrackerModal: React.FC = () => {
  const {
    isOrderTrackerOpen,
    setIsOrderTrackerOpen,
    activeOrder,
    updateOrderStatus,
    openWhatsApp,
    language,
  } = useApp();

  const [copiedOtp, setCopiedOtp] = useState(false);
  const [showFullStages, setShowFullStages] = useState(false);

  if (!isOrderTrackerOpen || !activeOrder) return null;

  const currentStageIndex = ORDER_STAGES_INFO.findIndex((s) => s.stage === activeOrder.stage);
  const currentStageInfo = ORDER_STAGES_INFO[currentStageIndex] || ORDER_STAGES_INFO[0];

  const handleCopyOtp = () => {
    navigator.clipboard.writeText(activeOrder.deliveryOtp);
    setCopiedOtp(true);
    setTimeout(() => setCopiedOtp(false), 2000);
  };

  const handleSendWhatsAppUpdate = () => {
    const formatted = formatWhatsAppOrderMessage(activeOrder);
    openWhatsApp(formatted);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden my-4 max-h-[90vh] flex flex-col print:max-h-none print:shadow-none print:border-none">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 print:bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Truck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-base sm:text-lg">
                  Order #{activeOrder.orderNumber}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  {activeOrder.stage === 'ORDER_DELIVERED' ? 'Delivered' : 'Live Tracking'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Placed on {new Date(activeOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeOrder.timeSlot}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrintReceipt}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOrderTrackerOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-left flex-1">
          {/* Stage Hero Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                Stage {currentStageInfo.stepNumber} of 9
              </span>
              <h3 className="text-lg sm:text-xl font-black mt-0.5">
                {language === 'hi' ? currentStageInfo.labelHi : currentStageInfo.labelEn}
              </h3>
              <p className="text-xs text-emerald-100/90 mt-1">
                {language === 'hi' ? currentStageInfo.descriptionHi : currentStageInfo.descriptionHi || currentStageInfo.descriptionEn}
              </p>
            </div>

            {/* Estimated Arrival / Status Badge */}
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20 text-center shrink-0">
              <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider block">
                Estimated Arrival
              </span>
              <span className="text-lg font-black text-white">
                {activeOrder.stage === 'ORDER_DELIVERED' ? 'Delivered 🎉' : `${activeOrder.estimatedDeliveryMins} Mins`}
              </span>
            </div>
          </div>

          {/* SECRET DELIVERY OTP CARD (Step 2 Verification) */}
          <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-extrabold uppercase text-orange-800 tracking-wider">
                  Secret Delivery Handover OTP
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-widest text-stone-950 font-mono">
                    {activeOrder.deliveryOtp}
                  </span>
                  <button
                    onClick={handleCopyOtp}
                    className="p-1.5 rounded-lg bg-orange-100 text-orange-800 hover:bg-orange-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedOtp ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-orange-700 mt-1">
                  Share this OTP with the delivery partner <b>only when you receive your package</b>.
                </p>
              </div>
            </div>

            <button
              onClick={handleSendWhatsAppUpdate}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Share OTP on WhatsApp</span>
            </button>
          </div>

          {/* Interactive Google Delivery Map */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Live Google Maps Delivery Route
              </span>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${activeOrder.deliveryAddress.lat},${activeOrder.deliveryAddress.lng}&travelmode=driving`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <span>Full Screen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <GoogleDeliveryMap
              destinationLat={activeOrder.deliveryAddress.lat}
              destinationLng={activeOrder.deliveryAddress.lng}
              destinationLabel={activeOrder.deliveryAddress.area}
              driverName={activeOrder.assignedPartner?.name || 'Rider Ravi Kumar'}
              height="280px"
            />
          </div>

          {/* 9-Stage Visual Progress Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
                9-Stage Order Journey Tracker
              </span>
              <button
                onClick={() => setShowFullStages(!showFullStages)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
              >
                {showFullStages ? 'Show Less' : 'View All 9 Stages'}
              </button>
            </div>

            {/* Stepper pills */}
            <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
              {ORDER_STAGES_INFO.map((stage, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;

                return (
                  <div
                    key={stage.stage}
                    className={`p-1.5 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-400 font-bold'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-medium'
                        : 'bg-stone-100 text-stone-400 border-stone-200'
                    }`}
                  >
                    <div className="text-[10px]">Step {stage.stepNumber}</div>
                    <div className="text-[11px] truncate">
                      {isPassed ? '✓' : ''} {stage.labelEn.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Full 9 stages detail list if expanded */}
            {showFullStages && (
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2.5 mt-2">
                {ORDER_STAGES_INFO.map((stage, idx) => {
                  const isPassed = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div key={stage.stage} className="flex items-start gap-2.5 text-xs">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 ${
                          isCurrent
                            ? 'bg-emerald-600 text-white animate-pulse'
                            : isPassed
                            ? 'bg-emerald-200 text-emerald-900'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isPassed ? '✓' : stage.stepNumber}
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold ${isCurrent ? 'text-emerald-700' : 'text-stone-800'}`}>
                          {stage.stepNumber}. {language === 'hi' ? stage.labelHi : stage.labelEn}
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {language === 'hi' ? stage.descriptionHi : stage.descriptionEn}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Partner Details */}
          {activeOrder.assignedPartner && (
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeOrder.assignedPartner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={activeOrder.assignedPartner.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                />
                <div>
                  <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <span>{activeOrder.assignedPartner.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black">
                      ★ {activeOrder.assignedPartner.rating}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    Vehicle: {activeOrder.assignedPartner.vehicleNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${activeOrder.assignedPartner.phone}`}
                  className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
                  title="Call Delivery Partner"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => openWhatsApp(`Hello ${activeOrder.assignedPartner?.name}, regarding TAZYO order #${activeOrder.orderNumber}`)}
                  className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                  title="Message on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Ordered Items Summary */}
          <div className="space-y-2 border-t border-stone-200 pt-3">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">
              Items Ordered ({activeOrder.items.length})
            </span>
            <div className="divide-y divide-stone-100 bg-stone-50 rounded-2xl p-3 border border-stone-200">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-stone-800 truncate">
                      {item.product.name}
                    </span>
                    <span className="text-stone-500 font-normal">
                      ({item.unit}) × {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}

              <div className="pt-2 mt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-950">
                <span>Total Paid ({activeOrder.paymentMethod.toUpperCase()})</span>
                <span className="text-emerald-700">₹{activeOrder.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Support: WhatsApp 8451887785</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOrderTrackerOpen(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSendWhatsAppUpdate}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Send Receipt via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
