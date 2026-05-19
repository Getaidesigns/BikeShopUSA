// src/types/index.ts

export interface ShopSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  services: { service: { name: string; slug: string } }[];
  bikeTypes: { bikeType: { name: string; slug: string } }[];
  brands: { brand: { name: string; slug: string } }[];
}

export interface ShopDetail extends ShopSummary {
  email: string | null;
  accessories: { accessoryType: { name: string; slug: string } }[];
}

export interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

export interface FilterOptions {
  services: FilterOption[];
  bikeTypes: FilterOption[];
  brands: FilterOption[];
  accessories: FilterOption[];
  states: string[];
}

export interface SearchParams {
  q?: string;
  city?: string;
  state?: string;
  zip?: string;
  services?: string | string[];
  bikeTypes?: string | string[];
  brands?: string | string[];
  page?: string;
  limit?: string;
}

export interface PaginatedShops {
  shops: ShopSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ClaimFormData {
  claimantName: string;
  claimantEmail: string;
  claimantPhone?: string;
  message?: string;
}
