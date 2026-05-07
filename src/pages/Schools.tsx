import { useState } from "react";
import { Link } from "react-router-dom";
import { School, Search, BookOpen, Users, ShoppingCart, ChevronRight, Star, MapPin, GraduationCap, ClipboardList, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { toast } from "sonner";
const Schools = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools", search, selectedCity],
    queryFn: async () => {
      let query = supabase
        .from("schools")
        .select("*")
        .eq("is_verified", true)
        .order("name");
      
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }
      if (selectedCity) {
        query = query.eq("city", selectedCity);
      }
      
      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data || [];
    },
  });

  const { data: supplyLists = [] } = useQuery({
    queryKey: ["public-supply-lists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_supply_lists")
        .select("*, schools(name, city), school_supply_items(count)")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data || [];
    },
  });

  const cities = ["Abidjan", "Bouaké", "Yamoussoukro", "Daloa", "San-Pédro", "Korhogo", "Man"];

  return (
    <main className="min-h-screen bg-background">
      <SEOHead
        title="Espace Écoles — Fournitures scolaires par établissement | Scoly"
        description="Trouvez les listes de fournitures de votre école. Commandez tout en un clic avec livraison gratuite."
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
              <School className="w-4 h-4 mr-1" />
              Espace Écoles & Établissements
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              Trouvez la liste de fournitures
              <span className="block text-secondary"> de votre école</span>
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Plus de recherche fastidieuse. Sélectionnez l'école, la classe, et commandez tout en un clic.
            </p>

            {/* Search */}
            <div className="max-w-xl mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Rechercher un établissement..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-12 bg-card text-foreground"
                />
              </div>
            </div>

            {/* City filters */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Button
                variant={selectedCity === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCity("")}
                className={selectedCity === "" ? "" : "bg-card/20 text-primary-foreground border-primary-foreground/20 hover:bg-card/30"}
              >
                Toutes les villes
              </Button>
              {cities.map((city) => (
                <Button
                  key={city}
                  variant={selectedCity === city ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCity(city)}
                  className={selectedCity === city ? "" : "bg-card/20 text-primary-foreground border-primary-foreground/20 hover:bg-card/30"}
                >
                  <MapPin className="w-3 h-3 mr-1" />
                  {city}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-foreground text-center mb-10">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: School, title: "1. Trouvez votre école", desc: "Recherchez votre établissement parmi nos partenaires" },
              { icon: ClipboardList, title: "2. Choisissez la classe", desc: "Sélectionnez le niveau et la série de votre enfant" },
              { icon: ShoppingCart, title: "3. Commandez en 1 clic", desc: "Toute la liste ajoutée au panier, prête à être livrée" },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schools list */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8">
            <GraduationCap className="inline w-6 h-6 mr-2 text-primary" />
            Établissements partenaires
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="text-center py-20">
              <School className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Aucun établissement trouvé</h3>
              <p className="text-muted-foreground mb-6">
                {search ? "Essayez une autre recherche" : "Les établissements seront bientôt disponibles"}
              </p>
              {user && (
                <p className="text-sm text-muted-foreground">
                  Vous êtes directeur d'école ?{" "}
                  <Link to="/contact" className="text-primary underline">Inscrivez votre établissement</Link>
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {schools.map((school: any) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                      {school.name}
                    </h3>
                    {school.is_verified && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" /> Vérifié
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                    <MapPin className="w-4 h-4" /> {school.city}
                    {school.address && ` — ${school.address}`}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {school.type === "primary" ? "Primaire" :
                     school.type === "secondary" ? "Secondaire" :
                     school.type === "both" ? "Primaire & Secondaire" : school.type}
                  </p>
                  <Link to={`/ecoles/${school.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Voir les listes <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Published supply lists */}
      {supplyLists.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">
              <ClipboardList className="inline w-6 h-6 mr-2 text-primary" />
              Listes de fournitures récentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplyLists.map((list: any) => (
                <div key={list.id} className="bg-card rounded-xl border border-border p-6">
                  <h3 className="font-bold text-foreground mb-1">{list.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {(list as any).schools?.name} — {(list as any).schools?.city}
                  </p>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{list.grade_level}</Badge>
                    {list.series && <Badge variant="outline">{list.series}</Badge>}
                    <Badge variant="outline">{list.school_year}</Badge>
                  </div>
                  <Link to={`/kits?list=${list.id}`}>
                    <Button variant="hero" size="sm" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-1" /> Commander cette liste
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* School Registration Form */}
      <section className="py-16" id="inscription">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12">
            <div className="max-w-2xl mx-auto">
              <Users className="w-12 h-12 mx-auto text-secondary mb-4" />
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4 text-center">
                Inscrire votre établissement
              </h2>
              <p className="text-primary-foreground/80 text-center mb-8">
                Remplissez ce formulaire pour enregistrer votre école. Notre équipe vérifiera les informations et activera votre compte.
              </p>
              <SchoolRegistrationForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

// School Registration Form Component
const SchoolRegistrationForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", city: "", address: "", type: "primary" as string,
    contact_name: "", phone: "", email: "", notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim() || !form.phone.trim()) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("schools").insert({
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim() || null,
        type: form.type,
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        is_verified: false,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Demande envoyée ! Nous vérifierons votre établissement.");
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'inscription");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 mx-auto text-secondary mb-4" />
        <h3 className="text-xl font-bold text-primary-foreground mb-2">Demande envoyée !</h3>
        <p className="text-primary-foreground/80">Notre équipe vérifiera votre établissement sous 24-48h.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary-foreground">Nom de l'établissement *</Label>
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-card text-foreground mt-1" placeholder="Ex: Groupe Scolaire ABC" required />
        </div>
        <div>
          <Label className="text-primary-foreground">Ville *</Label>
          <Select value={form.city} onValueChange={v => setForm(f => ({ ...f, city: v }))}>
            <SelectTrigger className="bg-card text-foreground mt-1"><SelectValue placeholder="Choisir une ville" /></SelectTrigger>
            <SelectContent>
              {["Abidjan", "Bouaké", "Yamoussoukro", "Daloa", "San-Pédro", "Korhogo", "Man", "Gagnoa", "Divo", "Autre"].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary-foreground">Type d'établissement</Label>
          <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
            <SelectTrigger className="bg-card text-foreground mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="primary">Primaire</SelectItem>
              <SelectItem value="secondary">Secondaire</SelectItem>
              <SelectItem value="both">Primaire & Secondaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-primary-foreground">Adresse</Label>
          <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="bg-card text-foreground mt-1" placeholder="Quartier, commune..." />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-primary-foreground">Nom du responsable</Label>
          <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className="bg-card text-foreground mt-1" placeholder="Directeur / Directrice" />
        </div>
        <div>
          <Label className="text-primary-foreground">Téléphone *</Label>
          <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-card text-foreground mt-1" placeholder="07 XX XX XX XX" required />
        </div>
      </div>
      <div>
        <Label className="text-primary-foreground">Email</Label>
        <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-card text-foreground mt-1" placeholder="contact@ecole.ci" />
      </div>
      <Button type="submit" variant="secondary" size="lg" className="w-full gap-2" disabled={submitting}>
        <Send className="w-4 h-4" />
        {submitting ? "Envoi en cours..." : "Envoyer la demande d'inscription"}
      </Button>
    </form>
  );
};

export default Schools;
