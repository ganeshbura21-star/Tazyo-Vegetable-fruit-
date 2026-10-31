import React, { useState } from 'react';
import { Plus, Minus, Check, Sparkles, Shield, Clock } from 'lucide-react';
import { Product, UnitType } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { cart, addToCart, updateQuantity, language } = useApp();
  
  // Available units for this product
  const availableUnits = Object.keys(product.unitPrices) as UnitType[];
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(product.defaultUnit || availableUnits[0]);

  // Current item in cart with this selected unit
  const cartItem = cart.find(
    (item) => item.productId === product.id && item.unit === selectedUnit
  );

  const price = product.unitPrices[selectedUnit] || Object.values(product.unitPrices)[0] || 0;

  const handleUnitChange = (unit: UnitType) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Image & Badges */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.isReadyToCut && (
            <span className="px-2 py-0.5 rounded-md bg-orange-600/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Ready to Cut & Cook
            </span>
          )}
          {product.isWashed && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-700/90 text-white text-[10px] font-bold shadow-xs backdrop-blur-xs flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              Ozone Washed
            </span>
          )}
        </div>

        {/* Stock status overlay if out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-lg uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & Hindi Name */}
          <div className="text-left mb-1">
            <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-stone-500 font-medium line-clamp-1">
              {product.hindiName}
            </p>
          </div>

          {/* Description */}
          <p className="text-[11px] text-stone-500 line-clamp-2 text-left mb-3">
            {language === 'hi' && product.hindiDescription
              ? product.hindiDescription
              : product.description}
          </p>

          {/* Hygiene Badges list */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.hygieneBadges.slice(0, 2).map((badge) => (
              <span
                key={badge}
                className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-medium border border-emerald-100"
              >
                ✓ {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Unit Selection */}
        <div className="pt-2 border-t border-stone-100">
          {/* Unit selector pills */}
          {availableUnits.length > 1 && (
            <div className="flex flex-wrap gap-1 mb-2.5">
              {availableUnits.map((u) => (
                <button
                  key={u}
                  onClick={() => handleUnitChange(u)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                    selectedUnit === u
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          )}

          {/* Price & Add to Cart Action */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-left">
              <div className="text-base sm:text-lg font-black text-stone-900 leading-none">
                ₹{price}
              </div>
              <div className="text-[10px] text-stone-500 font-medium">
                per {selectedUnit}
              </div>
            </div>

            {/* Action Button */}
            {!product.inStock ? (
              <span className="text-xs text-stone-400 font-medium py-1.5">
                Unavailable
              </span>
            ) : cartItem ? (
              /* Quantity Stepper */
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => updateQuantity(product.id, selectedUnit, -1)}
                  className="w-7 h-7 rounded-lg bg-white text-emerald-800 hover:bg-emerald-100 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors"
                  aria-label={`Decrease ${product.name} quantity`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-black text-xs sm:text-sm text-emerald-900">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(product.id, selectedUnit, 1)}
                  className="w-7 h-7 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center font-bold text-sm shadow-2xs transition-colors"
                  aria-label={`Increase ${product.name} quantity`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Add Button */
              <button
                onClick={() => addToCart(product, selectedUnit, 1)}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm transition-all"
                aria-label={`Add ${product.name} (${selectedUnit}) to cart`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'जोड़ें' : 'Add'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
