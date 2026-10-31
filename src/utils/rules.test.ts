import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCartTotals } from './pricing';
import { getNextStage, verifyDeliveryOtp, generateDeliveryOtp } from './orderState';
import { CartItem, Product, Coupon } from '../types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Washed Diced Bottle Gourd (Lauki)',
  hindiName: 'कटी हुई ताज़ा लौकी',
  category: 'ready_to_cut',
  description: 'Ozone-washed, peeled and diced into neat cubes.',
  imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80',
  hygieneBadges: ['Ozone Washed', 'Ready to Cook'],
  unitPrices: {
    '500g': 45,
    '1kg': 80,
  },
  defaultUnit: '500g',
  inStock: true,
  stockQuantity: 50,
  isReadyToCut: true,
  isWashed: true,
};

const mockItem: CartItem = {
  productId: 'prod-1',
  product: mockProduct,
  unit: '500g',
  quantity: 2,
  unitPrice: 45, // Total 90
};

test('Cart calculations without coupon and below free delivery threshold', () => {
  const result = calculateCartTotals([mockItem]);
  assert.equal(result.subtotal, 90);
  assert.equal(result.discount, 0);
  assert.equal(result.deliveryFee, 30);
  assert.equal(result.total, 120);
  assert.equal(result.freeDeliveryRemaining, 159);
});

test('Cart calculations with free delivery reached above ₹249', () => {
  const bigItem: CartItem = {
    ...mockItem,
    quantity: 6, // 6 * 45 = 270
  };
  const result = calculateCartTotals([bigItem]);
  assert.equal(result.subtotal, 270);
  assert.equal(result.deliveryFee, 0);
  assert.equal(result.total, 270);
  assert.equal(result.freeDeliveryRemaining, 0);
});

test('Coupon discounts: flat discount and percentage discount', () => {
  const bigItem: CartItem = {
    ...mockItem,
    quantity: 8, // 8 * 45 = 360
  };

  const flatCoupon: Coupon = {
    code: 'TAZYO50',
    description: '₹50 off on orders above ₹299',
    discountType: 'flat',
    value: 50,
    minOrder: 299,
  };

  const res1 = calculateCartTotals([bigItem], flatCoupon);
  assert.equal(res1.subtotal, 360);
  assert.equal(res1.discount, 50);
  assert.equal(res1.total, 310);

  const pctCoupon: Coupon = {
    code: 'FRESH10',
    description: '10% off',
    discountType: 'percentage',
    value: 10,
    minOrder: 100,
  };

  const res2 = calculateCartTotals([bigItem], pctCoupon);
  assert.equal(res2.discount, 36);
  assert.equal(res2.total, 324);
});

test('Delivery OTP verification and generation', () => {
  const otp = generateDeliveryOtp();
  assert.equal(otp.length, 4);
  assert.match(otp, /^\d{4}$/);

  assert.equal(verifyDeliveryOtp(otp, otp), true);
  assert.equal(verifyDeliveryOtp('0000', otp === '0000' ? '1111' : otp), false);
  assert.equal(verifyDeliveryOtp(' ' + otp + ' ', otp), true);
});

test('Order stage transitions advance properly through 9 stages', () => {
  assert.equal(getNextStage('ORDER_PLACED'), 'ORDER_CONFIRMED');
  assert.equal(getNextStage('ORDER_CONFIRMED'), 'PREPARING');
  assert.equal(getNextStage('PREPARING'), 'HYGIENICALLY_PACKED');
  assert.equal(getNextStage('HYGIENICALLY_PACKED'), 'READY_FOR_DELIVERY');
  assert.equal(getNextStage('READY_FOR_DELIVERY'), 'PARTNER_ASSIGNED');
  assert.equal(getNextStage('PARTNER_ASSIGNED'), 'OUT_FOR_DELIVERY');
  assert.equal(getNextStage('OUT_FOR_DELIVERY'), 'OTP_VERIFICATION');
  assert.equal(getNextStage('OTP_VERIFICATION'), 'ORDER_DELIVERED');
  assert.equal(getNextStage('ORDER_DELIVERED'), null);
});
