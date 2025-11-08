// Archivo: src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7188/api',
})

// ✅ Interceptor de Solicitud - Envía el token en TODAS las peticiones
api.interceptors.request.use(
  (config) => {
    // ⚠️ IMPORTANTE: Usar 'authToken' si así lo guardas en localStorage
    // O 'token' si usas ese nombre. Debe coincidir con lo que guardas en LoginView.vue
    const token = localStorage.getItem('authToken') // ← VERIFICA EL NOMBRE

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// ✅ Interceptor de Respuesta - Maneja 401 (No Autorizado)
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Limpiar token inválido
      localStorage.removeItem('authToken')

      // Redirigir al login (evitar bucle)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
