const CheckEmail = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center space-y-6 p-6 bg-papyrus rounded-lg shadow-lg w-3/4 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center text-warm-brown">¡Gracias por registrarte!</h2>
      <p className="text-lg text-center text-dark-umber">Por favor, revisa tu correo electrónico para verificar tu cuenta.</p>
      <p className="text-base text-center text-warm-gray">
        Si no ves el correo en tu bandeja de entrada, revisa tu carpeta de spam o intenta nuevamente.
      </p>
    </div>
  );
};

export default CheckEmail;