import { useEffect, useMemo, useState } from "react";
import { Eye, Package, Plus, RefreshCw, Save, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ImageUpload from "@/components/ImageUpload";

const LEVEL_OPTIONS = [
  { value: "cp1", label: "CP1" },
  { value: "cp2", label: "CP2" },
  { value: "ce1", label: "CE1" },
  { value: "ce2", label: "CE2" },
  { value: "cm1", label: "CM1" },
  { value: "cm2", label: "CM2" },
  { value: "6eme", label: "6ème" },
  { value: "5eme", label: "5ème" },
  { value: "4eme", label: "4ème" },
  { value: "3eme", label: "3ème" },
  { value: "2nde", label: "2nde" },
  { value: "1ere", label: "1ère" },
  { value: "tle", label: "Terminale" },
];

const SERIES_OPTIONS = [
  { value: "A", label: "Série A" },
  { value: "C", label: "Série C" },
  { value: "D", label: "Série D" },
];

type SelectedKitItem = {
  localId: string;
  product_id: string | null;
  item_name: string;
  quantity: number;
  is_required: boolean;
  product?: any;
};

const emptyKit = {
  id: "",
  name: "",
  grade_level: "",
  series: "",
  description: "",
  image_url: "",
  is_active: true,
};

const SmartKitComposer = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [kits, setKits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [kitDraft, setKitDraft] = useState(emptyKit);
  const [items, setItems] = useState<SelectedKitItem[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsResult, kitsResult] = await Promise.all([
        supabase
          .from("products")
          .select("id, name_fr, price, stock, image_url, education_level, is_active")
          .eq("is_active", true)
          .order("name_fr"),
        supabase
          .from("smart_kits")
          .select("*, smart_kit_items(*, products(id, name_fr, price, image_url, is_active))")
          .order("created_at", { ascending: false }),
      ]);

      if (productsResult.error) throw productsResult.error;
      if (kitsResult.error) throw kitsResult.error;

      setProducts(productsResult.data || []);
      setKits(kitsResult.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Impossible de charger les kits intelligents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const selectedLevelLabel = useMemo(
    () => LEVEL_OPTIONS.find((option) => option.value === kitDraft.grade_level)?.label || "",
    [kitDraft.grade_level],
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products
      .filter((product) => {
        const matchesSearch = !term || product.name_fr?.toLowerCase().includes(term);
        const matchesLevel = !kitDraft.grade_level || !product.education_level || product.education_level === kitDraft.grade_level;
        return matchesSearch && matchesLevel;
      })
      .slice(0, 30);
  }, [kitDraft.grade_level, products, search]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + ((item.product?.price || 0) * (item.quantity || 1)), 0),
    [items],
  );

  const resetComposer = () => {
    setKitDraft(emptyKit);
    setItems([]);
    setSearch("");
  };

  const addProduct = (product: any) => {
    setItems((current) => {
      const existing = current.find((item) => item.product_id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          localId: crypto.randomUUID(),
          product_id: product.id,
          item_name: product.name_fr,
          quantity: 1,
          is_required: true,
          product,
        },
      ];
    });
  };

  const updateItem = (localId: string, patch: Partial<SelectedKitItem>) => {
    setItems((current) => current.map((item) => (item.localId === localId ? { ...item, ...patch } : item)));
  };

  const removeItem = (localId: string) => {
    setItems((current) => current.filter((item) => item.localId !== localId));
  };

  const handleGenerateKit = async () => {
    if (!kitDraft.grade_level) {
      toast.error("Sélectionnez un niveau avant de lancer l'IA");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-education-manager", {
        body: {
          action: "generate_kit",
          level: selectedLevelLabel || kitDraft.grade_level,
          series: kitDraft.series || undefined,
        },
      });

      if (error) throw error;

      setKitDraft((current) => ({
        ...current,
        name: data?.kit_name || current.name,
        description: data?.description || current.description,
      }));

      setItems(
        (data?.items || []).map((item: any) => {
          const matchedProduct = products.find((product) => product.id === item.product_id);
          return {
            localId: crypto.randomUUID(),
            product_id: matchedProduct?.id || null,
            item_name: matchedProduct?.name_fr || item.item_name,
            quantity: Math.max(1, Number(item.quantity) || 1),
            is_required: item.is_required !== false,
            product: matchedProduct,
          };
        }),
      );

      toast.success("Le kit IA est prêt à être publié");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Impossible de générer le kit");
    } finally {
      setGenerating(false);
    }
  };

  const saveKit = async () => {
    if (!kitDraft.name.trim() || !kitDraft.grade_level) {
      toast.error("Nom du kit et niveau scolaire obligatoires");
      return;
    }

    if (!items.length) {
      toast.error("Ajoutez au moins un article au kit");
      return;
    }

    setSaving(true);
    try {
      const kitPayload = {
        name: kitDraft.name.trim(),
        grade_level: kitDraft.grade_level,
        series: kitDraft.series || null,
        description: kitDraft.description.trim() || null,
        image_url: kitDraft.image_url || null,
        total_price: totalPrice,
        is_active: kitDraft.is_active,
      };

      let kitId = kitDraft.id;

      if (kitDraft.id) {
        const { error } = await supabase.from("smart_kits").update(kitPayload).eq("id", kitDraft.id);
        if (error) throw error;

        const { error: deleteItemsError } = await supabase.from("smart_kit_items").delete().eq("kit_id", kitDraft.id);
        if (deleteItemsError) throw deleteItemsError;
      } else {
        const { data, error } = await supabase.from("smart_kits").insert(kitPayload).select("id").single();
        if (error) throw error;
        kitId = data.id;
      }

      const itemPayload = items.map((item, index) => ({
        kit_id: kitId,
        product_id: item.product_id,
        item_name: item.item_name,
        quantity: Math.max(1, item.quantity),
        is_required: item.is_required,
        sort_order: index,
      }));

      const { error: itemError } = await supabase.from("smart_kit_items").insert(itemPayload);
      if (itemError) throw itemError;

      toast.success(kitDraft.id ? "Kit mis à jour" : "Kit publié sur la page publique");
      resetComposer();
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Enregistrement du kit impossible");
    } finally {
      setSaving(false);
    }
  };

  const editKit = (kit: any) => {
    setKitDraft({
      id: kit.id,
      name: kit.name || "",
      grade_level: kit.grade_level || "",
      series: kit.series || "",
      description: kit.description || "",
      image_url: kit.image_url || "",
      is_active: kit.is_active ?? true,
    });

    setItems(
      (kit.smart_kit_items || []).map((item: any) => ({
        localId: crypto.randomUUID(),
        product_id: item.product_id,
        item_name: item.item_name,
        quantity: item.quantity || 1,
        is_required: item.is_required ?? true,
        product: item.products || undefined,
      })),
    );
  };

  const toggleKitStatus = async (kit: any) => {
    const { error } = await supabase.from("smart_kits").update({ is_active: !kit.is_active }).eq("id", kit.id);
    if (error) {
      toast.error("Impossible de changer le statut du kit");
      return;
    }
    toast.success(!kit.is_active ? "Kit publié" : "Kit retiré du public");
    fetchData();
  };

  const deleteKit = async (kitId: string) => {
    if (!confirm("Supprimer ce kit ?")) return;
    const { error } = await supabase.from("smart_kits").delete().eq("id", kitId);
    if (error) {
      toast.error("Suppression impossible");
      return;
    }
    toast.success("Kit supprimé");
    if (kitDraft.id === kitId) resetComposer();
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-display font-bold text-foreground">
            <Package className="text-primary" /> Compositeur de kits
          </h2>
          <p className="text-sm text-muted-foreground">
            Créez un kit côté admin, ajoutez une image, puis publiez-le directement sur la page publique /kits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="heroOutline" onClick={resetComposer}>Nouveau kit</Button>
          <Button onClick={handleGenerateKit} disabled={generating} className="gap-2">
            {generating ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
            {generating ? "Génération..." : "Pré-remplir avec l'IA"}
          </Button>
          <Button onClick={saveKit} disabled={saving} className="gap-2">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Publication..." : "Publier le kit"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="composer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="composer">Compositeur</TabsTrigger>
          <TabsTrigger value="library">Kits publiés</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du kit</CardTitle>
                <CardDescription>Le kit sera visible publiquement dès qu'il est actif.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label>Nom du kit</Label>
                    <Input value={kitDraft.name} onChange={(e) => setKitDraft((current) => ({ ...current, name: e.target.value }))} placeholder="Ex: Kit de rentrée CE2" />
                  </div>
                  <div>
                    <Label>Niveau</Label>
                    <Select value={kitDraft.grade_level} onValueChange={(value) => setKitDraft((current) => ({ ...current, grade_level: value }))}>
                      <SelectTrigger><SelectValue placeholder="Choisir un niveau" /></SelectTrigger>
                      <SelectContent>
                        {LEVEL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Série</Label>
                    <Select value={kitDraft.series || "none"} onValueChange={(value) => setKitDraft((current) => ({ ...current, series: value === "none" ? "" : value }))}>
                      <SelectTrigger><SelectValue placeholder="Optionnelle" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune</SelectItem>
                        {SERIES_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea value={kitDraft.description} onChange={(e) => setKitDraft((current) => ({ ...current, description: e.target.value }))} placeholder="Expliquez ce que contient le kit et à qui il s’adresse." />
                </div>

                <ImageUpload
                  value={kitDraft.image_url}
                  onChange={(url) => setKitDraft((current) => ({ ...current, image_url: url }))}
                  bucket="product-images"
                  label="Image du kit"
                  placeholder="https://..."
                />

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Visible sur la page publique</p>
                    <p className="text-xs text-muted-foreground">Le kit apparaîtra sur /kits et pourra être ajouté au panier.</p>
                  </div>
                  <Switch checked={kitDraft.is_active} onCheckedChange={(checked) => setKitDraft((current) => ({ ...current, is_active: checked }))} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Articles du kit</CardTitle>
                <CardDescription>{items.length} article(s) • {totalPrice.toLocaleString()} FCFA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Rechercher dans le catalogue</Label>
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Chercher un cahier, un manuel, un stylo..." />
                </div>

                <div className="grid gap-2 rounded-lg border border-border bg-muted/10 p-2 max-h-[320px] overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="flex items-center gap-3 rounded-lg border border-transparent bg-background px-3 py-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/30"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-md bg-muted shrink-0">
                        <img src={product.image_url || "/placeholder.svg"} alt={product.name_fr} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{product.name_fr}</p>
                        <p className="text-xs text-muted-foreground">{product.price?.toLocaleString()} FCFA</p>
                      </div>
                      <Plus size={16} className="text-primary shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-card p-3">
                  {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Ajoutez des produits pour constituer le kit.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.localId} className="rounded-lg border border-border bg-muted/10 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-foreground">{item.item_name}</p>
                            <p className="text-xs text-muted-foreground">{item.product?.price ? `${item.product.price.toLocaleString()} FCFA` : "Article libre"}</p>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.localId)}>
                            <Trash2 size={15} className="text-destructive" />
                          </Button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-[110px_1fr]">
                          <div>
                            <Label className="text-xs">Quantité</Label>
                            <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.localId, { quantity: Math.max(1, Number(e.target.value) || 1) })} />
                          </div>
                          <div className="flex items-end justify-between gap-4 rounded-lg border border-border bg-background px-3 py-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Type</p>
                              <p className="text-sm font-medium text-foreground">{item.is_required ? "Obligatoire" : "Optionnel"}</p>
                            </div>
                            <Switch checked={item.is_required} onCheckedChange={(checked) => updateItem(item.localId, { is_required: checked })} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="library">
          <Card>
            <CardHeader>
              <CardTitle>Kits enregistrés</CardTitle>
              <CardDescription>Gérez leur visibilité publique et rechargez le compositeur en un clic.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Chargement des kits...</div>
              ) : kits.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">Aucun kit n'est encore publié.</div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {kits.map((kit) => (
                    <div key={kit.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-semibold text-foreground">{kit.name}</h3>
                            <Badge variant={kit.is_active ? "default" : "secondary"}>{kit.is_active ? "Public" : "Brouillon"}</Badge>
                            <Badge variant="outline">{(kit.smart_kit_items || []).length} article(s)</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{kit.description || "Aucune description"}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{(kit.total_price || 0).toLocaleString()} FCFA • {kit.grade_level}{kit.series ? ` • Série ${kit.series}` : ""}</p>
                        </div>
                        <div className="h-16 w-16 overflow-hidden rounded-md bg-muted shrink-0">
                          <img src={kit.image_url || kit.smart_kit_items?.[0]?.products?.image_url || "/placeholder.svg"} alt={kit.name} className="h-full w-full object-cover" loading="lazy" />
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => editKit(kit)}>
                          <Eye size={14} /> Modifier
                        </Button>
                        <Button variant="heroOutline" size="sm" onClick={() => toggleKitStatus(kit)}>
                          {kit.is_active ? "Retirer du public" : "Publier"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteKit(kit.id)}>
                          <Trash2 size={14} className="text-destructive" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-2 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={16} />
            Le kit publié ici remonte automatiquement sur la page publique <span className="font-semibold text-foreground">/kits</span>.
          </div>
          <div className="text-xs">Ajout au panier pris en charge pour chaque article lié à un produit du catalogue.</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmartKitComposer;