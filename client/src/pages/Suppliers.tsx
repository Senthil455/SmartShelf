import React, { useState, useEffect } from 'react';
import { Truck, Plus, Phone, Search, FileText, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';
import { Supplier } from '../types';
import { useApp } from '../context/AppContext';

export const Suppliers: React.FC = () => {
  const { showToast } = useApp();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);

  // New Supplier form
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact_person: '',
    phone: '',
    address: '',
    balance_due: 0
  });

  // Purchase Bill form
  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: '',
    supplierName: '',
    billNumber: '',
    totalAmount: '',
    amountPaid: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [supRes, purRes] = await Promise.all([
        api.getSuppliers(),
        api.getPurchases()
      ]);
      if (supRes.success) setSuppliers(supRes.suppliers);
      if (purRes.success) setPurchases(purRes.purchases);
    } catch {
      //
    }
  };

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name) return;
    try {
      const res = await api.createSupplier(newSupplier);
      if (res.success) {
        showToast(`Supplier ${newSupplier.name} added`, 'success');
        setIsAddSupplierOpen(false);
        setNewSupplier({ name: '', contact_person: '', phone: '', address: '', balance_due: 0 });
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to add supplier', 'error');
    }
  };

  const handleRecordPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!purchaseForm.supplierName || !purchaseForm.totalAmount) return;
    try {
      const res = await api.recordPurchase({
        supplierId: purchaseForm.supplierId ? parseInt(purchaseForm.supplierId) : null,
        supplierName: purchaseForm.supplierName,
        billNumber: purchaseForm.billNumber,
        totalAmount: parseFloat(purchaseForm.totalAmount),
        amountPaid: parseFloat(purchaseForm.amountPaid || purchaseForm.totalAmount),
        notes: purchaseForm.notes
      });
      if (res.success) {
        showToast('Purchase bill recorded and payables updated', 'success');
        setIsPurchaseModalOpen(false);
        setPurchaseForm({ supplierId: '', supplierName: '', billNumber: '', totalAmount: '', amountPaid: '', notes: '' });
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to log purchase', 'error');
    }
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    (s.contact_person && s.contact_person.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-400" />
            <span>Suppliers & Inbound Purchases</span>
          </h1>
          <p className="text-xs text-slate-400">
            Manage wholesale distributors, stock purchase bills, and pending supplier payables
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPurchaseModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Log Purchase Bill</span>
          </button>
          <button
            onClick={() => setIsAddSupplierOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredSuppliers.map((s) => (
          <div key={s.id} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{s.name}</h3>
                  <span className="text-xs text-slate-400">Contact: {s.contact_person || 'Agency Desk'}</span>
                </div>
                <span className="p-2 rounded-xl bg-slate-800 text-emerald-400">
                  <Truck className="w-4 h-4" />
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{s.phone || '—'}</span>
              </p>
              <p className="text-xs text-slate-500 truncate mt-1">{s.address || 'Chennai Hub'}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Total Invoiced</span>
                <span className="font-bold text-slate-200">₹{s.total_purchases.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block uppercase">Balance Due</span>
                <span className={`font-bold ${s.balance_due > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  ₹{s.balance_due.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Purchase Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white">Recent Purchase Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Bill / Invoice #</th>
                <th className="p-3">Supplier Name</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-right">Amount Paid</th>
                <th className="p-3 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {purchases.length === 0 ? (
                <tr><td colSpan={6} className="p-6 text-center text-slate-500">No purchase records logged yet</td></tr>
              ) : (
                purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-blue-400">{p.bill_number}</td>
                    <td className="p-3 font-medium text-white">{p.supplier_name}</td>
                    <td className="p-3 text-slate-400">{new Date(p.purchase_date).toLocaleDateString('en-IN')}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-200">₹{p.total_amount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-emerald-400">₹{p.amount_paid.toFixed(2)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'paid' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSupplier} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add Supplier / Distributor</h3>
              <button type="button" onClick={() => setIsAddSupplierOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Supplier Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Metro Wholesale Traders"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Person</label>
              <input
                type="text"
                placeholder="Agent / Representative Name"
                value={newSupplier.contact_person}
                onChange={(e) => setNewSupplier({ ...newSupplier, contact_person: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 94440 12345"
                value={newSupplier.phone}
                onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Address / Market Depot</label>
              <input
                type="text"
                placeholder="Depot Address"
                value={newSupplier.address}
                onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddSupplierOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Save Supplier
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log Purchase Bill Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleRecordPurchase} className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Log Inward Stock Purchase</h3>
              <button type="button" onClick={() => setIsPurchaseModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Select Supplier *</label>
              <select
                required
                value={purchaseForm.supplierId}
                onChange={(e) => {
                  const sel = suppliers.find(s => s.id === parseInt(e.target.value));
                  setPurchaseForm({
                    ...purchaseForm,
                    supplierId: e.target.value,
                    supplierName: sel ? sel.name : ''
                  });
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">Choose Supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Supplier Bill #</label>
                <input
                  type="text"
                  placeholder="e.g. MET-9921"
                  value={purchaseForm.billNumber}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, billNumber: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Total Bill (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="0.00"
                  value={purchaseForm.totalAmount}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, totalAmount: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-emerald-400 font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Amount Paid Now (₹)</label>
              <input
                type="number"
                placeholder="Leave blank if fully paid"
                value={purchaseForm.amountPaid}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, amountPaid: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsPurchaseModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition"
              >
                Record Purchase
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
