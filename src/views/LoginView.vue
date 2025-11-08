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

    // ✅ CAMBIO CRÍTICO: Usar 'authToken' en lugar de 'token'
    localStorage.setItem('authToken', token) // ← CAMBIO AQUÍ
    localStorage.setItem('userRole', rol)

    if (rol === 'ADMINISTRATIVO') {
      router.push('/portal-admin')
    } else if (rol === 'MEDICO') {
      router.push('/portal-medico')
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

const isDarkMode = ref(false)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
  // ✅ CAMBIO: Usar 'authToken' también aquí
  localStorage.removeItem('authToken') // ← CAMBIO AQUÍ
  localStorage.removeItem('userRole')

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }
})
</script>

<style scoped>
/* ===== VARIABLES DE TEMA ===== */
.split-screen-container {
  --bg-color: #fafafa;
  --surface-color: #ffffff;
  --surface-elevated: #ffffff;
  --border-color: #e5e5e5;
  --border-light: #f0f0f0;
  --text-color: #1d1d1f;
  --headline-color: #000000;
  --text-muted-color: #86868b;
  --primary-color: #0891b2;
  --primary-hover: #0e7490;
  --secondary-color: #f5f5f7;
  --secondary-hover: #e8e8ed;
  --danger-color: #ff3b30;
  --danger-hover: #d70015;
  --success-color: #34c759;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;

  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);
}

.split-screen-container.dark-mode {
  --bg-color: #000000;
  --surface-color: #1c1c1e;
  --surface-elevated: #2c2c2e;
  --border-color: #38383a;
  --border-light: #2c2c2e;
  --text-color: #f5f5f7;
  --headline-color: #ffffff;
  --text-muted-color: #98989d;
  --primary-color: #0891b2;
  --primary-hover: #0a7a94;
  --secondary-color: #2c2c2e;
  --secondary-hover: #3a3a3c;
  --danger-color: #ff453a;
  --danger-hover: #ff6961;
  --success-color: #32d74b;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* ===== FORM PANEL ===== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  background-color: var(--bg-color);
}

.login-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===== LOGO ===== */
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.875rem;
  color: var(--primary-color);
  margin-bottom: 2.5rem;
  transition: transform var(--transition-fast);
}

.logo:hover {
  transform: scale(1.02);
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}

/* ===== TITLES ===== */
.title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 0.625rem;
  letter-spacing: -0.03em;
}

.subtitle {
  color: var(--text-muted-color);
  margin-bottom: 2.5rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-weight: 400;
}

/* ===== FORM ===== */
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
  color: var(--text-muted-color);
  font-size: 0.8125rem;
  letter-spacing: -0.01em;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-color);
  color: var(--text-color);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.form-group input::placeholder {
  color: var(--text-muted-color);
  opacity: 0.6;
}

.form-group input:hover:not(:focus) {
  border-color: var(--text-muted-color);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.dark-mode .form-group input:focus {
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.2);
}

/* ===== SUBMIT BUTTON ===== */
.btn-submit {
  padding: 1rem;
  font-size: 1.0625rem;
  font-weight: 600;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: 0.5rem;
  box-shadow: var(--shadow-sm);
  letter-spacing: -0.01em;
}

.btn-submit:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  background-color: var(--text-muted-color);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

/* ===== ERROR MESSAGE ===== */
.error-message {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.08);
  border: 1px solid rgba(255, 59, 48, 0.2);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-top: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  animation: shake 0.3s ease-in-out;
}

.dark-mode .error-message {
  background-color: rgba(255, 69, 58, 0.15);
  border-color: rgba(255, 69, 58, 0.3);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

/* ===== FOOTER LINK ===== */
.footer-link {
  margin-top: 2rem;
}

.footer-link a {
  color: var(--text-muted-color);
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.footer-link a:hover {
  color: var(--primary-color);
}

/* ===== INFO PANEL ===== */
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
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}

.info-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 500px;
}

.info-content h2 {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.info-content p {
  font-size: 1.25rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 400;
}

/* ===== THEME TOGGLE ===== */
.theme-toggle {
  position: fixed;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
  z-index: 1000;
  color: var(--primary-color);
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: var(--shadow-lg);
  background-color: var(--surface-elevated);
}

.theme-toggle:active {
  transform: scale(1.05);
}

/* ===== SCROLLBAR ===== */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted-color);
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: var(--border-color);
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted-color);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .info-panel {
    padding: 3rem;
  }

  .info-content h2 {
    font-size: 2.25rem;
  }

  .info-content p {
    font-size: 1.125rem;
  }
}

@media (max-width: 992px) {
  .info-panel {
    display: none;
  }

  .form-panel {
    flex-basis: 100%;
  }

  .theme-toggle {
    top: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 480px) {
  .form-panel {
    padding: 1.5rem;
  }

  .login-card {
    max-width: 100%;
  }

  .title {
    font-size: 1.875rem;
  }

  .subtitle {
    font-size: 0.875rem;
  }

  .logo-text {
    font-size: 1.375rem;
  }

  .theme-toggle {
    width: 44px;
    height: 44px;
  }
}

/* ===== TRANSICIONES SUAVES ===== */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: var(--transition-fast);
  transition-timing-function: ease;
}

button,
a,
input {
  transition-property: background-color, border-color, color, transform, box-shadow;
  transition-duration: var(--transition-fast);
}

/* ===== ACCESIBILIDAD ===== */
.btn-submit:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.form-group input:focus-visible {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.dark-mode .form-group input:focus-visible {
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.2);
}

/* ===== MEJORAS VISUALES ===== */
.login-card {
  backdrop-filter: blur(10px);
}

.form-panel {
  position: relative;
}

.form-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(8, 145, 178, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.dark-mode .form-panel::before {
  background: radial-gradient(circle at 20% 50%, rgba(8, 145, 178, 0.08) 0%, transparent 50%);
}
</style>
