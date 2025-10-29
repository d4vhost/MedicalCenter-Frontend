<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode, 'login-view-active': !paciente }">
    <div v-if="!paciente" class="split-screen-container login-variant">
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
            <button type="submit" class="btn-primary full-width" :disabled="isLoading">
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
      <button
        class="theme-toggle login-theme-toggle"
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
    <div v-if="paciente" class="content-wrapper">
      <header class="header historial-view-header">
        <div class="header-content">
          <div class="title-container">
            <h1 class="title">HISTORIAL DE {{ paciente.nombreCompleto.toUpperCase() }}</h1>
          </div>
        </div>
        <div class="header-actions">
          <button @click="descargarHistorial" class="btn-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            <span>DESCARGAR</span>
          </button>
          <button @click="handleLogout" class="btn-logout-sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
            <span>CERRAR SESIÓN</span>
          </button>
          <button
            class="theme-toggle historial-theme-toggle"
            @click="toggleTheme"
            :aria-label="isDarkMode ? 'ACTIVAR MODO CLARO' : 'ACTIVAR MODO OSCURO'"
          >
            <svg
              v-if="isDarkMode"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.73 12.73a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06zM18.01 4.58a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0zM4.58 18.01a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0z"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-5.4-5.4c0-1.81 1-3.35 2.26-4.4A8.995 8.995 0 0 0 12 3z"
              />
            </svg>
          </button>
        </div>
      </header>

      <main class="main-panel historial-main-panel">
        <div class="tab-content">
          <div class="filters">
            <input
              type="date"
              v-model="busquedaFecha"
              @input="busquedaFecha = ($event.target as HTMLInputElement).value"
            />
            <input
              type="text"
              v-model="busquedaMotivo"
              placeholder="BUSCAR POR MOTIVO O ENFERMEDAD..."
              @input="busquedaMotivo = ($event.target as HTMLInputElement).value.toUpperCase()"
              maxlength="60"
            />
          </div>

          <div class="table-wrapper">
            <div class="table-wrapper-inner">
              <table>
                <thead>
                  <tr>
                    <th>FECHA Y HORA</th>
                    <th>MOTIVO DE CONSULTA</th>
                    <th>DIAGNÓSTICO</th>
                    <th>ACCIÓN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in paginatedHistorial" :key="item.id">
                    <td @click="seleccionarConsulta(item)">
                      {{
                        new Date(item.fechaHora)
                          .toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          .toUpperCase()
                      }}
                    </td>
                    <td @click="seleccionarConsulta(item)">{{ item.motivo.toUpperCase() }}</td>
                    <td @click="seleccionarConsulta(item)">
                      {{ item.enfermedadNombre.toUpperCase() }}
                    </td>
                    <td class="action-cell">
                      <button class="btn-historial" @click.stop="seleccionarConsulta(item)">
                        VER DETALLE
                      </button>
                    </td>
                  </tr>
                  <tr
                    v-for="i in Math.max(0, ITEMS_PER_PAGE - paginatedHistorial.length)"
                    :key="'empty-' + i"
                    class="empty-row"
                  >
                    <td v-for="j in 4" :key="'empty-cell-' + i + '-' + j">
                      <span class="empty-cell-content">&nbsp;</span>
                    </td>
                  </tr>
                  <tr v-if="historialFiltrado.length === 0">
                    <td colspan="4" class="no-results-cell">
                      NO SE ENCONTRARON RESULTADOS CON LOS FILTROS ACTUALES.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="pagination">
            <button @click="prevPage" :disabled="currentPageHistorial === 1">ANTERIOR</button>
            <span>PÁGINA {{ currentPageHistorial }} DE {{ totalPagesHistorial }}</span>
            <button @click="nextPage" :disabled="currentPageHistorial === totalPagesHistorial">
              SIGUIENTE
            </button>
          </div>
        </div>
      </main>
    </div>

    <Transition name="modal-fade">
      <div
        v-if="consultaSeleccionada"
        class="modal-overlay"
        @click.self="consultaSeleccionada = null"
      >
        <div class="modal-content modal-sm">
          <div class="modal-header">
            <h3>DETALLE DE LA CONSULTA</h3>
            <button @click="consultaSeleccionada = null" class="btn-close-modal">&times;</button>
          </div>
          <div class="modal-body">
            <div class="consulta-detalle">
              <p>
                <strong>FECHA:</strong>
                {{ new Date(consultaSeleccionada.fechaHora).toLocaleString('es-ES').toUpperCase() }}
              </p>
              <p><strong>MOTIVO:</strong> {{ consultaSeleccionada.motivo.toUpperCase() }}</p>
              <p>
                <strong>DIAGNÓSTICO:</strong>
                {{ consultaSeleccionada.enfermedadNombre.toUpperCase() }}
              </p>
              <p><strong>PRESCRIPCIÓN:</strong></p>
              <ul>
                <li
                  v-for="prescripcion in consultaSeleccionada.prescripciones"
                  :key="prescripcion.id"
                >
                  {{ prescripcion.nombreMedicamento.toUpperCase() }}:
                  {{ prescripcion.indicaciones.toUpperCase() }}
                </li>
                <li
                  v-if="
                    !consultaSeleccionada.prescripciones ||
                    consultaSeleccionada.prescripciones.length === 0
                  "
                >
                  SIN PRESCRIPCIÓN REGISTRADA.
                </li>
              </ul>
            </div>
            <div class="modal-actions">
              <button @click="imprimirConsulta" class="btn-secondary">IMPRIMIR</button>
              <button @click="consultaSeleccionada = null" class="btn-primary">CERRAR</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// --- Script (sin cambios respecto a la versión anterior con correcciones ESLint) ---
