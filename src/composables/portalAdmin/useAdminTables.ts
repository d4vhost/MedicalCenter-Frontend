import { ref, computed, type Ref } from 'vue'
import type {
  MedicoDetallado,
  CentroMedico,
  Especialidad,
  Medicamento,
  PacienteConEstado,
  Paciente,
  Diagnostico,
  Consulta,
  Empleado,
  Medico,
} from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = 8

export function useAdminTables(
  empleados: Ref<Empleado[]>,
  medicos: Ref<Medico[]>,
  pacientes: Ref<Paciente[]>,
  centrosMedicos: Ref<CentroMedico[]>,
  especialidades: Ref<Especialidad[]>,
  medicamentos: Ref<Medicamento[]>,
  consultas: Ref<Consulta[]>,
  diagnosticos: Ref<Diagnostico[]>,
) {
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

  // Recalculate totalPacientes and totalPacientesDiagnosticados here
  const totalPacientes = computed(() => pacientes.value.length)
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
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  })

  const medicosFiltrados = computed(() => {
    const busqueda = busquedaEmpleado.value.toLowerCase()
    if (!busqueda) return medicosDetallados.value
    return medicosDetallados.value.filter(
      (med) =>
        med.nombre.toLowerCase().includes(busqueda) ||
        med.apellido.toLowerCase().includes(busqueda) ||
        med.cedula.includes(busqueda) ||
        med.especialidadNombre.toLowerCase().includes(busqueda) ||
        med.nombreCentroMedico.toLowerCase().includes(busqueda),
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
    return pacientes.value
      .map((p) => ({
        ...p,
        isDiagnosed: ids.has(p.id),
      }))
      .sort((a, b) => a.apellido.localeCompare(b.apellido))
  })

  const pacientesDiagnosticados = computed(() =>
    pacientesConEstado.value.filter((p) => p.isDiagnosed),
  )
  const pacientesNoDiagnosticados = computed(() =>
    pacientesConEstado.value.filter((p) => !p.isDiagnosed),
  )

  const pacientesDiagnosticadosFiltrados = computed(() => {
    const busqueda = busquedaDiagnosticados.value.toLowerCase()
    if (!busqueda) return pacientesDiagnosticados.value
    return pacientesDiagnosticados.value.filter(
      (p) =>
        p.cedula.includes(busqueda) ||
        p.nombre.toLowerCase().includes(busqueda) ||
        p.apellido.toLowerCase().includes(busqueda),
    )
  })

  const pacientesNoDiagnosticadosFiltrados = computed(() => {
    const busqueda = busquedaNoDiagnosticados.value.toLowerCase()
    if (!busqueda) return pacientesNoDiagnosticados.value
    return pacientesNoDiagnosticados.value.filter(
      (p) =>
        p.cedula.includes(busqueda) ||
        p.nombre.toLowerCase().includes(busqueda) ||
        p.apellido.toLowerCase().includes(busqueda),
    )
  })

  const centrosFiltrados = computed(() => {
    const busqueda = busquedaCentro.value.toLowerCase()
    if (!busqueda)
      return centrosMedicos.value.slice().sort((a, b) => a.nombre.localeCompare(b.nombre))
    return centrosMedicos.value
      .filter(
        (c) =>
          c.nombre.toLowerCase().includes(busqueda) ||
          c.direccion?.toLowerCase().includes(busqueda),
      )
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  const totalPagesCentros = computed(() =>
    Math.max(1, Math.ceil(centrosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedCentros = computed(() => {
    const start = (currentPageCentros.value - 1) * ITEMS_PER_PAGE_DEFAULT
    return centrosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
  })

  const especialidadesFiltradas = computed(() => {
    const busqueda = busquedaEspecialidad.value.toLowerCase()
    if (!busqueda)
      return especialidades.value.slice().sort((a, b) => a.nombre.localeCompare(b.nombre))
    return especialidades.value
      .filter((e) => e.nombre.toLowerCase().includes(busqueda))
      .sort((a, b) => a.nombre.localeCompare(b.nombre))
  })

  const totalPagesEspecialidades = computed(() =>
    Math.max(1, Math.ceil(especialidadesFiltradas.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedEspecialidades = computed(() => {
    const start = (currentPageEspecialidades.value - 1) * ITEMS_PER_PAGE_DEFAULT
    return especialidadesFiltradas.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
  })

  const medicamentosFiltrados = computed(() => {
    const busqueda = busquedaMedicamento.value.toLowerCase()
    return medicamentos.value
      .filter(
        (med) =>
          !busqueda ||
          med.nombreGenerico.toLowerCase().includes(busqueda) ||
          med.nombreComercial?.toLowerCase().includes(busqueda) ||
          med.laboratorio?.toLowerCase().includes(busqueda),
      )
      .sort((a, b) => a.nombreGenerico.localeCompare(b.nombreGenerico))
  })
  const totalPagesMedicamentos = computed(() =>
    Math.max(1, Math.ceil(medicamentosFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
  )
  const paginatedMedicamentos = computed(() => {
    const start = (currentPageMedicamentos.value - 1) * ITEMS_PER_PAGE_DEFAULT
    return medicamentosFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
  })

  const resetPagination = () => {
    currentPageMedicos.value = 1
    currentPageCentros.value = 1
    currentPageEspecialidades.value = 1
    currentPageMedicamentos.value = 1
  }

  return {
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
    totalPagesMedicamentos,
    paginatedMedicamentos,
    resetPagination,
    totalPacientes, // Ensure this is exported
    totalPacientesDiagnosticados, // Ensure this is exported
  }
}
