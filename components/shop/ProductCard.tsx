"use client";

import { type FeaturedProduct } from "@/components/shop/FeaturedCarousel";

interface ProductCardProps {
  product: FeaturedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleBuy = () => {
    console.log("[shop] Comprar agora →", product.productUrl);
    if (!product.productUrl || product.productUrl === "#") return;
    window.open(product.productUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="featured-card flex flex-col rounded-3xl overflow-hidden w-full"
      style={{
        background: "linear-gradient(160deg, #1E1E1E 0%, #161616 100%)",
        border: "1px solid #2E2E2E",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      {/* Tag */}
      <div className="px-3 pt-3 flex justify-end">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(230,57,70,0.15)",
            color: "#E63946",
            border: "1px solid rgba(230,57,70,0.25)",
          }}
        >
          {product.tag}
        </span>
      </div>

      {/* Image — white bg premium */}
      <div
        className="mx-3 mt-1 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          height: "140px",
          background: "#FFFFFF",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        {product.imageUrl && product.imageUrl !== "COLOCAR_URL_DA_CLOUDINARY_AQUI" ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="product-img h-[122px] w-auto object-contain"
            style={{ transition: "transform 0.35s ease" }}
            loading="lazy"
          />
        ) : (
          <div className="text-4xl">🛍️</div>
        )}
      </div>

      {/* Content */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1.5 flex-1">
        <p className="text-xs font-bold text-text-primary leading-snug line-clamp-2">
          {product.title}
        </p>
        <p className="text-[10px] text-text-secondary leading-snug line-clamp-2">
          {product.subtitle}
        </p>

        <button
          onClick={handleBuy}
          disabled={!product.productUrl || product.productUrl === "#"}
          className="buy-btn mt-auto w-full py-2 rounded-xl text-white text-xs font-bold tracking-wide disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #E63946 0%, #C1121F 100%)",
            boxShadow: "0 4px 14px rgba(230,57,70,0.4)",
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
          }}
        >
          {product.buttonText}
        </button>
      </div>
    </div>
  );
}
