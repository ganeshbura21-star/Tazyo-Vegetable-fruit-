import { Order, OrderStage } from '../types';

export interface StageInfo {
  stage: OrderStage;
  stepNumber: number;
  labelEn: string;
  labelHi: string;
  descriptionEn: string;
  descriptionHi: string;
}

export const ORDER_STAGES_INFO: StageInfo[] = [
  {
    stage: 'ORDER_PLACED',
    stepNumber: 1,
    labelEn: 'Order Placed',
    labelHi: 'ऑर्डर प्राप्त हुआ',
    descriptionEn: 'We received your fresh produce order',
    descriptionHi: 'आपका ऑर्डर हमें प्राप्त हो गया है',
  },
  {
    stage: 'ORDER_CONFIRMED',
    stepNumber: 2,
    labelEn: 'Order Confirmed',
    labelHi: 'ऑर्डर कन्फर्म',
    descriptionEn: 'Order accepted by TAZYO store team',
    descriptionHi: 'ताज़्यो टीम द्वारा ऑर्डर स्वीकार किया गया',
  },
  {
    stage: 'PREPARING',
    stepNumber: 3,
    labelEn: 'Preparing Your Fresh Products',
    labelHi: 'ताज़ा सब्जियां तैयार हो रही हैं',
    descriptionEn: 'Sorting and trimming farm-fresh fruits & vegetables',
    descriptionHi: 'सब्जियों और फलों की गुणवत्ता जांच और छंटाई',
  },
  {
    stage: 'HYGIENICALLY_PACKED',
    stepNumber: 4,
    labelEn: 'Washed & Hygienically Packed',
    labelHi: 'धुलाई और हाइजीनिक पैकिंग',
    descriptionEn: 'Ozone-washed, sanitized, and sealed in clean packs',
    descriptionHi: 'ओजोन वॉश व 100% हाइजीनिक सील पैकिंग',
  },
  {
    stage: 'READY_FOR_DELIVERY',
    stepNumber: 5,
    labelEn: 'Ready for Delivery',
    labelHi: 'डिलीवरी के लिए तैयार',
    descriptionEn: 'Dispatched to our temperature-safe staging dock',
    descriptionHi: 'डिलीवरी डिस्पैच डॉक पर तैयार',
  },
  {
    stage: 'PARTNER_ASSIGNED',
    stepNumber: 6,
    labelEn: 'Delivery Partner Assigned',
    labelHi: 'डिलीवरी पार्टनर असाइन किया गया',
    descriptionEn: 'Rider assigned and collecting your basket',
    descriptionHi: 'डिलीवरी राइडर ऑर्डर ले रहे हैं',
  },
  {
    stage: 'OUT_FOR_DELIVERY',
    stepNumber: 7,
    labelEn: 'Out for Delivery',
    labelHi: 'डिलीवरी के लिए निकला',
    descriptionEn: 'On the way to your doorstep. Keep OTP ready',
    descriptionHi: 'आपके घर के रास्ते में है, OTP तैयार रखें',
  },
  {
    stage: 'OTP_VERIFICATION',
    stepNumber: 8,
    labelEn: 'Delivery OTP Verification',
    labelHi: 'डिलीवरी OTP वेरिफिकेशन',
    descriptionEn: 'Delivery partner has reached your address',
    descriptionHi: 'डिलीवरी पार्टनर आपके पते पर पहुंच चुके हैं',
  },
  {
    stage: 'ORDER_DELIVERED',
    stepNumber: 9,
    labelEn: 'Order Delivered',
    labelHi: 'सफलतापूर्वक डिलीवर हुआ',
    descriptionEn: 'Hygienic fresh produce delivered to you. Enjoy fresh!',
    descriptionHi: 'ऑर्डर सुरक्षित डिलीवर हो चुका है। धन्यवाद!',
  },
];

export function getStageDetails(stage: OrderStage): StageInfo {
  const found = ORDER_STAGES_INFO.find((s) => s.stage === stage);
  if (found) return found;
  return {
    stage,
    stepNumber: 0,
    labelEn: stage,
    labelHi: stage,
    descriptionEn: '',
    descriptionHi: '',
  };
}

export function getNextStage(current: OrderStage): OrderStage | null {
  const index = ORDER_STAGES_INFO.findIndex((s) => s.stage === current);
  if (index >= 0 && index < ORDER_STAGES_INFO.length - 1) {
    return ORDER_STAGES_INFO[index + 1].stage;
  }
  return null;
}

export function generateDeliveryOtp(): string {
  // Generate random 4-digit numeric OTP
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function verifyDeliveryOtp(enteredOtp: string, expectedOtp: string): boolean {
  if (!enteredOtp || !expectedOtp) return false;
  return enteredOtp.trim() === expectedOtp.trim();
}

export const TAZYO_WHATSAPP_NUMBER = '8451887785';
export const TAZYO_WHATSAPP_INTL = '918451887785';

export function createWhatsAppChatUrl(message?: string): string {
  const defaultMsg = 'Hello TAZYO, I would like to inquire about fresh fruits & vegetables delivery.';
  const text = encodeURIComponent(message || defaultMsg);
  return `https://wa.me/${TAZYO_WHATSAPP_INTL}?text=${text}`;
}

export function formatWhatsAppOrderMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.product.name} (${item.unit}) x ${item.quantity} - ₹${item.unitPrice * item.quantity}`
    )
    .join('\n');

  return `*TAZYO Fresh Order #${order.orderNumber}*
📅 Date: ${new Date(order.createdAt).toLocaleString('en-IN')}
👤 Customer: ${order.customerName} (${order.customerPhone})
📍 Address: ${order.deliveryAddress.flat}, ${order.deliveryAddress.street}, ${order.deliveryAddress.area} (PIN: ${order.deliveryAddress.pincode})

🛒 *Items Ordered:*
${itemsText}

💰 Subtotal: ₹${order.subtotal}
${order.discount > 0 ? `🏷️ Discount (${order.couponCode || 'OFF'}): -₹${order.discount}\n` : ''}🚚 Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
*💵 Total Payable: ₹${order.total}*
💳 Payment: ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})

🔐 *Your Delivery Secret OTP: ${order.deliveryOtp}*
_(Share this OTP with delivery partner ONLY upon receiving your clean, hygienic package)_

Thank you for choosing *TAZYO – Fresh. Clean. Hygienic. Ready to Cut.*!`;
}
