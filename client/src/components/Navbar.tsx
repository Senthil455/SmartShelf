import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Bell, UserCircle, Store, Zap, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { store, user, setUserRole, alertCounts } = useApp();
  const navigate = useNavigate();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand & Store Name */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl tracking-tighter text-white shadow-md group-hover:scale-105 transition-transform">
              SM
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                SmartShelf
              </span>
              <span className="text-[10px] block text-slate-400 font-medium tracking-wide uppercase">
                Kirana Supermarket OS
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
            <Store className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="font-semibold text-slate-200 block truncate max-w-[200px]">
                {store?.name || 'Local Provision Store'}
              </span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Cloud Sync Active
              </span>
            </div>
          </div>
        </div>

        {/* Center POS Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/pos')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-4 py-1.5 rounded-lg font-semibold text-sm shadow-md shadow-emerald-950/50 hover:shadow-emerald-700/50 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Launch POS Billing</span>
            <span className="hidden sm:inline-block text-[11px] bg-emerald-700/60 px-1.5 py-0.5 rounded text-emerald-100">F2</span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Plan badge */}
          <Link
            to="/app/pricing"
            className="hidden sm:flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/80 text-blue-300 hover:bg-blue-900/60 px-2.5 py-1 rounded-md text-xs font-medium transition"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="capitalize">{store?.plan || 'Premium'} Plan</span>
          </Link>

          {/* Alerts notification */}
          <Link
            to="/app/alerts"
            className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Stock & Expiry Alerts"
          >
            <Bell className="w-5 h-5" />
            {alertCounts.totalAlerts > 0 && (
              <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {alertCounts.totalAlerts}
              </span>
            )}
          </Link>

          {/* User role switch */}
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-lg p-1 text-xs">
            <UserCircle className="w-4 h-4 text-blue-400 ml-1" />
            <div className="hidden lg:block text-left pr-1">
              <span className="font-medium text-slate-200 block text-[11px] truncate max-w-[120px]">
                {user?.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-slate-400 capitalize">{user?.role}</span>
            </div>
            <select
              value={user?.role || 'owner'}
              onChange={(e) => setUserRole(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-0.5 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="owner">Owner</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>

          {/* Quick link back to landing page */}
          <Link
            to="/"
            className="hidden xl:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white border border-slate-700 px-2.5 py-1 rounded-md hover:bg-slate-800 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Site</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
