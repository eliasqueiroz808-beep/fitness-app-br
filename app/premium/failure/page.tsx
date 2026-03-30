"use client";

import { useRouter } from "next/navigation";

export default function PremiumFailurePage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-5">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-4xl">
          ❌
        </div>
        <div>
          <h1 className="text-2xl font-black text-text-primary">Pagamento recusado</h1>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed">
            Seu pagamento não foi processado. Nenhuma cobrança foi realizada. Tente novamente com outro cartão.
          </p>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="w-full py-3 rounded-2xl gradient-red text-white text-sm font-bold"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
