import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import TimelineItem from './TimelineItem';
import PhilosopherInfo from './PhilosopherInfo';
import api from '../services/api';

export default function Timeline() {
  const containerRef = useRef(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [philosophers, setPhilosophers] = useState([]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const fetchFavorites = async () => {
      try {
        const { data } = await api.get('/users/favorites');
        setFavorites(data);
      } catch (error) {
        console.error('Error al obtener favoritos:', error);
      }
    };
    fetchFavorites();
  }, []);

    useEffect(() => {
      const fetchPhilosophers = async () => {
        try {
          const { data } = await api.get('/philosophers');
          setPhilosophers(data);
        } catch (error) {
          console.error('Error al obtener filósofos:', error);
        }
      };
      fetchPhilosophers();
    }, []);

  return (
    <div className="relative w-full h-full ">
      {/* Contenedor con scroll interno */}
      <div
        ref={containerRef}
        className="relative h-[80vh] w-full overflow-y-auto"
      >

        {/* Elementos de la línea de tiempo */}
        <motion.div
          className="flex flex-col items-center pt-8 pb-16 pl-4 pr-4 gap-y-6"
        >
          {philosophers.map((philosopher, index) => {
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
        <PhilosopherInfo 
          philosopher={selectedPhilosopher}
          favorites={favorites}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  );
}