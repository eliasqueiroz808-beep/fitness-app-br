import { NextResponse } from "next/server";
import { isApproved } from "@/lib/server/premium-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");

  if (!ref) {
    return NextResponse.json({ error: "Missing ref" }, { status: 400 });
  }

  return NextResponse.json({ isPremium: isApproved(ref) });
}
