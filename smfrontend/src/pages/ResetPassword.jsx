import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';
import FormGroup from '../components/ui/FormGroup';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  const email = queryParams.get('email')

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError('Token no proporcionado');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        token,
        newPassword
      });

      if (response.status === 200) {
        setSuccess('¡Contraseña actualizada correctamente!');
        setError('');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Error al actualizar contraseña');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 bg-ivory p-6 rounded shadow font-eb-garamond">
      <h2 className="text-3xl font-bold mb-6 text-center font-cinzel text-warm-brown">
        Restablecer contraseña
      </h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup label="Nueva contraseña">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
          />
        </FormGroup>

        <FormGroup label="Confirmar contraseña">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border border-warm-gray rounded px-3 py-2 bg-ivory"
          />
        </FormGroup>

        <Button type="submit" variant="gold" className="w-full">
          Actualizar contraseña
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
