<!--src/views/LoginView.vue-->
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
        <h1 class="title">Bienvenido de Vuelta</h1>
        <p class="subtitle">Accede al sistema para continuar.</p>

        <div class="tabs">
          <button @click="userType = 'empleado'" :class="{ active: userType === 'empleado' }">
            Soy Empleado
          </button>
          <button @click="userType = 'paciente'" :class="{ active: userType === 'paciente' }">
            Soy Paciente
          </button>
        </div>

        <form
          v-if="userType === 'empleado'"
          @submit.prevent="handleEmpleadoLogin"
          class="login-form"
        >
          <div class="form-group">
            <label for="cedula-empleado">Cédula</label>
            <input
              type="text"
              id="cedula-empleado"
              v-model="empleado.cedula"
              required
              placeholder="ej: 1801234567"
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
          <div class="form-group">
            <label for="centro-medico">Centro Médico</label>
            <select id="centro-medico" v-model="empleado.centroMedicoId" required>
              <option disabled value="">Seleccione una sucursal</option>
              <option value="1">Quito</option>
              <option value="2">Guayaquil</option>
              <option value="3">Cuenca</option>
            </select>
          </div>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading">Ingresar al Panel</span>
            <span v-else>Verificando...</span>
          </button>
        </form>

        <form
          v-if="userType === 'paciente'"
          @submit.prevent="handlePacienteLogin"
          class="login-form"
        >
          <div class="form-group">
            <label for="cedula-paciente">Cédula</label>
            <input
              type="text"
              id="cedula-paciente"
              v-model="paciente.cedula"
              required
              placeholder="ej: 0501112223"
            />
          </div>
          <div class="form-group">
            <label for="fecha-nacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fecha-nacimiento" v-model="paciente.fechaNacimiento" required />
          </div>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading">Ingresar al Portal</span>
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
import { AxiosError } from 'axios' // <-- **AÑADIR ESTA LÍNEA**

const router = useRouter()
const userType = ref('empleado')
const isLoading = ref(false)
const error = ref('')

const empleado = ref({
  cedula: '',
  password: '',
  centroMedicoId: '',
})

const paciente = ref({
  cedula: '',
  fechaNacimiento: '',
})

const handleEmpleadoLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.post('/Auth/login', {
      cedula: empleado.value.cedula,
      password: empleado.value.password,
      centroMedicoId: parseInt(empleado.value.centroMedicoId),
    })
    localStorage.setItem('authToken', response.data.token)
    router.push('/portal-empleado')
  } catch (err) {
    // <-- **CAMBIO AQUÍ**
    const axiosError = err as AxiosError
    error.value =
      (axiosError.response?.data as string) || 'Credenciales o centro médico incorrectos.'
    console.error('Error de login (Empleado):', err)
  } finally {
    isLoading.value = false
  }
}

const handlePacienteLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.post('/Auth/login-paciente', {
      cedula: paciente.value.cedula,
      fechaNacimiento: paciente.value.fechaNacimiento,
    })
    localStorage.setItem('authToken', response.data.token)
    router.push('/portal-paciente')
  } catch (err) {
    const axiosError = err as AxiosError
    error.value =
      (axiosError.response?.data as string) || 'Cédula o fecha de nacimiento incorrectas.'
    console.error('Error de login (Paciente):', err)
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
  // Limpiar token al cargar la página de login para forzar re-autenticación
  localStorage.removeItem('authToken')

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }
})
</script>

<style scoped>
/* Variables de Color (igual que en HomeView para consistencia) */
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

.form-group input,
.form-group select {
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

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.2);
}
.dark-mode .form-group input:focus,
.dark-mode .form-group select:focus {
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
  margin-top: -0.5rem;
}

.tabs {
  display: flex;
  margin-bottom: 2.5rem; /* Aumenta el espacio inferior */
  border-radius: 9px; /* Bordes un poco más redondeados */
  background-color: var(--surface-color);
  padding: 5px;
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); /* Sombra sutil */
}

.tabs button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  color: var(--text-muted-color);
  font-weight: 600;
  font-size: 0.9rem; /* Tamaño de fuente ajustado */
  transition: all 0.2s ease-in-out;
  border-radius: 7px; /* Bordes internos */
}

.tabs button.active {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(8, 145, 178, 0.25); /* Sombra cuando está activo */
  transform: scale(1.02); /* Efecto sutil de crecimiento */
}

.dark-mode .tabs button.active {
  color: var(--bg-color);
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
