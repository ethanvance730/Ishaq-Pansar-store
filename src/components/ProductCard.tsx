import React from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '../types';
import { formatPKR } from '../utils/format';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart } = useCart();
  const defaultVariation = product.variations && product.variations.length > 0 ? product.variations[0] : undefined;
  const currentPrice = defaultVariation
    ? (defaultVariation.salePrice || defaultVariation.price)
    : (product.salePrice || product.price);
  const regularPrice = defaultVariation ? defaultVariation.price : product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);
  const displayImage = product.images[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, defaultVariation, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-xl border border-stone-200/80 hover:border-emerald-700/40 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        {hasDiscount && (
          <span className="bg-amber-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
            SALE
          </span>
        )}
        {product.bestSeller && (
          <span className="bg-[#1C3F2B] text-emerald-100 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100 flex items-center justify-center p-4">
        <img
          src={displayImage}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 rounded-lg"
          loading="lazy"
        />
        {/* Urdu Watermark Overlay on Hover */}
        {product.urduName && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded font-serif opacity-0 group-hover:opacity-100 transition-opacity">
            {product.urduName}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Stock Indicator */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="ml-1 text-stone-600 text-[11px] font-medium">(4.9)</span>
            </div>
            <span className={`text-[11px] font-medium flex items-center gap-1 ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base font-semibold text-stone-900 group-hover:text-[#1C3F2B] transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>

          {/* Urdu Title Subtitle */}
          {product.urduName && (
            <p className="text-xs text-emerald-900/80 font-medium mb-2 font-serif">
              {product.urduName}
            </p>
          )}

          {/* Short description or Variation label */}
          <p className="text-xs text-stone-500 line-clamp-2 mb-3">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Variations pill preview */}
        {product.variations && product.variations.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {product.variations.slice(0, 3).map((v) => (
              <span
                key={v.id}
                className="text-[10px] px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200"
              >
                {v.name}
              </span>
            ))}
            {product.variations.length > 3 && (
              <span className="text-[10px] text-stone-400">+{product.variations.length - 3}</span>
            )}
          </div>
        )}

        {/* Pricing & Quick Add Button */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            <div className="text-xs text-stone-400">Price</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-stone-900 font-sans">
                {formatPKR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-stone-400 line-through">
                  {formatPKR(regularPrice)}
                </span>
              )}
            </div>
          </div>

          <button
            id={`quick-add-${product.id}`}
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className="p-2.5 rounded-lg bg-[#1C3F2B] text-white hover:bg-[#28573C] active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-1.5"
            title="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-semibold hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
