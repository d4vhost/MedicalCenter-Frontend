<template>
  <div class="view-wrapper" :class="{ 'dark-mode': isDarkMode }">
    <div v-if="!paciente" class="split-screen-container">
      <div class="form-panel">
        <div class="login-card">
          <h1 class="title">Portal de Consultas</h1>
          <p class="subtitle">Ingresa tus datos para ver tu historial.</p>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
              <label for="cedula">Cédula</label>
              <input
                type="text"
                id="cedula"
                v-model="loginData.cedula"
                required
                placeholder="Tu número de cédula"
                maxlength="10"
                @input="loginData.cedula = loginData.cedula.replace(/\D/g, '')"
              />
            </div>
            <div class="form-group">
              <label for="fechaNacimiento">Fecha de Nacimiento</label>
              <input
                type="date"
                id="fechaNacimiento"
                v-model="loginData.fechaNacimiento"
                required
              />
            </div>
            <button type="submit" class="btn-primary" :disabled="isLoading">
              <span v-if="!isLoading">Consultar</span>
              <span v-else>Consultando...</span>
            </button>
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
          </form>
          <div class="footer-link">
            <a @click="$router.push('/')">&larr; Volver a la página principal</a>
          </div>
        </div>
      </div>
      <div class="info-panel">
        <div class="info-content">
          <h2>Acceso Directo a tu Historial</h2>
          <p>
            Consulta tus diagnósticos, prescripciones y resultados de manera segura y confidencial.
          </p>
        </div>
      </div>
    </div>

    <div v-if="paciente" class="page-container">
      <main class="content">
        <div class="historial-container">
          <div class="historial-header">
            <h2 class="historial-title">Historial de {{ paciente.nombreCompleto }}</h2>
            <div class="header-actions">
              <button @click="descargarHistorial" class="btn-primary">
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Descargar</span>
              </button>
              <button @click="handleLogout" class="btn-logout" aria-label="Cerrar sesión">
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
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
              <button
                class="theme-toggle-header"
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
          </div>
          <div class="filters">
            <div class="filter-item">
              <svg
                class="filter-icon"
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input type="date" v-model="busquedaFecha" />
            </div>
            <div class="filter-item">
              <svg
                class="filter-icon"
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                v-model="busquedaMotivo"
                placeholder="Buscar por motivo o enfermedad..."
                maxlength="60"
              />
            </div>
          </div>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fecha y Hora</th>
                  <th>Motivo de Consulta</th>
                  <th>Diagnóstico</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in paginatedHistorial" :key="item.id">
                  <td @click="seleccionarConsulta(item)">
                    {{
                      new Date(item.fechaHora).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }}
                  </td>
                  <td @click="seleccionarConsulta(item)">{{ item.motivo }}</td>
                  <td @click="seleccionarConsulta(item)">{{ item.enfermedadNombre }}</td>
                  <td>
                    <button class="btn-view" @click="seleccionarConsulta(item)">Ver Detalle</button>
                  </td>
                </tr>
                <tr v-if="historialFiltrado.length === 0">
                  <td colspan="4" class="empty-state">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <p>No se encontraron resultados</p>
                    <span>Intenta ajustar los filtros de búsqueda.</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPageHistorial === 1">Anterior</button>
        <span>Página {{ currentPageHistorial }} de {{ totalPagesHistorial }}</span>
        <button @click="nextPage" :disabled="currentPageHistorial === totalPagesHistorial">
          Siguiente
        </button>
      </div>
    </div>

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

    <button
      v-if="!paciente"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/services/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: {
      finalY: number
    }
  }
}

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

const currentPageHistorial = ref(1)
const ITEMS_PER_PAGE = 5

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

const totalPagesHistorial = computed(() => {
  return Math.max(1, Math.ceil(historialFiltrado.value.length / ITEMS_PER_PAGE))
})

