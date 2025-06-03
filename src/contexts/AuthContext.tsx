
'use client';

import type { User as FirebaseUser, IdTokenResult } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase/config';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

export interface AuthUser extends FirebaseUser {
  // You can add custom properties here if needed by merging with FirebaseUser
  // For example: isAdmin?: boolean;
  // token?: string; // if you plan to use idToken
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<AuthUser>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  // add other methods like signInWithGoogle if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Cast to AuthUser if you have extended properties
        setUser(firebaseUser as AuthUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user && displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    // Firebase onAuthStateChanged will handle setting the user state
    return userCredential.user as AuthUser;
  };

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Firebase onAuthStateChanged will handle setting the user state
    return userCredential.user as AuthUser;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null); // Explicitly set user to null
    router.push('/auth/login'); // Or wherever you want to redirect after logout
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
