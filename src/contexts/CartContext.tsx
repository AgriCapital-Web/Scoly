import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

const LOCAL_CART_KEY = 'izyscoly_guest_cart';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    name_fr: string;
    name_en: string;
    name_de: string;
    name_es: string;
    price: number;
    original_price: number | null;
    image_url: string | null;
    stock: number;
  };
}

interface GuestCartItem {
  product_id: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Get guest cart from localStorage
  const getGuestCart = (): GuestCartItem[] => {
    try {
      const saved = localStorage.getItem(LOCAL_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cart: GuestCartItem[]) => {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  };

  // Clear guest cart from localStorage
  const clearGuestCart = () => {
    localStorage.removeItem(LOCAL_CART_KEY);
  };

  // Fetch product details for guest cart items
  const fetchGuestCartWithProducts = async () => {
    const guestCart = getGuestCart();
    if (guestCart.length === 0) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const productIds = guestCart.map(item => item.product_id);
      const { data: products, error } = await supabase
        .from('products')
        .select('id, name_fr, name_en, name_de, name_es, price, original_price, image_url, stock')
        .in('id', productIds);

      if (error) throw error;

      const cartWithProducts: CartItem[] = guestCart.map((item, index) => ({
        id: `guest_${index}_${item.product_id}`,
        product_id: item.product_id,
        quantity: item.quantity,
        product: products?.find(p => p.id === item.product_id)
      })).filter(item => item.product);

      setItems(cartWithProducts);
    } catch (error) {
      console.error('Error fetching guest cart products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Migrate guest cart to user cart after login
  const migrateGuestCartToUser = async () => {
    if (!user) return;
    
    const guestCart = getGuestCart();
    if (guestCart.length === 0) return;

    try {
      for (const item of guestCart) {
        // Check if product already in user's cart
        const { data: existing } = await supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('user_id', user.id)
          .eq('product_id', item.product_id)
          .single();

        if (existing) {
          // Update quantity if exists
          await supabase
            .from('cart_items')
            .update({ quantity: existing.quantity + item.quantity })
            .eq('id', existing.id);
        } else {
          // Insert new item
          await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: item.product_id,
              quantity: item.quantity
            });
        }
      }
      
      // Clear guest cart after migration
      clearGuestCart();
    } catch (error) {
      console.error('Error migrating guest cart:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      // Fetch guest cart
      await fetchGuestCartWithProducts();
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          products (
            id,
            name_fr,
            name_en,
            name_de,
            name_es,
            price,
            original_price,
            image_url,
            stock
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.products as CartItem['product'],
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Migrate guest cart then fetch user cart
      migrateGuestCartToUser().then(() => fetchCart());
    } else {
      fetchCart();
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!user) {
      // Add to guest cart (localStorage)
      const guestCart = getGuestCart();
      const existingIndex = guestCart.findIndex(item => item.product_id === productId);
      
      if (existingIndex >= 0) {
        guestCart[existingIndex].quantity += quantity;
      } else {
        guestCart.push({ product_id: productId, quantity });
      }
      
      saveGuestCart(guestCart);
      await fetchGuestCartWithProducts();
      
      toast({
        title: "Ajouté au panier",
        description: "Le produit a été ajouté à votre panier.",
      });
      return;
    }

    try {
      // Check if item already exists
      const existingItem = items.find(item => item.product_id === productId);

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });

        if (error) throw error;

        toast({
          title: "Ajouté au panier",
          description: "Le produit a été ajouté à votre panier.",
        });

        await fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le produit au panier.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) {
      // Remove from guest cart
      const guestCart = getGuestCart();
      // Find by product_id from the itemId (format: guest_{index}_{product_id})
      const productId = itemId.split('_').slice(2).join('_');
      const updatedCart = guestCart.filter(item => item.product_id !== productId);
      saveGuestCart(updatedCart);
      await fetchGuestCartWithProducts();
      
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));

      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier.",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(itemId);
      return;
    }

    if (!user) {
      // Update guest cart
      const guestCart = getGuestCart();
      const productId = itemId.split('_').slice(2).join('_');
      const itemIndex = guestCart.findIndex(item => item.product_id === productId);
      
      if (itemIndex >= 0) {
        guestCart[itemIndex].quantity = quantity;
        saveGuestCart(guestCart);
        await fetchGuestCartWithProducts();
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', itemId);

      if (error) throw error;

      setItems(prev =>
        prev.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    if (!user) {
      clearGuestCart();
      setItems([]);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const total = items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      total,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};