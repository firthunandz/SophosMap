import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/authContext';
import { useSpinner } from '../context/SpinnerContext';
import api from '../services/api';
import AuthForm from '../components/forms/AuthForm';


export default function Login() {
  const { login } = useAuth();
  const { showSpinner, hideSpinner } = useSpinner();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fields = [
    { label: 'Usuario o Email', name: 'identifier', type: 'text',
      register: register('identifier', { required: true }), error: errors.identifier },
    { label: 'Contraseña', name: 'password', type: 'password',
      register: register('password', { required: true }), error: errors.password }
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("identifier") || params.has("password")) {
      window.history.replaceState({}, document.title, "/login");
    }
  }, []);

  const handleLogin = async (formData) => {
    try {
      showSpinner();
      const { data } = await api.post('/auth/login', formData);
      if (!data.user.verified) {
        navigate('/check-email');
      } else {
        login(data.token, data.user);
        navigate('/home');
      }
    } catch (err) {
      console.error('Error detallado:', {
        Code: err.code,
        Message: err.message,
        Response: err.response?.data
      });
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      hideSpinner();
    }
  };

  return (
    <AuthForm
      title="Iniciar sesión"
      fields={fields}
      buttonText={'Iniciar sesión'}
      onSubmit={handleSubmit(handleLogin)}
      error={error}
      linkText="¿No tienes cuenta? Registrate"
      linkTo="/register"
      extraLink={{
        to: '/forgot-password',
        label: '¿Olvidaste tu contraseña?'
      }}
    />
  );
};