import React, { useState } from 'react';
import { X, MapPin, Plus, CheckCircle2, Home, Briefcase, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DeliveryAddress } from '../types';

export const AddressModal: React.FC = () => {
  const {
    isAddressModalOpen,
    setIsAddressModalOpen,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    userName,
    userPhone,
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [tag, setTag] = useState<'Home' | 'Office' | 'Other'>('Home');
  const [flat, setFlat] = useState('');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Dadar West');
  const [pincode, setPincode] = useState('400028');

  if (!isAddressModalOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flat || !street) return;

    // Approximate Mumbai coordinates based on area
    const lat = 19.0178 + (Math.random() - 0.5) * 0.02;
    const lng = 72.8397 + (Math.random() - 0.5) * 0.02;

    addAddress({
      tag,
      name: userName || 'Customer',
      phone: userPhone || '8451887785',
      flat,
      street,
      area,
      pincode,
      lat,
      lng,
      isDefault: true,
    });

    setIsAddingNew(false);
    setFlat('');
    setStreet('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-left space-y-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Delivery Addresses</h3>
              <p className="text-[11px] text-stone-500">Select where TAZYO should deliver</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddressModalOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAddingNew ? (
          <div className="space-y-3">
            {/* List saved addresses */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      setIsAddressModalOpen(false);
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                          {addr.tag}
                        </span>
                        <span className="font-bold text-stone-900 text-xs">{addr.name}</span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <p className="text-xs text-stone-600 mt-1">
                      {addr.flat}, {addr.street}, {addr.area} - {addr.pincode}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 rounded-xl border-2 border-dashed border-emerald-400 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Delivery Address</span>
            </button>
          </div>
        ) : (
          /* Add New Address Form */
          <form onSubmit={handleAddNew} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Address Tag</label>
              <div className="flex gap-2">
                {(['Home', 'Office', 'Other'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`flex-1 py-1.5 rounded-xl font-bold border transition-colors ${
                      tag === t
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Flat / House / Floor No.</label>
              <input
                type="text"
                required
                value={flat}
                onChange={(e) => setFlat(e.target.value)}
                placeholder="e.g. Flat 301, Shree Ganesh Kripa"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Street / Landmark</label>
              <input
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="e.g. Near Dadar Station, Ranade Road"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Area / Locality</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
