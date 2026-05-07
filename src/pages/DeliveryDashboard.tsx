import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, User, RefreshCw, Calendar, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DeliveryProofForm from "@/components/delivery/DeliveryProofForm";

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  phone: string;
  delivery_received_at: string | null;
  delivery_delivered_at: string | null;
  customer_confirmed_at: string | null;
}

interface DeliveryStats {
  total_assigned: number;
  pending_pickup: number;
  in_transit: number;
  delivered: number;
}

const DeliveryDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DeliveryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showProofForm, setShowProofForm] = useState<{ orderId: string; type: 'pickup' | 'delivery' } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    checkAccess();
  }, [user, navigate]);

  const checkAccess = async () => {
    if (!user) return;

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    // Check if user has delivery, admin, or moderator role
    const isDelivery = roles?.some((r) => 
      r.role === "delivery" || r.role === "admin" || r.role === "moderator"
    );
    setHasAccess(!!isDelivery);

    if (isDelivery) {
      await Promise.all([fetchOrders(), fetchStats()]);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_delivery_stats', {
        _delivery_user_id: user.id
      });

      if (error) throw error;
      if (data && data[0]) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_delivery_orders', {
        _delivery_user_id: user.id
      });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOrders(), fetchStats()]);
    setRefreshing(false);
    toast({
      title: "Actualisé",
      description: "Les données ont été mises à jour",
    });
  };

  const handleReceiveWithProof = (orderId: string) => {
    setShowProofForm({ orderId, type: 'pickup' });
  };

  const handleDeliverWithProof = (orderId: string) => {
    setShowProofForm({ orderId, type: 'delivery' });
  };

  const handleProofSuccess = async () => {
    setShowProofForm(null);
    toast({
      title: "Succès",
      description: "La preuve a été enregistrée",
    });
    await Promise.all([fetchOrders(), fetchStats()]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const pendingOrders = orders.filter((o) => !o.delivery_received_at);
  const inProgressOrders = orders.filter((o) => o.delivery_received_at && !o.delivery_delivered_at);
  const deliveredOrders = orders.filter((o) => o.delivery_delivered_at);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!hasAccess) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12 container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck size={40} className="text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Accès Livreur Requis</h1>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas les droits d'accès à l'espace livreur. 
              Contactez un administrateur pour obtenir les accès nécessaires.
            </p>
            <Button variant="hero" onClick={() => navigate("/")} className="mt-6">
              Retour à l'accueil
            </Button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                🚚 Espace Livreur
              </h1>
              <p className="text-muted-foreground mt-1">Gérez vos livraisons assignées</p>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              Actualiser
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.total_assigned || 0}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.pending_pickup || pendingOrders.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">À récupérer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.in_transit || inProgressOrders.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">En cours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 sm:pt-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.delivered || deliveredOrders.length}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">Livrées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Tabs */}
          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="flex-wrap h-auto p-1">
              <TabsTrigger value="pending" className="gap-2 text-xs sm:text-sm">
                <Clock size={16} />
                <span className="hidden sm:inline">À récupérer</span>
                <span className="sm:hidden">Récup.</span>
                ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="gap-2 text-xs sm:text-sm">
                <Truck size={16} />
                <span className="hidden sm:inline">En livraison</span>
                <span className="sm:hidden">Livr.</span>
                ({inProgressOrders.length})
              </TabsTrigger>
              <TabsTrigger value="delivered" className="gap-2 text-xs sm:text-sm">
                <CheckCircle size={16} />
                <span className="hidden sm:inline">Livrées</span>
                <span className="sm:hidden">OK</span>
                ({deliveredOrders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <div className="grid gap-4">
                {pendingOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onReceive={() => handleReceiveWithProof(order.id)}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    showReceiveButton
                  />
                ))}
                {pendingOrders.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune commande à récupérer</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="in_progress">
              <div className="grid gap-4">
                {inProgressOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onDeliver={() => handleDeliverWithProof(order.id)}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                    showDeliverButton
                  />
                ))}
                {inProgressOrders.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <Truck size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune commande en livraison</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="delivered">
              <div className="grid gap-4">
                {deliveredOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    formatPrice={formatPrice}
                    formatDate={formatDate}
                  />
                ))}
                {deliveredOrders.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-xl border border-border">
                    <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Aucune commande livrée</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Proof Form Dialog */}
      {showProofForm && (
        <DeliveryProofForm
          orderId={showProofForm.orderId}
          proofType={showProofForm.type}
          onSuccess={handleProofSuccess}
          onCancel={() => setShowProofForm(null)}
        />
      )}

      <Footer />
    </main>
  );
};

interface OrderCardProps {
  order: Order;
  onReceive?: () => void;
  onDeliver?: () => void;
  formatPrice: (price: number) => string;
  formatDate: (date: string) => string;
  showReceiveButton?: boolean;
  showDeliverButton?: boolean;
}

const OrderCard = ({
  order,
  onReceive,
  onDeliver,
  formatPrice,
  formatDate,
  showReceiveButton,
  showDeliverButton,
}: OrderCardProps) => {
  const getStatusBadge = () => {
    if (order.customer_confirmed_at) {
      return <Badge className="bg-green-500 text-white">Confirmée</Badge>;
    }
    if (order.delivery_delivered_at) {
      return <Badge className="bg-purple-500 text-white">Livrée</Badge>;
    }
    if (order.delivery_received_at) {
      return <Badge className="bg-blue-500 text-white">En cours</Badge>;
    }
    return <Badge className="bg-yellow-500 text-white">À récupérer</Badge>;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  #{order.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <span className="text-lg font-bold text-primary">
                {formatPrice(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <a href={`tel:${order.phone}`} className="text-primary hover:underline font-medium">
                {order.phone || "Non renseigné"}
              </a>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-foreground">{order.shipping_address || "Adresse non renseignée"}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            {showReceiveButton && (
              <Button variant="hero" onClick={onReceive} className="flex-1">
                <Package size={18} />
                Marquer réceptionnée
              </Button>
            )}
            {showDeliverButton && (
              <Button variant="hero" onClick={onDeliver} className="flex-1">
                <CheckCircle size={18} />
                Marquer livrée
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryDashboard;
