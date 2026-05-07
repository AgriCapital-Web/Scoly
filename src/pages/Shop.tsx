import { useState, useEffect } from "react";
import { Search, ShoppingCart, Truck, SlidersHorizontal, X, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams, Link } from "react-router-dom";

interface Product {
  id: string;
  name_fr: string;
  name_en: string;
  name_de: string;
  name_es: string;
  description_fr: string | null;
  description_en: string | null;
  description_de: string | null;
  description_es: string | null;
  price: number;
  original_price: number | null;
  discount_percent: number;
  stock: number;
  image_url: string | null;
  is_featured: boolean;
  category_id: string | null;
  free_shipping: boolean;
}

interface Category {
  id: string;
  name_fr: string;
  name_en: string;
  name_de: string;
  name_es: string;
  slug: string;
}

const Shop = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      const cat = categories.find(c => c.slug === categoryParam);
      if (cat) {
        setSelectedCategory(cat.id);
      }
    }
  }, [searchParams, categories]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name_fr');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getLocalizedName = (item: Category) => {
    switch (language) {
      case 'en': return item.name_en;
      case 'de': return item.name_de;
      case 'es': return item.name_es;
      default: return item.name_fr;
    }
  };

  const handleCategoryClick = (categoryId: string | null, slug?: string) => {
    setSelectedCategory(categoryId);
    if (slug) {
      setSearchParams({ category: slug });
    } else {
      setSearchParams({});
    }
  };

  const productName = (product: Product) => {
    switch (language) {
      case 'en': return product.name_en;
      case 'de': return product.name_de;
      case 'es': return product.name_es;
      default: return product.name_fr;
    }
  };

  const filteredProducts = products
    .filter(product => {
      const name = (productName(product) || '').toLowerCase();
      const matchesSearch = name.includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0;
      }
    });

  return (
    <main className="min-h-screen bg-background">
      <SEOHead 
        title="Boutique Scoly - Fournitures scolaires et bureautiques"
        description="Découvrez notre catalogue complet de fournitures scolaires et bureautiques. Livraison gratuite en Côte d'Ivoire."
        url="https://scoly.ci/shop"
        keywords={["boutique", "fournitures scolaires", "bureautique", "Scoly", "Côte d'Ivoire"]}
      />
      <Navbar />

      {/* Page header — compact under sticky navbar */}
      <section className="pt-[100px] md:pt-[140px] lg:pt-[170px] pb-3 sm:pb-4 bg-muted/40 border-b border-border">
        <div className="container mx-auto px-3 sm:px-4">
          <nav className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium">Boutique</span>
          </nav>
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            Boutique Scoly
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? "s" : ""}
            {selectedCategory && categories.find(c => c.id === selectedCategory) && (
              <> dans <span className="text-foreground font-medium">{getLocalizedName(categories.find(c => c.id === selectedCategory)!)}</span></>
            )}
          </p>
        </div>
      </section>

      {/* Filters bar — sticky toolbar */}
      <div className="sticky top-[56px] md:top-[96px] lg:top-[124px] z-30 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder={t.shop.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 sm:h-10 text-sm"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:block h-10 px-3 rounded-md border border-border bg-card text-sm text-foreground min-w-[160px]"
          >
            <option value="newest">{t.shop.sortNewest}</option>
            <option value="price-asc">{t.shop.sortPriceAsc}</option>
            <option value="price-desc">{t.shop.sortPriceDesc}</option>
            <option value="popular">{t.shop.sortPopular}</option>
          </select>
          {/* Mobile filters drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden gap-1.5 h-9 sm:h-10 shrink-0">
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filtres</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[360px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <FiltersPanel
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryClick}
                getLocalizedName={getLocalizedName}
                sortBy={sortBy}
                setSortBy={setSortBy}
                t={t}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Layout: sidebar + grid */}
      <section className="py-4 sm:py-6">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4 sm:gap-6">
            {/* Sidebar - desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-[180px] space-y-4">
                <FiltersPanel
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={handleCategoryClick}
                  getLocalizedName={getLocalizedName}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  t={t}
                  hideSort
                />
                <div className="bg-gradient-to-br from-primary to-primary-light rounded-xl p-4 text-primary-foreground">
                  <Truck size={22} className="mb-2 text-accent" />
                  <p className="font-bold text-sm">Livraison gratuite</p>
                  <p className="text-xs opacity-90 mt-1">Sur toutes vos commandes en Côte d'Ivoire</p>
                </div>
              </div>
            </aside>

            <div>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-card rounded-lg border border-border p-2 animate-pulse">
                      <div className="aspect-square bg-muted rounded mb-2" />
                      <div className="h-3 bg-muted rounded w-3/4 mb-1" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4" />
                  <p className="text-foreground font-semibold">Aucun produit trouvé</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.common.noResults}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

interface FiltersPanelProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null, slug?: string) => void;
  getLocalizedName: (c: Category) => string;
  sortBy: string;
  setSortBy: (s: string) => void;
  t: any;
  hideSort?: boolean;
}

const FiltersPanel = ({
  categories,
  selectedCategory,
  onSelectCategory,
  getLocalizedName,
  sortBy,
  setSortBy,
  t,
  hideSort,
}: FiltersPanelProps) => (
  <div className="space-y-4 mt-4 lg:mt-0">
    <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
      <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide">Catégories</h3>
      <div className="space-y-1">
        <button
          onClick={() => onSelectCategory(null)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            !selectedCategory ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground/80"
          }`}
        >
          {t.shop.allCategories}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelectCategory(c.id, c.slug)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === c.id ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-muted text-foreground/80"
            }`}
          >
            {getLocalizedName(c)}
          </button>
        ))}
      </div>
    </div>
    {!hideSort && (
      <div className="bg-card rounded-xl border border-border p-3 sm:p-4">
        <h3 className="font-bold text-sm text-foreground mb-3 uppercase tracking-wide">Trier par</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
        >
          <option value="newest">{t.shop.sortNewest}</option>
          <option value="price-asc">{t.shop.sortPriceAsc}</option>
          <option value="price-desc">{t.shop.sortPriceDesc}</option>
          <option value="popular">{t.shop.sortPopular}</option>
        </select>
      </div>
    )}
  </div>
);

export default Shop;
