"use client";

export type FeaturedProduct = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  productUrl: string;
  buttonText: string;
  tag: string;
};

interface FeaturedCarouselProps {
  products: FeaturedProduct[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const items = [...products, ...products];

  const handleBuy = (url: string) => {
    console.log("[shop] Comprar agora →", url);
    if (!url || url === "#") return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative overflow-hidden w-full">
      {/* Side fades */}
      <div
        className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #0D0D0D, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #0D0D0D, transparent)" }}
      />

      {/* Scrolling track */}
      <div
        className="flex gap-4 px-4 pb-2 carousel-track"
        style={{ width: "max-content" }}
      >
        {items.map((product, i) => (
          <div
            key={`${product.id}-${i}`}
            className="featured-card flex-shrink-0 w-52 rounded-3xl overflow-hidden flex flex-col"
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

            {/* Image — white bg, centered, premium feel */}
            <div
              className="mx-3 mt-1 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{
                height: "148px",
                background: "#FFFFFF",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              {product.imageUrl && product.imageUrl !== "COLOCAR_URL_DA_CLOUDINARY_AQUI" ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="product-img h-[130px] w-auto object-contain"
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
                onClick={() => handleBuy(product.productUrl)}
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
        ))}
      </div>
    </div>
  );
}