import { ref, onMounted, computed, watch, provide } from 'vue'
import apiClient from '@/services/api'
import jsPDF from 'jspdf'
import autoTable, { type HookData } from 'jspdf-autotable'
import { AxiosError } from 'axios'

declare module 'jspdf' {
  interface jsPDF {
    lastAutoTable?: { finalY: number }
  }
}
interface Paciente {
  id: number
  nombreCompleto: string
}
interface HistorialItem {
  id: number
  consultaId: number
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
const loginData = ref({ cedula: '', fechaNacimiento: '' })
const paciente = ref<Paciente | null>(null)
const historial = ref<HistorialItem[]>([])
const consultaSeleccionada = ref<HistorialItem | null>(null)
const busquedaFecha = ref('')
const busquedaMotivo = ref('')
const currentPageHistorial = ref(1)
const ITEMS_PER_PAGE = 9
provide<number>('ITEMS_PER_PAGE_DEFAULT', ITEMS_PER_PAGE)

const historialFiltrado = computed(() => {
  return historial.value.filter((item) => {
    const matchFecha = !busquedaFecha.value || item.fechaHora.startsWith(busquedaFecha.value)
    const matchTexto =
      !busquedaMotivo.value ||
      item.enfermedadNombre.toUpperCase().includes(busquedaMotivo.value) ||
      (item.motivo && item.motivo.toUpperCase().includes(busquedaMotivo.value))
    return matchFecha && matchTexto
  })
})
const totalPagesHistorial = computed(() =>
  Math.max(1, Math.ceil(historialFiltrado.value.length / ITEMS_PER_PAGE)),
)
const paginatedHistorial = computed(() => {
  const start = (currentPageHistorial.value - 1) * ITEMS_PER_PAGE
  return historialFiltrado.value.slice(start, start + ITEMS_PER_PAGE)
})
const nextPage = () => {
  if (currentPageHistorial.value < totalPagesHistorial.value) currentPageHistorial.value++
}
const prevPage = () => {
  if (currentPageHistorial.value > 1) currentPageHistorial.value--
}
watch([busquedaFecha, busquedaMotivo], () => {
  currentPageHistorial.value = 1
})

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  const root = document.querySelector('.page-container')
  if (root) root.classList.toggle('dark-mode', isDarkMode.value)
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}
const aplicarTema = () => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  document.body.classList.toggle('dark-mode', isDarkMode.value)
  const root = document.querySelector('.page-container')
  if (root) root.classList.toggle('dark-mode', isDarkMode.value)
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
    paciente.value = { id: empleadoId, nombreCompleto: nombreCompleto.toUpperCase() }
    await cargarHistorial(empleadoId)
  } catch (err) {
    error.value = 'CÉDULA O FECHA DE NACIMIENTO INCORRECTAS.'
    console.error('Error de login (Paciente):', err)
  } finally {
    isLoading.value = false
  }
}

