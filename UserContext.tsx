import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';
import { User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface UserContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: SupabaseUser) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) {
        if (error.message.includes('JSON object requested, multiple (or no) rows returned')) {
          // Profile doesn't exist yet, create a default one
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authUser.id,
                name: authUser.email?.split('@')[0] || 'New User',
                header_color: '#1A365D',
                header_font: 'serif',
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error('Error creating user profile:', insertError);
            return;
          }

          if (newProfile) {
            setUser({
              id: newProfile.id,
              name: newProfile.name,
              bio: newProfile.bio || '',
              headerColor: newProfile.header_color || '#1A365D',
              headerFont: newProfile.header_font || 'serif',
              avatar: newProfile.avatar_url,
            });
          }
        } else {
          console.error('Error fetching user profile:', error);
        }
        return;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          bio: data.bio || '',
          headerColor: data.header_color || '#1A365D',
          headerFont: data.header_font || 'serif',
          avatar: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, name: string) => {
    const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) throw signUpError;
    if (!authUser) throw new Error('Failed to create user');

    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: authUser.id,
        name,
        header_color: '#1A365D',
        header_font: 'serif',
      },
    ]);

    if (profileError) throw profileError;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user?.id) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        bio: updates.bio,
        header_color: updates.headerColor,
        header_font: updates.headerFont,
        avatar_url: updates.avatar,
      })
      .eq('id', user.id);

    if (error) throw error;

    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return (
    <UserContext.Provider value={{ user, signIn, signUp, signOut, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};