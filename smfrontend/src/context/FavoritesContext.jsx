import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useSpinner } from './SpinnerContext';
import { useAuth } from './authContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showSpinner, hideSpinner } = useSpinner();
  const { user, isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    console.log('[fetchFavorites] Ejecutando para user:', user?.id);
    if (!isAuthenticated || !user) {
      setFavorites([]);
      return;
    }
    try {
      showSpinner();
      const res = await api.get('/users/favorites');
      setFavorites(res.data || []);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      setFavorites([]);
    } finally {
      hideSpinner();
    }
  }, [user, isAuthenticated, showSpinner, hideSpinner]);

  // useEffect(() => {
  //   fetchFavorites();
  // }, [fetchFavorites]);

  // useEffect(() => {
  //   if (user) {
  //     showSpinner();
  //     fetchFavorites().finally(() => hideSpinner());
  //   } else {
  //     setFavorites([]);
  //   }
  // }, [fetchFavorites, user, showSpinner, hideSpinner]);
  useEffect(() => {
    let isFetched = false;
    if (isAuthenticated && user && !isFetched) {
      isFetched = true;
      fetchFavorites().catch((error) => {
        console.error('Error en useEffect fetchFavorites:', error);
        isFetched = false; // Permitir reintentos si falla
      });
    }
    return () => {
      isFetched = false; // Limpiar al desmontar
    };
  }, [fetchFavorites, isAuthenticated, user]);

  const addFavorite = async (philosopher) => {
    try {
      showSpinner();
      await api.post('/users/favorites', { philosopherId: philosopher.id });
      setFavorites(prev => [...prev, philosopher]);
    } catch (error) {
      console.error('Error al agregar favorito:', error);
    } finally {
      hideSpinner();
    }
  };

  const removeFavorite = async (philosopherId) => {
    try {
      showSpinner();
      await api.delete(`/users/favorites/${philosopherId}`);
      setFavorites(prev => prev.filter(fav => fav.id !== philosopherId));
    } catch (error) {
      console.error('Error al quitar favorito:', error);
    } finally {
      hideSpinner();
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
