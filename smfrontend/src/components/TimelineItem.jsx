import { useFavorites } from '../context/FavoritesContext';
import api from '../services/api';

export default function TimelineItem({ philosopher, side, onSelect }) {
  const token = localStorage.getItem('token');
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.some(fav => fav.id === philosopher.id);

  const toggleFavorite = async (e) => {
    e.stopPropagation()
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

  return (
    <div
      className={`relative w-full min-h-[100px] flex ${side === "left" ? "justify-start" : "justify-end"}`}
    >
      {/* Punto de la línea */}
      <span className="absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-antique-gold border-2 border-white" />

      {/* Tarjeta */}
      <div 
        className={`w-96 py-4 cursor-pointer bg-white shadow rounded relative flex flex-col items-center ${side === "left"  ? "left-[20%] mr-[20%]" : "right-[20%] ml-[20%]"}`}
        onClick={async () => {
          try {
            const { data } = await api.get(`/philosophers/${philosopher.id}`);
            onSelect(data);
          } catch (err) {
            console.error('Error al obtener filósofo completo:', err);
          }
        }}
      >      
        <button 
          onClick={toggleFavorite}
          className={`text-3xl absolute top-0 right-2 ${isFavorite ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-500 transition-colors`}
        >
          {isFavorite ? '★' : '☆'}
        </button>
    
        <h2 className="font-cinzel text-xl">{philosopher.nombre}</h2>
        <p className="text-sm">{philosopher.fecha_nacimiento}</p>
        <p className="text-sm italic">{philosopher.era}</p>
      </div>
    </div>
  );
}