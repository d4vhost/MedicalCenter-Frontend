// src/services/api.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://localhost:7188/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
