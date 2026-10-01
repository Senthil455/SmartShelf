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

function seedInitialData() {
  const storeCount = db.prepare('SELECT COUNT(*) as count FROM stores').get().count;
  if (storeCount > 0) return;

  console.log('Seeding initial production data for SmartShelf...');

  // 1. Insert Demo Store
  const insertStore = db.prepare(`
    INSERT INTO stores (name, owner_name, phone, email, address, gstin, upi_id, currency, plan)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const storeResult = insertStore.run(
    'Lakshmi Supermarket & Provisions',
    'Ramesh Kumar & Sathish',
    '+91 98765 43210',
    'owner@smartshelf.local',
    'No. 42, Gandhi Road, T. Nagar, Chennai - 600017',
    '33AAAAA0000A1Z5',
    'smartshelf@upi',
    '₹',
    'premium'
  );
  const storeId = storeResult.lastInsertRowid;

  // 2. Insert Default User
  db.prepare(`
    INSERT INTO users (store_id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(storeId, 'Ramesh Kumar (Store Owner)', 'admin@smartshelf.com', 'admin123', 'owner');

  db.prepare(`
    INSERT INTO users (store_id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(storeId, 'Sathish (Cashier)', 'cashier@smartshelf.com', 'cashier123', 'cashier');

  // 3. Insert Realistic Products (with Indian groceries, barcodes, units, and dates relative to now)
  const today = new Date();
  const addDays = (days) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const productsData = [
    // Grains & Essentials
    { name: 'Aashirvaad Shudh Chakki Atta (5kg)', local_name: 'ஆசீர்வாத் கோதுமை மாவு 5கிலோ', barcode: '8901030383854', category: 'Grains & Flours', unit: 'packet', purchase_price: 240, selling_price: 295, stock_quantity: 42, min_stock_alert: 10, expiry_date: addDays(180), batch: 'BATCH-ATT-09' },
    { name: 'India Gate Basmati Rice Feast (1kg)', local_name: 'பாசுமதி அரிசி 1கிலோ', barcode: '8901725181145', category: 'Grains & Flours', unit: 'packet', purchase_price: 110, selling_price: 145, stock_quantity: 28, min_stock_alert: 8, expiry_date: addDays(250), batch: 'BATCH-RIC-01' },
    { name: 'Tata Salt Vacuum Evaporated (1kg)', local_name: 'டாடா உப்பு 1கிலோ', barcode: '8901030005176', category: 'Grains & Flours', unit: 'packet', purchase_price: 22, selling_price: 28, stock_quantity: 85, min_stock_alert: 20, expiry_date: addDays(360), batch: 'BATCH-SLT-44' },
    { name: 'Toor Dal Premium Unpolished (1kg)', local_name: 'துவரம் பருப்பு 1கிலோ', barcode: '8901234567890', category: 'Grains & Flours', unit: 'kg', purchase_price: 135, selling_price: 168, stock_quantity: 12, min_stock_alert: 15, expiry_date: addDays(120), batch: 'BATCH-DAL-12' },
    { name: 'Fortune Sunlite Refined Sunflower Oil (1L)', local_name: 'சூரியகாந்தி எண்ணெய் 1லிட்டர்', barcode: '8906007281024', category: 'Oil & Ghee', unit: 'packet', purchase_price: 128, selling_price: 152, stock_quantity: 36, min_stock_alert: 10, expiry_date: addDays(190), batch: 'BATCH-OIL-88' },
    { name: 'GRB Pure Ghee Jar (200ml)', local_name: 'ஜி.ஆர்.பி சுத்தமான நெய் 200மி.லி', barcode: '8906014410110', category: 'Oil & Ghee', unit: 'jar', purchase_price: 145, selling_price: 175, stock_quantity: 18, min_stock_alert: 5, expiry_date: addDays(150), batch: 'BATCH-GHEE-05' },

    // Dairy & Fresh Items (Items with urgent expiry to test alerts)
    { name: 'Aavin Green Magic Milk (500ml)', local_name: 'ஆவின் பால் 500மி.லி', barcode: '8908001001011', category: 'Dairy & Fresh', unit: 'packet', purchase_price: 21, selling_price: 24, stock_quantity: 45, min_stock_alert: 15, expiry_date: addDays(2), batch: 'AV-DAIRY-01' },
    { name: 'Amul Salted Butter (100g)', local_name: 'அமுல் வெண்ணெய் 100கி', barcode: '8901262010052', category: 'Dairy & Fresh', unit: 'pcs', purchase_price: 50, selling_price: 58, stock_quantity: 4, min_stock_alert: 8, expiry_date: addDays(6), batch: 'AM-BUT-33' },
    { name: 'Milky Mist Paneer (200g)', local_name: 'மில்கி மிஸ்ட் பனீர் 200கி', barcode: '8906017840013', category: 'Dairy & Fresh', unit: 'packet', purchase_price: 92, selling_price: 115, stock_quantity: 9, min_stock_alert: 10, expiry_date: addDays(4), batch: 'MM-PAN-19' },
    { name: 'Modern Family Bread (400g)', local_name: 'மாடர்ன் ரொட்டி 400கி', barcode: '8901512001014', category: 'Bakery', unit: 'pcs', purchase_price: 36, selling_price: 45, stock_quantity: 14, min_stock_alert: 5, expiry_date: addDays(3), batch: 'MOD-BRD-81' },
    { name: 'Curd Farm Fresh Pouch (500g)', local_name: 'பண்ணை புதிய தயிர் 500கி', barcode: '8901512999011', category: 'Dairy & Fresh', unit: 'packet', purchase_price: 30, selling_price: 36, stock_quantity: 3, min_stock_alert: 10, expiry_date: addDays(1), batch: 'CRD-EXP-02' },

    // Snacks, Biscuits & Chocolates
    { name: 'Parle-G Gold Glucose Biscuits (1kg)', local_name: 'பார்லே-ஜி பிஸ்கட் 1கிலோ', barcode: '8901719101012', category: 'Snacks & Biscuits', unit: 'packet', purchase_price: 88, selling_price: 110, stock_quantity: 32, min_stock_alert: 10, expiry_date: addDays(210), batch: 'PG-GLD-72' },
    { name: 'Britannia Good Day Cashew Cookies (200g)', local_name: 'பிரிட்டானியா குட் டே 200கி', barcode: '8901063012011', category: 'Snacks & Biscuits', unit: 'packet', purchase_price: 38, selling_price: 50, stock_quantity: 48, min_stock_alert: 12, expiry_date: addDays(180), batch: 'BRI-GD-10' },
    { name: 'Maggi 2-Minute Masala Noodles (Pack of 4)', local_name: 'மேகி 2 நிமிட நூடுல்ஸ் 4-பேக்', barcode: '8901058863413', category: 'Snacks & Biscuits', unit: 'packet', purchase_price: 51, selling_price: 60, stock_quantity: 50, min_stock_alert: 15, expiry_date: addDays(150), batch: 'MAG-NDL-44' },
    { name: 'Cadbury Dairy Milk Silk Chocolate (60g)', local_name: 'கேட்பரி சில்க் சாக்லேட் 60கி', barcode: '7622201440014', category: 'Snacks & Biscuits', unit: 'pcs', purchase_price: 70, selling_price: 85, stock_quantity: 6, min_stock_alert: 12, expiry_date: addDays(90), batch: 'CAD-SLK-12' },
    { name: 'Lays Classic Salted Potato Chips (50g)', local_name: 'லேஸ் உருளைக்கிழங்கு சிப்ஸ்', barcode: '8901491101015', category: 'Snacks & Biscuits', unit: 'packet', purchase_price: 16, selling_price: 20, stock_quantity: 35, min_stock_alert: 15, expiry_date: addDays(75), batch: 'LAY-SLT-99' },

    // Beverages & Tea/Coffee
    { name: 'AVT Premium Dust Tea (500g)', local_name: 'ஏவிடி தேயிலை தூள் 500கி', barcode: '8901138801021', category: 'Beverages', unit: 'packet', purchase_price: 165, selling_price: 198, stock_quantity: 24, min_stock_alert: 8, expiry_date: addDays(300), batch: 'AVT-TEA-03' },
    { name: 'Bru Instant Coffee Powder Pouch (100g)', local_name: 'ப்ரூ உடனடி காபி தூள் 100கி', barcode: '8901030701023', category: 'Beverages', unit: 'packet', purchase_price: 140, selling_price: 165, stock_quantity: 19, min_stock_alert: 6, expiry_date: addDays(270), batch: 'BRU-COF-51' },
    { name: 'Horlicks Classic Malt Jar (500g)', local_name: 'ஹார்லிக்ஸ் மால்ட் ஜார் 500கி', barcode: '8901571001018', category: 'Beverages', unit: 'jar', purchase_price: 240, selling_price: 285, stock_quantity: 11, min_stock_alert: 5, expiry_date: addDays(240), batch: 'HOR-MLT-22' },

    // Personal & Home Care
    { name: 'Dettol Original Germ Protection Soap (125g)', local_name: 'டெட்டால் அசல் சோப் 125கி', barcode: '8901396101017', category: 'Personal & Home Care', unit: 'pcs', purchase_price: 44, selling_price: 55, stock_quantity: 40, min_stock_alert: 12, expiry_date: addDays(400), batch: 'DET-SOP-77' },
    { name: 'Surf Excel Quick Wash Detergent Powder (1kg)', local_name: 'சர்ப் எக்செல் துவைக்கும் பொடி 1கிலோ', barcode: '8901030612015', category: 'Personal & Home Care', unit: 'packet', purchase_price: 142, selling_price: 165, stock_quantity: 22, min_stock_alert: 8, expiry_date: addDays(450), batch: 'SRF-EXC-41' },
    { name: 'Vim Dishwash Gel Lemon (500ml)', local_name: 'விம் பாத்திரம் கழுவும் ஜெல் 500மி.லி', barcode: '8901030501012', category: 'Personal & Home Care', unit: 'bottle', purchase_price: 105, selling_price: 125, stock_quantity: 2, min_stock_alert: 8, expiry_date: addDays(350), batch: 'VIM-GEL-18' }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (store_id, name, local_name, barcode, category, unit, purchase_price, selling_price, stock_quantity, min_stock_alert, expiry_date, batch_number)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  productsData.forEach(p => {
    insertProduct.run(storeId, p.name, p.local_name, p.barcode, p.category, p.unit, p.purchase_price, p.selling_price, p.stock_quantity, p.min_stock_alert, p.expiry_date, p.batch);
  });

  // 4. Insert Customers with Khata (Udhaar) Balances
  const insertCustomer = db.prepare(`
    INSERT INTO customers (store_id, name, phone, address, total_purchases, credit_due)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const cust1 = insertCustomer.run(storeId, 'Ravi Kumar (Teacher)', '+91 98765 43210', 'Block 4, Flat 12, T. Nagar', 7450, 650);
  const cust2 = insertCustomer.run(storeId, 'Sunita Devi', '+91 91234 56780', '14, Cross Street, Postal Colony', 1870, 0);
  const cust3 = insertCustomer.run(storeId, 'Amit Verma (Driver)', '+91 99887 76655', '3/10, MGR Nagar 2nd Street', 3620, 1200);
  const cust4 = insertCustomer.run(storeId, 'Neha Sharma', '+91 90900 00090', '52, North Usman Road', 1280, 0);
  const cust5 = insertCustomer.run(storeId, 'Anil Kumar (Electrician)', '+91 98401 23456', '8, South Boag Road', 2150, 350);

  // 5. Insert Suppliers
  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (store_id, name, contact_person, phone, address, total_purchases, balance_due)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertSupplier.run(storeId, 'Metro Wholesale Traders', 'Gowtham Raj', '+91 94440 12345', 'Koyambedu Wholesale Market, Chennai', 45200, 8500);
  insertSupplier.run(storeId, 'Aavin Milk Distribution Hub', 'Murugan S.', '+91 98410 98765', 'Anna Salai Dairy Depot', 18200, 1200);
  insertSupplier.run(storeId, 'HUL Direct Retail Agency', 'Praveen Nair', '+91 97900 45678', 'Guindy Industrial Estate', 32000, 0);

  // 6. Insert Recent Sales (spanning the last few days to populate dashboards & charts)
  const insertSale = db.prepare(`
    INSERT INTO sales (store_id, invoice_number, customer_id, customer_name, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_mode, payment_status, cash_received, change_returned, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSaleItem = db.prepare(`
    INSERT INTO sale_items (sale_id, product_id, product_name, unit, quantity, unit_price, purchase_price, total_price, profit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Sample historical sales for analytics
  const pastDates = [
    { daysAgo: 6, inv: 'INV-2026-001', cust: 'Walk-in Customer', phone: '', sub: 840, tax: 25, disc: 0, tot: 865, mode: 'cash' },
    { daysAgo: 5, inv: 'INV-2026-002', cust: 'Ravi Kumar (Teacher)', phone: '+91 98765 43210', sub: 1250, tax: 35, disc: 35, tot: 1250, mode: 'due' },
    { daysAgo: 4, inv: 'INV-2026-003', cust: 'Walk-in Customer', phone: '', sub: 620, tax: 18, disc: 0, tot: 638, mode: 'upi' },
    { daysAgo: 3, inv: 'INV-2026-004', cust: 'Sunita Devi', phone: '+91 91234 56780', sub: 1870, tax: 55, disc: 25, tot: 1900, mode: 'cash' },
    { daysAgo: 2, inv: 'INV-2026-005', cust: 'Amit Verma (Driver)', phone: '+91 99887 76655', sub: 980, tax: 28, disc: 0, tot: 1008, mode: 'upi' },
    { daysAgo: 1, inv: 'INV-2026-006', cust: 'Walk-in Customer', phone: '', sub: 2150, tax: 65, disc: 50, tot: 2165, mode: 'cash' },
    { daysAgo: 0, inv: 'INV-2026-007', cust: 'Neha Sharma', phone: '+91 90900 00090', sub: 1280, tax: 38, disc: 18, tot: 1300, mode: 'upi' },
    { daysAgo: 0, inv: 'INV-2026-008', cust: 'Walk-in Customer', phone: '', sub: 460, tax: 12, disc: 0, tot: 472, mode: 'cash' }
  ];

  pastDates.forEach((s) => {
    const saleDate = new Date(today);
    saleDate.setDate(saleDate.getDate() - s.daysAgo);
    saleDate.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 59));
    const dateStr = saleDate.toISOString().replace('T', ' ').substring(0, 19);

    const res = insertSale.run(
      storeId,
      s.inv,
      s.cust.includes('Ravi') ? cust1.lastInsertRowid : s.cust.includes('Sunita') ? cust2.lastInsertRowid : null,
      s.cust,
      s.phone,
      s.sub,
      s.tax,
      s.disc,
      s.tot,
      s.mode,
      s.mode === 'due' ? 'pending' : 'paid',
      s.tot,
      0,
      dateStr
    );

    // Add sample items
    insertSaleItem.run(res.lastInsertRowid, 1, 'Aashirvaad Shudh Chakki Atta (5kg)', 'packet', 1, 295, 240, 295, 55);
    insertSaleItem.run(res.lastInsertRowid, 7, 'Aavin Green Magic Milk (500ml)', 'packet', 2, 24, 21, 48, 6);
    insertSaleItem.run(res.lastInsertRowid, 3, 'Tata Salt Vacuum Evaporated (1kg)', 'packet', 1, 28, 22, 28, 6);
  });

  // 7. Insert Store Expenses
  const insertExpense = db.prepare(`
    INSERT INTO expenses (store_id, category, description, amount, payment_mode, date)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertExpense.run(storeId, 'Rent', 'Monthly Shop Front Rent', 12000, 'bank_transfer', addDays(-10));
  insertExpense.run(storeId, 'Electricity', 'TNEB Commercial Power Bill', 3200, 'upi', addDays(-5));
  insertExpense.run(storeId, 'Tea & Snacks', 'Daily tea for staff and delivery boys', 350, 'cash', addDays(0));
  insertExpense.run(storeId, 'Packaging', 'Biodegradable carry bags and paper pouches', 950, 'cash', addDays(-2));
  insertExpense.run(storeId, 'Staff Salary', 'Part-time assistant wage advance', 4000, 'cash', addDays(-3));

  // 8. Log Initial Activity
  db.prepare(`
    INSERT INTO audit_logs (store_id, action, user, details)
    VALUES (?, ?, ?, ?)
  `).run(storeId, 'STORE_SETUP', 'System', 'SmartShelf production environment initialized with demo store and catalog');

  console.log('Production database initialized successfully.');
}

initSchema();

module.exports = db;
