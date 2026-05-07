import { Link } from "react-router-dom";
import { ShoppingCart, Heart, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SmartImage from "@/components/SmartImage";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useLanguage } from "@/i18n/LanguageContext";

export interface ProductCardData {
  id: string;
  name_fr: string;
  name_en?: string | null;
  name_de?: string | null;
  name_es?: string | null;
  price: number;
  original_price?: number | null;
  discount_percent?: number;
  stock: number;
  image_url: string | null;
  is_featured?: boolean;
  free_shipping?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  compact?: boolean;
}

const ProductCard = ({ product, compact = false }: ProductCardProps) => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const name =
    (language === "en" && product.name_en) ||
    (language === "de" && product.name_de) ||
    (language === "es" && product.name_es) ||
    product.name_fr;

  const formatPrice = (p: number) =>
    `${new Intl.NumberFormat("fr-FR").format(p)} ${t.common.currency}`;

  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock === 0;
  const hasDiscount = !!(product.discount_percent && product.discount_percent > 0);

  return (
    <article className="group relative bg-card rounded-lg sm:rounded-xl border border-border/70 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      <Link
        to={`/shop/product/${product.id}`}
        className="relative aspect-square block overflow-hidden bg-muted/20"
        aria-label={name}
      >
        <SmartImage
          src={product.image_url}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          fallbackSrc="/placeholder.svg"
          priority={false}
        />

        {/* Discount badge - Jumia style top-left */}
        {hasDiscount && (
          <div className="absolute top-1.5 left-1.5 bg-secondary text-secondary-foreground font-bold text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded">
            -{product.discount_percent}%
          </div>
        )}

        {product.is_featured && !hasDiscount && (
          <div className="absolute top-1.5 left-1.5 bg-accent text-accent-foreground font-bold text-[10px] px-1.5 py-0.5 rounded">
            ★ TOP
          </div>
        )}

        <button
          type="button"
          aria-label={inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className="absolute top-1.5 right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-card/95 backdrop-blur-sm shadow-sm hover:bg-card flex items-center justify-center transition-transform hover:scale-110"
        >
          <Heart
            size={14}
            className={inWishlist ? "fill-destructive text-destructive" : "text-foreground/70"}
          />
        </button>

        {outOfStock && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-foreground/90 text-background text-xs font-semibold">
              Épuisé
            </span>
          </div>
        )}
      </Link>

      <div className={`flex flex-col flex-1 ${compact ? "p-2" : "p-2.5 sm:p-3"}`}>
        <Link to={`/shop/product/${product.id}`} className="flex-1">
          <h3 className="text-foreground hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm leading-snug min-h-[2.5em]">
            {name}
          </h3>
        </Link>

        <div className="mt-1.5 sm:mt-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base lg:text-lg font-bold text-primary tabular-nums">
              {formatPrice(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[11px] sm:text-xs text-muted-foreground line-through tabular-nums">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {product.free_shipping !== false && (
            <p className="mt-1 text-[10px] sm:text-[11px] text-secondary font-medium flex items-center gap-1">
              <Truck size={10} /> Livraison gratuite
            </p>
          )}
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full mt-2 text-xs h-8 sm:h-9"
          onClick={() => addToCart(product.id)}
          disabled={outOfStock}
        >
          <ShoppingCart size={13} />
          <span className="ml-1">{outOfStock ? "Indisponible" : "Ajouter"}</span>
        </Button>
      </div>
    </article>
  );
};

export default ProductCard;
