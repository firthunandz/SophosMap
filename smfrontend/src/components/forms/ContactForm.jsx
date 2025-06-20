import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/authContext';
import Button from '../ui/Button';
import FormGroup from '../ui/FormGroup';

export default function ContactForm() {
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
        alert('Gracias por tu mensaje');
        reset();
      } else {
        alert('Hubo un error al enviar el mensaje');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-parchment/50 px-3 py-2 sm:px-4 md:p-3 rounded-lg shadow-md text-left border border-warm-brown flex flex-col lg:gap-y-4"
    >
      {!isAuthenticated && (
        <>
          <FormGroup
            label="Nombre"
            error={errors.name}
          >
            <input
              {...register('name', { required: true })}
              className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
            />
          </FormGroup>

          <FormGroup
            label="Email"
            error={errors.email}
          >
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
            />
          </FormGroup>
        </>
      )}

      <FormGroup
        label="Mensaje"
        error={errors.message}
      >
        <textarea
          rows="4"
          {...register('message', { required: true })}
          className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
        />
      </FormGroup>

      <Button type="submit" variant="gold" size="md" className='self-center'>
        Enviar mensaje
      </Button>
    </form>
  );
}
