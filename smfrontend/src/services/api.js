import axios from 'axios'

let activeRequests = 0;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido - forzar logout
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authChange'));
    }
    return Promise.reject(error);
  }
);

export default api