import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPKR, calculateShipping } from '../utils/format';
import { StoreSettings } from '../types';

interface CartDrawerProps {
  settings: StoreSettings;
  onNavigateToCheckout: () => void;
  onNavigateToShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ settings, onNavigateToCheckout, onNavigateToShop }) => {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, subtotal } = useCart();
  const shippingFee = calculateShipping(subtotal, settings.standardShippingRate, settings.freeShippingThreshold);
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - subtotal);
  const total = subtotal + shippingFee;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="px-6 py-5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#1C3F2B]" />
              <h2 className="text-lg font-serif font-bold text-stone-900">Your Herbal Basket</h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                {items.length} items
              </span>
            </div>
            <button
              id="close-cart-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-amber-50/60 border-b border-amber-100">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-amber-900 font-medium">
                Add <span className="font-bold text-emerald-800">{formatPKR(remainingForFreeShipping)}</span> more for <strong>FREE Delivery</strong> across Pakistan!
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5">
                🎉 Congratulations! You have unlocked <strong>FREE Delivery</strong> anywhere in Pakistan!
              </p>
            )}
            <div className="w-full bg-amber-200/50 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#1C3F2B] h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, (subtotal / settings.freeShippingThreshold) * 100)}%`
                }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4 text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-serif font-bold text-stone-800 mb-1">Your Basket is Empty</h3>
                <p className="text-xs text-stone-500 max-w-xs mb-6">
                  Explore our collection of authentic mountain herbs, cold-pressed oils, and traditional natural remedies.
                </p>
                <button
                  id="browse-products-empty-cart-btn"
                  onClick={() => {
                    setIsOpen(false);
                    onNavigateToShop();
                  }}
                  className="px-5 py-2.5 bg-[#1C3F2B] text-white text-sm font-semibold rounded-lg hover:bg-[#28573C] transition-colors"
                >
                  Explore Herbal Store
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif font-semibold text-stone-900 truncate">
                      {item.productName}
                    </h4>
                    {item.variation && (
                      <p className="text-xs text-stone-500 font-medium">
                        Option: {item.variation.name}
                      </p>
                    )}
                    <div className="text-xs font-semibold text-stone-900 mt-1">
                      {formatPKR(item.price)}
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-500 hover:text-stone-900"
                          disabled={item.quantity >= item.maxStock}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPKR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nationwide Shipping</span>
                  <span className="font-semibold text-stone-900">
                    {shippingFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatPKR(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total (COD)</span>
                  <span className="text-emerald-900 text-base">{formatPKR(total)}</span>
                </div>
              </div>

              <button
                id="cart-proceed-checkout-btn"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateToCheckout();
                }}
                className="w-full py-3 bg-[#1C3F2B] text-white font-semibold rounded-lg hover:bg-[#28573C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <p className="text-[11px] text-center text-stone-500">
                Pay with Cash on Delivery (COD) across all cities in Pakistan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
