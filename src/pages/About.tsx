import { Users, Target, Eye, Heart, Award, Globe } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmartImage from "@/components/SmartImage";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/i18n/LanguageContext";
import founderImage from "@/assets/founder-kablan.jpg";

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: <Heart size={24} />, title: "Excellence", description: "Nous visons l'excellence dans tout ce que nous faisons." },
    { icon: <Users size={24} />, title: "Accessibilité", description: "Les fournitures scolaires doivent être accessibles à tous." },
    { icon: <Award size={24} />, title: "Innovation", description: "Nous innovons pour améliorer l'expérience d'achat." },
    { icon: <Globe size={24} />, title: "Impact", description: "Nous créons un impact positif sur l'éducation en Côte d'Ivoire." },
  ];

  const team = [
    { name: "Inocent KOFFI", role: "Développeur & Directeur Technique", image: founderImage },
    { name: "Mme. TRA Lou Marie", role: "Directrice Commerciale", image: null },
    { name: "M. KONAN Yao Séverin", role: "Responsable Logistique", image: null },
    { name: "M. DIALLO Ibrahim", role: "Responsable Relations Clients", image: null },
  ];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead 
        title="À propos - Notre équipe et notre mission"
        description="Découvrez Scoly, votre partenaire pour l'éducation en Côte d'Ivoire. Notre mission : rendre les fournitures scolaires accessibles à tous."
        url="https://scoly.ci/about"
        keywords={["à propos", "équipe", "mission", "Scoly", "Côte d'Ivoire", "éducation"]}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6">
              {t.about.title}
            </h1>
            <p className="text-xl opacity-90">
              {t.about.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Target size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                {t.about.mission}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.missionText}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <Eye size={32} className="text-secondary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-4">
                {t.about.vision}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t.about.visionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            {t.about.values}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <div className="text-accent">{value.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            {t.about.team}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[3/4] bg-muted flex items-center justify-center overflow-hidden">
                  {member.image ? (
                    <SmartImage 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      fallbackSrc="/placeholder.svg"
                    />
                  ) : (
                    <Users size={64} className="text-muted-foreground" />
                  )}
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Stats */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-display font-bold text-accent mb-2">50K+</p>
              <p className="text-primary-foreground/80">{t.stats.students}</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-display font-bold text-accent mb-2">10K+</p>
              <p className="text-primary-foreground/80">{t.stats.resources}</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-display font-bold text-accent mb-2">500+</p>
              <p className="text-primary-foreground/80">{t.stats.schools}</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-display font-bold text-accent mb-2">98%</p>
              <p className="text-primary-foreground/80">{t.stats.satisfaction}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;
