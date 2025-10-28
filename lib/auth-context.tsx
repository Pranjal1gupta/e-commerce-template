'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, dummyData } from './dummy-data';
import { useRouter } from 'next/navigation';

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  is_admin: boolean;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('dummy_user');
    const storedProfile = localStorage.getItem('dummy_profile');

    if (storedUser && storedProfile) {
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Dummy authentication - find user by email
      const allUsers = await dummyData.getUsers();
      const user = allUsers.find(u => u.email === email);
      
      if (user) {
        setUser(user);
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          phone: user.phone,
          is_admin: user.is_admin,
        });
        localStorage.setItem('dummy_user', JSON.stringify(user));
        localStorage.setItem('dummy_profile', JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
          phone: user.phone,
          is_admin: user.is_admin,
        }));
        return { error: null };
      }
      return { error: 'User not found' };
    } catch (error) {
      return { error: 'Authentication failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const newUser = await dummyData.createUser({
        email,
        full_name: fullName,
        avatar_url: null,
        phone: null,
        is_admin: false,
        is_active: true,
      });

      setUser(newUser);
      setProfile({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        phone: newUser.phone,
        is_admin: newUser.is_admin,
      });
      localStorage.setItem('dummy_user', JSON.stringify(newUser));
      localStorage.setItem('dummy_profile', JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        avatar_url: newUser.avatar_url,
        phone: newUser.phone,
        is_admin: newUser.is_admin,
      }));
      return { error: null };
    } catch (error) {
      return { error: 'Registration failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('dummy_user');
    localStorage.removeItem('dummy_profile');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        logout: signOut,
        isAdmin: profile?.is_admin ?? false,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
