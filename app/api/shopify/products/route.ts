import { NextResponse } from "next/server";

// ─── Credentials stay server-side only ────────────────────────────────────
const SHOPIFY_DOMAIN           = "emporiodosnaturais-iyb.myshopify.com";
const SHOPIFY_STOREFRONT_TOKEN = "f162b333e29057829268fca3292f5766";
const SHOPIFY_ENDPOINT         = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

const PRODUCTS_QUERY = `
  query GetProducts {
    products(first: 20) {
      edges {
        node {
          id
          title
          handle
          description
          availableForSale
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function GET() {
  try {
    console.log("[Shopify/server] POST →", SHOPIFY_ENDPOINT);

    const response = await fetch(SHOPIFY_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
      cache: "no-store",
    });

    const rawText = await response.text();
    console.log("[Shopify/server] status:", response.status);
    console.log("[Shopify/server] body:", rawText);

    if (!response.ok) {
      console.error("[Shopify/server] HTTP error:", response.status, rawText);
      return NextResponse.json(
        { error: "Shopify request failed", status: response.status, details: rawText },
        { status: 500 }
      );
    }

    const json = JSON.parse(rawText);

    if (json.errors?.length) {
      console.error("[Shopify/server] GraphQL errors:", json.errors);
      return NextResponse.json(
        { error: "Shopify GraphQL error", details: json.errors },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = (json.data?.products?.edges ?? []).map(({ node }: any) => {
      const firstImage   = node.images?.edges?.[0]?.node;
      const firstVariant = node.variants?.edges?.[0]?.node;
      return {
        id:               node.id,
        title:            node.title            ?? "",
        handle:           node.handle           ?? "",
        description:      node.description      ?? "",
        image:            firstImage?.url        ?? "",
        imageAlt:         firstImage?.altText    ?? node.title ?? "",
        price:            firstVariant?.price?.amount       ?? "0.00",
        currency:         firstVariant?.price?.currencyCode ?? "BRL",
        availableForSale: node.availableForSale  ?? false,
        productUrl:       `https://emporiodosnaturais-iyb.myshopify.com/products/${node.handle ?? ""}`,
      };
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("[Shopify/server] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error while loading Shopify products" },
      { status: 500 }
    );
  }
}
