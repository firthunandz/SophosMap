import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useSpinner } from '../context/SpinnerContext';

export default function SophosMap() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { user } = useAuth();

  // useEffect(() => {
  //   const loadPhilosophers = async () => {
  //     try {
  //       showSpinner();
  //       // Futura implementación de fetch
  //       const data = await fetchPhilosophers();
  //       setPhilosophers(data);
  //     } finally {
  //       hideSpinner();
  //     }
  //   };
  //   loadPhilosophers();
  // }, []);

  return (
    <>
      {!user && (
        <div className="p-2 rounded-lg text-center">
          <p>
            <Link to="/users/login" className="text-dusty-rose hover:underline">
              Inicia sesión
            </Link> para guardar tus filósofos favoritos
          </p>
        </div>
      )}

      <div className="flex-grow p-4">
        <h1>TIMELINE</h1>
      </div>
    </>
  );
}