import { useContext, useState } from 'react';
import { SearchContext } from '../context/SearchContext';
import { useSpinner } from '../context/SpinnerContext';
import api from '../services/api';

const SearchBar = () => {
  const { visible, toggleSearchBar, setResults } = useContext(SearchContext);
  const [query, setQuery] = useState('');
  const { showSpinner, hideSpinner } = useSpinner();

  const handleSearch = async () => {
    showSpinner();
    try {
      const params = new URLSearchParams({
        q: query
      });

      const { data } = await api.get(`/philosophers/search?${params.toString()}`);
      setResults(data);
    } catch (err) {
      console.error('Error en búsqueda:', err);
    } finally {
      hideSpinner();
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed top-[60px] w-full bg-white shadow z-50 px-4 py-3 flex items-center gap-2">
      <input
        type="text"
        placeholder="Buscar por nombre, año, escuela..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-grow border border-gray-300 p-2 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>

      <button onClick={toggleSearchBar} className="text-gray-600 hover:text-red-500 text-xl font-bold ml-2">✕</button>

    </div>
  );
};

export default SearchBar;

// const [showFilters, setShowFilters] = useState(false);
// const [filters, setFilters] = useState({
//   era: '',
//   escuela: '',
//   religion: '',
// });

// <button
// onClick={() => setShowFilters(prev => !prev)}
// className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300"
// >
// Filtros
// </button>

// {showFilters && (
//   <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
//     <select
//       value={filters.era}
//       onChange={(e) => setFilters({ ...filters, era: e.target.value })}
//       className="border p-2 rounded"
//     >
//       <option value="">Todas las eras</option>
//       <option value="Antigua">Antigua</option>
//       <option value="Medieval">Medieval</option>
//       <option value="Moderna">Moderna</option>
//       <option value="Contemporánea">Contemporánea</option>
//     </select>

//     <select
//       value={filters.escuela}
//       onChange={(e) => setFilters({ ...filters, escuela: e.target.value })}
//       className="border p-2 rounded"
//     >
//       <option value="">Todas las escuelas</option>
//       <option value="Estoicismo">Estoicismo</option>
//       <option value="Epicureísmo">Epicureísmo</option>
//       <option value="Idealismo">Idealismo</option>
//       {/* Agregá las que uses en tu base */}
//     </select>

//     <select
//       value={filters.religion}
//       onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
//       className="border p-2 rounded"
//     >
//       <option value="">Todas las religiones</option>
//       <option value="Cristianismo">Cristianismo</option>
//       <option value="Islam">Islam</option>
//       <option value="Ateísmo">Ateísmo</option>
//       {/* etc */}
//     </select>
//   </div>
// )}