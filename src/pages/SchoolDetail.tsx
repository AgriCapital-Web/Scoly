import { useParams, Link } from "react-router-dom";
import { School, MapPin, Phone, BookOpen, ShoppingCart, ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";

const SchoolDetail = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const { data: school, isLoading: schoolLoading } = useQuery({
    queryKey: ["school", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: supplyLists = [] } = useQuery({
    queryKey: ["school-supply-lists", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_supply_lists")
        .select("*, school_supply_items(*, products(*))")
        .eq("school_id", id!)
        .eq("is_published", true)
        .order("grade_level");
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price) + " " + t.common.currency;

  const getListTotal = (list: any) => {
    return (list.school_supply_items || []).reduce((sum: number, item: any) => {
      if (item.products) return sum + item.products.price * (item.quantity || 1);
      return sum;
    }, 0);
  };

  const addListToCart = async (list: any) => {
    let added = 0;
    for (const item of list.school_supply_items || []) {
      if (item.product_id && item.products?.is_active) {
        try {
          await addToCart(item.product_id, item.quantity || 1);
          added++;
        } catch (e) { /* skip */ }
      }
    }
    if (added > 0) toast.success(`${added} article(s) ajouté(s) au panier !`);
    else toast.info("Connectez-vous pour ajouter au panier");
  };

  if (schoolLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!school) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 container mx-auto px-4 text-center">
          <School className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Établissement non trouvé</h1>
          <Link to="/ecoles"><Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Retour aux écoles</Button></Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <SEOHead title={`${school.name} — Listes de fournitures | Scoly`} description={`Commandez les fournitures scolaires de ${school.name} en un clic.`} />
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/ecoles" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux écoles
          </Link>

          {/* School info */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground mb-2">{school.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4" /> {school.city}{school.address && ` — ${school.address}`}
                </p>
                {school.phone && (
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {school.phone}
                  </p>
                )}
              </div>
              <Badge variant="secondary">
                {school.type === "primary" ? "Primaire" :
                 school.type === "secondary" ? "Secondaire" : "Primaire & Secondaire"}
              </Badge>
            </div>
          </div>

          {/* Supply Lists */}
          <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            Listes de fournitures ({supplyLists.length})
          </h2>

          {supplyLists.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Aucune liste publiée pour le moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              {supplyLists.map((list: any) => (
                <motion.div
                  key={list.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{list.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{list.grade_level}</Badge>
                          {list.series && <Badge variant="outline">{list.series}</Badge>}
                          <Badge variant="outline">{list.school_year}</Badge>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {(list.school_supply_items || []).length} articles
                      </Badge>
                    </div>

                    <div className="space-y-1 mb-4">
                      {(list.school_supply_items || []).map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
                          <span className="text-foreground">
                            {item.item_name}
                            {item.quantity > 1 && <span className="text-muted-foreground ml-1">×{item.quantity}</span>}
                            {item.is_required === false && <Badge variant="outline" className="ml-2 text-xs">Optionnel</Badge>}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {item.products ? formatPrice(item.products.price * (item.quantity || 1)) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Total estimé</p>
                        <p className="text-xl font-bold text-primary">{formatPrice(getListTotal(list))}</p>
                      </div>
                      <Button variant="hero" onClick={() => addListToCart(list)}>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Tout ajouter au panier
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default SchoolDetail;
