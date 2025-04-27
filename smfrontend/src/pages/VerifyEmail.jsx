import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const email = params.get('email');

  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (token && email) {
      api.get(`/auth/verify-email?token=${token}&email=${email}`)
        .then((response) => {
          setIsVerified(true);
          setError('');
          setTimeout(() => {
            setRedirecting(true);
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }, 2000);
        })
        .catch((err) => {
          console.error('Error al verificar el correo:', err);
          setError('El token es inválido o ha expirado');
        });
    }
  }, [token, email, navigate]);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/resend-verification', { email });
    } catch (err) {
      console.error('Error al reenviar enlace:', err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 my-10">
      {isVerified ? (
        <div className="text-center p-4 text-deep-sepia rounded">
          <h2 className="text-xl font-semibold">Correo verificado exitosamente</h2>
          <p>Ahora puedes iniciar sesión en tu cuenta.</p>
          {redirecting && (
            <div className='my-2 text-deep-sepia'>
              <p>Redirigiendo al login...</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center p-4 text-red-700 rounded">
          {error && <p className="text-lg my-4">{error}</p>}
          <Button variant="gold" onClick={handleResendVerification} disabled={isResending}>
            {isResending ? 'Reenviando...' : 'Reenviar enlace de verificación'}
          </Button>
        </div>
      )}
    </div>
  );

};

export default VerifyEmail;