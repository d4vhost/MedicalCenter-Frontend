// Archivo: src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7188/api',
})

// Interceptor de Solicitud (Request) - (Ya lo tienes)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// --- AÑADIR ESTO: Interceptor de Respuesta (Response) ---
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa (2xx), solo devuélvela
    return response
  },
  (error) => {
    // Revisa si el error es un 401
    if (error.response && error.response.status === 401) {
      // 1. Limpia el token (porque es inválido o expiró)
      localStorage.removeItem('token')

      // 2. (Opcional) Limpia otros datos de usuario que tengas

      // 3. Redirige al login
      // Evita un bucle si ya estás en el login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    // Devuelve el error para que .catch() en los composables
    // (como useAdminData) aún pueda manejarlo (ej. mostrar un toast)
    return Promise.reject(error)
  },
)

export default api
