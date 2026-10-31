import React, { useState } from 'react';
import { X, Phone, Lock, CheckCircle2, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isLoggedIn,
    userName,
    userPhone,
    loginWithPhone,
    logout,
  } = useApp();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState(userPhone || '8451887785');
  const [name, setName] = useState(userName || 'Priya Sharma');
  const [otp, setOtp] = useState('');
  const [demoGeneratedOtp, setDemoGeneratedOtp] = useState('5821');

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setDemoGeneratedOtp(randomOtp);
    setStep('otp');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithPhone(phone, name || 'Customer');
    setStep('phone');
  };

  const handleAutoFillOtp = () => {
    setOtp(demoGeneratedOtp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-left space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {isLoggedIn ? 'Customer Profile' : 'Customer Login'}
              </h3>
              <p className="text-[11px] text-stone-500">
                TAZYO Fast & Hygienic Delivery
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          /* Profile view */
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-stone-900">{userName}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                  Verified
                </span>
              </div>
              <p className="font-mono text-stone-600">+91 {userPhone}</p>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] pt-1">
                <ShieldCheck className="w-4 h-4" />
                <span>SMS OTP Verified Customer Account</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                setIsAuthModalOpen(false);
              }}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition-colors"
            >
              Log Out
            </button>
          </div>
        ) : step === 'phone' ? (
          /* Mobile Number Step */
          <form onSubmit={handleSendOtp} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name (e.g. Priya Sharma)"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Mobile Number</label>
              <div className="flex gap-2">
                <span className="px-3 py-2.5 bg-stone-100 border border-stone-200 rounded-xl font-bold text-stone-700">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:border-emerald-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Send SMS Verification OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* OTP Verification Step */
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="text-center space-y-1">
              <span className="text-stone-500">
                Enter the 4-digit SMS OTP sent to <b>+91 {phone}</b>
              </span>
              <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] font-semibold flex items-center justify-between">
                <span>Demo SMS Code: <b className="font-mono">{demoGeneratedOtp}</b></span>
                <button
                  type="button"
                  onClick={handleAutoFillOtp}
                  className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 rounded text-amber-950 font-bold"
                >
                  Auto-Fill
                </button>
              </div>
            </div>

            <input
              type="text"
              required
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="• • • •"
              className="w-full text-center tracking-widest text-2xl font-black font-mono py-2.5 rounded-xl border-2 border-stone-300 focus:border-emerald-600 focus:outline-hidden bg-stone-50"
              autoFocus
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
              >
                Verify & Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
