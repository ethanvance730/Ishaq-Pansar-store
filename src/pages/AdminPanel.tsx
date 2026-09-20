import React, { useState } from 'react';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Search,
  LogOut,
  Settings,
  Filter,
  Eye,
  X,
  Save,
  Check,
  Tag
} from 'lucide-react';
import { Product, Order, Category, StoreSettings, OrderStatus, ProductVariation } from '../types';
import { formatPKR } from '../utils/format';
import { saveProduct, deleteProduct, updateOrderStatus, updateStoreSettings, saveCategory } from '../services/db';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  settings: StoreSettings;
  onRefreshData: () => Promise<void>;
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  categories,
  settings,
  onRefreshData,
  onBackToStore,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // Dev admin logged in by default
  const [adminUsername, setAdminUsername] = useState('admin@ishaqpansar.pk');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Product modal state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [searchProductQuery, setSearchProductQuery] = useState('');

  // Order modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [searchOrderQuery, setSearchOrderQuery] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Quick stats calculation
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername && adminPassword.length >= 4) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Please enter valid admin credentials (any 4+ char password for preview access).');
    }
  };

  // PRODUCT ACTIONS
  const handleOpenNewProduct = () => {
    setEditingProduct({
      name: '',
      urduName: '',
      slug: `item-${Date.now()}`,
      category: categories[0]?.slug || 'pure-herbs',
      description: '',
      shortDescription: '',
      price: 1000,
      salePrice: 850,
      stock: 50,
      sku: `ISP-${Math.floor(100 + Math.random() * 900)}`,
      images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80'],
      inStock: true,
      featured: false,
      bestSeller: false,
      variations: [
        {
          id: `var-${Date.now()}-1`,
          name: '100g Kraft Pouch',
          type: 'weight',
          price: 1000,
          salePrice: 850,
          sku: `ISP-VAR-100G`,
          stock: 30,
        },
        {
          id: `var-${Date.now()}-2`,
          name: '250g Kraft Pouch',
          type: 'weight',
          price: 2200,
          salePrice: 1950,
          sku: `ISP-VAR-250G`,
          stock: 20,
        }
      ]
    });
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    try {
      await saveProduct(editingProduct);
      setIsProductModalOpen(false);
      setEditingProduct(null);
      await onRefreshData();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product. Please check console.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this herbal product?')) {
      try {
        await deleteProduct(id);
        await onRefreshData();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleAddVariation = () => {
    if (!editingProduct) return;
    const newVar: ProductVariation = {
      id: `var-${Date.now()}`,
      name: 'Custom Size / Weight',
      type: 'weight',
      price: editingProduct.price || 1000,
      salePrice: editingProduct.salePrice,
      sku: `${editingProduct.sku || 'ISP'}-${Date.now().toString().slice(-3)}`,
      stock: 20,
    };
    setEditingProduct({
      ...editingProduct,
      variations: [...(editingProduct.variations || []), newVar]
    });
  };

  const handleUpdateVariation = (index: number, updated: Partial<ProductVariation>) => {
    if (!editingProduct || !editingProduct.variations) return;
    const vars = [...editingProduct.variations];
    vars[index] = { ...vars[index], ...updated };
    setEditingProduct({ ...editingProduct, variations: vars });
  };

  const handleRemoveVariation = (index: number) => {
    if (!editingProduct || !editingProduct.variations) return;
    const vars = editingProduct.variations.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, variations: vars });
  };

  // ORDER ACTIONS
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await onRefreshData();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // SETTINGS ACTION
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStoreSettings(settingsForm);
      setSettingsSavedMessage(true);
      setTimeout(() => setSettingsSavedMessage(false), 3000);
      await onRefreshData();
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-stone-100">
        <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200 p-8 shadow-md">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#1C3F2B] text-amber-300 flex items-center justify-center font-serif text-2xl font-bold mx-auto mb-2">
              إ
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">Ishaq Pansar Store</h2>
            <p className="text-xs text-stone-500">Secure Storefront & Inventory Admin Portal</p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1C3F2B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-lg focus:ring-2 focus:ring-[#1C3F2B]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#1C3F2B] text-white font-bold text-xs rounded-lg hover:bg-[#28573C] transition-colors"
            >
              Sign In to Management
            </button>
            <button
              type="button"
              onClick={onBackToStore}
              className="w-full text-xs text-stone-500 hover:text-stone-800 text-center block pt-2"
            >
              ← Return to Customer Storefront
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Admin Top Navigation */}
      <nav className="bg-[#1C3F2B] text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 font-serif font-bold flex items-center justify-center text-sm border border-emerald-600">
            إ
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide">Ishaq Pansar Store</span>
            <span className="text-[10px] ml-2 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold">
              Admin Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToStore}
            className="px-3 py-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-xs font-semibold rounded-lg border border-emerald-600/40 text-stone-200 transition-colors"
          >
            Storefront View
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-stone-300 hover:text-white p-1"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Admin Navigation Tabs */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-8 flex space-x-8 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveSection('overview')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 ${
            activeSection === 'overview'
              ? 'border-[#1C3F2B] text-[#1C3F2B]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveSection('products')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 ${
            activeSection === 'products'
              ? 'border-[#1C3F2B] text-[#1C3F2B]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Herbal Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('orders')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 ${
            activeSection === 'orders'
              ? 'border-[#1C3F2B] text-[#1C3F2B]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
          {pendingOrders > 0 && (
            <span className="ml-1 bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingOrders}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('settings')}
          className={`py-3.5 border-b-2 flex items-center gap-1.5 ${
            activeSection === 'settings'
              ? 'border-[#1C3F2B] text-[#1C3F2B]'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Store & Shipping Settings</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {/* SECTION 1: OVERVIEW */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
                  <span>Total Store Revenue</span>
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {formatPKR(totalRevenue)}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">From completed & pending orders</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
                  <span>Pending COD Orders</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-serif font-bold text-amber-600">
                  {pendingOrders}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Requires packaging & verification</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
                  <span>Delivered Orders</span>
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {deliveredOrders}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Cash collected successfully</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
                  <span>Active Catalog Items</span>
                  <Package className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {products.length}
                </div>
                <div className="text-[11px] text-stone-400 mt-1">Across {categories.length} herbal categories</div>
              </div>
            </div>

            {/* Recent Orders in Dashboard */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveSection('orders')}
                  className="text-xs font-semibold text-[#1C3F2B] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Order #</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">City</th>
                      <th className="px-5 py-3">Items</th>
                      <th className="px-5 py-3">Total Amount</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-stone-400">
                          No customer orders placed yet.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50">
                          <td className="px-5 py-3.5 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                          <td className="px-5 py-3.5 font-medium text-stone-900">{ord.customer.fullName}</td>
                          <td className="px-5 py-3.5">{ord.customer.city}</td>
                          <td className="px-5 py-3.5">{ord.items.length} item(s)</td>
                          <td className="px-5 py-3.5 font-bold text-stone-900">{formatPKR(ord.total)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'Pending' ? 'bg-amber-100 text-amber-900' :
                              ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-900' :
                              ord.status === 'Shipped' ? 'bg-blue-100 text-blue-900' :
                              ord.status === 'Cancelled' ? 'bg-rose-100 text-rose-900' :
                              'bg-stone-100 text-stone-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: PRODUCTS MANAGEMENT */}
        {activeSection === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search products by title or SKU..."
                  value={searchProductQuery}
                  onChange={(e) => setSearchProductQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              <button
                id="admin-add-product-btn"
                onClick={handleOpenNewProduct}
                className="px-4 py-2.5 bg-[#1C3F2B] text-white text-xs font-bold rounded-xl hover:bg-[#28573C] flex items-center justify-center gap-2 shadow-xs"
              >
                <Plus className="w-4 h-4 text-amber-300" />
                <span>Add New Herbal Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Product</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">SKU</th>
                      <th className="px-5 py-3">Regular / Sale Price</th>
                      <th className="px-5 py-3">Stock Units</th>
                      <th className="px-5 py-3">Variations</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products
                      .filter((p) =>
                        p.name.toLowerCase().includes(searchProductQuery.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchProductQuery.toLowerCase())
                      )
                      .map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-50/70">
                          <td className="px-5 py-3.5 flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-stone-100 border border-stone-200 shrink-0"
                            />
                            <div>
                              <div className="font-serif font-bold text-stone-900">{prod.name}</div>
                              {prod.urduName && (
                                <div className="text-[11px] text-emerald-800 font-serif">{prod.urduName}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3.5 capitalize font-medium">{prod.category.replace('-', ' ')}</td>
                          <td className="px-5 py-3.5 font-mono text-[11px]">{prod.sku}</td>
                          <td className="px-5 py-3.5">
                            <span className="font-bold text-stone-900">{formatPKR(prod.salePrice || prod.price)}</span>
                            {prod.salePrice && (
                              <span className="text-[11px] text-stone-400 line-through ml-1.5">
                                {formatPKR(prod.price)}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.stock > 10 ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                            }`}>
                              {prod.stock} units
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-stone-500 font-medium">
                              {prod.variations?.length || 0} variations
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            <button
                              onClick={() => handleEditProduct(prod)}
                              className="p-1.5 text-stone-500 hover:text-[#1C3F2B] hover:bg-stone-100 rounded"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: ORDERS MANAGEMENT */}
        {activeSection === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search by Order #, phone, customer name..."
                  value={searchOrderQuery}
                  onChange={(e) => setSearchOrderQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-500" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-200 rounded-lg bg-white"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                    <tr>
                      <th className="px-5 py-3">Order Number</th>
                      <th className="px-5 py-3">Recipient Details</th>
                      <th className="px-5 py-3">Destination City</th>
                      <th className="px-5 py-3">Payable (COD)</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders
                      .filter((ord) => {
                        if (orderStatusFilter !== 'all' && ord.status !== orderStatusFilter) return false;
                        if (searchOrderQuery.trim()) {
                          const q = searchOrderQuery.toLowerCase();
                          return (
                            ord.orderNumber.toLowerCase().includes(q) ||
                            ord.customer.fullName.toLowerCase().includes(q) ||
                            ord.customer.phone.includes(q)
                          );
                        }
                        return true;
                      })
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-stone-50">
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-stone-900 block">{ord.orderNumber}</span>
                            <span className="text-[10px] text-stone-400">
                              {new Date(ord.createdAt).toLocaleDateString('en-PK')}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-stone-900">{ord.customer.fullName}</div>
                            <div className="text-[11px] text-stone-500">{ord.customer.phone}</div>
                          </td>
                          <td className="px-5 py-3.5 font-medium">{ord.customer.city}</td>
                          <td className="px-5 py-3.5 font-bold text-emerald-900">{formatPKR(ord.total)}</td>
                          <td className="px-5 py-3.5">
                            <select
                              value={ord.status}
                              onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                              className={`text-[11px] font-bold py-1 px-2 rounded-lg border focus:outline-none ${
                                ord.status === 'Pending' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                                ord.status === 'Delivered' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                                ord.status === 'Shipped' ? 'bg-blue-50 text-blue-900 border-blue-300' :
                                ord.status === 'Cancelled' ? 'bg-rose-50 text-rose-900 border-rose-300' :
                                'bg-stone-50 text-stone-800 border-stone-300'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 text-xs text-[#1C3F2B] font-semibold bg-emerald-50 hover:bg-emerald-100 rounded-md border border-emerald-200"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: STORE SETTINGS */}
        {activeSection === 'settings' && (
          <div className="max-w-3xl bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-200 pb-4 mb-6">
              <h3 className="font-serif font-bold text-lg text-stone-900">Storefront & Shipping Configuration</h3>
              <p className="text-xs text-stone-500">Configure Pakistani COD rates, free shipping thresholds, and Pansari contact info.</p>
            </div>

            {settingsSavedMessage && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Store settings updated successfully across Firestore database!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Helpline Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Standard Courier Shipping (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, standardShippingRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                  <span className="text-[10px] text-stone-400">Charged when subtotal is below free threshold</span>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-700 mb-1">
                    Free Shipping Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                  />
                  <span className="text-[10px] text-stone-400">Orders above this receive 100% free delivery</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-700 mb-1">Physical Store Address in Pakistan</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1C3F2B] text-white text-xs font-bold rounded-xl hover:bg-[#28573C] flex items-center gap-2"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>Save Storefront Settings</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: EDIT/ADD PRODUCT */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                {editingProduct.id ? 'Edit Herbal Product' : 'Add New Herbal Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Product Title (English)</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Urdu Title (اردو نام)</label>
                  <input
                    type="text"
                    value={editingProduct.urduName || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, urduName: e.target.value })}
                    placeholder="مثلاً: خالص کلونجی کا تیل"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingProduct.category || categories[0]?.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Sale Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.salePrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Inventory Units in Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Main Image URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg"
                />
              </div>

              {/* Variations Editor */}
              <div className="border-t border-stone-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-stone-800">Packaging / Size Variations</span>
                  <button
                    type="button"
                    onClick={handleAddVariation}
                    className="text-xs text-[#1C3F2B] font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Variation</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {editingProduct.variations?.map((v, i) => (
                    <div key={v.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Variation Name (e.g. 250g)"
                        value={v.name}
                        onChange={(e) => handleUpdateVariation(i, { name: e.target.value })}
                        className="px-2 py-1 border rounded bg-white"
                      />
                      <input
                        type="number"
                        placeholder="Price (PKR)"
                        value={v.price}
                        onChange={(e) => handleUpdateVariation(i, { price: Number(e.target.value) })}
                        className="px-2 py-1 border rounded bg-white"
                      />
                      <input
                        type="number"
                        placeholder="Stock"
                        value={v.stock}
                        onChange={(e) => handleUpdateVariation(i, { stock: Number(e.target.value) })}
                        className="px-2 py-1 border rounded bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariation(i)}
                        className="text-rose-600 hover:text-rose-800 text-right p-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1C3F2B] text-white font-bold rounded-lg hover:bg-[#28573C]"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Order Details: {selectedOrder.orderNumber}
                </h3>
                <span className="text-xs text-stone-500">{new Date(selectedOrder.createdAt).toLocaleString('en-PK')}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
              <p><strong>Customer:</strong> {selectedOrder.customer.fullName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customer.phone}</p>
              <p><strong>Address:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.province}</p>
              {selectedOrder.customer.orderNotes && (
                <p className="text-amber-900 bg-amber-50 p-2 rounded">
                  <strong>Notes:</strong> {selectedOrder.customer.orderNotes}
                </p>
              )}
            </div>

            <div>
              <h4 className="font-bold text-xs text-stone-700 uppercase mb-2">Items Ordered</h4>
              <div className="divide-y divide-stone-100 text-xs">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-900">{it.productName}</span>
                      {it.variationName && <span className="text-stone-500 block text-[11px]">{it.variationName}</span>}
                    </div>
                    <div className="text-right">
                      <span>{it.quantity} × {formatPKR(it.price)}</span>
                      <span className="block font-bold text-stone-900">{formatPKR(it.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-200 pt-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPKR(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{selectedOrder.shippingCharges === 0 ? 'FREE' : formatPKR(selectedOrder.shippingCharges)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
                <span>Total Cash to Collect:</span>
                <span className="text-emerald-900">{formatPKR(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
              <span className="text-xs text-stone-500">Update Status:</span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                className="text-xs font-bold py-1 px-3 rounded-lg border border-stone-300"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
