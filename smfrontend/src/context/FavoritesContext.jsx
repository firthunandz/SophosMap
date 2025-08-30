import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import { useSpinner } from './SpinnerContext';
import { useAuth } from './authContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showSpinner, hideSpinner } = useSpinner();
  const { user, isAuthenticated } = useAuth();
  const isFetched = useRef(false);

  const fetchFavorites = useCallback(async () => {
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
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && user && !isFetched.current) {
      isFetched.current = true;
      fetchFavorites().catch((error) => {
        isFetched.current = false;
      });
    }
    return () => {
      isFetched.current = false;
    };
  }, [fetchFavorites, isAuthenticated]);

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
