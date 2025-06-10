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
import { AuthProvider } from '../context/authContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import ModalPhiloInfo from '../components/modals/ModalPhiloInfo';
import { Contact } from '../pages/Contact';
import ReviewsPage from '../pages/Reviews';
import { SearchProvider } from '../context/SearchContext';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import CheckEmail from '../pages/CheckEmail';
import VerifyEmail from '../pages/VerifyEmail';
import PhilosophersPage from '../pages/PhilosophersPage';
import PhilosopherDetail from '../pages/PhilosopherDetail';
import NewPhilosopher from '../pages/NewPhilosopher';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SpinnerProvider>
          <SearchProvider>
            <FavoritesProvider>
              <Spinner />
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* Rutas públicas (siempre accesibles) */}
                <Route element={<PublicLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/check-email" element={<CheckEmail />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                </Route>

                {/* Rutas compartidas */}
                <Route path="/home" element={
                    <ConditionalLayout>
                      <Home />
                    </ConditionalLayout>
                  }
                />
                <Route path="/sophosmap" element={
                    <ConditionalLayout>
                      <SophosMap />
                    </ConditionalLayout>
                  }
                />
                <Route path="/contact" element={
                    <ConditionalLayout>
                      <Contact />
                    </ConditionalLayout>
                  } 
                />
                <Route path="/reviews" element={
                    <ConditionalLayout>
                      <ReviewsPage />
                    </ConditionalLayout>
                  } 
                />

                {/* Rutas protegidas */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<MainLayout />}>
                    <Route path="/users/profile/:id" element={<Profile />} />
                    <Route element={<AdminRoute />}>
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/admin/philosophers" element={<PhilosophersPage />} />
                      <Route path="/admin/philosophers/:id" element={<PhilosopherDetail />} />
                      <Route path="/admin/philosophers/new" element={<NewPhilosopher />} />
                    </Route>
                  </Route>
                </Route>

                <Route path="/philosophers/:id" element={<ModalPhiloInfo />} />


                {/* Ruta para manejar 404 - Página no encontrada */}
                <Route path="*" element={<div>404 - Página no encontrada</div>} />
              </Routes>
            </FavoritesProvider>
          </SearchProvider>
        </SpinnerProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}