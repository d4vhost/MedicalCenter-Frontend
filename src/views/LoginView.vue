<template>
  <div class="split-screen-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Panel Izquierdo: Formulario de Login -->
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

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="cedula">Cédula</label>
            <input type="text" id="cedula" v-model="cedula" required placeholder="ej: 1801234567" />
          </div>
          <div class="form-group">
            <label for="password">Contraseña (ID de Empleado)</label>
            <input
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="••••••••"
            />
          </div>
          <div class="form-group">
            <label for="centro-medico">Centro Médico</label>
            <select id="centro-medico" v-model="centroMedicoId" required>
              <option disabled value="">Seleccione una sucursal</option>
              <option value="1">Quito</option>
              <option value="2">Guayaquil</option>
              <option value="3">Cuenca</option>
            </select>
          </div>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            <span v-if="!isLoading">Ingresar al Panel</span>
            <span v-else>Verificando...</span>
          </button>
        </form>
        <div class="footer-link">
          <a @click="$router.push('/')">&larr; Volver a la página principal</a>
        </div>
      </div>
    </div>

    <!-- Panel Derecho: Información Visual -->
    <div class="info-panel">
      <div class="info-content">
        <h2>Tecnología al Servicio de la Vida</h2>
        <p>
          Nuestro sistema integrado garantiza una atención eficiente y segura para cada paciente.
        </p>
      </div>
    </div>

    <!-- Toggle de Tema Oscuro -->
    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-label="isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'"
    >
      <!-- Iconos de sol y luna -->
      <svg
        v-if="!isDarkMode"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025t.662.075q-1.025.725-1.638 1.888T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q1.375 0 2.525-.613T20.9 10.65q.05.325.075.662T21 12q0 3.75-2.625 6.375T12 21"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M12 17q-2.075 0-3.537-1.463T7 12q0-2.075 1.463-3.537T12 7q2.075 0 3.538 1.463T17 12q0 2.075-1.463 3.538T12 17M12 20v-2.8q0-.25.175-.425T12.6 16.6q2.45-.5 4.025-2.512T18.2 10H21q.425 0 .713-.288T22 9q0-.425-.288-.712T21 8h-2.8q-.5-2.45-2.512-4.025T11.675 2.2V-1h2q.425 0 .713-.288T14 1q0-.425-.288-.712T13 0h-2q-.425 0-.712.288T10 1q0 .425.288.713T11 2v2.8q2.45.5 4.025 2.512T16.6 11.325q.25 0 .425.175t.175.425V14h2.8q.425 0 .713.288T22 15q0 .425-.288.713T21 16h-2.8q-.5 2.45-2.512 4.025T11.675 21.8V20Z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const cedula = ref('')
const password = ref('')
const centroMedicoId = ref('')
const isLoading = ref(false)
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  // La lógica de login sigue siendo la misma
  isLoading.value = true
  error.value = ''

  try {
    const response = await fetch('https://localhost:7188/api/Auth/login', {
      // Asegúrate que el puerto sea el de tu API
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cedula: cedula.value,
        password: password.value,
        centroMedicoId: parseInt(centroMedicoId.value),
      }),
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('userData', JSON.stringify(data))
      router.push('/dashboard')
    } else {
      const errorText = await response.text()
      error.value = errorText || 'Credenciales o centro médico incorrectos.'
    }
  } catch (e) {
    console.error('Error de conexión:', e)
    error.value = 'No se pudo conectar con el servidor. Verifique que la API esté corriendo.'
  }

  isLoading.value = false
}

// Lógica para el modo oscuro
const isDarkMode = ref(false)
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

onMounted(() => {
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
