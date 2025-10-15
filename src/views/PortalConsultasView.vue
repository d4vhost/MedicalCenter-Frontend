<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <nav class="navbar">
      <div class="navbar-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="navbar-logo"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
        <h1 class="navbar-title">Portal de Consultas</h1>
      </div>
      <div class="navbar-actions">
        <button v-if="paciente" @click="handleLogout" class="btn-logout" aria-label="Cerrar sesión">
          <span>Cerrar Sesión</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
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
    </nav>

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

    <footer class="footer">
      <p>
        &copy; {{ new Date().getFullYear() }} Portal de Consultas Médicas. Todos los derechos
        reservados.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
// ** 1. IMPORTAMOS LAS LIBRERÍAS PARA PDF **
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ** EXTENDER EL TIPO DE jsPDF PARA INCLUIR lastAutoTable **
declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

// --- Interfaces ---
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

// --- State ---
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

// --- Computed ---
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

// --- Methods ---
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

const handleLogout = () => {
  localStorage.removeItem('authToken')
  paciente.value = null
  historial.value = []
  router.push('/')
}

// ** 2. FUNCIÓN DE DESCARGA MEJORADA Y PROFESIONAL **
const descargarHistorial = () => {
  if (!paciente.value) return
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Función auxiliar para el encabezado
  const drawHeader = (pageNumber: number, totalPages: number) => {
    // Fondo del encabezado
    doc.setFillColor(8, 145, 178)
    doc.rect(0, 0, pageWidth, 40, 'F')

    // Icono de hospital (cruz médica)
    doc.setFillColor(255, 255, 255)
    doc.circle(20, 20, 8, 'F')
    doc.setFillColor(8, 145, 178)
    // Cruz vertical
    doc.rect(18.5, 14, 3, 12, 'F')
    // Cruz horizontal
    doc.rect(14, 18.5, 12, 3, 'F')

    // Título principal
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Historial Médico', 35, 18)

    // Información del paciente
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Paciente: ${paciente.value?.nombreCompleto || 'N/A'}`, 35, 26)
    doc.text(
      `Fecha de emisión: ${new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      35,
      32,
    )

    // Número de página en el encabezado
    doc.setFontSize(9)
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 15, 32, { align: 'right' })
  }

  // Función auxiliar para el pie de página
  const drawFooter = () => {
    doc.setDrawColor(8, 145, 178)
    doc.setLineWidth(0.5)
    doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20)

    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'Portal de Consultas Médicas - Documento Confidencial',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' },
    )
    doc.setFont('helvetica', 'normal')
    doc.text(
      'Este documento contiene información médica confidencial del paciente',
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' },
    )
  }

  // Mapeamos el historial SIN el índice
  const tableBody = historialFiltrado.value.map((item) => {
    const prescripcionesTexto =
      item.prescripciones.length > 0
        ? item.prescripciones
            .map((p) => `• ${p.nombreMedicamento}\n  ${p.indicaciones}`)
            .join('\n\n')
        : 'Sin prescripción registrada'

    return [
      new Date(item.fechaHora).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      item.motivo,
      item.enfermedadNombre,
      prescripcionesTexto,
    ]
  })

  // Generamos la tabla SIN la columna #
  autoTable(doc, {
    head: [['Fecha y Hora', 'Motivo', 'Diagnóstico', 'Prescripción']],
    body: tableBody,
    startY: 50,
    margin: { top: 50, left: 14, right: 14, bottom: 25 },
    headStyles: {
      fillColor: [8, 145, 178],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 35, fontSize: 9 },
      1: { cellWidth: 38, fontSize: 9 },
      2: { cellWidth: 32, fontSize: 9 },
      3: { cellWidth: 'auto', fontSize: 8, cellPadding: 4 },
    },
    alternateRowStyles: {
      fillColor: [245, 250, 252],
    },
    styles: {
      cellPadding: 4,
      fontSize: 9,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages()
      drawHeader(data.pageNumber, pageCount)
      drawFooter()
    },
  })

  // Guardamos el archivo
  const fileName = `Historial_Medico_${paciente.value.nombreCompleto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

// ** 3. FUNCIÓN DE IMPRESIÓN MEJORADA Y PROFESIONAL **
const imprimirConsulta = () => {
  const item = consultaSeleccionada.value
  if (!item) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  // Encabezado con diseño profesional
  doc.setFillColor(8, 145, 178)
  doc.rect(0, 0, pageWidth, 45, 'F')

  // Icono de hospital (cruz médica)
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 22, 9, 'F')
  doc.setFillColor(8, 145, 178)
  // Cruz vertical
  doc.rect(18.5, 15, 3, 14, 'F')
  // Cruz horizontal
  doc.rect(13, 20.5, 14, 3, 'F')

  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalle de Consulta Médica', 38, 20)

  // Subtítulo
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Paciente: ${paciente.value?.nombreCompleto || 'N/A'}`, 38, 28)
  doc.text(
    `Emisión: ${new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}`,
    38,
    35,
  )

  // Línea decorativa
  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(1)
  doc.line(14, 55, pageWidth - 14, 55)

  // Información de la consulta en tabla
  autoTable(doc, {
    startY: 65,
    theme: 'plain',
    body: [
      [
        'Fecha y Hora:',
        new Date(item.fechaHora).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      ],
      ['Motivo de Consulta:', item.motivo],
      ['Diagnóstico:', item.enfermedadNombre],
    ],
    columnStyles: {
      0: {
        fontStyle: 'bold',
        cellWidth: 50,
        textColor: [8, 145, 178],
        fontSize: 11,
      },
      1: {
        fontSize: 10,
        textColor: [50, 50, 50],
      },
    },
    styles: {
      cellPadding: 6,
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [250, 252, 255],
    },
  })

  // Sección de prescripciones
  const finalY = doc.lastAutoTable?.finalY || 115

  // Título de prescripciones con altura reducida
  doc.setFillColor(8, 145, 178)
  doc.rect(14, finalY + 15, pageWidth - 28, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Prescripción Médica', 18, finalY + 20.5)

  // Tabla de prescripciones SIN columna #
  const prescripcionesBody =
    item.prescripciones.length > 0
      ? item.prescripciones.map((p) => [p.nombreMedicamento, p.indicaciones])
      : [['Sin prescripciones registradas para esta consulta.', '']]

  autoTable(doc, {
    startY: finalY + 28,
    theme: 'striped',
    head: item.prescripciones.length > 0 ? [['Medicamento', 'Indicaciones']] : undefined,
    body: prescripcionesBody,
    headStyles: {
      fillColor: [8, 145, 178],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center',
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 55, fontSize: 10, fontStyle: 'bold' },
      1: { cellWidth: 'auto', fontSize: 9 },
    },
    alternateRowStyles: {
      fillColor: [245, 250, 252],
    },
    styles: {
      cellPadding: 5,
      fontSize: 9,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
  })

  // Pie de página con información legal
  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(0.5)
  doc.line(14, pageHeight - 25, pageWidth - 14, pageHeight - 25)

  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'italic')
  doc.text('Portal de Consultas Médicas - Documento Informativo', pageWidth / 2, pageHeight - 17, {
    align: 'center',
  })
  doc.setFont('helvetica', 'normal')
  doc.text(
    'Este documento es una copia informativa y no sustituye la prescripción médica original',
    pageWidth / 2,
    pageHeight - 12,
    { align: 'center' },
  )
  doc.setFontSize(7)
  doc.text(
    `Documento generado el: ${new Date().toLocaleString('es-ES')}`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' },
  )

  // Abrimos el PDF en una nueva pestaña para imprimir
  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
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
/* ===== VARIABLES DE TEMA (SIN CAMBIOS) ===== */
.page-container {
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
  --warning-color: #ff9500;
  --info-color: #5ac8fa;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.08);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}

.page-container.dark-mode {
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
  --warning-color: #ff9f0a;
  --info-color: #64d2ff;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
}

/* ===== LAYOUT PRINCIPAL Y FONDO (MODIFICADO) ===== */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  /* ** FONDO DEGRADADO ** */
  background: linear-gradient(145deg, #e0e8e8, #cad6d6);

  transition:
    background-color var(--transition-normal),
    color var(--transition-normal);
  position: relative;
}

.page-container.dark-mode {
  background: linear-gradient(145deg, #1e2929, #2c3a3a);
}

/* ===== NAVBAR ===== */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.dark-mode .navbar {
  background-color: rgba(28, 28, 30, 0.7);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.navbar-logo {
  color: var(--primary-color);
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--headline-color);
  margin: 0;
  letter-spacing: -0.02em;
}

.navbar-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background-color: var(--secondary-color);
  color: var(--text-muted-color);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.1);
  border-color: rgba(255, 59, 48, 0.2);
}

