import ReviewForm from "../forms/ReviewForm";

const ModalReviewForm = ({
  isOpen,
  onClose,
  onSubmit,
  isAuthenticated,
  name,
  setName,
  text,
  setText,
  error
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md relative pointer-events-auto z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Dejanos tu reseña</h2>

        <ReviewForm
          onSubmit={onSubmit}
          isAuthenticated={isAuthenticated}
          name={name}
          setName={setName}
          text={text}
          setText={setText}
          error={error}
        />
      </div>
    </div>
  );
};

export default ModalReviewForm;
