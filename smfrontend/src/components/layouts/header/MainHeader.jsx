import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authContext';
import Magnifier from '../../icons/Magnifier';
import Button from '../../ui/Button';
import { Menu, X } from 'lucide-react'; 

const MainHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const showMagnifier = location.pathname === "/sophosmap" || location.pathname.match(/^\/users\/profile\/\d+/);

  const handleLogOut = () => {
    logout();
    navigate('/home');
  };

  if (!user) return null;

  return (
    <header className="bg-parchment text-ink-black xs:px-4 xs:py-1 sm:px-8 md:px-10 md:py-2 lg:px-34 lg:py-4 shadow-md font-eb-garamond">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/home" className="text-xl font-cinzel font-bold md:text-4xl">
            Sophos Map
          </Link>
        </div>
        <Button
          onClick={() => setOpen(o => !o)}
          variant="transparent"
          size="sm"
          className="sm:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X size={24}/> : <Menu size={24}/>}
        </Button>

        <nav className="hidden sm:flex items-center gap-4 font-semibold">
          {showMagnifier && <Magnifier />}
          {user.role === "admin" && (
            <Button as={Link} to="/admin" variant="gold" className='sm:text-xs sm:font-bold sm:py-1 md:py-2 md:font-semibold md:text-base lg:text-xl'>
              Admin Panel
            </Button>
          )}
          <Button as={Link} to={`/users/profile/${user.id}`} variant="gold" className='sm:text-xs sm:font-bold sm:py-1 md:py-2 md:font-semibold md:text-base lg:text-xl'>
            {user.nickname}
          </Button>
          <Button onClick={handleLogOut} variant="gray" className='sm:text-xs sm:font-bold sm:py-1 md:py-2 md:font-semibold md:text-base lg:text-xl'>
            Cerrar sesión
          </Button>
        </nav>
      </div>

      {open && (
        <nav className="sm:hidden bg-parchment">
          <ul className="flex flex-col">
            {showMagnifier && (
              <li>
                <Button
                  variant="transparent"
                  size="md"
                  className="w-full justify-start rounded-none"
                  onClick={() => setOpen(false)}
                >
                  <Magnifier />
                </Button>
              </li>
            )}
            {user.role === "admin" && (
              <li>
                <Button
                  as={Link}
                  to="/admin"
                  variant="transparent"
                  size="md"
                  className="w-full justify-start rounded-none"
                  onClick={() => setOpen(false)}
                >
                  Admin Panel
                </Button>
              </li>
            )}
            <li>
              <Button
                as={Link}
                to={`/users/profile/${user.id}`}
                variant="transparent"
                size="md"
                className="w-full justify-start rounded-none"
                onClick={() => setOpen(false)}
              >
                {user.nickname}
              </Button>
            </li>
            <li>
              <Button
                variant="transparent"
                size="md"
                className="w-full justify-start rounded-none"
                onClick={() => {
                  setOpen(false);
                  handleLogOut();
                }}
              >
                Cerrar sesión
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default MainHeader;