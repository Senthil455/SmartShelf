import { Product, Customer, Supplier, Sale, Expense, Store, User, ReportSummary } from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth & Store
  login: (role?: string) => fetchJson<{ success: boolean; user: User; store: Store; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ role: role || 'owner' })
  }),
  getStore: () => fetchJson<{ success: boolean; store: Store }>('/store'),
  updateStore: (data: Partial<Store>) => fetchJson<{ success: boolean; store: Store }>('/store', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  upgradePlan: (plan: string) => fetchJson<{ success: boolean; message: string; store: Store }>('/store/upgrade-plan', {
    method: 'POST',
    body: JSON.stringify({ plan })
  }),

  // Products
  getProducts: (params?: { search?: string; category?: string; filter?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.filter) query.append('filter', params.filter);
    return fetchJson<{ success: boolean; products: Product[] }>(`/products?${query.toString()}`);
  },
  getCategories: () => fetchJson<{ success: boolean; categories: string[] }>('/products/categories'),
  createProduct: (product: Partial<Product>) => fetchJson<{ success: boolean; product: Product }>('/products', {
    method: 'POST',
    body: JSON.stringify(product)
  }),
  updateProduct: (id: number, product: Partial<Product>) => fetchJson<{ success: boolean; product: Product }>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  }),
  deleteProduct: (id: number) => fetchJson<{ success: boolean; message: string }>(`/products/${id}`, {
    method: 'DELETE'
  }),

  // Sales / POS
  checkoutSale: (saleData: any) => fetchJson<{ success: boolean; message: string; sale: Sale }>('/sales', {
    method: 'POST',
    body: JSON.stringify(saleData)
  }),
  getSales: () => fetchJson<{ success: boolean; sales: Sale[] }>('/sales'),
  getSaleById: (id: number) => fetchJson<{ success: boolean; sale: Sale }>(`/sales/${id}`),

  // Customers & Khata
  getCustomers: () => fetchJson<{ success: boolean; customers: Customer[] }>('/customers'),
  createCustomer: (customer: Partial<Customer>) => fetchJson<{ success: boolean; customer: Customer }>('/customers', {
    method: 'POST',
    body: JSON.stringify(customer)
  }),
  updateCustomer: (id: number, customer: Partial<Customer>) => fetchJson<{ success: boolean; customer: Customer }>(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(customer)
  }),
  recordCustomerPayment: (customerId: number, data: { amount: number; paymentMode?: string; notes?: string }) => 
    fetchJson<{ success: boolean; customer: Customer }>(`/customers/${customerId}/pay-due`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Suppliers & Purchases
  getSuppliers: () => fetchJson<{ success: boolean; suppliers: Supplier[] }>('/suppliers'),
  createSupplier: (supplier: Partial<Supplier>) => fetchJson<{ success: boolean; supplier: Supplier }>('/suppliers', {
    method: 'POST',
    body: JSON.stringify(supplier)
  }),
  recordPurchase: (purchaseData: any) => fetchJson<{ success: boolean; message: string; purchaseId: number }>('/suppliers/purchases', {
    method: 'POST',
    body: JSON.stringify(purchaseData)
  }),
  getPurchases: () => fetchJson<{ success: boolean; purchases: any[] }>('/suppliers/purchases'),

  // Expenses
  getExpenses: () => fetchJson<{ success: boolean; expenses: Expense[] }>('/expenses'),
  createExpense: (expense: Partial<Expense>) => fetchJson<{ success: boolean; expense: Expense }>('/expenses', {
    method: 'POST',
    body: JSON.stringify(expense)
  }),
  deleteExpense: (id: number) => fetchJson<{ success: boolean; message: string }>(`/expenses/${id}`, {
    method: 'DELETE'
  }),

  // Alerts
  getAlerts: () => fetchJson<{
    success: boolean;
    counts: { lowStock: number; expired: number; expiringIn7: number; expiringIn30: number; totalAlerts: number };
    lowStock: Product[];
    expired: Product[];
    expiringIn7: Product[];
    expiringIn30: Product[];
  }>('/alerts'),

  // Reports
  getReportSummary: () => fetchJson<{ success: boolean; summary: ReportSummary }>('/reports/summary'),
  getSalesChart: () => fetchJson<{ success: boolean; chartData: { date: string; revenue: number; orders: number }[] }>('/reports/sales-chart'),
  getTopProducts: () => fetchJson<{ success: boolean; topProducts: { product_name: string; total_sold: number; total_revenue: number; total_profit: number }[] }>('/reports/top-products'),
  getPaymentBreakdown: () => fetchJson<{ success: boolean; modes: { payment_mode: string; amount: number; count: number }[] }>('/reports/payment-breakdown'),
};
