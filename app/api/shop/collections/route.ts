import { NextResponse } from "next/server";
import { serverFetchCollections } from "@/lib/shopify/server";
import type { CollectionsResponse, ApiErrorResponse } from "@/lib/shopify/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count    = Math.min(parseInt(searchParams.get("count") ?? "6", 10), 20);
  const perCol   = Math.min(parseInt(searchParams.get("perCollection") ?? "6", 10), 20);

  try {
    const collections = await serverFetchCollections(count, perCol);
    const body: CollectionsResponse = { collections };
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    console.error("[/api/shop/collections]", message);
    const body: ApiErrorResponse = { error: message };
    return NextResponse.json(body, { status: 500 });
  }
}
