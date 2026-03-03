import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Se houver um token, o <Outlet> renderizará a rota filha correspondente.
  // Caso contrário, redireciona para a página de login.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;