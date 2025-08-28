import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}, Token: ${token ? 'Presente' : 'Ausente'}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error(`[API Error] ${originalRequest.method.toUpperCase()} ${originalRequest.url}:`, {
      Code: error.code,
      Message: error.message,
      Status: error.response?.status,
      Response: error.response?.data
    });

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('[Interceptor] Intentando refrescar token...');
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, {}, {
          withCredentials: true
        });
        console.log('[Interceptor] Token refrescado:', data.token);
        localStorage.setItem('token', data.token);
        originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('[Interceptor] Error al refrescar token:', {
          Code: refreshError.code,
          Message: refreshError.message,
          Response: refreshError.response?.data
        });
        localStorage.removeItem('token');
        window.dispatchEvent(new CustomEvent('authExpired', {
          detail: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.'
        }));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;