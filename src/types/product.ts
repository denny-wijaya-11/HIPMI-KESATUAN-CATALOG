export type ProductCategory = 
  | 'Semua'
  | 'Makanan' 
  | 'Minuman' 
  | 'Fashion' 
  | 'Aksesoris' 
  | 'Perlengkapan' 
  | 'Jasa' 
  | 'Lainnya';

export type ProductRegion =
  | 'Jakarta'
  | 'Kota Bogor'
  | 'Kab. Bogor'
  | 'Kota Depok'
  | 'Kota Tangerang'
  | 'Kota Tangerang Selatan'
  | 'Kab. Tangerang'
  | 'Kota Bekasi'
  | 'Kab. Bekasi'
  | 'Kota Bandung'
  | 'Kab. Bandung'
  | 'Kota Sukabumi'
  | string;

export interface IProductVariant {
  name: string;
  price?: number;
  stock?: number;
}

export interface IProductReview {
  user: string;
  userName: string;
  rating: number;
  comment?: string;
  createdAt: Date | string;
}

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  region: ProductRegion;
  image?: string;
  images?: string[];
  owner?: {
    _id: string;
    name: string;
    email?: string;
    tenantStatus?: string;
  };
  university?: string;
  isFromUniversity?: boolean;
  address?: string;
  rating?: number;
  numReviews?: number;
  reviews?: IProductReview[];
  variants?: IProductVariant[];
  isFeatured?: boolean;
  isHidden?: boolean;
  isPublished?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
