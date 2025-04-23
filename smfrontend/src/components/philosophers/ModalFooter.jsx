export default function ModalFooter({ onClose }) {
  return (
    <div className="bg-warm-gray px-4 py-3 rounded-b-lg text-right">
      <button
        onClick={onClose}
        className="px-4 py-1 bg-warm-brown text-ivory rounded hover:bg-opacity-90 transition font-semibold"
      >
        Cerrar
      </button>
    </div>
  );
}