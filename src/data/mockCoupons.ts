import { Coupon, DeliveryPartner, DeliveryAddress } from '../types';

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'TAZYO50',
    description: 'Flat ₹50 OFF on orders above ₹299',
    discountType: 'flat',
    value: 50,
    minOrder: 299,
  },
  {
    code: 'FRESH10',
    description: '10% instant discount on any cart above ₹149',
    discountType: 'percentage',
    value: 10,
    minOrder: 149,
  },
  {
    code: 'HYGIENIC30',
    description: 'Flat ₹30 OFF on fresh washed & ready-to-cut packs',
    discountType: 'flat',
    value: 30,
    minOrder: 199,
  },
  {
    code: 'FIRSTORDER',
    description: 'Welcome bonus: Flat ₹40 OFF',
    discountType: 'flat',
    value: 40,
    minOrder: 199,
  },
];

export const INITIAL_DELIVERY_PARTNERS: DeliveryPartner[] = [
  {
    id: 'partner-1',
    name: 'Ravi Kumar',
    phone: '8451887785',
    vehicleNumber: 'MH-02-EE-4921 (Hero Splendor)',
    rating: 4.9,
    activeOrdersCount: 1,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'partner-2',
    name: 'Sunil Shinde',
    phone: '9820112233',
    vehicleNumber: 'MH-04-AB-8812 (Honda Activa)',
    rating: 4.8,
    activeOrdersCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'partner-3',
    name: 'Amit Verma',
    phone: '9167334455',
    vehicleNumber: 'MH-01-DK-9031 (TVS Jupiter)',
    rating: 4.95,
    activeOrdersCount: 0,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_CUSTOMER_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    tag: 'Home',
    name: 'Priya Sharma',
    phone: '8451887785',
    flat: 'Flat 402, Sai Sagar Heights',
    street: 'Gokhale Road, Near Dadar Station',
    area: 'Dadar West',
    landmark: 'Opp. Shiv Sena Bhavan',
    pincode: '400028',
    lat: 19.0178,
    lng: 72.8397,
    isDefault: true,
  },
  {
    id: 'addr-2',
    tag: 'Office',
    name: 'Priya Sharma',
    phone: '8451887785',
    flat: 'Building 4B, 3rd Floor, Tech Park',
    street: 'LBS Marg',
    area: 'Bandra Kurla Complex (BKC)',
    landmark: 'Near Diamond Bourse',
    pincode: '400051',
    lat: 19.0657,
    lng: 72.8687,
  },
];

// Central TAZYO Produce Hub / Fulfillment Store coordinates (Dadar / Central Mumbai)
export const TAZYO_STORE_LOCATION = {
  lat: 19.0222,
  lng: 72.8433,
  address: 'TAZYO Fresh Fulfillment Hub, Senapati Bapat Marg, Dadar West, Mumbai 400028',
  phone: '8451887785',
};
