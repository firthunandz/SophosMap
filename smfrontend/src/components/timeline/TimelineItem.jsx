import { useFavorites } from '../../context/FavoritesContext';
import api from '../../services/api';

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
      className={`relative w-full min-h-[100px] flex ${
        side === 'left' ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Punto central de la línea */}
      <span className="absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-antique-gold border-4 border-warm-brown z-10" />

      {/* Tarjeta */}
      <div
        onClick={async () => {
          try {
            const { data } = await api.get(`/philosophers/${philosopher.id}`);
            onSelect(data);
          } catch (err) {
            console.error('Error al obtener filósofo completo:', err);
          }
        }}
        className={`
          w-80 sm:w-96 py-5 px-4 bg-parchment/80 border border-antique-gold 
          rounded-lg shadow-lg relative cursor-pointer transition hover:scale-[1.02]
          ${side === 'left' ? 'left-[20%] mr-[20%]' : 'right-[20%] ml-[20%]'}
        `}
      >
        {/* Estrella de favorito */}
        <button
          onClick={toggleFavorite}
          className={`text-3xl absolute top-0 right-2 ${
            isFavorite ? 'text-yellow-600' : 'text-gray-500'
          } hover:text-yellow-500 transition-colors`}
          title="Marcar como favorito"
        >
          {isFavorite ? '★' : '☆'}
        </button>

        {/* Contenido */}
        <h2 className="font-cinzel text-xl font-semibold text-warm-brown mb-1 text-center">
          {philosopher.nombre}
        </h2>
        <p className="text-sm text-deep-sepia text-center">
          {philosopher.fecha_texto}
        </p>
        <p className="text-sm italic text-center text-ink-black/80">
          {philosopher.era}
        </p>
      </div>
    </div>
  );
}