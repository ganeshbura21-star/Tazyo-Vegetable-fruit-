import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Navigation, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  AlertCircle,
  PackageCheck,
  User,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const DeliveryPortal: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    verifyOrderDeliveryOtp,
    openWhatsApp,
    deliveryPartners,
    language,
  } = useApp();

  const [currentPartner] = useState(deliveryPartners[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [verificationFeedback, setVerificationFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  // Active deliveries assigned to this rider
  const assignedOrders = orders.filter(
    (o) => o.stage !== 'CANCELLED'
  );

  const pendingDeliveries = assignedOrders.filter(
    (o) => o.stage !== 'ORDER_DELIVERED'
  );

  const completedDeliveries = assignedOrders.filter(
    (o) => o.stage === 'ORDER_DELIVERED'
  );

  const handleVerifyOtp = (order: Order) => {
    if (!otpInput || otpInput.trim().length !== 4) {
      setVerificationFeedback({
        text: 'Please enter a valid 4-digit OTP provided by customer.',
        error: true,
      });
      return;
    }

    const res = verifyOrderDeliveryOtp(order.id, otpInput.trim());
    setVerificationFeedback({
      text: res.message,
      error: !res.success,
    });

    if (res.success) {
      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {}

      setTimeout(() => {
        setSelectedOrder(null);
        setOtpInput('');
        setVerificationFeedback(null);
      }, 1500);
    }
  };

  const handleMarkOutForDelivery = (orderId: string) => {
    updateOrderStatus(orderId, 'OUT_FOR_DELIVERY');
  };

  const handleMarkReachedDoorstep = (orderId: string) => {
    updateOrderStatus(orderId, 'OTP_VERIFICATION');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-left">
      {/* Rider Profile Card */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentPartner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={currentPartner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-stone-900 rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black">{currentPartner.name}</h2>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold">
                ★ {currentPartner.rating}
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-0.5">
              Vehicle: {currentPartner.vehicleNumber} • TAZYO Fleet
            </p>
            <p className="text-xs text-emerald-400 font-mono mt-0.5">
              Contact: +91 {currentPartner.phone}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 backdrop-blur-xs">
          <div>
            <div className="text-[10px] text-stone-300 uppercase font-semibold">Active Trips</div>
            <div className="text-xl font-black text-amber-400">{pendingDeliveries.length}</div>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <div className="text-[10px] text-stone-300 uppercase font-semibold">Delivered Today</div>
            <div className="text-xl font-black text-emerald-400">{completedDeliveries.length}</div>
          </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900">
            Assigned Deliveries ({pendingDeliveries.length} Pending)
          </h3>
          <p className="text-xs text-stone-500">
            Verify customer OTP before completing package handover
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {pendingDeliveries.length === 0 ? (
          <div className="p-10 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-stone-800 text-base">All Caught Up!</h4>
            <p className="text-xs text-stone-500">No pending orders assigned to you right now.</p>
          </div>
        ) : (
          pendingDeliveries.map((order) => {
            const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress.lat},${order.deliveryAddress.lng}&travelmode=driving`;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4"
              >
                {/* Top order info */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-stone-900 text-base">
                      Order #{order.orderNumber}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                      {order.stage.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black text-stone-900">
                      ₹{order.total}
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        order.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {order.paymentStatus === 'paid' ? '✓ Paid Online (UPI)' : '💵 Collect Cash (COD)'}
                    </span>
                  </div>
                </div>

                {/* Customer & Address Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Customer */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1.5">
                    <div className="font-bold text-stone-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="text-stone-600">
                      Phone: <span className="font-mono font-bold text-stone-800">{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-700 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Customer</span>
                      </a>
                      <button
                        onClick={() => openWhatsApp(`Hello ${order.customerName}, this is your TAZYO delivery partner with order #${order.orderNumber}`)}
                        className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Address & Google Maps */}
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                    <div className="font-bold text-stone-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.deliveryAddress.tag}: {order.deliveryAddress.area}</span>
                    </div>
                    <p className="text-stone-600">
                      {order.deliveryAddress.flat}, {order.deliveryAddress.street} (PIN: {order.deliveryAddress.pincode})
                    </p>
                    <a
                      href={navUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Open Turn-by-Turn Google Maps</span>
                      <ExternalLink className="w-3 h-3 opacity-80" />
                    </a>
                  </div>
                </div>

                {/* Items preview */}
                <div className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-800 block mb-1">Package Contents:</span>
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((it, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white border border-stone-200 font-medium">
                        {it.product.name} ({it.unit}) × {it.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Workflow Actions & OTP verification */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.stage !== 'OUT_FOR_DELIVERY' && order.stage !== 'OTP_VERIFICATION' && (
                      <button
                        onClick={() => handleMarkOutForDelivery(order.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Start Trip (Out for Delivery)</span>
                      </button>
                    )}

                    {order.stage === 'OUT_FOR_DELIVERY' && (
                      <button
                        onClick={() => handleMarkReachedDoorstep(order.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>Reached Customer Doorstep</span>
                      </button>
                    )}
                  </div>

                  {/* Complete Handover via OTP */}
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setOtpInput('');
                      setVerificationFeedback(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Enter Customer OTP & Handover</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed Deliveries History */}
      {completedDeliveries.length > 0 && (
        <div className="pt-6 border-t border-stone-200 space-y-3">
          <h4 className="font-bold text-stone-800 text-sm">
            Completed Deliveries Today ({completedDeliveries.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {completedDeliveries.map((co) => (
              <div
                key={co.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-stone-900">
                    Order #{co.orderNumber} - {co.customerName}
                  </div>
                  <div className="text-stone-500">
                    {co.deliveryAddress.area} • OTP: {co.deliveryOtp}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-700">₹{co.total}</div>
                  <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    ✓ Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification OTP Modal Dialog */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-900 text-base">
                  Verify Delivery OTP
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Ask <b>{selectedOrder.customerName}</b> for their 4-digit secret handover OTP shown in their app or WhatsApp confirmation.
            </p>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                Customer Handover 4-Digit OTP:
              </label>
              <input
                type="text"
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • •"
                className="w-full text-center tracking-widest text-3xl font-black font-mono py-3 rounded-2xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-hidden bg-stone-50"
                autoFocus
              />
              <p className="text-[11px] text-stone-400 text-center">
                (Demo Test Hint: Customer's OTP is <span className="font-mono font-bold text-stone-700">{selectedOrder.deliveryOtp}</span>)
              </p>
            </div>

            {verificationFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  verificationFeedback.error
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {verificationFeedback.text}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleVerifyOtp(selectedOrder)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md"
              >
                Verify & Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
