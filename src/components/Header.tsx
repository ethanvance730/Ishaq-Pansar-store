import React, { useState } from 'react';
import { ShoppingBag, Search, ShieldCheck, Phone, User, Menu, X, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  activeTab: string;
  onNavigate: (tab: string, param?: string) => void;
  onSearch: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ settings, activeTab, onNavigate, onSearch }) => {
  const { totalItemCount, setIsOpen } = useCart();
  const [searchInput, setSearchInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
      onNavigate('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Announcement Bar */}
      <div id="announcement-bar" className="bg-[#1C3F2B] text-emerald-100 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
            100% Pure, Lab-Tested Unani & Ayurvedic Herbs
          </span>
        </div>
        <div className="w-full md:w-auto text-center font-medium">
          <span>{settings.announcementText}</span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-stone-200">
          <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white">
            <Phone className="w-3 h-3 text-amber-300" />
            <span>Support: {settings.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C3F2B] to-[#2E5E41] flex items-center justify-center text-amber-300 shadow-sm border border-emerald-900/10">
              <span className="text-2xl font-serif font-bold tracking-tight">إ</span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-stone-900 font-serif">Ishaq Pansar Store</span>
                <span className="hidden sm:inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  اسحاق پنسار
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium tracking-wide hidden sm:block">
                Authentic Pakistani Herbal Apothecary Since 1984
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                id="header-search-input"
                type="text"
                placeholder="Search pure Salajeet, Kalonji oil, Gond Katira, Ashwagandha..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 text-stone-900 border border-stone-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3F2B] focus:bg-white transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              {searchInput && (
                <button
                  type="submit"
                  className="absolute right-2.5 top-2 bg-[#1C3F2B] text-white p-1 rounded-full hover:bg-[#2E5E41] transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
              <button
                id="nav-home-btn"
                onClick={() => onNavigate('home')}
                className={`transition-colors py-1 ${activeTab === 'home' ? 'text-[#1C3F2B] font-semibold border-b-2 border-[#1C3F2B]' : 'text-stone-600 hover:text-[#1C3F2B]'}`}
              >
                Home
              </button>
              <button
                id="nav-shop-btn"
                onClick={() => onNavigate('shop')}
                className={`transition-colors py-1 ${activeTab === 'shop' ? 'text-[#1C3F2B] font-semibold border-b-2 border-[#1C3F2B]' : 'text-stone-600 hover:text-[#1C3F2B]'}`}
              >
                All Products
              </button>
              <button
                id="nav-categories-btn"
                onClick={() => onNavigate('shop', 'category')}
                className="text-stone-600 hover:text-[#1C3F2B] transition-colors py-1"
              >
                Categories
              </button>
              <button
                id="nav-about-btn"
                onClick={() => onNavigate('about')}
                className={`transition-colors py-1 ${activeTab === 'about' ? 'text-[#1C3F2B] font-semibold border-b-2 border-[#1C3F2B]' : 'text-stone-600 hover:text-[#1C3F2B]'}`}
              >
                Purity Promise
              </button>
            </nav>

            <div className="h-6 w-px bg-stone-200 hidden lg:block" />

            {/* Admin Portal Button */}
            <button
              id="header-admin-btn"
              onClick={() => onNavigate('admin')}
              className={`p-2 rounded-full border transition-all text-xs font-medium flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'bg-[#1C3F2B] text-amber-300 border-[#1C3F2B]'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:border-emerald-700 hover:text-[#1C3F2B]'
              }`}
              title="Admin Portal"
            >
              <User className="w-4 h-4" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            {/* Cart Icon Trigger */}
            <button
              id="header-cart-trigger-btn"
              onClick={() => setIsOpen(true)}
              className="relative p-2.5 bg-[#1C3F2B] text-white rounded-full hover:bg-[#28573C] transition-transform active:scale-95 shadow-sm"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              {totalItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-900 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                  {totalItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search pure Pakistani herbs..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-stone-50 text-stone-900 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1C3F2B]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-stone-50 border-b border-stone-200 px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-stone-800 hover:text-[#1C3F2B]"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('shop'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-stone-800 hover:text-[#1C3F2B]"
          >
            All Products
          </button>
          <button
            onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-stone-800 hover:text-[#1C3F2B]"
          >
            Our Heritage & Purity Promise
          </button>
          <button
            onClick={() => { onNavigate('cart'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-[#1C3F2B] flex items-center justify-between"
          >
            <span>View Cart ({totalItemCount} items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => { onNavigate('admin'); setIsMobileMenuOpen(false); }}
            className="block w-full text-left py-2 font-medium text-stone-600 hover:text-stone-900"
          >
            Store Admin Management
          </button>
        </div>
      )}
    </header>
  );
};
