# Inventory Management System - Project Context

## Purpose

Build a web-based inventory management system that allows users to:

- Register products
- Register product inputs (stock entries)
- Register product outputs (stock withdrawals)
- Register sales (only records of the sale, no payment gateway required)

This application will help track inventory levels and movement efficiently.

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router, Server Components)
- **UI Components:** ShadCN
- **Styling:** Tailwind CSS
- **Backend as a Service:** Supabase (PostgreSQL, Auth, Realtime, Edge Functions if needed)

---

## Core Features

### 1. Product Registration
- Fields: name, SKU/code, description, category (optional), initial stock (optional), price, image (optional)
- CRUD operations (Create, Read, Update, Delete)

### 2. Product Inputs
- Register restocking entries
- Fields: product, quantity, date, note (optional)
- Should increase the product's stock level

### 3. Product Outputs
- Register stock withdrawals (e.g. internal use, loss)
- Fields: product, quantity, date, reason/note
- Should decrease the product's stock level

### 4. Sales Registration
- Register sales (no actual payment processing)
- Fields: product, quantity, price per unit, total, date, customer name (optional), note (optional)
- Should decrease the product's stock level
- Payment status: pending/paid (optional, for record keeping only)

---

## Functional Notes

- No payment integration required. Only sales logging.
- All operations should update the stock level in real-time.
- User authentication can be added using Supabase Auth (optional for MVP).
- Admin dashboard layout preferred (sidebar navigation, table-based listings, modals/forms for registration).
- Prioritize performance and clean, modern UI.

---

## Optional / Future Features

- Inventory reporting (e.g., total stock value, most sold products)
- Low-stock alerts
- Basic user roles (admin, viewer)
