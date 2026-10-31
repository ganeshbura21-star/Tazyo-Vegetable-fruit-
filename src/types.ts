export type UnitType = '1kg' | '500g' | '250g' | 'piece' | 'packet';

export type ProductCategory = 
  | 'ready_to_cut'
  | 'fresh_vegetables'
  | 'cut_fruits'
  | 'fresh_fruits'
  | 'leafy_herbs'
  | 'combos';

export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: ProductCategory;
  description: string;
  hindiDescription?: string;
  imageUrl: string;
  hygieneBadges: string[];
  unitPrices: {
    [key in UnitType]?: number;
  };
  defaultUnit: UnitType;
  inStock: boolean;
  stockQuantity: number;
  isReadyToCut?: boolean;
  isWashed?: boolean;
  isPopular?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  unit: UnitType;
  quantity: number;
  unitPrice: number;
}

export interface DeliveryAddress {
  id: string;
  tag: 'Home' | 'Office' | 'Other';
  name: string;
  phone: string;
  flat: string;
  street: string;
  area: string;
  landmark?: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault?: boolean;
}

export type PaymentMethod = 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'cod';

export type PaymentStatus = 'paid' | 'pending' | 'cod_pending' | 'refunded';

export type OrderStage = 
  | 'ORDER_PLACED'
  | 'ORDER_CONFIRMED'
  | 'PREPARING'
  | 'HYGIENICALLY_PACKED'
  | 'READY_FOR_DELIVERY'
  | 'PARTNER_ASSIGNED'
  | 'OUT_FOR_DELIVERY'
  | 'OTP_VERIFICATION'
  | 'ORDER_DELIVERED'
  | 'CANCELLED';

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  rating: number;
  activeOrdersCount: number;
  avatarUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  stage: OrderStage;
  deliveryOtp: string;
  assignedPartner?: DeliveryPartner;
  estimatedDeliveryMins: number;
  deliveryNotes?: string;
  timeSlot: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
}

export type AppLanguage = 'en' | 'hi';
export type ActiveRole = 'customer' | 'delivery' | 'admin';
