import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  QrCode, 
  Phone, 
  User, 
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { calculateCartTotals } from '../utils/pricing';
import { PaymentMethod, DeliveryAddress } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    activeCoupon,
    addresses,
    selectedAddress,
    setSelectedAddress,
    setIsAddressModalOpen,
    userName,
    userPhone,
    placeOrder,
    openWhatsApp,
    language,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [selectedSlot, setSelectedSlot] = useState('Express (30-45 Mins)');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState<'idle' | 'authorizing' | 'verified'>('idle');

  if (!isCheckoutOpen || cart.length === 0) return null;

  const totals = calculateCartTotals(cart, activeCoupon);

  const deliverySlots = [
    { id: 'express', label: 'Express (30-45 Mins)', tag: 'Fastest ⚡' },
    { id: 'morning', label: 'Morning (7:00 AM - 9:00 AM)', tag: 'Fresh Pick' },
    { id: 'afternoon', label: 'Afternoon (12:00 PM - 2:00 PM)', tag: 'Midday' },
    { id: 'evening', label: 'Evening (5:00 PM - 8:00 PM)', tag: 'Dinner Prep' },
  ];

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setPaymentVerificationStatus('authorizing');

    // Simulate secure payment gateway verification
    setTimeout(() => {
      setPaymentVerificationStatus('verified');
      
      setTimeout(() => {
        const order = placeOrder({
          items: [...cart],
          subtotal: totals.subtotal,
          discount: totals.discount,
          deliveryFee: totals.deliveryFee,
          total: totals.total,
          paymentMethod,
          paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
          deliveryAddress: selectedAddress || addresses[0],
          customerName: userName,
          customerPhone: userPhone,
          timeSlot: selectedSlot,
          deliveryNotes,
          transactionId: paymentMethod === 'cod' ? undefined : `UPI-${Math.floor(10000000 + Math.random() * 90000000)}`,
        });

        // Fire celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore if canvas not mounted
        }

        setIsProcessing(false);
        setPaymentVerificationStatus('idle');
      }, 700);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-scale-up">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg">
                {language === 'hi' ? 'सुरक्षित चेकआउट' : 'Secure Checkout'}
              </h2>
              <p className="text-xs text-stone-500">
                TAZYO Fresh Produce Home Delivery
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto text-left">
          {/* Step 1: Customer & Address */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                1. Delivery Address
              </span>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 underline"
              >
                + Add / Change Address
              </button>
            </div>

            {selectedAddress ? (
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/90 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <span className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px]">
                      {selectedAddress.tag}
                    </span>
                    <span>{selectedAddress.name}</span>
                  </span>
                  <span className="text-stone-500 font-normal">{selectedAddress.phone}</span>
                </div>
                <p className="text-stone-600">
                  {selectedAddress.flat}, {selectedAddress.street}, {selectedAddress.area}
                </p>
                <p className="text-stone-500 text-[11px]">
                  PIN: {selectedAddress.pincode} • Near Dadar Hub
                </p>
              </div>
            ) : (
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-emerald-300 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Select Delivery Address on Google Maps
              </button>
            )}
          </div>

          {/* Step 2: Delivery Slot */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              2. Select Delivery Slot
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {deliverySlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.label)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                    selectedSlot === slot.label
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{slot.label}</div>
                    <div className="text-[10px] text-stone-500">{slot.tag}</div>
                  </div>
                  {selectedSlot === slot.label && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Instructions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Delivery Notes (Optional)
            </label>
            <input
              type="text"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="E.g. Leave with security, call before reaching, ring doorbell"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Step 3: Payment Method */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              3. Verified Payment Options
            </span>

            <div className="space-y-2">
              {/* UPI Option */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs sm:text-sm">
                        Instant UPI Payment (Google Pay / PhonePe / Paytm / BHIM)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Zero touch, auto-verified instantly with tamper-proof receipt
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'upi' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>

                {/* Sub-brands preview */}
                {paymentMethod === 'upi' && (
                  <div className="mt-3 pt-2.5 border-t border-emerald-200/80 flex flex-wrap items-center gap-2 text-[11px] text-emerald-800">
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Google Pay
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      PhonePe
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Paytm
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-emerald-200 font-semibold">
                      Any UPI ID
                    </span>
                  </div>
                )}
              </div>

              {/* Cash on Delivery Option */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-stone-700 text-white flex items-center justify-center font-bold text-xs">
                      COD
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs sm:text-sm">
                        Cash on Delivery (COD)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        Pay cash or UPI directly to delivery partner upon inspection
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Two-Step Delivery OTP Notice */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Two-Step Delivery OTP Security System</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Upon ordering, you will receive a unique 4-digit Delivery OTP. Share this OTP with the delivery partner <b>only when you receive your fresh, hygienic package</b> to ensure safe handover.
            </p>
          </div>

          {/* Order Summary & Bill */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
            <div className="font-bold text-stone-800 text-xs uppercase tracking-wide">
              Payment Summary
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Items Total ({cart.length} items)</span>
              <span className="font-semibold text-stone-900">₹{totals.subtotal}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Savings ({activeCoupon?.code})</span>
                <span>-₹{totals.discount}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span className={totals.deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-stone-900'}>
                {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-950">
              <span>Amount Payable</span>
              <span className="text-base text-emerald-700">₹{totals.total}</span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50">
          <button
            onClick={handleConfirmOrder}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-stone-300 text-white font-bold rounded-2xl shadow-lg transition-all text-sm"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>
                  {paymentVerificationStatus === 'authorizing'
                    ? 'Verifying Secure Payment Gateway...'
                    : 'Payment Verified! Generating OTP...'}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>
                  {paymentMethod === 'cod' ? 'Confirm Order (Pay on Delivery)' : `Pay & Confirm Order (₹${totals.total})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
