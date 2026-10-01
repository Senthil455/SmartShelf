import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CalendarClock, 
  PackageX, 
  CheckCircle2, 
  Tag, 
  Truck, 
  Trash2,
  Calendar
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

export const Alerts: React.FC = () => {
  const { showToast, refreshAlerts } = useApp();
  const [activeTab, setActiveTab] = useState<'expiring7' | 'expired' | 'lowStock' | 'expiring30'>('expiring7');
  const [alertData, setAlertData] = useState<{
    counts: { lowStock: number; expired: number; expiringIn7: number; expiringIn30: number; totalAlerts: number };
    lowStock: Product[];
    expired: Product[];
    expiringIn7: Product[];
    expiringIn30: Product[];
  }>({
    counts: { lowStock: 0, expired: 0, expiringIn7: 0, expiringIn30: 0, totalAlerts: 0 },
    lowStock: [],
    expired: [],
    expiringIn7: [],
    expiringIn30: []
  });

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await api.getAlerts();
      if (res.success) {
        setAlertData(res as any);
      }
    } catch {
      //
    }
  };

  const handleApplyDiscount = async (product: Product, discountPercent: number) => {
    try {
      const newPrice = Math.round(product.selling_price * (1 - discountPercent / 100));
      await api.updateProduct(product.id, {
        ...product,
        selling_price: newPrice
      });
      showToast(`Marked ${product.name} down to ₹${newPrice} (${discountPercent}% clearance discount)`, 'success');
      loadAlerts();
      refreshAlerts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update price', 'error');
    }
  };

  const handleQuickRestock = async (product: Product, addQty: number) => {
    try {
      await api.updateProduct(product.id, {
        ...product,
        stock_quantity: product.stock_quantity + addQty
      });
      showToast(`Added +${addQty} ${product.unit} to ${product.name}`, 'success');
      loadAlerts();
      refreshAlerts();
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
          <span>Expiry Alerts & Stock Shortage Cockpit</span>
        </h1>
        <p className="text-xs text-slate-400">
          Proactive monitoring prevents wastage, saves money, and keeps your Kirana shelves stocked
        </p>
      </div>

      {/* Tabs Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tab 1: Expiring in 7 Days */}
        <button
          onClick={() => setActiveTab('expiring7')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'expiring7'
              ? 'bg-rose-950/70 border-rose-500 shadow-lg shadow-rose-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-rose-400">Critical Expiry (7 Days)</span>
            <span className="text-xl font-black text-rose-400">{alertData.counts.expiringIn7}</span>
          </div>
          <p className="text-[11px] text-slate-400">Requires urgent clearance or return</p>
        </button>

        {/* Tab 2: Low Stock */}
        <button
          onClick={() => setActiveTab('lowStock')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'lowStock'
              ? 'bg-amber-950/70 border-amber-500 shadow-lg shadow-amber-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-amber-400">Low Stock Warning</span>
            <span className="text-xl font-black text-amber-400">{alertData.counts.lowStock}</span>
          </div>
          <p className="text-[11px] text-slate-400">Below minimum store threshold</p>
        </button>

        {/* Tab 3: Expiring in 30 Days */}
        <button
          onClick={() => setActiveTab('expiring30')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'expiring30'
              ? 'bg-blue-950/70 border-blue-500 shadow-lg shadow-blue-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-400">Watchlist (30 Days)</span>
            <span className="text-xl font-black text-blue-400">{alertData.counts.expiringIn30}</span>
          </div>
          <p className="text-[11px] text-slate-400">Items to feature on front shelves</p>
        </button>

        {/* Tab 4: Expired */}
        <button
          onClick={() => setActiveTab('expired')}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            activeTab === 'expired'
              ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-950/50'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-purple-400">Expired Items</span>
            <span className="text-xl font-black text-purple-400">{alertData.counts.expired}</span>
          </div>
          <p className="text-[11px] text-slate-400">Pull from shelves immediately</p>
        </button>
      </div>

      {/* Content Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        {/* Subtitle banner */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
          <span className="font-bold text-white text-sm">
            {activeTab === 'expiring7' && '🔥 High Priority: Expiring in the Next 7 Days'}
            {activeTab === 'lowStock' && '⚠️ Products Below Safe Stock Threshold'}
            {activeTab === 'expiring30' && '📅 Medium Priority: Expiring Within 30 Days'}
            {activeTab === 'expired' && '⛔ Expired Products (Disposal Required)'}
          </span>
          <span className="text-slate-400">
            SmartShelf Automated Expiry Radar
          </span>
        </div>

        {/* Dynamic Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-center">Current Stock</th>
                <th className="p-3 text-center">Min Threshold</th>
                <th className="p-3">Batch / Expiry Date</th>
                <th className="p-3 text-right">Selling Price</th>
                <th className="p-3 text-center">Fast Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {/* Expiring 7 Days Items */}
              {activeTab === 'expiring7' && (
                alertData.expiringIn7.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No items expiring in the next 7 days! Great job.</td></tr>
                ) : (
                  alertData.expiringIn7.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-sans">{p.local_name}</span>
                      </td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 text-center font-bold text-slate-200">{p.stock_quantity} {p.unit}</td>
                      <td className="p-3 text-center text-slate-500">{p.min_stock_alert}</td>
                      <td className="p-3 font-mono text-rose-400 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{p.expiry_date}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{p.selling_price}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleApplyDiscount(p, 25)}
                            className="px-2.5 py-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-700/80 text-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                            title="Apply 25% discount to sell quickly"
                          >
                            <Tag className="w-3 h-3" />
                            <span>Apply 25% Off</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}

              {/* Low Stock Items */}
              {activeTab === 'lowStock' && (
                alertData.lowStock.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">All shelves are adequately stocked!</td></tr>
                ) : (
                  alertData.lowStock.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-sans">{p.local_name}</span>
                      </td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded font-black text-rose-300 bg-rose-950 border border-rose-800">
                          {p.stock_quantity} {p.unit}
                        </span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-400">{p.min_stock_alert} {p.unit}</td>
                      <td className="p-3 font-mono text-slate-400">{p.batch_number || 'BATCH-01'}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{p.selling_price}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleQuickRestock(p, 20)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer flex items-center gap-1 mx-auto"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Restock +20</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}

              {/* Expiring 30 Days Items */}
              {activeTab === 'expiring30' && (
                alertData.expiringIn30.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-500">No items expiring in 30 days.</td></tr>
                ) : (
                  alertData.expiringIn30.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        <span className="text-[11px] text-slate-400 font-sans">{p.local_name}</span>
                      </td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 text-center font-bold">{p.stock_quantity} {p.unit}</td>
                      <td className="p-3 text-center text-slate-500">{p.min_stock_alert}</td>
                      <td className="p-3 font-mono text-blue-400 font-bold">{p.expiry_date}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{p.selling_price}</td>
                      <td className="p-3 text-center text-slate-400">Move to Front Row</td>
                    </tr>
                  ))
                )
              )}

              {/* Expired Items */}
              {activeTab === 'expired' && (
                alertData.expired.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-emerald-400 font-semibold">Zero expired products on shelves! Excellent rotation.</td></tr>
                ) : (
                  alertData.expired.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        <span className="text-[11px] text-slate-400">{p.local_name}</span>
                      </td>
                      <td className="p-3 text-slate-400">{p.category}</td>
                      <td className="p-3 text-center font-bold text-rose-400">{p.stock_quantity} {p.unit}</td>
                      <td className="p-3 text-center text-slate-500">{p.min_stock_alert}</td>
                      <td className="p-3 font-mono text-purple-400 font-bold">{p.expiry_date} (Expired)</td>
                      <td className="p-3 text-right font-mono text-slate-400">₹{p.selling_price}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleQuickRestock(p, -p.stock_quantity)}
                          className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Mark Disposed
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
