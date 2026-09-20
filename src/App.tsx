import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AdminPanel } from './pages/AdminPanel';
import { AboutPage } from './pages/AboutPage';

import { Product, Category, StoreSettings, Order } from './types';
import {
  initializeDatabaseIfEmpty,
  getProducts,
  getCategories,
  getOrders,
  getStoreSettings
} from './services/db';
import { INITIAL_STORE_SETTINGS } from './data/initialData';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Database State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load database on mount
  const refreshAllData = useCallback(async () => {
    try {
      await initializeDatabaseIfEmpty();
      const [prods, cats, ords, sets] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
        getStoreSettings(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSettings(sets);
    } catch (err) {
      console.error('Error fetching data from Firestore:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  // Routing and Navigation handlers
  const handleNavigate = (tab: string, param?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tab === 'product' && param) {
      const prod = products.find((p) => p.id === param || p.slug === param);
      if (prod) {
        setSelectedProduct(prod);
        setActiveTab('product-detail');
        return;
      }
    }
    if (tab === 'shop' && param) {
      setSelectedCategorySlug(param);
    } else if (tab === 'shop' && !param) {
      setSelectedCategorySlug(undefined);
    }
    setActiveTab(tab);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveTab('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveTab('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = (order: Order) => {
    setCompletedOrder(order);
    setActiveTab('order-confirmation');
    refreshAllData();
  };

  // If in admin mode, hide customer header and show admin panel
  if (activeTab === 'admin') {
    return (
      <AdminPanel
        products={products}
        orders={orders}
        categories={categories}
        settings={settings}
        onRefreshData={refreshAllData}
        onBackToStore={() => setActiveTab('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#1C3F2B] selection:text-amber-200">
      {/* Header */}
      <Header
        settings={settings}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        settings={settings}
        onNavigateToCheckout={() => setActiveTab('checkout')}
        onNavigateToShop={() => setActiveTab('shop')}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-3 border-[#1C3F2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-500 font-serif">Connecting to Ishaq Pansar Apothecary...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                settings={settings}
                onNavigateToShop={(catSlug) => {
                  setSelectedCategorySlug(catSlug);
                  setActiveTab('shop');
                }}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeTab === 'shop' && (
              <ShopPage
                products={products}
                categories={categories}
                selectedCategorySlug={selectedCategorySlug}
                searchQuery={searchQuery}
                onSelectProduct={handleSelectProduct}
                onCategoryChange={(slug) => setSelectedCategorySlug(slug === 'all' ? undefined : slug)}
              />
            )}

            {activeTab === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                allProducts={products}
                settings={settings}
                onBack={() => setActiveTab('shop')}
                onSelectRelated={handleSelectProduct}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutPage
                settings={settings}
                onOrderComplete={handleOrderComplete}
                onBackToShop={() => setActiveTab('shop')}
              />
            )}

            {activeTab === 'order-confirmation' && completedOrder && (
              <OrderConfirmationPage
                order={completedOrder}
                settings={settings}
                onContinueShopping={() => setActiveTab('shop')}
              />
            )}

            {activeTab === 'about' && (
              <AboutPage
                settings={settings}
                onNavigateToShop={() => setActiveTab('shop')}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />
    </div>
  );
}
