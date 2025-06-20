import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import TimelineItem from '../components/timeline/TimelineItem';
import ModalPhiloInfo from '../components/modals/ModalPhiloInfo';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/authContext';
import ModalError from '../components/modals/ModalError';
import bgImg from '../assets/images/papiro.jpg';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { authError, setAuthError, logout } = useAuth();

  const [userData, setUserData] = useState(null);
  const [favoritePhilosophers, setFavoritePhilosophers] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingFavs, setLoadingFavs] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/profile/${id}`);
        setUserData(data);
      } catch (err) {
        const status = err.response?.status;
        const message = err.response?.data?.error || 'Error al cargar el perfil';
        if (status === 404) setError('No se encontró el usuario');
        else if (status !== 401) setError(message);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (favorites.length === 0) {
      setFavoritePhilosophers([]);
      setLoadingFavs(false);
      return;
    }
    setLoadingFavs(true);
    Promise.all(
      favorites.map(fav =>
        api.get(`/philosophers/${fav.id}`)
          .then(res => res.data)
          .catch(() => null)
      )
    ).then(list => {
      setFavoritePhilosophers(list.filter(p => p));
      setLoadingFavs(false);
    });
  }, [favorites]);

  const handleModalClose = () => {
    setAuthError(null);
    logout();
    navigate('/login');
  };

  if (authError) {
    return (
      <ModalError
        title="Tu sesión expiró"
        message={authError}
        onClose={handleModalClose}
        buttonText="Iniciar sesión"
      />
    );
  }
  if (loadingProfile || loadingFavs) {
    return <div className="p-4">Cargando perfil...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }
  if (!userData) {
    return <div className="p-4">No se encontró el usuario</div>;
  }

  return (
    <div
      className="relative flex flex-col h-full w-full bg-center bg-cover bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-parchment/40 backdrop-brightness-95 z-0" />
      <div className="relative z-10 container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold font-cinzel text-warm-brown mb-2">
          Perfil de {userData.nickname || userData.username}
        </h1>
        <div className="h-[2px] w-24 bg-antique-gold mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-deep-sepia">
          Filósofos favoritos
        </h2>
      </div>

      {favoritePhilosophers.length === 0 ? (
        <p className="text-ink-black">Este usuario no tiene filósofos favoritos aún.</p>
      ) : (
        <div className="relative w-full h-[70vh] overflow-y-auto">
          <div className="flex flex-col items-center pt-8 pb-16 px-4 gap-y-6">
            {favoritePhilosophers.map((philo, index) => {
              const side = index % 2 === 0 ? 'left' : 'right';
              return (
                <TimelineItem
                  key={philo.id}
                  philosopher={philo}
                  side={side}
                  isFavorite={true}
                  onSelect={setSelectedPhilosopher}
                />
              );
            })}
          </div>
        </div>
      )}

      {selectedPhilosopher && (
        <ModalPhiloInfo
          philosopher={selectedPhilosopher}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  );
};

export default Profile;