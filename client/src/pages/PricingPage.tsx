import React from 'react';
import { CheckCircle2, Zap, Shield, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PricingPage: React.FC = () => {
  const { store, upgradePlan } = useApp();
  const currentPlan = store?.plan || 'premium';

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          Transparent & Affordable Kirana Pricing
        </span>
        <h1 className="text-3xl font-black text-white tracking-tight">
          SmartShelf Subscription Plans
        </h1>
        <p className="text-xs text-slate-400">
          Scale your store without paying heavy upfront software fees. Cancel or upgrade anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Basic */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between transition ${
          currentPlan === 'basic' ? 'bg-slate-900 border-blue-500 shadow-xl' : 'bg-slate-950 border-slate-800'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Basic</span>
              {currentPlan === 'basic' && (
                <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-bold">
                  Current Active Plan
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹199</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              For small corner shops and single-counter stores.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Up to 100 Products</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Basic Barcode & POS Billing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Single User (Owner)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Daily Sales Reports</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan('basic')}
            disabled={currentPlan === 'basic'}
            className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentPlan === 'basic'
                ? 'bg-slate-800 text-slate-500 cursor-default'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            {currentPlan === 'basic' ? 'Active' : 'Switch to Basic'}
          </button>
        </div>

        {/* Standard */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between relative transition scale-105 ${
          currentPlan === 'standard'
            ? 'bg-blue-950/60 border-2 border-blue-500 shadow-2xl'
            : 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-2 border-blue-600'
        }`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
            Recommended
          </div>

          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Standard</span>
              {currentPlan === 'standard' && (
                <span className="px-2 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded text-[10px] font-bold">
                  Current Active Plan
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹499</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              For busy provision shops, mini marts & grocery stores.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Up to 500 Products</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fast POS + Dynamic UPI QR Codes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Low-Stock Warning Alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Weekly & Monthly Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>2–3 Users (Cashiers + Owner)</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan('standard')}
            disabled={currentPlan === 'standard'}
            className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentPlan === 'standard'
                ? 'bg-blue-800 text-blue-300 cursor-default'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
            }`}
          >
            {currentPlan === 'standard' ? 'Active' : 'Upgrade to Standard'}
          </button>
        </div>

        {/* Premium */}
        <div className={`p-6 rounded-2xl border flex flex-col justify-between transition ${
          currentPlan === 'premium' ? 'bg-purple-950/40 border-purple-500 shadow-xl' : 'bg-slate-950 border-slate-800'
        }`}>
          <div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Premium</span>
              {currentPlan === 'premium' && (
                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 border border-purple-800 rounded text-[10px] font-bold">
                  Current Active Plan
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black text-white">₹999</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              All-inclusive enterprise package for large retail supermarkets.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Unlimited Products & SKUs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Automated Expiry Radar (7d & 30d alerts)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Customer Khata & Supplier Management</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>P&L Analytics & Expense Tracker</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Priority WhatsApp Support</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => upgradePlan('premium')}
            disabled={currentPlan === 'premium'}
            className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentPlan === 'premium'
                ? 'bg-purple-900/60 text-purple-300 cursor-default'
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {currentPlan === 'premium' ? 'Active' : 'Upgrade to Premium'}
          </button>
        </div>
      </div>
    </div>
  );
};
