import { NextResponse } from "next/server";

function mask(token: string | undefined): string {
  if (!token) return "(undefined)";
  if (token.length <= 8) return "***";
  return `${token.slice(0, 8)}...${token.slice(-4)}`;
}

// ── GET /api/create-payment ──────────────────────────────────────────────
// Diagnostic endpoint — call in browser to check env var state.
// Remove or restrict this route before going to production.
export async function GET() {
  const MP_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "(not set)";

  return NextResponse.json({
    token_present: !!MP_TOKEN,
    token_masked: mask(MP_TOKEN),
    token_length: MP_TOKEN?.length ?? 0,
    base_url: BASE_URL,
    env: process.env.NODE_ENV,
  });
}

// ── POST /api/create-payment ─────────────────────────────────────────────
export async function POST(request: Request) {
  // Read inside handler — avoids stale module-level capture during hot-reload
  const MP_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");

  // ── 1. Token check ───────────────────────────────────────────────────
  console.log("[create-payment] token_present:", !!MP_TOKEN, "| masked:", mask(MP_TOKEN));
  console.log("[create-payment] base_url:", BASE_URL);

  if (!MP_TOKEN) {
    console.error(
      "[create-payment] ❌ MERCADO_PAGO_ACCESS_TOKEN is undefined.\n" +
      "  → Make sure .env.local has MERCADO_PAGO_ACCESS_TOKEN=<your token>\n" +
      "  → Restart the dev server after changing .env.local"
    );
    return NextResponse.json(
      { error: "Configuração de pagamento ausente no servidor" },
      { status: 500 }
    );
  }

  // ── 2. Parse body ────────────────────────────────────────────────────
  let userRef: string;
  try {
    const body = await request.json();
    userRef = typeof body.userRef === "string" && body.userRef.length > 0
      ? body.userRef
      : "anonymous";
    console.log("[create-payment] userRef:", userRef);
  } catch {
    console.error("[create-payment] ❌ Failed to parse request body");
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  // ── 3. Build MP payload ──────────────────────────────────────────────
  const payload = {
    items: [
      {
        id: "premium-plan",
        title: "Plano Premium",
        quantity: 1,
        currency_id: "BRL",
        unit_price: 29.9,
      },
    ],
    external_reference: userRef,
    back_urls: {
      success: `${BASE_URL}/premium/success`,
      failure: `${BASE_URL}/premium/failure`,
      pending: `${BASE_URL}/premium/pending`,
    },
    auto_return: "approved",
    notification_url: `${BASE_URL}/api/webhook/mercadopago`,
  };

  console.log("[create-payment] Sending to MP:", JSON.stringify(payload));

  // ── 4. Call Mercado Pago API ─────────────────────────────────────────
  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_TOKEN}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const rawText = await res.text();
    console.log("[create-payment] MP status:", res.status);
    console.log("[create-payment] MP response:", rawText.slice(0, 1000));

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("[create-payment] ❌ MP response is not JSON:", rawText.slice(0, 200));
      return NextResponse.json(
        { error: "Resposta inválida do Mercado Pago" },
        { status: 502 }
      );
    }

    if (!res.ok) {
      console.error(
        "[create-payment] ❌ MP rejected request\n",
        "  status :", res.status, "\n",
        "  message:", data.message ?? "(none)", "\n",
        "  error  :", data.error   ?? "(none)", "\n",
        "  cause  :", JSON.stringify(data.cause ?? [])
      );
      return NextResponse.json(
        {
          error: "Erro ao criar preferência no Mercado Pago",
          details: data.message ?? data.error ?? `HTTP ${res.status}`,
        },
        { status: res.status }
      );
    }

    console.log("[create-payment] ✅ OK | preference_id:", data.id, "| ref:", userRef);
    return NextResponse.json({ init_point: data.init_point });

  } catch (err) {
    console.error("[create-payment] ❌ Network error:", err);
    return NextResponse.json({ error: "Erro de conexão ao criar pagamento" }, { status: 500 });
  }
}
