import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const Profile = () => {
  const { id } = useParams(); // Obtiene el ID de la URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        {userData.nickname || userData.username}'s Profile
      </h1>
    </div>
  );
};

export default Profile;