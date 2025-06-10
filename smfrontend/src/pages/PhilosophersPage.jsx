import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchContext } from '../context/SearchContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import SearchInput from '../components/ui/SearchInput';

const PhilosophersPage = () => {
  const [philosophers, setPhilosophers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { results, setResults } = useContext(SearchContext);
  const [query, setQuery] = useState("");

  // const sortPhilosophers = (philosophers) => {
  //   return philosophers.sort((a, b) => new Date(a.fecha_nacimiento) - new Date(b.fecha_nacimiento));
  // };

  const fetchPhilosophers = async () => {
    try {
      const response = await api.get('/philosophers');
      const ordered = response.data
        .slice()
        .sort((a, b) => (a.fecha_orden ?? 0) - (b.fecha_orden ?? 0));
      setPhilosophers(ordered);
      setResults(ordered);
    } catch (error) {
      console.error('Error fetching philosophers:', error);
    }
  };

  useEffect(() => {
    fetchPhilosophers();
  }, [location.key]);

  useEffect(() => {
    if (results.length > 0) {
      setPhilosophers(results);
    }
  }, [results]);

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.append("q", query);
      }
      const { data } = await api.get(`/philosophers/search?${params.toString()}`);
      setResults(data);
    } catch (err) {
      console.error("Error en búsqueda:", err);
    }
  };

  const handlePhilosopherClick = (id) => {
    navigate(`/admin/philosophers/${id}`);
  };

  const handleNewPhilosopher = () => {
    navigate('/admin/philosophers/new');
  };

  const handleShowAll = () => {
    setQuery("");
    setResults([]);
    fetchPhilosophers(); 
  };

  return (
    <div className="philosophers-page max-w-screen-lg mx-auto px-4 py-6">
      <h1 className="text-center text-4xl font-cinzel text-ink-black mb-4">Filosofos</h1>

      <div className="flex justify-between gap-x-6 items-center mb-4">
        <SearchInput 
          value={query}
          onChange={(e) => setQuery(e.target.value)} 
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-grow"
        />
        <Button onClick={handleSearch} variant="gold">Buscar</Button>
        <Button onClick={handleShowAll} variant="gold">Todos</Button>
        <Button onClick={handleNewPhilosopher} variant="gold">Nuevo</Button>
      </div>

      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Nombre</th>
            <th className="px-4 py-2 border-b text-left">Fecha de Nacimiento</th>
            <th className="px-4 py-2 border-b text-left">Era</th>
          </tr>
        </thead>
        <tbody>
          {philosophers.map((philosopher) => (
            <tr 
              key={philosopher.id} 
              className="cursor-pointer hover:bg-warm-gray"
              onClick={() => handlePhilosopherClick(philosopher.id)}
            >
              <td className="px-4 py-2 border-b">{philosopher.nombre}</td>
              <td className="px-4 py-2 border-b">{philosopher.fecha_texto}</td>
              <td className="px-4 py-2 border-b">{philosopher.era}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PhilosophersPage;