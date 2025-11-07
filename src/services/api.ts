// Archivo: src/services/api.ts

import axios from 'axios'

// 1. Crea la instancia de Axios
const api = axios.create({
  baseURL: 'https://localhost:7188/api', // Tu URL de backend
})

// 2. ¡AQUÍ ESTÁ LA CORRECCIÓN! (El Interceptor)
// Esto se ejecuta ANTES de que CUALQUIER solicitud (GET, POST, etc.) sea enviada.
api.interceptors.request.use(
  (config) => {
    // 3. Obtiene el token guardado (asumiendo que lo guardaste en localStorage)
    const token = localStorage.getItem('token')

    // 4. Si el token existe, lo añade a las cabeceras
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config // Devuelve la configuración modificada
  },
  (error) => {
    // Maneja errores en la configuración de la solicitud
    return Promise.reject(error)
  },
)

export default api
