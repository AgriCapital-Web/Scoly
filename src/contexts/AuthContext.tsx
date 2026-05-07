import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  rolesLoading: boolean;
  roles: Array<'admin' | 'moderator' | 'user' | 'vendor' | 'delivery'>;
  isAdmin: boolean;
  refreshRoles: () => Promise<void>;
  getDashboardPath: () => string;
  signUp: (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [roles, setRoles] = useState<Array<'admin' | 'moderator' | 'user' | 'vendor' | 'delivery'>>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const fetchRoles = async (userId: string) => {
    setRolesLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching roles:', error);
        setRoles([]);
        setIsAdmin(false);
        return;
      }

      const nextRoles = (data || []).map((r) => r.role as any);
      setRoles(nextRoles);
      setIsAdmin(nextRoles.includes('admin'));
    } finally {
      setRolesLoading(false);
    }
  };

  const refreshRoles = async () => {
    if (!user?.id) return;
    await fetchRoles(user.id);
  };

  const getDashboardPath = () => {
    if (roles.includes('admin')) return '/admin';
    if (roles.includes('moderator')) return '/moderator';
    if (roles.includes('vendor')) return '/vendor';
    if (roles.includes('delivery')) return '/delivery';
    return '/account';
  };

  useEffect(() => {
    let rolesChannel: ReturnType<typeof supabase.channel> | null = null;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Reset previous subscription
      if (rolesChannel) {
        supabase.removeChannel(rolesChannel);
        rolesChannel = null;
      }

      if (session?.user) {
        // Load roles immediately
        setTimeout(() => {
          fetchRoles(session.user.id);
        }, 0);

        // Realtime: keep roles in sync when admin changes them
        rolesChannel = supabase
          .channel(`user-roles-${session.user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_roles',
              filter: `user_id=eq.${session.user.id}`,
            },
            () => fetchRoles(session.user!.id)
          )
          .subscribe();
      } else {
        setRoles([]);
        setIsAdmin(false);
        setRolesLoading(false);
      }
    });

    // THEN check for existing session — roles are handled by onAuthStateChange above
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Only set loading state if onAuthStateChange hasn't fired yet
      if (!session?.user) {
        setLoading(false);
        setRolesLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (rolesChannel) supabase.removeChannel(rolesChannel);
    };
  }, []);

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Inscription réussie !",
        description: "Bienvenue sur Scoly ! Vous êtes maintenant connecté.",
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Connexion réussie !",
        description: "Bienvenue sur Scoly.",
      });

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        rolesLoading,
        roles,
        isAdmin,
        refreshRoles,
        getDashboardPath,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
