// ─── Client-side Shopify service ──────────────────────────────────────────
// Calls internal Next.js API routes — never touches Shopify directly from the browser.
// Shopify credentials live server-side in .env.local → lib/shopify/server.ts

export type {
  ShopifyImage,
  ShopifyMoneyV2,
  ShopifyVariant,
  ShopifyProduct,
  ShopifyCollection,
} from "./shopify/types";

import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyMoneyV2,
  ProductsResponse,
  CollectionsResponse,
  ApiErrorResponse,
} from "./shopify/types";

// ─── Internal fetch helper ─────────────────────────────────────────────────
async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(path);

  const json = await res.json().catch(() => {
    throw new Error("Resposta inválida do servidor");
  });

  if (!res.ok) {
    const body = json as ApiErrorResponse;
    throw new Error(body.error ?? `Erro do servidor: ${res.status}`);
  }

  return json as T;
}

// ─── Public client functions ───────────────────────────────────────────────
export async function fetchProducts(count = 12): Promise<ShopifyProduct[]> {
  const data = await apiFetch<ProductsResponse>(`/api/shop/products?count=${count}`);
  return data.products;
}

export async function fetchCollections(
  count = 6,
  productsPerCollection = 6
): Promise<ShopifyCollection[]> {
  const data = await apiFetch<CollectionsResponse>(
    `/api/shop/collections?count=${count}&perCollection=${productsPerCollection}`
  );
  return data.collections;
}

// ─── Price formatter ───────────────────────────────────────────────────────
export function formatPrice(money: ShopifyMoneyV2): string {
  const val = parseFloat(money.amount);
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