const cargarHistorial = async (pacienteId: number) => {
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      handleLogout()
      return
    }
    const { data } = await apiClient.get<{
      consultas: Consulta[]
      diagnosticos: Diagnostico[]
      prescripciones?: Prescripcion[]
    }>(`/Pacientes/${pacienteId}/historial`, { headers: { Authorization: `Bearer ${token}` } })
    const consultasMap = new Map(data.consultas.map((c: Consulta) => [c.id, c]))
    const prescripcionesMap = new Map<number, Prescripcion[]>()
    if (data.prescripciones?.length)
      data.prescripciones.forEach((p: Prescripcion) => {
        if (!prescripcionesMap.has(p.diagnosticoId)) prescripcionesMap.set(p.diagnosticoId, [])
        prescripcionesMap.get(p.diagnosticoId)?.push(p)
      })
    historial.value = data.diagnosticos
      .map((d: Diagnostico): HistorialItem | null => {
        const c = consultasMap.get(d.consultaId)
        if (!c) return null
        return {
          id: d.id,
          consultaId: d.consultaId,
          fechaHora: c.fechaHora,
          motivo: c.motivo || 'N/A',
          enfermedadNombre: d.enfermedadNombre,
          prescripciones: prescripcionesMap.get(d.id) || [],
        }
      })
      .filter((item): item is HistorialItem => item !== null)
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 401) handleLogout()
    else {
      console.error('Error al cargar el historial:', error)
      alert('NO SE PUDO CARGAR EL HISTORIAL. INTENTE MÁS TARDE.')
    }
  }
}

const seleccionarConsulta = (item: HistorialItem) => {
  consultaSeleccionada.value = item
}
const handleLogout = () => {
  localStorage.removeItem('authToken')
  paciente.value = null
  historial.value = []
  loginData.value = { cedula: '', fechaNacimiento: '' }
  error.value = ''
}

