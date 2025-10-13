<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <h1 class="title">Portal de Consultas</h1>
        <p class="welcome-message">Consulte su historial médico.</p>
      </div>
      <div class="header-actions">
        <button v-if="paciente" @click="logout" class="btn-secondary">Cerrar Sesión</button>
        <button @click="goHome" class="btn-secondary">Página Principal</button>
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
    </header>

    <main class="content">
      <div v-if="!paciente" class="login-form-container">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="cedula">Cédula</label>
            <input type="text" id="cedula" v-model="loginData.cedula" required />
          </div>
          <div class="form-group">
            <label for="fechaNacimiento">Fecha de Nacimiento</label>
            <input type="date" id="fechaNacimiento" v-model="loginData.fechaNacimiento" required />
          </div>
          <button type="submit" class="btn-primary" :disabled="isLoading">
            <span v-if="!isLoading">Consultar</span>
            <span v-else>Consultando...</span>
          </button>
          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>
      </div>

      <div v-if="paciente" class="historial-container">
        <div class="historial-header">
          <h2>Historial de {{ paciente.nombreCompleto }}</h2>
          <button @click="descargarHistorial" class="btn-primary">Descargar Historial</button>
        </div>

        <div class="filters">
          <input type="date" v-model="busquedaFecha" />
          <input
            type="text"
            v-model="busquedaMotivo"
            placeholder="Buscar por motivo o enfermedad..."
          />
        </div>

        <ul class="item-list">
          <li v-for="item in historialFiltrado" :key="item.id" @click="seleccionarConsulta(item)">
            <div class="item-main-info">
              <span class="item-title">{{ new Date(item.fechaHora).toLocaleString() }}</span>
              <span class="item-subtitle">Motivo: {{ item.motivo }}</span>
            </div>
            <div class="chip diagnostico-chip">
              {{ item.enfermedadNombre }}
            </div>
          </li>
          <li v-if="historialFiltrado.length === 0">No se encontraron consultas.</li>
        </ul>
      </div>
    </main>

    <Transition name="modal-fade">
      <div
        v-if="consultaSeleccionada"
        class="modal-overlay"
        @click.self="consultaSeleccionada = null"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Detalle de la Consulta</h3>
            <button @click="consultaSeleccionada = null" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="consulta-detalle">
              <p>
                <strong>Fecha:</strong>
                {{ new Date(consultaSeleccionada.fechaHora).toLocaleString() }}
              </p>
              <p><strong>Motivo:</strong> {{ consultaSeleccionada.motivo }}</p>
              <p><strong>Diagnóstico:</strong> {{ consultaSeleccionada.enfermedadNombre }}</p>
              <p><strong>Prescripción:</strong></p>
              <ul>
                <li
                  v-for="prescripcion in consultaSeleccionada.prescripciones"
                  :key="prescripcion.id"
                >
                  {{ prescripcion.nombreMedicamento }}: {{ prescripcion.indicaciones }}
                </li>
              </ul>
            </div>
            <div class="modal-actions">
              <button @click="imprimirConsulta" class="btn-secondary">Imprimir</button>
              <button @click="consultaSeleccionada = null" class="btn-primary">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'

interface Paciente {
  id: number
  nombreCompleto: string
}

interface HistorialItem {
  id: number
  fechaHora: string
  motivo: string
  enfermedadNombre: string
  prescripciones: Prescripcion[]
}

interface Consulta {
  id: number
  fechaHora: string
  motivo: string
}

interface Diagnostico {
  id: number
  consultaId: number
  enfermedadNombre: string
}

interface Prescripcion {
  id: number
  diagnosticoId: number
  indicaciones: string
  nombreMedicamento: string
}

const isDarkMode = ref(false)
const isLoading = ref(false)
const error = ref('')
const loginData = ref({
  cedula: '',
  fechaNacimiento: '',
})
const paciente = ref<Paciente | null>(null)
const historial = ref<HistorialItem[]>([])
const consultaSeleccionada = ref<HistorialItem | null>(null)
const busquedaFecha = ref('')
const busquedaMotivo = ref('')

const router = useRouter()

const historialFiltrado = computed(() => {
  return historial.value.filter((item) => {
    const matchFecha = !busquedaFecha.value || item.fechaHora.startsWith(busquedaFecha.value)
    const busqueda = busquedaMotivo.value.toLowerCase()
    const matchTexto =
      !busqueda ||
      item.enfermedadNombre.toLowerCase().includes(busqueda) ||
      (item.motivo && item.motivo.toLowerCase().includes(busqueda))
    return matchFecha && matchTexto
  })
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await apiClient.post('/Auth/login-paciente', {
      cedula: loginData.value.cedula,
      fechaNacimiento: loginData.value.fechaNacimiento,
    })

    const { token, empleadoId, nombreCompleto } = response.data
    localStorage.setItem('authToken', token)
    paciente.value = { id: empleadoId, nombreCompleto }
    await cargarHistorial(empleadoId)
  } catch (err) {
    error.value = 'Cédula o fecha de nacimiento incorrectas.'
    console.error('Error de login (Paciente):', err)
  } finally {
    isLoading.value = false
  }
}

