// order.model.ts

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  createdAt: string;   // ISO date string
  items: OrderItem[];
}
