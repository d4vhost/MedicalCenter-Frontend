<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>GESTIÓN DE PACIENTES</h2>
    </div>

    <div class="filters">
      <input
        v-model="busquedaGeneral"
        type="text"
        placeholder="BUSCAR PACIENTE POR CÉDULA, NOMBRE O APELLIDO..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>CÉDULA</th>
              <th>NOMBRE COMPLETO</th>
              <th>CENTRO MÉDICO</th>
              <th>ESTADO DIAGNÓSTICO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in paginatedPacientes" :key="paciente.id">
              <td>{{ paciente.cedula }}</td>
              <td>{{ paciente.nombre }} {{ paciente.apellido }}</td>
              <td>{{ paciente.nombreCentroMedico || 'NO ASIGNADO' }}</td>
              <td>
                <span v-if="paciente.isDiagnosed" class="chip success">DIAGNOSTICADO</span>
                <span v-else class="chip danger">NO DIAGNOSTICADO</span>
              </td>
              <td class="action-cell">
                <button
                  class="btn-danger-small"
                  @click.stop="confirmarEliminarPaciente(paciente)"
                  aria-label="Eliminar Paciente"
                  title="Eliminar Paciente"
                >
                  ELIMINAR
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedPacientes.length)"
              :key="'empty-paciente-' + i"
              class="empty-row"
            >
              <td v-for="j in 5" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
            <tr v-if="pacientesFiltrados.length === 0 && !isLoadingData">
              <td colspan="5" class="no-results-cell">NO SE ENCONTRARON PACIENTES</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">ANTERIOR</button>
      <span>PÁGINA {{ currentPage }} DE {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">SIGUIENTE</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch, type Ref } from 'vue'
import type {
  PacienteConEstado,
  CentroMedico,
  Paciente,
  Diagnostico,
  Consulta,
  Empleado,
  Medico,
} from '@/types/adminPortal' // Asegúrate de importar los tipos necesarios
import apiClient from '@/services/api' // Importa tu cliente API

// --- Definición de Tipos para Error ---
interface AxiosErrorData {
  message?: string
}
interface CustomAxiosError {
  response?: {
    data?: AxiosErrorData
  }
}
// --- Type Guard para AxiosError ---
const isAxiosError = (err: unknown): err is CustomAxiosError => {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as CustomAxiosError).response === 'object' &&
    (err as CustomAxiosError).response !== null &&
    'data' in (err as CustomAxiosError).response!
  )
}

// --- Inyecciones y Refs ---
const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 9)
const isLoadingData = inject<Ref<boolean>>(Symbol.for('isLoadingAdminData'), ref(true))
const pacientes = inject<Ref<Paciente[]>>(Symbol.for('adminPacientes'), ref([]))
const diagnosticos = inject<Ref<Diagnostico[]>>(Symbol.for('adminDiagnosticos'), ref([]))
const consultas = inject<Ref<Consulta[]>>(Symbol.for('adminConsultas'), ref([]))
const empleados = inject<Ref<Empleado[]>>(Symbol.for('adminEmpleados'), ref([]))
const medicos = inject<Ref<Medico[]>>(Symbol.for('adminMedicos'), ref([]))
const centrosMedicos = inject<Ref<CentroMedico[]>>(Symbol.for('adminCentrosMedicos'), ref([]))

const busquedaGeneral = ref('')
const currentPage = ref(1)

// --- Lógica de Pacientes ---

// Calcula los IDs de pacientes que tienen al menos un diagnóstico
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

// Mapea empleados a centros médicos
const empleadoCentroMap = computed(() => {
  const map = new Map<number, number | undefined>()
  empleados.value.forEach((emp) => {
    map.set(emp.id, emp.centroMedicoId)
  })
  return map
})

// Mapea médicos a empleados
const medicoEmpleadoMap = computed(() => {
  const map = new Map<number, number>()
  medicos.value.forEach((med) => {
    map.set(med.id, med.empleadoId)
  })
  return map
})

// Mpepa centros médicos por ID
const centrosMap = computed(() => {
  const map = new Map<number, string>()
  centrosMedicos.value.forEach((centro) => {
    map.set(centro.id, centro.nombre)
  })
  return map
})

