import FormGroup from "../ui/FormGroup";
import Button from "../ui/Button";

const ReviewForm = ({
  onSubmit,
  isAuthenticated,
  name,
  setName,
  text,
  setText,
  error
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!isAuthenticated && (
        <FormGroup label="Nombre">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
            required
          />
        </FormGroup>
      )}

      <FormGroup label="Tu reseña">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
          rows="4"
          required
        />
      </FormGroup>

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" variant="brown" className="w-full">
        Enviar reseña
      </Button>
    </form>
  );
};

export default ReviewForm;
