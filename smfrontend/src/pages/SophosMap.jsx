import { useAuth } from '../context/authContext';
import { Link } from 'react-router-dom';
import bgImg from '../assets/images/papiro.jpg';
import Timeline from '../components/timeline/Timeline';

export default function SophosMap() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full w-full bg-center bg-cover bg-no-repeat bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}>
      {!user && (
        <div className="p-2 rounded-lg text-center">
          <p>
            <Link to="/users/login" className="text-ink-black hover:underline">
              Inicia sesión
            </Link> para guardar tus filósofos favoritos
          </p>
        </div>
      )}
      <div className="w-full mx-auto">
        <Timeline />
      </div>
    </div>
  );
}