/* ===== BOTONES ===== */
.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  letter-spacing: -0.01em;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  padding: 0.625rem 1.25rem;
  background-color: var(--surface-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background-color: var(--secondary-color);
  border-color: var(--text-muted-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted-color);
  padding: 0.625rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  width: 40px;
  height: 40px;
}

.theme-toggle:hover {
  color: var(--headline-color);
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

/* ===== CONTENT ===== */
.content {
  flex-grow: 1;
  padding: 3rem 2.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* ===== LOGIN FORM (SIN CAMBIOS) ===== */
.login-form-container {
  max-width: 480px;
  margin: 4rem auto;
  padding: 3rem;
  background-color: var(--surface-color);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
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

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-family: inherit;
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

.login-form .btn-primary {
  width: 100%;
  padding: 1rem;
  margin-top: 0.5rem;
  font-size: 1.0625rem;
}

.error-message {
  margin-top: 1.25rem;
  padding: 1rem 1.25rem;
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.08);
  border: 1px solid rgba(255, 59, 48, 0.2);
  border-radius: var(--radius-md);
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
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

/* ===== HISTORIAL CONTAINER (SIN CAMBIOS) ===== */
.historial-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.historial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.historial-header h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--headline-color);
  margin: 0;
  letter-spacing: -0.03em;
}

/* ===== FILTERS (SIN CAMBIOS) ===== */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filters input {
  flex: 1;
  min-width: 200px;
  padding: 0.875rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-color);
  color: var(--text-color);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.filters input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.dark-mode .filters input:focus {
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.2);
}

