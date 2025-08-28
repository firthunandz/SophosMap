import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import { useSpinner } from './SpinnerContext';
import { useAuth } from './authContext';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { showSpinner, hideSpinner } = useSpinner();
  const { user } = useAuth();

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      setFavorites([]);
      return;
    }

    try {
      showSpinner();
      const res = await api.get('/users/favorites');
      setFavorites(res.data);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
    } finally {
      hideSpinner();
    }
  }, [user, showSpinner, hideSpinner]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (philosopher) => {
    try {
      await api.post('/users/favorites', { philosopherId: philosopher.id });
      setFavorites(prev => [...prev, philosopher]);
    } catch (error) {
      console.error('Error al agregar favorito:', error);
    }
  };

  const removeFavorite = async (philosopherId) => {
    try {
      await api.delete(`/users/favorites/${philosopherId}`);
      setFavorites(prev => prev.filter(fav => fav.id !== philosopherId));
    } catch (error) {
      console.error('Error al quitar favorito:', error);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
