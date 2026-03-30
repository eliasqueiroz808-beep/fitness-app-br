"use client";

import { type StoreProduct } from "@/lib/shopify";

interface ProductCardProps {
  product: StoreProduct;
  /** Compact variant for the horizontal "Destaques" row */
  featured?: boolean;
}

function formatBRL(amount: string, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency || "BRL",
  }).format(Number(amount));
}

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const handleBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.productUrl, "_blank", "noopener,noreferrer");
  };

  if (featured) {
    return (
      <div className="flex-shrink-0 w-44 bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-left">
        <div className="w-full h-32 bg-dark-muted relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.imageAlt || product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🛍️</div>
          )}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-xs font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                Esgotado
              </span>
            </div>
          )}
        </div>

        <div className="p-3 space-y-2">
          <p className="text-xs text-text-secondary line-clamp-2 leading-tight">{product.title}</p>
          <span className="text-sm font-black text-text-primary">
            {formatBRL(product.price, product.currency)}
          </span>
          <button
            onClick={handleBuy}
            disabled={!product.availableForSale}
            className="w-full py-1.5 gradient-red text-white text-xs font-bold rounded-lg active:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product.availableForSale ? "Comprar" : "Esgotado"}
          </button>
        </div>
      </div>
    );
  }

  // ── Grid card ────────────────────────────────────────────────────────────
  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden text-left w-full">
      <div className="w-full aspect-square bg-dark-muted relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt || product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
        )}
        {!product.availableForSale && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-xs font-bold text-white bg-black/60 px-2 py-1 rounded-full">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <p className="text-xs text-text-secondary line-clamp-2 leading-snug">{product.title}</p>
        <span className="text-sm font-black text-text-primary">
          {formatBRL(product.price, product.currency)}
        </span>
        <button
          onClick={handleBuy}
          disabled={!product.availableForSale}
          className="w-full py-2 gradient-red text-white text-xs font-bold rounded-xl active:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {product.availableForSale ? "Comprar agora" : "Esgotado"}
        </button>
      </div>
    </div>
  );
}
