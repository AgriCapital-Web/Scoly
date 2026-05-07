import { ShoppingBag, Newspaper, Truck, ArrowRight, Package, CreditCard, Star, PenTool, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SpacesSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0, articles: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      const { count: articlesCount } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      setStats({
        products: productsCount || 0,
        articles: articlesCount || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num === 0) return "0";
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace('.0', '')}K+`;
    }
    return num.toString() + (num > 0 ? "+" : "");
  };
  
  return (
    <section className="py-20 lg:py-32 bg-background" id="spaces">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Nos services
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-4">
            Tout pour l'école et le bureau
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Scoly vous offre des fournitures scolaires et bureautiques de qualité pour accompagner votre réussite
          </p>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <SpaceCard
            id="boutique"
            icon={<ShoppingBag size={32} />}
            title="Boutique Scoly"
            subtitle="Scolaire & Bureautique"
            description="Retrouvez toutes vos fournitures scolaires et bureautiques : cahiers, stylos, classeurs, accessoires de bureau et bien plus encore."
            features={[
              { icon: <Package size={18} />, text: "Catalogue complet" },
              { icon: <Truck size={18} />, text: "Livraison gratuite" },
              { icon: <CreditCard size={18} />, text: "Paiement Mobile Money" },
            ]}
            stats={{ value: loading ? "..." : formatNumber(stats.products), label: "Produits" }}
            gradient="from-primary to-primary-light"
            buttonVariant="hero"
            href="/shop"
          />

          <SpaceCard
            id="livraison"
            icon={<Truck size={32} />}
            title="Livraison gratuite"
            subtitle="Partout en Côte d'Ivoire"
            description="Profitez de la livraison gratuite sur toutes vos commandes. Nous livrons dans toutes les villes du pays avec un suivi en temps réel."
            features={[
              { icon: <Package size={18} />, text: "Emballage soigné" },
              { icon: <Star size={18} />, text: "Suivi en temps réel" },
              { icon: <CreditCard size={18} />, text: "Paiement à la livraison" },
            ]}
            stats={{ value: "24-72h", label: "Délai moyen" }}
            gradient="from-secondary to-secondary-light"
            buttonVariant="coral"
            href="/shop"
          />

          <SpaceCard
            id="actualites"
            icon={<Newspaper size={32} />}
            title="Actualités Scoly"
            subtitle="Articles & Publications"
            description="Restez informé avec nos articles sur l'éducation, les résultats d'examens, les taux de réussite scolaire et les conseils pratiques."
            features={[
              { icon: <PenTool size={18} />, text: "Articles de qualité" },
              { icon: <BookOpen size={18} />, text: "Résultats scolaires" },
              { icon: <Star size={18} />, text: "Guides gratuits" },
            ]}
            stats={{ value: loading ? "..." : formatNumber(stats.articles), label: "Publications" }}
            gradient="from-accent to-yellow-400"
            buttonVariant="accent"
            href="/actualites"
          />
        </div>
      </div>
    </section>
  );
};

interface SpaceCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
  stats: { value: string; label: string };
  gradient: string;
  buttonVariant: "hero" | "coral" | "accent";
  href: string;
}

const SpaceCard = ({ id, icon, title, subtitle, description, features, stats, gradient, buttonVariant, href }: SpaceCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div 
      id={id}
      className="group relative bg-card rounded-3xl border border-border overflow-hidden hover:shadow-lg transition-all duration-500 hover:-translate-y-2"
    >
      <div className="h-40 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative h-full flex flex-col items-center justify-center">
          <div className="p-4 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground mb-2">
            {icon}
          </div>
          <span className="text-primary-foreground/90 text-sm font-medium">{subtitle}</span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 leading-relaxed">{description}</p>

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-foreground">
              <span className="text-primary">{feature.icon}</span>
              {feature.text}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div className="text-2xl font-display font-bold text-foreground">{stats.value}</div>
            <div className="text-sm text-muted-foreground">{stats.label}</div>
          </div>
          <Link to={href}>
            <Button variant={buttonVariant}>
              Découvrir
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default SpacesSection;
