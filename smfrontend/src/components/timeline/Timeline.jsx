import { useState, useEffect, useRef, useContext } from "react";
import { motion } from "motion/react";
import TimelineItem from "./TimelineItem";
import ModalPhiloInfo from "../modals/ModalPhiloInfo";
import api from "../../services/api";
import SearchBar from "../ui/SearchBar";
import { SearchContext } from "../../context/SearchContext";

export default function Timeline() {
  const containerRef = useRef(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [philosophers, setPhilosophers] = useState([]);
  const [filteredPhilosophers, setFilteredPhilosophers] = useState([]);
  const { results } = useContext(SearchContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchFavorites = async () => {
      try {
        const { data } = await api.get("/users/favorites");
        setFavorites(data);
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      }
    };
    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchPhilosophers = async () => {
      try {
        const { data } = await api.get("/philosophers");
        setPhilosophers(data);
      } catch (error) {
        console.error("Error al obtener filósofos:", error);
      }
    };
    fetchPhilosophers();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
    setFilteredPhilosophers(results);
    } else {
    setFilteredPhilosophers(philosophers);
    }
  }, [results, philosophers]);

  return (
    <>
    <SearchBar />
    <div className="relative w-full h-full ">
      {/* Contenedor con scroll interno */}
      <div
      ref={containerRef}
      className="relative h-[85vh] w-full overflow-y-auto"
      >
      {/* Elementos de la línea de tiempo */}
      <motion.div className="flex flex-col items-center pt-8 pb-16 pl-4 pr-4 gap-y-6">
        {filteredPhilosophers.map((philosopher, index) => {
        const side = index % 2 === 0 ? "left" : "right";

        return (
          <TimelineItem
          key={philosopher.id}
          philosopher={philosopher}
          side={side}
          onSelect={setSelectedPhilosopher}
          favorites={favorites}
          />
        );
        })}
      </motion.div>
      </div>

      {/* Modal de detalles */}
      {selectedPhilosopher && (
      <ModalPhiloInfo
        philosopher={selectedPhilosopher}
        favorites={favorites}
        onClose={() => setSelectedPhilosopher(null)}
      />
      )}
      </div>
    </>
  );
}
