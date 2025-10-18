// src/composables/portalMedico/useMedicoData.ts
import { ref, computed, type Ref } from 'vue'
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
} from '@/types/medicoPortal'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router' // Importa useRouter

export function useMedicoData() {
  const router = useRouter() // Obtén la instancia del router
  const medico = ref<Medico>({ empleadoId: 0, nombreCompleto: 'Cargando...' })
  const medicoInfo = ref<Partial<MedicoInfo>>({})
  const consultas = ref<Consulta[]>([])
  const pacientes = ref<Paciente[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const diagnosticos = ref<Diagnostico[]>([])
  const historialPaciente = ref<HistorialPacienteData>({
    consultas: [],
    diagnosticos: [],
    prescripciones: [],
  }) // Incluye prescripciones

  // --- Filtros y Paginación Refs (movidos a useMedicoUI, pero los computed dependen de los datos) ---
  // Se pasarán como argumentos o se importarán desde useMedicoUI
  const busquedaConsultaCedula = ref('')
  const busquedaConsultaFecha = ref('')
  const mostrarSoloPendientes = ref(false)
  const currentPageConsultas = ref(1)
  const busquedaPacienteCedula = ref('')
  const currentPagePacientes = ref(1)
  const busquedaMedicamento = ref('')
  const currentPageMedicamentos = ref(1)
  const historialBusquedaFecha = ref('')
  const historialBusquedaEnfermedad = ref('')
  const currentPageHistorial = ref(1)
  const upcomingAppointmentsPage = ref(1)

  const ITEMS_PER_PAGE = 5
  const HISTORIAL_ITEMS_PER_PAGE = 3
  const CITAS_PER_PAGE = 4

  // --- Computed Properties ---
  const consultasFiltradas = computed(() => {
    const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
    return consultas.value.filter((consulta) => {
      const matchCedula =
        !busquedaConsultaCedula.value ||
        consulta.cedulaPaciente?.includes(busquedaConsultaCedula.value)
      const matchFecha =
        !busquedaConsultaFecha.value || consulta.fechaHora.startsWith(busquedaConsultaFecha.value)
      if (mostrarSoloPendientes.value) {
        return (
          matchCedula &&
          matchFecha &&
          !diagnosticosConsultaIds.has(consulta.id) &&
          consulta.medicoId === medicoInfo.value.id
        ) // Filtra por médico actual también
      }
      return matchCedula && matchFecha && consulta.medicoId === medicoInfo.value.id // Filtra por médico actual
    })
  })
  const totalPagesConsultas = computed(() =>
    Math.max(1, Math.ceil(consultasFiltradas.value.length / ITEMS_PER_PAGE)),
  )
  const paginatedConsultas = computed(() => {
    const start = (currentPageConsultas.value - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return consultasFiltradas.value.slice(start, end)
  })

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

  const consultasPendientes = computed(() => {
    const diagnosticosConsultaIds = new Set(diagnosticos.value.map((d) => d.consultaId))
    return consultas.value
      .filter((c) => !diagnosticosConsultaIds.has(c.id) && c.medicoId === medicoInfo.value.id) // Asegura filtrar por médico actual
      .sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime())
  })

  const totalCitasPages = computed(() =>
    Math.max(1, Math.ceil(consultasPendientes.value.length / CITAS_PER_PAGE)),
  )

  const paginatedUpcomingAppointments = computed(() => {
    const start = (upcomingAppointmentsPage.value - 1) * CITAS_PER_PAGE
    const end = start + CITAS_PER_PAGE
    return consultasPendientes.value.slice(start, end)
  })

  const historialCombinado = computed((): HistorialItem[] => {
    // Asegura que historialPaciente.value.consultas exista y sea un array
    const consultasMap = new Map((historialPaciente.value.consultas ?? []).map((c) => [c.id, c]))
    // Asegura que historialPaciente.value.diagnosticos exista y sea un array
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

  // --- Métodos de Carga ---
  const logout = () => {
    // Define logout aquí para usarlo en cargarDatosIniciales
    localStorage.clear()
    router.push('/login')
  }

  const cargarDatosIniciales = async () => {
    console.log('Iniciando carga de datos iniciales...') // Log inicio
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.warn('No hay token, redirigiendo a login.') // Log no token
        logout()
        return
      }

      let decodedToken: DecodedToken | null = null
      try {
        decodedToken = jwtDecode<DecodedToken>(token)
        console.log('Token decodificado:', decodedToken) // Log token decodificado
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
      console.log('Realizando llamadas API...') // Log llamadas API

      const [resMedicos, resConsultas, resPacientes, resMedicamentos, resDiagnosticos] =
        await Promise.all([
          apiClient.get('/Medicos', config),
          apiClient.get('/ConsultasMedicas', config),
          apiClient.get('/Pacientes', config),
          apiClient.get('/Medicamentos', config),
          apiClient.get('/Diagnosticos', config),
        ])

      console.log('Llamadas API completadas.') // Log llamadas completadas

      const infoMedico = resMedicos.data.find(
        (m: MedicoInfo) => m.empleadoId === medico.value.empleadoId,
      )
      console.log('Info Médico encontrada:', infoMedico) // Log info médico

      if (infoMedico) {
        medicoInfo.value = infoMedico
        medico.value.nombreCompleto = infoMedico.nombreCompleto
        // Asignación de nombre y apellido se mueve a useMedicoModals
      } else {
        console.warn(
          `No se encontró información de médico para el empleado ID: ${medico.value.empleadoId}`,
        )
        // Considera qué hacer aquí. ¿Mostrar un error? ¿Redirigir?
        // Por ahora, solo se loguea.
      }

      const pacientesMap = new Map(resPacientes.data.map((p: Paciente) => [p.id, p.cedula]))
      consultas.value = resConsultas.data.map(
        (c: any) =>
          ({
            // Usa 'any' temporalmente si la estructura no coincide exactamente
            id: c.id,
            fechaHora: c.fechaHora,
            pacienteId: c.pacienteId,
            nombrePaciente: c.nombrePaciente || 'Paciente Desconocido', // Valor por defecto
            cedulaPaciente: pacientesMap.get(c.pacienteId) || '',
            medicoId: c.medicoId,
            nombreMedico: c.nombreMedico || 'Médico Desconocido', // Valor por defecto
            motivo: c.motivo || 'Sin motivo especificado', // Valor por defecto
          }) as Consulta,
      ) // Asegúrate de que coincida con la interfaz Consulta

      pacientes.value = resPacientes.data
      medicamentos.value = resMedicamentos.data
      diagnosticos.value = resDiagnosticos.data

      console.log('Datos iniciales cargados:', {
        medicoInfo: medicoInfo.value,
        consultas: consultas.value.length,
        pacientes: pacientes.value.length,
        medicamentos: medicamentos.value.length,
        diagnosticos: diagnosticos.value.length,
      }) // Log datos cargados
    } catch (error) {
      console.error('Error detallado cargando datos:', error) // Log error detallado
      if (isAxiosError(error)) {
        console.error('Detalles AxiosError:', {
          message: error.message,
          config: error.config,
          code: error.code,
          request: error.request ? 'Presente' : 'Ausente',
          response: error.response
            ? { status: error.response.status, data: error.response.data }
            : 'Ausente',
        })
        if (error.response?.status === 401) {
          console.warn('Error 401, redirigiendo a login.') // Log error 401
          logout()
        } else {
          alert(
            `Error al cargar datos: ${error.response?.data || error.message}. Intente recargar la página.`,
          )
        }
      } else {
        alert('Ocurrió un error inesperado al cargar los datos. Intente recargar la página.')
      }
    }
  }

  const cargarHistorialPaciente = async (pacienteId: number) => {
    historialPaciente.value = { consultas: [], diagnosticos: [], prescripciones: [] } // Reset
    try {
      const token = localStorage.getItem('authToken')
      if (!token) return
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await apiClient.get(`/Pacientes/${pacienteId}/historial`, config)
      // Asigna los datos asegurándote que sean arrays
      historialPaciente.value.consultas = response.data.consultas ?? []
      historialPaciente.value.diagnosticos = response.data.diagnosticos ?? []
      historialPaciente.value.prescripciones = response.data.prescripciones ?? [] // Carga prescripciones
    } catch (error) {
      console.error('Error al cargar historial del paciente:', error)
    }
  }

  return {
    // State refs
    medico,
    medicoInfo,
    consultas,
    pacientes,
    medicamentos,
    diagnosticos,
    historialPaciente,

    // Filtros y Paginación (Referencias expuestas para que useMedicoUI las modifique)
    busquedaConsultaCedula,
    busquedaConsultaFecha,
    mostrarSoloPendientes,
    currentPageConsultas,
    busquedaPacienteCedula,
    currentPagePacientes,
    busquedaMedicamento,
    currentPageMedicamentos,
    historialBusquedaFecha,
    historialBusquedaEnfermedad,
    currentPageHistorial,
    upcomingAppointmentsPage,

    // Computed properties
    consultasFiltradas,
    totalPagesConsultas,
    paginatedConsultas,
    pacientesFiltrados,
    totalPagesPacientes,
    paginatedPacientes,
    medicamentosFiltrados,
    totalPagesMedicamentos,
    paginatedMedicamentos,
    consultasPendientes,
    totalCitasPages,
    paginatedUpcomingAppointments,
    historialCombinado,
    historialFiltrado,
    totalPagesHistorial,
    paginatedHistorial,

    // Methods
    cargarDatosIniciales,
    cargarHistorialPaciente,
    logout, // Expone logout si useMedicoActions u otros lo necesitan
  }
}
