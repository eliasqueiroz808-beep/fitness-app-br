"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/layout/AppShell";
import ProductCard from "@/components/shop/ProductCard";
import FeaturedCarousel, { type FeaturedProduct } from "@/components/shop/FeaturedCarousel";
import { loadPremium, type PremiumState } from "@/lib/premium";
import PremiumCard from "@/components/premium/PremiumCard";

// ── Destaques (carrossel) ─────────────────────────────────────────────────
const FEATURED_PRODUCTS: FeaturedProduct[] = [
  {
    id: "creatina-wod-300g",
    title: "Creatina Monohidratada 300g WOD Nutrition",
    subtitle: "5g por dose • 60 doses • pura sem sabor",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774894394/imagem_2026-03-30_151226908_q4ktoa.png",
    productUrl: "https://empóriodosnaturais.com/products/creatina-monohidratada-300g-wod-nutrition-5g-por-dose-60-doses-pura-sem-sabor",
    buttonText: "Comprar agora",
    tag: "Mais vendido",
  },
  {
    id: "cafeina-global-200mg",
    title: "Cafeína 200mg Global Suplementos",
    subtitle: "90 cápsulas • energia e foco",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774894446/imagem_2026-03-30_151319462_xvvfjs.png",
    productUrl: "https://empóriodosnaturais.com/products/cafeina-200mg-90-capsulas-global-suplementos",
    buttonText: "Comprar agora",
    tag: "Energia",
  },
  {
    id: "my-shake-diet-chocolate",
    title: "My Shake Diet Chocolate WOD Nutrition",
    subtitle: "Shake para emagrecimento • sabor chocolate",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774894494/imagem_2026-03-30_151407916_yz87et.png",
    productUrl: "https://empóriodosnaturais.com/products/my-shake-diet-chocolate-shake-para-emagrecimento-wod-nutrition",
    buttonText: "Comprar agora",
    tag: "Emagrecimento",
  },
  {
    id: "vitasoft-az-global",
    title: "Vitasoft AZ Multivitamínico",
    subtitle: "60 cápsulas • suporte diário",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774894558/imagem_2026-03-30_151511701_kro93k.png",
    productUrl: "https://empóriodosnaturais.com/products/vitasoft-az-multivitaminico-60-capsulas-global-suplementos",
    buttonText: "Comprar agora",
    tag: "Vitaminas",
  },
  {
    id: "melatonina-gummies-global",
    title: "Melatonina Gummies Global Suplementos",
    subtitle: "60 gomas sabor maracujá",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774894619/imagem_2026-03-30_151612076_bad5ip.png",
    productUrl: "https://empóriodosnaturais.com/products/melatonina-gummies-60-gomas-maracuja-global-suplementos",
    buttonText: "Comprar agora",
    tag: "Sono",
  },
];

// ── Todos os Produtos (grid) ──────────────────────────────────────────────
const ALL_PRODUCTS: FeaturedProduct[] = [
  {
    id: "ozempic-natural",
    title: "Ozempic Natural 500mg",
    subtitle: "60 cápsulas • suplemento alimentar",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774895988/imagem_2026-03-30_153900102_uiv2mu.png",
    productUrl: "https://empóriodosnaturais.com/products/ozempic-natural-500mg-60-capsulas-suplemento-alimentar",
    buttonText: "Comprar agora",
    tag: "Emagrecimento",
  },
  {
    id: "colageno-wod-500g",
    title: "Colágeno Hidrolisado 500g",
    subtitle: "Abacaxi com hortelã • WOD Care Nutrition",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774896064/imagem_2026-03-30_154017482_wh6vzr.png",
    productUrl: "https://empóriodosnaturais.com/products/colageno-hidrolisado-500g-abacaxi-com-hortela-wod-care-nutrition",
    buttonText: "Comprar agora",
    tag: "Beleza",
  },
  {
    id: "whey-beijinho-900g",
    title: "Whey Protein WPC 900g Beijinho",
    subtitle: "Pouch • alta proteína",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774896534/imagem_2026-03-30_154806415_sthid3.png",
    productUrl: "https://empóriodosnaturais.com/products/whey-protein-wpc-pouch-900g-beijinho",
    buttonText: "Comprar agora",
    tag: "Proteína",
  },
  {
    id: "whey-vitafor-baunilha",
    title: "Whey Protein WPC 900g Baunilha",
    subtitle: "Vitafor • 21g de proteína",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774896584/imagem_2026-03-30_154857135_hpm5t7.png",
    productUrl: "https://empóriodosnaturais.com/products/whey-protein-wpc-900g-baunilha-vitafor-21g-de-proteina",
    buttonText: "Comprar agora",
    tag: "Proteína",
  },
  {
    id: "whey-vitafor-morango",
    title: "Whey Protein WPC 900g Morango",
    subtitle: "Vitafor • 21g de proteína",
    imageUrl: "https://res.cloudinary.com/dsetxj6at/image/upload/v1774896643/imagem_2026-03-30_154955951_dofrqg.png",
    productUrl: "https://empóriodosnaturais.com/products/whey-protein-wpc-900g-morango-vitafor-21g-de-proteina",
    buttonText: "Comprar agora",
    tag: "Proteína",
  },
];

// ─────────────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [search,          setSearch]          = useState("");
  const [premium,         setPremium]         = useState<PremiumState>({ isPremium: false, activatedAt: null });
  const [showPremiumCard, setShowPremiumCard] = useState(false);
  const [mounted,         setMounted]         = useState(false);

  useEffect(() => {
    setPremium(loadPremium());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const q = search.trim().toLowerCase();
  const filtered = q
    ? ALL_PRODUCTS.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q)
      )
    : ALL_PRODUCTS;

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

      {/* Featured carousel */}
      <section className="mb-6">
        <div className="px-4 mb-3 flex items-center gap-2">
          <h2 className="text-base font-bold text-text-primary">Destaques</h2>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(230,57,70,0.12)", color: "#E63946" }}
          >
            {FEATURED_PRODUCTS.length} produtos
          </span>
        </div>
        <FeaturedCarousel products={FEATURED_PRODUCTS} />
      </section>

      {/* Product grid */}
      <section className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-text-primary">Todos os Produtos</h2>
          <span className="text-xs text-text-muted">
            {filtered.length} {filtered.length === 1 ? "item" : "itens"}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">🛒</span>
            <p className="text-sm text-text-secondary">
              Nenhum produto encontrado para &ldquo;{search}&rdquo;
            </p>
            <button onClick={() => setSearch("")} className="text-xs text-brand-red font-semibold">
              Limpar busca
            </button>
          </div>
        )}
      </section>

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
              background: "linear-gradient(90deg, transparent 0%, #E63946 40%, #FF8C42 60%, transparent 100%)",
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
          onClose={() => setShowPremiumCard(false)}
        />
      )}
    </AppShell>
  );
}
