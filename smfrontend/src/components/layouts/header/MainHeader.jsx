import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import Magnifier from '../../icons/Magnifier';
import Button from '../../ui/Button';

const MainHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const showMagnifier = location.pathname === "/sophosmap" || location.pathname.match(/^\/users\/profile\/\d+/);

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

          {showMagnifier && (
            <Magnifier />
          )}
          
          {user.role === "admin" && (
            <Button as={Link} to="/admin" variant="gold">
              Admin Panel
            </Button>
          )}

          <Button as={Link} to={`/users/profile/${user.id}`} variant="gold">
            {user.nickname}
          </Button>

          <Button onClick={handleLogOut} variant="gray">
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;