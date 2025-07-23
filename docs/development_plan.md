# Development Plan - Inventory Management System

## Overview

This development plan outlines the phases, tasks, and priorities for building a web-based inventory management system using:

- **Next.js 15** (App Router, RSC)
- **ShadCN** for UI components
- **Tailwind CSS** for styling
- **Supabase** for backend (Database, Auth, Storage, Realtime)

---

## 🧱 Project Structure

**Monorepo-style organization:**
- `/app` — Next.js App Router pages
- `/components` — UI components
- `/lib` — utility and service functions (e.g., Supabase client)
- `/types` — TypeScript interfaces/types
- `/db/schema.sql` — optional if using raw SQL for migrations

---

## 📅 Phases & Timeline

### **Phase 1: Setup & Foundations**

- Initialize Next.js 15 project with TypeScript
- Install & configure Tailwind CSS
- Integrate ShadCN and setup base theme
- Setup Supabase project + connect to Next.js
- Create Supabase tables (products, inputs, outputs, sales)
- Create reusable layout (sidebar, navbar)

---

### **Phase 2: Core Modules**

#### **1. Product Registration**
- Product list page (table view)
- Add/edit/delete product form (modal or route)
- Image upload (optional, via Supabase Storage)
- Stock display (initial stock + net movements)

#### **2. Input Registration (Stock Entry)**
- Input list (table)
- Add input form: select product, quantity, date, note
- Adjust product stock accordingly

#### **3. Output Registration (Stock Withdrawal)**
- Output list (table)
- Add output form: select product, quantity, date, reason
- Deduct from stock

#### **4. Sales Registration**
- Sales list (table)
- Add sale form: select product, quantity, price, date, customer, note
- Deduct from stock
- Optional: Payment status (dropdown: pending/paid)

---

### **Phase 3: UX Polish & Features**

- Input validation, error/success messages
- Loading states (skeletons/spinners)
- Pagination or infinite scroll
- Filtering and search (e.g. by product name/date)
- Toast notifications (e.g. "Product added")
- Responsive design

---

### **Phase 4: Authentication & Access Control (Optional)**

- Setup Supabase Auth (email/password)
- Protect routes for authenticated users
- Add logout/login page

---

### **Phase 5: QA, Deployment & Docs**

- Manual QA (bug fixing, test CRUD flows)
- Deploy to Vercel
- Write README.md and internal user guide

---

## 🗂️ Database Tables (Supabase)

### `products`
- id
- name
- sku
- description
- category
- price
- stock (optional, or computed)
- image_url (optional)
- created_at

### `inputs`
- id
- product_id (FK)
- quantity
- date
- note
- created_at

### `outputs`
- id
- product_id (FK)
- quantity
- date
- reason
- created_at

### `sales`
- id
- product_id (FK)
- quantity
- price
- date
- customer_name
- note
- payment_status (pending/paid)
- created_at

---

## ✅ MVP Checklist

- Products module (CRUD)
- Inputs module (Add & track)
- Outputs module (Add & track)
- Sales module (Add & track)
- Stock level updated dynamically
- Responsive UI with Tailwind & ShadCN
- Supabase integration complete

---

## 🧠 Nice to Have

- Charts (e.g. sales trends, stock over time)
- CSV export
- Alerts for low stock
- Admin/user roles
- Dark mode toggle

