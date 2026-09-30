import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  IndianRupee, 
  ShoppingBag, 
  Download, 
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart as RechartsPie, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../services/api';
import { ReportSummary, Sale } from '../types';

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [chartData, setChartData] = useState<{ date: string; revenue: number; orders: number }[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [paymentModes, setPaymentModes] = useState<any[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [sumRes, chartRes, topRes, modeRes, salesRes] = await Promise.all([
        api.getReportSummary(),
        api.getSalesChart(),
        api.getTopProducts(),
        api.getPaymentBreakdown(),
        api.getSales()
      ]);
      if (sumRes.success) setSummary(sumRes.summary);
      if (chartRes.success) setChartData(chartRes.chartData);
      if (topRes.success) setTopProducts(topRes.topProducts);
      if (modeRes.success) setPaymentModes(modeRes.modes);
      if (salesRes.success) setSales(salesRes.sales);
    } catch {
      //
    }
  };

  const handleExportSalesCSV = () => {
    const headers = ['Invoice', 'Customer', 'Date', 'Subtotal', 'Tax', 'Discount', 'Total', 'Payment Mode', 'Status'];
    const rows = sales.map(s => [
      s.invoice_number,
      `"${s.customer_name}"`,
      s.created_at,
      s.subtotal,
      s.tax_amount,
      s.discount_amount,
      s.total_amount,
      s.payment_mode,
      s.payment_status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `smartshelf_sales_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span>Sales, Profit & Business Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">
            Make data-driven decisions: analyze daily revenue, gross margin, fast-moving items, and net profit
          </p>
        </div>

        <button
          onClick={handleExportSalesCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Sales (CSV)</span>
        </button>
      </div>

      {/* Financial P&L Breakdown Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-6 text-slate-200">
        <div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">1. Gross Revenue</span>
          <span className="text-2xl sm:text-3xl font-black text-white block mt-1">
            ₹{(summary?.allSales || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Total customer billings</span>
        </div>

        <div className="md:border-l border-slate-800 md:pl-6">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">2. Gross Profit</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-400 block mt-1">
            ₹{(summary?.grossProfit || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Revenue minus product costs</span>
        </div>

        <div className="md:border-l border-slate-800 md:pl-6">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">3. Shop Expenses</span>
          <span className="text-2xl sm:text-3xl font-black text-rose-400 block mt-1">
            -₹{(summary?.totalExpenses || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Rent, power, wages & tea</span>
        </div>

        <div className="md:border-l border-slate-800 md:pl-6 bg-emerald-950/20 -my-6 -mr-6 p-6 rounded-r-3xl border border-emerald-800/40">
          <span className="text-xs text-emerald-300 uppercase font-bold tracking-wider block">4. True Net Profit</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400 block mt-1">
            ₹{(summary?.netProfit || 0).toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-300/80 mt-1 block font-medium">Actual owner take-home</span>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Bar Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Daily Revenue (Last 7 Days)</h3>
            <span className="text-xs font-mono text-slate-400">₹ INR / day</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Breakdown Pie (1 col) */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-white">Turnover by Payment Mode</h3>
          
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={paymentModes}
                  dataKey="amount"
                  nameKey="payment_mode"
                  cx="50%"
                  cy="50%"
                  outerRadius={65}
                  innerRadius={35}
                >
                  {paymentModes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  formatter={(val: any) => [`₹${Number(val).toFixed(2)}`, 'Amount']}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {paymentModes.map((pm, idx) => (
              <div key={pm.payment_mode} className="flex justify-between items-center text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="capitalize font-medium">{pm.payment_mode}</span>
                </div>
                <span className="font-bold">₹{pm.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products Leaderboard */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white">Top 6 Best-Selling Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topProducts.map((p, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="text-[10px] text-blue-400 font-bold block">#Rank {idx + 1}</span>
                <span className="font-bold text-white text-xs block truncate">{p.product_name}</span>
                <span className="text-[11px] text-slate-400">{p.total_sold} units sold</span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-emerald-400 block">₹{p.total_revenue.toFixed(2)}</span>
                <span className="text-[10px] text-slate-500 font-mono">Profit: +₹{p.total_profit.toFixed(0)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
