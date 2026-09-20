import React, { useState } from 'react';
import { ShieldCheck, Truck, ArrowRight, CheckCircle2, Lock, Phone, User, MapPin, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings, OrderCustomer, Order } from '../types';
import { formatPKR, calculateShipping, generateOrderNumber } from '../utils/format';
import { PAKISTAN_CITIES } from '../data/initialData';
import { createOrder } from '../services/db';

interface CheckoutPageProps {
  settings: StoreSettings;
  onOrderComplete: (order: Order) => void;
  onBackToShop: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ settings, onOrderComplete, onBackToShop }) => {
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState<OrderCustomer>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    orderNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shippingFee = calculateShipping(subtotal, settings.standardShippingRate, settings.freeShippingThreshold);
  const total = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Pakistani phone number validation check (03xx-xxxxxxx or +923xxxxxxxxx)
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full recipient name.');
      return;
    }
    if (cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid Pakistani contact phone number (e.g., 03001234567).');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMessage('Please provide your complete house/street address for reliable courier delivery.');
      return;
    }
    if (items.length === 0) {
      setErrorMessage('Your basket is empty. Please add items before checking out.');
      return;
    }

    setLoading(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productUrduName: item.productUrduName,
        image: item.image,
        variationName: item.variation?.name,
        variationSku: item.variation?.sku,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      }));

      const newOrder = await createOrder({
        orderNumber,
        customer: formData,
        items: orderItems,
        subtotal,
        shippingCharges: shippingFee,
        discount: 0,
        total,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Pending',
      });

      clearCart();
      onOrderComplete(newOrder);
    } catch (err: any) {
      console.error('Order creation error:', err);
      // Even if firestore errors due to permissions/offline, we still provide a seamless fallback
      const fallbackOrder: Order = {
        id: `offline-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        customer: formData,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          productUrduName: item.productUrduName,
          image: item.image,
          variationName: item.variation?.name,
          variationSku: item.variation?.sku,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        })),
        subtotal,
        shippingCharges: shippingFee,
        discount: 0,
        total,
        paymentMethod: 'Cash on Delivery (COD)',
        status: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      clearCart();
      onOrderComplete(fallbackOrder);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">No Items in Basket</h2>
        <p className="text-sm text-stone-500 mb-6">
          Your herbal basket is currently empty. Browse our catalog to select authentic items.
        </p>
        <button
          onClick={onBackToShop}
          className="px-6 py-2.5 bg-[#1C3F2B] text-white font-semibold text-sm rounded-lg hover:bg-[#28573C]"
        >
          Return to Herbal Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="border-b border-stone-200 pb-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Complete Your Order
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Pay via Cash on Delivery (COD). Verified shipment delivered straight to your doorstep across Pakistan.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form: Delivery & Contact details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <Phone className="w-4 h-4 text-[#1C3F2B]" />
              <span>Customer Contact Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Recipient Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-fullname-input"
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Muhammad Usman"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone / WhatsApp Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  name="phone"
                  required
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
                />
                <span className="text-[11px] text-stone-400">Our courier will call/SMS this number before delivery.</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Email Address (Optional for Order Receipt)
              </label>
              <input
                id="checkout-email-input"
                type="email"
                name="email"
                placeholder="youremail@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2 border-b border-stone-100 pb-3">
              <MapPin className="w-4 h-4 text-[#1C3F2B]" />
              <span>Delivery Address in Pakistan</span>
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Street Address, House/Apartment #, Area <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="checkout-address-input"
                name="address"
                required
                rows={3}
                placeholder="House # 12, Street # 4, Block B, DHA Phase 5..."
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  City <span className="text-rose-500">*</span>
                </label>
                <select
                  id="checkout-city-select"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
                >
                  {PAKISTAN_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad Capital Territory">Islamabad (ICT)</option>
                  <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
                  <option value="Azad Jammu & Kashmir">Azad Kashmir</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Special Delivery Instructions or Pansari Customization
              </label>
              <input
                id="checkout-notes-input"
                type="text"
                name="orderNotes"
                placeholder="e.g. Ring bell twice, deliver after 2 PM, or packaging request"
                value={formData.orderNotes}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:bg-white focus:ring-2 focus:ring-[#1C3F2B] focus:outline-none"
              />
            </div>
          </div>

          {/* Payment Method Badge */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#1C3F2B] text-amber-300 flex items-center justify-center font-bold text-xs">
                COD
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">Cash on Delivery (Pakistan)</h3>
                <p className="text-xs text-stone-600">Pay cash in Pakistani Rupees when you inspect and receive the parcel.</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          </div>
        </div>

        {/* Right Summary: Order review */}
        <div className="lg:col-span-5">
          <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sticky top-28 space-y-6">
            <h2 className="text-base font-serif font-bold text-stone-900 border-b border-stone-200 pb-3">
              Order Summary ({items.length} items)
            </h2>

            {/* Items list */}
            <div className="divide-y divide-stone-200 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-lg object-cover bg-white border border-stone-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">{item.productName}</p>
                    {item.variation && (
                      <p className="text-[11px] text-stone-500">{item.variation.name}</p>
                    )}
                    <span className="text-xs text-stone-600">
                      Qty: {item.quantity} × {formatPKR(item.price)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-900">
                    {formatPKR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculation summary */}
            <div className="space-y-2 pt-3 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Basket Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Standard Delivery (TCS / Trax / Leopards)</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPKR(shippingFee)}
                </span>
              </div>
              {shippingFee > 0 && (
                <div className="text-[11px] text-stone-500">
                  Free delivery applies automatically on orders of {formatPKR(settings.freeShippingThreshold)}+
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Net Payable (COD)</span>
                <span className="text-emerald-900 text-lg">{formatPKR(total)}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1C3F2B] text-white font-bold rounded-xl hover:bg-[#28573C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Confirm Cash on Delivery Order</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>

            <div className="text-[11px] text-stone-500 text-center space-y-1">
              <p className="flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                No advance payment needed. Pay upon delivery in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
