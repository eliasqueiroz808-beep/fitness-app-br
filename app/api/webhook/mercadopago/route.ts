import { NextResponse } from "next/server";

const MP_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

// ── POST /api/webhook/mercadopago ─────────────────────────────────────────
//
// Receives Mercado Pago payment notifications.
// Verifies payment status directly against MP API (never trusts payload alone).
// Always returns 200 — MP retries on any other status.

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("[webhook/mp] Received:", JSON.stringify(body));

    // MP sends two notification types: "payment" and "merchant_order"
    if (body.type !== "payment" || !body.data?.id) {
      return NextResponse.json({ received: true });
    }

    if (!MP_TOKEN) {
      console.error("[webhook/mp] MERCADO_PAGO_ACCESS_TOKEN not set");
      return NextResponse.json({ received: true });
    }

    const paymentId = String(body.data.id);

    // ── Verify payment status directly with MP API ─────────────────────
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_TOKEN}` },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("[webhook/mp] Failed to fetch payment:", res.status);
      return NextResponse.json({ received: true });
    }

    const payment = await res.json();
    console.log(
      "[webhook/mp] payment_id:", paymentId,
      "status:", payment.status,
      "external_reference:", payment.external_reference
    );

    if (payment.status === "approved" && payment.external_reference) {
      // ── The approval is confirmed. ──────────────────────────────────────
      // In a real app: persist isPremium=true to your DB here using
      // payment.external_reference as the user key.
      //
      // For this app (localStorage-based, no server DB), the success page
      // verifies the payment_id via /api/verify-payment and writes to
      // localStorage. The webhook is a reliability safety net.
      console.log("[webhook/mp] ✅ Premium approved for ref:", payment.external_reference);
    } else {
      console.log("[webhook/mp] Payment not approved:", payment.status);
    }
  } catch (err) {
    console.error("[webhook/mp] Error:", err);
  }

  // Always 200 — MP stops retrying on 2xx
  return NextResponse.json({ received: true });
}
