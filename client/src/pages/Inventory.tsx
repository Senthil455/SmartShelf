import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Barcode, 
  AlertTriangle, 
  Calendar,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ProductModal } from '../components/ProductModal';

export const Inventory: React.FC = () => {
  const { showToast, refreshAlerts } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low_stock' | 'expiring_soon'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadInventory();
  }, [stockFilter]);

  const loadInventory = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts({ filter: stockFilter !== 'all' ? stockFilter : undefined }),
        api.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) setCategories(catRes.categories);
    } catch {
      //
    }
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, productData);
        if (res.success) {
          showToast(`Updated ${productData.name}`, 'success');
        }
      } else {
        const res = await api.createProduct(productData);
        if (res.success) {
          showToast(`Added ${productData.name} to inventory`, 'success');
        }
      }
      loadInventory();
      refreshAlerts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        showToast(`Deleted ${name}`, 'info');
        loadInventory();
        refreshAlerts();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Local Name', 'Barcode', 'Category', 'Unit', 'Cost Price', 'Selling Price', 'Stock Qty', 'Expiry Date', 'Batch'];
    const rows = products.map(p => [
      p.id,
      `"${p.name}"`,
      `"${p.local_name || ''}"`,
      p.barcode,
      p.category,
      p.unit,
      p.purchase_price,
      p.selling_price,
      p.stock_quantity,
      p.expiry_date || '',
      p.batch_number || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smartshelf_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.local_name && p.local_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.includes(search));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Products & Inventory</h1>
          <p className="text-xs text-slate-400">
            Real-time stock tracking, unit management, barcodes, and expiry dates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-900/40 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, Tamil, or barcode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex bg-slate-950 border border-slate-700 rounded-xl p-0.5">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                stockFilter === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStockFilter('low_stock')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                stockFilter === 'low_stock' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('expiring_soon')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                stockFilter === 'expiring_soon' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Expiring (7d)
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Product Title / Local Name</th>
                <th className="p-3.5">Barcode / SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-right">Cost Price</th>
                <th className="p-3.5 text-right">Selling Price</th>
                <th className="p-3.5 text-center">Stock Level</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No products found matching criteria
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isLow = p.stock_quantity <= p.min_stock_alert;
                  const isOut = p.stock_quantity <= 0;
                  const isExpiring = p.expiry_date && new Date(p.expiry_date) <= new Date(Date.now() + 7 * 86400000);

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5">
                        <span className="font-bold text-white block text-sm">{p.name}</span>
                        {p.local_name && (
                          <span className="text-[11px] text-slate-400 font-sans">{p.local_name}</span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                          {p.barcode}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">{p.category}</td>
                      <td className="p-3.5 text-right font-mono text-slate-400">₹{p.purchase_price.toFixed(2)}</td>
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-400 text-sm">
                        ₹{p.selling_price.toFixed(2)}
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          isOut ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                          isLow ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {p.stock_quantity} {p.unit}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {p.expiry_date ? (
                          <span className={`flex items-center gap-1 font-mono text-[11px] ${
                            isExpiring ? 'text-rose-400 font-bold' : 'text-slate-400'
                          }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{p.expiry_date}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-lg transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};
