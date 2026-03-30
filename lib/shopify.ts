const SHOP_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN!;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-10";

const endpoint = `https://${SHOP_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function fetchShopifyProducts() {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            featuredImage {
              url
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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || data.errors) {
    console.error("SHOPIFY ERROR:", data);
    throw new Error("Erro ao buscar produtos");
  }

  return data.data.products.edges.map((e: any) => e.node);
}