const cargarHistorial = async (pacienteId: number) => {
  try {
    const token = localStorage.getItem('authToken')
    const { data } = await apiClient.get<{
      consultas: Consulta[]
      diagnosticos: Diagnostico[]
      prescripciones?: Prescripcion[]
    }>(`/Pacientes/${pacienteId}/historial`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    const consultasMap = new Map(data.consultas.map((c: Consulta) => [c.id, c]))
    const prescripcionesMap = new Map<number, Prescripcion[]>()

    if (data.prescripciones && Array.isArray(data.prescripciones)) {
      data.prescripciones.forEach((p: Prescripcion) => {
        if (!prescripcionesMap.has(p.diagnosticoId)) {
          prescripcionesMap.set(p.diagnosticoId, [])
        }
        prescripcionesMap.get(p.diagnosticoId)?.push(p)
      })
    }

    historial.value = data.diagnosticos
      .map((diagnostico: Diagnostico) => {
        const consulta = consultasMap.get(diagnostico.consultaId)
        return {
          ...diagnostico,
          fechaHora: consulta?.fechaHora || '',
          motivo: consulta?.motivo || 'N/A',
          prescripciones: prescripcionesMap.get(diagnostico.id) || [],
        }
      })
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
  } catch (error) {
    console.error('Error al cargar el historial:', error)
  }
}

const seleccionarConsulta = (item: HistorialItem) => {
  consultaSeleccionada.value = item
}

const logout = () => {
  localStorage.removeItem('authToken')
  paciente.value = null
  historial.value = []
}

const goHome = () => {
  router.push('/')
}

const descargarHistorial = () => {
  let content = `Historial de ${paciente.value?.nombreCompleto}\n\n`
  historialFiltrado.value.forEach((item) => {
    content += `Fecha: ${new Date(item.fechaHora).toLocaleString()}\n`
    content += `Motivo: ${item.motivo}\n`
    content += `Diagnóstico: ${item.enfermedadNombre}\n`
    content += 'Prescripción:\n'
    item.prescripciones.forEach((p) => {
      content += `- ${p.nombreMedicamento}: ${p.indicaciones}\n`
    })
    content += '---\n'
  })

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `historial_${paciente.value?.nombreCompleto}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const imprimirConsulta = () => {
  const item = consultaSeleccionada.value
  if (!item) return

  const printWindow = window.open('', '', 'height=600,width=800')
  if (printWindow) {
    printWindow.document.write('<html><head><title>Imprimir Consulta</title>')
    printWindow.document.write('</head><body>')
    printWindow.document.write(`<h1>Detalle de la Consulta</h1>`)
    printWindow.document.write(
      `<p><strong>Fecha:</strong> ${new Date(item.fechaHora).toLocaleString()}</p>`,
    )
    printWindow.document.write(`<p><strong>Motivo:</strong> ${item.motivo}</p>`)
    printWindow.document.write(`<p><strong>Diagnóstico:</strong> ${item.enfermedadNombre}</p>`)
    printWindow.document.write('<p><strong>Prescripción:</strong></p><ul>')
    item.prescripciones.forEach((p) => {
      printWindow.document.write(`<li>${p.nombreMedicamento}: ${p.indicaciones}</li>`)
    })
    printWindow.document.write('</ul></body></html>')
    printWindow.document.close()
    printWindow.print()
  }
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
/* Estilos similares a PortalAdminView y PortalMedicoView */
.page-container {
  --bg-color: #f8f9fa;
  --text-color: #212529;
  --primary-color: #0891b2;
  --surface-color: #ffffff;
  --border-color: #dee2e6;
  --headline-color: #0f172a;
  --text-muted-color: #6c757d;
  --error-color: #dc3545;
}

.page-container.dark-mode {
  --bg-color: #0f172a;
  --text-color: #e2e8f0;
  --primary-color: #22d3ee;
  --surface-color: #1e293b;
  --border-color: #334155;
  --headline-color: #f1f5f9;
  --text-muted-color: #94a3b8;
  --error-color: #f87171;
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-color);
}
.header {
  padding: 1.25rem 2.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-color);
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--headline-color);
}
.welcome-message {
  font-size: 0.9rem;
  color: var(--text-muted-color);
}
.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}
.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted-color);
}
.content {
  flex-grow: 1;
  padding: 2.5rem;
}
.login-form-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: var(--surface-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-color);
  color: var(--text-color);
}
.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
.dark-mode .btn-primary {
  color: #000;
}
.btn-secondary {
  padding: 0.5rem 1rem;
  background-color: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
}
.error-message {
  margin-top: 1rem;
  color: var(--error-color);
  text-align: center;
}
.historial-container {
  max-width: 800px;
  margin: 0 auto;
}
.historial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.filters input {
  flex-grow: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--surface-color);
  color: var(--text-color);
}
.item-list {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.item-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  cursor: pointer;
}
.item-main-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.item-title {
  font-weight: 500;
}
.item-subtitle {
  font-size: 0.9rem;
  color: var(--text-muted-color);
}
.chip {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}
.diagnostico-chip {
  background-color: var(--primary-color);
  color: white;
}
.dark-mode .diagnostico-chip {
  color: #000;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background-color: var(--surface-color);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.modal-header h3 {
  margin: 0;
}
.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted-color);
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}
.consulta-detalle p {
  margin: 0.5rem 0;
}
.consulta-detalle ul {
  padding-left: 20px;
}
</style>
