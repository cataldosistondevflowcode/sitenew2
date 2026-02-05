/**
 * useAuth — Hook de autenticação do Admin CMS
 * 
 * Sprint CMS v17: Adicionado expiração de sessão após 24h de inatividade
 */

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';

// Sprint CMS v17: Constantes de expiração
const SESSION_TIMEOUT_MS = 24 * 60 * 60 * 1000; // 24 horas
const AUTH_STORAGE_KEY = 'admin_auth';
const AUTH_TIMESTAMP_KEY = 'admin_auth_timestamp';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  user: { email: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Sprint CMS v17: Verifica se a sessão expirou
   */
  const checkSessionExpiry = useCallback((): boolean => {
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY);
    if (timestamp) {
      const elapsed = Date.now() - parseInt(timestamp, 10);
      if (elapsed > SESSION_TIMEOUT_MS) {
        return true;
      }
    }
    return false;
  }, []);

  /**
   * Sprint CMS v17: Atualiza timestamp de atividade
   */
  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
    }
  }, [isAuthenticated]);

  /**
   * Sprint CMS v17: Limpa sessão expirada
   */
  const clearExpiredSession = useCallback(() => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
    toast.warning('Sessão expirada', {
      description: 'Sua sessão expirou após 24 horas de inatividade. Faça login novamente.',
    });
  }, []);

  useEffect(() => {
    // Verificar se há sessão salva no localStorage
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    
    if (savedAuth === 'true') {
      // Sprint CMS v17: Verificar se sessão expirou
      if (checkSessionExpiry()) {
        clearExpiredSession();
      } else {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setUser({ email: 'adm@hotmail.com' });
        // Atualizar timestamp ao carregar página
        localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      }
    }
    setLoading(false);
  }, [checkSessionExpiry, clearExpiredSession]);

  // Sprint CMS v17: Verificar expiração periodicamente (a cada 5 min)
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const interval = setInterval(() => {
      if (checkSessionExpiry()) {
        clearExpiredSession();
      }
    }, 5 * 60 * 1000); // 5 minutos
    
    return () => clearInterval(interval);
  }, [isAuthenticated, checkSessionExpiry, clearExpiredSession]);

  // Sprint CMS v17: Atualizar atividade em eventos de usuário
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const events = ['click', 'keydown', 'scroll', 'mousemove'];
    
    // Debounce para não atualizar a cada movimento
    let timeout: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateActivity, 1000);
    };
    
    events.forEach(event => {
      window.addEventListener(event, debouncedUpdate);
    });
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, debouncedUpdate);
      });
      clearTimeout(timeout);
    };
  }, [isAuthenticated, updateActivity]);

  const login = (email: string, password: string): boolean => {
    // Credenciais fixas para administração
    if (email === 'adm@hotmail.com' && password === 'adm123') {
      setIsAuthenticated(true);
      setIsAdmin(true);
      setUser({ email });
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      // Sprint CMS v17: Salvar timestamp do login
      localStorage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    // Sprint CMS v17: Remover timestamp também
    localStorage.removeItem(AUTH_TIMESTAMP_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 