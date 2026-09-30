import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Store, User, CartItem, Product, AlertCounts } from '../types';
import { api } from '../services/api';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User | null;
  store: Store | null;
  setUserRole: (role: 'owner' | 'cashier') => Promise<void>;
  updateStoreDetails: (data: Partial<Store>) => Promise<void>;
  upgradePlan: (plan: 'basic' | 'standard' | 'premium') => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  alertCounts: AlertCounts;
  refreshAlerts: () => Promise<void>;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'Ramesh Kumar (Store Owner)',
    email: 'admin@smartshelf.com',
    role: 'owner'
  });

  const [store, setStore] = useState<Store | null>({
    id: 1,
    name: 'Lakshmi Supermarket & Provisions',
    owner_name: 'Ramesh Kumar & Sathish',
    phone: '+91 98765 43210',
    email: 'owner@smartshelf.local',
    address: 'No. 42, Gandhi Road, T. Nagar, Chennai - 600017',
    gstin: '33AAAAA0000A1Z5',
    upi_id: 'smartshelf@upi',
    currency: '₹',
    plan: 'premium'
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [alertCounts, setAlertCounts] = useState<AlertCounts>({
    lowStock: 0,
    expired: 0,
    expiringIn7: 0,
    expiringIn30: 0,
    totalAlerts: 0
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshAlerts = async () => {
    try {
      const data = await api.getAlerts();
      if (data.success) {
        setAlertCounts(data.counts);
      }
    } catch {
      // Backend maybe loading
    }
  };

  const loadInitialData = async () => {
    try {
      const storeRes = await api.getStore();
      if (storeRes.success && storeRes.store) {
        setStore(storeRes.store);
      }
      await refreshAlerts();
    } catch {
      // Use fallback
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const setUserRole = async (role: 'owner' | 'cashier') => {
    try {
      const res = await api.login(role);
      if (res.success) {
        setUser(res.user);
        if (res.store) setStore(res.store);
        showToast(`Switched profile to ${res.user.name}`, 'info');
      }
    } catch {
      setUser(prev => prev ? { ...prev, role, name: role === 'owner' ? 'Ramesh Kumar (Store Owner)' : 'Sathish (Cashier)' } : null);
      showToast(`Switched mode to ${role}`, 'info');
    }
  };

  const updateStoreDetails = async (data: Partial<Store>) => {
    try {
      const res = await api.updateStore(data);
      if (res.success) {
        setStore(res.store);
        showToast('Store settings updated successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update store settings', 'error');
    }
  };

  const upgradePlan = async (plan: 'basic' | 'standard' | 'premium') => {
    try {
      const res = await api.upgradePlan(plan);
      if (res.success) {
        setStore(res.store);
        showToast(`Store upgraded to ${plan.toUpperCase()} plan!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to upgrade plan', 'error');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, price: product.selling_price }];
    });
    showToast(`Added ${product.name} to bill`, 'info');
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        store,
        setUserRole,
        updateStoreDetails,
        upgradePlan,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        alertCounts,
        refreshAlerts,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
      {/* Toast Notification HUD */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-sm flex items-center justify-between gap-3 transition-all duration-300 transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-900/95 text-emerald-100 border-emerald-700'
                : toast.type === 'error'
                ? 'bg-rose-900/95 text-rose-100 border-rose-700'
                : 'bg-slate-900/95 text-slate-100 border-slate-700'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-xs opacity-75 hover:opacity-100 hover:text-white"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
