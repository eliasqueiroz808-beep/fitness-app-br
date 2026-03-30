import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
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
        back_urls: {
          success: "http://localhost:3000/premium/success",
          failure: "http://localhost:3000/premium/error",
          pending: "http://localhost:3000/premium/pending",
        },
        auto_return: "approved",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Erro ao criar checkout", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      init_point: data.init_point,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno ao criar checkout" },
      { status: 500 }
    );
  }
}
