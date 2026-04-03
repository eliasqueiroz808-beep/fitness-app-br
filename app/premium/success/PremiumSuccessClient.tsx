"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { storageSet } from "@/lib/storage";
import { getUserRef } from "@/lib/user-ref";

const PREMIUM_KEY = "fitbr_premium";
const MAX_POLLS = 5;
const POLL_MS = 2500;

type Status = "verifying" | "success" | "pending" | "failed";

export default function PremiumSuccessClient() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("verifying");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    if (typeof window === "undefined") {
      setStatus("failed");
      return;
    }

    const params = new URLSearchParams(window.location.search);

    const paymentId =
      params.get("payment_id") ?? params.get("collection_id") ?? "";
    const mpStatus =
      params.get("status") ?? params.get("collection_status") ?? "";
    const ref = params.get("external_reference") ?? getUserRef() ?? "";

    if (!paymentId) {
      setStatus("failed");
      return;
    }

    let attempts = 0;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function verify(): Promise<void> {
      if (cancelled) return;

      attempts += 1;

      try {
        const res = await fetch(
          `/api/verify-payment?payment_id=${encodeURIComponent(
            paymentId
          )}&ref=${encodeURIComponent(ref)}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (cancelled) return;

        if (data?.isPremium) {
          storageSet(PREMIUM_KEY, {
            isPremium: true,
            activatedAt: new Date().toISOString(),
            paymentId,
          });

          setStatus("success");

          timeoutId = setTimeout(() => {
            router.push("/profile");
          }, 2500);

          return;
        }

        if (attempts < MAX_POLLS) {
          timeoutId = setTimeout(verify, POLL_MS);
        } else if (mpStatus === "pending" || data?.status === "pending") {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } catch {
        if (cancelled) return;

        if (attempts < MAX_POLLS) {
          timeoutId = setTimeout(verify, POLL_MS);
        } else {
          setStatus("failed");
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-5">
        {status === "verifying" && (
          <>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center">
              <div className="w-7 h-7 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-text-primary font-bold">Confirmando pagamento…</p>
            <p className="text-text-muted text-sm">
              Aguarde, isso pode levar alguns segundos.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl"
              style={{
                background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
                boxShadow: "0 0 28px rgba(255,150,50,0.45)",
                border: "1px solid rgba(255,150,50,0.3)",
              }}
            >
              👑
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary">
                Premium Ativo!
              </h1>
              <p className="text-sm text-text-secondary mt-2">
                Pagamento confirmado. Redirecionando para o perfil…
              </p>
            </div>
          </>
        )}

        {status === "pending" && (
          <>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-4xl">
              ⏳
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary">
                Pagamento em análise
              </h1>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                Seu pagamento está sendo processado. O Premium será ativado
                automaticamente assim que for confirmado pelo Mercado Pago.
              </p>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-3 rounded-2xl gradient-red text-white text-sm font-bold"
            >
              Voltar ao app
            </button>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-4xl">
              ❌
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary">
                Não foi possível confirmar
              </h1>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                O pagamento não foi identificado. Se você foi cobrado, entre em
                contato com o suporte informando o comprovante.
              </p>
            </div>
            <button
              onClick={() => router.push("/profile")}
              className="w-full py-3 rounded-2xl gradient-red text-white text-sm font-bold"
            >
              Voltar ao app
            </button>
          </>
        )}
      </div>
    </div>
  );
}