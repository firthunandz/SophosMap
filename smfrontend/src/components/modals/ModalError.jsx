const ModalError = ({ title, message, onClose, buttonText }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-md p-6 max-w-sm shadow-lg text-center pointer-events-auto z-50">
        <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ModalError;