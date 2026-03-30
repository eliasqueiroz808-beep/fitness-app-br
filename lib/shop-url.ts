// ── Shop URL helper ────────────────────────────────────────────────────────
//
// Single source of truth for building product URLs.
// Set NEXT_PUBLIC_SHOP_DOMAIN in .env.local to your store's real public domain.
//
// Examples:
//   NEXT_PUBLIC_SHOP_DOMAIN=emporiodosnaturais.com.br
//   NEXT_PUBLIC_SHOP_DOMAIN=emporiodosnaturais-iyb.myshopify.com  (fallback)

const SHOP_DOMAIN =
  process.env.NEXT_PUBLIC_SHOP_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "") ??
  "emporiodosnaturais.com";

/**
 * Returns the full URL for a product handle.
 * Example: shopUrl("creatina-premium") → "https://emporiodosnaturais.com.br/products/creatina-premium"
 */
export function shopUrl(handle: string): string {
  if (!handle || handle === "#") return "#";
  return `https://${SHOP_DOMAIN}/products/${handle}`;
}

/** The store domain currently in use — useful for debugging. */
export const SHOP_BASE = `https://${SHOP_DOMAIN}`;
