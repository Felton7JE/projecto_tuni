import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'aluno' | 'docente';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    
    if (requiredRole && user.tipo !== requiredRole) {
      // Redirecionar para o dashboard correto baseado no tipo do usuário
      const redirectPath = user.tipo === 'docente' ? '/dashboard-docente' : '/dashboard-aluno';
      return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
  } catch (error) {
    // Se houver erro ao parsear o usuário, limpar dados e redirecionar
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;