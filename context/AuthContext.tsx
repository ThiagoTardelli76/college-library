'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email?: string;
  nif?: string;
  type: 'admin' | 'student';
}

interface AuthContextType {
  user: User | null;
  login: (type: 'admin' | 'student', credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (type: 'admin' | 'student', credentials: any) => {
    try {
      const endpoint = type === 'admin' ? '/admin/login' : '/student/login';
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // ← Isso deve corresponder ao supports_credentials do backend
        body: JSON.stringify(credentials)
      });
  
      if (!response.ok) throw new Error('Credenciais inválidas');
      
      const data = await response.json();
      const userData = {
        id: data.user.id,
        name: data.user.name,
        type: type,
        email: data.user.email
      };
  
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      const redirectPath = type === 'admin' ? '/admin/dashboard' : '/';
      router.push(redirectPath);
    
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}