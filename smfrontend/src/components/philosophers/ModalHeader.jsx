export default function ModalHeader({
  philosopher,
  isFavorite,
  toggleFavorite,
  onClose
}) {
  return (
    <div className="bg-antique-gold p-2 sm:p-4 rounded-t-lg">
      <div className="flex justify-between items-center">
        <h2 className="font-cinzel text-xl sm:text-2xl text-white">
          {philosopher.nombre}
        </h2>
        <div className="flex items-center">
          <button
            onClick={toggleFavorite}
            className="text-xl sm:text-2xl mr-2 sm:mr-4 focus:outline-none"
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          >
            {isFavorite
              ? <span className="text-yellow-400">★</span>
              : <span className="text-white">☆</span>
            }
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl sm:text-2xl"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
}