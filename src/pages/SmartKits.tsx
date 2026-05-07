import { useState } from "react";
import { Package, Sparkles, GraduationCap, ShoppingCart, ChevronRight, BookOpen, Calculator, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/i18n/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";

const LEVELS = [
  { value: "cp1", label: "CP1", cycle: "Primaire" },
  { value: "cp2", label: "CP2", cycle: "Primaire" },
  { value: "ce1", label: "CE1", cycle: "Primaire" },
  { value: "ce2", label: "CE2", cycle: "Primaire" },
  { value: "cm1", label: "CM1", cycle: "Primaire" },
  { value: "cm2", label: "CM2", cycle: "Primaire" },
  { value: "6eme", label: "6ème", cycle: "Collège" },
  { value: "5eme", label: "5ème", cycle: "Collège" },
  { value: "4eme", label: "4ème", cycle: "Collège" },
  { value: "3eme", label: "3ème", cycle: "Collège" },
  { value: "2nde", label: "2nde", cycle: "Lycée" },
  { value: "1ere", label: "1ère", cycle: "Lycée" },
  { value: "tle", label: "Terminale", cycle: "Lycée" },
];

const SERIES = [
  { value: "A", label: "Série A (Lettres)" },
  { value: "C", label: "Série C (Sciences)" },
  { value: "D", label: "Série D (Sciences naturelles)" },
];

const SmartKits = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");

  const showSeries = ["2nde", "1ere", "tle"].includes(selectedLevel);

  const { data: kits = [], isLoading } = useQuery({
    queryKey: ["smart-kits", selectedLevel, selectedSeries],
    queryFn: async () => {
      if (!selectedLevel) return [];
      
      let query = supabase
        .from("smart_kits")
        .select("*, smart_kit_items(*, products(*))")
        .eq("grade_level", selectedLevel)
        .eq("is_active", true);
      
      if (showSeries && selectedSeries) {
        query = query.eq("series", selectedSeries);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedLevel,
  });

  // Fallback: products matching education_level
  const { data: suggestedProducts = [] } = useQuery({
    queryKey: ["suggested-products", selectedLevel],
    queryFn: async () => {
      if (!selectedLevel) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("education_level", selectedLevel)
        .limit(20);
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedLevel && kits.length === 0,
  });

  const handleAddKitToCart = async (kit: any) => {
    const items = kit.smart_kit_items || [];
    let added = 0;
    for (const item of items) {
      if (item.products && item.products.is_active) {
        try {
          await addToCart(item.product_id, item.quantity || 1);
          added++;
        } catch (e) {
          // skip
        }
      }
    }
    if (added > 0) {
      toast.success(`${added} article(s) ajouté(s) au panier !`);
    } else {
      toast.error("Impossible d'ajouter les articles. Connectez-vous d'abord.");
    }
  };

  const totalKitPrice = (kit: any) => {
    return (kit.smart_kit_items || []).reduce((sum: number, item: any) => {
      return sum + (item.products?.price || 0) * (item.quantity || 1);
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " " + t.common.currency;
  };

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Kits Scolaires Intelligents — Scoly"
        description="Composez automatiquement votre kit de fournitures par classe et série. Tout ce dont votre enfant a besoin, en un clic."
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16" style={{ background: "var(--gradient-hero)" }}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-secondary/20 text-secondary-foreground border-secondary/30">
              <Sparkles className="w-4 h-4 mr-1" />
              Alimenté par l'IA
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Kits Scolaires
              <span className="block text-secondary">Intelligents</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Dites-nous la classe de votre enfant, on compose le kit parfait.
              Tous les manuels et fournitures nécessaires, au meilleur prix.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Kit Builder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8 -mt-24 relative z-10 shadow-lg">
            <h2 className="text-xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              Composez votre kit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Niveau / Classe
                </label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(
                      LEVELS.reduce((acc, l) => {
                        (acc[l.cycle] = acc[l.cycle] || []).push(l);
                        return acc;
                      }, {} as Record<string, typeof LEVELS>)
                    ).map(([cycle, levels]) => (
                      <div key={cycle}>
                        <div className="px-2 py-1 text-xs font-bold text-muted-foreground">{cycle}</div>
                        {levels.map((l) => (
                          <SelectItem key={l.value} value={l.value}>
                            {l.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {showSeries && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Série
                  </label>
                  <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la série" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERIES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {selectedLevel && (
            <div className="mt-12">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                      <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                      <div className="space-y-2">
                        {[...Array(5)].map((_, j) => (
                          <div key={j} className="h-4 bg-muted rounded w-full" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : kits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {kits.map((kit: any) => (
                    <motion.div
                      key={kit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-xl border border-border overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{kit.name}</h3>
                            {kit.description && (
                              <p className="text-sm text-muted-foreground mt-1">{kit.description}</p>
                            )}
                          </div>
                          <Badge variant="secondary">
                            {(kit.smart_kit_items || []).length} articles
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-6">
                          {(kit.smart_kit_items || []).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0">
                              <span className="text-foreground flex items-center gap-2">
                                <BookOpen className="w-3 h-3 text-muted-foreground" />
                                {item.products?.name_fr || "Produit"}
                                {item.quantity > 1 && <Badge variant="outline" className="text-xs">x{item.quantity}</Badge>}
                              </span>
                              <span className="text-muted-foreground">
                                {item.products ? formatPrice(item.products.price * (item.quantity || 1)) : "—"}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Total du kit</p>
                            <p className="text-xl font-bold text-primary">{formatPrice(totalKitPrice(kit))}</p>
                          </div>
                          <Button variant="hero" onClick={() => handleAddKitToCart(kit)}>
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Ajouter tout au panier
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : suggestedProducts.length > 0 ? (
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    Suggestions pour {LEVELS.find((l) => l.value === selectedLevel)?.label}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {suggestedProducts.map((product: any) => (
                      <div key={product.id} className="bg-card rounded-xl border border-border p-4">
                        <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">{product.name_fr}</h4>
                        <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => addToCart(product.id, 1)}
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" /> Ajouter
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Pas encore de kit pour ce niveau
                  </h3>
                  <p className="text-muted-foreground">
                    Nos kits sont en cours de préparation. Consultez notre{" "}
                    <a href="/shop" className="text-primary underline">boutique</a> en attendant.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Calculator, title: "Économisez jusqu'à 20%", desc: "Les kits sont moins chers que l'achat article par article" },
              { icon: Pencil, title: "Rien n'est oublié", desc: "Chaque kit est vérifié par des enseignants" },
              { icon: Package, title: "Livraison gratuite", desc: "Partout en Côte d'Ivoire, pour tout kit commandé" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default SmartKits;
