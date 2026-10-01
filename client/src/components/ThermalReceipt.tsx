import React from 'react';
import { Printer, Share2, CheckCircle2, X } from 'lucide-react';
import { Sale } from '../types';
import { useApp } from '../context/AppContext';

interface ThermalReceiptProps {
  sale: Sale;
  onClose: () => void;
}

export const ThermalReceipt: React.FC<ThermalReceiptProps> = ({ sale, onClose }) => {
  const { store } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemsList = sale.items
      ?.map(i => `• ${i.product_name} x ${i.quantity} = ₹${i.total_price.toFixed(2)}`)
      .join('%0A') || '';

    const text = `*${encodeURIComponent(store?.name || 'SmartShelf Store')}*%0A` +
      `*Tax Invoice:* ${sale.invoice_number}%0A` +
      `*Date:* ${new Date(sale.created_at || Date.now()).toLocaleDateString('en-IN')}%0A` +
      `--------------------------------%0A` +
      `${itemsList}%0A` +
      `--------------------------------%0A` +
      `*Subtotal:* ₹${sale.subtotal.toFixed(2)}%0A` +
      (sale.discount_amount > 0 ? `*Discount:* -₹${sale.discount_amount.toFixed(2)}%0A` : '') +
      (sale.tax_amount > 0 ? `*GST Tax:* +₹${sale.tax_amount.toFixed(2)}%0A` : '') +
      `*Grand Total:* ₹${sale.total_amount.toFixed(2)}%0A` +
      `*Payment:* ${sale.payment_mode.toUpperCase()} (${sale.payment_status.toUpperCase()})%0A%0A` +
      `_Thank you for shopping with us! Powered by SmartShelf_`;

    const phone = sale.customer_phone ? sale.customer_phone.replace(/[^0-9]/g, '') : '';
    const url = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;

    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header Actions */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Bill Generated Successfully</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable 80mm Thermal Receipt Content */}
        <div className="p-6 bg-white text-slate-900 overflow-y-auto max-h-[70vh]">
          <div id="printable-receipt" className="font-mono text-xs max-w-[320px] mx-auto text-slate-950">
            {/* Store Header */}
            <div className="text-center pb-3 border-b border-dashed border-slate-400">
              <h2 className="text-base font-bold tracking-tight uppercase">{store?.name || 'SmartShelf Mart'}</h2>
              <p className="text-[11px] text-slate-700 mt-0.5">{store?.address || 'Gandhi Road, Chennai'}</p>
              <p className="text-[11px] text-slate-700">Phone: {store?.phone || '+91 98765 43210'}</p>
              {store?.gstin && <p className="text-[10px] text-slate-600 mt-0.5">GSTIN: {store.gstin}</p>}
            </div>

            {/* Bill Meta */}
            <div className="py-2.5 border-b border-dashed border-slate-400 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span>Invoice: <strong className="font-bold">{sale.invoice_number}</strong></span>
                <span>{new Date(sale.created_at || Date.now()).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer: {sale.customer_name || 'Walk-in'}</span>
                <span>{new Date(sale.created_at || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {sale.customer_phone && <div>Phone: {sale.customer_phone}</div>}
              <div>Cashier: Counter 1</div>
            </div>

            {/* Line Items Table */}
            <div className="py-2 border-b border-dashed border-slate-400">
              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-300 font-bold">
                    <th className="pb-1">Item</th>
                    <th className="pb-1 text-center">Qty</th>
                    <th className="pb-1 text-right">Rate</th>
                    <th className="pb-1 text-right">Amt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dotted divide-slate-200">
                  {sale.items?.map((item, idx) => (
                    <tr key={idx} className="py-1">
                      <td className="py-1 pr-1 truncate max-w-[140px] font-sans text-[11px]">
                        {item.product_name}
                      </td>
                      <td className="py-1 text-center">{item.quantity}</td>
                      <td className="py-1 text-right">₹{item.unit_price}</td>
                      <td className="py-1 text-right font-medium">₹{item.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Breakdown */}
            <div className="py-2.5 space-y-1 text-[11px] border-b border-dashed border-slate-400">
              <div className="flex justify-between text-slate-700">
                <span>Items Subtotal:</span>
                <span>₹{sale.subtotal.toFixed(2)}</span>
              </div>
              {sale.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Store Discount:</span>
                  <span>-₹{sale.discount_amount.toFixed(2)}</span>
                </div>
              )}
              {sale.tax_amount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>GST (Included):</span>
                  <span>+₹{sale.tax_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black border-t border-slate-300 pt-1 mt-1">
                <span>NET PAYABLE:</span>
                <span>₹{sale.total_amount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="py-2 text-[11px] space-y-0.5 border-b border-dashed border-slate-400">
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <span className="font-bold uppercase">{sale.payment_mode}</span>
              </div>
              {sale.payment_mode === 'cash' && (
                <>
                  <div className="flex justify-between text-slate-700">
                    <span>Cash Tendered:</span>
                    <span>₹{sale.cash_received.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Change Returned:</span>
                    <span>₹{sale.change_returned.toFixed(2)}</span>
                  </div>
                </>
              )}
              {sale.payment_mode === 'due' && (
                <div className="text-amber-800 font-bold bg-amber-50 p-1 rounded text-center my-1">
                  Added to Customer Khata (Udhaar)
                </div>
              )}
            </div>

            {/* Barcode & Footer */}
            <div className="pt-3 text-center space-y-1">
              <div className="font-mono text-center tracking-widest text-[11px] font-bold text-slate-600">
                |||||||||||||||||||||||||||||||||||||||
              </div>
              <p className="text-[10px] text-slate-500">{sale.invoice_number}</p>
              <p className="text-[10px] font-semibold text-slate-800 mt-2">
                Thank you for shopping with us! Please visit again.
              </p>
              <p className="text-[9px] text-slate-400">
                Generated with SmartShelf Retail POS
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-800/90 border-t border-slate-700 flex items-center justify-between gap-3 no-print">
          <button
            onClick={handleWhatsAppShare}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-3 rounded-xl font-medium text-xs shadow transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Send WhatsApp Bill</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2.5 px-3 rounded-xl font-medium text-xs shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};
