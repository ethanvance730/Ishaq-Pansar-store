import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Heart, Leaf } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (tab: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C3F2B] to-[#2E5E41] flex items-center justify-center text-amber-300 font-serif font-bold text-xl border border-emerald-700/50">
                إ
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-white block">Ishaq Pansar Store</span>
                <span className="text-xs text-amber-300/90 font-serif">اسحاق پنسار اسٹور - پاکستان</span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Authentic Pakistani herbal store providing 100% natural, lab-tested Unani botanicals, Himalayan Shilajit resin, cold-pressed seed oils, and pure forest honey.
            </p>
            <div className="flex items-center space-x-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cash on Delivery across all cities in Pakistan</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4">Herbal Categories</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop', 'pure-herbs')} className="hover:text-amber-300">
                  Pure Herbs & Roots
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'essential-oils')} className="hover:text-amber-300">
                  Cold-Pressed Oils (Roghan)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'herbal-powders')} className="hover:text-amber-300">
                  Organic Safoof & Powders
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'natural-honey')} className="hover:text-amber-300">
                  Skardu Salajeet & Sidr Honey
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'seeds-nuts')} className="hover:text-amber-300">
                  Gond Katira & Ispaghol
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4">Customer Support</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-amber-300">
                  All Herbal Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-amber-300">
                  Our Purity Promise
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cart')} className="hover:text-amber-300">
                  Shopping Basket & COD
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-amber-300">
                  Admin Management
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-white text-sm mb-4">Apothecary Contact</h4>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Ishaq Pansar Store (Pvt.) Ltd. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Powered by Firebase Firestore Backend</span>
            <span>•</span>
            <span>Pakistani Rupees (PKR)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
