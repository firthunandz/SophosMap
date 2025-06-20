import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Magnifier from '../../icons/Magnifier';
import Button from '../../ui/Button';
import { Menu, X } from 'lucide-react'; 

export default function PublicHeader() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const showMagnifier = location.pathname === "/sophosmap" || location.pathname.match(/^\/users\/profile\/\d+/);


  return (
    <header className="bg-parchment text-ink-black xs:px-4 xs:py-1 sm:px-8 md:px-10 md:py-2 lg:px-34 lg:py-4 shadow-md font-eb-garamond">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-xl font-cinzel font-bold md:text-4xl">
          <Link to="/home">Sophos Map</Link>
        </h1>

        <Button
          onClick={() => setOpen(o => !o)}
          variant="transparent"
          size="sm"
          className="sm:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X size={24}/> : <Menu size={24}/>}
        </Button>

        <div className="hidden sm:flex items-center gap-4">
          {showMagnifier && <Magnifier />}
          <Button as={Link} to='/login' variant='gold' className='sm:text-xs sm:font-bold sm:py-1 md:py-2 md:font-semibold md:text-base lg:text-xl'>
            Iniciar sesión
          </Button>
          <Button as={Link} to='/register' variant='brown' className='sm:text-xs sm:font-bold sm:py-1 md:py-2 md:font-semibold md:text-base lg:text-xl'>
            Registrarse
          </Button>
        </div>
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
            <li>
              <Button
                as={Link}
                to='/login'
                variant='transparent'
                size="md"
                className="w-full justify-start rounded-none"
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </Button>
            </li>
            <li>
              <Button
                as={Link}
                to='/register'
                variant='transparent'
                size="md"
                className="w-full justify-start rounded-none"
                onClick={() => setOpen(false)}
              >
                Registrarse
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}