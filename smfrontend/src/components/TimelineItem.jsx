//import

export default function TimelineItem({ philosopher, side, onSelect }) {

  return (
    <div
      className={`relative w-full min-h-[100px] flex ${side === "left" ? "justify-start" : "justify-end"}`}
  
    >
      {/* Punto de la línea */}
      <span className="absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-antique-gold border-2 border-white" />

      {/* Tarjeta */}
      <div 
        className={`w-96 p-4 cursor-pointer bg-white shadow rounded relative flex flex-col items-center ${side === "left"  ? "left-[20%] mr-[20%]" : "right-[20%] ml-[20%]"}`}
        onClick={() => onSelect(philosopher)}
      >
        <h2 className="font-cinzel text-xl">{philosopher.nombre}</h2>
        <p className="text-sm">{philosopher.fecha_nacimiento}</p>
        <p className="text-sm italic">{philosopher.era}</p>
      </div>
    </div>
  );
}