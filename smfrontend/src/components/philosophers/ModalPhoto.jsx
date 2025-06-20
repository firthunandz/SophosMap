export default function ModalPhoto({
  philosopher,
  sizeClass = 'size-28 sm:size-40',
  marginClass = 'ml-8',
  frameClass = 'border-4 border-antique-gold',
}) {
  return (
    <div
      className={`
        ${sizeClass} 
        ${marginClass}
        ${frameClass}
        rounded-full
        overflow-hidden
        bg-papyrus
        flex items-center justify-center
        mb-4
      `}
    >
      {philosopher.foto_url ? (
        <img
          src={philosopher.foto_url}
          alt={philosopher.nombre}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-warm-gray font-eb-garamond">No disponible</span>
      )}
    </div>
  );
}