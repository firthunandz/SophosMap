import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

export const Contact = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    const payload = isAuthenticated
      ? { ...data, name: user.name, email: user.email }
      : data;

    try {
      const response = await fetch('https://formspree.io/f/xzzeygap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Gracias por tu mensaje 🙌');
        reset();
      } else {
        alert('Hubo un error al enviar el mensaje 😕');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 text-center font-eb-garamond font-medium text-lg">
      <h2 className="text-2xl font-bold mb-2 font-cinzel">App creada por Fernando</h2>

      <div className="flex justify-center gap-10 my-3">
        <a
          href="https://github.com/firthunandz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-antique-gold hover:underline"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/fernando-chiesa"
          target="_blank"
          rel="noopener noreferrer"
          className="text-antique-gold hover:underline"
        >
          LinkedIn
        </a>
      </div>

      <p className="text-gray-700 mt-4 mb-6 ">
        Si tenés alguna recomendación, sugerencia o simplemente querés decir algo, podés escribirme usando el siguiente formulario:
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-ivory p-6 rounded shadow-md text-left"
      >
        {!isAuthenticated && (
          <>
            <div className="mb-4">
              <label className="block font-medium mb-1">Nombre</label>
              <input
                {...register('name', { required: true })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">Este campo es obligatorio</span>
              )}
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                {...register('email', { required: true })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">Este campo es obligatorio</span>
              )}
            </div>
          </>
        )}

        <div className="mb-4">
          <label className="block font-medium mb-1">Mensaje</label>
          <textarea
            rows="5"
            {...register('message', { required: true })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.message && (
            <span className="text-red-500 text-sm">Este campo es obligatorio</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Enviar mensaje
        </button>
      </form>
    </div>
  );
};
