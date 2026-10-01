import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Barcode, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Printer, 
  Calculator, 
  ChevronRight,
  Store,
  Clock,
  Layers,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [dailySales, setDailySales] = useState<number>(15000);
  const [monthlyExpiryLoss, setMonthlyExpiryLoss] = useState<number>(3500);

  // Estimated savings
  const savedExpiry = Math.round(monthlyExpiryLoss * 0.85); // 85% prevented
  const fasterBillingHours = 35; // 35 hours saved per month
  const billingValue = 35 * 150; // at 150/hr
  const totalMonthlySavings = savedExpiry + billingValue;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 py-1.5 px-4 text-center text-xs font-semibold tracking-wide text-white flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-spin" />
        <span>CEG Entrepreneurship Venture — Built for 12–15 Million Indian Kirana & Provision Stores</span>
        <Link to="/app/pos" className="underline font-bold hover:text-blue-100 hidden sm:inline ml-2">
          Try Live Interactive POS →
        </Link>
      </div>

      {/* Main Navigation Header */}
      <nav className="border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-blue-500/20">
              SM
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                SmartShelf
              </span>
              <span className="text-[10px] block text-slate-400 font-medium tracking-wider uppercase">
                Smart Inventory. Smarter Business.
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#problem" className="hover:text-white transition">The Problem</a>
            <a href="#solution" className="hover:text-white transition">Solution</a>
            <a href="#calculator" className="hover:text-white transition">Savings Calculator</a>
            <a href="#comparison" className="hover:text-white transition">Comparison</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
            <a href="#team" className="hover:text-white transition">Team & Journey</a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition"
            >
              Demo Login
            </button>
            <button
              onClick={() => navigate('/app/pos')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/60 hover:shadow-emerald-700/50 transition cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Launch Live POS</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold uppercase tracking-wider shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Modern Retail Cloud for Local Kirana Stores
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Helping Local Shops Operate Like{' '}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                Modern Supermarkets
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              SmartShelf connects <span className="text-white font-semibold">fast barcode billing</span>,{' '}
              <span className="text-white font-semibold">automated expiry alerts</span>,{' '}
              <span className="text-white font-semibold">Khata (Udhaar) tracking</span>, and{' '}
              <span className="text-white font-semibold">real-time sales analytics</span> into one simple, affordable platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/app/pos')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer text-sm"
              >
                <span>Launch Live POS Billing</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/app/dashboard')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold px-7 py-3.5 rounded-xl transition text-sm cursor-pointer"
              >
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Explore Owner Dashboard</span>
              </button>
            </div>

            {/* Quick Proof Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="block text-2xl font-black text-blue-400">12–15M</span>
                <span className="text-xs text-slate-400">Target Kirana Stores</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="block text-2xl font-black text-emerald-400">&lt; 3 Sec</span>
                <span className="text-xs text-slate-400">Barcode Checkout</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="block text-2xl font-black text-amber-400">85% Less</span>
                <span className="text-xs text-slate-400">Expiry Losses</span>
              </div>
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                <span className="block text-2xl font-black text-indigo-400">₹199/mo</span>
                <span className="text-xs text-slate-400">Starting Price</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Breakdown Section (Slide 2 & 3) */}
      <section id="problem" className="py-20 bg-slate-900 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              The Daily Struggle of Indian Retailers
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Understanding the Problem
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Millions of local shopkeepers lose revenue daily due to manual bottlenecks and disconnected apps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Root Causes */}
            <div className="p-6 sm:p-8 bg-slate-950/70 border border-slate-800 rounded-2xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Root Causes in Today's Market</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                  <span><strong>No affordable retail software:</strong> Legacy ERPs cost tens of thousands upfront.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                  <span><strong>Existing tools are too complex:</strong> Shopify and SAP require IT training.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                  <span><strong>Limited digital knowledge:</strong> Shop owners need 1-click simplicity, not 50 menus.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                  <span><strong>Multiple disconnected apps:</strong> One book for Khata, another for billing, paper for stock.</span>
                </li>
              </ul>
            </div>

            {/* Daily Problems */}
            <div className="p-6 sm:p-8 bg-slate-950/70 border border-slate-800 rounded-2xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Painful Daily Problems</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <span><strong>Manual inventory confusion:</strong> Costly stockouts and overstocking perishable items.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <span><strong>Product expiry losses:</strong> Milk, bread, curd, and snacks expire unnoticed on high shelves.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <span><strong>Slow billing & calculation errors:</strong> Handwritten bills cause long customer queues.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                  <span><strong>No sales reports or profit tracking:</strong> Owner never knows true daily net profit or margins.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Core Formula Banner from Slide 2 */}
          <div className="mt-8 p-5 bg-gradient-to-r from-rose-950/60 via-amber-950/40 to-slate-900 border border-amber-800/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white text-sm block">The Cycle of Retail Loss:</span>
                <span className="text-xs text-amber-200">
                  Problems → Wastage → Lost Time → Customer Dissatisfaction → Reduced Profitability
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/pos')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition shrink-0 cursor-pointer"
            >
              Solve This with SmartShelf
            </button>
          </div>

          {/* Customer Personas Showcase (Slide 3) */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Ramesh Kumar (Age 40)</h4>
                  <p className="text-xs text-blue-400 font-semibold">S.K.S Pazhamudir Nilayam Shop Owner</p>
                </div>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Grocery & Provisions</span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Challenges:</strong> Inventory confusion, expiry losses in dairy & fruits, slow evening rush billing.
              </p>
              <p className="text-xs text-slate-300">
                <strong>Goal:</strong> Increase daily profit, reduce spoilage, and grow shop to a mini supermarket.
              </p>
            </div>

            <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Sathish (Age 37)</h4>
                  <p className="text-xs text-emerald-400 font-semibold">Lakshmi Stores Owner</p>
                </div>
                <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Kirana Store</span>
              </div>
              <p className="text-xs text-slate-300">
                <strong>Challenges:</strong> Khata credit recovery delays, calculator billing errors, lost receipts.
              </p>
              <p className="text-xs text-slate-300">
                <strong>Goal:</strong> Fast digital bills with UPI QR codes and instant WhatsApp receipts for customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How SmartShelf Solves the Problem (Slide 4 & 8) */}
      <section id="solution" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Built for Speed & Reliability
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How SmartShelf Solves the Problem
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              "One platform connects inventory, billing, expiry monitoring, and business analytics."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-950/70 border border-blue-800/60 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
                <Barcode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Inventory + Barcode Billing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track stock automatically on every sale. Barcode scanning ensures 3-second billing with zero calculation errors.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-950/70 border border-amber-800/60 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Expiry Alerts & Shortage Watch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant radar identifies dairy, breads, and packaged items nearing expiry (7 and 30 days) and re-orders before stockouts.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/70 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sales Analytics & Profit Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Understand hourly trends, track daily revenue, gross profit, and operating expenses to know your exact take-home profit.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/70 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Customer Khata & Supplier Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintain customer ledger records, collect pending credit via WhatsApp reminders, and log supplier purchase invoices.
              </p>
            </div>
          </div>

          {/* Secondary feature highlights (Slide 8) */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <Printer className="w-5 h-5 text-blue-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">Thermal 80mm Print</span>
              <span className="text-[10px] text-slate-500">Standard & Thermal</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <Smartphone className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">Dynamic UPI QR</span>
              <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <Layers className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">Multi-Unit Support</span>
              <span className="text-[10px] text-slate-500">kg, ltr, pcs, packet</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-indigo-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">GST / Tax Invoices</span>
              <span className="text-[10px] text-slate-500">B2B & B2C Ready</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <Users className="w-5 h-5 text-purple-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">Multi-User Roles</span>
              <span className="text-[10px] text-slate-500">Owner & Cashier</span>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/70 rounded-xl">
              <Sparkles className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
              <span className="text-xs font-semibold text-slate-200 block">WhatsApp Bills</span>
              <span className="text-[10px] text-slate-500">1-Click Paperless</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Savings / ROI Calculator */}
      <section id="calculator" className="py-20 bg-slate-900/90 border-t border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Calculator className="w-4 h-4" />
              <span>Interactive ROI Estimator</span>
            </div>
            <h2 className="text-3xl font-black text-white">How Much Money Will You Save?</h2>
            <p className="text-slate-400 text-sm">
              Calculate how quickly SmartShelf pays for itself in your Kirana or provision shop.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-2xl">
            {/* Sliders */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Average Daily Sales</label>
                  <span className="text-sm font-bold text-blue-400">₹{dailySales.toLocaleString('en-IN')} / day</span>
                </div>
                <input
                  type="range"
                  min="3000"
                  max="100000"
                  step="1000"
                  value={dailySales}
                  onChange={(e) => setDailySales(Number(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹3,000</span>
                  <span>₹50,000</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-slate-300">Current Monthly Expiry Spoilage Loss</label>
                  <span className="text-sm font-bold text-rose-400">₹{monthlyExpiryLoss.toLocaleString('en-IN')} / month</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="250"
                  value={monthlyExpiryLoss}
                  onChange={(e) => setMonthlyExpiryLoss(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>₹500</span>
                  <span>₹10,000</span>
                  <span>₹20,000</span>
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>Prevented Spoilage (85% via Smart Alerts):</span>
                  <span className="text-emerald-400 font-bold">+₹{savedExpiry.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cashier Time Saved ({fasterBillingHours} hrs @ ₹150/hr):</span>
                  <span className="text-emerald-400 font-bold">+₹{billingValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>SmartShelf Standard Subscription:</span>
                  <span className="text-slate-300 font-bold">-₹499</span>
                </div>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-emerald-950 border border-blue-800/60 rounded-2xl p-8 text-center space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                Estimated Net Monthly Profit Boost
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                ₹{(totalMonthlySavings - 499).toLocaleString('en-IN')}
                <span className="text-sm font-medium text-slate-400 block mt-1">saved every single month</span>
              </div>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                That is <strong className="text-emerald-300">₹{((totalMonthlySavings - 499) * 12).toLocaleString('en-IN')}</strong> back in your pocket each year — 15x your SmartShelf investment!
              </p>
              <button
                onClick={() => navigate('/app/pos')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-950/60 transition cursor-pointer text-sm"
              >
                Claim These Savings With Free Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5C Opportunity Analysis & Competitive Matrix (Slide 5 & 6) */}
      <section id="comparison" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              5C Opportunity & Competitive Analysis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why SmartShelf Wins Against Competitors
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Comparing SmartShelf with Zoho, Shopify, Vyapar, and Khatabook.
            </p>
          </div>

          {/* 5C Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-14">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold text-blue-400 uppercase block mb-1">Customer</span>
              <p className="text-xs text-slate-300">Millions of small retailers needing affordable, easy digital tools.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold text-indigo-400 uppercase block mb-1">Company</span>
              <p className="text-xs text-slate-300">SmartShelf focuses specifically on simplifying Kirana retail operations.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold text-rose-400 uppercase block mb-1">Competitor</span>
              <p className="text-xs text-slate-300">Existing solutions are fragmented (Zoho, Shopify, Vyapar, Khatabook).</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold text-amber-400 uppercase block mb-1">Collaborators</span>
              <p className="text-xs text-slate-300">Digital payment gateways, barcode scanner makers, wholesale suppliers.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-[11px] font-bold text-emerald-400 uppercase block mb-1">Context</span>
              <p className="text-xs text-slate-300">Rapid digital transformation of India's \$751B grocery market.</p>
            </div>
          </div>

          {/* Competitive Matrix Table (Slide 5 & 6) */}
          <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4 font-bold">Platform</th>
                  <th className="p-4 text-center">Local Shop Focus</th>
                  <th className="p-4 text-center">Expiry Tracking</th>
                  <th className="p-4 text-center">Affordability</th>
                  <th className="p-4 text-center">Ease of Use</th>
                  <th className="p-4 text-center">All-in-One Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-slate-300">Zoho</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-slate-300">Medium</td>
                  <td className="p-4 text-center text-slate-400">Complex</td>
                  <td className="p-4 text-center text-amber-400">Partial</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-slate-300">Shopify</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-rose-400">Low (Costly)</td>
                  <td className="p-4 text-center text-slate-300">Medium</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-slate-300">Vyapar</td>
                  <td className="p-4 text-center text-emerald-400">Yes</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-emerald-400">High</td>
                  <td className="p-4 text-center text-slate-300">Moderate</td>
                  <td className="p-4 text-center text-amber-400">Partial</td>
                </tr>
                <tr className="hover:bg-slate-800/40">
                  <td className="p-4 font-semibold text-slate-300">Khatabook</td>
                  <td className="p-4 text-center text-emerald-400">Yes</td>
                  <td className="p-4 text-center text-rose-400">No</td>
                  <td className="p-4 text-center text-emerald-400">High</td>
                  <td className="p-4 text-center text-emerald-400">High</td>
                  <td className="p-4 text-center text-rose-400">No (Udhaar Only)</td>
                </tr>
                <tr className="bg-gradient-to-r from-blue-950/60 to-emerald-950/40 font-bold border-t-2 border-emerald-500">
                  <td className="p-4 text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-blue-400 text-base">SmartShelf</span>
                  </td>
                  <td className="p-4 text-center text-emerald-400 font-black">Yes</td>
                  <td className="p-4 text-center text-emerald-400 font-black">Yes (Automated)</td>
                  <td className="p-4 text-center text-emerald-400 font-black">High (₹199/mo)</td>
                  <td className="p-4 text-center text-emerald-400 font-black">Simple (Zero Setup)</td>
                  <td className="p-4 text-center text-emerald-400 font-black">Yes (100% All-in-One)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Section (Slide 7 & 8) */}
      <section id="pricing" className="py-20 bg-slate-900 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Simple, Honest Subscription
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Plans for Every Shop Size
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              No hidden hardware lock-ins. Works on any smartphone, tablet, laptop, or desktop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Basic</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹199</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Ideal for small petty shops and single-counter fruit/veg stalls.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to 100 Products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fast Barcode & Manual Billing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Daily Sales Summary</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Single User (Owner/Cashier)</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-500">
                    <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>No automated expiry alerts</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/app/pricing')}
                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Choose Basic
              </button>
            </div>

            {/* Standard Plan (Featured) */}
            <div className="p-8 bg-gradient-to-b from-blue-950/80 via-slate-950 to-slate-950 border-2 border-blue-500 rounded-2xl flex flex-col justify-between relative shadow-2xl scale-105">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most Popular
              </div>

              <div>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Standard</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹499</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Perfect for busy provision stores & mini supermarkets.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Up to 500 Products</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fast POS + Dynamic UPI QR Codes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Low-Stock Threshold Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Weekly & Monthly Reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>2–3 Users (Owner + Cashiers)</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/app/pricing')}
                className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/50 transition cursor-pointer"
              >
                Choose Standard
              </button>
            </div>

            {/* Premium Plan */}
            <div className="p-8 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition">
              <div>
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Premium</span>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">₹999</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  For growing supermarkets with extensive FMCG & dairy batches.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited Products & SKUs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Batch Expiry Date Radar (7d & 30d)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full P&L Analytics & Expense Tracker</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited Staff Users & Roles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority WhatsApp Support & Training</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => navigate('/app/pricing')}
                className="mt-8 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Choose Premium
              </button>
            </div>
          </div>

          <div className="mt-12 text-center text-xs text-slate-400">
            Year 1 Commercial Goal: <strong className="text-white">10,000 Shops</strong> → <strong className="text-emerald-400">₹2.4 Crore</strong> Annual Recurring Revenue.
          </div>
        </div>
      </section>

      {/* Implementation Roadmap (Slide 9) */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Execution Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Phased Implementation Plan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <span className="text-3xl font-black text-blue-500/30 absolute right-6 top-6">01</span>
              <span className="text-xs font-bold text-blue-400 uppercase">Phase 1 (Months 1–3)</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-3">MVP Development & Beta</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Core features: Inventory, billing, expiry alerts</li>
                <li>• Mobile, tablet, and web dashboard</li>
                <li>• Beta rollout across 50 local Chennai shops</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <span className="text-3xl font-black text-indigo-500/30 absolute right-6 top-6">02</span>
              <span className="text-xs font-bold text-indigo-400 uppercase">Phase 2 (Months 4–6)</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-3">City Market Launch</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Soft launch across Chennai retail clusters</li>
                <li>• Merchant feedback and weekly iterations</li>
                <li>• Grassroots marketing campaigns</li>
              </ul>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl relative">
              <span className="text-3xl font-black text-emerald-500/30 absolute right-6 top-6">03</span>
              <span className="text-xs font-bold text-emerald-400 uppercase">Phase 3 (Months 7–12)</span>
              <h3 className="text-lg font-bold text-white mt-1 mb-3">Scale & Partnerships</h3>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• Expand to 5 major South Indian cities</li>
                <li>• Payment gateway & wholesale supplier integrations</li>
                <li>• Dedicated merchant support hub</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Details & Heritage (Slide 1) */}
      <section id="team" className="py-16 bg-slate-900/60 border-t border-slate-800 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Award className="w-10 h-10 text-blue-400 mx-auto mb-3" />
          <h3 className="text-2xl font-black text-white">College of Engineering, Guindy (CEG)</h3>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Department of Information Science and Technology (IST) • 3rd Year Venture
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-sm font-bold text-white block">K. Gokul</span>
              <span className="text-[11px] font-mono text-slate-400">2024115076</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-sm font-bold text-white block">V. Sanjith Kumar</span>
              <span className="text-[11px] font-mono text-slate-400">2024115040</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-sm font-bold text-white block">R. Senthil Raja</span>
              <span className="text-[11px] font-mono text-slate-400">2024115080</span>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <span className="text-sm font-bold text-white block">G. Keerthivaasan</span>
              <span className="text-[11px] font-mono text-slate-400">2024115130</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white">SmartShelf</span>
            <span>— "Helping Local Shops Operate Like Modern Supermarkets"</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/app/pos" className="hover:text-white transition">Live POS</Link>
            <Link to="/app/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link to="/app/inventory" className="hover:text-white transition">Inventory</Link>
            <Link to="/app/pricing" className="hover:text-white transition">Pricing</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
