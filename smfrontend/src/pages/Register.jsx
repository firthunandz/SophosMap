import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSpinner } from '../context/SpinnerContext';

export default function Register() {
  const { showSpinner, hideSpinner } = useSpinner();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      showSpinner();
      const { data: response } = await api.post('/auth/register', {
        nickname: data.nickname,
        username: data.username,
        email: data.email,
        password: data.password
      });
      navigate('/users/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      hideSpinner();
    }
  };

  return (
      <div className="w-full max-w-md p-8 space-y-8 bg-ivory rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center font-cinzel">Registro</h2>
        
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
              Nickname
            </label>
            <input
              id="nickname"
              {...register('nickname', { required: 'Nickname es requerido' })}
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.nickname ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-red-600">{errors.nickname.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register('username', { 
                required: 'Username es requerido',
                minLength: {
                  value: 4,
                  message: 'Username debe tener al menos 4 caracteres'
                }
              })}
              type="text"
              className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              {...register('email', { 
                required: 'Email es requerido',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido'
                }
              })}
              type="email"
              className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              {...register('password', { 
                required: 'Contraseña es requerida',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                }
              })}
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              {...register('confirmPassword', { 
                required: 'Debes confirmar la contraseña',
                validate: value => 
                  value === watch('password') || 'Las contraseñas no coinciden'
              })}
              type="password"
              className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-antique-gold hover:bg-antique-gold/80"
          >
            Registrarse
          </button>
        </form>
        
        <div className="text-center">
          <Link 
            to="/users/login" 
            className="text-ink-black hover:text-ink-black/80 hover:underline"
            >
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </div>
      </div>
  );
}