import { NextResponse } from "next/server";
import { serverFetchProducts } from "@/lib/shopify/server";
import type { ProductsResponse, ApiErrorResponse } from "@/lib/shopify/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const count = Math.min(parseInt(searchParams.get("count") ?? "12", 10), 50);

  try {
    const products = await serverFetchProducts(count);
    const body: ProductsResponse = { products };
    return NextResponse.json(body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erro interno";
    console.error("[/api/shop/products]", message);
    const body: ApiErrorResponse = { error: message };
    return NextResponse.json(body, { status: 500 });
  }
}
