import { CartItem, Coupon } from '../types';

export const FREE_DELIVERY_THRESHOLD = 249;
export const STANDARD_DELIVERY_FEE = 30;

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  freeDeliveryRemaining: number;
}

export function calculateCartTotals(
  items: CartItem[],
  appliedCoupon: Coupon | null = null,
  freeThreshold: number = FREE_DELIVERY_THRESHOLD,
  deliveryFeeRate: number = STANDARD_DELIVERY_FEE
): PriceBreakdown {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discount = appliedCoupon.value;
    }
  }

  // Cap discount so it cannot exceed subtotal
  discount = Math.min(discount, subtotal);

  const deliveryFee = subtotal === 0 || subtotal >= freeThreshold ? 0 : deliveryFeeRate;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const freeDeliveryRemaining = Math.max(0, freeThreshold - subtotal);

  return {
    subtotal,
    discount,
    deliveryFee,
    total,
    freeDeliveryRemaining,
  };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
