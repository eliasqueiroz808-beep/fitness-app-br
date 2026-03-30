import { NextResponse } from "next/server";

const MP_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// ── GET /api/verify-payment?payment_id=XXX&ref=USERREF ────────────────────
//
// Queries Mercado Pago directly — no in-memory state needed.
// Works correctly on Vercel serverless (stateless).
//
// Returns: { isPremium: boolean, status: string }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const userRef   = searchParams.get("ref");

  if (!paymentId || !userRef) {
    return NextResponse.json({ error: "payment_id e ref são obrigatórios" }, { status: 400 });
  }

  if (!MP_TOKEN) {
    console.error("[verify-payment] MERCADO_PAGO_ACCESS_TOKEN not set");
    return NextResponse.json({ error: "Configuração ausente" }, { status: 500 });
  }

  try {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
      // Never cache — always get fresh status from MP
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[verify-payment] MP API error:", res.status);
      return NextResponse.json({ isPremium: false, status: "error" });
    }

    const payment = await res.json();
    console.log(
      "[verify-payment] payment_id:", paymentId,
      "status:", payment.status,
      "external_reference:", payment.external_reference
    );

    // Security: verify both payment approval AND that the ref matches
    const approved =
      payment.status === "approved" &&
      payment.external_reference === userRef;

    return NextResponse.json({
      isPremium: approved,
      status: payment.status ?? "unknown",
    });
  } catch (err) {
    console.error("[verify-payment] Internal error:", err);
    return NextResponse.json({ isPremium: false, status: "error" });
  }
}
