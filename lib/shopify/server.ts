// ─── Server-only: Shopify Storefront API client ───────────────────────────
// Imported ONLY inside app/api/* routes. Never runs in the browser.

import type { ShopifyProduct, ShopifyCollection } from "./types";

// ─── Hardened config ───────────────────────────────────────────────────────
// Env vars override at runtime; hardcoded values are the safe fallback.
const STORE_DOMAIN   = (process.env.SHOPIFY_STORE_DOMAIN   ?? "emporiodosnaturais-iyb.myshopify.com").trim();
const ACCESS_TOKEN   = (process.env.SHOPIFY_STOREFRONT_TOKEN ?? "f162b333e29057829268fca3292f5766").trim();
const API_VERSION    = (process.env.SHOPIFY_API_VERSION     ?? "2024-01").trim();
const ENDPOINT       = `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`;

// ─── Core fetch ────────────────────────────────────────────────────────────
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  console.log("[Shopify] POST →", ENDPOINT);
  console.log("[Shopify] Variables:", JSON.stringify(variables ?? {}));

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });
  } catch (networkErr) {
    console.error("[Shopify] Falha de rede:", networkErr);
    throw new Error("Falha de rede ao conectar com a Shopify");
  }

  console.log("[Shopify] HTTP status:", res.status);

  if (!res.ok) {
    const body = await res.text().catch(() => "(sem corpo)");
    console.error("[Shopify] Corpo do erro:", body);
    throw new Error(`Shopify respondeu com status ${res.status}: ${body.slice(0, 200)}`);
  }

  let json: { data?: T; errors?: { message: string }[] };
  try {
    json = await res.json();
  } catch {
    throw new Error("Resposta da Shopify não é JSON válido");
  }

  console.log("[Shopify] Resposta completa:", JSON.stringify(json).slice(0, 500));

  if (json.errors?.length) {
    console.error("[Shopify] Erros GraphQL:", JSON.stringify(json.errors));
    throw new Error(json.errors[0]?.message ?? "Erro GraphQL da Shopify");
  }

  if (!json.data) {
    throw new Error("Shopify retornou resposta sem campo 'data'");
  }

  return json.data;
}

// ─── Raw GraphQL types ─────────────────────────────────────────────────────
interface RawProduct {
  id: string;
  title: string;
  handle: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
}

interface RawCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: { url: string } | null;
  products: { edges: { node: RawProduct }[] };
}

// ─── Normalizer ────────────────────────────────────────────────────────────
function normalizeProduct(raw: RawProduct): ShopifyProduct {
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    description: "",
    productType: "",
    tags: [],
    featuredImage: raw.featuredImage ? { url: raw.featuredImage.url, altText: null } : null,
    images: raw.featuredImage ? [{ url: raw.featuredImage.url, altText: null }] : [],
    variants: [],
    price: raw.priceRange.minVariantPrice,
    compareAtPrice: null,
    availableForSale: true,
  };
}

// ─── Queries ───────────────────────────────────────────────────────────────
const PRODUCTS_QUERY = `
  {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!, $perCol: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image { url }
          products(first: $perCol) {
            edges {
              node {
                id
                title
                handle
                featuredImage { url }
                priceRange {
                  minVariantPrice { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// ─── Public server functions ───────────────────────────────────────────────
export async function serverFetchProducts(count = 12): Promise<ShopifyProduct[]> {
  // Products query is parameterless (hardcoded first:12) — avoids variable injection issues
  const data = await shopifyFetch<{ products: { edges: { node: RawProduct }[] } }>(
    PRODUCTS_QUERY
  );
  return data.products.edges.map((e) => normalizeProduct(e.node)).slice(0, count);
}

export async function serverFetchCollections(
  count = 6,
  productsPerCollection = 6
): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { edges: { node: RawCollection }[] } }>(
    COLLECTIONS_QUERY,
    { first: count, perCol: productsPerCollection }
  );

  return data.collections.edges.map((e) => ({
    id: e.node.id,
    title: e.node.title,
    handle: e.node.handle,
    description: e.node.description,
    image: e.node.image ? { url: e.node.image.url, altText: null } : null,
    products: e.node.products.edges.map((p) => normalizeProduct(p.node)),
  }));
}
