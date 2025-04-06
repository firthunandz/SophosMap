import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import TimelineItem from '../components/TimelineItem';
import PhilosopherInfo from '../components/PhilosopherInfo';
import { useFavorites } from '../context/FavoritesContext';

const Profile = () => {
  const { id } = useParams();
  const { favorites } = useFavorites();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/profile/${id}`);
        setUserData(data);
      } catch (err) {
        console.error('[Profile] Error en la solicitud:', {
          status: err.response?.status,
          data: err.response?.data
        });
        setError(err.response?.data?.error || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) return <div className="p-4">Cargando perfil...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!userData) return <div className="p-4">No se encontró el usuario</div>;

  return (
    <div className="container mx-auto p-4">

      <h1 className="text-3xl font-bold">
        {userData.nickname || userData.username}'s Profile
      </h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Filósofos favoritos</h2>
        {favorites.length === 0 ? (
          <p>Este usuario no tiene filósofos favoritos aún.</p>
        ) : (
          <div className="relative w-full">
            {/* Contenedor con scroll interno si es necesario */}
            <div className="relative max-h-[60vh] overflow-y-auto">
              {/* Elementos de la línea de tiempo */}
              <div className="flex flex-col items-center pt-8 pb-16 pl-4 pr-4 gap-y-6">
                {favorites.map((philosopher, index) => {
                  const side = index % 2 === 0 ? "left" : "right";
                  return (
                    <TimelineItem
                      key={philosopher.id}
                      philosopher={philosopher}
                      side={side}
                      isFavorite={true}
                      onSelect={setSelectedPhilosopher}
                    />
                  );
                })}
              </div>
            </div>
          </div>

        )}

        {selectedPhilosopher && (
          <PhilosopherInfo 
            philosopher={selectedPhilosopher}
            favorites={favorites}
            onClose={() => setSelectedPhilosopher(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;