export interface Store {
  id: number;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string;
  gstin: string;
  upi_id: string;
  currency: string;
  plan: 'basic' | 'standard' | 'premium';
  created_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'cashier';
}

export interface Product {
  id: number;
  store_id?: number;
  name: string;
  local_name?: string;
  barcode: string;
  category: string;
  unit: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  expiry_date?: string;
  batch_number?: string;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
  price: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  total_purchases: number;
  credit_due: number;
  created_at?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string;
  phone: string;
  address: string;
  total_purchases: number;
  balance_due: number;
  created_at?: string;
}

export interface SaleItem {
  id?: number;
  sale_id?: number;
  product_id: number;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  purchase_price: number;
  total_price: number;
  profit: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id?: number | null;
  customer_name: string;
  customer_phone?: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  payment_mode: 'cash' | 'upi' | 'card' | 'due';
  payment_status: 'paid' | 'pending' | 'partial';
  cash_received: number;
  change_returned: number;
  notes?: string;
  created_at: string;
  items?: SaleItem[];
  item_count?: number;
}

export interface Expense {
  id: number;
  category: string;
  description: string;
  amount: number;
  payment_mode: string;
  date: string;
  created_at?: string;
}

export interface ReportSummary {
  todaySales: number;
  todayOrders: number;
  allSales: number;
  allOrders: number;
  grossProfit: number;
  totalExpenses: number;
  netProfit: number;
  totalDuePending: number;
  dueCustomersCount: number;
  totalProducts: number;
  inventoryCost: number;
  inventoryValue: number;
  lowStockCount: number;
  expiringCount: number;
}

export interface AlertCounts {
  lowStock: number;
  expired: number;
  expiringIn7: number;
  expiringIn30: number;
  totalAlerts: number;
}
