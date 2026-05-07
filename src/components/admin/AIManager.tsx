import { useState } from "react";
import { Brain, Zap, TrendingUp, Share2, AlertTriangle, RefreshCw, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Analysis {
  featured_suggestions: Array<{ product_id: string; reason: string }>;
  flash_deals: Array<{ product_id: string; suggested_discount: number; duration_hours?: number; reason: string }>;
  stock_alerts: Array<{ product_id: string; current_stock?: number; action: string }>;
  social_posts: Array<{ platform: string; content: string; hashtags?: string }>;
  summary: string;
}

const AIManager = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [applying, setApplying] = useState(false);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-platform-manager", {
        body: { action: "analyze" },
      });
      if (error) throw error;
      setAnalysis(data);
      toast.success("Analyse IA terminée !");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de l'analyse");
    } finally {
      setAnalyzing(false);
    }
  };

  const applyFlashDeals = async () => {
    if (!analysis?.flash_deals?.length) return;
    setApplying(true);
    try {
      const { error } = await supabase.functions.invoke("ai-platform-manager", {
        body: { action: "apply_flash_deals", deals: analysis.flash_deals },
      });
      if (error) throw error;
      toast.success(`${analysis.flash_deals.length} ventes flash appliquées !`);
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setApplying(false);
    }
  };

  const copyPost = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    toast.success("Copié !");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Brain className="text-primary" /> Module IA — Gestion Intelligente
          </h2>
          <p className="text-muted-foreground text-sm">
            L'IA analyse votre plateforme et propose des actions automatiques
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={analyzing} className="gap-2">
          {analyzing ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {analyzing ? "Analyse en cours..." : "Lancer l'analyse IA"}
        </Button>
      </div>

      {analysis && (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="flash">
              Ventes Flash
              <Badge variant="secondary" className="ml-1">{analysis.flash_deals.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="stock">
              Alertes Stock
              <Badge variant="destructive" className="ml-1">{analysis.stock_alerts.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="social">
              Réseaux Sociaux
              <Badge variant="secondary" className="ml-1">{analysis.social_posts.length}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary">
            <Card>
              <CardContent className="pt-6">
                <p className="text-foreground whitespace-pre-wrap">{analysis.summary}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flash">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="text-accent" /> Ventes Flash Suggérées
                  </CardTitle>
                  <Button onClick={applyFlashDeals} disabled={applying} variant="hero" size="sm">
                    {applying ? "Application..." : "Appliquer tout"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.flash_deals.map((deal, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Produit: {deal.product_id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">{deal.reason}</p>
                    </div>
                    <Badge variant="default">-{deal.suggested_discount}%</Badge>
                  </div>
                ))}
                {analysis.flash_deals.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Aucune suggestion de vente flash</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="text-destructive" /> Alertes Stock
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.stock_alerts.map((alert, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <div>
                      <p className="font-medium text-sm">Produit: {alert.product_id.slice(0, 8)}...</p>
                      <p className="text-xs text-muted-foreground">{alert.action}</p>
                    </div>
                    <Badge variant="destructive">Stock: {alert.current_stock ?? "?"}</Badge>
                  </div>
                ))}
                {analysis.stock_alerts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">✅ Stock OK pour tous les produits</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="text-primary" /> Posts Réseaux Sociaux
                </CardTitle>
                <CardDescription>Copiez et publiez sur vos réseaux sociaux</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.social_posts.map((post, i) => (
                  <div key={i} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{post.platform}</Badge>
                      <Button variant="ghost" size="sm" onClick={() => copyPost(post.content + (post.hashtags ? "\n\n" + post.hashtags : ""), i)}>
                        {copiedIdx === i ? <Check size={14} /> : <Copy size={14} />}
                        {copiedIdx === i ? "Copié" : "Copier"}
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                    {post.hashtags && <p className="text-xs text-primary mt-2">{post.hashtags}</p>}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!analysis && !analyzing && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Brain size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Module IA prêt</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Cliquez sur "Lancer l'analyse IA" pour analyser votre plateforme. L'IA va auto-classifier vos produits, 
              suggérer des ventes flash, détecter les problèmes de stock et générer des posts pour les réseaux sociaux.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIManager;
