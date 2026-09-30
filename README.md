# 🛒 SmartShelf — Retail Operating System for Local Indian Kirana Stores
> *"Helping Local Shops Operate Like Modern Supermarkets"*  
> **Entrepreneurship Development Venture Journey**  
> **CEG – Department of Information Science and Technology (IST), 3rd Year**

---

## 🌟 Overview & Market Opportunity
In India, **12–15 Million Kirana & Provision Stores** drive **88–90%** of the country's grocery retail. As the Indian retail market scales from **\$751 Billion towards \$1.5 Trillion**, local retailers face critical daily bottlenecks:
- **Manual Inventory & Calculation Errors**: Slow billing leads to customer queues and lost revenue.
- **Product Expiry Spoilage**: Dairy, bakery, and packaged staples expire unnoticed on shelves.
- **Disconnected Software**: Existing solutions (Zoho, Shopify, SAP) are either too complex, expensive, or lack integrated expiry alerts.

**SmartShelf** solves this with an all-in-one, ultra-fast web operating system uniting:
1. **Lightning-fast Barcode POS Billing** (< 3 seconds per bill)
2. **Dynamic UPI QR Code Generation** on Cashier Screen (GPay, PhonePe, Paytm)
3. **Automated Batch Expiry Radar** (7-day and 30-day proactive alerts)
4. **Customer Khata (Udhaar / Credit) Ledger** with 1-click WhatsApp payment reminders
5. **Supplier & Purchase Order Tracking**
6. **Operating Expense Logger & True Net Profit / Margin Analytics**
7. **80mm Thermal Receipt Generator** with instant native printing & WhatsApp paperless delivery

---

## 🏗️ Production Architecture Blueprint

```
SmartShelf System Architecture
═══════════════════════════════════════════════════════════════════════════
                 [ Local Web Browser / Mobile / Tablet / POS Terminal ]
                                          │
                                 (HTTP / JSON / REST)
                                          │
┌─────────────────────────────────────────▼────────────────────────────────────────┐
│                        NODE.JS EXPRESS SERVER (Port 5000)                        │
├──────────────────────────────────────────────────────────────────────────────────┤
│ • Production Static Asset Server (Vite React SPA)                                │
│ • CORS & Request Sanitization Middleware                                         │
│ • Health & Telemetry Endpoint (/api/health)                                      │
├──────────────────────────────────────────────────────────────────────────────────┤
│                                REST API ROUTING                                  │
│  ├── /api/auth          : Role-based session switching (Owner / Cashier)         │
│  ├── /api/products      : Inventory CRUD, Category & Stock filters               │
│  ├── /api/sales         : Atomic POS Checkout, Stock Deduction & Invoice Gen    │
│  ├── /api/alerts        : Expiry Radar (7d, 30d, Expired) & Low Stock Warning    │
│  ├── /api/customers     : Ledger, Khata Balance & Due Settlement Payments        │
│  ├── /api/suppliers     : Wholesale Vendors & Inbound Purchase Invoices          │
│  ├── /api/expenses      : Daily Shop Operating Outflows (Rent, Wages, Tea, Power)│
│  └── /api/reports       : P&L Statement, Sales Trends, Top SKUs, Mode Breakdown  │
├──────────────────────────────────────────────────────────────────────────────────┤
│                              DATABASE LAYER                                      │
│  • SQLite3 (better-sqlite3) with Write-Ahead Logging (WAL) Mode enabled          │
│  • Foreign Keys & Atomic Transactions                                            │
│  • Auto-migration & Authentic Indian Grocery Seed Catalog                        │
└─────────────────────────────────────────▲────────────────────────────────────────┘
                                          │
                               [ smartshelf.db (WAL) ]
```

---

## 📦 Database Schema Details

The SQLite database (`server/data/smartshelf.db`) is normalized and optimized for high-throughput retail transactions:

1. **`stores`**: Shop profile, proprietor name, address, GSTIN, UPI ID, active tier plan (`basic`, `standard`, `premium`).
2. **`users`**: Multi-role users (`owner`, `cashier`, `manager`).
3. **`products`**: Name, regional/Tamil name, barcode/SKU, category, unit (`kg`, `g`, `ltr`, `packet`, `pcs`), purchase cost, selling price (MRP), current stock quantity, low-stock threshold, expiry date, batch number.
4. **`sales`**: Auto-generated sequential invoice numbers (`INV-YYYY-XXXX`), customer link, subtotal, tax amount (GST), store discounts, grand total, payment mode (`cash`, `upi`, `card`, `due`), payment status, cash tendered & change returned.
5. **`sale_items`**: Line items linked to sales, tracking sold unit price, product cost, quantity, and real-time net profit.
6. **`customers`**: Customer directory, contact phone, total lifetime purchases, and pending Khata credit balance.
7. **`customer_payments`**: Audit ledger tracking repayment installments towards credit balances.
8. **`suppliers`**: Wholesale vendor directory, contact person, phone, lifetime purchase total, and balance due.
9. **`purchases`**: Inbound vendor shipments, invoice numbers, total cost, and amount paid.
10. **`expenses`**: Daily store expenses categorized by Rent, Electricity, Staff Salary, Tea & Snacks, Packaging, Transport, Maintenance.
11. **`audit_logs`**: System audit trail for compliance and inventory adjustments.

---

## 🚀 Running the Production Website & App

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x recommended)
- **npm**: v9.0.0 or higher

### Quick Start (1 Command)
From the project root:
```bash
# Start the full-stack server (automatically serves both API & React Client)
npm start
```

Open your browser at:
- 🌐 **Marketing & Conversion Website**: [http://localhost:5000](http://localhost:5000)
- 🛒 **Live POS Cashier Billing**: [http://localhost:5000/app/pos](http://localhost:5000/app/pos)
- 📊 **Store Dashboard**: [http://localhost:5000/app/dashboard](http://localhost:5000/app/dashboard)
- ⚠️ **Expiry & Low Stock Cockpit**: [http://localhost:5000/app/alerts](http://localhost:5000/app/alerts)
- 👥 **Khata (Udhaar) Ledger**: [http://localhost:5000/app/customers](http://localhost:5000/app/customers)
- 📈 **Business Reports & P&L**: [http://localhost:5000/app/reports](http://localhost:5000/app/reports)
- ❤️ **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Re-building Frontend Bundle
```bash
npm run build
```

---

## 👥 Project Team & Department Accreditation
**College of Engineering, Guindy (CEG)**  
*Department of Information Science and Technology (IST)*  
*3rd Year Venture Journey*

- **K. Gokul** — Roll No: `2024115076`
- **V. Sanjith Kumar** — Roll No: `2024115040`
- **R. Senthil Raja** — Roll No: `2024115080`
- **G. Keerthivaasan** — Roll No: `2024115130`