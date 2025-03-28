import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import bgImg from '../assets/images/papiro.jpg';
import Timeline from '../components/Timeline';

export default function SophosMap() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full w-full bg-auto bg-repeat bg-fixed" style={{ backgroundImage: `url(${bgImg})` }}>
      {!user && (
        <div className="p-2 rounded-lg text-center">
          <p>
            <Link to="/users/login" className="text-ink-black hover:underline">
              Inicia sesión
            </Link> para guardar tus filósofos favoritos
          </p>
        </div>
      )}
      <div className="w-full mx-auto py-8">
        <Timeline />
      </div>
    </div>
  );
}