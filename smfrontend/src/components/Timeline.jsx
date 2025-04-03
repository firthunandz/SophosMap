import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import philosophers from '../data/filosofos.json';
import TimelineItem from './TimelineItem';
import PhilosopherInfo from './PhilosopherInfo';

export default function Timeline() {
  const containerRef = useRef(null);
  const [selectedPhilosopher, setSelectedPhilosopher] = useState(null);

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
                key={philosopher.id || index}
                philosopher={philosopher}
                // birth_date={philosopher.birth_date}
                // era={philosopher.era}
                side={side}
                onSelect={setSelectedPhilosopher}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Modal de detalles */}
      {selectedPhilosopher && (
        <PhilosopherInfo 
          philosopher={selectedPhilosopher}
          onClose={() => setSelectedPhilosopher(null)}
        />
      )}
    </div>
  );
}



// const itemVariants = {
//   offscreen: { opacity: 0, scale: 0.8 },
//   onscreen: {
//     opacity: 1,
//     scale: 1,
//     transition: { duration: 0.5 },
//   },
// };

// function TimelineItem({ name, birth_date, era, side }) {
//   const ref = useRef(null);
//   const controls = useAnimation();
//   const isInView = useInView(ref, { once: true, amount: 0.2 });

//   useEffect(() => {
//     if (isInView) {
//       controls.start('onscreen');
//     }
//   }, [controls, isInView]);

//   // Clases dinámicas para alternar lado izquierdo/derecho
//   const alignment = side === 'left' ? 'justify-end' : 'justify-start';
//   const sideMargin = side === 'left' ? 'mr-8' : 'ml-8';

//   return (
//     <motion.div
//       ref={ref}
//       className={`relative flex items-center w-full ${alignment}`}
//       variants={itemVariants}
//       initial="offscreen"
//       animate={controls}
//     >
//       {/* Línea vertical (punto) */}
//       <span className="w-5 h-5 rounded-full bg-antique-gold border-2 border-white absolute left-1/2 -translate-x-1/2" />
      
//       {/* Contenedor de la tarjeta */}
//       <div className={`mt-8 p-4 bg-white shadow rounded w-64 ${sideMargin}`}>
//         <h2 className="font-cinzel text-xl">{name}</h2>
//         <p className="text-sm">{birth_date}</p>
//         <p className="text-sm italic">{era}</p>
//       </div>
//     </motion.div>
//   );
// }

// export default function Timeline() {
//   return (
//     <div className="relative w-full">
//       {/* Línea vertical central */}
//       <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 bg-gray-300 h-full" />
      
//       <div className="flex flex-col items-center">
//         {philosophers.map((phil, index) => {
//           // Alterna entre 'left' y 'right'
//           const side = index % 2 === 0 ? 'left' : 'right';
//           return (
//             <TimelineItem
//               key={index}
//               name={phil.name}
//               birth_date={phil.birth_date}
//               era={phil.era}
//               side={side}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }
