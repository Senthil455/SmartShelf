const express = require('express');
const router = express.Router();
const db = require('../db');

// --- AUTH & STORE ENDPOINTS ---

// Login / Demo Switcher
router.post('/auth/login', (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Direct role-based quick demo login or email lookup
    let user;
    if (role) {
      user = db.prepare('SELECT * FROM users WHERE role = ? LIMIT 1').get(role);
    } else if (email) {
      user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    }

    if (!user) {
      user = db.prepare('SELECT * FROM users WHERE role = "owner" LIMIT 1').get();
    }

    const store = db.prepare('SELECT * FROM stores WHERE id = ?').get(user.store_id || 1);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      store,
      token: `smartshelf-token-${user.id}-${Date.now()}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Store Profile & Settings
router.get('/store', (req, res) => {
  try {
    const store = db.prepare('SELECT * FROM stores WHERE id = 1').get();
    res.json({ success: true, store });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/store', (req, res) => {
  try {
    const { name, owner_name, phone, email, address, gstin, upi_id, currency } = req.body;
    db.prepare(`
      UPDATE stores 
      SET name = ?, owner_name = ?, phone = ?, email = ?, address = ?, gstin = ?, upi_id = ?, currency = ?
      WHERE id = 1
    `).run(name, owner_name, phone, email, address, gstin, upi_id, currency || '₹');

    const updated = db.prepare('SELECT * FROM stores WHERE id = 1').get();
    res.json({ success: true, store: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/store/upgrade-plan', (req, res) => {
  try {
    const { plan } = req.body;
    db.prepare('UPDATE stores SET plan = ? WHERE id = 1').run(plan);
    const updated = db.prepare('SELECT * FROM stores WHERE id = 1').get();
    res.json({ success: true, message: `Upgraded to ${plan} plan successfully!`, store: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- PRODUCT & INVENTORY ENDPOINTS ---

router.get('/products', (req, res) => {
  try {
    const { search, category, filter } = req.query;
    let query = 'SELECT * FROM products WHERE store_id = 1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR local_name LIKE ? OR barcode LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (filter === 'low_stock') {
      query += ' AND stock_quantity <= min_stock_alert';
    } else if (filter === 'expiring_soon') {
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      query += ' AND expiry_date >= ? AND expiry_date <= ?';
      params.push(today, futureDateStr);
    } else if (filter === 'expired') {
      const today = new Date().toISOString().split('T')[0];
      query += ' AND expiry_date < ?';
      params.push(today);
    }

    query += ' ORDER BY id DESC';

    const products = db.prepare(query).all(...params);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/products', (req, res) => {
  try {
    const { name, local_name, barcode, category, unit, purchase_price, selling_price, stock_quantity, min_stock_alert, expiry_date, batch_number } = req.body;

    const result = db.prepare(`
      INSERT INTO products (store_id, name, local_name, barcode, category, unit, purchase_price, selling_price, stock_quantity, min_stock_alert, expiry_date, batch_number)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      local_name || null,
      barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      category || 'General',
      unit || 'pcs',
      Number(purchase_price) || 0,
      Number(selling_price) || 0,
      Number(stock_quantity) || 0,
      Number(min_stock_alert) || 10,
      expiry_date || null,
      batch_number || `BATCH-${Date.now().toString().slice(-4)}`
    );

    const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, local_name, barcode, category, unit, purchase_price, selling_price, stock_quantity, min_stock_alert, expiry_date, batch_number } = req.body;

    db.prepare(`
      UPDATE products 
      SET name = ?, local_name = ?, barcode = ?, category = ?, unit = ?, purchase_price = ?, selling_price = ?, stock_quantity = ?, min_stock_alert = ?, expiry_date = ?, batch_number = ?
      WHERE id = ? AND store_id = 1
    `).run(
      name,
      local_name,
      barcode,
      category,
      unit,
      Number(purchase_price),
      Number(selling_price),
      Number(stock_quantity),
      Number(min_stock_alert),
      expiry_date,
      batch_number,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json({ success: true, product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM products WHERE id = ? AND store_id = 1').run(id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/products/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT DISTINCT category FROM products WHERE store_id = 1 AND category IS NOT NULL').all();
    res.json({ success: true, categories: categories.map(c => c.category) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- BILLING & POS SALES ENDPOINTS ---

router.post('/sales', (req, res) => {
  const transaction = db.transaction((saleData) => {
    const {
      customerId,
      customerName,
      customerPhone,
      items,
      subtotal,
      taxAmount,
      discountAmount,
      totalAmount,
      paymentMode,
      cashReceived,
      changeReturned,
      notes
    } = saleData;

    // Generate unique invoice number
    const count = db.prepare('SELECT COUNT(*) as count FROM sales').get().count;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Payment status
    const paymentStatus = paymentMode === 'due' ? 'pending' : 'paid';

    // Insert sale
    const saleResult = db.prepare(`
      INSERT INTO sales (store_id, invoice_number, customer_id, customer_name, customer_phone, subtotal, tax_amount, discount_amount, total_amount, payment_mode, payment_status, cash_received, change_returned, notes)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoiceNumber,
      customerId || null,
      customerName || 'Walk-in Customer',
      customerPhone || '',
      Number(subtotal),
      Number(taxAmount || 0),
      Number(discountAmount || 0),
      Number(totalAmount),
      paymentMode,
      paymentStatus,
      Number(cashReceived || totalAmount),
      Number(changeReturned || 0),
      notes || ''
    );

    const saleId = saleResult.lastInsertRowid;

    // Insert sale items & deduct product inventory
    const insertItem = db.prepare(`
      INSERT INTO sale_items (sale_id, product_id, product_name, unit, quantity, unit_price, purchase_price, total_price, profit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStock = db.prepare(`
      UPDATE products
      SET stock_quantity = stock_quantity - ?
      WHERE id = ?
    `);

    items.forEach(item => {
      const profit = (Number(item.price) - Number(item.purchase_price || 0)) * Number(item.quantity);
      insertItem.run(
        saleId,
        item.id,
        item.name,
        item.unit || 'pcs',
        Number(item.quantity),
        Number(item.price),
        Number(item.purchase_price || 0),
        Number(item.price) * Number(item.quantity),
        profit
      );

      if (item.id) {
        updateStock.run(Number(item.quantity), item.id);
      }
    });

    // Update customer stats if customer selected
    if (customerId) {
      if (paymentMode === 'due') {
        db.prepare(`
          UPDATE customers 
          SET total_purchases = total_purchases + ?, credit_due = credit_due + ?
          WHERE id = ?
        `).run(Number(totalAmount), Number(totalAmount), customerId);
      } else {
        db.prepare(`
          UPDATE customers 
          SET total_purchases = total_purchases + ?
          WHERE id = ?
        `).run(Number(totalAmount), customerId);
      }
    }

    return { saleId, invoiceNumber };
  });

  try {
    const result = transaction(req.body);
    const fullSale = db.prepare('SELECT * FROM sales WHERE id = ?').get(result.saleId);
    const saleItems = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(result.saleId);

    res.json({
      success: true,
      message: 'Sale completed successfully',
      sale: { ...fullSale, items: saleItems }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sales', (req, res) => {
  try {
    const sales = db.prepare(`
      SELECT s.*, 
        (SELECT COUNT(*) FROM sale_items WHERE sale_id = s.id) as item_count 
      FROM sales s 
      WHERE store_id = 1 
      ORDER BY s.id DESC 
      LIMIT 100
    `).all();

    res.json({ success: true, sales });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/sales/:id', (req, res) => {
  try {
    const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(req.params.id);
    if (!sale) return res.status(404).json({ success: false, message: 'Sale not found' });

    const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(sale.id);
    res.json({ success: true, sale: { ...sale, items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- CUSTOMERS & KHATA (UDHAAR) ENDPOINTS ---

router.get('/customers', (req, res) => {
  try {
    const customers = db.prepare('SELECT * FROM customers WHERE store_id = 1 ORDER BY credit_due DESC, total_purchases DESC').all();
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/customers', (req, res) => {
  try {
    const { name, phone, address, credit_due } = req.body;
    const result = db.prepare(`
      INSERT INTO customers (store_id, name, phone, address, credit_due)
      VALUES (1, ?, ?, ?, ?)
    `).run(name, phone || '', address || '', Number(credit_due || 0));

    const newCust = db.prepare('SELECT * FROM customers WHERE id = ?').get(result.lastInsertRowid);
    res.json({ success: true, customer: newCust });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/customers/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address, credit_due } = req.body;
    db.prepare(`
      UPDATE customers
      SET name = ?, phone = ?, address = ?, credit_due = ?
      WHERE id = ? AND store_id = 1
    `).run(name, phone, address, Number(credit_due || 0), id);

    const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
    res.json({ success: true, customer: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/customers/:id/pay-due', (req, res) => {
  const transaction = db.transaction(({ customerId, amount, paymentMode, notes }) => {
    const payAmt = Number(amount);
    db.prepare(`
      INSERT INTO customer_payments (store_id, customer_id, amount, payment_mode, notes)
      VALUES (1, ?, ?, ?, ?)
    `).run(customerId, payAmt, paymentMode || 'cash', notes || 'Khata Payment');

    db.prepare(`
      UPDATE customers
      SET credit_due = MAX(0, credit_due - ?)
      WHERE id = ?
    `).run(payAmt, customerId);

    return db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId);
  });

  try {
    const updated = transaction({
      customerId: req.params.id,
      amount: req.body.amount,
      paymentMode: req.body.paymentMode,
      notes: req.body.notes
    });
    res.json({ success: true, message: 'Payment recorded successfully', customer: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- SUPPLIERS & PURCHASE ORDERS ENDPOINTS ---

router.get('/suppliers', (req, res) => {
  try {
    const suppliers = db.prepare('SELECT * FROM suppliers WHERE store_id = 1 ORDER BY id DESC').all();
    res.json({ success: true, suppliers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/suppliers', (req, res) => {
  try {
    const { name, contact_person, phone, address, balance_due } = req.body;
    const result = db.prepare(`
      INSERT INTO suppliers (store_id, name, contact_person, phone, address, balance_due)
      VALUES (1, ?, ?, ?, ?, ?)
    `).run(name, contact_person || '', phone || '', address || '', Number(balance_due || 0));

    const supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(result.lastInsertRowid);
    res.json({ success: true, supplier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/suppliers/purchases', (req, res) => {
  const transaction = (purchaseData) => {
    const { supplierId, supplierName, billNumber, totalAmount, amountPaid, items, notes } = purchaseData;
    const balance = Number(totalAmount) - Number(amountPaid || 0);

    const purchaseRes = db.prepare(`
      INSERT INTO purchases (store_id, supplier_id, supplier_name, bill_number, total_amount, amount_paid, status, notes)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      supplierId || null,
      supplierName,
      billNumber || `PUR-${Date.now().toString().slice(-5)}`,
      Number(totalAmount),
      Number(amountPaid || 0),
      balance <= 0 ? 'paid' : 'due',
      notes || ''
    );

    // If supplier selected, update supplier total purchases and balance due
    if (supplierId) {
      db.prepare(`
        UPDATE suppliers
        SET total_purchases = total_purchases + ?, balance_due = balance_due + ?
        WHERE id = ?
      `).run(Number(totalAmount), balance, supplierId);
    }

    // Increase product stock if items provided
    if (items && Array.isArray(items)) {
      const updateStock = db.prepare('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?');
      items.forEach(item => {
        if (item.productId && item.quantity) {
          updateStock.run(Number(item.quantity), item.productId);
        }
      });
    }

    return purchaseRes.lastInsertRowid;
  };

  try {
    const purchaseId = db.transaction(transaction)(req.body);
    res.json({ success: true, message: 'Purchase logged and stock updated', purchaseId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/suppliers/purchases', (req, res) => {
  try {
    const purchases = db.prepare('SELECT * FROM purchases WHERE store_id = 1 ORDER BY id DESC').all();
    res.json({ success: true, purchases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- EXPENSES ENDPOINTS ---

router.get('/expenses', (req, res) => {
  try {
    const expenses = db.prepare('SELECT * FROM expenses WHERE store_id = 1 ORDER BY date DESC, id DESC').all();
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/expenses', (req, res) => {
  try {
    const { category, description, amount, payment_mode, date } = req.body;
    const result = db.prepare(`
      INSERT INTO expenses (store_id, category, description, amount, payment_mode, date)
      VALUES (1, ?, ?, ?, ?, ?)
    `).run(
      category || 'Other',
      description || '',
      Number(amount),
      payment_mode || 'cash',
      date || new Date().toISOString().split('T')[0]
    );

    const expense = db.prepare('SELECT * FROM expenses WHERE id = ?').get(result.lastInsertRowid);
    res.json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/expenses/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM expenses WHERE id = ? AND store_id = 1').run(req.params.id);
    res.json({ success: true, message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
