"use client";

import type { AssistantProduct } from "@/lib/assistantProducts";

interface AssistantProductCardProps {
  product: AssistantProduct;
}

export default function AssistantProductCard({ product }: AssistantProductCardProps) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #150808 0%, #1A0A08 60%, #1A1A1A 100%)",
        border: "1px solid rgba(230,57,70,0.2)",
      }}
    >
      {/* Header stripe */}
      <div
        className="h-0.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #E63946 40%, #FF8C42 60%, transparent 100%)",
        }}
      />

      <div className="p-4 flex items-center gap-4">
        {/* Product image / placeholder */}
        <div
          className="w-16 h-16 rounded-xl shrink-0 overflow-hidden flex items-center justify-center text-3xl"
          style={{
            background: "linear-gradient(135deg, #2A1208 0%, #1E0E06 100%)",
            border: "1px solid rgba(230,57,70,0.15)",
          }}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>🛍️</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1"
            style={{
              color: "#E63946",
              background: "rgba(230,57,70,0.12)",
            }}
          >
            {product.tag}
          </span>
          <p className="text-sm font-bold text-text-primary truncate">{product.name}</p>
          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{product.description}</p>
          <p className="text-sm font-black text-brand-red mt-1">{product.price}</p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          className="w-full py-2.5 rounded-xl text-sm font-bold text-white active:opacity-80 transition-opacity"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #c0303c 100%)",
          }}
          type="button"
        >
          Ver na Loja →
        </button>
      </div>
    </div>
  );
}