const descargarHistorial = () => {
  if (!paciente.value) return
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.width
  const ph = doc.internal.pageSize.height
  const drawHeader = (pn: number, tp: number) => {
    doc.setFillColor(8, 145, 178)
    doc.rect(0, 0, pw, 40, 'F')
    doc.setFillColor(255, 255, 255)
    doc.circle(20, 20, 8, 'F')
    doc.setFillColor(8, 145, 178)
    doc.rect(18.5, 14, 3, 12, 'F')
    doc.rect(14, 18.5, 12, 3, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    doc.text('HISTORIAL MÉDICO', 35, 18)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`PACIENTE: ${paciente.value?.nombreCompleto.toUpperCase() || 'N/A'}`, 35, 26)
    doc.text(
      `FECHA DE EMISIÓN: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}`,
      35,
      32,
    )
    doc.setFontSize(9)
    doc.text(`PÁGINA ${pn} DE ${tp}`, pw - 15, 32, { align: 'right' })
  }
  const drawFooter = () => {
    doc.setDrawColor(8, 145, 178)
    doc.setLineWidth(0.5)
    doc.line(14, ph - 20, pw - 14, ph - 20)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    doc.text('PORTAL DE CONSULTAS MÉDICAS - DOCUMENTO CONFIDENCIAL', pw / 2, ph - 12, {
      align: 'center',
    })
    doc.setFont('helvetica', 'normal')
    doc.text(
      'ESTE DOCUMENTO CONTIENE INFORMACIÓN MÉDICA CONFIDENCIAL DEL PACIENTE',
      pw / 2,
      ph - 8,
      { align: 'center' },
    )
  }
  const body = historialFiltrado.value.map((i) => {
    const pt =
      i.prescripciones.length > 0
        ? i.prescripciones
            .map((p) => `• ${p.nombreMedicamento.toUpperCase()}\n  ${p.indicaciones.toUpperCase()}`)
            .join('\n\n')
        : 'SIN PRESCRIPCIÓN REGISTRADA'
    return [
      new Date(i.fechaHora)
        .toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
        .toUpperCase(),
      i.motivo.toUpperCase(),
      i.enfermedadNombre.toUpperCase(),
      pt,
    ]
  })
  autoTable(doc, {
    head: [['FECHA Y HORA', 'MOTIVO', 'DIAGNÓSTICO', 'PRESCRIPCIÓN']],
    body,
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
    alternateRowStyles: { fillColor: [245, 250, 252] },
    styles: { cellPadding: 4, fontSize: 9, lineColor: [200, 200, 200], lineWidth: 0.1 },
    didDrawPage: (d: HookData) => {
      const pc = doc.getNumberOfPages ? doc.getNumberOfPages() : 0
      drawHeader(d.pageNumber, pc)
      drawFooter()
    },
  })
  const fn = `Historial_Medico_${paciente.value.nombreCompleto.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fn)
}

const imprimirConsulta = () => {
  const item = consultaSeleccionada.value
  if (!item) return
  const doc = new jsPDF()
  const pw = doc.internal.pageSize.width
  const ph = doc.internal.pageSize.height
  doc.setFillColor(8, 145, 178)
  doc.rect(0, 0, pw, 45, 'F')
  doc.setFillColor(255, 255, 255)
  doc.circle(20, 22, 9, 'F')
  doc.setFillColor(8, 145, 178)
  doc.rect(18.5, 15, 3, 14, 'F')
  doc.rect(13, 20.5, 14, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text('DETALLE DE LA CONSULTA', 38, 20)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`PACIENTE: ${paciente.value?.nombreCompleto.toUpperCase() || 'N/A'}`, 38, 28)
  doc.text(
    `EMISIÓN: ${new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}`,
    38,
    35,
  )
  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(1)
  doc.line(14, 55, pw - 14, 55)
  autoTable(doc, {
    startY: 65,
    theme: 'plain',
    body: [
      [
        'FECHA Y HORA:',
        new Date(item.fechaHora)
          .toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .toUpperCase(),
      ],
      ['MOTIVO DE CONSULTA:', item.motivo.toUpperCase()],
      ['DIAGNÓSTICO:', item.enfermedadNombre.toUpperCase()],
    ],
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50, textColor: [8, 145, 178], fontSize: 11 },
      1: { fontSize: 10, textColor: [50, 50, 50] },
    },
    styles: { cellPadding: 6, lineColor: [220, 220, 220], lineWidth: 0.1 },
    alternateRowStyles: { fillColor: [250, 252, 255] },
  })
  const fy = doc.lastAutoTable?.finalY || 115
  doc.setFillColor(8, 145, 178)
  doc.rect(14, fy + 15, pw - 28, 8, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PRESCRIPCIÓN MÉDICA', 18, fy + 20.5)
  const pb =
    item.prescripciones.length > 0
      ? item.prescripciones.map((p) => [
          p.nombreMedicamento.toUpperCase(),
          p.indicaciones.toUpperCase(),
        ])
      : [['SIN PRESCRIPCIONES REGISTRADAS PARA ESTA CONSULTA.', '']]
  autoTable(doc, {
    startY: fy + 28,
    theme: 'striped',
    head: item.prescripciones.length > 0 ? [['MEDICAMENTO', 'INDICACIONES']] : undefined,
    body: pb,
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
      1: { cellWidth: 'auto', fontSize: 9, fontStyle: 'normal' },
    },
    alternateRowStyles: { fillColor: [245, 250, 252] },
    styles: { cellPadding: 5, fontSize: 9, lineColor: [200, 200, 200], lineWidth: 0.1 },
  })
  doc.setDrawColor(8, 145, 178)
  doc.setLineWidth(0.5)
  doc.line(14, ph - 25, pw - 14, ph - 25)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'italic')
  doc.text('PORTAL DE CONSULTAS MÉDICAS - DOCUMENTO INFORMATIVO', pw / 2, ph - 17, {
    align: 'center',
  })
  doc.setFont('helvetica', 'normal')
  doc.text(
    'ESTE DOCUMENTO ES UNA COPIA INFORMATIVA Y NO SUSTITUYE LA PRESCRIPCIÓN MÉDICA ORIGINAL',
    pw / 2,
    ph - 12,
    { align: 'center' },
  )
  doc.setFontSize(7)
  doc.text(
    `DOCUMENTO GENERADO EL: ${new Date().toLocaleString('es-ES').toUpperCase()}`,
    pw / 2,
    ph - 8,
    { align: 'center' },
  )
  doc.autoPrint()
  window.open(doc.output('bloburl'), '_blank')
}

onMounted(aplicarTema)
</script>

<style>
/* 1. Importar estilos base de portalMedico */
@import '@/styles/portalMedico.css';

/* 2. Estilos específicos para SOBREESCRIBIR/DEFINIR en la vista de LOGIN */
.page-container.login-view-active {
  background-color: var(--bg-color);
  /* Asegura que no apliquen estilos de layout de historial */
  display: block; /* O flex si split-screen lo necesita directamente */
}

/* Estilos originales de split-screen para el login */
.login-view-active .split-screen-container {
  display: flex;
  min-height: 100vh;
  /* Fondo ya definido por page-container */
}

.login-view-active .form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  position: relative;
  background-color: var(--bg-color); /* Fondo del panel */
  /* Resetear estilos de .main-panel */
  overflow-y: initial;
  max-width: initial;
  width: auto;
  margin: 0;
}

.login-view-active .info-panel {
  flex: 1;
  background-image: url('https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=2070&auto.format&fit=crop'); /* Imagen original */
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex; /* Asegurar que se muestre */
  align-items: flex-end;
  padding: 4rem;
}

.login-view-active .info-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
}

.login-view-active .info-content {
  position: relative;
  z-index: 2;
  color: white;
  max-width: 500px;
}

.login-view-active .info-content h2 {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  line-height: 1.2;
  letter-spacing: -0.03em;
  color: white; /* Asegurar color */
  text-transform: none; /* SIN Mayúsculas */
}

.login-view-active .info-content p {
  font-size: 1.25rem;
  opacity: 0.95;
  line-height: 1.6;
  font-weight: 400;
  color: white; /* Asegurar color */
  text-transform: none; /* SIN Mayúsculas */
}

.login-view-active .login-card {
  width: 100%;
  max-width: 420px;
  text-align: center;
  animation: fadeInUp 0.6s ease-out;
  padding: 0;
  border-radius: 0;
  border: none;
  box-shadow: none;
  background-color: transparent;
}

.login-view-active .login-card .title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--headline-color);
  margin-bottom: 0.625rem;
  letter-spacing: -0.03em;
  text-transform: none;
}

.login-view-active .login-card .subtitle {
  color: var(--text-muted-color);
  margin-bottom: 2.5rem;
  font-size: 0.9375rem;
  line-height: 1.5;
  font-weight: 400;
  text-transform: none;
}

.login-view-active .login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-view-active .form-group {
  /* Usar estilos de _forms.css */
  text-align: left;
  margin-bottom: 0;
}
.login-view-active .form-group label {
  /* Usar estilos de _forms.css */
  text-transform: none; /* SIN Mayúsculas */
}
.login-view-active .form-group input {
  /* Usar estilos de _forms.css */
  text-transform: none; /* SIN Mayúsculas en input */
}
.login-view-active .form-group input::placeholder {
  /* Usar estilos de _forms.css */
  text-transform: none; /* SIN Mayúsculas */
}

/* Botón de login específico */
.login-view-active .login-form .btn-primary {
  /* Hereda .btn-primary de portalMedico */
  padding: 1rem; /* Padding original del login */
  font-size: 1.0625rem; /* Tamaño original */
  width: 100%; /* **** MODIFICACIÓN: Ancho completo **** */
  align-self: initial; /* Resetear centrado */
  margin-top: 0.5rem; /* Margen original */
  text-transform: uppercase; /* **** MODIFICACIÓN: Texto en MAYÚSCULAS **** */
}

.login-view-active .footer-link {
  margin-top: 2rem;
}
.login-view-active .footer-link a {
  color: var(--text-muted-color);
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 500;
  transition: color var(--transition-fast);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  text-transform: none; /* SIN Mayúsculas */
}
.login-view-active .footer-link a:hover {
  color: var(--primary-color);
}

.login-view-active .error-message {
  color: var(--danger-color);
  background-color: rgba(var(--rgb-danger, 255, 59, 48), 0.08);
  border: 1px solid rgba(var(--rgb-danger, 255, 59, 48), 0.2);
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  margin-top: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  animation: shake 0.3s ease-in-out;
  text-transform: uppercase; /* **** MODIFICACIÓN: Texto en MAYÚSCULAS **** */
}
.dark-mode.login-view-active .error-message {
  background-color: rgba(var(--rgb-danger-dark, 255, 69, 58), 0.15);
  border-color: rgba(var(--rgb-danger-dark, 255, 69, 58), 0.3);
}

/* Botón de tema específico para login */
.login-view-active .theme-toggle.login-theme-toggle {
  /* Hereda .theme-toggle de portalMedico */
  position: fixed;
  top: 2rem;
  right: 2rem;
}
.login-view-active .historial-theme-toggle {
  display: none;
}

/* --- Fin estilos específicos LOGIN --- */

/* 3. Estilos específicos para la VISTA DE HISTORIAL (cuando paciente existe) */
/* Usan selectores :not(.login-view-active) para evitar aplicarse al login */

.page-container:not(.login-view-active) {
  /* Asegurar fondo correcto para historial */
  background-color: #f0f2f5; /* Fondo gris claro original para historial */
}
.dark-mode.page-container:not(.login-view-active) {
  background-color: #000000; /* Fondo negro original para historial dark */
}

.page-container:not(.login-view-active) .content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container:not(.login-view-active) .historial-view-header {
  /* Estilos del header de portalMedico ya importados */
  position: sticky;
  top: 0;
  z-index: 100;
  /* **** MODIFICACIÓN: Asegurar alineación horizontal de botones **** */
  display: flex;
  justify-content: space-between; /* Título a la izq, acciones a la der */
  align-items: center; /* Centrar verticalmente */
}
.page-container:not(.login-view-active) .header-actions {
  display: flex; /* Asegurar flex */
  align-items: center; /* Alinear verticalmente */
  gap: 1rem; /* Espacio entre botones */
  flex-wrap: nowrap; /* **** MODIFICACIÓN: Evitar que se envuelvan **** */
}

.page-container:not(.login-view-active) .historial-main-panel {
  /* Estilos de .main-panel de portalMedico ya importados */
  flex-grow: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding-top: 2rem;
}

/* Ocultar botón tema login en historial */
.page-container:not(.login-view-active) .login-theme-toggle {
  display: none;
}
/* Mostrar botón tema historial */
.page-container:not(.login-view-active) .historial-theme-toggle {
  /* Hereda .theme-toggle de portalMedico */
  /* Asegurar display flex si fue ocultado */
  display: flex;
}

/* Ajustes modal detalle */
.page-container:not(.login-view-active) .consulta-detalle {
  background-color: var(--secondary-color);
  padding: 1.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  margin-bottom: 1.5rem;
}
.page-container:not(.login-view-active) .consulta-detalle p,
.page-container:not(.login-view-active) .consulta-detalle li {
  color: var(--text-color);
  margin-bottom: 0.5rem;
  line-height: 1.5;
  font-size: 0.9rem;
}
.page-container:not(.login-view-active) .consulta-detalle ul {
  padding-left: 1rem;
  list-style: disc;
  margin-top: 0.5rem;
}
.page-container:not(.login-view-active) .consulta-detalle strong {
  color: var(--headline-color);
  font-weight: 600;
  margin-right: 0.5rem;
}
/* --- Fin estilos específicos HISTORIAL --- */

/* --- ESTILOS RESPONSIVE --- */

/* Ocultar panel de info en pantallas medianas */
@media (max-width: 992px) {
  .login-view-active .info-panel {
    display: none;
  }
  .login-view-active .form-panel {
    flex-basis: 100%;
  }
}

/* Ajustes generales y de login en pantallas pequeñas */
@media (max-width: 768px) {
  /* Ajustes historial */
  .page-container:not(.login-view-active) .historial-main-panel {
    padding: 1.5rem 1rem;
  }
  /* **** MODIFICACIÓN: Ajustar header-actions en móvil **** */
  .page-container:not(.login-view-active) .historial-view-header {
    flex-direction: column; /* Apilar título y acciones */
    align-items: stretch; /* Ocupar todo el ancho */
    gap: 1rem;
  }
  .page-container:not(.login-view-active) .header-actions {
    gap: 0.5rem;
    justify-content: flex-end; /* Alinear botones a la derecha */
    flex-wrap: wrap; /* Permitir wrap si no caben */
  }
  .page-container:not(.login-view-active) .header-actions .btn-secondary,
  .page-container:not(.login-view-active) .header-actions .btn-logout-sidebar {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  .page-container:not(.login-view-active) .header-actions .btn-secondary svg,
  .page-container:not(.login-view-active) .header-actions .btn-logout-sidebar svg {
    width: 16px;
    height: 16px;
  }
  .page-container:not(.login-view-active) .historial-theme-toggle {
    width: 36px;
    height: 36px;
    padding: 0.5rem;
  }
  .page-container:not(.login-view-active) .historial-theme-toggle svg {
    width: 18px;
    height: 18px;
  }

  /* Ajustes Login */
  .login-view-active .form-panel {
    padding: 1.5rem;
  }
  .login-view-active .login-card .title {
    font-size: 1.875rem;
  }
  .login-view-active .login-card .subtitle {
    font-size: 0.875rem;
  }
  .login-view-active .login-form .btn-primary {
    padding: 0.875rem; /* Reducir padding en móvil */
    font-size: 1rem;
  }
  .login-view-active .theme-toggle.login-theme-toggle {
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
}

/* Variables RGB */
:root {
  --rgb-primary: 8, 145, 178;
  --rgb-primary-dark: 34, 211, 238;
  --rgb-danger: 255, 59, 48;
  --rgb-danger-dark: 255, 69, 58;
}

/* Animaciones */
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
</style>
