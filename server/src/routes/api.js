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

