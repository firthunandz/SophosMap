//import

export default function TimelineItem({ name, birth_date, era, side }) {

  return (
    <div
      className={`relative w-full min-h-[100px] flex ${side === "left" ? "justify-start" : "justify-end"}`}
    >
      {/* Punto de la línea */}
      <span className="absolute left-1/2 -translate-x-1/2 top-8 w-5 h-5 rounded-full bg-antique-gold border-2 border-white" />

      {/* Tarjeta */}
      <div className={`w-64 p-4 bg-white shadow rounded relative flex flex-col items-center ${side === "left"  ? "left-[30%] mr-[20%]" : "right-[30%] ml-[20%]"}`}>
        <h2 className="font-cinzel text-xl">{name}</h2>
        <p className="text-sm">{birth_date}</p>
        <p className="text-sm italic">{era}</p>
      </div>
    </div>
  );
}