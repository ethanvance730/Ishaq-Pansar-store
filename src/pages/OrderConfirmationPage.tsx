import React from 'react';
import { CheckCircle, Package, ArrowRight, Phone, MapPin, Printer } from 'lucide-react';
import { Order, StoreSettings } from '../types';
import { formatPKR } from '../utils/format';

interface OrderConfirmationPageProps {
  order: Order;
  settings: StoreSettings;
  onContinueShopping: () => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
  order,
  settings,
  onContinueShopping,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-10 shadow-sm text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
          <CheckCircle className="w-9 h-9" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-[#1C3F2B] font-mono">
          Order Received • جزاک اللہ خیر
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-2">
          Thank You, {order.customer.fullName}!
        </h1>
        <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
          Your order has been recorded in the Ishaq Pansar Store system. Our team is hand-packaging your pure herbs for dispatched courier delivery.
        </p>

        {/* Order Badge */}
        <div className="my-6 inline-flex items-center gap-3 px-4 py-2 bg-stone-100 rounded-xl border border-stone-200 text-sm">
          <span className="text-stone-500 font-medium">Tracking Order #:</span>
          <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
          <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded font-semibold">
            {order.status}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="text-left border border-stone-200 rounded-2xl p-6 bg-stone-50/50 mb-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-stone-200 text-xs">
            <div>
              <h4 className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1C3F2B]" />
                Delivery Address:
              </h4>
              <p className="text-stone-600">{order.customer.fullName}</p>
              <p className="text-stone-600">{order.customer.address}</p>
              <p className="text-stone-600 font-semibold">{order.customer.city}, {order.customer.province}</p>
            </div>

            <div>
              <h4 className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#1C3F2B]" />
                Contact & Payment:
              </h4>
              <p className="text-stone-600">Phone: {order.customer.phone}</p>
              {order.customer.email && <p className="text-stone-600">Email: {order.customer.email}</p>}
              <p className="text-emerald-900 font-semibold mt-1">Payment: Cash on Delivery (COD)</p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-sm mb-3">
              Ordered Items
            </h4>
            <div className="divide-y divide-stone-200">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.productName} className="w-10 h-10 rounded object-cover border border-stone-200" />
                    <div>
                      <p className="font-semibold text-stone-900">{item.productName}</p>
                      {item.variationName && <p className="text-stone-500">{item.variationName}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-stone-600">{item.quantity} × {formatPKR(item.price)}</p>
                    <p className="font-bold text-stone-900">{formatPKR(item.subtotal)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-medium text-stone-900">{formatPKR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-medium text-stone-900">
                {order.shippingCharges === 0 ? 'FREE' : formatPKR(order.shippingCharges)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Amount (to pay on delivery):</span>
              <span className="text-emerald-900">{formatPKR(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice Receipt</span>
          </button>
          <button
            id="order-continue-shopping-btn"
            onClick={onContinueShopping}
            className="w-full sm:w-auto px-8 py-3 bg-[#1C3F2B] text-white text-xs font-bold rounded-xl hover:bg-[#28573C] flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
