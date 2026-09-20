import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, X, Check } from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopPageProps {
  products: Product[];
  categories: Category[];
  selectedCategorySlug?: string;
  searchQuery?: string;
  onSelectProduct: (product: Product) => void;
  onCategoryChange: (slug: string) => void;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  categories,
  selectedCategorySlug,
  searchQuery = '',
  onSelectProduct,
  onCategoryChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug || 'all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(6000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter products based on search, category, price, and stock
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category check
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      // Price check
      const effectivePrice = item.salePrice || item.price;
      if (effectivePrice > priceRange) {
        return false;
      }
      // In stock check
      if (inStockOnly && item.stock <= 0) {
        return false;
      }
      // Search term
      if (localSearch.trim()) {
        const query = localSearch.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesUrdu = item.urduName?.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        if (!matchesName && !matchesUrdu && !matchesDesc && !matchesCategory) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // Default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, priceRange, inStockOnly, localSearch, sortBy]);

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    onCategoryChange(slug);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange(6000);
    setInStockOnly(false);
    setLocalSearch('');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Page Title */}
      <div className="border-b border-stone-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
            Traditional Herbal Apothecary
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Herbal Products Catalog
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Browse pure Shilajit, cold-pressed seed oils, stone-ground medicinal roots, and organic botanicals.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search catalog..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1C3F2B]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-stone-500" />
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-sm border border-stone-200 rounded-lg bg-white text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#1C3F2B]"
            >
              <option value="featured">Featured & Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

          <button
            id="mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 border border-stone-200 rounded-lg bg-white text-sm font-medium text-stone-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Grid with Sidebar Filters (inspired by reference catalog layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside
          className={`${
            isMobileFilterOpen ? 'block fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'
          } md:block md:static md:z-0 md:p-0 md:bg-transparent`}
        >
          <div className="bg-stone-50 md:bg-white md:border md:border-stone-200/80 rounded-xl p-5 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="font-serif font-bold text-stone-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1C3F2B]" />
                <span>Filters</span>
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#1C3F2B] hover:underline font-medium"
                >
                  Reset All
                </button>
                {isMobileFilterOpen && (
                  <button onClick={() => setIsMobileFilterOpen(false)} className="md:hidden p-1">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Categories
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleCategorySelect('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-[#1C3F2B] text-white font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>All Products</span>
                  <span className="text-[11px] opacity-75">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat.slug).length;
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#1C3F2B] text-white font-semibold'
                          : 'text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <span>{cat.name}</span>
                        {cat.urduName && (
                          <span className={`block text-[10px] ${isSelected ? 'text-amber-200' : 'text-stone-400'}`}>
                            {cat.urduName}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] opacity-75 shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Max Price
                </h3>
                <span className="text-xs font-bold text-stone-900">
                  Rs. {priceRange.toLocaleString('en-PK')}
                </span>
              </div>
              <input
                id="price-range-slider"
                type="range"
                min="400"
                max="6000"
                step="100"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#1C3F2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>Rs. 400</span>
                <span>Rs. 6,000+</span>
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-stone-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-stone-300 text-[#1C3F2B] focus:ring-[#1C3F2B] w-4 h-4"
                />
                <span>In Stock Products Only</span>
              </label>
            </div>

            {/* Natural Ingredients Badge */}
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200/70 text-xs text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Unadulterated Raw Herbs</span>
              </div>
              <p className="text-[11px] text-emerald-800/80">
                No synthetic binders or additives. Hand-sorted and ground in wooden & stone mills.
              </p>
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 bg-[#1C3F2B] text-white text-xs font-bold rounded-lg"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            )}
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="md:col-span-3">
          {/* Status summary */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-4 px-1">
            <span>
              Showing <strong className="text-stone-800">{filteredProducts.length}</strong> herbal products
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </span>
            {localSearch && (
              <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-600">
                Results for &quot;{localSearch}&quot;
              </span>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-800 mb-2">No Matching Products</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
                We couldn&apos;t find any herbal remedies matching your current filter criteria. Try resetting your price or category filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#1C3F2B] text-white text-xs font-bold rounded-lg hover:bg-[#28573C]"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
