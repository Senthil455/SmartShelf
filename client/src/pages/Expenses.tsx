import React, { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, Calendar, Banknote, X, PieChart } from 'lucide-react';
import { api } from '../services/api';
import { Expense } from '../types';
import { useApp } from '../context/AppContext';

export const Expenses: React.FC = () => {
  const { showToast } = useApp();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExp, setNewExp] = useState({
    category: 'Tea & Snacks',
    description: '',
    amount: '',
    payment_mode: 'cash',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const res = await api.getExpenses();
      if (res.success) setExpenses(res.expenses);
    } catch {
      //
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.amount) return;
    try {
      const res = await api.createExpense({
        category: newExp.category,
        description: newExp.description,
        amount: parseFloat(newExp.amount),
        payment_mode: newExp.payment_mode,
        date: newExp.date
      });
      if (res.success) {
        showToast('Expense logged successfully', 'success');
        setIsModalOpen(false);
        setNewExp({
          category: 'Tea & Snacks',
          description: '',
          amount: '',
          payment_mode: 'cash',
          date: new Date().toISOString().split('T')[0]
        });
        loadExpenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to log expense', 'error');
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const res = await api.deleteExpense(id);
      if (res.success) {
        showToast('Expense removed', 'info');
        loadExpenses();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete expense', 'error');
    }
  };

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Receipt className="w-6 h-6 text-rose-400" />
            <span>Store Expense Management</span>
          </h1>
          <p className="text-xs text-slate-400">
            Track day-to-day shop expenses (Rent, Tea, Electricity, Wages) to understand your true net profit
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-rose-950/50 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shop Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block font-semibold">Total Operating Expenses Logged</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">
            ₹{totalExpense.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 block">{expenses.length} expense entries</span>
        </div>

        {/* Highest Category */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block font-semibold">Top Expense Category</span>
          <span className="text-xl font-bold text-white mt-1 block">
            {Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Rent'}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            ₹{(Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[1] || 0).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Impact Note */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-blue-950 border border-blue-800 rounded-xl text-blue-400 shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Automatically deducted from gross margin in the Reports tab to calculate True Net Store Profit.
          </p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white">Expense Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Category</th>
                <th className="p-3">Description / Remarks</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Payment Mode</th>
                <th className="p-3 text-right">Amount (₹)</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-md font-semibold text-white">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{e.description || '—'}</td>
                  <td className="p-3 text-slate-400">{e.date}</td>
                  <td className="p-3 text-center uppercase font-mono text-[11px] text-slate-400">{e.payment_mode}</td>
                  <td className="p-3 text-right font-mono font-bold text-rose-400 text-sm">
                    -₹{e.amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-500 hover:text-rose-400 rounded-lg transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Log Shop Operating Expense</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Expense Category *</label>
              <select
                value={newExp.category}
                onChange={(e) => setNewExp({ ...newExp, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="Rent">Shop Rent</option>
                <option value="Electricity">Electricity Bill (TNEB)</option>
                <option value="Staff Salary">Staff / Delivery Boy Salary</option>
                <option value="Tea & Snacks">Tea & Refreshments</option>
                <option value="Packaging">Carry Bags & Packaging</option>
                <option value="Transport">Goods Auto / Transport</option>
                <option value="Maintenance">Shop Maintenance / Cleaning</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount (₹) *</label>
              <input
                type="number"
                required
                step="0.01"
                placeholder="0.00"
                value={newExp.amount}
                onChange={(e) => setNewExp({ ...newExp, amount: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-rose-400 font-bold focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Description / Note</label>
              <input
                type="text"
                placeholder="e.g. Paid tea boy for the week"
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Payment Mode</label>
                <select
                  value={newExp.payment_mode}
                  onChange={(e) => setNewExp({ ...newExp, payment_mode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / GPay</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Date</label>
                <input
                  type="date"
                  value={newExp.date}
                  onChange={(e) => setNewExp({ ...newExp, date: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Log Expense
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
