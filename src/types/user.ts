export type UserRole = 'admin' | 'tenant' | 'user' | 'operator' | 'developer';

export type TenantStatus = 'none' | 'pending' | 'paid' | 'approved' | 'rejected' | 'suspended' | null;

export type AuthProvider = 'local' | 'google';

export interface ISavedAddress {
  label: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
}

export interface ICartItem {
  product: string; // Product ObjectId or Populated Product
  quantity: number;
}

export interface IPaymentMethodInfo {
  provider: string; // e.g., 'BCA', 'GoPay'
  accountNumber: string;
  accountName: string;
  qrisImage?: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  tenantStatus?: TenantStatus;
  whatsapp?: string;
  lastActive?: Date | string;
  city?: string;
  university?: string;
  isStudent?: boolean;
  address?: string;
  savedAddresses?: ISavedAddress[];
  authProvider?: AuthProvider;
  avatar?: string;
  fcmToken?: string | null;
  wishlist?: string[];
  cart?: ICartItem[];
  paymentMethods?: IPaymentMethodInfo[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface IUserPayload {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  university?: string;
  avatar?: string;
}
