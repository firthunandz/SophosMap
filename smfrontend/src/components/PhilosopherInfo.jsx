import { useEffect, useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';

export default function PhilosopherInfo({ philosopher: propPhilosopher, onClose }) {
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
        addFavorite(philosopher.id);
      }
    } catch (error) {
      console.error('Error al actualizar favoritos:', error);
    }
  };

  if (error) return <div className="p-6">{error}</div>;
  if (!philosopher) return <div className="p-6">Cargando filósofo...</div>;

  const renderSimpleField = (label, value) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="mb-4">
        <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
        <p className="text-gray-800">{value}</p>
      </div>
    );
  };

  const renderListField = (label, items, itemKey = 'title') => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li key={index} className="text-gray-800">
              {typeof item === 'object' ? item[itemKey] : item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderWorks = (label, obras) => {
    if (!obras || obras.length === 0) return null;
    
    return (
      <div className="mb-4">
        <h3 className="font-cinzel font-bold text-lg text-antique-gold">{label}</h3>
        <ul className="list-disc pl-5">
          {obras.map((obra, index) => (
            <li key={index} className="text-gray-800">
              <strong>{obra.titulo}</strong>
              {obra.descripcion && ` - ${obra.descripcion}`}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="bg-antique-gold p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="font-cinzel text-2xl text-white">{philosopher.nombre}</h2>
            <div className="flex items-center">

              <button 
                onClick={toggleFavorite}
                className="text-2xl mr-4 focus:outline-none"
                aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                {isFavorite ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-white">☆</span>
                )}
              </button>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                &times;
              </button>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 grid md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div>
            {renderSimpleField("Nombre completo", philosopher.nombre)}
            {renderSimpleField("Fecha de nacimiento", philosopher.fecha_nacimiento)}
            {renderSimpleField("Lugar de nacimiento", philosopher.lugar_nacimiento)}
            {renderSimpleField("Fecha de fallecimiento", philosopher.fecha_muerte)}
            {renderSimpleField("Lugar de fallecimiento", philosopher.lugar_muerte)}
            {renderSimpleField("Época", philosopher.era)}
            {renderSimpleField("Escuela filosófica", philosopher.escuela)}
            {renderSimpleField("Religión", philosopher.religion)}
            {renderSimpleField("Notas", philosopher.notas)}
          </div>

          {/* Columna derecha */}
          <div>
            {renderListField("Ocupación", philosopher.ocupacion)}
            {renderListField("Intereses", philosopher.intereses)}
            {renderListField("Conceptos principales", philosopher.conceptos)}
            {renderListField("Influencias", philosopher.influencias)}
            {renderListField("Estudiantes", philosopher.alumnos)}
            {renderListField("Maestros", philosopher.maestros)}
            {renderListField("Legado", philosopher.legado)}
          </div>

          {/* Obras y libros (ancho completo) */}
          <div className="md:col-span-2">
            {renderListField("Citas famosas", philosopher.citas)}
            {renderWorks("Libros", philosopher.libros)}
            {renderWorks("Obras destacadas", philosopher.obras)}
          </div>
        </div>

        {/* Pie */}
        <div className="bg-gray-100 p-4 rounded-b-lg text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-antique-gold text-white rounded hover:bg-opacity-90 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}