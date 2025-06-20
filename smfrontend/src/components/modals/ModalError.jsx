const ModalError = ({ title, message, onClose, buttonText }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white rounded-md sm:max-w-sm shadow-lg text-center pointer-events-auto z-50 p-4 sm:p-6 md:p-8 sm:w-3/4 md:w-1/2 lg:w-1/3">
        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition sm:px-4 sm:py-2 block mx-auto sm:inline-block"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ModalError;