import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Banknote, QrCode, CreditCard, Clock, UserPlus, X, Check } from 'lucide-react';
import { Customer } from '../types';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
  totalAmount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  onConfirm: (paymentData: {
    paymentMode: 'cash' | 'upi' | 'card' | 'due';
    customerId?: number | null;
    customerName?: string;
    customerPhone?: string;
    cashReceived: number;
    changeReturned: number;
    notes?: string;
  }) => void;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  totalAmount,
  onConfirm,
  onClose
}) => {
  const { store } = useApp();
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'card' | 'due'>('cash');
  const [cashReceived, setCashReceived] = useState<number>(Math.ceil(totalAmount));
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState<boolean>(false);

  useEffect(() => {
    api.getCustomers().then(res => {
      if (res.success && res.customers) {
        setCustomers(res.customers);
      }
    }).catch(() => {});
  }, []);

  const changeReturned = Math.max(0, cashReceived - totalAmount);

  // Generate real UPI payment URL
  const upiId = store?.upi_id || 'smartshelf@upi';
  const storeName = encodeURIComponent(store?.name || 'SmartShelf Store');
  const upiUrl = `upi://pay?pa=${upiId}&pn=${storeName}&am=${totalAmount.toFixed(2)}&cu=INR&tn=Bill%20Payment`;

  const handleSelectCustomer = (idStr: string) => {
    if (!idStr) {
      setSelectedCustomerId(null);
      setCustomerName('Walk-in Customer');
      setCustomerPhone('');
      return;
    }
    const id = parseInt(idStr);
    const found = customers.find(c => c.id === id);
    if (found) {
      setSelectedCustomerId(found.id);
      setCustomerName(found.name);
      setCustomerPhone(found.phone);
    }
  };

  const handleComplete = () => {
    if (paymentMode === 'due' && !selectedCustomerId && !customerName) {
      alert('Please select or specify a customer for Khata (Due) billing');
      return;
    }

    onConfirm({
      paymentMode,
      customerId: selectedCustomerId,
      customerName,
      customerPhone,
      cashReceived: paymentMode === 'cash' ? cashReceived : totalAmount,
      changeReturned: paymentMode === 'cash' ? changeReturned : 0,
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Payment & Checkout</h3>
            <p className="text-xs text-slate-400">Total Bill Payable</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400 tracking-tight">₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Payment Mode Selector Tabs */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setPaymentMode('cash')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                paymentMode === 'cash'
                  ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs font-semibold">Cash</span>
            </button>

            <button
              onClick={() => setPaymentMode('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                paymentMode === 'upi'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs font-semibold">UPI / QR</span>
            </button>

            <button
              onClick={() => setPaymentMode('card')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                paymentMode === 'card'
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-semibold">Card / POS</span>
            </button>

            <button
              onClick={() => setPaymentMode('due')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                paymentMode === 'due'
                  ? 'bg-amber-600 border-amber-500 text-white shadow-md'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-xs font-semibold">Khata (Due)</span>
            </button>
          </div>

          {/* Mode-Specific Views */}
          {paymentMode === 'cash' && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Cash Tendered by Customer
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={cashReceived || ''}
                  onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-4 py-2 text-xl font-bold text-white focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  Math.ceil(totalAmount),
                  Math.ceil(totalAmount / 100) * 100,
                  Math.ceil(totalAmount / 500) * 500 || 500,
                  (Math.ceil(totalAmount / 500) * 500) + 500
                ].filter((v, i, a) => v >= totalAmount && a.indexOf(v) === i).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCashReceived(amt)}
                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md text-xs font-medium text-slate-200 cursor-pointer"
                  >
                    Exact ₹{amt}
                  </button>
                ))}
              </div>

              {/* Change Returned HUD */}
              <div className="mt-3 p-3 bg-slate-900 rounded-lg border border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-400">Balance Return to Customer:</span>
                <span className={`text-xl font-bold ${changeReturned > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                  ₹{changeReturned.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {paymentMode === 'upi' && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 flex flex-col items-center text-center space-y-3">
              <div className="p-3 bg-white rounded-xl shadow-md">
                <QRCodeSVG value={upiUrl} size={160} level="M" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Scan with GPay, PhonePe, Paytm</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">UPI ID: {upiId}</p>
                <p className="text-xs font-bold text-emerald-400 mt-1">Amount: ₹{totalAmount.toFixed(2)}</p>
              </div>
              <p className="text-[11px] text-slate-400 max-w-xs">
                Customer scans the dynamic QR code on screen. Click Complete once payment sound arrives!
              </p>
            </div>
          )}

          {paymentMode === 'card' && (
            <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 text-center space-y-2">
              <CreditCard className="w-10 h-10 text-indigo-400 mx-auto" />
              <p className="text-sm font-semibold text-white">Swipe or Tap on EDC Card POS Machine</p>
              <p className="text-xs text-slate-400">
                Enter amount <strong className="text-indigo-300">₹{totalAmount.toFixed(2)}</strong> on your PineLabs / Mswipe / Paytm card terminal.
              </p>
            </div>
          )}

          {paymentMode === 'due' && (
            <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>Customer Udhaar (Credit) Bill</span>
              </div>
              <p className="text-xs text-slate-300">
                This bill amount will be added to the customer’s pending Khata balance.
              </p>
            </div>
          )}

          {/* Customer Selection / Association */}
          <div className="space-y-2 border-t border-slate-800 pt-3">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Customer Details (Optional for Cash/UPI)</label>
              <button
                type="button"
                onClick={() => setIsNewCustomerOpen(!isNewCustomerOpen)}
                className="text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isNewCustomerOpen ? 'Select Existing' : 'New Customer'}</span>
              </button>
            </div>

            {!isNewCustomerOpen ? (
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => handleSelectCustomer(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="">Walk-in Customer (General)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} {c.credit_due > 0 ? `• Due: ₹${c.credit_due}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName === 'Walk-in Customer' ? '' : customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Phone (for WhatsApp bill)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <input
              type="text"
              placeholder="Sale notes (e.g. delivered home, packing instructions)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-800 border-t border-slate-700 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-300 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleComplete}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-emerald-950/50 transition cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Complete Sale & Print Bill (₹{totalAmount.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
