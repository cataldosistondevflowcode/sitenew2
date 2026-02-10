import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AdminRouteProps {
  children: React.ReactNode;
}

// Sprint v23.1: Verificar isAdmin além de isAuthenticated (fix de segurança)
const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Aguardar o carregamento da verificação de autenticação
  if (loading) {
    return <div style={{ padding: '20px' }}>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Sprint v23.1: Barrar usuário autenticado sem role admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute; 