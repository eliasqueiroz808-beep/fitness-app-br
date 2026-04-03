import { NextResponse } from "next/server";

// Shopify headless integration removed — products are now managed in the local catalog.
export async function GET() {
  return NextResponse.json({ error: "Endpoint removido" }, { status: 410 });
}
