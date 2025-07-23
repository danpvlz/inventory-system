-- Inventory Management System Schema

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    sku text UNIQUE NOT NULL,
    description text,
    category text,
    price numeric(12,2) NOT NULL,
    stock integer DEFAULT 0,
    image_url text,
    created_at timestamptz DEFAULT now()
);

-- Movements Table (Unified Inputs, Outputs, Sales, Initial)
CREATE TABLE IF NOT EXISTS movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    type text CHECK (type IN ('initial', 'input', 'output', 'sale')) NOT NULL,
    quantity integer NOT NULL,
    date date NOT NULL,
    note text,
    reason text,
    customer_name text,
    price numeric(12,2),
    payment_status text CHECK (payment_status IN ('pending', 'paid')),
    created_at timestamptz DEFAULT now()
); 