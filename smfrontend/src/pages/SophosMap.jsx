import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export default function SophosMap() {
  const { user } = useAuth();

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