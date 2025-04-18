import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Magnifier from './icons/magnifier';

const MainHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout();
    navigate('/home');
  };

  if (!user) return null;

  return (
    <header className="bg-parchment text-ink-black p-4 shadow-md font-eb-garamond font-semibold">
      <div className="container mx-auto flex justify-between items-center">
        <h2 className="text-2xl font-bold font-cinzel">
          <Link to="/home">Home</Link>
        </h2>
        
        <h1 className="text-3xl font-bold font-cinzel">
          <Link to="/sophosmap">Sophos Map</Link>
        </h1>

        <div className="flex items-center gap-4">

          <Magnifier />
          
          <Link 
            to={`/users/profile/${user.id}`}
            className="px-4 py-2 bg-antique-gold/80 rounded hover:bg-antique-gold transition"
          >
            {user.nickname}
          </Link>

          {user.role === 'admin' && (
            <Link 
              to="/admin" 
              className="px-4 py-2 bg-warm-brown/80 rounded hover:bg-warm-brown transition"
            >
              Admin Panel
            </Link>
          )}

          <button 
            onClick={handleLogOut}
            className="px-4 py-2 bg-warm-gray/80 rounded hover:bg-warm-gray transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;