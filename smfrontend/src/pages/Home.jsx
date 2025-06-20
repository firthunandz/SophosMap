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
      className="relative flex flex-col h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-parchment/40 backdrop-brightness-95 z-0" />
      <div className="font-eb-garamond relative z-10 flex-grow flex flex-col items-center justify-between p-4 sm:py-8 sm:justify-around md:py-6 md:gap-y-2 lg:gap-y-3 lg:py-4">
        <section className="flex flex-col items-center gap-y-2 lg:gap-y-2">
          <h1 className="text-xl font-extrabold font-cinzel text-warm-brown sm:text-4xl sm:font-bold md:text-5xl">
            Bienvenido a Sophos Map
          </h1>
          <p className="text-lg text-center text-deep-sepia font-medium max-w-[350px] mx-4 sm:max-w-[500px] sm:mx-0 sm:text-xl lg:max-w-[600px]">
            Sophos Map es una línea temporal interactiva que te guía por la historia de la filosofía, desde la antigüedad hasta la era moderna.
          </p>
          <p className="text-lg text-center text-deep-sepia font-medium max-w-[350px] mx-4 sm:max-w-[500px] sm:mx-0 sm:text-xl lg:max-w-[600px]">
            Descubre a los grandes pensadores, sus ideas, obras y legados, mientras navegas por un recorrido dinámico y envolvente.
          </p>
        </section>

        <section className="flex flex-col items-center gap-y-4">
          <Link to="/sophosmap">
            <div className="size-48 overflow-hidden rounded-full mx-auto sm:size-56 md:rounded-lg md:h-[40vh] md:w-[60vh] xl:h-[45vh] xl:w-[65vh]">
              <img
                src={MapImg}
                alt="Mapa filosófico"
                className="w-full h-full object-cover"
                />
            </div>
          </Link>
          <h3 className="text-center max-w-[300px] sm:max-w-none xs:text-sm sm:text-md md:text-lg sm:mb-2">
            Haz click en el mapa para explorar a los grandes pensadores a través del tiempo.
          </h3>
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