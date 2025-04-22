import { Link, useNavigate } from 'react-router-dom';
import MapImg from '../assets/images/mapa.jpg';
import { useAuth } from '../context/authContext';
import ModalError from '../components/modals/ModalError';
import bgImg from '../assets/images/papiro.jpg';

export default function Home() {
  const { authError, setAuthError, logout } = useAuth();
  const navigate = useNavigate();

  const handleModalClose = () => {
    setAuthError(null);
    logout();
    navigate('/login');
  };

  return (
    <div
      className="relative flex flex-col h-full w-full bg-auto bg-repeat bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-parchment/40 backdrop-brightness-95 z-0" />
      <div className="relative z-10 flex-grow flex flex-col items-center p-4 font-eb-garamond">
        <section className="flex flex-col items-center gap-y-2">
          <h1 className="text-5xl font-bold mb-8 font-cinzel text-warm-brown">
            Bienvenido a Sophos Map
          </h1>
          <p className="text-xl text-deep-sepia font-medium">
            Sophos Map es una línea temporal interactiva que te guía por la historia de la filosofía, desde la antigüedad hasta la era moderna.
          </p>
          <p className="text-xl text-deep-sepia font-medium">
            Descubre a los grandes pensadores, sus ideas, obras y legados, mientras navegas por un recorrido dinámico y envolvente.
          </p>
        </section>

        <section className="mt-10">
          <h3 className="text-center text-xl mb-2">
            Haz click en el mapa para explorar a los grandes pensadores a través del tiempo.
          </h3>
          <Link to="/sophosmap">
            <img
              src={MapImg}
              alt="Link al mapa filosófico"
              className="w-[800px] h-[450px] max-w-full"
            />
          </Link>
        </section>
      </div>

      {authError && (
        <ModalError
          title="Tu sesión expiró"
          message={authError}
          onClose={handleModalClose}
          buttonText="Iniciar sesión"
        />
      )}
    </div>
  );
}

{/* <>
<div className="flex-grow flex flex-col items-center justify-center p-4 font-eb-garamond">
  <section className='flex flex-col items-center gap-y-2'>
    <h1 className="text-5xl font-bold mb-8 font-cinzel text-warm-brown">Bienvenido a Sophos Map</h1>
    <p className='text-xl text-deep-sepia font-medium'>Sophos Map es una línea temporal interactiva que te guía por la historia de la filosofía, desde la antigüedad hasta la era moderna.</p>
    <p className='text-xl text-deep-sepia font-medium'>Descubre a los grandes pensadores, sus ideas, obras y legados, mientras navegas por un recorrido dinámico y envolvente.</p>
  </section>

  <section className='mt-10'>
    <h3 className='text-center text-xl mb-2'>Haz click en el mapa para explorar a los grandes pensadores a través del tiempo.</h3>
    <Link 
      to="/sophosmap" 
      className=""
      >
      <img src={MapImg} alt="Link al mapa filosofico" className='w-[800px] h-[450px]' />
    </Link>
  </section>
</div>

{authError && (
  <ModalError
    title={'Tu sesión expiró'}
    message={authError}
    onClose={handleModalClose}
    buttonText={'Iniciar sesion'}
  />
)}
</> */}

//'https://placehold.co/800x450'