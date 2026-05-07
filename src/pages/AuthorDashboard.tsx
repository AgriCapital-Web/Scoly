import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthorDashboard = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    published: 0,
    pending: 0,
    draft: 0
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [form, setForm] = useState({
    title_fr: "",
    title_en: "",
    title_de: "",
    title_es: "",
    content_fr: "",
    content_en: "",
    excerpt_fr: "",
    excerpt_en: "",
    category: "general",
    is_premium: false,
    price: "0",
    cover_image: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchArticles();
  }, [user]);

  const fetchArticles = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    setArticles(data || []);

    // Calculate stats
    const totalViews = data?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
    const totalLikes = data?.reduce((sum, a) => sum + (a.likes || 0), 0) || 0;
    const published = data?.filter(a => a.status === "published").length || 0;
    const pending = data?.filter(a => a.status === "pending").length || 0;
    const draft = data?.filter(a => a.status === "draft").length || 0;

    setStats({
      totalArticles: data?.length || 0,
      totalViews,
      totalLikes,
      published,
      pending,
      draft
    });
  };

  const categories = [
    { value: "general", label: "Général" },
    { value: "education", label: "Éducation" },
    { value: "bureautique", label: "Bureautique" },
    { value: "resources", label: "Ressources" },
    { value: "news", label: "Actualités" },
    { value: "guides", label: "Guides" },
  ];

  const resetForm = () => {
    setForm({
      title_fr: "",
      title_en: "",
      title_de: "",
      title_es: "",
      content_fr: "",
      content_en: "",
      excerpt_fr: "",
      excerpt_en: "",
      category: "general",
      is_premium: false,
      price: "0",
      cover_image: "",
    });
    setEditingArticle(null);
  };

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setForm({
      title_fr: article.title_fr || "",
      title_en: article.title_en || "",
      title_de: article.title_de || "",
      title_es: article.title_es || "",
      content_fr: article.content_fr || "",
      content_en: article.content_en || "",
      excerpt_fr: article.excerpt_fr || "",
      excerpt_en: article.excerpt_en || "",
      category: article.category || "general",
      is_premium: article.is_premium || false,
      price: article.price?.toString() || "0",
      cover_image: article.cover_image || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (publish: boolean) => {
    if (!user) return;

    if (!form.title_fr || !form.content_fr) {
      toast.error("Veuillez remplir le titre et le contenu");
      return;
    }

    const articleData = {
      author_id: user.id,
      title_fr: form.title_fr,
      title_en: form.title_en || form.title_fr,
      title_de: form.title_de || form.title_fr,
      title_es: form.title_es || form.title_fr,
      content_fr: form.content_fr,
      content_en: form.content_en || form.content_fr,
      content_de: form.content_fr,
      content_es: form.content_fr,
      excerpt_fr: form.excerpt_fr,
      excerpt_en: form.excerpt_en || form.excerpt_fr,
      excerpt_de: form.excerpt_fr,
      excerpt_es: form.excerpt_fr,
      category: form.category,
      is_premium: form.is_premium,
      price: form.is_premium ? parseFloat(form.price) : 0,
      cover_image: form.cover_image || null,
      status: publish ? "pending" : "draft",
    };

    try {
      if (editingArticle) {
        const { error } = await supabase
          .from("articles")
          .update(articleData)
          .eq("id", editingArticle.id);
        
        if (error) throw error;
        toast.success(publish ? "Article soumis pour approbation" : "Brouillon enregistré");
      } else {
        const { error } = await supabase
          .from("articles")
          .insert(articleData);
        
        if (error) throw error;
        toast.success(publish ? "Article soumis pour approbation" : "Brouillon enregistré");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchArticles();
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    
    const { error } = await supabase.from("articles").delete().eq("id", id);
    
    if (error) {
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Article supprimé");
      fetchArticles();
    }
  };

  const submitForReview = async (id: string) => {
    await supabase.from("articles").update({ status: "pending" }).eq("id", id);
    toast.success("Article soumis pour approbation");
    fetchArticles();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500"><CheckCircle size={12} className="mr-1" />Publié</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500"><Clock size={12} className="mr-1" />En attente</Badge>;
      case "rejected":
        return <Badge className="bg-red-500"><XCircle size={12} className="mr-1" />Refusé</Badge>;
      default:
        return <Badge variant="secondary"><FileText size={12} className="mr-1" />Brouillon</Badge>;
    }
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Connexion requise</h1>
          <p className="text-muted-foreground mb-6">Vous devez être connecté pour accéder à votre espace auteur.</p>
          <Button onClick={() => navigate('/auth')}>Se connecter</Button>
        </div>
        <Footer />
      </main>
    );
  }

  const draftArticles = articles.filter(a => a.status === "draft");
  const pendingArticles = articles.filter(a => a.status === "pending");
  const publishedArticles = articles.filter(a => a.status === "published");
  const rejectedArticles = articles.filter(a => a.status === "rejected");

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {language === 'fr' ? 'Espace Auteur' : language === 'en' ? 'Author Space' : language === 'de' ? 'Autorenbereich' : 'Espacio del Autor'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'fr' ? 'Gérez vos articles et suivez vos statistiques' :
               language === 'en' ? 'Manage your articles and track your statistics' :
               language === 'de' ? 'Verwalten Sie Ihre Artikel und verfolgen Sie Ihre Statistiken' :
               'Gestiona tus artículos y sigue tus estadísticas'}
            </p>
          </div>
          <Button variant="hero" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
            <Plus size={18} />
            {language === 'fr' ? 'Nouvel article' : language === 'en' ? 'New article' : language === 'de' ? 'Neuer Artikel' : 'Nuevo artículo'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total articles</p>
                  <p className="text-2xl font-bold">{stats.totalArticles}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Eye className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vues totales</p>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Likes totaux</p>
                  <p className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publiés</p>
                  <p className="text-2xl font-bold">{stats.published}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous ({articles.length})</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons ({draftArticles.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({pendingArticles.length})</TabsTrigger>
            <TabsTrigger value="published">Publiés ({publishedArticles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ArticlesList 
              articles={articles} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSubmit={submitForReview}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="drafts">
            <ArticlesList 
              articles={draftArticles} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSubmit={submitForReview}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="pending">
            <ArticlesList 
              articles={pendingArticles} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSubmit={submitForReview}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>

          <TabsContent value="published">
            <ArticlesList 
              articles={publishedArticles} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
              onSubmit={submitForReview}
              getStatusBadge={getStatusBadge}
            />
          </TabsContent>
        </Tabs>

        {/* Article Editor Modal */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Modifier l'article" : "Nouvel article"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Titre (Français) *</Label>
                  <Input
                    value={form.title_fr}
                    onChange={(e) => setForm({ ...form, title_fr: e.target.value })}
                    placeholder="Un titre accrocheur..."
                  />
                </div>
                <div>
                  <Label>Titre (Anglais)</Label>
                  <Input
                    value={form.title_en}
                    onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                    placeholder="English title..."
                  />
                </div>
              </div>

              <div>
                <Label>Résumé (Français)</Label>
                <Textarea
                  value={form.excerpt_fr}
                  onChange={(e) => setForm({ ...form, excerpt_fr: e.target.value })}
                  placeholder="Un bref résumé..."
                  rows={2}
                />
              </div>

              <div>
                <Label>Contenu (Français) *</Label>
                <Textarea
                  value={form.content_fr}
                  onChange={(e) => setForm({ ...form, content_fr: e.target.value })}
                  placeholder="Rédigez votre article..."
                  rows={12}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Catégorie</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Image de couverture</Label>
                  <Input
                    value={form.cover_image}
                    onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <Label>Contenu premium</Label>
                  <p className="text-sm text-muted-foreground">Les lecteurs devront payer pour accéder</p>
                </div>
                <Switch
                  checked={form.is_premium}
                  onCheckedChange={(checked) => setForm({ ...form, is_premium: checked })}
                />
              </div>

              {form.is_premium && (
                <div>
                  <Label>Prix (FCFA)</Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => handleSubmit(false)}>
                  Enregistrer brouillon
                </Button>
                <Button variant="hero" onClick={() => handleSubmit(true)}>
                  <Send size={16} className="mr-2" />
                  Soumettre pour publication
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </main>
  );
};

// Articles List Component
const ArticlesList = ({ 
  articles, 
  onEdit, 
  onDelete, 
  onSubmit,
  getStatusBadge 
}: { 
  articles: any[], 
  onEdit: (a: any) => void, 
  onDelete: (id: string) => void,
  onSubmit: (id: string) => void,
  getStatusBadge: (status: string) => JSX.Element
}) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucun article dans cette catégorie
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Card key={article.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                {article.cover_image && (
                  <img 
                    src={article.cover_image} 
                    alt="" 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(article.status)}
                    <Badge variant="outline">{article.category}</Badge>
                    {article.is_premium && <Badge variant="secondary">Premium</Badge>}
                  </div>
                  <h3 className="font-semibold text-lg">{article.title_fr}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{article.excerpt_fr}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {article.views || 0} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} />
                      {article.likes || 0} likes
                    </span>
                    <span>
                      {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {article.status === "draft" && (
                  <Button variant="outline" size="sm" onClick={() => onSubmit(article.id)}>
                    <Send size={14} className="mr-1" />
                    Soumettre
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => onEdit(article)}>
                  <Edit size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(article.id)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AuthorDashboard;