// Archivo: src/composables/portalMedico/useMedicoData.ts

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

interface DiagnosticoApiResponse {
  id: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
}

interface EmpleadoResponse {
  cedula: string
  nombre: string
  apellido: string
}

interface EspecialidadResponse {
  nombre: string
}

interface MedicoApiResponse {
  id: number
  empleadoId: number
  especialidadId: number
  empleado: EmpleadoResponse
  especialidad?: EspecialidadResponse
}

export function useMedicoData() {
  const router = useRouter()

  // Inicializamos correctamente
  const medico = ref<Medico>({
    id: 0,
    empleadoId: 0,
    nombreCompleto: 'CARGANDO...',
    especialidadId: 0,
  })

  const medicoInfo = ref<Partial<MedicoInfo>>({})
  const consultas = ref<Consulta[]>([])
  const pacientes = ref<Paciente[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const diagnosticos = ref<DiagnosticoApiResponse[]>([])
  const historialPaciente = ref<HistorialPacienteData>({
    consultas: [],
    diagnosticos: [],
    prescripciones: [],
  })

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

  const ITEMS_PER_PAGE_DEFAULT = 9
  const HISTORIAL_ITEMS_PER_PAGE = 3
  const CONSULTAS_PERFIL_PER_PAGE = 4

  // --- COMPUTED PROPERTIES ---
  const consultasFiltradas = computed(() => {
    return consultas.value
      .filter((consulta) => {
        const matchCedula =
          !busquedaConsultaCedula.value ||
          consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
        const matchFecha =
          !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)
        const esDeEsteMedico = consulta.medicoId === medicoInfo.value.id
        return matchCedula && matchFecha && esDeEsteMedico
      })
      .sort((a, b) => {
        if (a.tieneDiagnostico !== b.tieneDiagnostico) {
          return a.tieneDiagnostico ? 1 : -1
        }
        return new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
      })
  })

  const totalPagesConsultas = computed(() =>
    Math.max(1, Math.ceil(consultasFiltradas.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )

  const paginatedConsultas = computed(() => {
    const start = (currentPageConsultas.value - 1) * ITEMS_PER_PAGE_DEFAULT
    const end = start + ITEMS_PER_PAGE_DEFAULT
    return consultasFiltradas.value.slice(start, end)
  })

  const pacientesFiltrados = computed(() => {
    return pacientes.value.filter(
      (paciente) =>
        !busquedaPacienteCedula.value || paciente.cedula.includes(busquedaPacienteCedula.value),
    )
  })
  const totalPagesPacientes = computed(() =>
    Math.max(1, Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedPacientes = computed(() => {
    const start = (currentPagePacientes.value - 1) * ITEMS_PER_PAGE_DEFAULT
    const end = start + ITEMS_PER_PAGE_DEFAULT
    return pacientesFiltrados.value.slice(start, end)
  })

  const medicamentosFiltrados = computed(() => {
    const busqueda = busquedaMedicamento.value
    return medicamentos.value.filter(
      (med) =>
        !busqueda ||
        med.nombreGenerico.toUpperCase().includes(busqueda) ||
        med.nombreComercial?.toUpperCase().includes(busqueda) ||
        med.laboratorio?.toUpperCase().includes(busqueda),
    )
  })
  const totalPagesMedicamentos = computed(() =>
    Math.max(1, Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedMedicamentos = computed(() => {
    const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE_DEFAULT
    const end = start + ITEMS_PER_PAGE_DEFAULT
    return medicamentosFiltrados.value.slice(start, end)
  })

  const consultasRealizadasPorMedico = computed(() => {
    const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
    return consultas.value
      .filter((c) => c.medicoId === medicoInfo.value.id && diagnosticosConsultaIds.has(c.id))
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
  })

  const totalPagesConsultasPerfil = computed(() =>
    Math.max(1, Math.ceil(consultasRealizadasPorMedico.value.length / CONSULTAS_PERFIL_PER_PAGE)),
  )

  const paginatedConsultasPerfil = computed(() => {
    const start = (currentPageConsultasPerfil.value - 1) * CONSULTAS_PERFIL_PER_PAGE
    const end = start + CONSULTAS_PERFIL_PER_PAGE
    return consultasRealizadasPorMedico.value
      .slice(start, end)
      .map((c) => ({ ...c, pendiente: false }))
  })

  const historialCombinado = computed((): HistorialItem[] => {
    const consultasMap = new Map((historialPaciente.value.consultas ?? []).map((c) => [c.id, c]))
    const diagnosticosValidos = historialPaciente.value.diagnosticos ?? []
    return diagnosticosValidos
      .map((diagnostico) => {
        const consulta = consultasMap.get(diagnostico.consultaId)
        const prescripcionesAsociadas = (historialPaciente.value.prescripciones ?? []).filter(
          (p) => p.diagnosticoId === diagnostico.id,
        )
        return {
          ...diagnostico,
          fechaHora: consulta?.fechaHora || '',
          motivo: consulta?.motivo || 'N/A',
          prescripciones: prescripcionesAsociadas,
        }
      })
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime())
  })

  const historialFiltrado = computed(() => {
    return historialCombinado.value.filter((item) => {
      const matchFecha =
        !historialBusquedaFecha.value || item.fechaHora.startsWith(historialBusquedaFecha.value)
      const busqueda = historialBusquedaEnfermedad.value
      const matchTexto =
        !busqueda ||
        item.enfermedadNombre.toUpperCase().includes(busqueda) ||
        (item.motivo && item.motivo.toUpperCase().includes(busqueda))
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

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  // --- CARGAR DATOS INICIALES (CON LA CORRECCIÓN DEL TOKEN) ---
  const cargarDatosIniciales = async () => {
    console.log('[useMedicoData] Iniciando cargarDatosIniciales...')

    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        logout()
        return
      }

      let decodedToken: DecodedToken | null = null
      try {
        decodedToken = jwtDecode<DecodedToken>(token)

        // 👇👇👇 CORRECCIÓN CRÍTICA AQUÍ 👇👇👇
        // Buscamos el ID en la propiedad estándar (nameid) O en la propiedad larga de .NET
        const nameIdentifierClaim =
          decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
        const idString = nameIdentifierClaim || decodedToken.nameid

        medico.value.empleadoId = Number(idString)

        console.log(`[useMedicoData] ID descifrado: ${medico.value.empleadoId}`)

        if (isNaN(medico.value.empleadoId)) {
          console.error('El ID del empleado es NaN. Revise el formato del Token.')
          logout()
          return
        }
      } catch (e) {
        console.error('Error al decodificar token', e)
        logout()
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }

      // FETCH PARALELO
      const [resMedicos, resConsultas, resPacientes, resMedicamentos, resDiagnosticos] =
        await Promise.all([
          apiClient.get<MedicoApiResponse[]>('/Medicos', config),
          apiClient.get<ConsultaApiResponseItem[]>('/ConsultasMedicas', config),
          apiClient.get<Paciente[]>('/Pacientes', config),
          apiClient.get<Medicamento[]>('/Medicamentos', config),
          apiClient.get<DiagnosticoApiResponse[]>('/Diagnosticos', config),
        ])

      // INTENTAR OBTENER NOMBRE DEL CENTRO
      let nombreCentro = ''
      try {
        if (decodedToken.centro_medico_id) {
          const resCentro = await apiClient.get<{ nombre: string }>(
            `/CentrosMedicos/${decodedToken.centro_medico_id}`,
            config,
          )
          nombreCentro = resCentro.data.nombre
        }
      } catch (error) {
        console.warn('No se pudo obtener info del centro médico', error)
      }

      const infoMedicoResponse = resMedicos.data.find(
        (m) => m.empleadoId === medico.value.empleadoId,
      )

      if (infoMedicoResponse && infoMedicoResponse.empleado) {
        const nombreCompleto =
          `${infoMedicoResponse.empleado.nombre} ${infoMedicoResponse.empleado.apellido}`.trim()

        medico.value.nombreCompleto = nombreCompleto

        medicoInfo.value = {
          id: infoMedicoResponse.id,
          empleadoId: infoMedicoResponse.empleadoId,
          nombreCompleto: nombreCompleto,
          especialidad: infoMedicoResponse.especialidad?.nombre || 'N/A',
          cedula: infoMedicoResponse.empleado.cedula,
          nombre: infoMedicoResponse.empleado.nombre,
          apellido: infoMedicoResponse.empleado.apellido,
          especialidadId: infoMedicoResponse.especialidadId,
          nombreCentroMedico: nombreCentro,
        }
      }

      diagnosticos.value = resDiagnosticos.data
      const diagnosticosMap = new Map(diagnosticos.value.map((d) => [d.consultaId, d]))
      const pacientesMap = new Map(resPacientes.data.map((p: Paciente) => [p.id, p]))

      consultas.value = resConsultas.data.map((c: ConsultaApiResponseItem): Consulta => {
        const diagnosticoExistente = diagnosticosMap.get(c.id)
        const pacienteData = pacientesMap.get(c.pacienteId)
        return {
          id: c.id,
          fechaHora: c.fechaHora,
          pacienteId: c.pacienteId,
          nombrePaciente: pacienteData
            ? `${pacienteData.nombre} ${pacienteData.apellido}`
            : 'PACIENTE DESCONOCIDO',
          cedulaPaciente: pacienteData?.cedula || '',
          medicoId: c.medicoId,
          nombreMedico: c.nombreMedico || 'MÉDICO DESCONOCIDO',
          motivo: c.motivo || 'SIN MOTIVO ESPECIFICADO',
          tieneDiagnostico: !!diagnosticoExistente,
          diagnosticoId: diagnosticoExistente?.id,
        }
      })

      pacientes.value = resPacientes.data
      medicamentos.value = resMedicamentos.data
    } catch (error) {
      console.error(error)
      if (isAxiosError(error) && error.response?.status === 401) {
        logout()
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
        prescripciones?: PrescripcionGuardada[]
      }>(`/Pacientes/${pacienteId}/historial`, config)

      historialPaciente.value.consultas = response.data.consultas ?? []
      historialPaciente.value.diagnosticos = response.data.diagnosticos ?? []
      historialPaciente.value.prescripciones = response.data.prescripciones ?? []
    } catch {
      alert('NO SE PUDO CARGAR EL HISTORIAL DEL PACIENTE.')
    }
  }

  const cargarPrescripciones = async (diagnosticoId: number): Promise<PrescripcionGuardada[]> => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const response = await apiClient.get<PrescripcionGuardada[]>(
        `/Prescripciones/PorDiagnostico/${diagnosticoId}`,
        config,
      )

      return response.data.map((p) => ({
        ...p,
        nombreMedicamento: p.nombreMedicamento ? p.nombreMedicamento.toUpperCase() : 'DESCONOCIDO',
        indicaciones: p.indicaciones.toUpperCase(),
      }))
    } catch (error) {
      console.error(error)
      return []
    }
  }

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
    cargarPrescripciones,
    logout,
    ITEMS_PER_PAGE_DEFAULT,
  }
}
