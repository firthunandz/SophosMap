import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const onLogout = () => {
    const redirectPath = logout();
    navigate(redirectPath);  // Redirige a la ruta especificada
  };

  return (
    <>
      <header className="bg-parchment text-ink-black p-4 shadow-md font-eb-garamond font-semibold ">
        <div className="container mx-auto flex items-center">
          <h1 className="text-2xl font-bold font-cinzel">
            <Link to="/home">
              Sophos Map
            </Link>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to={`/users/profile/${user.id}`} 
            className="px-4 py-2 bg-antique-gold/80 rounded hover:bg-antique-gold transition"
          >
            {user.nickname}
          </Link>

          <Link 
            to="/sophosmap" 
            className="px-4 py-2 bg-antique-gold/80 rounded hover:bg-antique-gold transition"
          >
            Timeline
          </Link>

          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-warm-gray/80 rounded hover:bg-warm-gray transition"
          >
            Cerrar sesión
          </button>

        </div>
      </header>
    </>
  );
};

export default AdminHeader;