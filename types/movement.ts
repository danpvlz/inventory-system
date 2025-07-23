export type MovementType = 'initial' | 'input' | 'output' | 'sale';

export interface Movement {
  id: string;
  product_id: string;
  type: MovementType;
  quantity: number;
  date: string;
  note?: string;
  reason?: string;
  customer_name?: string;
  price?: number;
  payment_status?: 'pending' | 'paid';
  created_at: string;
} 