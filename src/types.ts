export interface ProductVariation {
  id: string;
  name: string; // e.g., "50g", "100g", "250g", "500g", "1kg", or "Glass Bottle", "Kraft Pouch"
  type: 'weight' | 'packaging' | 'color' | 'size';
  price: number;
  salePrice?: number;
  sku: string;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  urduName?: string;
  slug: string;
  category: string;
  description: string;
  shortDescription?: string;
  benefits?: string[];
  usageInstructions?: string;
  ingredients?: string[];
  price: number; // base or starting price in PKR
  salePrice?: number;
  images: string[];
  stock: number;
  sku: string;
  featured?: boolean;
  bestSeller?: boolean;
  inStock: boolean;
  variations?: ProductVariation[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  urduName?: string;
  slug: string;
  description?: string;
  image?: string;
  itemCount?: number;
}

export interface CartItem {
  id: string; // unique item id (productId + variationId)
  productId: string;
  productName: string;
  productUrduName?: string;
  image: string;
  price: number;
  quantity: number;
  variation?: ProductVariation;
  maxStock: number;
}

export interface OrderCustomer {
  fullName: string;
  phone: string; // Pakistani format (03XX-XXXXXXX)
  email?: string;
  address: string;
  city: string;
  province: string;
  postalCode?: string;
  orderNotes?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  productUrduName?: string;
  image: string;
  variationName?: string;
  variationSku?: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. ISP-2026-XXXX
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  shippingCharges: number;
  discount: number;
  total: number;
  paymentMethod: 'Cash on Delivery (COD)';
  status: OrderStatus;
  createdAt: any;
  updatedAt: any;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  standardShippingRate: number;
  freeShippingThreshold: number;
  announcementText: string;
  isCodEnabled: boolean;
}
