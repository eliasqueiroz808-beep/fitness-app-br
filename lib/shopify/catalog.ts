export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  price: string;
  currency: string;
  availableForSale: boolean;
  productUrl: string;
  tags?: string[];
  featured?: boolean;
};

export const SHOP_CATALOG: CatalogProduct[] = [
  {
    id: "whey-protein-wpc-900g-beijinho",
    title: "WHEY PROTEIN WPC - Pouch 900g Beijinho",
    description: "Proteína concentrada para apoio à recuperação e rotina de treinos.",
    image: "COLOCAR_URL_DA_CLOUDINARY_AQUI",
    imageAlt: "WHEY PROTEIN WPC - Pouch 900g Beijinho",
    price: "167.45",
    currency: "BRL",
    availableForSale: true,
    productUrl: "https://emporiodosnaturais-iyb.myshopify.com/products/whey-protein-wpc-pouch-900g-beijinho",
    tags: ["whey", "proteina", "massa muscular"],
    featured: true
  }
];
