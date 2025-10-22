import { ref, computed } from 'vue'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type {
  Empleado,
  Medico,
  Paciente,
  CentroMedico,
  Especialidad,
  Medicamento,
  Consulta,
  Diagnostico,
  DecodedToken,
  AdminInfo,
  MedicoDetallado,
  PacienteConEstado,
} from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = 8
const ITEMS_PER_PAGE_STATIC = 5

export function useAdminData() {
  const router = useRouter()
  const empleados = ref<Empleado[]>([])
  const medicos = ref<Medico[]>([])
  const pacientes = ref<Paciente[]>([])
  const centrosMedicos = ref<CentroMedico[]>([])
  const especialidades = ref<Especialidad[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const consultas = ref<Consulta[]>([])
  const diagnosticos = ref<Diagnostico[]>([])
  const adminInfo = ref<Partial<AdminInfo>>({})
  const adminEmpleadoId = ref<number>(0)

  const currentPageMedicos = ref(1)
  const currentPageCentros = ref(1)
  const currentPageEspecialidades = ref(1)
  const currentPageMedicamentos = ref(1)

  const busquedaEmpleado = ref('')
  const busquedaCentro = ref('')
  const busquedaEspecialidad = ref('')
  const busquedaMedicamento = ref('')
  const busquedaDiagnosticados = ref('')
  const busquedaNoDiagnosticados = ref('')

  const totalMedicos = computed(() => medicos.value.length)
  const totalPacientes = computed(() => pacientes.value.length)
  const totalCentros = computed(() => centrosMedicos.value.length)
  const totalEspecialidades = computed(() => especialidades.value.length)

  const diagnosedPatientIds = computed(() => {
    const patientIds = new Set<number>()
    const consultasConDiagnostico = new Set(diagnosticos.value.map((d) => d.consultaId))
    consultas.value.forEach((c) => {
      if (consultasConDiagnostico.has(c.id)) {
        patientIds.add(c.pacienteId)
      }
    })
    return patientIds
  })

  const totalPacientesDiagnosticados = computed(() => diagnosedPatientIds.value.size)

  const medicosDetallados = computed((): MedicoDetallado[] => {
    const empleadosMap = new Map(empleados.value.map((e) => [e.id, e]))
    const especialidadesMap = new Map(especialidades.value.map((e) => [e.id, e.nombre]))
    const centrosMap = new Map(centrosMedicos.value.map((c) => [c.id, c.nombre]))

    return medicos.value
      .map((medico) => {
        const empleado = empleadosMap.get(medico.empleadoId)
        if (!empleado) return null

        return {
          ...empleado,
          id: empleado.id,
          medicoId: medico.id,
          especialidadId: medico.especialidadId,
          especialidadNombre: especialidadesMap.get(medico.especialidadId) || 'N/A',
          nombreCentroMedico: centrosMap.get(empleado.centroMedicoId) || 'N/A',
        } as MedicoDetallado
      })
      .filter((m): m is MedicoDetallado => m !== null)
  })

  const medicosFiltrados = computed(() => {
    const busqueda = busquedaEmpleado.value.toLowerCase()
    if (!busqueda) return medicosDetallados.value
    return medicosDetallados.value.filter(
      (med) =>
        med.nombre.toLowerCase().includes(busqueda) ||
        med.apellido.toLowerCase().includes(busqueda) ||
        med.cedula.includes(busqueda) ||
        med.especialidadNombre.toLowerCase().includes(busqueda),
    )
  })

  const totalPagesMedicos = computed(() =>
    Math.max(1, Math.ceil(medicosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedMedicos = computed(() => {
    const start = (currentPageMedicos.value - 1) * ITEMS_PER_PAGE_DEFAULT
    return medicosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
  })

  const pacientesConEstado = computed((): PacienteConEstado[] => {
    const ids = diagnosedPatientIds.value
    return pacientes.value.map((p) => ({
      ...p,
      isDiagnosed: ids.has(p.id),
    }))
  })

  const pacientesDiagnosticados = computed(() =>
    pacientesConEstado.value.filter((p) => p.isDiagnosed),
  )
  const pacientesNoDiagnosticados = computed(() =>
    pacientesConEstado.value.filter((p) => !p.isDiagnosed),
  )

  const pacientesDiagnosticadosFiltrados = computed(() => {
    const busqueda = busquedaDiagnosticados.value
    if (!busqueda) return pacientesDiagnosticados.value
    return pacientesDiagnosticados.value.filter((p) => p.cedula.includes(busqueda))
  })

  const pacientesNoDiagnosticadosFiltrados = computed(() => {
    const busqueda = busquedaNoDiagnosticados.value
    if (!busqueda) return pacientesNoDiagnosticados.value
    return pacientesNoDiagnosticados.value.filter((p) => p.cedula.includes(busqueda))
  })

  const centrosFiltrados = computed(() => {
    const busqueda = busquedaCentro.value.toLowerCase()
    if (!busqueda) return centrosMedicos.value
    return centrosMedicos.value.filter((c) => c.nombre.toLowerCase().includes(busqueda))
  })
  const totalPagesCentros = computed(() =>
    Math.max(1, Math.ceil(centrosFiltrados.value.length / ITEMS_PER_PAGE_STATIC)),
  )
  const paginatedCentros = computed(() => {
    const start = (currentPageCentros.value - 1) * ITEMS_PER_PAGE_STATIC
    return centrosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_STATIC)
  })

  const especialidadesFiltradas = computed(() => {
    const busqueda = busquedaEspecialidad.value.toLowerCase()
    if (!busqueda) return especialidades.value
    return especialidades.value.filter((e) => e.nombre.toLowerCase().includes(busqueda))
  })
  const totalPagesEspecialidades = computed(() =>
    Math.max(1, Math.ceil(especialidadesFiltradas.value.length / ITEMS_PER_PAGE_STATIC)),
  )
  const paginatedEspecialidades = computed(() => {
    const start = (currentPageEspecialidades.value - 1) * ITEMS_PER_PAGE_STATIC
    return especialidadesFiltradas.value.slice(start, start + ITEMS_PER_PAGE_STATIC)
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
    Math.max(1, Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedMedicamentos = computed(() => {
    const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE_DEFAULT
    return medicamentosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
  })

  const getBaseChartOptions = (isDarkMode: boolean) => ({
    backgroundColor: 'transparent',
    textStyle: { fontFamily: 'inherit', color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
    tooltip: {
      trigger: 'item',
      backgroundColor: isDarkMode ? '#2c2c2e' : '#ffffff',
      borderColor: isDarkMode ? '#38383a' : '#e5e5e5',
      textStyle: { color: isDarkMode ? '#f5f5f7' : '#1d1d1f' },
    },
  })

  const consultasPorDiaOptions = (isDarkMode: boolean) =>
    computed(() => {
      const baseOptions = getBaseChartOptions(isDarkMode)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        return d.toISOString().split('T')[0]
      }).reverse()

      const data = last7Days.map(
        (day) =>
          consultas.value.filter(
            (c) => c.fechaHora && new Date(c.fechaHora).toISOString().split('T')[0] === day,
          ).length,
      )

      return {
        ...baseOptions,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: last7Days.map((d) =>
            new Date(d + 'T00:00:00').toLocaleDateString('es-EC', {
              day: '2-digit',
              month: 'short',
            }),
          ),
          axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        },
        series: [{ data, type: 'bar', color: '#0891b2' }],
      }
    })

  const medicosPorCentroOptions = (isDarkMode: boolean) =>
    computed(() => {
      const baseOptions = getBaseChartOptions(isDarkMode)
      const data = centrosMedicos.value.map((centro) => ({
        name: centro.nombre,
        value: empleados.value.filter((e) => e.rol === 'Medico' && e.centroMedicoId === centro.id)
          .length,
      }))
      return {
        ...baseOptions,
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: { color: baseOptions.textStyle.color },
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data,
            emphasis: {
              itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
            },
          },
        ],
      }
    })

  const pacientesDiagnosticadosOptions = (isDarkMode: boolean) =>
    computed(() => ({
      ...getBaseChartOptions(isDarkMode),
      tooltip: { trigger: 'item' },
      legend: {
        top: '5%',
        left: 'center',
        textStyle: { color: getBaseChartOptions(isDarkMode).textStyle.color },
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: totalPacientesDiagnosticados.value, name: 'Diagnosticados' },
            {
              value: totalPacientes.value - totalPacientesDiagnosticados.value,
              name: 'No Diagnosticados',
            },
          ],
        },
      ],
    }))

  const patientAgeDistributionOptions = (isDarkMode: boolean) =>
    computed(() => {
      const baseOptions = getBaseChartOptions(isDarkMode)
      const ageGroups = { '0-18': 0, '19-30': 0, '31-45': 0, '46+': 0 }
      const currentYear = new Date().getFullYear()
      pacientes.value.forEach((p) => {
        if (p.fechaNacimiento) {
          const birthYear = new Date(p.fechaNacimiento).getFullYear()
          const age = currentYear - birthYear
          if (age <= 18) ageGroups['0-18']++
          else if (age <= 30) ageGroups['19-30']++
          else if (age <= 45) ageGroups['31-45']++
          else ageGroups['46+']++
        }
      })
      return {
        ...baseOptions,
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: {
          type: 'category',
          data: Object.keys(ageGroups),
          axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: isDarkMode ? '#38383a' : '#e5e5e5' } },
        },
        series: [
          {
            data: Object.values(ageGroups),
            type: 'bar',
            colorBy: 'series',
            color: '#22d3ee',
          },
        ],
      }
    })

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        logout()
        return
      }
      const decodedToken = jwtDecode<DecodedToken>(token)
      adminEmpleadoId.value = Number(decodedToken.sub)
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [
        resEmpleados,
        resMedicos,
        resPacientes,
        resCentros,
        resEspecialidades,
        resMedicamentos,
        resConsultas,
        resDiagnosticos,
      ] = await Promise.all([
        apiClient.get<Empleado[]>('/Empleados', config),
        apiClient.get<Medico[]>('/Medicos', config),
        apiClient.get<Paciente[]>('/Pacientes', config),
        apiClient.get<CentroMedico[]>('/CentrosMedicos', config),
        apiClient.get<Especialidad[]>('/Especialidades', config),
        apiClient.get<Medicamento[]>('/Medicamentos', config),
        apiClient.get<Consulta[]>('/ConsultasMedicas', config),
        apiClient.get<Diagnostico[]>('/Diagnosticos', config),
      ])
      empleados.value = resEmpleados.data
      medicos.value = resMedicos.data
      pacientes.value = resPacientes.data
      centrosMedicos.value = resCentros.data
      especialidades.value = resEspecialidades.data
      medicamentos.value = resMedicamentos.data
      consultas.value = resConsultas.data
      diagnosticos.value = resDiagnosticos.data
      cargarAdminInfo()
    } catch (error) {
      console.error('Error cargando datos:', error)
      if (isAxiosError(error) && error.response?.status === 401) logout()
    }
  }

  const cargarAdminInfo = () => {
    const admin = empleados.value.find((e) => e.id === adminEmpleadoId.value)
    if (admin) {
      const centroMedico = centrosMedicos.value.find((c) => c.id === admin.centroMedicoId)
      adminInfo.value = {
        id: admin.id,
        nombreCompleto: `${admin.nombre} ${admin.apellido}`,
        rol: admin.rol,
        cedula: admin.cedula,
        nombreCentroMedico: centroMedico?.nombre || 'N/A',
        centroMedicoId: admin.centroMedicoId,
      }
    } else {
      console.warn('Admin empleado info not found for ID:', adminEmpleadoId.value)
      adminInfo.value = {}
    }
  }

  return {
    empleados,
    medicos,
    pacientes,
    centrosMedicos,
    especialidades,
    medicamentos,
    consultas,
    diagnosticos,
    adminInfo,
    adminEmpleadoId,
    currentPageMedicos,
    currentPageCentros,
    currentPageEspecialidades,
    currentPageMedicamentos,
    busquedaEmpleado,
    busquedaCentro,
    busquedaEspecialidad,
    busquedaMedicamento,
    busquedaDiagnosticados,
    busquedaNoDiagnosticados,
    totalMedicos,
    totalPacientes,
    totalCentros,
    totalEspecialidades,
    medicosFiltrados,
    totalPagesMedicos,
    paginatedMedicos,
    pacientesDiagnosticadosFiltrados,
    pacientesNoDiagnosticadosFiltrados,
    centrosFiltrados,
    totalPagesCentros,
    paginatedCentros,
    especialidadesFiltradas,
    totalPagesEspecialidades,
    paginatedEspecialidades,
    medicamentosFiltrados,
    totalPagesMedicamentos,
    paginatedMedicamentos,
    consultasPorDiaOptions,
    medicosPorCentroOptions,
    pacientesDiagnosticadosOptions,
    patientAgeDistributionOptions,
    cargarDatos,
    cargarAdminInfo,
    logout,
  }
}
