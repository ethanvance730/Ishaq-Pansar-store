import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Shield, Truck, RefreshCw, Star, Heart, ShoppingBag, AlertCircle } from 'lucide-react';
import { Product, ProductVariation, StoreSettings } from '../types';
import { formatPKR } from '../utils/format';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  settings: StoreSettings;
  onBack: () => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  settings,
  onBack,
  onSelectRelated,
}) => {
  const { addToCart } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'benefits' | 'usage' | 'ingredients'>('description');
  const [addedNotice, setAddedNotice] = useState(false);

  // When product changes, reset variation and quantity
  useEffect(() => {
    setSelectedVariation(product.variations && product.variations.length > 0 ? product.variations[0] : undefined);
    setQuantity(1);
    setActiveImageIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  // When a variation is chosen, if it has a custom image, prioritize it
  const handleVariationChange = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    if (variation.image) {
      const idx = product.images.findIndex((img) => img === variation.image);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  };

  const currentPrice = selectedVariation
    ? (selectedVariation.salePrice || selectedVariation.price)
    : (product.salePrice || product.price);
  const regularPrice = selectedVariation ? selectedVariation.price : product.price;
  const currentStock = selectedVariation ? selectedVariation.stock : product.stock;
  const currentSku = selectedVariation ? selectedVariation.sku : product.sku;

  const handleAddToCart = () => {
    addToCart(product, selectedVariation, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb & Back Navigation */}
      <div className="flex items-center space-x-2 text-sm text-stone-500 mb-6">
        <button
          id="pdp-back-btn"
          onClick={onBack}
          className="flex items-center gap-1.5 text-stone-700 hover:text-[#1C3F2B] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>
        <span>/</span>
        <span className="capitalize">{product.category.replace('-', ' ')}</span>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 relative flex items-center justify-center p-4">
            <img
              src={selectedVariation?.image || product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl shadow-xs transition-all duration-300"
            />
            {product.urduName && (
              <div className="absolute top-4 right-4 bg-[#1C3F2B]/90 text-amber-200 text-sm font-serif px-3 py-1 rounded-full shadow-md backdrop-blur-xs">
                {product.urduName}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                    activeImageIndex === idx ? 'border-[#1C3F2B] shadow-md ring-2 ring-emerald-600/20' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Metadata & Action */}
        <div className="flex flex-col justify-start">
          <div className="border-b border-stone-200 pb-6 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900">
                100% Pure Herbal
              </span>
              <div className="flex items-center text-amber-500 text-xs">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1.5 font-bold text-stone-700">4.9 / 5.0</span>
                <span className="ml-1 text-stone-400">(48 Verified Pansari Reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mb-1">
              {product.name}
            </h1>
            {product.urduName && (
              <p className="text-lg font-serif text-emerald-900 mb-3 font-medium">
                {product.urduName}
              </p>
            )}

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-stone-900">
                {formatPKR(currentPrice)}
              </span>
              {regularPrice > currentPrice && (
                <span className="text-lg text-stone-400 line-through">
                  {formatPKR(regularPrice)}
                </span>
              )}
              {regularPrice > currentPrice && (
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 py-0.5 rounded">
                  Save {formatPKR(regularPrice - currentPrice)}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1">Tax included. Cash on Delivery available across Pakistan.</p>
          </div>

          {/* Variations Selector */}
          {product.variations && product.variations.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Select Packaging / Weight:
                </label>
                <span className="text-xs text-stone-500 font-mono">SKU: {currentSku}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variations.map((variation) => {
                  const isSelected = selectedVariation?.id === variation.id;
                  return (
                    <button
                      key={variation.id}
                      id={`variation-option-${variation.id}`}
                      type="button"
                      onClick={() => handleVariationChange(variation)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#1C3F2B] bg-emerald-50/70 shadow-xs ring-1 ring-[#1C3F2B]'
                          : 'border-stone-200 bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="text-xs font-bold text-stone-900">{variation.name}</div>
                      <div className="text-xs font-semibold text-emerald-900 mt-0.5">
                        {formatPKR(variation.salePrice || variation.price)}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {variation.stock > 0 ? `${variation.stock} in stock` : 'Out of stock'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status & Quantity Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 w-32 justify-between p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-sm font-bold text-stone-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-stone-900 font-bold"
                disabled={quantity >= currentStock}
              >
                +
              </button>
            </div>

            <button
              id="pdp-add-to-cart-btn"
              type="button"
              onClick={handleAddToCart}
              disabled={currentStock <= 0}
              className="flex-1 py-3.5 px-6 rounded-xl bg-[#1C3F2B] text-white font-semibold text-sm hover:bg-[#28573C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>{currentStock > 0 ? `Add to Basket • ${formatPKR(currentPrice * quantity)}` : 'Temporarily Out of Stock'}</span>
            </button>
          </div>

          {addedNotice && (
            <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Added to basket! Check the basket drawer or proceed to checkout.</span>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#1C3F2B] shrink-0" />
              <span>Cash on Delivery nationwide (2-4 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#1C3F2B] shrink-0" />
              <span>100% Pure, Unadulterated Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#1C3F2B] shrink-0" />
              <span>7-Day Return & Replacement Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#1C3F2B] shrink-0" />
              <span>Traditional Herbal Apothecary Guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Health Benefits, Dosage & Usage, Ingredients */}
      <div className="border border-stone-200 rounded-2xl p-6 sm:p-8 bg-white mb-16 shadow-xs">
        <div className="flex border-b border-stone-200 space-x-6 overflow-x-auto pb-px mb-6">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'description' ? 'border-[#1C3F2B] text-[#1C3F2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'benefits' ? 'border-[#1C3F2B] text-[#1C3F2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Therapeutic Benefits ({product.benefits?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'usage' ? 'border-[#1C3F2B] text-[#1C3F2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            How to Use & Dosage (طریقہ استعمال)
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`pb-3 text-sm font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'ingredients' ? 'border-[#1C3F2B] text-[#1C3F2B]' : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Ingredients & Purity
          </button>
        </div>

        {/* Tab Contents */}
        <div className="text-stone-700 text-sm leading-relaxed max-w-4xl">
          {activeTab === 'description' && (
            <div className="space-y-4">
              <p>{product.description}</p>
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 mt-4">
                <h4 className="font-serif font-bold text-stone-900 mb-1">Traditional Pansari Heritage</h4>
                <p className="text-xs text-stone-600">
                  Every batch of {product.name} is personally inspected by our Hakeem specialists to ensure it meets our heritage standard of zero artificial binders, no industrial solvents, and fresh packaging in food-grade kraft containers.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <ul className="space-y-3">
              {product.benefits && product.benefits.length > 0 ? (
                product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))
              ) : (
                <p className="text-stone-500">Supports general health, vitality, and traditional wellness balance.</p>
              )}
            </ul>
          )}

          {activeTab === 'usage' && (
            <div className="space-y-3">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-serif font-bold text-emerald-950 mb-1">Recommended Traditional Method</h4>
                <p className="text-stone-800">{product.usageInstructions || 'Take as advised by your healthcare practitioner or pansar specialist.'}</p>
              </div>
              <p className="text-xs text-stone-500 italic">
                Note: Natural herbal supplements work best when consumed consistently with proper hydration and balanced nutrition.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3">
              <ul className="list-disc pl-5 space-y-1 text-stone-800">
                {product.ingredients && product.ingredients.length > 0 ? (
                  product.ingredients.map((ing, i) => <li key={i}>{ing}</li>)
                ) : (
                  <li>100% Pure & Organically Sourced Botanical Material</li>
                )}
              </ul>
              <p className="text-xs text-stone-500">
                Contains zero starch, zero talc fillers, and no artificial colorants or chemical preservation agents.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif font-bold text-stone-900">
              Frequently Bought Together
            </h2>
            <span className="text-xs text-stone-500">From the same herbal category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectRelated(rel)}
                className="bg-white border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square bg-stone-100 rounded-lg overflow-hidden mb-3">
                    <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-serif font-semibold text-sm text-stone-900 line-clamp-1">{rel.name}</h4>
                  <p className="text-xs text-emerald-800 font-serif mb-2">{rel.urduName}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <span className="text-xs font-bold text-stone-900">{formatPKR(rel.price)}</span>
                  <span className="text-xs text-[#1C3F2B] font-semibold hover:underline">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
