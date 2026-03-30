// ─── Client-side Shopify helper ───────────────────────────────────────────
// Calls the internal Next.js API route /api/shopify/products.
// Never contacts myshopify.com directly from the browser.

export type StoreProduct = {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: string;
  imageAlt: string;
  price: string;
  currency: string;
  availableForSale: boolean;
  productUrl: string;
};

export async function fetchShopifyProducts(): Promise<StoreProduct[]> {
  const response = await fetch("/api/shopify/products", {
    method: "GET",
    cache: "no-store",
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("[ShopClient] API error:", json);
    throw new Error(json?.error ?? "Não foi possível carregar os produtos.");
  }

  return (json.products ?? []) as StoreProduct[];
}
