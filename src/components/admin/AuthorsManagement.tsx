import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Eye, FileText, Search, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n/LanguageContext";

type AuthorRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  phone: string | null;
  article_count: number;
  published_count: number;
};

const AuthorsManagement = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<AuthorRow[]>([]);
  const [q, setQ] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorRow | null>(null);
  const [authorArticles, setAuthorArticles] = useState<any[]>([]);
  const [articlesOpen, setArticlesOpen] = useState(false);

  const t = useMemo(() => {
    const dict = {
      fr: {
        title: "Auteurs",
        subtitle: "Gérez les auteurs et leurs publications",
        search: "Rechercher un auteur…",
        articles: "Articles",
        published: "Publiés",
        viewArticles: "Voir publications",
        empty: "Aucun auteur trouvé",
      },
      en: {
        title: "Authors",
        subtitle: "Manage authors and their publications",
        search: "Search an author…",
        articles: "Articles",
        published: "Published",
        viewArticles: "View publications",
        empty: "No authors found",
      },
      de: {
        title: "Autoren",
        subtitle: "Autoren und ihre Veröffentlichungen verwalten",
        search: "Autor suchen…",
        articles: "Artikel",
        published: "Veröffentlicht",
        viewArticles: "Publikationen ansehen",
        empty: "Keine Autoren gefunden",
      },
      es: {
        title: "Autores",
        subtitle: "Gestiona autores y sus publicaciones",
        search: "Buscar un autor…",
        articles: "Artículos",
        published: "Publicados",
        viewArticles: "Ver publicaciones",
        empty: "No se encontraron autores",
      },
    };
    return (dict as any)[language] || dict.fr;
  }, [language]);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);

    // Authors are inferred from existing articles (author_id)
    const { data: articleAgg, error: aggError } = await supabase
      .from("articles")
      .select("author_id, status")
      .limit(1000);

    if (aggError) {
      setLoading(false);
      return;
    }

    const authorMap = new Map<string, { article_count: number; published_count: number }>();
    (articleAgg || []).forEach((a: any) => {
      const prev = authorMap.get(a.author_id) || { article_count: 0, published_count: 0 };
      prev.article_count += 1;
      if (a.status === "published") prev.published_count += 1;
      authorMap.set(a.author_id, prev);
    });

    const authorIds = Array.from(authorMap.keys());
    if (authorIds.length === 0) {
      setAuthors([]);
      setLoading(false);
      return;
    }

    const { data: profiles, error: profError } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, username, email, phone")
      .in("id", authorIds);

    if (profError) {
      setLoading(false);
      return;
    }

    const rows: AuthorRow[] = (profiles || []).map((p: any) => ({
      ...p,
      article_count: authorMap.get(p.id)?.article_count || 0,
      published_count: authorMap.get(p.id)?.published_count || 0,
    }));

    rows.sort((a, b) => b.article_count - a.article_count);
    setAuthors(rows);
    setLoading(false);
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return authors;
    return authors.filter((a) => {
      const name = `${a.first_name || ""} ${a.last_name || ""}`.toLowerCase();
      return (
        name.includes(s) ||
        (a.username || "").toLowerCase().includes(s) ||
        (a.email || "").toLowerCase().includes(s) ||
        (a.phone || "").toLowerCase().includes(s)
      );
    });
  }, [authors, q]);

  const openAuthorArticles = async (author: AuthorRow) => {
    setSelectedAuthor(author);
    setArticlesOpen(true);
    setAuthorArticles([]);

    const { data } = await supabase
      .from("articles")
      .select("id, title_fr, status, created_at, published_at")
      .eq("author_id", author.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setAuthorArticles(data || []);
  };

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </header>

      <div className="max-w-md relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} className="pl-10" placeholder={t.search} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Auteur</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Username</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t.articles}</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t.published}</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    Chargement…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    {t.empty}
                  </td>
                </tr>
              ) : (
                filtered.map((a) => (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {(a.first_name || "").trim()} {(a.last_name || "").trim()}
                          </div>
                          <div className="text-xs text-muted-foreground">{a.phone || "—"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{a.username || "—"}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{a.email || "—"}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{a.article_count}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">{a.published_count}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" onClick={() => openAuthorArticles(a)}>
                          <Eye className="h-4 w-4 mr-2" />
                          {t.viewArticles}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={articlesOpen} onOpenChange={setArticlesOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedAuthor ? `${(selectedAuthor.first_name || "").trim()} ${(selectedAuthor.last_name || "").trim()}` : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {authorArticles.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-muted-foreground">Aucune publication.</CardContent>
              </Card>
            ) : (
              authorArticles.map((a) => (
                <Card key={a.id}>
                  <CardContent className="pt-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{a.title_fr}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(a.created_at).toLocaleDateString("fr-FR")} • {a.status}
                      </div>
                    </div>
                    {a.status === "published" && (
                      <Badge className="bg-emerald-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" /> Publié
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AuthorsManagement;
