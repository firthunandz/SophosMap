const FormGroup = ({ label, error, children }) => {
  return (
    <div className="">
      {label && (
        <label className="block font-semibold mb-1 text-sm sm:text-base">{label}</label>
      )}
      {children}
      {error && (
        <span className="text-red-500 text-xs sm:text-sm">Este campo es obligatorio</span>
      )}
    </div>
  );
}

export default FormGroup;