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
  phone: string; // ✅ add here
  address: string;
  city: string;
  zip: string;
  createdAt: string;
  items: OrderItem[];   // ✅ include items
}
