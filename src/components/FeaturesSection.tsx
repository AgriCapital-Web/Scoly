import { 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  HeadphonesIcon, 
  Shield,
  Star,
  BarChart,
  BookOpen
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturesSection = () => {
  const { t, language } = useLanguage();
  
  const texts = {
    fr: {
      badge: "Nos avantages",
      quality: "Qualité garantie",
      qualityDesc: "Produits sélectionnés et contrôlés pour leur qualité supérieure.",
      delivery: "Livraison gratuite",
      deliveryDesc: "Livraison offerte sur toutes vos commandes en Côte d'Ivoire.",
      journal: "Actualités Scoly",
      journalDesc: "Actualités scolaires et informations éducatives de qualité.",
      tracking: "Suivi en temps réel",
      trackingDesc: "Suivez vos commandes et recevez des notifications à chaque étape.",
    },
    en: {
      badge: "Our advantages",
      quality: "Guaranteed quality",
      qualityDesc: "Products selected and controlled for superior quality.",
      delivery: "Free delivery",
      deliveryDesc: "Free delivery on all orders in Ivory Coast.",
      journal: "Scoly News",
      journalDesc: "Quality educational news and pedagogical resources.",
      tracking: "Real-time tracking",
      trackingDesc: "Track your orders and receive notifications at each step.",
    },
    de: {
      badge: "Unsere Vorteile",
      quality: "Garantierte Qualität",
      qualityDesc: "Produkte ausgewählt und kontrolliert für überlegene Qualität.",
      delivery: "Kostenlose Lieferung",
      deliveryDesc: "Kostenlose Lieferung für alle Bestellungen in Côte d'Ivoire.",
      journal: "Scoly Nachrichten",
      journalDesc: "Qualitätsbildungsnachrichten und pädagogische Ressourcen.",
      tracking: "Echtzeit-Tracking",
      trackingDesc: "Verfolgen Sie Ihre Bestellungen und erhalten Sie Benachrichtigungen.",
    },
    es: {
      badge: "Nuestras ventajas",
      quality: "Calidad garantizada",
      qualityDesc: "Productos seleccionados y controlados por calidad superior.",
      delivery: "Entrega gratuita",
      deliveryDesc: "Entrega gratuita en todos los pedidos en Costa de Marfil.",
      journal: "Noticias Scoly",
      journalDesc: "Noticias educativas de calidad y recursos pedagógicos.",
      tracking: "Seguimiento en tiempo real",
      trackingDesc: "Sigue tus pedidos y recibe notificaciones en cada paso.",
    },
  };

  const currentTexts = texts[language] || texts.fr;
  
  const features = [
    {
      icon: <Shield size={24} />,
      title: currentTexts.quality,
      description: currentTexts.qualityDesc,
    },
    {
      icon: <CreditCard size={24} />,
      title: t.features.items.payment.title,
      description: t.features.items.payment.description,
    },
    {
      icon: <Truck size={24} />,
      title: currentTexts.delivery,
      description: currentTexts.deliveryDesc,
    },
    {
      icon: <HeadphonesIcon size={24} />,
      title: t.features.items.support.title,
      description: t.features.items.support.description,
    },
    {
      icon: <ShoppingBag size={24} />,
      title: t.features.items.resources.title,
      description: t.features.items.resources.description,
    },
    {
      icon: <Star size={24} />,
      title: currentTexts.tracking,
      description: currentTexts.trackingDesc,
    },
    {
      icon: <BarChart size={24} />,
      title: t.features.items.updates.title,
      description: t.features.items.updates.description,
    },
    {
      icon: <BookOpen size={24} />,
      title: currentTexts.journal,
      description: currentTexts.journalDesc,
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-4">
            {currentTexts.badge}
          </span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div 
      className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-display font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeaturesSection;
