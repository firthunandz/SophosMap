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
      className={`relative w-full min-h-[100px] flex justify-center md:${
        side === 'left' ? 'justify-start' : 'justify-end'
      }`}
    >
      <span className="hidden 2xl:inline-block absolute left-1/2 -translate-x-1/2 top-12 
          w-5 h-5 rounded-full 
          bg-antique-gold border-4 border-warm-brown z-10" />

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
          cursor-pointer transition hover:scale-[1.02]
          w-10/12
          sm:w-6/12
          md:w-80
          lg:w-96
          
          py-5 px-4 bg-parchment/80 border border-antique-gold rounded-lg shadow-lg relative

          ${side === 'left' ? 'md:left-[25%] md:mr-[20%]' : 'md:right-[25%] md:ml-[20%]'}
        `}
      >

        <button
          onClick={toggleFavorite}
          className={`text-2xl md:text-3xl lg:text-4xl absolute top-0 right-2 ${
            isFavorite ? 'text-yellow-600' : 'text-gray-500'
          } hover:text-yellow-500 transition-colors`}
          title="Marcar como favorito"
        >
          {isFavorite ? '★' : '☆'}
        </button>

        <h2 className="font-cinzel text-lg sm:text-xl lg:text-2xl font-semibold text-warm-brown mb-1 text-center">
          {philosopher.nombre}
        </h2>
        <p className="text-sm md:text-base text-deep-sepia text-center mb-0.5">
          {philosopher.fecha_texto}
        </p>
        <p className="text-sm lg:text-base italic text-center text-ink-black/80">
          {philosopher.era}
        </p>
      </div>
    </div>
  );
}