import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  DeliveryAddress, 
  Coupon, 
  ActiveRole, 
  AppLanguage, 
  UnitType, 
  OrderStage,
  DeliveryPartner
} from '../types';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { INITIAL_COUPONS, INITIAL_DELIVERY_PARTNERS, DEFAULT_CUSTOMER_ADDRESSES, TAZYO_STORE_LOCATION } from '../data/mockCoupons';
import { generateDeliveryOtp, getNextStage, TAZYO_WHATSAPP_NUMBER, TAZYO_WHATSAPP_INTL } from '../utils/orderState';

interface AppContextType {
  // Catalog
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleStock: (productId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, unit: UnitType, quantity?: number) => void;
  updateQuantity: (productId: string, unit: UnitType, delta: number) => void;
  removeFromCart: (productId: string, unit: UnitType) => void;
  clearCart: () => void;
  cartCount: number;

  // Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, stage: OrderStage) => void;
  verifyOrderDeliveryOtp: (orderId: string, enteredOtp: string) => { success: boolean; message: string };
  assignDeliveryPartner: (orderId: string, partnerId: string) => void;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;

  // User & Role
  currentRole: ActiveRole;
  setCurrentRole: (role: ActiveRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  userPhone: string;
  userName: string;
  isLoggedIn: boolean;
  loginWithPhone: (phone: string, name: string) => void;
  logout: () => void;
  addresses: DeliveryAddress[];
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  setDefaultAddress: (id: string) => void;
  selectedAddress: DeliveryAddress | null;
  setSelectedAddress: (addr: DeliveryAddress) => void;

  // Delivery Partners
  deliveryPartners: DeliveryPartner[];
  addDeliveryPartner: (partner: Omit<DeliveryPartner, 'id'>) => void;

  // Modals & UI
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  isWhatsAppQrOpen: boolean;
  setIsWhatsAppQrOpen: (open: boolean) => void;
  isOrderTrackerOpen: boolean;
  setIsOrderTrackerOpen: (open: boolean) => void;

  // WhatsApp helper
  openWhatsApp: (customText?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Demo Order so user can test tracking, OTP verification, and Google Maps immediately
const DEMO_ORDER: Order = {
  id: 'ord-1001',
  orderNumber: 'TZ-8451',
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  customerName: 'Priya Sharma',
  customerPhone: '8451887785',
  deliveryAddress: DEFAULT_CUSTOMER_ADDRESSES[0],
  items: [
    {
      productId: 'prod-rtc-1',
      product: INITIAL_PRODUCTS[0],
      unit: '500g',
      quantity: 1,
      unitPrice: 58,
    },
    {
      productId: 'prod-rtc-3',
      product: INITIAL_PRODUCTS[2],
      unit: '250g',
      quantity: 2,
      unitPrice: 28,
    },
    {
      productId: 'prod-frt-cut-1',
      product: INITIAL_PRODUCTS[6],
      unit: '500g',
      quantity: 1,
      unitPrice: 80,
    },
  ],
  subtotal: 194,
  discount: 0,
  deliveryFee: 30,
  total: 224,
  paymentMethod: 'upi',
  paymentStatus: 'paid',
  transactionId: 'UPI-TXN-8451887785',
  stage: 'OUT_FOR_DELIVERY',
  deliveryOtp: '4928',
  assignedPartner: INITIAL_DELIVERY_PARTNERS[0],
  estimatedDeliveryMins: 14,
  timeSlot: 'Morning (8:00 AM - 10:00 AM)',
  deliveryNotes: 'Please ring bell and leave in clean ozone cooler bag.',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tazyo_products_v1');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tazyo_cart_v1');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tazyo_orders_v1');
    return saved ? JSON.parse(saved) : [DEMO_ORDER];
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('tazyo_coupons_v1');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);

  // Delivery Partners
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(() => {
    const saved = localStorage.getItem('tazyo_partners_v1');
    return saved ? JSON.parse(saved) : INITIAL_DELIVERY_PARTNERS;
  });

  // User & Role
  const [currentRole, setCurrentRole] = useState<ActiveRole>('customer');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [userPhone, setUserPhone] = useState<string>('8451887785');
  const [userName, setUserName] = useState<string>('Priya Sharma');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Addresses
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('tazyo_addresses_v1');
    return saved ? JSON.parse(saved) : DEFAULT_CUSTOMER_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(
    () => addresses.find((a) => a.isDefault) || addresses[0] || null
  );

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isWhatsAppQrOpen, setIsWhatsAppQrOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(DEMO_ORDER);

  // Persist
  useEffect(() => {
    localStorage.setItem('tazyo_products_v1', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tazyo_cart_v1', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('tazyo_orders_v1', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tazyo_addresses_v1', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('tazyo_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('tazyo_partners_v1', JSON.stringify(deliveryPartners));
  }, [deliveryPartners]);

  // Cart operations
  const addToCart = (product: Product, unit: UnitType, quantity: number = 1) => {
    const unitPrice = product.unitPrices[unit] || Object.values(product.unitPrices)[0] || 50;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id && item.unit === unit);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.unit === unit
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, unit, quantity, unitPrice }];
    });
  };

  const updateQuantity = (productId: string, unit: UnitType, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.unit === unit) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string, unit: UnitType) => {
    setCart((prev) => prev.filter((item) => !(item.productId === productId && item.unit === unit)));
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Coupon
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === trimmed);
    if (!found) {
      return { success: false, message: 'Invalid coupon code' };
    }
    const subtotal = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    if (subtotal < found.minOrder) {
      return { 
        success: false, 
        message: `Min order for ${found.code} is ₹${found.minOrder}. Add items worth ₹${found.minOrder - subtotal} more.` 
      };
    }
    setActiveCoupon(found);
    return { success: true, message: `Applied coupon ${found.code} successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const addCoupon = (c: Coupon) => {
    setCoupons((prev) => [...prev.filter((item) => item.code !== c.code), c]);
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((item) => item.code !== code));
  };

  // Orders
  const placeOrder = (orderData: Partial<Order>): Order => {
    const orderNumber = `TZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const deliveryOtp = generateDeliveryOtp();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customerName: orderData.customerName || userName || 'Customer',
      customerPhone: orderData.customerPhone || userPhone || '8451887785',
      deliveryAddress: orderData.deliveryAddress || selectedAddress || DEFAULT_CUSTOMER_ADDRESSES[0],
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      couponCode: activeCoupon?.code,
      deliveryFee: orderData.deliveryFee ?? 0,
      total: orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'upi',
      paymentStatus: orderData.paymentStatus || 'paid',
      transactionId: orderData.transactionId || `UPI-${Date.now().toString().slice(-8)}`,
      stage: 'ORDER_PLACED',
      deliveryOtp,
      assignedPartner: deliveryPartners[0],
      estimatedDeliveryMins: 35,
      timeSlot: orderData.timeSlot || 'Express (30-45 Mins)',
      deliveryNotes: orderData.deliveryNotes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setIsOrderTrackerOpen(true);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, stage: OrderStage) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, stage } : order))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, stage } : null));
    }
  };

  const verifyOrderDeliveryOtp = (orderId: string, enteredOtp: string) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    if (order.deliveryOtp.trim() !== enteredOtp.trim()) {
      return { success: false, message: 'Incorrect Delivery OTP. Please ask customer for correct 4-digit OTP.' };
    }
    // Update to ORDER_DELIVERED
    updateOrderStatus(orderId, 'ORDER_DELIVERED');
    return { success: true, message: 'OTP verified successfully! Order marked as Delivered.' };
  };

  const assignDeliveryPartner = (orderId: string, partnerId: string) => {
    const partner = deliveryPartners.find((p) => p.id === partnerId);
    if (!partner) return;
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, assignedPartner: partner, stage: 'PARTNER_ASSIGNED' } : o))
    );
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, assignedPartner: partner, stage: 'PARTNER_ASSIGNED' } : null));
    }
  };

  // Products CRUD
  const addProduct = (p: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...p,
      id: `prod-${Date.now()}`,
    };
    setProducts((prev) => [newProd, ...prev]);
  };

  const updateProduct = (p: Product) => {
    setProducts((prev) => prev.map((item) => (item.id === p.id ? p : item)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  };

  // Address
  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setSelectedAddress(newAddr);
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    const found = addresses.find((a) => a.id === id);
    if (found) setSelectedAddress(found);
  };

  // Partners
  const addDeliveryPartner = (partner: Omit<DeliveryPartner, 'id'>) => {
    const newPartner: DeliveryPartner = {
      ...partner,
      id: `partner-${Date.now()}`,
    };
    setDeliveryPartners((prev) => [...prev, newPartner]);
  };

  // Auth
  const loginWithPhone = (phone: string, name: string) => {
    setUserPhone(phone);
    setUserName(name);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    setUserName('');
  };

  // WhatsApp
  const openWhatsApp = (customText?: string) => {
    const defaultText = `Hello TAZYO! I want to order fresh washed & ready-to-cut vegetables.`;
    const text = encodeURIComponent(customText || defaultText);
    const url = `https://wa.me/${TAZYO_WHATSAPP_INTL}?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AppContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        coupons,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
        verifyOrderDeliveryOtp,
        assignDeliveryPartner,
        activeOrder,
        setActiveOrder,
        currentRole,
        setCurrentRole,
        language,
        setLanguage,
        userPhone,
        userName,
        isLoggedIn,
        loginWithPhone,
        logout,
        addresses,
        addAddress,
        setDefaultAddress,
        selectedAddress,
        setSelectedAddress,
        deliveryPartners,
        addDeliveryPartner,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        isWhatsAppQrOpen,
        setIsWhatsAppQrOpen,
        isOrderTrackerOpen,
        setIsOrderTrackerOpen,
        openWhatsApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
