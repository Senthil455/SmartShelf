import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Clock, 
  Phone, 
  Share2, 
  CreditCard, 
  X, 
  Check, 
  Banknote 
} from 'lucide-react';
import { api } from '../services/api';
import { Customer } from '../types';
import { useApp } from '../context/AppContext';

export const Customers: React.FC = () => {
  const { store, showToast } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  // New customer form
  const [newCust, setNewCust] = useState({ name: '', phone: '', address: '', credit_due: 0 });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.getCustomers();
      if (res.success) setCustomers(res.customers);
    } catch {
      //
    }
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name) return;
    try {
      const res = await api.createCustomer(newCust);
      if (res.success) {
        showToast(`Added customer: ${newCust.name}`, 'success');
        setIsAddModalOpen(false);
        setNewCust({ name: '', phone: '', address: '', credit_due: 0 });
        loadCustomers();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add customer', 'error');
    }
  };

  const handleRecordPayment = async () => {
    if (!selectedCustomer || paymentAmount <= 0) return;
    try {
      const res = await api.recordCustomerPayment(selectedCustomer.id, {
        amount: paymentAmount,
        paymentMode: 'cash',
        notes: 'Khata Due Settlement'
      });
      if (res.success) {
        showToast(`Recorded ₹${paymentAmount} payment for ${selectedCustomer.name}`, 'success');
        setIsPaymentModalOpen(false);
        setSelectedCustomer(null);
        setPaymentAmount(0);
        loadCustomers();
      }
    } catch (err: any) {
      showToast(err.message || 'Payment recording failed', 'error');
    }
  };

  const sendWhatsAppReminder = (c: Customer) => {
    const text = `Namaste ${c.name},%0A%0AThis is a gentle payment reminder from *${encodeURIComponent(store?.name || 'SmartShelf Provision Store')}*.%0A%0AYour current pending Khata (Credit) balance is: *₹${c.credit_due.toFixed(2)}*.%0A%0APlease pay via UPI to *${store?.upi_id || 'smartshelf@upi'}* or visit the store at your convenience.%0A%0AThank you!`;
    const phone = c.phone.replace(/[^0-9]/g, '');
    const url = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  };

  const filtered = customers.filter(c => {
    const matchesSearch = !search || 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      (c.phone && c.phone.includes(search));
    const matchesDue = !filterDueOnly || c.credit_due > 0;
    return matchesSearch && matchesDue;
  });

  const totalOutstandingDue = customers.reduce((sum, c) => sum + c.credit_due, 0);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>Customers & Khata (Udhaar) Ledger</span>
          </h1>
          <p className="text-xs text-slate-400">
            Maintain regular customer records, track credit dues, and send WhatsApp payment reminders
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Highlight: Outstanding Udhaar */}
      <div className="p-5 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 border border-amber-800/50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-900/50 rounded-xl text-amber-400 border border-amber-700/60">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-amber-300 font-semibold block uppercase tracking-wider">
              Total Outstanding Customer Khata (Udhaar)
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              ₹{totalOutstandingDue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilterDueOnly(!filterDueOnly)}
            className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer border ${
              filterDueOnly
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {filterDueOnly ? 'Showing Pending Dues Only' : 'Filter Pending Dues Only'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <span className="text-xs text-slate-400">
          Showing {filtered.length} of {customers.length} customers
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Phone Number</th>
                <th className="p-3.5">Address</th>
                <th className="p-3.5 text-right">Lifetime Purchases</th>
                <th className="p-3.5 text-right">Khata Due (Udhaar)</th>
                <th className="p-3.5 text-center">Settlement Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <span className="font-bold text-white block text-sm">{c.name}</span>
                    <span className="text-[10px] text-slate-500">ID: #{c.id}</span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{c.phone || '—'}</span>
                  </td>
                  <td className="p-3.5 text-slate-400 truncate max-w-xs">{c.address || 'Local Resident'}</td>
                  <td className="p-3.5 text-right font-mono text-slate-300">₹{c.total_purchases.toFixed(2)}</td>
                  <td className="p-3.5 text-right">
                    {c.credit_due > 0 ? (
                      <span className="px-2.5 py-1 bg-amber-950 text-amber-300 border border-amber-800 rounded-lg font-black text-sm font-mono">
                        ₹{c.credit_due.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold text-xs">Settled (₹0)</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {c.credit_due > 0 && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCustomer(c);
                              setPaymentAmount(c.credit_due);
                              setIsPaymentModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            title="Collect payment towards due"
                          >
                            <Banknote className="w-3.5 h-3.5" />
                            <span>Collect</span>
                          </button>
                          <button
                            onClick={() => sendWhatsAppReminder(c)}
                            className="p-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-400 rounded-lg transition cursor-pointer"
                            title="Send WhatsApp payment reminder"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {isPaymentModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Record Khata Payment</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-xs text-slate-400">Customer: <strong className="text-white">{selectedCustomer.name}</strong></span>
              <div className="flex justify-between text-xs">
                <span>Total Due:</span>
                <span className="text-amber-400 font-bold">₹{selectedCustomer.credit_due}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Payment Amount Collected (₹)
              </label>
              <input
                type="number"
                value={paymentAmount || ''}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xl font-bold text-emerald-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Payment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddCustomer} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Regular Customer</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Teacher"
                value={newCust.name}
                onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (For WhatsApp bills)</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={newCust.phone}
                onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Address / Street</label>
              <input
                type="text"
                placeholder="Flat / Street, Local Area"
                value={newCust.address}
                onChange={(e) => setNewCust({ ...newCust, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Opening Khata Due (Optional)</label>
              <input
                type="number"
                placeholder="0"
                value={newCust.credit_due || ''}
                onChange={(e) => setNewCust({ ...newCust, credit_due: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Save Customer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
