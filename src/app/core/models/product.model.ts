// ─── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: ProductCategory;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  label: string;       // e.g. "Size", "Color"
  value: string;       // e.g. "M", "Black"
  stock: number;
  priceDelta: number;  // additional cost vs base price
}

export type ProductCategory =
  | 'electronics'
  | 'apparel'
  | 'footwear'
  | 'accessories'
  | 'camping'
  | 'sports';

// ─── API Pagination ──────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

// ─── Product Query Params ────────────────────────────────────────────────────

export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  category?: ProductCategory | null;
  search?: string;
  sortBy?: ProductSortField;
  sortDir?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
}

export type ProductSortField =
  | 'name'
  | 'price'
  | 'rating'
  | 'createdAt';

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  variantId: string | null;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: string;
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  code: string;
  message: string;
}
