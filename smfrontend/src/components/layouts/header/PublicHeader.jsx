import { Link } from 'react-router-dom';
import Magnifier from '../../icons/Magnifier';
import Button from '../../ui/Button';

export default function PublicHeader() {
  return (
    <header className="bg-parchment text-ink-black p-4 shadow-md font-eb-garamond font-semibold">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold font-cinzel">
          <Link to="/home">Sophos Map</Link>
        </h1>
        
        <div className="flex items-center gap-4">

          <Magnifier />
          <Button as={Link} to='/login' variant='gold' >Iniciar sesión</Button>
          <Button as={Link} to='/register' variant='brown' >Registrarse</Button>

        </div>
      </div>
    </header>
  );
}


// <Link 
// to="/login" 
// className="px-4 py-2 bg-antique-gold rounded hover:bg-deep-sepia transition"
// >
// Iniciar sesión
// </Link>
// <Link 
// to="/register" 
// className="px-4 py-2 bg-warm-gray rounded hover:bg-gray-700 transition"
// >
// Registrarse
// </Link>