import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSpinner } from '../context/SpinnerContext';
import api from '../services/api';
import AuthForm from '../components/forms/AuthForm';

export default function Register() {
  const { showSpinner, hideSpinner } = useSpinner();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const fields = [
    {
      label: 'Nickname',
      name: 'nickname',
      type: 'text',
      register: register('nickname', { required: 'El nickname es requerido' }),
      error: errors.nickname
    },
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      register: register('username', {
        required: 'El username es requerido',
        minLength: { value: 4, message: 'Mínimo 4 caracteres' }
      }),
      error: errors.username
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      register: register('email', {
        required: 'El email es requerido',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Email inválido'
        }
      }),
      error: errors.email
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password',
      register: register('password', {
        required: 'La contraseña es requerida',
        minLength: { value: 8, message: 'Mínimo 8 caracteres' }
      }),
      error: errors.password
    },
    {
      label: 'Confirmar Contraseña',
      name: 'confirmPassword',
      type: 'password',
      register: register('confirmPassword', {
        required: 'Debes confirmar la contraseña',
        validate: (value) => value === watch('password') || 'Las contraseñas no coinciden'
      }),
      error: errors.confirmPassword
    }
  ];

  const onSubmit = async (formData) => {
    const { confirmPassword, ...data } = formData;

    try {
      showSpinner();
      const { data: response } = await api.post('/auth/register', data);
      navigate('/login');
    } catch (err) {
      console.error('Error en registro:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      hideSpinner();
    }
  };

  return (
    <AuthForm
      title="Registro"
      fields={fields}
      buttonText={'Regístrate'}
      onSubmit={handleSubmit(onSubmit)}
      error={error}
      linkText="¿Ya tienes cuenta? Inicia sesión"
      linkTo="/login"
    />
  );
}