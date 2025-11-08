// Archivo: src/services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://localhost:7188/api',
})

// ✅ Interceptor de Solicitud
api.interceptors.request.use(
  (config) => {
    // ⚠️ IMPORTANTE: Usar 'authToken' si así lo guardas en localStorage
    // O 'token' si usas ese nombre. Debe coincidir con lo que guardas en LoginView.vue
    const token = localStorage.getItem('authToken') // ← VERIFICA EL NOMBRE

    if (token) {
      console.log(`[API Request] Enviando token para: ${config.url}`) // <-- NUEVO CONSOLE.LOG
      config.headers.Authorization = `Bearer ${token}`
    } else {
      console.warn(`[API Request] Sin token para: ${config.url}`) // <-- NUEVO CONSOLE.LOG
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// ✅ Interceptor de Respuesta
api.interceptors.response.use(
  (response) => {
    // <-- NUEVO CONSOLE.LOG
    console.log(`[API Response] Éxito para: ${response.config.url}`, response.status)
    return response
  },
  (error) => {
    // --- ESTA ES LA SECCIÓN CRÍTICA ---
    console.error('[API Response] ¡ERROR INTERCEPTADO!', error) // <-- NUEVO CONSOLE.LOG

    if (error.response) {
      // <-- NUEVO CONSOLE.LOG
      console.error(`[API Response] Status: ${error.response.status}`)
      console.error(`[API Response] URL que falló: ${error.config.url}`)
      console.error('[API Response] Data del error:', error.response.data)

      if (error.response.status === 401) {
        // <-- NUEVO CONSOLE.LOG
        console.error('¡ERROR 401 DETECTADO! Token inválido o permisos insuficientes.')
        console.error('Borrando authToken y redirigiendo a /login...')

        // Limpiar token inválido
        localStorage.removeItem('authToken')
        localStorage.removeItem('userRole') // <-- Limpia el rol también

        // Redirigir al login (evitar bucle)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    } else {
      console.error('[API Response] Error sin respuesta del servidor (CORS, Red caida?)')
    }
    // --- FIN DE LA SECCIÓN CRÍTICA ---

    return Promise.reject(error)
  },
)

export default api