// Mapea pacientes a su centro médico (a través de la última consulta)
const pacienteCentroMap = computed(() => {
  const map = new Map<number, string | undefined>()
  const ultimaConsultaPaciente = new Map<number, Consulta>()

  // Encontrar la última consulta de cada paciente
  consultas.value.forEach((consulta) => {
    const existente = ultimaConsultaPaciente.get(consulta.pacienteId)
    if (!existente || new Date(consulta.fechaHora) > new Date(existente.fechaHora)) {
      ultimaConsultaPaciente.set(consulta.pacienteId, consulta)
    }
  })

  ultimaConsultaPaciente.forEach((consulta, pacienteId) => {
    const medicoId = consulta.medicoId // Obtenemos el medicoId directamente
    const empleadoId = medicoEmpleadoMap.value.get(medicoId)
    if (empleadoId) {
      const centroId = empleadoCentroMap.value.get(empleadoId)
      if (centroId) {
        map.set(pacienteId, centrosMap.value.get(centroId))
      }
    }
  })

  return map
})

// Añade estado de diagnóstico y nombre del centro a cada paciente
const pacientesConDetalles = computed(
  (): (PacienteConEstado & { nombreCentroMedico?: string })[] => {
    const idsDiagnosticados = diagnosedPatientIds.value
    return pacientes.value
      .map((p) => ({
        ...p,
        isDiagnosed: idsDiagnosticados.has(p.id),
        nombreCentroMedico: pacienteCentroMap.value.get(p.id) || 'NO ASIGNADO', // Obtener nombre del centro
      }))
      .sort((a, b) => a.apellido.localeCompare(b.apellido)) // Ordenar por apellido
  },
)

// Filtra la lista completa de pacientes según la búsqueda general
const pacientesFiltrados = computed(() => {
  const busqueda = busquedaGeneral.value.trim().toLowerCase()
  if (!busqueda) {
    return pacientesConDetalles.value
  }
  return pacientesConDetalles.value.filter(
    (p) =>
      p.cedula.includes(busqueda) ||
      p.nombre.toLowerCase().includes(busqueda) ||
      p.apellido.toLowerCase().includes(busqueda) ||
      (p.nombreCentroMedico && p.nombreCentroMedico.toLowerCase().includes(busqueda)),
  )
})

// Calcula el número total de páginas
const totalPages = computed(() =>
  Math.max(1, Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
)

// Obtiene los pacientes para la página actual (SIN EFECTOS SECUNDARIOS)
const paginatedPacientes = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE_DEFAULT
  return pacientesFiltrados.value.slice(start, start + ITEMS_PER_PAGE_DEFAULT)
})

// --- Funciones de Paginación ---
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// --- Lógica de Eliminación ---
const confirmarEliminarPaciente = (paciente: Paciente) => {
  if (
    confirm(
      `¿Está seguro de eliminar al paciente ${paciente.nombre} ${paciente.apellido} (C.I: ${paciente.cedula})? Esta acción eliminará también su historial médico asociado.`,
    )
  ) {
    eliminarPaciente(paciente.id)
  }
}

const eliminarPaciente = async (pacienteId: number) => {
  const token = localStorage.getItem('authToken')
  if (!token) {
    alert('No autenticado')
    return
  }
  try {
    isLoadingData.value = true
    await apiClient.delete(`/Pacientes/${pacienteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    alert('Paciente eliminado con éxito.')
    pacientes.value = pacientes.value.filter((p) => p.id !== pacienteId)
    // El 'watch' de 'totalPages' se encargará de ajustar la página si es necesario
  } catch (error) {
    console.error('Error al eliminar paciente:', error)
    if (isAxiosError(error) && error.response?.data?.message) {
      alert(`Error al eliminar: ${error.response.data.message}`)
    } else {
      alert('No se pudo eliminar el paciente.')
    }
  } finally {
    isLoadingData.value = false
  }
}

// --- Observadores (Watchers) ---

// Observa cambios en la búsqueda para resetear la paginación
watch(busquedaGeneral, () => {
  currentPage.value = 1
})

// NUEVO: Observa cambios en totalPages para ajustar currentPage (evita página vacía)
watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = newTotalPages
  }
})
</script>
