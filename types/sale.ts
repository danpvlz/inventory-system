export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  date: string;
  customer_name?: string;
  note?: string;
  payment_status: 'pending' | 'paid';
  created_at: string;
} 