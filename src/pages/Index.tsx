import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";
import FeaturedArticlesCarousel from "@/components/FeaturedArticlesCarousel";
import FlashDeals from "@/components/FlashDeals";
import NewFeaturesSection from "@/components/NewFeaturesSection";
import SpacesSection from "@/components/SpacesSection";
import FeaturesSection from "@/components/FeaturesSection";
import PaymentSection from "@/components/PaymentSection";
import StatsSection from "@/components/StatsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import FreeShippingPopup from "@/components/FreeShippingPopup";
import SEOHead from "@/components/SEOHead";
import RecentlyViewed from "@/components/RecentlyViewed";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <SEOHead 
        title="Scoly — Fournitures scolaires et bureautiques en Côte d'Ivoire"
        description="Votre référence pour les fournitures scolaires et bureautiques de qualité. Livraison gratuite partout en Côte d'Ivoire."
        url="https://scoly.ci"
        keywords={["fournitures scolaires", "bureautique", "Côte d'Ivoire", "Abidjan", "livraison gratuite", "Scoly"]}
      />
      <Navbar />
      <HeroSection />
      <FlashDeals />
      <FeaturedProductsCarousel />
      <NewFeaturesSection />
      <RecentlyViewed />
      <SpacesSection />
      <FeaturedArticlesCarousel />
      <FeaturesSection />
      <StatsSection />
      <PaymentSection />
      <div className="container mx-auto px-3 sm:px-4 py-8"><NewsletterSignup /></div>
      <CTASection />
      <Footer />
      <FreeShippingPopup />
    </main>
  );
};

export default Index;
