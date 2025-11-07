// Archivo: src/services/api.ts

import axios from 'axios'

// 1. Crea la instancia de Axios
const api = axios.create({
  baseURL: 'https://localhost:7188/api',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    // 4. Si el token existe, lo añade a las cabeceras
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    // Maneja errores en la configuración de la solicitud
    return Promise.reject(error)
  },
)

export default api
