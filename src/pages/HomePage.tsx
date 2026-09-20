import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Award, Truck, HeartHandshake, Leaf, Star, CheckCircle } from 'lucide-react';
import { Product, Category, StoreSettings } from '../types';
import { ProductCard } from '../components/ProductCard';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings;
  onNavigateToShop: (categorySlug?: string) => void;
  onSelectProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  settings,
  onNavigateToShop,
  onSelectProduct,
}) => {
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-[#1C3F2B] to-[#12281B] text-white py-16 sm:py-24">
        {/* Subtle background ambient overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#F5E6C8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-amber-300 text-xs font-medium tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Original Pansari Traditions Since 1984 • 100% Organically Sourced</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                Authentic Herbal Purity For Mind, Body & Longevity
              </h1>

              <p className="text-stone-300 text-base sm:text-lg max-w-xl font-normal leading-relaxed mx-auto lg:mx-0">
                Directly harvested from the high-altitude peaks of Skardu and fertile soil of Punjab. Zero chemical binders, stone-ground medicinal roots, and raw cold-pressed oils.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  id="hero-shop-now-btn"
                  onClick={() => onNavigateToShop()}
                  className="w-full sm:w-auto px-8 py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-amber-400/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Explore Herbal Store</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
                <button
                  id="hero-salajeet-btn"
                  onClick={() => onNavigateToShop('natural-honey')}
                  className="w-full sm:w-auto px-6 py-4 bg-emerald-900/60 hover:bg-emerald-800/80 text-white font-semibold text-sm rounded-xl border border-emerald-600/40 transition-all flex items-center justify-center gap-2"
                >
                  <span>Skardu Salajeet & Honey</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-emerald-800/40 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-2xl font-serif font-bold text-amber-300">100%</div>
                  <div className="text-xs text-stone-400">Pure Unadulterated</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-amber-300">40+ Yrs</div>
                  <div className="text-xs text-stone-400">Pansari Heritage</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-amber-300">COD</div>
                  <div className="text-xs text-stone-400">Pakistan-wide Shipping</div>
                </div>
              </div>
            </div>

            {/* Right Featured Card Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border-4 border-emerald-700/20 bg-stone-900/70 p-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-stone-800">
                  <img
                    src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80"
                    alt="Pure Himalayan Salajeet and Sidr Honey"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Spotlight Herbal</span>
                    <h3 className="text-xl font-serif font-bold text-white">Pure Himalayan Salajeet</h3>
                    <p className="text-xs text-stone-300 mt-1">Sun-dried Skardu resin with 84+ ionic minerals & high fulvic acid.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs px-2">
                  <span className="text-stone-400">Lab tested & purified via Shodhan</span>
                  <button
                    onClick={() => onNavigateToShop('natural-honey')}
                    className="text-amber-300 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>Discover</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-stone-50 rounded-2xl border border-stone-200 p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1C3F2B] shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">100% Pure & Organically Sourced</h4>
              <p className="text-xs text-stone-500">Zero additives, chemicals, or talc binders.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1C3F2B] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Cash on Delivery (Pakistan)</h4>
              <p className="text-xs text-stone-500">Inspect parcel and pay courier at your door.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1C3F2B] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Traditional Wooden Press</h4>
              <p className="text-xs text-stone-500">Cold-extracted oils preserving natural TQ.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-[#1C3F2B] shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-900">Hakeem Guided Consultation</h4>
              <p className="text-xs text-stone-500">Pansari expertise passed down over decades.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Shop by Herbal Category
            </h2>
          </div>
          <button
            onClick={() => onNavigateToShop()}
            className="text-xs font-bold text-[#1C3F2B] hover:text-emerald-950 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigateToShop(cat.slug)}
              className="group bg-white rounded-2xl border border-stone-200 p-4 hover:border-[#1C3F2B] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-100 mb-3 group-hover:scale-105 transition-transform duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-sm text-stone-900 group-hover:text-[#1C3F2B] transition-colors line-clamp-1">
                {cat.name}
              </h3>
              {cat.urduName && (
                <p className="text-xs text-emerald-800 font-serif mt-0.5">{cat.urduName}</p>
              )}
              <span className="text-[11px] text-stone-400 mt-1">{cat.itemCount || 3}+ items</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Herbal Remedies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Featured Herbal Remedies
            </h2>
          </div>
          <button
            onClick={() => onNavigateToShop()}
            className="text-xs font-bold text-[#1C3F2B] hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Promotional Kraft Packaging & Purity Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1C3F2B] rounded-3xl overflow-hidden text-white shadow-xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-amber-300 font-serif text-sm tracking-wide font-medium">
                The Ishaq Pansar Heritage
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
                Traditional Wooden Kolhu Press & Stone Grinding
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
                Unlike high-speed industrial factories that burn essential compounds, our oils and botanical powders are prepared using centuries-old slow cold-press techniques to preserve active flavonoids and therapeutic nutrients.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-amber-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  Eco-friendly Kraft barrier pouches
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  UV-protected Amber glass bottles
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="rounded-2xl overflow-hidden border-2 border-emerald-500/30 max-w-sm shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80"
                  alt="Raw Cold-pressed oils"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
              Most Popular
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Customer Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigateToShop()}
            className="text-xs font-bold text-[#1C3F2B] hover:text-emerald-950 flex items-center gap-1"
          >
            <span>See All Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Verified Pakistani Customer Testimonials */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
              Trusted Across Pakistan
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs text-stone-500 mt-2">
              Over 25,000 households in Lahore, Karachi, Islamabad, and across Pakistan trust Ishaq Pansar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-stone-700 text-xs leading-relaxed italic mb-4">
                  &quot;I ordered their Skardu Salajeet and Kalonji oil to Islamabad. The viscosity and earthy aroma confirmed it was 100% genuine. Delivered via TCS COD in just 2 days. Truly top-class pansari quality.&quot;
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <p className="font-bold text-stone-900 text-xs">Dr. Tariq Mehmood</p>
                <p className="text-[11px] text-stone-400">Islamabad, Sector F-8</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-stone-700 text-xs leading-relaxed italic mb-4">
                  &quot;The Asgandh Nagori (Ashwagandha) powder is pure root with zero chalk or fillers. My deep sleep has improved noticeably within two weeks. The kraft pouch keeps it completely fresh.&quot;
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <p className="font-bold text-stone-900 text-xs">Ayesha Noor</p>
                <p className="text-[11px] text-stone-400">Karachi, Gulshan-e-Iqbal</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex text-amber-500 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-stone-700 text-xs leading-relaxed italic mb-4">
                  &quot;Gond Katira crystals are crystal clean without dust. Finding authentic unadulterated pansari herbs online in Pakistan used to be difficult until Ishaq Pansar Store.&quot;
                </p>
              </div>
              <div className="border-t border-stone-100 pt-3">
                <p className="font-bold text-stone-900 text-xs">Haji Bilal Ahmad</p>
                <p className="text-[11px] text-stone-400">Lahore, Model Town</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
