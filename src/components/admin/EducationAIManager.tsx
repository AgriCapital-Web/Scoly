import { useState } from "react";
import { Brain, GraduationCap, BookOpen, Package, Sparkles, RefreshCw, Save, Plus, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const LEVELS = [
  "CP1", "CP2", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème",
  "2nde", "1ère", "Terminale",
];
const SERIES = ["A", "C", "D"];
const SUBJECTS = [
  "Mathématiques", "Français", "Anglais", "Physique-Chimie", "SVT",
  "Histoire-Géographie", "Philosophie", "EDHC", "Espagnol", "EPS",
];
const RESOURCE_TYPES = [
  { value: "exercises", label: "Exercices" },
  { value: "exams", label: "Sujets d'examen" },
  { value: "lesson_plans", label: "Fiches de cours" },
  { value: "programs", label: "Programme officiel" },
];

interface GeneratedKit {
  kit_name: string;
  description: string;
  estimated_price: number;
  items: Array<{
    item_name: string;
    quantity: number;
    product_id?: string;
    estimated_price?: number;
    is_required: boolean;
  }>;
}

interface GeneratedResource {
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  content: string;
  subject: string;
  grade_level: string;
  category: string;
  difficulty?: string;
  estimated_duration?: string;
}

const EducationAIManager = () => {
  // Kit generation state
  const [kitLevel, setKitLevel] = useState("");
  const [kitSeries, setKitSeries] = useState("");
  const [generatingKit, setGeneratingKit] = useState(false);
  const [generatedKit, setGeneratedKit] = useState<GeneratedKit | null>(null);

  // Resource generation state
  const [resSubject, setResSubject] = useState("");
  const [resLevel, setResLevel] = useState("");
  const [resType, setResType] = useState("");
  const [generatingRes, setGeneratingRes] = useState(false);
  const [generatedResource, setGeneratedResource] = useState<GeneratedResource | null>(null);
  const [savingRes, setSavingRes] = useState(false);

  // School description state
  const [schoolName, setSchoolName] = useState("");
  const [schoolType, setSchoolType] = useState("");
  const [schoolCity, setSchoolCity] = useState("");
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [generatedDesc, setGeneratedDesc] = useState("");

  const generateKit = async () => {
    if (!kitLevel) { toast.error("Sélectionnez un niveau"); return; }
    setGeneratingKit(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-education-manager", {
        body: { action: "generate_kit", level: kitLevel, series: kitSeries || undefined },
      });
      if (error) throw error;
      setGeneratedKit(data);
      toast.success("Kit généré par l'IA !");
    } catch (e: any) {
      toast.error(e.message || "Erreur lors de la génération");
    } finally {
      setGeneratingKit(false);
    }
  };

  const generateResource = async () => {
    if (!resSubject || !resLevel || !resType) { toast.error("Remplissez tous les champs"); return; }
    setGeneratingRes(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-education-manager", {
        body: { action: "generate_resource", subject: resSubject, grade_level: resLevel, resource_type: resType },
      });
      if (error) throw error;
      setGeneratedResource(data);
      toast.success("Ressource générée !");
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setGeneratingRes(false);
    }
  };

  const saveResource = async () => {
    if (!generatedResource) return;
    setSavingRes(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-education-manager", {
        body: { action: "save_resource", resource: generatedResource },
      });
      if (error) throw error;
      toast.success("Ressource sauvegardée en base !");
      setGeneratedResource(null);
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setSavingRes(false);
    }
  };

  const generateDescription = async () => {
    if (!schoolName) { toast.error("Entrez le nom de l'école"); return; }
    setGeneratingDesc(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-education-manager", {
        body: { action: "generate_school_description", school_name: schoolName, school_type: schoolType, city: schoolCity },
      });
      if (error) throw error;
      setGeneratedDesc(data.description);
      toast.success("Description générée !");
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setGeneratingDesc(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <Brain className="text-primary" /> Gestion IA — Éducation
        </h2>
        <p className="text-muted-foreground text-sm">
          Générez des kits scolaires, ressources éducatives et descriptions d'écoles avec l'IA
        </p>
      </div>

      <Tabs defaultValue="kits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kits" className="gap-1"><Package size={14} /> Kits IA</TabsTrigger>
          <TabsTrigger value="resources" className="gap-1"><BookOpen size={14} /> Ressources IA</TabsTrigger>
          <TabsTrigger value="schools" className="gap-1"><GraduationCap size={14} /> Écoles IA</TabsTrigger>
        </TabsList>

        {/* ─── Kit Generation ─── */}
        <TabsContent value="kits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Package className="text-primary" /> Générer un Kit Scolaire</CardTitle>
              <CardDescription>L'IA compose un kit complet adapté au niveau scolaire et à la série</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label>Niveau scolaire *</Label>
                  <Select value={kitLevel} onValueChange={setKitLevel}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Série (secondaire)</Label>
                  <Select value={kitSeries} onValueChange={setKitSeries}>
                    <SelectTrigger><SelectValue placeholder="Optionnel" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune</SelectItem>
                      {SERIES.map(s => <SelectItem key={s} value={s}>Série {s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={generateKit} disabled={generatingKit} className="w-full gap-2">
                    {generatingKit ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    {generatingKit ? "Génération..." : "Générer le kit"}
                  </Button>
                </div>
              </div>

              {generatedKit && (
                <div className="mt-6 space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <h3 className="font-semibold text-foreground text-lg">{generatedKit.kit_name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{generatedKit.description}</p>
                    <Badge variant="default" className="mt-2">{generatedKit.estimated_price?.toLocaleString()} FCFA estimé</Badge>
                  </div>
                  <div className="space-y-2">
                    {generatedKit.items?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Badge variant={item.is_required ? "default" : "outline"} className="text-xs">
                            {item.is_required ? "Obligatoire" : "Optionnel"}
                          </Badge>
                          <span className="text-sm font-medium">{item.item_name}</span>
                          <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                        </div>
                        <div className="text-right">
                          {item.product_id && <Badge variant="secondary" className="text-xs">Catalogue ✓</Badge>}
                          {item.estimated_price && <span className="text-xs text-muted-foreground ml-2">{item.estimated_price} FCFA</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Resource Generation ─── */}
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BookOpen className="text-primary" /> Générer une Ressource Éducative</CardTitle>
              <CardDescription>Créez des exercices, sujets d'examen ou fiches de cours par IA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Matière *</Label>
                  <Select value={resSubject} onValueChange={setResSubject}>
                    <SelectTrigger><SelectValue placeholder="Matière" /></SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Niveau *</Label>
                  <Select value={resLevel} onValueChange={setResLevel}>
                    <SelectTrigger><SelectValue placeholder="Niveau" /></SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type *</Label>
                  <Select value={resType} onValueChange={setResType}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      {RESOURCE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={generateResource} disabled={generatingRes} className="w-full gap-2">
                    {generatingRes ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    {generatingRes ? "..." : "Générer"}
                  </Button>
                </div>
              </div>

              {generatedResource && (
                <div className="mt-6 space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{generatedResource.title_fr}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{generatedResource.description_fr}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge>{generatedResource.subject}</Badge>
                          <Badge variant="outline">{generatedResource.grade_level}</Badge>
                          {generatedResource.difficulty && <Badge variant="secondary">{generatedResource.difficulty}</Badge>}
                        </div>
                      </div>
                      <Button onClick={saveResource} disabled={savingRes} size="sm" className="gap-1 shrink-0">
                        <Save size={14} />
                        {savingRes ? "..." : "Sauvegarder"}
                      </Button>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-4 max-h-96 overflow-y-auto">
                    <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1">
                      <FileText size={14} /> Contenu généré
                    </h4>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {generatedResource.content}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── School Description ─── */}
        <TabsContent value="schools">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><GraduationCap className="text-primary" /> Générer une Fiche École</CardTitle>
              <CardDescription>L'IA crée une description professionnelle pour un établissement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Nom de l'école *</Label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    placeholder="Ex: Lycée Classique d'Abidjan"
                  />
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={schoolType} onValueChange={setSchoolType}>
                    <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primaire</SelectItem>
                      <SelectItem value="secondary">Secondaire</SelectItem>
                      <SelectItem value="both">Primaire & Secondaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ville</Label>
                  <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={schoolCity}
                    onChange={e => setSchoolCity(e.target.value)}
                    placeholder="Ex: Abidjan"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={generateDescription} disabled={generatingDesc} className="w-full gap-2">
                    {generatingDesc ? <RefreshCw size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    {generatingDesc ? "..." : "Générer"}
                  </Button>
                </div>
              </div>

              {generatedDesc && (
                <div className="bg-card border border-border rounded-xl p-4 mt-4">
                  <h4 className="font-semibold text-sm text-foreground mb-2">Description générée</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{generatedDesc}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationAIManager;
