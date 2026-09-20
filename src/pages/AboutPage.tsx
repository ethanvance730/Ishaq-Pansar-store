import React from 'react';
import { ShieldCheck, Heart, Leaf, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { StoreSettings } from '../types';

interface AboutPageProps {
  settings: StoreSettings;
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onNavigateToShop }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-[#1C3F2B] font-mono">
          Decades of Unani & Ayurvedic Wisdom
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
          The Ishaq Pansar Heritage
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          Rooted in Punjab&apos;s rich herbal heritage, Ishaq Pansar Store was established with a singular mission: to resurrect pure, unadulterated botanical wellness in an era of chemical substitutes.
        </p>
      </div>

      {/* 4 Pillars of Purity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1C3F2B] flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Wild Mountain Foraging</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our raw Salajeet resin is hand-collected by mountain locals in Skardu, Gilgit-Baltistan at altitudes exceeding 16,000 feet, where alpine glaciers yield the highest mineral density.
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1C3F2B] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Slow Wooden Kohlu Press</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            We extract our Kalonji, Almond, and Mustard oils using slow traditional wooden presses without friction heat or chemical hexane solvents, preserving vital Thymoquinone (TQ).
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#1C3F2B] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-stone-900">Triple-Sifted Powdering</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our medicinal powders (Safoof) are shade-dried under regulated humidity and pulverized in slow stone mills, retaining essential natural chlorophyll and active phytochemicals.
          </p>
        </div>
      </div>

      {/* Store Location & Contact Details */}
      <div className="bg-[#1C3F2B] text-white rounded-3xl p-8 sm:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-white">Visit Our Physical Apothecary</h2>
            <p className="text-xs text-stone-300 leading-relaxed">
              Step into our apothecary in Dunga Bunga to experience authentic sensory pansari culture — burlap sacks of golden roots, amber jars of raw Sidr honey, and centuries-old herbal guidance.
            </p>
            <div className="space-y-2 text-xs text-emerald-100 pt-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Helpline / WhatsApp: {settings.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Email: {settings.email}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
            <h3 className="font-serif font-bold text-lg text-amber-300">Nationwide Cash on Delivery</h3>
            <p className="text-xs text-stone-200">
              No matter which city or town you reside in across Pakistan, receive our freshly packaged herbal formulas directly to your doorstep.
            </p>
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3 bg-amber-400 text-stone-950 font-bold text-xs rounded-xl hover:bg-amber-300 transition-colors"
            >
              Browse Herbal Products Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
