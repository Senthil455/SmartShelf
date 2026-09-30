import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IndianRupee, 
  ShoppingBag, 
  AlertTriangle, 
  CalendarClock, 
  Users, 
  TrendingUp, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { api } from '../services/api';
import { Sale, ReportSummary, Product } from '../types';
import { ThermalReceipt } from '../components/ThermalReceipt';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [chartData, setChartData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [sumRes, chartRes, salesRes, alertRes] = await Promise.all([
        api.getReportSummary(),
        api.getSalesChart(),
        api.getSales(),
        api.getAlerts()
      ]);

      if (sumRes.success) setSummary(sumRes.summary);
      if (chartRes.success) setChartData(chartRes.chartData);
      if (salesRes.success) setRecentSales(salesRes.sales.slice(0, 7));
      if (alertRes.success) setLowStockProducts(alertRes.lowStock.slice(0, 4));
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReceipt = async (saleId: number) => {
    try {
      const res = await api.getSaleById(saleId);
      if (res.success && res.sale) {
        setSelectedSale(res.sale);
      }
    } catch {
      //
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Store Dashboard</h1>
          <p className="text-xs text-slate-400">
            Real-time Kirana performance, inventory health, and revenue
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/app/pos')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>New Sale (POS)</span>
          </button>
          <button
            onClick={() => navigate('/app/inventory')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Today's Sales</span>
            <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-white">
              ₹{(summary?.todaySales || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {summary?.todayOrders || 0} Bills Generated Today
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Estimated Net Profit</span>
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400">
              ₹{(summary?.netProfit || 0).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Gross: ₹{(summary?.grossProfit || 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div 
          onClick={() => navigate('/app/alerts')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl relative overflow-hidden cursor-pointer transition"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Low Stock Items</span>
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-400">
              {summary?.lowStockCount || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Require replenishment soon
            </span>
          </div>
        </div>

        {/* Expiring Soon */}
        <div 
          onClick={() => navigate('/app/alerts')}
          className="p-5 bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl relative overflow-hidden cursor-pointer transition"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400">Expiry Alert (7 Days)</span>
            <div className="p-2 rounded-xl bg-rose-950/80 border border-rose-800/60 text-rose-400">
              <CalendarClock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-rose-400">
              {summary?.expiringCount || 0}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Sell fast or return to vendor
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Alerts Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">7-Day Sales & Revenue Trend</h3>
              <p className="text-xs text-slate-400">Daily billing turnover in ₹ INR</p>
            </div>
            <button
              onClick={() => navigate('/app/reports')}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Card: Khata Balance & Urgent Restock */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Customer Khata (Udhaar)</span>
              </h3>
              <button
                onClick={() => navigate('/app/customers')}
                className="text-xs text-amber-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl mb-4">
              <span className="text-[11px] text-amber-300 block">Total Credit Pending Recovery</span>
              <span className="text-xl font-black text-amber-400 block mt-0.5">
                ₹{(summary?.totalDuePending || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Across {summary?.dueCustomersCount || 0} registered customers
              </span>
            </div>

            <h4 className="text-xs font-semibold text-slate-300 mb-2">Urgent Low Stock Restock</h4>
            <div className="space-y-2">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-200 block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">Min: {p.min_stock_alert}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800/60 rounded font-bold shrink-0">
                    {p.stock_quantity} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/app/alerts')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer text-center"
          >
            Open Expiry & Stock Radar →
          </button>
        </div>
      </div>

      {/* Recent Sales Invoices */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Click any bill to view thermal receipt or share on WhatsApp</p>
          </div>
          <button
            onClick={() => navigate('/app/reports')}
            className="text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            View All Sales
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Invoice #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date / Time</th>
                <th className="p-3 text-center">Items</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-blue-400">{sale.invoice_number}</td>
                  <td className="p-3 font-medium text-white">{sale.customer_name}</td>
                  <td className="p-3 text-slate-400">
                    {new Date(sale.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3 text-center font-medium">{sale.item_count || 3}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sale.payment_mode === 'cash' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      sale.payment_mode === 'upi' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      sale.payment_mode === 'due' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}>
                      {sale.payment_mode}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-white">₹{sale.total_amount.toFixed(2)}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleOpenReceipt(sale.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition cursor-pointer"
                      title="Print / View Receipt"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Thermal Receipt Preview Modal */}
      {selectedSale && (
        <ThermalReceipt sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
};
