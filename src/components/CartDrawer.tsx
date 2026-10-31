import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag, 
  ArrowRight, 
  Truck, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateCartTotals } from '../utils/pricing';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    coupons,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen,
    language,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const totals = calculateCartTotals(cart, activeCoupon);

  const handleApplyCoupon = (code: string) => {
    const result = applyCoupon(code);
    setCouponMessage({
      text: result.message,
      error: !result.success,
    });
    if (result.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Background click to close */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base">
                {language === 'hi' ? 'आपकी टोकरी' : 'Your Fresh Basket'}
              </h2>
              <p className="text-xs text-stone-500">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Free Delivery Bar */}
        {cart.length > 0 && (
          <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 text-xs">
            {totals.freeDeliveryRemaining > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-emerald-900 font-medium">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Add ₹{totals.freeDeliveryRemaining} more for FREE Delivery
                  </span>
                  <span className="font-bold">₹{totals.subtotal} / ₹249</span>
                </div>
                <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (totals.subtotal / 249) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE Express Delivery!</span>
              </div>
            )}
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-stone-700 text-base">Your cart is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore our washed, hygienic and ready-to-cut vegetables and fresh fruits.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Browse Fresh Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.productId}-${item.unit}`}
                className="flex items-center gap-3 p-3 bg-stone-50/80 rounded-xl border border-stone-200/80 hover:border-emerald-200 transition-colors"
              >
                {/* Product thumb */}
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="font-bold text-stone-900 text-xs sm:text-sm truncate">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                      {item.unit}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      ₹{item.unitPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg p-1 shrink-0">
                  <button
                    onClick={() => updateQuantity(item.productId, item.unit, -1)}
                    className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
                    aria-label={`Decrease ${item.product.name} quantity`}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.unit, 1)}
                    className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors"
                    aria-label={`Increase ${item.product.name} quantity`}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Item total & remove */}
                <div className="text-right shrink-0">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">
                    ₹{item.unitPrice * item.quantity}
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.unit)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Coupons section */}
          {cart.length > 0 && (
            <div className="pt-2 border-t border-stone-200">
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-200">
                <div className="flex items-center gap-1.5 font-bold text-stone-800 text-xs mb-2">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Coupons & Offers</span>
                </div>

                {activeCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-100/70 border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs">
                    <div>
                      <span className="font-black text-emerald-900 uppercase tracking-wide">
                        {activeCoupon.code}
                      </span>
                      <p className="text-[10px] text-emerald-700">
                        {activeCoupon.description}
                      </p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon (e.g. TAZYO50)"
                        className="flex-1 px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg text-xs uppercase font-medium focus:outline-hidden focus:border-emerald-500"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponInput)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick coupon chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {coupons.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2 py-0.5 rounded bg-white border border-emerald-300 text-[10px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors"
                        >
                          {c.code} (Save ₹{c.value})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {couponMessage && (
                  <p
                    className={`text-[11px] font-medium mt-1.5 ${
                      couponMessage.error ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer with Bill Details */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            {/* Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">₹{totals.subtotal}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge</span>
                <span className={totals.deliveryFee === 0 ? 'text-emerald-700 font-bold' : 'font-semibold text-stone-900'}>
                  {totals.deliveryFee === 0 ? 'FREE' : `₹${totals.deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-black text-stone-950">
                <span>Total Amount</span>
                <span className="text-base text-emerald-700">₹{totals.total}</span>
              </div>
            </div>

            {/* Hygiene note */}
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Sanitized, temperature-controlled sealed package guarantee.</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition-all text-sm"
            >
              <span>{language === 'hi' ? 'ऑर्डर करें' : 'Proceed to Checkout'}</span>
              <span className="text-emerald-200">•</span>
              <span>₹{totals.total}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
