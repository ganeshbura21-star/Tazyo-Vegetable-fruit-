import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  Package, 
  Truck, 
  DollarSign, 
  ShoppingBag, 
  Tag, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  MessageCircle,
  X,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStage, ProductCategory, UnitType } from '../types';
import { ORDER_STAGES_INFO, getNextStage } from '../utils/orderState';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock,
    orders,
    updateOrderStatus,
    assignDeliveryPartner,
    coupons,
    addCoupon,
    deleteCoupon,
    deliveryPartners,
    openWhatsApp,
    language,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'partners' | 'coupons' | 'seo'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    category: 'ready_to_cut' as ProductCategory,
    description: '',
    imageUrl: '',
    priceKg: '',
    price500g: '',
    price250g: '',
    pricePiece: '',
    pricePacket: '',
    isReadyToCut: true,
    isWashed: true,
    inStock: true,
  });

  // Calculate stats
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrders = orders.filter((o) => o.stage !== 'ORDER_DELIVERED' && o.stage !== 'CANCELLED');
  const deliveredOrders = orders.filter((o) => o.stage === 'ORDER_DELIVERED');

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.hindiName.includes(productSearch)
  );

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const unitPrices: { [key in UnitType]?: number } = {};
    if (formData.priceKg) unitPrices['1kg'] = Number(formData.priceKg);
    if (formData.price500g) unitPrices['500g'] = Number(formData.price500g);
    if (formData.price250g) unitPrices['250g'] = Number(formData.price250g);
    if (formData.pricePiece) unitPrices['piece'] = Number(formData.pricePiece);
    if (formData.pricePacket) unitPrices['packet'] = Number(formData.pricePacket);

    const defaultUnit: UnitType = formData.price500g
      ? '500g'
      : formData.priceKg
      ? '1kg'
      : formData.pricePiece
      ? 'piece'
      : 'packet';

    const badges = [];
    if (formData.isWashed) badges.push('Ozone Washed');
    if (formData.isReadyToCut) badges.push('Ready to Cook');
    badges.push('100% Hygienic');

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: formData.name,
        hindiName: formData.hindiName,
        category: formData.category,
        description: formData.description,
        imageUrl: formData.imageUrl || editingProduct.imageUrl,
        unitPrices,
        defaultUnit,
        inStock: formData.inStock,
        isReadyToCut: formData.isReadyToCut,
        isWashed: formData.isWashed,
        hygieneBadges: badges,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        hindiName: formData.hindiName || formData.name,
        category: formData.category,
        description: formData.description || 'Farm-fresh, ozone-washed produce.',
        imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
        unitPrices,
        defaultUnit,
        inStock: formData.inStock,
        stockQuantity: 50,
        isReadyToCut: formData.isReadyToCut,
        isWashed: formData.isWashed,
        hygieneBadges: badges,
      });
    }

    setIsAddProductOpen(false);
    setFormData({
      name: '',
      hindiName: '',
      category: 'ready_to_cut',
      description: '',
      imageUrl: '',
      priceKg: '',
      price500g: '',
      price250g: '',
      pricePiece: '',
      pricePacket: '',
      isReadyToCut: true,
      isWashed: true,
      inStock: true,
    });
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      hindiName: p.hindiName,
      category: p.category,
      description: p.description,
      imageUrl: p.imageUrl,
      priceKg: p.unitPrices['1kg'] ? String(p.unitPrices['1kg']) : '',
      price500g: p.unitPrices['500g'] ? String(p.unitPrices['500g']) : '',
      price250g: p.unitPrices['250g'] ? String(p.unitPrices['250g']) : '',
      pricePiece: p.unitPrices['piece'] ? String(p.unitPrices['piece']) : '',
      pricePacket: p.unitPrices['packet'] ? String(p.unitPrices['packet']) : '',
      isReadyToCut: !!p.isReadyToCut,
      isWashed: !!p.isWashed,
      inStock: p.inStock,
    });
    setIsAddProductOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-left">
      {/* Top Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-400 text-stone-950 font-black text-xs uppercase">
              Admin Portal
            </span>
            <span className="text-xs text-stone-400 font-medium">TAZYO Operations Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mt-1">Management Dashboard</h2>
          <p className="text-xs text-stone-300">
            Control products, live pricing, delivery partner dispatch, orders, and Google visibility.
          </p>
        </div>

        {/* Quick Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsAddProductOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-stone-200 pb-3">
        {[
          { id: 'overview', label: 'Overview & Sales', icon: DollarSign },
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'partners', label: `Delivery Fleet (${deliveryPartners.length})`, icon: Truck },
          { id: 'coupons', label: `Coupons (${coupons.length})`, icon: Tag },
          { id: 'seo', label: 'Google Search & SEO', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & SALES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase">Total Revenue</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                ₹{totalSales}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                ↑ 100% verified online & COD orders
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase">Active Deliveries</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
                {activeOrders.length}
              </div>
              <p className="text-[11px] text-stone-500 mt-1">In prep, packing or on the road</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase">Successfully Delivered</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
                {deliveredOrders.length}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                Verified with two-step OTP
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-xs text-stone-500 font-bold uppercase">Catalog Size</div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {products.length} Items
              </div>
              <p className="text-[11px] text-stone-500 mt-1">
                {products.filter((p) => p.isReadyToCut).length} Ready-to-cut items
              </p>
            </div>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-base">Recent Live Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                View all orders →
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-900">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-stone-500 ml-2">
                      {order.customerName} ({order.deliveryAddress.area})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold">
                      {order.stage.replace(/_/g, ' ')}
                    </span>
                    <span className="font-black text-stone-900">₹{order.total}</span>
                    <span className="font-mono text-stone-500 text-[11px]">
                      OTP: {order.deliveryOtp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products to edit price or stock..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Unit Prices</th>
                    <th className="px-4 py-3">Hygiene Badges</th>
                    <th className="px-4 py-3">Stock Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={p.imageUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{p.name}</div>
                            <div className="text-[11px] text-stone-500">{p.hindiName}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold text-[11px]">
                          {p.category.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(p.unitPrices).map(([unit, price]) => (
                            <span key={unit} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-100">
                              {unit}: ₹{price}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {p.hygieneBadges.map((b) => (
                            <span key={b} className="text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStock(p.id)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors ${
                            p.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {p.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            title="Edit Product & Prices"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT & ADVANCE STAGE */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-stone-900 text-lg">Orders Management</h3>
                <p className="text-xs text-stone-500">
                  Advance order stages, assign delivery partners, monitor OTP and payments
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((order) => {
                const next = getNextStage(order.stage);

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-2.5">
                      <div>
                        <span className="font-black text-stone-900 text-sm">
                          Order #{order.orderNumber}
                        </span>
                        <span className="text-xs text-stone-500 ml-2">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Customer: {order.customerName} ({order.customerPhone})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                          {order.stage.replace(/_/g, ' ')}
                        </span>
                        <span className="font-black text-stone-900 text-sm">
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                    {/* Details row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-stone-500 font-semibold block">Delivery Address:</span>
                        <p className="text-stone-800">
                          {order.deliveryAddress.flat}, {order.deliveryAddress.area} (PIN: {order.deliveryAddress.pincode})
                        </p>
                      </div>

                      <div>
                        <span className="text-stone-500 font-semibold block">Two-Step Delivery OTP:</span>
                        <span className="font-mono font-bold text-sm text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {order.deliveryOtp}
                        </span>
                        <span className="text-[11px] text-stone-500 block mt-0.5">
                          Status: {order.stage === 'ORDER_DELIVERED' ? '✓ Verified by Rider' : 'Pending Handover'}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-500 font-semibold block">Assigned Partner:</span>
                        <select
                          value={order.assignedPartner?.id || ''}
                          onChange={(e) => assignDeliveryPartner(order.id, e.target.value)}
                          className="mt-1 px-2 py-1 bg-white border border-stone-300 rounded-lg text-xs font-medium w-full"
                        >
                          <option value="">Select Delivery Rider</option>
                          {deliveryPartners.map((dp) => (
                            <option key={dp.id} value={dp.id}>
                              {dp.name} ({dp.vehicleNumber})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Stage Advancer Button */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200">
                      <div className="text-[11px] text-stone-500">
                        Payment: <b className="text-stone-800">{order.paymentMethod.toUpperCase()}</b> ({order.paymentStatus})
                      </div>

                      <div className="flex items-center gap-2">
                        {next && (
                          <button
                            onClick={() => updateOrderStatus(order.id, next)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <span>Advance to {next.replace(/_/g, ' ')}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                          className="px-2.5 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DELIVERY PARTNERS */}
      {activeTab === 'partners' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-base">TAZYO Delivery Fleet</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {deliveryPartners.map((dp) => (
              <div key={dp.id} className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={dp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                    alt={dp.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm">{dp.name}</h4>
                    <p className="text-stone-500 font-mono">+91 {dp.phone}</p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                      ★ {dp.rating} Rating
                    </span>
                  </div>
                </div>
                <div className="text-stone-600 pt-2 border-t border-stone-200">
                  <div>Vehicle: <b className="text-stone-800">{dp.vehicleNumber}</b></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-5 space-y-4">
          <h3 className="font-bold text-stone-900 text-base">Active Discount Coupons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {coupons.map((c) => (
              <div key={c.code} className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <div className="font-mono font-black text-emerald-900 text-sm">
                    {c.code}
                  </div>
                  <p className="text-emerald-700">{c.description}</p>
                  <p className="text-stone-500 text-[10px]">Min Order: ₹{c.minOrder}</p>
                </div>
                <button
                  onClick={() => deleteCoupon(c.code)}
                  className="text-stone-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: GOOGLE SEARCH & BUSINESS PROFILE SEO */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-6 text-xs text-stone-700">
          <div>
            <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
              Google Visibility Guide
            </span>
            <h3 className="text-xl font-black text-stone-900 mt-1">
              Google Search & Google Business Profile Integration
            </h3>
            <p className="text-stone-500 mt-0.5">
              Live configuration for maximum local discoverability for TAZYO Fresh Fruits & Vegetables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                1. SEO & Schema.org Structured Data
              </h4>
              <p className="text-stone-600">
                Embedded directly into <code>index.html</code> with GroceryStore and DeliveryService JSON-LD markup:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li>Business Name: <b>TAZYO Fresh Fruits & Vegetables</b></li>
                <li>Tagline: <b>Wash, Hygienic & Ready to Cut Delivery</b></li>
                <li>WhatsApp Order Number: <b>8451887785</b></li>
                <li>Website: <b>https://tazyo-fresh-fruits-cut-vegetables-delivery-1.ai.studio</b></li>
                <li>Geographical Hub: <b>Mumbai, Maharashtra (Dadar Central)</b></li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-600" />
                2. Google Business Profile Checklist
              </h4>
              <ul className="list-disc pl-4 space-y-1 text-stone-600">
                <li>Claim Google Business Profile at <b>business.google.com</b></li>
                <li>Category: <b>Produce Market / Vegetable Wholesaler / Grocery Delivery</b></li>
                <li>Phone: <b>+91 8451887785</b> (matches WhatsApp QR)</li>
                <li>Add Product Photos (Ready-to-cut lauki, french beans, garlic)</li>
                <li>Service Areas: Dadar, Bandra, Lower Parel, Prabhadevi, Mumbai</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-stone-900 text-base sm:text-lg">
                {editingProduct ? 'Edit Product & Pricing' : 'Add New Fresh Product'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Name (English)</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Cut French Beans"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Hindi Name</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="उदा. कटी हरी बीन्स"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="ready_to_cut">Ready to Cut & Washed</option>
                    <option value="fresh_vegetables">Fresh Whole Vegetables</option>
                    <option value="cut_fruits">Prepared Cut Fruits</option>
                    <option value="fresh_fruits">Fresh Whole Fruits</option>
                    <option value="leafy_herbs">Leafy & Herbs</option>
                    <option value="combos">Combos & Baskets</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Price Fields Per Unit */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Unit Pricing (Leave blank if not available for that unit)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold">Per 1kg (₹)</span>
                    <input
                      type="number"
                      value={formData.priceKg}
                      onChange={(e) => setFormData({ ...formData, priceKg: e.target.value })}
                      placeholder="e.g. 80"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold">Per 500g (₹)</span>
                    <input
                      type="number"
                      value={formData.price500g}
                      onChange={(e) => setFormData({ ...formData, price500g: e.target.value })}
                      placeholder="e.g. 45"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold">Per 250g (₹)</span>
                    <input
                      type="number"
                      value={formData.price250g}
                      onChange={(e) => setFormData({ ...formData, price250g: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold">Per Piece (₹)</span>
                    <input
                      type="number"
                      value={formData.pricePiece}
                      onChange={(e) => setFormData({ ...formData, pricePiece: e.target.value })}
                      placeholder="e.g. 40"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 font-semibold">Per Packet (₹)</span>
                    <input
                      type="number"
                      value={formData.pricePacket}
                      onChange={(e) => setFormData({ ...formData, pricePacket: e.target.value })}
                      placeholder="e.g. 30"
                      className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isReadyToCut}
                    onChange={(e) => setFormData({ ...formData, isReadyToCut: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Ready to Cut / Cook</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isWashed}
                    onChange={(e) => setFormData({ ...formData, isWashed: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>100% Ozone Washed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span>Available in Stock</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
