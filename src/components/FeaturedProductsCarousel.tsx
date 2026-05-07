import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import SmartImage from "@/components/SmartImage";

interface Product {
  id: string;
  name_fr: string;
  name_en: string;
  name_de: string;
  name_es: string;
  price: number;
  original_price: number | null;
  discount_percent: number;
  image_url: string | null;
  is_featured: boolean;
}

const FeaturedProductsCarousel = () => {
  const { language, t } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.max(products.length - 3, 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name_fr, name_en, name_de, name_es, price, original_price, discount_percent, image_url, is_featured')
        .eq('is_active', true)
        .or('is_featured.eq.true')
        .order('is_featured', { ascending: false })
        .limit(12);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const getLocalizedName = (product: Product) => {
    switch (language) {
      case 'en': return product.name_en;
      case 'de': return product.name_de;
      case 'es': return product.name_es;
      default: return product.name_fr;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const scrollToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, products.length - 4)));
  };

  const nextSlide = () => {
    scrollToIndex(currentIndex + 1);
  };

  const prevSlide = () => {
    scrollToIndex(currentIndex - 1);
  };

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header - Centered */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground">
            Produits populaires
          </h2>
          <p className="text-muted-foreground mt-2">
            Les fournitures les plus demandées par nos clients
          </p>
          {/* Navigation buttons centered below */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="rounded-full"
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={currentIndex >= products.length - 4}
              className="rounded-full"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden" ref={carouselRef}>
          <div 
            className="flex gap-3 sm:gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[45%] sm:w-[48%] md:w-1/3 lg:w-1/4 group"
              >
                <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                  <Link to={`/product/${product.id}`} className="relative aspect-square block overflow-hidden">
                    <SmartImage
                      src={product.image_url}
                      alt={getLocalizedName(product)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      fallbackSrc="/placeholder.svg"
                      priority={currentIndex === 0}
                    />
                    {product.discount_percent > 0 && (
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-medium rounded">
                        -{product.discount_percent}%
                      </span>
                    )}
                    {product.is_featured && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 sm:px-2 sm:py-1 bg-accent text-accent-foreground text-[10px] sm:text-xs font-medium rounded">
                        ⭐
                      </span>
                    )}
                  </Link>
                  <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2 text-xs sm:text-sm mb-1 sm:mb-2">
                        {getLocalizedName(product)}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-0.5 mb-1 sm:mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className="fill-accent text-accent sm:w-3 sm:h-3" />
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 mb-2 sm:mb-3 mt-auto">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.original_price && product.original_price > product.price && (
                        <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="hero"
                      size="sm"
                      className="w-full text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => addToCart(product.id)}
                    >
                      <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Acheter</span>
                      <span className="sm:hidden">+</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.max(products.length - 3, 1) }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === i ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/shop">
            <Button variant="outline" size="lg">
              Voir tous les produits
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsCarousel;
