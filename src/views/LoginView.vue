<template>
  <div class="split-screen-container" :class="{ 'dark-mode': isDarkMode }">
    <div class="form-panel">
      <div class="login-card">
        <div class="logo">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12L22 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12V22"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 12L2 7"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="logo-text">MedicalCenter</span>
        </div>
        <h1 class="title">Acceso al Sistema</h1>
        <p class="subtitle">Ingresa tus credenciales para continuar.</p>

        <form @submit.prevent="handleEmpleadoLogin" class="login-form">
          <div class="form-group">
            <label for="cedula-empleado">Usuario</label>
            <input
              type="text"
              id="cedula-empleado"
              v-model="empleado.cedula"
              required
              placeholder="ej: 1701234567"
            />
          </div>
          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              type="password"
              id="password"
              v-model="empleado.password"
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading">Ingresar</span>
            <span v-else>Verificando...</span>
          </button>
        </form>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="footer-link">
          <a @click="$router.push('/')">&larr; Volver a la página principal</a>
        </div>
      </div>
    </div>

    <div class="info-panel">
      <div class="info-content">
        <h2>Tecnología al Servicio de la Vida</h2>
        <p>
          Nuestro sistema integrado garantiza una atención eficiente y segura para cada paciente.
        </p>
      </div>
    </div>

    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
    >
      <svg
        v-if="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import { AxiosError } from 'axios'

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const empleado = ref({
  cedula: '',
  password: '',
})

const handleEmpleadoLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.post('/Auth/login', {
      cedula: empleado.value.cedula,
      password: empleado.value.password,
    })

    const { token, rol } = response.data
    localStorage.setItem('authToken', token)
    localStorage.setItem('userRole', rol)

    // --- LÓGICA DE REDIRECCIÓN ACTUALIZADA ---
    if (rol === 'Administrativo') {
      router.push('/portal-admin') // Redirige al portal de admin
    } else if (rol === 'Mdico') {
      router.push('/portal-medico') // Redirige al portal de médico
    } else {
      error.value = 'Rol de usuario no reconocido.'
      localStorage.clear()
    }
  } catch (err) {
    const axiosError = err as AxiosError
    error.value = (axiosError.response?.data as string) || 'Credenciales incorrectas.'
    console.error('Error de login (Empleado):', err)
  } finally {
    isLoading.value = false
  }
}

// Lógica para el modo oscuro
const isDarkMode = ref(false)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userRole')

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }
})
</script>

<style scoped>
/* Las variables de color y los estilos permanecen igual */
.split-screen-container {
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --primary-color: #0891b2;
  --surface-color: #ffffff;
  --border-color: #dee2e6;
  --headline-color: #0f172a;
  --text-muted-color: #6c757d;
  --error-color: #dc3545;

  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  transition: background-color 0.3s ease;
}

.split-screen-container.dark-mode {
  --bg-color: #0f172a;
  --text-color: #e2e8f0;
  --primary-color: #22d3ee;
  --surface-color: #1e293b;
  --border-color: #334155;
  --headline-color: #f1f5f9;
  --text-muted-color: #94a3b8;
  --error-color: #f87171;
}

.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--headline-color);
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-muted-color);
  margin-bottom: 2.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
}
.dark-mode .form-group input:focus {
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.2);
}

.btn-submit {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-top: 1rem;
}
.dark-mode .btn-submit {
  color: var(--bg-color);
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-submit:disabled {
  background-color: var(--text-muted-color);
  cursor: not-allowed;
}

.error-message {
  color: var(--error-color);
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.2);
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.footer-link {
  margin-top: 2rem;
}

.footer-link a {
  color: var(--text-muted-color);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.footer-link a:hover {
  color: var(--primary-color);
}

.info-panel {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 4rem;
}

.info-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 50%);
}

.info-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 450px;
}

.info-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.info-content p {
  font-size: 1.2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.theme-toggle {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: var(--text-color);
}

.theme-toggle:hover {
  transform: scale(1.1);
}

@media (max-width: 992px) {
  .info-panel {
    display: none;
  }
  .form-panel {
    flex-basis: 100%;
  }
}
</style>
