import { Suspense } from "react";
import PremiumSuccessClient from "./PremiumSuccessClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-text-primary font-bold">Carregando...</p>
      </div>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PremiumSuccessClient />
    </Suspense>
  );
}