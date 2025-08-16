import { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormGroup from '../components/ui/FormGroup';
import api from '../services/api';
import { LoadingButton } from '../components/ui/LoadingButton';

export default function ForgotPassword() {
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email }) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(response.data.message || 'Revisá tu casilla para continuar con el cambio de contraseña');
      setError('');
      reset();
    } catch (err) {
      console.error('Error al enviar recuperación:', err);
      setSuccessMessage('');
      setError(err.response?.data?.error || 'Error al procesar la solicitud');
    } finally {
    setLoading(false);
    };
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 mt-10 bg-ivory shadow rounded-lg">
      <h2 className="text-2xl font-bold text-center font-cinzel text-warm-brown mb-6">
        Recuperar contraseña
      </h2>

      {successMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-sm text-center">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormGroup label="Email">
          <input
            type="email"
            {...register('email', { required: 'El email es obligatorio' })}
            className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </FormGroup>

        <LoadingButton type="submit" variant="gold" className="w-full" loading={loading}>
          Enviar correo de recuperación
        </LoadingButton>
      </form>
    </div>
  );
}
