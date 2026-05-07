import { useEffect, useState } from "react";
import { ArrowRight, Truck, ShieldCheck, CreditCard, Headphones, GraduationCap, BookOpen, Briefcase, Library, School } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const categoryTiles = [
  { name: "Primaire", slug: "scoly-primaire", icon: School, color: "from-primary to-primary-light" },
  { name: "Secondaire", slug: "scoly-secondaire", icon: BookOpen, color: "from-secondary to-secondary-light" },
  { name: "Universitaire", slug: "scoly-universite", icon: GraduationCap, color: "from-primary-dark to-primary" },
  { name: "Bureautique", slug: "scoly-bureautique", icon: Briefcase, color: "from-accent to-secondary" },
  { name: "Librairie", slug: "scoly-librairie", icon: Library, color: "from-secondary-light to-accent" },
];

const HeroSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({ products: 0 });

  useEffect(() => {
    (async () => {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      setStats({ products: count || 0 });
    })();
  }, []);

  return (
    <section className="pt-[88px] md:pt-[120px] lg:pt-[156px] bg-muted/40">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Hero band: banner + side promos (Jumia layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Main banner */}
          <Link
            to="/shop"
            className="relative block rounded-xl overflow-hidden bg-gradient-hero min-h-[260px] sm:min-h-[340px] lg:min-h-[400px] group"
          >
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z' fill='%23fff'/%3E%3C/svg%3E")`,
            }} />
            <div className="absolute -right-16 -bottom-16 w-72 h-72 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute -left-10 -top-10 w-56 h-56 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative h-full p-6 sm:p-10 lg:p-12 flex flex-col justify-center text-primary-foreground">
              <span className="inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-wide mb-4">
                Fournitures scolaires & bureautiques
              </span>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-3">
                Tout pour la rentrée<br />
                <span className="text-accent">& votre bureau au meilleur prix</span>
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/85 max-w-xl mb-6">
                Cahiers, manuels, consommables & matériel pro — {stats.products > 0 ? `${stats.products}+ produits` : "des milliers de produits"} en stock, livrés gratuitement partout en Côte d'Ivoire.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 sm:px-5 py-2.5 rounded-md font-semibold text-sm sm:text-base shadow-md group-hover:bg-secondary/90 transition-colors">
                  Acheter maintenant <ArrowRight size={16} />
                </span>
                <Link
                  to="/kits"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-md text-primary-foreground border border-primary-foreground/30 px-4 sm:px-5 py-2.5 rounded-md font-medium text-sm sm:text-base"
                >
                  Voir les kits
                </Link>
              </div>
            </div>
          </Link>

          {/* Side promos */}
          <div className="hidden lg:flex flex-col gap-4">
            <Link
              to="/shop?category=scoly-primaire"
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-secondary-light p-6 flex flex-col justify-between min-h-[190px] text-secondary-foreground hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Sélection</p>
                <h3 className="font-display text-2xl font-bold leading-tight mt-1">Kits primaire</h3>
                <p className="text-sm opacity-90 mt-1">Prêts à l'emploi</p>
              </div>
              <span className="text-sm font-semibold inline-flex items-center gap-1">
                Découvrir <ArrowRight size={14} />
              </span>
              <School className="absolute right-4 bottom-4 opacity-20" size={80} />
            </Link>
            <Link
              to="/shop?category=scoly-bureautique"
              className="relative rounded-xl overflow-hidden bg-gradient-to-br from-primary to-primary-light p-6 flex flex-col justify-between min-h-[190px] text-primary-foreground hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-90">Pro</p>
                <h3 className="font-display text-2xl font-bold leading-tight mt-1">Bureautique</h3>
                <p className="text-sm opacity-90 mt-1">Pour entreprise</p>
              </div>
              <span className="text-sm font-semibold inline-flex items-center gap-1">
                Découvrir <ArrowRight size={14} />
              </span>
              <Briefcase className="absolute right-4 bottom-4 opacity-20" size={80} />
            </Link>
          </div>
        </div>

        {/* Category tiles - Jumia style */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {categoryTiles.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.slug}
                to={`/shop?category=${c.slug}`}
                className="group bg-card rounded-xl border border-border hover:border-primary/40 hover:shadow-md transition-all p-3 sm:p-4 flex flex-col items-center text-center"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-primary-foreground mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1">{c.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 bg-card rounded-xl border border-border p-3 sm:p-4">
          <Trust icon={<Truck size={20} />} title="Livraison gratuite" subtitle="Partout en CI" />
          <Trust icon={<ShieldCheck size={20} />} title="Achat sécurisé" subtitle="Paiement protégé" />
          <Trust icon={<CreditCard size={20} />} title="Mobile Money" subtitle="Wave, Orange, MTN" />
          <Trust icon={<Headphones size={20} />} title="Support 7j/7" subtitle="Assistance dédiée" />
        </div>
      </div>
    </section>
  );
};

const Trust = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3">
    <div className="shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs sm:text-sm font-bold text-foreground leading-tight">{title}</p>
      <p className="text-[11px] sm:text-xs text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

export default HeroSection;
