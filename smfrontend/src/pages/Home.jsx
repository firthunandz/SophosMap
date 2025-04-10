import { Link } from 'react-router-dom';
import MapImg from '../assets/images/mapa.jpg'

export default function Home() {
  return (
      <div className="flex-grow flex flex-col items-center justify-center p-4 font-eb-garamond">
        <section className='flex flex-col items-center gap-y-2'>
          <h1 className="text-5xl font-bold mb-8 font-cinzel text-warm-brown">Bienvenido a Sophos Map</h1>
          <p className='text-xl text-deep-sepia font-medium'>Sophos Map es una línea temporal interactiva que te guía por la historia de la filosofía, desde la antigüedad hasta la era moderna.</p>
          <p className='text-xl text-deep-sepia font-medium'>Descubre a los grandes pensadores, sus ideas, obras y legados, mientras navegas por un recorrido dinámico y envolvente.</p>
        </section>

        <section className='mt-10'>
          <h3 className='text-center text-xl mb-2'>Haz click en el mapa para explorar a los grandes pensadores a través del tiempo.</h3>
          <Link 
            to="/sophosmap" 
            className=""
            >
            <img src={MapImg} alt="Link al mapa filosofico" className='w-[800px] h-[450px]' />
          </Link>
        </section>
      </div>
  );
}

//'https://placehold.co/800x450'