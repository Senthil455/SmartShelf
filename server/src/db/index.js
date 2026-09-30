const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../data/smartshelf.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize schema
function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      gstin TEXT,
      upi_id TEXT,
      currency TEXT DEFAULT '₹',
      plan TEXT DEFAULT 'premium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      local_name TEXT,
      barcode TEXT,
      category TEXT NOT NULL,
      unit TEXT DEFAULT 'pcs',
      purchase_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      stock_quantity REAL DEFAULT 0,
      min_stock_alert REAL DEFAULT 10,
      expiry_date TEXT,
      batch_number TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      phone TEXT,
      address TEXT,
      total_purchases REAL DEFAULT 0,
      credit_due REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customer_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      payment_mode TEXT DEFAULT 'cash',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      address TEXT,
      total_purchases REAL DEFAULT 0,
      balance_due REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER,
      customer_name TEXT DEFAULT 'Walk-in Customer',
      customer_phone TEXT,
      subtotal REAL NOT NULL,
      tax_amount REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      total_amount REAL NOT NULL,
      payment_mode TEXT DEFAULT 'cash',
      payment_status TEXT DEFAULT 'paid',
      cash_received REAL DEFAULT 0,
      change_returned REAL DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      unit TEXT DEFAULT 'pcs',
      quantity REAL NOT NULL,
      unit_price REAL NOT NULL,
      purchase_price REAL DEFAULT 0,
      total_price REAL NOT NULL,
      profit REAL DEFAULT 0,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      supplier_id INTEGER,
      supplier_name TEXT NOT NULL,
      bill_number TEXT,
      total_amount REAL NOT NULL,
      amount_paid REAL DEFAULT 0,
      status TEXT DEFAULT 'paid',
      purchase_date TEXT DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      category TEXT NOT NULL,
      description TEXT,
      amount REAL NOT NULL,
      payment_mode TEXT DEFAULT 'cash',
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER DEFAULT 1,
      action TEXT NOT NULL,
      user TEXT DEFAULT 'System',
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  seedInitialData();
}
