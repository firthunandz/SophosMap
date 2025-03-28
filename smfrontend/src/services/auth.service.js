import api from './api'

export const checkBackendConnection = async () => {
  try {
    const response = await api.get('/')
    
    return response.data
  } catch (error) {
    throw new Error('Error conectando con el backend: ' + error.message)

  }
}