/* ===== ITEM LIST (SIN CAMBIOS) ===== */
.item-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface-color);
  padding: 1.5rem 1.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.item-list li:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.item-list li:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.item-list li:only-child {
  text-align: center;
  color: var(--text-muted-color);
  cursor: default;
  border-style: dashed;
  padding: 3rem;
}

.item-list li:only-child:hover {
  border-color: var(--border-color);
  transform: none;
  box-shadow: var(--shadow-sm);
}

.item-main-info {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  flex: 1;
}

.item-title {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
  letter-spacing: -0.01em;
}

.item-subtitle {
  font-size: 0.875rem;
  color: var(--text-muted-color);
  font-weight: 400;
}

/* ===== CHIPS (SIN CAMBIOS) ===== */
.chip {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: -0.01em;
}

.diagnostico-chip {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px rgba(8, 145, 178, 0.2);
}

/* ===== MODALES (SIN CAMBIOS) ===== */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity var(--transition-normal);
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform var(--transition-normal);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.96) translateY(10px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1.5rem;
}

.dark-mode .modal-overlay {
  background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
  background-color: var(--surface-color);
  border-radius: var(--radius-xl);
  width: 90%;
  max-width: 650px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 2rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--headline-color);
  letter-spacing: -0.02em;
}

.btn-close-modal {
  background: var(--secondary-color);
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  color: var(--text-muted-color);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  line-height: 1;
  padding: 0;
}

.btn-close-modal:hover {
  color: var(--headline-color);
  background-color: var(--secondary-hover);
  transform: scale(1.05);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

/* ===== CONSULTA DETALLE (SIN CAMBIOS) ===== */
.consulta-detalle {
  background-color: var(--bg-color);
  padding: 1.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.consulta-detalle p {
  margin: 0.875rem 0;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.consulta-detalle p:first-child {
  margin-top: 0;
}

.consulta-detalle strong {
  color: var(--headline-color);
  font-weight: 600;
  display: inline-block;
  min-width: 120px;
}

.consulta-detalle ul {
  padding-left: 0;
  margin: 1rem 0 0 0;
  list-style: none;
}

.consulta-detalle ul li {
  padding: 0.875rem 1.25rem;
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  margin-bottom: 0.75rem;
  transition: all var(--transition-fast);
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.consulta-detalle ul li:before {
  content: '💊';
  font-size: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.consulta-detalle ul li:hover {
  border-color: var(--primary-color);
  background-color: var(--bg-color);
}

.consulta-detalle ul li:last-child {
  margin-bottom: 0;
}

/* ===== MODAL ACTIONS (SIN CAMBIOS) ===== */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.875rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* ===== FOOTER ===== */
.footer {
  width: 100%;
  padding: 1.5rem 2.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-muted-color);
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}
.dark-mode .footer {
  background-color: rgba(28, 28, 30, 0.7);
}

/* ===== SCROLLBAR (SIN CAMBIOS) ===== */
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

/* ===== ESTADOS ADICIONALES (SIN CAMBIOS) ===== */
.btn-primary:focus-visible,
.btn-secondary:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* ===== RESPONSIVE (SIN CAMBIOS) ===== */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem 1.5rem;
  }

  .navbar-title {
    font-size: 1.25rem;
  }

  .btn-logout span {
    display: none;
  }

  .content {
    padding: 2rem 1.5rem;
  }

  .login-form-container {
    margin: 2rem auto;
    padding: 2rem;
  }

  .historial-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .historial-header h2 {
    font-size: 1.625rem;
  }

  .historial-header .btn-primary {
    width: 100%;
  }

  .filters {
    flex-direction: column;
  }

  .filters input {
    min-width: 100%;
  }

  .item-list li {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.25rem;
  }

  .chip {
    align-self: flex-start;
  }

  .modal-overlay {
    padding: 1rem;
  }

  .modal-content {
    max-width: 100%;
  }

  .modal-header {
    padding: 1.5rem 1.25rem;
  }

  .modal-body {
    padding: 1.5rem 1.25rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn-primary,
  .modal-actions .btn-secondary {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar-title {
    font-size: 1.1rem;
  }

  .navbar-logo {
    display: none;
  }

  .historial-header h2 {
    font-size: 1.5rem;
  }
}

/* ===== TRANSICIONES SUAVES (SIN CAMBIOS) ===== */
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

/* ===== EFECTOS ADICIONALES (ELIMINADO) ===== */
/* Se eliminó el efecto ::before del login-form-container */

/* ===== EMPTY STATE (SIN CAMBIOS) ===== */
.item-list li:only-child::before {
  content: '📋';
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}
</style>
