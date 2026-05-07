import { CheckCircle, Shield, CreditCard, Smartphone } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const PaymentSection = () => {
  const { t } = useLanguage();
  
  const paymentMethods = [
    { name: "Orange Money", color: "bg-orange-500", icon: "🟠" },
    { name: "MTN Mobile Money", color: "bg-yellow-400", icon: "🟡" },
    { name: "Moov Money", color: "bg-blue-500", icon: "🔵" },
    { name: "Wave", color: "bg-cyan-500", icon: "🌊" },
  ];

  const benefits = t.payment.benefits;

  return (
    <section className="py-20 lg:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              {t.payment.badge}
            </span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-foreground mb-6">
              {t.payment.title} <span className="text-gradient-primary">{t.payment.titleHighlight}</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t.payment.subtitle}
            </p>

            {/* Benefits */}
            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-primary flex-shrink-0" size={20} />
                  <span className="text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Visual - Payment Methods Display */}
          <div className="relative">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl" />
            
            {/* Card */}
            <div className="relative bg-card rounded-3xl border border-border p-8 shadow-lg">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Smartphone size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Modes de paiement acceptés
                </h3>
                <p className="text-sm text-muted-foreground">
                  Payez avec votre mobile en toute sécurité
                </p>
              </div>
              
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all duration-200"
                  >
                    <div className={`w-10 h-10 rounded-lg ${method.color} flex items-center justify-center`}>
                      <CreditCard size={20} className="text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{method.name}</span>
                  </div>
                ))}
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
                <Shield size={20} className="text-primary" />
                <span className="font-medium text-foreground">{t.payment.secure}</span>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent/30 rounded-full blur-2xl animate-float" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary/30 rounded-full blur-2xl animate-float animation-delay-300" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSection;
