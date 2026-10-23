export type OrderStatus = 
  | 'Menunggu Pembayaran' 
  | 'Diproses' 
  | 'Dikirim' 
  | 'Selesai' 
  | 'Dibatalkan';

export type PaymentMethod = 'manual_transfer';

export interface IOrderItem {
  _id?: string;
  product: {
    _id?: string;
    name?: string;
    image?: string;
  } | string;
  quantity: number;
  variantName?: string;
  price: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes?: string;
}

export interface IPaymentInstruction {
  provider: string;
  accountNumber: string;
  accountName: string;
}

export interface IOrder {
  _id: string;
  orderNumber?: string;
  buyer: {
    _id: string;
    name: string;
    email?: string;
  } | string;
  tenant: {
    _id: string;
    name: string;
    email?: string;
  } | string;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentMethod: PaymentMethod;
  paymentInstructions?: IPaymentInstruction[];
  paymentProof?: string | null;
  status: OrderStatus;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export interface IDashboardMetrics {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  salesChart: {
    date: string;
    day: string;
    revenue: number;
    orders: number;
  }[];
}
