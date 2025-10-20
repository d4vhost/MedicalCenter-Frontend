// src/composables/portalMedico/useMedicoData.ts
import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import type {
  Medico,
  MedicoInfo,
  Consulta,
  Paciente,
  Medicamento,
  Diagnostico,
  HistorialPacienteData,
  HistorialItem,
  DecodedToken,
  PrescripcionGuardada,
} from '@/types/medicoPortal'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'

interface ConsultaApiResponseItem {
  id: number
  fechaHora: string
  pacienteId: number
  nombrePaciente?: string
  medicoId: number
  nombreMedico?: string
  motivo?: string
}

export function useMedicoData() {
  const router = useRouter()
  const medico = ref<Medico>({ empleadoId: 0, nombreCompleto: 'Cargando...' })
  const medicoInfo = ref<Partial<MedicoInfo>>({})
  const consultas = ref<Consulta[]>([])
  const pacientes = ref<Paciente[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const diagnosticos = ref<Diagnostico[]>([]) // Lista de TODOS los diagnósticos
  const historialPaciente = ref<HistorialPacienteData>({
    consultas: [],
    diagnosticos: [],
    prescripciones: [],
  })

  // --- Refs de Filtros y Paginación ---
  const busquedaConsultaCedula = ref('')
  const busquedaConsultaFecha = ref('')
  const currentPageConsultas = ref(1)
  const busquedaPacienteCedula = ref('')
  const currentPagePacientes = ref(1)
  const busquedaMedicamento = ref('')
  const currentPageMedicamentos = ref(1)
  const historialBusquedaFecha = ref('')
  const historialBusquedaEnfermedad = ref('')
  const currentPageHistorial = ref(1)
  const currentPageConsultasPerfil = ref(1)

  const ITEMS_PER_PAGE = 7
  const HISTORIAL_ITEMS_PER_PAGE = 3
  const CONSULTAS_PERFIL_PER_PAGE = 4

  // --- Computed Properties ---

  const consultasFiltradas = computed(() => {
    const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
    return consultas.value
      .filter((consulta) => {
        const matchCedula =
          !busquedaConsultaCedula.value ||
          consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
        const matchFecha =
          !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)
        const esDeEsteMedico = consulta.medicoId === medicoInfo.value.id
        const noTieneDiagnostico = !diagnosticosConsultaIds.has(consulta.id)
        return matchCedula && matchFecha && esDeEsteMedico && noTieneDiagnostico
      })
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
  })

  const totalPagesConsultas = computed(() =>
    Math.max(1, Math.ceil(consultasFiltradas.value.length / ITEMS_PER_PAGE)),
  )

  const paginatedConsultas = computed(() => {
    const start = (currentPageConsultas.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return consultasFiltradas.value.slice(start, end)
  })

  // --- Computeds de Pacientes y Medicamentos (sin cambios) ---
  const pacientesFiltrados = computed(() => {
    return pacientes.value.filter(
      (paciente) =>
        !busquedaPacienteCedula.value || paciente.cedula.includes(busquedaPacienteCedula.value),
    )
  })
  const totalPagesPacientes = computed(() =>
    Math.max(1, Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE)),
  )
  const paginatedPacientes = computed(() => {
    const start = (currentPagePacientes.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return pacientesFiltrados.value.slice(start, end)
  })

  const medicamentosFiltrados = computed(() => {
    const busqueda = busquedaMedicamento.value.toLowerCase()
    return medicamentos.value.filter(
      (med) =>
        !busqueda ||
        med.nombreGenerico.toLowerCase().includes(busqueda) ||
        med.nombreComercial?.toLowerCase().includes(busqueda) ||
        med.laboratorio?.toLowerCase().includes(busqueda),
    )
  })
  const totalPagesMedicamentos = computed(() =>
    Math.max(1, Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE)),
  )
  const paginatedMedicamentos = computed(() => {
    const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return medicamentosFiltrados.value.slice(start, end)
  })

  // Modificado: Ahora filtra por médico Y por tener diagnóstico
  const consultasRealizadasPorMedico = computed(() => {
    const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
    return consultas.value
      .filter(
        (c) =>
          c.medicoId === medicoInfo.value.id && // Es de este médico
          diagnosticosConsultaIds.has(c.id), // Tiene un diagnóstico asociado
      )
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()) // Orden DESC
  })

  const totalPagesConsultasPerfil = computed(() =>
    Math.max(1, Math.ceil(consultasRealizadasPorMedico.value.length / CONSULTAS_PERFIL_PER_PAGE)),
  )

  const paginatedConsultasPerfil = computed(() => {
    const start = (currentPageConsultasPerfil.value - 1) * CONSULTAS_PERFIL_PER_PAGE
    const end = start + CONSULTAS_PERFIL_PER_PAGE
    // Añadimos la propiedad 'pendiente' (que será false aquí) para consistencia con TabPerfil
    return consultasRealizadasPorMedico.value
      .slice(start, end)
      .map((c) => ({ ...c, pendiente: false }))
  })

  // --- Historial Paciente (sin cambios) ---
  const historialCombinado = computed((): HistorialItem[] => {
    const consultasMap = new Map((historialPaciente.value.consultas ?? []).map((c) => [c.id, c]))
    return (historialPaciente.value.diagnosticos ?? [])
      .map((diagnostico) => {
        const consulta = consultasMap.get(diagnostico.consultaId)
        return {
          ...diagnostico,
          fechaHora: consulta?.fechaHora || '',
          motivo: consulta?.motivo || 'N/A',
        }
      })
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
  })

  const historialFiltrado = computed(() => {
    return historialCombinado.value.filter((item) => {
      const matchFecha =
        !historialBusquedaFecha.value || item.fechaHora.startsWith(historialBusquedaFecha.value)
      const busqueda = historialBusquedaEnfermedad.value.toLowerCase()
      const matchTexto =
        !busqueda ||
        item.enfermedadNombre.toLowerCase().includes(busqueda) ||
        (item.motivo && item.motivo.toLowerCase().includes(busqueda))
      return matchFecha && matchTexto
    })
  })

  const totalPagesHistorial = computed(() =>
    Math.max(1, Math.ceil(historialFiltrado.value.length / HISTORIAL_ITEMS_PER_PAGE)),
  )

  const paginatedHistorial = computed(() => {
    const start = (currentPageHistorial.value - 1) * HISTORIAL_ITEMS_PER_PAGE
    const end = start + HISTORIAL_ITEMS_PER_PAGE
    return historialFiltrado.value.slice(start, end)
  })

  // --- Métodos de Carga (sin cambios) ---
  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const cargarDatosIniciales = async () => {
    console.log('Iniciando carga de datos iniciales...')
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.warn('No hay token, redirigiendo a login.')
        logout()
        return
      }

      let decodedToken: DecodedToken | null = null
      try {
        decodedToken = jwtDecode<DecodedToken>(token)
        console.log('Token decodificado:', decodedToken)
        medico.value.empleadoId = Number(decodedToken.sub)
        if (isNaN(medico.value.empleadoId)) {
          console.error('ID de empleado inválido en el token:', decodedToken.sub)
          logout()
          return
        }
      } catch (e) {
        console.error('Error decodificando el token:', e)
        logout()
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }
      console.log('Realizando llamadas API...')

      const [resMedicos, resConsultas, resPacientes, resMedicamentos, resDiagnosticos] =
        await Promise.all([
          apiClient.get<MedicoInfo[]>('/Medicos', config),
          apiClient.get<ConsultaApiResponseItem[]>('/ConsultasMedicas', config),
          apiClient.get<Paciente[]>('/Pacientes', config),
          apiClient.get<Medicamento[]>('/Medicamentos', config),
          apiClient.get<Diagnostico[]>('/Diagnosticos', config),
        ])

      console.log('Llamadas API completadas.')

      const infoMedico = resMedicos.data.find(
        (m: MedicoInfo) => m.empleadoId === medico.value.empleadoId,
      )
      console.log('Info Médico encontrada:', infoMedico)

      if (infoMedico) {
        medicoInfo.value = infoMedico
        medico.value.nombreCompleto = infoMedico.nombreCompleto
      } else {
        console.warn(
          `No se encontró información de médico para el empleado ID: ${medico.value.empleadoId}`,
        )
      }

      const pacientesMap = new Map(resPacientes.data.map((p: Paciente) => [p.id, p.cedula]))
      consultas.value = resConsultas.data.map(
        (c: ConsultaApiResponseItem): Consulta => ({
          id: c.id,
          fechaHora: c.fechaHora,
          pacienteId: c.pacienteId,
          nombrePaciente: c.nombrePaciente || 'Paciente Desconocido',
          cedulaPaciente: pacientesMap.get(c.pacienteId) || '',
          medicoId: c.medicoId,
          nombreMedico: c.nombreMedico || 'Médico Desconocido',
          motivo: c.motivo || 'Sin motivo especificado',
        }),
      )

      pacientes.value = resPacientes.data
      medicamentos.value = resMedicamentos.data
      diagnosticos.value = resDiagnosticos.data

      console.log('Datos iniciales cargados:', {
        medicoInfo: medicoInfo.value,
        consultas: consultas.value.length,
        pacientes: pacientes.value.length,
        medicamentos: medicamentos.value.length,
        diagnosticos: diagnosticos.value.length,
      })
    } catch (error) {
      console.error('Error detallado cargando datos:', error)
      if (isAxiosError(error)) {
        console.error('Detalles AxiosError:', {
          message: error.message,
          config: error.config ? '[object]' : 'null',
          code: error.code,
          request: error.request ? 'Presente' : 'Ausente',
          response: error.response
            ? { status: error.response.status, data: error.response.data }
            : 'Ausente',
        })
        if (error.response?.status === 401) {
          console.warn('Error 401, redirigiendo a login.')
          logout()
        } else {
          let errorMsg = 'Error al cargar datos.'
          if (typeof error.response?.data === 'string' && error.response.data.length < 100) {
            errorMsg += ` Detalle: ${error.response.data}`
          } else if (error.message) {
            errorMsg += ` Detalle: ${error.message}`
          }
          alert(`${errorMsg}. Intente recargar la página.`)
        }
      } else {
        alert('Ocurrió un error inesperado al cargar los datos. Intente recargar la página.')
      }
    }
  }

  const cargarHistorialPaciente = async (pacienteId: number) => {
    historialPaciente.value = { consultas: [], diagnosticos: [], prescripciones: [] }
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await apiClient.get<{
        consultas: Consulta[]
        diagnosticos: Diagnostico[]
        prescripciones: PrescripcionGuardada[]
      }>(`/Pacientes/${pacienteId}/historial`, config)

      historialPaciente.value.consultas = response.data.consultas ?? []
      historialPaciente.value.diagnosticos = response.data.diagnosticos ?? []
      historialPaciente.value.prescripciones = response.data.prescripciones ?? []
    } catch (error) {
      console.error('Error al cargar historial del paciente:', error)
      alert('No se pudo cargar el historial del paciente.')
    }
  }

  // --- Return ---
  return {
    medico,
    medicoInfo,
    consultas,
    pacientes,
    medicamentos,
    diagnosticos,
    historialPaciente,
    busquedaConsultaCedula,
    busquedaConsultaFecha,
    currentPageConsultas,
    busquedaPacienteCedula,
    currentPagePacientes,
    busquedaMedicamento,
    currentPageMedicamentos,
    historialBusquedaFecha,
    historialBusquedaEnfermedad,
    currentPageHistorial,
    currentPageConsultasPerfil,
    consultasFiltradas,
    totalPagesConsultas,
    paginatedConsultas,
    pacientesFiltrados,
    totalPagesPacientes,
    paginatedPacientes,
    medicamentosFiltrados,
    totalPagesMedicamentos,
    paginatedMedicamentos,
    consultasRealizadasPorMedico,
    totalPagesConsultasPerfil,
    paginatedConsultasPerfil,
    historialCombinado,
    historialFiltrado,
    totalPagesHistorial,
    paginatedHistorial,
    cargarDatosIniciales,
    cargarHistorialPaciente,
    logout,
  }
}
