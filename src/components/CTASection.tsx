import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t, language } = useLanguage();
  
  const texts = {
    fr: {
      contact: "Contacter l'équipe",
      freeSignup: "Inscription gratuite • Aucune carte bancaire requise",
    },
    en: {
      contact: "Contact the team",
      freeSignup: "Free signup • No credit card required",
    },
    de: {
      contact: "Team kontaktieren",
      freeSignup: "Kostenlose Anmeldung • Keine Kreditkarte erforderlich",
    },
    es: {
      contact: "Contactar al equipo",
      freeSignup: "Registro gratuito • Sin tarjeta de crédito",
    },
  };

  const currentTexts = texts[language] || texts.fr;
  
  return (
    <section className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto bg-primary rounded-3xl p-8 lg:p-16 text-center relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 text-accent/30">
            <Sparkles size={48} />
          </div>
          <div className="absolute bottom-4 left-4 text-primary-foreground/20">
            <Sparkles size={32} />
          </div>

          <h2 className="text-3xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
            {t.cta.title}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            {t.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button variant="accent" size="xl">
                {t.cta.button}
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="heroOutline" size="xl">
                {currentTexts.contact}
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-primary-foreground/60">
            {currentTexts.freeSignup}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;