import { useEffect, useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import ModalHeader from '../philosophers/ModalHeader';
import ModalContent from '../philosophers/ModalContent';
import ModalFooter from '../philosophers/ModalFooter';

const PhilosopherInfo = ({ philosopher: propPhilosopher, onClose }) => {
  const token = localStorage.getItem('token');
  const [philosopher, setPhilosopher] = useState(propPhilosopher || null);
  const [error, setError] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const isFavorite = philosopher?.id 
  ? favorites.some(fav => fav.id === philosopher.id)
  : false;

  useEffect(() => {
    setPhilosopher(propPhilosopher);
    }, [propPhilosopher]);

  const toggleFavorite = async () => {
    if (!token) {
      alert('Iniciá sesión para marcar como favorito');
      return;
    }

    try {
      if (isFavorite) {
        removeFavorite(philosopher.id);
      } else {
        addFavorite(philosopher);
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  if (error) return <div className="p-6">{error}</div>;
  if (!philosopher) return <div className="p-6">Cargando filósofo...</div>;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-parchment/80 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-warm-brown">
        <ModalHeader
          philosopher={philosopher}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          onClose={onClose}
        />

        <ModalContent philosopher={philosopher} />

        <ModalFooter onClose={onClose} />
      </div>
    </div>
  );
}

export default PhilosopherInfo;