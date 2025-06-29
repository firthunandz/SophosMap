import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const AdminPanel = () => {
  const navigate = useNavigate();

  const goToPhilosophers = () => {
    navigate('/admin/philosophers');
  };

  return (
    <div className="flex flex-col items-center py-4 gap-y-4 sm:py-8 sm:gap-y-10">
      <h1 className='text-xl sm:text-3xl font-cinzel text-ink-black '>Panel de administrador</h1>
      <Button onClick={goToPhilosophers}>Filosofos</Button>
    </div>
  );
};

export default AdminPanel;