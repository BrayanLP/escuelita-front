
'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';


export interface AuthUser {
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

  useEffect(() => {
    // Simulate loading and setting a dummy user or null
    setTimeout(() => {
      setUser(null); // Or a dummy user object if needed for initial state
      setLoading(false);
    }, 1000); // Simulate a delay
  }, []);

  const signUp = async (email: string, password: string, displayName?: string): Promise<AuthUser> => {
    // Implement your new signup logic here
    console.log('Simulating signup', { email, password, displayName });
    return { uid: 'dummy-id', email: email }; // Return a dummy AuthUser
  };

  const signIn = async (email: string, password: string): Promise<AuthUser> => {
    // Implement your new signin logic here
    console.log('Simulating signin', { email, password });
    return { uid: 'dummy-id', email: email }; // Return a dummy AuthUser
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
