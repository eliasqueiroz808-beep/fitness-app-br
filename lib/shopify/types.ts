// ─── Shared Shopify types ─────────────────────────────────────────────────
// Used by both server (API routes) and client (ShopScreen, ProductCard)

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  tags: string[];
  featuredImage: ShopifyImage | null;
  images: ShopifyImage[];
  variants: ShopifyVariant[];
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
  products: ShopifyProduct[];
}

// ─── Internal API response envelopes ──────────────────────────────────────
export interface ProductsResponse {
  products: ShopifyProduct[];
}

export interface CollectionsResponse {
  collections: ShopifyCollection[];
}

export interface ApiErrorResponse {
  error: string;
}
