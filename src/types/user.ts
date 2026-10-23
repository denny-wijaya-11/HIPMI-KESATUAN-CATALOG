export type UserRole = 'admin' | 'tenant' | 'user' | 'operator' | 'developer';

export type TenantStatus = 'pending' | 'active' | 'suspended' | null;

export interface ISavedAddress {
  label: string;
  recipientName: string;
  phoneNumber: string;
  fullAddress: string;
  city: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface ICartItem {
  product: string; // Product ObjectId string
  quantity: number;
  variantName?: string;
  price: number;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  university?: string;
  isStudent?: boolean;
  tenantStatus?: TenantStatus;
  savedAddresses?: ISavedAddress[];
  cart?: ICartItem[];
  wishlist?: string[];
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
