import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  Users, 
  Truck, 
  Receipt, 
  BarChart3, 
  Settings, 
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { alertCounts } = useApp();

  const links = [
    { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/pos', label: 'POS Billing', icon: ShoppingCart, highlight: true },
    { to: '/app/inventory', label: 'Products & Stock', icon: Package },
    { 
      to: '/app/alerts', 
      label: 'Expiry & Alerts', 
      icon: AlertTriangle, 
      badge: alertCounts.totalAlerts > 0 ? alertCounts.totalAlerts : null,
      badgeColor: 'bg-rose-500' 
    },
    { to: '/app/customers', label: 'Customers & Khata', icon: Users },
    { to: '/app/suppliers', label: 'Suppliers & Orders', icon: Truck },
    { to: '/app/expenses', label: 'Daily Expenses', icon: Receipt },
    { to: '/app/reports', label: 'Sales & Analytics', icon: BarChart3 },
    { to: '/app/settings', label: 'Store Settings', icon: Settings },
    { to: '/app/pricing', label: 'Subscription Plan', icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-53px)] select-none">
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Store Operations
        </div>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                    : link.highlight
                    ? 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ${link.badgeColor || 'bg-blue-500'}`}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Branding Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-semibold text-slate-300">SmartShelf v1.0</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
            LIVE POS
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
          CEG – Dept of IST <br />
          Enterprise Venture 2026
        </p>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-blue-400 hover:text-blue-300 bg-blue-950/50 hover:bg-blue-900/50 border border-blue-800/60 rounded-md py-1.5 transition"
        >
          <span>View Public Website</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
