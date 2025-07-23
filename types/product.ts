export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category?: string;
  price: number;
  stock?: number;
  image_url?: string;
  created_at: string;
} 