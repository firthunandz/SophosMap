import FormGroup from "../ui/FormGroup";
import Button from "../ui/Button";
import { Link } from "react-router-dom";

export default function AuthForm({
  title,
  fields,
  onSubmit,
  buttonText,
  error,
  linkText,
  linkTo,
  extraLink
}) {
  return (
    <div className="md:w-full max-w-md p-4 md:p-8 space-y-8 bg-ivory rounded-lg shadow my-4 sm:my-10">
      <h2 className="text-2xl sm:text-3xl font-bold text-center font-cinzel text-warm-brown">{title}</h2>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="mt-8 xs:space-y-2 md:space-y-6" onSubmit={onSubmit}>
        {fields.map((field) => (
          <FormGroup key={field.name} label={field.label}>
            <input
              {...field.register}
              type={field.type}
              name={field.name}
              id={field.name}
              className={`w-full border border-warm-gray rounded px-3 py-1 sm:py-2 bg-ivory ${
                field.error ? 'border-red-500' : ''
              }`}
            />
            {field.error && (
              <p className="mt-1 text-sm text-red-600">{field.error.message}</p>
            )}
          </FormGroup>
        ))}

        <Button type="submit" variant="gold" className="w-full">
          {buttonText}
        </Button>
      </form>

      {linkText && linkTo && (
        <div className="text-center">
        <Link to={linkTo} className="text-ink-black hover:text-ink-black/80 hover:underline">
          {linkText}
        </Link>
        </div>
      )}

      {extraLink && (
        <div className="text-center mt-2">
          <Link to={extraLink.to} className="text-sm text-warm-gray hover:underline">
            {extraLink.label}
          </Link>
        </div>
      )}
    </div>
  );
}