const paginatedHistorial = computed(() => {
  const start = (currentPageHistorial.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return historialFiltrado.value.slice(start, end)
})

const nextPage = () => {
  if (currentPageHistorial.value < totalPagesHistorial.value) {
    currentPageHistorial.value++
  }
}

const prevPage = () => {
  if (currentPageHistorial.value > 1) {
    currentPageHistorial.value--
  }
}

watch([busquedaFecha, busquedaMotivo], () => {
  currentPageHistorial.value = 1
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const root = document.querySelector('.view-wrapper')
  if (root) {
    root.classList.toggle('dark-mode', isDarkMode.value)
  }
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

const descargarHistorial = () => {
  if (!paciente.value) return
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  const drawHeader = (pageNumber: number, totalPages: number) => {
    doc.setFillColor(8, 145, 178)
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setFillColor(255, 255, 255)
    doc.circle(20, 20, 8, 'F')
    doc.setFillColor(8, 145, 178)
    doc.rect(18.5, 14, 3, 12, 'F')
    doc.rect(14, 18.5, 12, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('Historial Médico', 35, 18)
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
    doc.setFontSize(9)
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 15, 32, { align: 'right' })
  }

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

  const fileName = `Historial_Medico_${paciente.value.nombreCompleto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

const imprimirConsulta = () => {
  const item = consultaSeleccionada.value
  if (!item) return

  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  doc.setFillColor(8, 145, 178)
  doc.rect(0, 0, pageWidth, 45, 'F')
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 22, 9, 'F')
  doc.setFillColor(8, 145, 178)
  doc.rect(18.5, 15, 3, 14, 'F')
  doc.rect(13, 20.5, 14, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('Detalle de la Consulta', 38, 20)
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
  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(1)
  doc.line(14, 55, pageWidth - 14, 55)

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

  const finalY = doc.lastAutoTable?.finalY || 115

  doc.setFillColor(8, 145, 178)
  doc.rect(14, finalY + 15, pageWidth - 28, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Prescripción Médica', 18, finalY + 20.5)

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

  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    const root = document.querySelector('.view-wrapper')
    if (root) {
      root.classList.add('dark-mode')
    }
  }
})
</script>

<style scoped>
.view-wrapper,
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

.view-wrapper.dark-mode,
.split-screen-container.dark-mode {
  --bg-color: #000000;
  --surface-color: #1c1c1e;
  --surface-elevated: #2c2c2e;
  --border-color: #38383a;
  --border-light: #2c2c2e;
  --text-color: #f5f5f7;
  --headline-color: #ffffff;
  --text-muted-color: #98989d;
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

.split-screen-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
}

.login-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
}

.info-panel {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop');
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

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: left;
  margin-bottom: 0;
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

.form-group input:hover:not(:focus) {
  border-color: var(--text-muted-color);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.1);
}

.view-wrapper.dark-mode .form-group input:focus {
  box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.2);
}

.btn-primary {
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

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  background-color: var(--text-muted-color);
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

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

.view-wrapper.dark-mode .error-message {
  background-color: rgba(255, 69, 58, 0.15);
  border-color: rgba(255, 69, 58, 0.3);
}

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
}

.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: var(--text-color);
  background-color: #f0f2f5;
  transition: background-color var(--transition-normal);
}

.view-wrapper.dark-mode .page-container {
  background-color: #000000;
}

.content {
  flex-grow: 1;
  padding: 2rem 2.5rem;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
}

.historial-container {
  animation: fadeIn 0.5s ease-out;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 4rem);
}

.historial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.historial-title {
  font-size: 1.75rem;
  font-weight: 400;
  color: var(--headline-color);
  margin: 0;
  letter-spacing: -0.02em;
}

.header-actions {
  display: flex;
  gap: 1.25rem;
  align-items: center;
  flex-wrap: wrap;
}

.header-actions .btn-primary,
.header-actions .btn-logout {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.9375rem;
}

.btn-logout {
  background-color: var(--secondary-color);
  color: var(--text-muted-color);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast);
}

.btn-logout:hover {
  color: var(--danger-color);
  background-color: rgba(255, 59, 48, 0.1);
  border-color: rgba(255, 59, 48, 0.2);
}

.theme-toggle-header {
  background: none;
  border: 1px solid var(--border-color);
  cursor: pointer;
  color: var(--text-muted-color);
  padding: 0.625rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  width: 44px;
  height: 44px;
}

.theme-toggle-header:hover {
  color: var(--headline-color);
  background-color: var(--secondary-color);
  transform: scale(1.05);
}

.filters {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.filter-item {
  position: relative;
  display: flex;
  align-items: center;
}

.filter-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted-color);
  pointer-events: none;
}

.filters input {
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 3rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--surface-color);
  color: var(--text-color);
  font-size: 0.9375rem;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.table-wrapper {
  flex-grow: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}

th,
td {
  padding: 1.25rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  white-space: nowrap;
}

th {
  background-color: var(--secondary-color);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

tbody tr {
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

tbody tr:hover {
  background-color: var(--secondary-color);
}

tbody tr:last-child td {
  border-bottom: none;
}

.btn-view {
  background-color: var(--secondary-hover);
  color: var(--text-color);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-view:hover {
  background-color: var(--primary-color);
  color: white;
}

.empty-state {
  text-align: center;
  color: var(--text-muted-color);
}
.empty-state:hover {
  background-color: transparent;
}
.empty-state svg {
  color: var(--border-color);
  margin-bottom: 1rem;
}
.empty-state p {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--headline-color);
}
.empty-state span {
  font-size: 0.9375rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0 0.5rem 0;
  gap: 1rem;
  flex-shrink: 0;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.pagination button {
  background-color: var(--surface-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.pagination button:hover:not(:disabled) {
  background-color: var(--secondary-hover);
  border-color: var(--text-muted-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination span {
  color: var(--text-muted-color);
  font-size: 0.875rem;
  font-weight: 500;
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
  padding: 1rem;
}

.modal-content {
  background-color: var(--surface-color);
  color: var(--text-color);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 450px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--surface-elevated);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--headline-color);
}

.btn-close-modal {
  background: var(--secondary-color);
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-muted-color);
  width: 32px;
  height: 32px;
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
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.consulta-detalle {
  background-color: var(--bg-color);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.consulta-detalle p,
.consulta-detalle li {
  color: var(--text-color);
  margin: 0.75rem 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.consulta-detalle ul {
  padding-left: 0;
  margin: 0.8rem 0 0 0;
  list-style: none;
}

.consulta-detalle strong {
  color: var(--headline-color);
  font-weight: 600;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border-color);
}

.modal-actions .btn-secondary,
.modal-actions .btn-primary {
  padding: 0.625rem 1rem;
  font-size: 0.9rem;
  min-width: 100px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex: 1;
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
  background-color: var(--secondary-hover);
  border-color: var(--text-muted-color);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

@media (max-width: 992px) {
  .info-panel {
    display: none;
  }
  .form-panel {
    flex-basis: 100%;
  }
}

@media (max-width: 768px) {
  .content {
    padding: 1.5rem 1rem;
  }
  .historial-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  .historial-title {
    font-size: 1.5rem;
  }
  .header-actions {
    width: 100%;
    justify-content: flex-start;
    gap: 0.8rem;
  }
  .header-actions .btn-primary,
  .header-actions .btn-logout {
    padding: 0.6rem 0.9rem;
    font-size: 0.85rem;
  }
  .theme-toggle-header {
    width: 38px;
    height: 38px;
  }

  .filters {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .filter-item input {
    padding: 0.75rem 0.8rem 0.75rem 2.5rem;
    font-size: 0.875rem;
  }
  .filter-icon {
    left: 0.8rem;
  }

  th,
  td {
    padding: 1.2rem 1rem;
    font-size: 0.85rem;
  }
  .btn-view {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .pagination {
    padding: 1rem 0.5rem;
    gap: 0.8rem;
  }
  .pagination button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  .pagination span {
    font-size: 0.8rem;
  }

  .modal-content {
    max-width: 95%;
    max-height: 85vh;
  }
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
