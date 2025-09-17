import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import CadastroModerno from './pages/CadastroModerno';
import LoginModerno from './pages/LoginModerno';
import DashboardDocente from './pages/DashboardDocente';
import DashboardAluno from './pages/DashboardAluno';
import FichasDisciplina from './pages/FichasDisciplina';
import FichasAluno from './pages/FichasAluno';
import DuvidasFicha from './pages/DuvidasFicha';
import './App.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginModerno />} />
        <Route path="/cadastro" element={<CadastroModerno />} />
        
        {/* Rotas protegidas */}
        <Route 
          path="/dashboard-docente" 
          element={
            <ProtectedRoute requiredRole="docente">
              <DashboardDocente />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/docente/disciplina/:disciplinaId/fichas" 
          element={
            <ProtectedRoute requiredRole="docente">
              <FichasDisciplina />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/dashboard-aluno" 
          element={
            <ProtectedRoute requiredRole="aluno">
              <DashboardAluno />
            </ProtectedRoute>
          } 
        />

        {/* Rotas para aluno */}
        <Route 
          path="/aluno/disciplina/:disciplinaId/fichas" 
          element={
            <ProtectedRoute requiredRole="aluno">
              <FichasAluno />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/aluno/ficha/:fichaId/duvidas" 
          element={
            <ProtectedRoute requiredRole="aluno">
              <DuvidasFicha />
            </ProtectedRoute>
          } 
        />
        
        {/* Rota raiz - redireciona baseado no usuário logado */}
        <Route path="/" element={<RedirectBasedOnUser />} />
        
        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// Componente para redirecionar baseado no usuário logado
const RedirectBasedOnUser: React.FC = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    const redirectPath = user.tipo === 'docente' ? '/dashboard-docente' : '/dashboard-aluno';
    return <Navigate to={redirectPath} replace />;
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
};

export default App;
