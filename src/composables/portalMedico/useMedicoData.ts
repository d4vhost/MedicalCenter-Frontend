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

export function useMedicoData() {
  const router = useRouter()
  const medico = ref<Medico>({ empleadoId: 0, nombreCompleto: 'CARGANDO...' })
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

  // --- AJUSTAR ESTAS CONSTANTES PARA COINCIDIR CON ADMIN ---
  const ITEMS_PER_PAGE_DEFAULT = 9 // Coincide con admin
  const HISTORIAL_ITEMS_PER_PAGE = 3 // Mantener o ajustar según necesidad
  const CONSULTAS_PERFIL_PER_PAGE = 4 // Mantener o ajustar según necesidad
  // --- FIN AJUSTES ---

  const consultasFiltradas = computed(() => {
    return consultas.value
      .filter((consulta) => {
        // La búsqueda de cédula ya no necesita toUpperCase() aquí si el input lo fuerza
        const matchCedula =
          !busquedaConsultaCedula.value ||
          consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
        const matchFecha =
          !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)
        const esDeEsteMedico = consulta.medicoId === medicoInfo.value.id
        return matchCedula && matchFecha && esDeEsteMedico
      })
      .sort((a, b) => {
        // Ordenar: Pendientes primero, luego por fecha descendente
        if (a.tieneDiagnostico !== b.tieneDiagnostico) {
          return a.tieneDiagnostico ? 1 : -1 // false (pendiente) viene antes
        }
        return new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime() // Más reciente primero
      })
  })

  const totalPagesConsultas = computed(
    () => Math.max(1, Math.ceil(consultasFiltradas.value.length / ITEMS_PER_PAGE_DEFAULT)), // Usar constante
  )

  const paginatedConsultas = computed(() => {
    const start = (currentPageConsultas.value - 1) * ITEMS_PER_PAGE_DEFAULT // Usar constante
    const end = start + ITEMS_PER_PAGE_DEFAULT // Usar constante
    return consultasFiltradas.value.slice(start, end)
  })

  const pacientesFiltrados = computed(() => {
    // La búsqueda ya no necesita toUpperCase() aquí si el input lo fuerza
    return pacientes.value.filter(
      (paciente) =>
        !busquedaPacienteCedula.value || paciente.cedula.includes(busquedaPacienteCedula.value),
    )
  })
  const totalPagesPacientes = computed(
    () => Math.max(1, Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)), // Usar constante
  )
  const paginatedPacientes = computed(() => {
    const start = (currentPagePacientes.value - 1) * ITEMS_PER_PAGE_DEFAULT // Usar constante
    const end = start + ITEMS_PER_PAGE_DEFAULT // Usar constante
    return pacientesFiltrados.value.slice(start, end)
  })

  const medicamentosFiltrados = computed(() => {
    const busqueda = busquedaMedicamento.value // Ya está en mayúsculas desde el input
    return medicamentos.value.filter(
      (med) =>
        !busqueda ||
        med.nombreGenerico.toUpperCase().includes(busqueda) || // Mantenemos toUpperCase para comparación
        med.nombreComercial?.toUpperCase().includes(busqueda) ||
        med.laboratorio?.toUpperCase().includes(busqueda),
    )
  })
  const totalPagesMedicamentos = computed(
    () => Math.max(1, Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)), // Usar constante
  )
  const paginatedMedicamentos = computed(() => {
    const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE_DEFAULT // Usar constante
    const end = start + ITEMS_PER_PAGE_DEFAULT // Usar constante
    return medicamentosFiltrados.value.slice(start, end)
  })

  // --- Lógica de historial y perfil sin cambios relevantes para este request ---
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
      .map((c) => ({ ...c, pendiente: false })) // Asumiendo que estas ya no están pendientes
  })

  const historialCombinado = computed((): HistorialItem[] => {
    const consultasMap = new Map((historialPaciente.value.consultas ?? []).map((c) => [c.id, c]))
    // Asegurar que solo se mapeen diagnósticos válidos
    const diagnosticosValidos = historialPaciente.value.diagnosticos ?? []
    return diagnosticosValidos
      .map((diagnostico) => {
        const consulta = consultasMap.get(diagnostico.consultaId)
        // Obtener prescripciones asociadas
        const prescripcionesAsociadas = (historialPaciente.value.prescripciones ?? []).filter(
          (p) => p.diagnosticoId === diagnostico.id,
        )
        return {
          ...diagnostico,
          fechaHora: consulta?.fechaHora || '',
          motivo: consulta?.motivo || 'N/A',
          prescripciones: prescripcionesAsociadas, // Añadir prescripciones al item
        }
      })
      .sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()) // Ordenar por fecha descendente
  })

  const historialFiltrado = computed(() => {
    return historialCombinado.value.filter((item) => {
      const matchFecha =
        !historialBusquedaFecha.value || item.fechaHora.startsWith(historialBusquedaFecha.value)
      const busqueda = historialBusquedaEnfermedad.value // Ya viene en mayúsculas
      const matchTexto =
        !busqueda ||
        item.enfermedadNombre.toUpperCase().includes(busqueda) || // Comparar en mayúsculas
        (item.motivo && item.motivo.toUpperCase().includes(busqueda)) // Comparar en mayúsculas
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

  // --- cargarDatosIniciales sin cambios relevantes ---
  const cargarDatosIniciales = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        logout()
        return
      }

      let decodedToken: DecodedToken | null = null
      try {
        decodedToken = jwtDecode<DecodedToken>(token)
        medico.value.empleadoId = Number(decodedToken.sub)
        if (isNaN(medico.value.empleadoId)) {
          logout()
          return
        }
      } catch {
        logout()
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [resMedicos, resConsultas, resPacientes, resMedicamentos, resDiagnosticos] =
        await Promise.all([
          apiClient.get<MedicoInfo[]>('/Medicos', config),
          apiClient.get<ConsultaApiResponseItem[]>('/ConsultasMedicas', config),
          apiClient.get<Paciente[]>('/Pacientes', config),
          apiClient.get<Medicamento[]>('/Medicamentos', config),
          apiClient.get<DiagnosticoApiResponse[]>('/Diagnosticos', config),
        ])

      const infoMedico = resMedicos.data.find(
        (m: MedicoInfo) => m.empleadoId === medico.value.empleadoId,
      )

      if (infoMedico) {
        medicoInfo.value = infoMedico
        medico.value.nombreCompleto = infoMedico.nombreCompleto
      }

      diagnosticos.value = resDiagnosticos.data
      const diagnosticosMap = new Map(diagnosticos.value.map((d) => [d.consultaId, d]))
      const pacientesMap = new Map(resPacientes.data.map((p: Paciente) => [p.id, p])) // Guardar objeto Paciente

      consultas.value = resConsultas.data.map((c: ConsultaApiResponseItem): Consulta => {
        const diagnosticoExistente = diagnosticosMap.get(c.id)
        const pacienteData = pacientesMap.get(c.pacienteId)
        return {
          id: c.id,
          fechaHora: c.fechaHora,
          pacienteId: c.pacienteId,
          // Usar nombre completo del paciente o 'PACIENTE DESCONOCIDO'
          nombrePaciente: pacienteData
            ? `${pacienteData.nombre} ${pacienteData.apellido}`
            : 'PACIENTE DESCONOCIDO',
          cedulaPaciente: pacienteData?.cedula || '', // Añadir cédula
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
      if (isAxiosError(error) && error.response?.status === 401) {
        logout()
      } else {
        alert('ERROR AL CARGAR DATOS INICIALES. INTENTE RECARGAR LA PÁGINA.')
      }
    }
  }

  // --- cargarHistorialPaciente sin cambios ---
  const cargarHistorialPaciente = async (pacienteId: number) => {
    historialPaciente.value = { consultas: [], diagnosticos: [], prescripciones: [] } // Inicializar prescripciones
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await apiClient.get<{
        consultas: Consulta[]
        diagnosticos: Diagnostico[]
        prescripciones?: PrescripcionGuardada[] // Hacer prescripciones opcional por si acaso
      }>(`/Pacientes/${pacienteId}/historial`, config)

      historialPaciente.value.consultas = response.data.consultas ?? []
      historialPaciente.value.diagnosticos = response.data.diagnosticos ?? []
      historialPaciente.value.prescripciones = response.data.prescripciones ?? [] // Asignar prescripciones
    } catch {
      alert('NO SE PUDO CARGAR EL HISTORIAL DEL PACIENTE.')
    }
  }

  // --- cargarPrescripciones sin cambios ---
  const cargarPrescripciones = async (diagnosticoId: number): Promise<PrescripcionGuardada[]> => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await apiClient.get<PrescripcionGuardada[]>(`/Prescripciones`, {
        ...config,
        params: { diagnosticoId },
      })
      // Asegurarse de que las prescripciones cargadas estén en mayúsculas
      return response.data.map((p) => ({
        ...p,
        nombreMedicamento: p.nombreMedicamento.toUpperCase(),
        indicaciones: p.indicaciones.toUpperCase(),
      }))
    } catch {
      console.error(`Error al cargar prescripciones para diagnóstico ID: ${diagnosticoId}`)
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
    ITEMS_PER_PAGE_DEFAULT, // Exportar la constante
  }
}
