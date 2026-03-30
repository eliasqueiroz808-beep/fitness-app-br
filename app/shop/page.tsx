"use client";

import { useState, useEffect, useCallback } from "react";
import AppShell from "@/components/layout/AppShell";
import ProductCard from "@/components/shop/ProductCard";
import { fetchShopifyProducts, type StoreProduct } from "@/lib/shopify";
import { loadPremium, activatePremiumMock, type PremiumState } from "@/lib/premium";
import PremiumCard from "@/components/premium/PremiumCard";

// ─── Skeleton ──────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full aspect-square bg-dark-muted" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-dark-muted rounded w-2/3" />
        <div className="h-2.5 bg-dark-muted rounded w-full" />
        <div className="h-3 bg-dark-muted rounded w-1/2" />
      </div>
    </div>
  );
}

function SkeletonFeatured() {
  return (
    <div className="flex-shrink-0 w-44 bg-dark-card border border-dark-border rounded-2xl overflow-hidden animate-pulse">
      <div className="w-full h-32 bg-dark-muted" />
      <div className="p-3 space-y-2">
        <div className="h-2.5 bg-dark-muted rounded w-3/4" />
        <div className="h-3 bg-dark-muted rounded w-1/2" />
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [products,        setProducts]        = useState<StoreProduct[]>([]);
  const [search,          setSearch]          = useState("");
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [premium,         setPremium]         = useState<PremiumState>({ isPremium: false, activatedAt: null });
  const [showPremiumCard, setShowPremiumCard] = useState(false);
  const [mounted,         setMounted]         = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShopifyProducts();
      setProducts(data);
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e);
      console.error("[ShopPage] Erro ao carregar:", raw);
      setError("Não foi possível carregar os produtos da loja no momento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPremium(loadPremium());
    setMounted(true);
    load();
  }, [load]);

  if (!mounted) return null;

  const filtered = search.trim()
    ? products.filter((p) => p.title.toLowerCase().includes(search.trim().toLowerCase()))
    : products;
  const featuredProducts = filtered.slice(0, 5);

  return (
    <AppShell>
      {/* Header */}
      <section className="px-4 pt-10 pb-4">
        <p className="text-text-secondary text-sm">Empório dos Naturais</p>
        <h1 className="text-2xl font-black text-text-primary tracking-tight mt-0.5">Loja</h1>
        <p className="text-xs text-text-muted mt-1">
          Suplementos e alimentos naturais para sua evolução
        </p>
      </section>

      {/* Search bar */}
      <section className="px-4 mb-4">
        <div className="flex items-center gap-3 bg-dark-card border border-dark-border rounded-2xl px-4 py-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-text-muted shrink-0">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-text-muted text-lg leading-none">×</button>
          )}
        </div>
      </section>

      {/* Error state */}
      {error && (
        <section className="px-4 mb-4">
          <div className="bg-dark-card border border-brand-red/30 rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-red/10 flex items-center justify-center text-2xl">⚠️</div>
            <div>
              <p className="text-sm font-semibold text-text-primary">Não foi possível carregar</p>
              <p className="text-xs text-text-secondary mt-1">{error}</p>
            </div>
            <button
              onClick={load}
              className="px-6 py-2.5 gradient-red text-white text-sm font-bold rounded-xl active:opacity-90 transition-opacity"
            >
              Tentar novamente
            </button>
          </div>
        </section>
      )}

      {/* Featured / horizontal scroll */}
      {!error && (
        <section className="mb-4">
          <div className="px-4 mb-3">
            <h2 className="text-base font-bold text-text-primary">Destaques</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonFeatured key={i} />)
              : featuredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} featured />
                ))}
          {!loading && featuredProducts.length === 0 && (
            <p className="text-sm text-text-muted py-4">Nenhum destaque encontrado</p>
          )}
          </div>
        </section>
      )}

      {/* Product grid */}
      {!error && (
        <section className="px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-text-primary">Todos os Produtos</h2>
            {!loading && (
              <span className="text-xs text-text-muted">
                {filtered.length} {filtered.length === 1 ? "item" : "itens"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <span className="text-4xl">🛒</span>
              <p className="text-sm text-text-secondary">
                {search ? `Nenhum produto encontrado para "${search}"` : "Nenhum produto encontrado"}
              </p>
              {search && (
                <button onClick={() => setSearch("")} className="text-xs text-brand-red font-semibold">
                  Limpar busca
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Premium section */}
      <section className="px-4 mb-6">
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg, #1A0A08 0%, #120606 60%, #1A1A1A 100%)",
            border: "1px solid rgba(230,57,70,0.25)",
            boxShadow: "0 0 30px rgba(230,57,70,0.08)",
          }}
        >
          <div
            className="h-0.5 w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #E63946 40%, #FF8C42 60%, transparent 100%)",
            }}
          />
          <div className="px-5 pt-5 pb-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl"
                style={{
                  background: "linear-gradient(135deg, #2A1A10 0%, #1E1208 100%)",
                  border: "1px solid rgba(255,150,50,0.25)",
                  boxShadow: "0 0 14px rgba(255,150,50,0.3)",
                }}
              >
                👑
              </div>
              <div>
                <p className="text-sm font-black text-text-primary leading-tight">
                  {premium.isPremium ? "Desconto Premium Ativo" : "Desconto Exclusivo Premium"}
                </p>
                <p className="text-xs text-text-secondary mt-0.5 leading-snug">
                  {premium.isPremium
                    ? "Você tem 10% de desconto em todos os produtos da loja"
                    : "Assine o Premium e ganhe 10% de desconto em toda a loja"}
                </p>
              </div>
            </div>

            {premium.isPremium ? (
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-3 py-2">
                <span className="text-yellow-400 text-sm">✓</span>
                <span className="text-xs text-yellow-400 font-semibold">
                  Desconto aplicado automaticamente no checkout
                </span>
              </div>
            ) : (
              <button
                onClick={() => setShowPremiumCard(true)}
                className="w-full py-3 rounded-xl gradient-red text-white text-sm font-bold active:opacity-90 transition-opacity"
              >
                Assinar Premium →
              </button>
            )}
          </div>
        </div>
      </section>

      {showPremiumCard && (
        <PremiumCard
          state={premium}
          onActivate={() => setPremium(activatePremiumMock())}
          onClose={() => setShowPremiumCard(false)}
        />
      )}
    </AppShell>
  );
}
