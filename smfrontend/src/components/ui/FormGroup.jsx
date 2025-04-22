const FormGroup = ({ label, error, children }) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block font-semibold mb-1">{label}</label>
      )}
      {children}
      {error && (
        <span className="text-red-500 text-sm">Este campo es obligatorio</span>
      )}
    </div>
  );
}

export default FormGroup;