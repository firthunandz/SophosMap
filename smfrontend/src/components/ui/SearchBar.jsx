import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import { useSpinner } from "../../context/SpinnerContext";
import api from "../../services/api";
import Button from "./Button";
import SearchInput from "./SearchInput";

const SearchBar = () => {
  const { visible, toggleSearchBar, setResults } = useContext(SearchContext);
  const [query, setQuery] = useState("");
  const { showSpinner, hideSpinner } = useSpinner();
  const [showFilters, setShowFilters] = useState(false); 
  const [selectedEras, setSelectedEras] = useState([]);
  const [selectedReligions, setSelectedReligions] = useState([]);
  const [selectedSchools, setSelectedSchools] = useState([]);

  const eras = [
    "Presocráticos", "Clásica griega", "Helenística", "Imperial romana", 
    "Antigüedad tardía", "Alta Edad Media", "Edad Media", "Renacimiento", 
    "Siglo de Oro", "Ilustración", "Romanticismo", "Siglo XIX", 
    "Finales siglo XIX–inicios XX", "Siglo XX", "Finales siglo XX–inicios XXI", 
    "Siglo XXI"
  ];

  const religions = [
    "Ateísmo","Cristianismo","Judaísmo","Islam","Budismo",
    "Panteísmo","Deísmo","Zoroastrismo","Hinduismo","Protestantismo",
    "Agnosticismo","Epicureísmo","Racionalismo teísta","Taoísmo",
    "Politeísmo","Yahvismo","Confucianismo","Anglicanismo","Otra"
  ];

  const schools = [
    "Presocrática", "Platonismo", "Peripatética", "Estoicismo", "Epicureísmo", "Escéptica",
    "Escolástica", "Renacimiento", "Ilustración", "Idealismo alemán", "Positivismo",
    "Marxismo", "Pragmatismo", "Existencialismo", "Filosofía analítica", "Continental",
    "Feminismo", "Postcolonial", "Taoísmo", "Confucianismo", "Hinduismo", "Budismo", "Otros"
  ];


  const handleSearch = async () => {
    showSpinner();
    try {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.append("q", query);
    }

    if (selectedEras.length > 0) {
      params.append("eras", selectedEras.join(","));
    }

    if (selectedReligions.length) {
      params.append("religions", selectedReligions.join(","));
    }

    if (selectedSchools.length) {
      params.append("schools", selectedSchools.join(","));
    }

    const { data } = await api.get(`/philosophers/search?${params.toString()}`);
    setResults(data);
    } catch (err) {
    console.error("Error en búsqueda:", err);
    } finally {
    hideSpinner();
    }
  };

  const toggleList   = (value, list, setList) =>
  list.includes(value)
    ? setList(list.filter(x => x !== value))
    : setList([...list, value]);

  // const handleEraChange = (event) => {
  //   const selectedEra = event.target.value;
  //   if (selectedEra && !selectedEras.includes(selectedEra)) {
  //     setSelectedEras((prev) => [...prev, selectedEra]);
  //   }
  // };

  // const removeEra = (era) => {
  //   setSelectedEras((prev) => prev.filter((e) => e !== era));
  // };

  // const handleReligionChange = (e) => {
  //   const v = e.target.value;
  //   if (v && !selectedReligions.includes(v)) setSelectedReligions(prev => [...prev, v]);
  // };

  // const removeReligion = (r) => {
  //   setSelectedReligions(prev => prev.filter(x => x !== r));
  // }

  const clearFilters = () => {
    setSelectedEras([]);
    setSelectedReligions([]);
    setSelectedSchools([]);
  };

  if (!visible) return null;

  return (
    <div className="fixed top-[60px] w-full bg-parchment shadow z-50 px-20 py-2 flex items-center gap-3 border-b border-warm-brown">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2 w-full">
          {/* Campo de búsqueda */}
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-grow"
          />

          {/* Botón Buscar */}
          <Button onClick={handleSearch} variant="gold">
            Buscar
          </Button>

          <Button
            onClick={() => setShowFilters((prev) => !prev)} // Mostrar y ocultar filtros
            variant="brown"
          >
            Filtros
          </Button>

          <button
            onClick={toggleSearchBar}
            className="text-deep-sepia hover:text-warm-brown text-2xl font-bold px-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Badges debajo del SearchInput */}
        <div className="mt-2 flex gap-2 flex-wrap">
          {/* {selectedEras.map((era, idx) => (
            <span
              key={idx}
              className="bg-dusty-rose text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              onClick={() => removeEra(era)}
            >
              {era} ✕
            </span>
          ))}
          {selectedReligions.map((rel,i) => (
            <span
              key={`rel-${i}`}
              className="bg-dusty-rose text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              onClick={() => removeReligion(rel)}
            >{rel} ✕</span>
          ))} */}
           {selectedEras.map((e,i) => (
            <span key={i}
              className="bg-dusty-rose text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              onClick={() => toggleList(e, selectedEras, setSelectedEras)}
            >{e} ✕</span>
          ))}
          {selectedReligions.map((r,i) => (
            <span key={i}
              className="bg-dusty-rose text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              onClick={() => toggleList(r, selectedReligions, setSelectedReligions)}
            >{r} ✕</span>
          ))}
          {selectedSchools.map((s,i) => (
            <span key={i}
              className="bg-dusty-rose text-white text-xs px-3 py-1 rounded-full cursor-pointer"
              onClick={() => toggleList(s, selectedSchools, setSelectedSchools)}
            >{s} ✕</span>
          ))}
        </div>

        {/* Dropdown de selección de eras, visible solo al hacer clic en Filtros */}
        {showFilters && (
          <div className="mt-2 flex justify-between">
           <div>
              <select
                defaultValue=""
                onChange={e => toggleList(e.target.value, selectedEras, setSelectedEras)}
                className="border rounded p-2 w-52"
              >
                <option value="" disabled>-- Elige una era --</option>
                {eras.map((e,i) => <option key={i} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Religiones */}
            <div>
              <select
                defaultValue=""
                onChange={e => toggleList(e.target.value, selectedReligions, setSelectedReligions)}
                className="border rounded p-2 w-52"
              >
                <option value="" disabled>-- Elige una religión --</option>
                {religions.map((r,i) => <option key={i} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Escuelas */}
            <div>
              <select
                defaultValue=""
                onChange={e => toggleList(e.target.value, selectedSchools, setSelectedSchools)}
                className="border rounded p-2 w-52"
              >
                <option value="" disabled>-- Elige una escuela --</option>
                {schools.map((s,i) => <option key={i} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Limpiar filtros */}

            <Button onClick={clearFilters} variant="gray">
              Limpiar filtros
            </Button>

          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;