import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
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

api.interceptors.response.use(response => {
  return response;
}, error => {
  console.error('[API] Error en respuesta:', {
    URL: error.config.url,
    status: error.response?.status,
    data: error.response?.data
  });
  return Promise.reject(error);
});

export default api