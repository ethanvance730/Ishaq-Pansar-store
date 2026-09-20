import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  subtotal: 0,
  totalItemCount: 0,
  isOpen: false,
  setIsOpen: () => {},
});

const CART_STORAGE_KEY = 'ishaq_pansar_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist cart:', e);
    }
  }, [items]);

  const addToCart = (product: Product, variation?: ProductVariation, quantity: number = 1) => {
    setItems((prevItems) => {
      const cartItemId = variation ? `${product.id}-${variation.id}` : product.id;
      const unitPrice = variation ? (variation.salePrice || variation.price) : (product.salePrice || product.price);
      const displayImage = (variation && variation.image) ? variation.image : (product.images[0] || '');
      const maxStock = variation ? variation.stock : product.stock;

      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQuantity = Math.min(maxStock, existing.quantity + quantity);
        const updated = [...prevItems];
        updated[existingIndex] = { ...existing, quantity: newQuantity };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          productUrduName: product.urduName,
          image: displayImage,
          price: unitPrice,
          quantity: Math.min(maxStock, Math.max(1, quantity)),
          variation: variation,
          maxStock: maxStock
        };
        return [...prevItems, newItem];
      }
    });
    setIsOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: Math.min(item.maxStock, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalItemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
