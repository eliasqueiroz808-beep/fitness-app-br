import { NextResponse } from "next/server";

const MP_TOKEN  = process.env.MP_ACCESS_TOKEN;
const APP_URL   = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export async function POST(request: Request) {
  if (!MP_TOKEN) {
    return NextResponse.json({ error: "MP_ACCESS_TOKEN não configurado" }, { status: 500 });
  }

  let userRef: string;
  try {
    const body = await request.json();
    userRef = typeof body.userRef === "string" && body.userRef ? body.userRef : "anonymous";
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MP_TOKEN}`,
      },
      body: JSON.stringify({
        items: [
          {
            title: "Protocolo 5% Premium",
            quantity: 1,
            currency_id: "BRL",
            unit_price: 29.9,
          },
        ],
        external_reference: userRef,
        back_urls: {
          success: `${APP_URL}/premium/success`,
          failure: `${APP_URL}/premium/failure`,
          pending: `${APP_URL}/premium/pending`,
        },
        auto_return: "approved",
        notification_url: `${APP_URL}/api/webhook/mercadopago`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[create-payment] MP error:", data);
      return NextResponse.json(
        { error: "Erro ao criar preferência no Mercado Pago", details: data },
        { status: res.status }
      );
    }

    return NextResponse.json({ init_point: data.init_point });
  } catch (err) {
    console.error("[create-payment] Internal error:", err);
    return NextResponse.json({ error: "Erro interno ao criar pagamento" }, { status: 500 });
  }
}
