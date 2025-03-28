import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import MainLayout from '../layouts/MainLayout';
import ConditionalLayout from '../layouts/ConditionalLayout';
import Home from '../pages/Home';
import SophosMap from '../pages/SophosMap';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Register from '../pages/Register';
import AdminPanel from '../pages/AdminPanel';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import { SpinnerProvider } from '../context/SpinnerContext';
import { Spinner } from '../context/Spinner';
import { AuthProvider } from '../hooks/useAuth';

export default function AppRouter() {
  return (
    <AuthProvider>

    <SpinnerProvider>
      <BrowserRouter>
        <Spinner />
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Rutas públicas (siempre accesibles) */}
          <Route element={<PublicLayout />}>
            <Route path="/users/login" element={<Login />} />
            <Route path="/users/register" element={<Register />} />
          </Route>

          {/* Rutas compartidas */}
          <Route 
            path="/home" 
            element={
              <ConditionalLayout>
                <Home />
              </ConditionalLayout>
            }
            />
          <Route 
            path="/sophosmap" 
            element={
              <ConditionalLayout>
                <SophosMap />
              </ConditionalLayout>
            }
            />

          <Route path="/sophosmap" element={
            <ConditionalLayout>
              <SophosMap />
            </ConditionalLayout>
          } />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/users/profile/:id" element={<Profile />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

          {/* Ruta para manejar 404 - Página no encontrada */}
          <Route path="*" element={<div>404 - Página no encontrada</div>} />
        </Routes>
      </BrowserRouter>
    </SpinnerProvider>
    </AuthProvider>
  );
}