import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Barcode, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CheckCircle2, 
  Percent, 
  X,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';
import { Product, Sale } from '../types';
import { useApp } from '../context/AppContext';
import { PaymentModal } from '../components/PaymentModal';
import { ThermalReceipt } from '../components/ThermalReceipt';

export const POS: React.FC = () => {
  const { cart, addToCart, updateCartQuantity, removeFromCart, clearCart, showToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Billing adjustments
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [applyGst, setApplyGst] = useState<boolean>(true);
  const [gstRate, setGstRate] = useState<number>(5); // 5% GST standard

  // Checkout modals
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProducts();
    // Auto focus search box on load
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const loadProducts = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch {
      // Fallback
    }
  };

  // Barcode / Name filter
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.local_name && p.local_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  // Handle Enter key on barcode scanner
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Check if exact barcode matches
      const exactMatch = products.find(p => p.barcode === searchQuery.trim());
      if (exactMatch) {
        addToCart(exactMatch);
        setSearchQuery('');
        showToast(`Scanned: ${exactMatch.name}`, 'success');
        return;
      }
      // If single item filtered
      if (filteredProducts.length === 1) {
        addToCart(filteredProducts[0]);
        setSearchQuery('');
        showToast(`Added: ${filteredProducts[0].name}`, 'success');
      }
    }
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.selling_price * item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = applyGst ? (taxableAmount * gstRate) / 100 : 0;
  const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

  const handleCheckoutConfirm = async (paymentData: any) => {
    try {
      const salePayload = {
        customerId: paymentData.customerId,
        customerName: paymentData.customerName,
        customerPhone: paymentData.customerPhone,
        items: cart.map(i => ({
          id: i.id,
          name: i.name,
          unit: i.unit,
          quantity: i.quantity,
          price: i.selling_price,
          purchase_price: i.purchase_price
        })),
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount,
        paymentMode: paymentData.paymentMode,
        cashReceived: paymentData.cashReceived,
        changeReturned: paymentData.changeReturned,
        notes: paymentData.notes
      };

      const res = await api.checkoutSale(salePayload);
      if (res.success) {
        setIsPaymentOpen(false);
        setCompletedSale(res.sale);
        clearCart();
        loadProducts(); // refresh stock

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        showToast('Bill generated and saved successfully!', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to complete sale', 'error');
    }
  };

  return (
    <div className="h-[calc(100vh-53px)] flex flex-col lg:flex-row overflow-hidden bg-slate-950 text-slate-100">
      {/* Left Pane: Catalog & Quick Add (65%) */}
      <div className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
        {/* Top Search & Filter Bar */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 shrink-0">
          <div className="relative">
            <Barcode className="w-5 h-5 absolute left-3.5 top-3 text-blue-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Scan Barcode (EAN) or search product by name/Tamil... [Press Enter]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              }`}
            >
              All Items ({products.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
              <ShoppingBag className="w-12 h-12 mb-2 stroke-[1.5]" />
              <p>No products found matching your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((p) => {
                const isLow = p.stock_quantity <= p.min_stock_alert;
                const isOut = p.stock_quantity <= 0;
                return (
                  <button
                    key={p.id}
                    onClick={() => addToCart(p)}
                    disabled={isOut}
                    className={`p-3 bg-slate-900 border rounded-xl text-left flex flex-col justify-between transition-all group cursor-pointer ${
                      isOut
                        ? 'opacity-40 border-slate-800 cursor-not-allowed'
                        : 'border-slate-800 hover:border-blue-500 hover:bg-slate-850 hover:shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold">
                          {p.category}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          isOut ? 'bg-rose-950 text-rose-400' :
                          isLow ? 'bg-amber-950 text-amber-300' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {isOut ? 'Out of stock' : `${p.stock_quantity} ${p.unit}`}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-blue-300">
                        {p.name}
                      </h4>
                      {p.local_name && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-sans">
                          {p.local_name}
                        </p>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-black text-emerald-400">
                        ₹{p.selling_price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-blue-400 group-hover:translate-x-0.5 transition font-semibold">
                        + Add
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Pane: Active Cart Bill (35%) */}
      <div className="w-full lg:w-[420px] bg-slate-900/90 flex flex-col justify-between shrink-0 overflow-hidden border-t lg:border-t-0 border-slate-800">
        {/* Cart Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Current Cart Bill</h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-bold">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6 space-y-2">
              <ShoppingBag className="w-10 h-10 stroke-1 text-slate-600" />
              <p className="font-semibold text-slate-400">Cart is Empty</p>
              <p className="text-[11px] text-slate-500">
                Scan barcode with scanner or click products on the left to add items to bill.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 truncate">
                  <span className="font-bold text-slate-200 block truncate">{item.name}</span>
                  <span className="text-[11px] text-slate-400">
                    ₹{item.selling_price} / {item.unit}
                  </span>
                </div>

                {/* Qty +/- */}
                <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-white text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                {/* Line Total */}
                <span className="w-16 text-right font-black text-slate-200">
                  ₹{(item.selling_price * item.quantity).toFixed(2)}
                </span>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bill Calculations & Discounts */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Quick discounts & GST toggle */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <Percent className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[11px] text-slate-400">Disc:</span>
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercent || ''}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-12 bg-transparent text-right font-bold text-white focus:outline-none"
              />
              <span className="text-[11px] text-slate-400">%</span>
            </div>

            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <span className="text-[11px] text-slate-400">GST ({gstRate}%):</span>
              <input
                type="checkbox"
                checked={applyGst}
                onChange={(e) => setApplyGst(e.target.checked)}
                className="accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Subtotals Breakdown */}
          <div className="space-y-1 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Items Subtotal:</span>
              <span className="text-slate-200 font-mono">₹{subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount ({discountPercent}%):</span>
                <span className="font-mono">-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            {applyGst && (
              <div className="flex justify-between text-slate-400">
                <span>GST Tax ({gstRate}%):</span>
                <span className="font-mono">+₹{taxAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-800">
              <span className="text-sm font-bold text-white">Grand Total:</span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Checkout Action Button */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            disabled={cart.length === 0}
            className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
              cart.length === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-emerald-950/60'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay & Print Bill (₹{totalAmount.toFixed(2)})</span>
          </button>
        </div>
      </div>

      {/* Payment Checkout Modal */}
      {isPaymentOpen && (
        <PaymentModal
          totalAmount={totalAmount}
          subtotal={subtotal}
          discountAmount={discountAmount}
          taxAmount={taxAmount}
          onConfirm={handleCheckoutConfirm}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}

      {/* Thermal Receipt Print / WhatsApp Share Modal */}
      {completedSale && (
        <ThermalReceipt
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </div>
  );
};
