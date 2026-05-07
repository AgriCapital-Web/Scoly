import { useState, useRef, useEffect } from "react";
import DOMPurify from "dompurify";
import { 
  Bot, X, Send, Sparkles, User, Loader2, Minimize2, Maximize2,
  Star, ThumbsUp, ThumbsDown, RotateCcw, Phone, ShoppingCart,
  BookOpen, CreditCard, Truck, HelpCircle, School, Gift, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";

const WHATSAPP_NUMBER = "2250758465933";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ScIA = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hasRated, setHasRated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const texts: Record<string, Record<string, string>> = {
    fr: {
      welcome: "Bonjour ! Je suis **ScIA**, votre assistant virtuel Scoly. 🎓\n\nJe peux vous aider avec :\n- 📚 Nos produits et kits scolaires\n- 🛒 Commandes et suivi\n- 💳 Paiement Mobile Money\n- 🚚 Livraison en Côte d'Ivoire\n- 🏫 Espace Écoles\n- ✍️ Publication d'articles\n- 🎁 Programme de fidélité\n- 📞 Contact WhatsApp direct\n\nQue puis-je faire pour vous ?",
      delivery: "📦 **Livraison gratuite partout en Côte d'Ivoire !**\n\n**Délais estimés :**\n- 🏙️ Abidjan : 24-48h\n- 🏘️ Yamoussoukro, Bouaké : 2-3 jours\n- 🌍 Autres villes : 3-5 jours ouvrés\n\n**Suivi :**\n- SMS de confirmation à l'expédition\n- Suivi en temps réel dans \"Mon compte\"\n- Notification à la livraison\n- Preuve de livraison avec photo\n\n🔒 Politique de retour : 7 jours après réception.",
      payment: "💳 **Modes de paiement sécurisés :**\n\n- 🟠 **Orange Money** — Le plus utilisé\n- 🟡 **MTN Mobile Money** — Rapide et fiable\n- 🔵 **Moov Money** — Simple et sécurisé\n- 🟢 **Wave** — Sans frais\n\n**Comment payer :**\n1. Validez votre panier\n2. Choisissez votre opérateur\n3. Entrez votre numéro\n4. Confirmez sur votre téléphone\n\n🔐 Transactions 100% sécurisées via KkiaPay.\n💡 Vos paiements sont suivis en temps réel.",
      order: "🛒 **Passer commande en 5 étapes :**\n\n1. **Parcourez** la boutique ou les kits scolaires\n2. **Ajoutez** au panier (vérifiez les quantités)\n3. **Appliquez** un code promo si disponible\n4. **Renseignez** votre adresse de livraison\n5. **Payez** via Mobile Money\n\n✅ Confirmation par SMS et email\n📍 Suivi de livraison en temps réel\n🔄 Modification possible avant expédition\n\n**Astuce :** Utilisez les kits scolaires pour gagner du temps !",
      article: "✍️ **Publier sur Scoly :**\n\n**Processus :**\n1. Connectez-vous → Espace Auteur\n2. Cliquez \"Nouvel article\"\n3. Utilisez l'**IA éditoriale** pour générer du contenu\n4. Personnalisez avec l'éditeur visuel\n5. Soumettez pour validation\n\n**Fonctionnalités IA :**\n- Génération complète à partir d'un mot\n- Images IA réalistes (contexte africain)\n- Traduction automatique (FR, EN, DE, ES)\n- SEO optimisé\n\n⏱️ Validation sous 48h par notre équipe.",
      contact: "📞 **Nous contacter :**\n\n- 💬 **WhatsApp** : +225 07 58 46 59 33 (réponse rapide)\n- 📧 **Email** : contact@scoly.ci\n- 🕐 **Horaires** : Lun-Ven 8h-18h, Sam 9h-13h\n\n👇 Cliquez le bouton WhatsApp ci-dessous pour un contact direct !",
      premium: "⭐ **Articles Premium :**\n\nDu contenu exclusif rédigé par des experts :\n- Guides pédagogiques approfondis\n- Analyses du système éducatif\n- Ressources téléchargeables\n\n**Avantages :**\n- Accès permanent après achat\n- Paiement sécurisé Mobile Money\n- Prix accessibles dès 500 FCFA",
      returnPolicy: "↩️ **Politique de retour :**\n\n**Conditions :**\n- 7 jours après réception\n- Produit non utilisé, emballage d'origine\n- Contactez le SAV via WhatsApp\n\n**Processus :**\n1. Photographiez le produit\n2. Envoyez via WhatsApp\n3. Nous organisons le retrait\n4. Remboursement sous 48h\n\n🛡️ Garantie satisfaction Scoly.",
      loyalty: "🎁 **Programme de fidélité :**\n\n**Gagnez des points :**\n- 1 point par tranche de 1000 FCFA\n- Points doublés pendant les promotions\n\n**Échangez vos récompenses :**\n- 🏷️ Bons de réduction\n- 🎁 Produits gratuits\n- 🚚 Livraison prioritaire\n\n**Parrainage :**\n- Gagnez 500 FCFA par filleul\n- Votre filleul reçoit aussi 500 FCFA",
      schools: "🏫 **Espace Écoles :**\n\n**Services dédiés :**\n- Inscription de votre établissement\n- Listes de fournitures personnalisées\n- Commandes groupées avec remises\n- Suivi dédié par établissement\n\n**Kits scolaires intelligents :**\n- Du CP1 à la Terminale\n- Adaptés par série (A, C, D)\n- Générés par l'IA selon les programmes",
      resources: "📚 **Ressources pédagogiques :**\n\n- 📝 Exercices par niveau et matière\n- 📋 Sujets d'examen corrigés\n- 📖 Fiches de cours\n- 🎓 Guides d'orientation\n\nDisponibles en téléchargement gratuit ou premium.",
      greeting: "Bonjour ! 👋 Ravi de vous retrouver ! Comment puis-je vous aider ?",
      thanks: "Avec plaisir ! 😊 N'hésitez surtout pas si vous avez d'autres questions. Je suis là 24/7 !",
      goodbye: "Au revoir ! 👋 Merci pour votre visite. À très bientôt sur Scoly !",
      default: "Je comprends votre question mais n'ai pas de réponse exacte. Voici mes suggestions :\n\n1. 📞 **WhatsApp** : +225 07 58 46 59 33 (réponse humaine)\n2. 📧 **Email** : contact@scoly.ci\n3. ❓ Consultez notre **FAQ** (/faq)\n4. 🔄 Essayez de reformuler votre question\n\n💡 Utilisez les boutons rapides ci-dessous !",
      placeholder: "Écrivez votre message...",
      thinking: "ScIA réfléchit...",
      poweredBy: "Propulsé par Scoly • Réponses instantanées 24/7",
      needHelp: "Besoin d'aide ?",
      online: "Assistant Scoly • En ligne",
      endConversation: "Terminer",
      newConversation: "Nouvelle conversation",
      rateTitle: "Comment évaluez-vous cette conversation ?",
      rateThank: "Merci pour votre évaluation !",
      whatsappCta: "WhatsApp",
      whatsappMsg: "Bonjour Scoly ! J'aimerais avoir des informations. Merci !",
    },
    en: {
      welcome: "Hello! I'm **ScIA**, your Scoly virtual assistant. 🎓\n\nI can help you with:\n- 📚 Products & school kits\n- 🛒 Orders & tracking\n- 💳 Mobile Money payment\n- 🚚 Delivery in Ivory Coast\n- 🏫 Schools Space\n- ✍️ Article publishing\n- 🎁 Loyalty program\n- 📞 Direct WhatsApp contact\n\nHow can I help you today?",
      delivery: "📦 **Free delivery throughout Ivory Coast!**\n\n**Estimated times:**\n- 🏙️ Abidjan: 24-48h\n- 🏘️ Yamoussoukro, Bouaké: 2-3 days\n- 🌍 Other cities: 3-5 business days\n\nSMS confirmation upon shipping. Real-time tracking in \"My Account\".",
      payment: "💳 **Secure payment methods:**\n\n- 🟠 **Orange Money**\n- 🟡 **MTN Mobile Money**\n- 🔵 **Moov Money**\n- 🟢 **Wave**\n\n🔐 100% secure via KkiaPay.",
      order: "🛒 **Order in 5 steps:**\n\n1. Browse our shop or school kits\n2. Add to cart\n3. Apply promo code if available\n4. Enter delivery address\n5. Pay via Mobile Money\n\n✅ SMS and email confirmation",
      article: "✍️ **Publish on Scoly:**\n\n1. Log in → Author Space\n2. Use the **AI editor** for content generation\n3. Submit for review (validated within 48h)",
      contact: "📞 **Contact us:**\n\n- 💬 **WhatsApp**: +225 07 58 46 59 33\n- 📧 **Email**: contact@scoly.ci\n- 🕐 Mon-Fri 8am-6pm\n\n👇 Click the WhatsApp button below!",
      premium: "⭐ **Premium Articles:** Exclusive expert content, permanently accessible after purchase.",
      returnPolicy: "↩️ **Return Policy:** 7 days after receipt, unused product in original packaging.",
      loyalty: "🎁 **Loyalty Program:** Earn 1 point per 1000 FCFA. Redeem for discounts and free products!",
      schools: "🏫 **Schools Space:** Register your school, create supply lists, group orders with discounts.",
      resources: "📚 **Educational Resources:** Exercises, exams, course notes by level and subject.",
      greeting: "Hello! 👋 How can I help you today?",
      thanks: "My pleasure! 😊 Don't hesitate if you have more questions.",
      goodbye: "Goodbye! 👋 See you soon on Scoly!",
      default: "I couldn't find an exact answer. Try:\n\n1. 📞 WhatsApp: +225 07 58 46 59 33\n2. 📧 Email: contact@scoly.ci\n3. ❓ Check our FAQ\n\nUse the quick buttons below!",
      placeholder: "Type your message...",
      thinking: "ScIA is thinking...",
      poweredBy: "Powered by Scoly • Instant responses 24/7",
      needHelp: "Need help?",
      online: "Scoly Assistant • Online",
      endConversation: "End",
      newConversation: "New conversation",
      rateTitle: "How do you rate this conversation?",
      rateThank: "Thank you for your feedback!",
      whatsappCta: "WhatsApp",
      whatsappMsg: "Hello Scoly! I'd like to get information. Thank you!",
    },
    de: {
      welcome: "Hallo! Ich bin **ScIA**, Ihr virtueller Scoly-Assistent. 🎓\n\nIch helfe Ihnen mit:\n- 📚 Produkte & Schulsets\n- 🛒 Bestellungen & Tracking\n- 💳 Mobile Money Zahlung\n- 🚚 Lieferung\n- 📞 WhatsApp-Kontakt\n\nWie kann ich helfen?",
      delivery: "📦 **Kostenlose Lieferung!**\n\nAbidjan: 24-48h\nAndere Städte: 3-5 Werktage",
      payment: "💳 **Zahlungsmethoden:** Orange Money, MTN, Moov, Wave\n🔐 100% sicher via KkiaPay.",
      order: "🛒 **Bestellen:** Shop durchsuchen → Warenkorb → Zahlen → Bestätigung",
      article: "✍️ **Veröffentlichen:** Autorenbereich → KI-Editor → Einreichen",
      contact: "📞 **Kontakt:** WhatsApp: +225 07 58 46 59 33 | Email: contact@scoly.ci",
      premium: "⭐ **Premium-Artikel:** Exklusive Inhalte, dauerhaft zugänglich.",
      returnPolicy: "↩️ **Rückgabe:** 7 Tage, unbenutzt, Originalverpackung.",
      loyalty: "🎁 **Treueprogramm:** Punkte sammeln und einlösen!",
      schools: "🏫 **Schulbereich:** Registrierung, Bedarfslisten, Gruppenbestellungen.",
      resources: "📚 **Lernressourcen:** Übungen, Prüfungen, Kursmaterialien.",
      greeting: "Hallo! 👋 Wie kann ich helfen?",
      thanks: "Gern geschehen! 😊",
      goodbye: "Auf Wiedersehen! 👋",
      default: "Leider keine genaue Antwort. Kontaktieren Sie uns:\n📞 WhatsApp: +225 07 58 46 59 33",
      placeholder: "Nachricht eingeben...",
      thinking: "ScIA denkt nach...",
      poweredBy: "Betrieben von Scoly • 24/7",
      needHelp: "Hilfe?",
      online: "Scoly Assistent • Online",
      endConversation: "Beenden",
      newConversation: "Neues Gespräch",
      rateTitle: "Bewertung?",
      rateThank: "Danke!",
      whatsappCta: "WhatsApp",
      whatsappMsg: "Hallo Scoly! Ich möchte Informationen. Danke!",
    },
    es: {
      welcome: "¡Hola! Soy **ScIA**, tu asistente virtual Scoly. 🎓\n\nPuedo ayudarte con:\n- 📚 Productos y kits escolares\n- 🛒 Pedidos y seguimiento\n- 💳 Pago Mobile Money\n- 🚚 Entrega\n- 📞 Contacto WhatsApp\n\n¿Cómo puedo ayudarte?",
      delivery: "📦 **¡Entrega gratuita!**\n\nAbidjan: 24-48h\nOtras ciudades: 3-5 días hábiles",
      payment: "💳 **Métodos de pago:** Orange Money, MTN, Moov, Wave\n🔐 100% seguro via KkiaPay.",
      order: "🛒 **Pedir:** Explora → Añade al carrito → Paga → Confirmación",
      article: "✍️ **Publicar:** Espacio autor → Editor IA → Enviar",
      contact: "📞 **Contacto:** WhatsApp: +225 07 58 46 59 33 | Email: contact@scoly.ci",
      premium: "⭐ **Artículos Premium:** Contenido exclusivo, acceso permanente.",
      returnPolicy: "↩️ **Devoluciones:** 7 días, sin usar, embalaje original.",
      loyalty: "🎁 **Programa de fidelidad:** ¡Gana y canjea puntos!",
      schools: "🏫 **Espacio Escuelas:** Registro, listas, pedidos grupales.",
      resources: "📚 **Recursos educativos:** Ejercicios, exámenes, fichas.",
      greeting: "¡Hola! 👋 ¿Cómo puedo ayudarte?",
      thanks: "¡Con gusto! 😊",
      goodbye: "¡Adiós! 👋",
      default: "No encontré respuesta exacta.\n📞 WhatsApp: +225 07 58 46 59 33",
      placeholder: "Escribe tu mensaje...",
      thinking: "ScIA está pensando...",
      poweredBy: "Impulsado por Scoly • 24/7",
      needHelp: "¿Ayuda?",
      online: "Asistente Scoly • En línea",
      endConversation: "Terminar",
      newConversation: "Nueva conversación",
      rateTitle: "¿Calificación?",
      rateThank: "¡Gracias!",
      whatsappCta: "WhatsApp",
      whatsappMsg: "¡Hola Scoly! Me gustaría información. ¡Gracias!",
    },
  };

  const currentTexts = texts[language] || texts.fr;

  const initialMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: currentTexts.welcome,
    timestamp: new Date(),
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([initialMessage]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const findResponse = (query: string): string => {
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    const matchers: [string[], string][] = [
      [['livraison','delivery','lieferung','entrega','expedition','expedier','ship','versand','envio','delai','colis','recevoir','quand'], currentTexts.delivery],
      [['paiement','payment','zahlung','pago','argent','money','geld','dinero','mobile money','wave','orange money','mtn','moov','kkiapay','payer','prix','cout','tarif'], currentTexts.payment],
      [['commande','order','bestellung','pedido','commander','acheter','buy','kaufen','comprar','panier','cart','ajouter','checkout'], currentTexts.order],
      [['article','publier','publish','veroffentlichen','publicar','auteur','author','autor','ecrire','rediger','blog','actualite'], currentTexts.article],
      [['contact','kontakt','contacto','telephone','phone','telefon','telefono','email','whatsapp','appeler','joindre','numero'], currentTexts.contact],
      [['premium','payant','paid','bezahlt','exclusif','vip'], currentTexts.premium],
      [['retour','return','ruckgabe','devolucion','rembourser','refund','echanger','garantie','defectueux'], currentTexts.returnPolicy],
      [['fidelite','loyalty','treue','fidelidad','point','recompense','reward','parrainage','referral','filleul'], currentTexts.loyalty],
      [['ecole','school','schule','escuela','etablissement','inscription','kit','fourniture','liste','classe','niveau','cp','ce','cm','seconde','premiere','terminale'], currentTexts.schools],
      [['ressource','resource','exercice','examen','cours','lecon','fiche','telecharg','pdf','document','sujet'], currentTexts.resources],
      [['bonjour','salut','hello','hi','hey','hallo','hola','coucou','bonsoir','yo','wesh'], currentTexts.greeting],
      [['merci','thanks','thank','danke','gracias','super','genial','parfait','great','awesome','cool','top','excellent','bravo'], currentTexts.thanks],
      [['au revoir','bye','goodbye','tschuss','adios','a bientot','adieu','ciao','see you'], currentTexts.goodbye],
    ];

    for (const [keywords, response] of matchers) {
      if (keywords.some(k => q.includes(k))) return response;
    }

    return currentTexts.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    const response = findResponse(userMessage.content);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEndConversation = () => setShowRating(true);

  const handleRating = (stars: number) => {
    setRating(stars);
    setHasRated(true);
    setTimeout(() => {
      setShowRating(false);
      setHasRated(false);
      setRating(0);
      setMessages([]);
      setIsOpen(false);
    }, 2000);
  };

  const handleNewConversation = () => {
    setMessages([initialMessage]);
    setShowRating(false);
    setHasRated(false);
    setRating(0);
  };

  const renderMessage = (content: string) => {
    return content.split("\n").map((line, i) => {
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i}>
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(line, { ALLOWED_TAGS: ['strong','em','a','br','span'], ALLOWED_ATTR: ['href','target','rel'] }) }} />
          {i < content.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(currentTexts.whatsappMsg)}`;

  const quickActions = [
    { label: "🛒 " + (language === 'fr' ? 'Commander' : language === 'en' ? 'Order' : language === 'de' ? 'Bestellen' : 'Pedir'), query: "commande", icon: ShoppingCart },
    { label: "🚚 " + (language === 'fr' ? 'Livraison' : language === 'en' ? 'Delivery' : language === 'de' ? 'Lieferung' : 'Entrega'), query: "livraison", icon: Truck },
    { label: "💳 " + (language === 'fr' ? 'Paiement' : language === 'en' ? 'Payment' : language === 'de' ? 'Zahlung' : 'Pago'), query: "paiement", icon: CreditCard },
    { label: "🏫 " + (language === 'fr' ? 'Écoles' : language === 'en' ? 'Schools' : language === 'de' ? 'Schulen' : 'Escuelas'), query: "ecole", icon: School },
    { label: "🎁 " + (language === 'fr' ? 'Fidélité' : language === 'en' ? 'Loyalty' : language === 'de' ? 'Treue' : 'Fidelidad'), query: "fidelite", icon: Gift },
    { label: "📚 " + (language === 'fr' ? 'Ressources' : language === 'en' ? 'Resources' : language === 'de' ? 'Ressourcen' : 'Recursos'), query: "ressource", icon: FileText },
    { label: "📞 Contact", query: "contact", icon: Phone },
    { label: "❓ FAQ", query: "retour", icon: HelpCircle },
  ];

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg hidden sm:block"
            >
              <p className="text-sm font-medium">{currentTexts.needHelp} 💬</p>
            </motion.div>
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 group"
            >
              <div className="relative">
                <Bot className="h-6 w-6 transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full border-2 border-primary animate-pulse" />
              </div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              "fixed z-50 bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col",
              isExpanded 
                ? "inset-2 sm:inset-4 md:inset-8" 
                : "bottom-4 right-4 left-4 sm:left-auto sm:w-[400px] h-[520px] sm:h-[580px] md:h-[640px] max-h-[85vh] sm:max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="bg-primary p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="h-6 w-6" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 rounded-full border-2 border-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold flex items-center gap-2">
                      ScIA <Sparkles className="h-4 w-4" />
                    </h3>
                    <p className="text-xs text-primary-foreground/80">{currentTexts.online}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {/* WhatsApp button in header */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors"
                    title={currentTexts.whatsappCta}
                  >
                    <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.962A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.338 22.614c-.394 1.108-1.946 2.028-3.2 2.296-.86.182-1.982.326-5.76-1.238-4.836-2.002-7.944-6.912-8.186-7.232-.232-.32-1.952-2.6-1.952-4.96s1.234-3.52 1.672-4.002c.438-.482.958-.602 1.276-.602.316 0 .636.002.912.016.294.016.686-.112 1.074.818.394.95 1.346 3.278 1.466 3.516.118.238.198.516.038.836-.158.32-.238.518-.478.798-.238.278-.502.622-.716.834-.238.238-.486.498-.208.976.278.478 1.234 2.036 2.65 3.298 1.82 1.622 3.354 2.126 3.832 2.364.478.238.756.198 1.034-.118.278-.32 1.194-1.392 1.512-1.872.316-.478.636-.398 1.074-.238.438.158 2.766 1.304 3.244 1.542.478.238.796.358.914.556.118.198.118 1.148-.276 2.256z" />
                    </svg>
                  </a>
                  <Button variant="ghost" size="icon" onClick={handleNewConversation} className="h-8 w-8 text-primary-foreground hover:bg-white/20" title={currentTexts.newConversation}>
                    <RotateCcw size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8 text-primary-foreground hover:bg-white/20">
                    {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleEndConversation} className="h-8 w-8 text-primary-foreground hover:bg-white/20" title={currentTexts.endConversation}>
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Rating Overlay */}
            {showRating && (
              <div className="absolute inset-0 bg-background/95 z-10 flex flex-col items-center justify-center p-6">
                {!hasRated ? (
                  <>
                    <Bot className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-4 text-center">{currentTexts.rateTitle}</h3>
                    <div className="flex gap-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => handleRating(star)} className="p-2 hover:scale-110 transition-transform">
                          <Star className={cn("h-8 w-8", star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" size="sm" onClick={() => handleRating(5)}><ThumbsUp className="h-4 w-4 mr-2" />{t.common.yes}</Button>
                      <Button variant="outline" size="sm" onClick={() => handleRating(2)}><ThumbsDown className="h-4 w-4 mr-2" />{t.common.no}</Button>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
                    <div className="flex justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={cn("h-8 w-8", star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
                      ))}
                    </div>
                    <p className="text-lg font-medium text-primary">{currentTexts.rateThank}</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", message.role === "user" ? "bg-primary text-primary-foreground" : "bg-primary/20")}>
                      {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={cn("max-w-[80%] rounded-2xl px-4 py-3", message.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm")}>
                      <div className="text-sm leading-relaxed">{renderMessage(message.content)}</div>
                      <p className={cn("text-[10px] mt-1", message.role === "user" ? "text-primary-foreground/60" : "text-muted-foreground")}>
                        {message.timestamp.toLocaleTimeString(language === 'en' ? 'en-US' : 'fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Bot size={16} />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">{currentTexts.thinking}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick actions - shown when few messages */}
            {messages.length <= 2 && !showRating && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {quickActions.map((action) => (
                    <Button
                      key={action.query}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-xs h-7 px-2.5"
                      onClick={() => {
                        setInput(action.query);
                        setTimeout(handleSend, 100);
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* WhatsApp CTA banner */}
            {!showRating && (
              <div className="px-4 pb-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 32 32" className="w-4 h-4 fill-white">
                      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.962A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.338 22.614c-.394 1.108-1.946 2.028-3.2 2.296-.86.182-1.982.326-5.76-1.238-4.836-2.002-7.944-6.912-8.186-7.232-.232-.32-1.952-2.6-1.952-4.96s1.234-3.52 1.672-4.002c.438-.482.958-.602 1.276-.602.316 0 .636.002.912.016.294.016.686-.112 1.074.818.394.95 1.346 3.278 1.466 3.516.118.238.198.516.038.836-.158.32-.238.518-.478.798-.238.278-.502.622-.716.834-.238.238-.486.498-.208.976.278.478 1.234 2.036 2.65 3.298 1.82 1.622 3.354 2.126 3.832 2.364.478.238.756.198 1.034-.118.278-.32 1.194-1.392 1.512-1.872.316-.478.636-.398 1.074-.238.438.158 2.766 1.304 3.244 1.542.478.238.796.358.914.556.118.198.118 1.148-.276 2.256z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground">
                      {language === 'fr' ? 'Parler à un humain' : language === 'en' ? 'Talk to a human' : language === 'de' ? 'Mit einem Menschen sprechen' : 'Hablar con una persona'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">WhatsApp • +225 07 58 46 59 33</p>
                  </div>
                  <span className="text-xs font-medium text-[#25D366]">→</span>
                </a>
              </div>
            )}

            {/* Input */}
            {!showRating && (
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentTexts.placeholder}
                    className="rounded-full bg-background"
                    disabled={isLoading}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="rounded-full h-10 w-10 p-0">
                    <Send size={18} />
                  </Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground mt-2">{currentTexts.poweredBy}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ScIA;
