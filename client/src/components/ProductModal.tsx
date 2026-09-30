import React, { useState, useEffect } from 'react';
import { X, Save, Barcode, Calendar, AlertCircle } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  categories: string[];
  onSave: (productData: Partial<Product>) => Promise<void>;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  categories,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    local_name: '',
    barcode: '',
    category: categories[0] || 'Grains & Flours',
    unit: 'pcs',
    purchase_price: 0,
    selling_price: 0,
    stock_quantity: 0,
    min_stock_alert: 10,
    expiry_date: '',
    batch_number: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        expiry_date: product.expiry_date || '',
        batch_number: product.batch_number || '',
      });
    } else {
      // Auto-generate realistic barcode & batch for new product
      setFormData({
        name: '',
        local_name: '',
        barcode: `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        category: categories[0] || 'Grains & Flours',
        unit: 'pcs',
        purchase_price: 0,
        selling_price: 0,
        stock_quantity: 20,
        min_stock_alert: 10,
        expiry_date: '',
        batch_number: `BAT-${Date.now().toString().slice(-4)}`,
      });
    }
  }, [product, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.selling_price) {
      alert('Product name and selling price are required');
      return;
    }
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 my-auto">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white">
              {product ? 'Edit Product Item' : 'Add New Inventory Product'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Product Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aashirvaad Atta 5kg"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Regional / Tamil Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. கோதுமை மாவு"
                value={formData.local_name || ''}
                onChange={(e) => setFormData({ ...formData, local_name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Barcode & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Barcode / EAN-13
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Scan or enter barcode"
                  value={formData.barcode || ''}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Category
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="General Grocery">General Grocery</option>
                <option value="Personal & Home Care">Personal & Home Care</option>
                <option value="Beverages">Beverages</option>
                <option value="Snacks & Biscuits">Snacks & Biscuits</option>
                <option value="Dairy & Fresh">Dairy & Fresh</option>
                <option value="Grains & Flours">Grains & Flours</option>
                <option value="Bakery">Bakery</option>
              </select>
            </div>
          </div>

          {/* Pricing & Units */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Unit
              </label>
              <select
                value={formData.unit || 'pcs'}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="pcs">Pieces (pcs)</option>
                <option value="packet">Packet (pkt)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="ltr">Litre (L)</option>
                <option value="bottle">Bottle</option>
                <option value="box">Box</option>
                <option value="jar">Jar</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Purchase Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.purchase_price ?? ''}
                onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Selling Price / MRP (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.selling_price ?? ''}
                onChange={(e) => setFormData({ ...formData, selling_price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold text-emerald-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Stock Levels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Current Stock Qty
              </label>
              <input
                type="number"
                value={formData.stock_quantity ?? ''}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Low Stock Alert Threshold
              </label>
              <input
                type="number"
                value={formData.min_stock_alert ?? ''}
                onChange={(e) => setFormData({ ...formData, min_stock_alert: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Expiry & Batch */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Expiry Date (Crucial for Alerts)</span>
              </label>
              <input
                type="date"
                value={formData.expiry_date || ''}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Batch Number
              </label>
              <input
                type="text"
                placeholder="e.g. BATCH-0926"
                value={formData.batch_number || ''}
                onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Info pill */}
          <div className="bg-blue-950/40 border border-blue-800/50 rounded-lg p-2.5 flex items-start gap-2 text-xs text-blue-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            <span>
              SmartShelf monitors the expiry date and low stock thresholds every day, alerting you before losses occur.
            </span>
          </div>

          {/* Form Actions */}
          <div className="p-4 bg-slate-800 -mx-5 -mb-5 mt-4 border-t border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : product ? 'Update Product' : 'Add to Inventory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
