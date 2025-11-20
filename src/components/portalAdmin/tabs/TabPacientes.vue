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
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>FECHA NACIMIENTO</th>
              <th>DIRECCIÓN</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in paginatedPacientes" :key="paciente.id">
              <td>{{ paciente.cedula }}</td>
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.apellido }}</td>
              <td>
                {{
                  paciente.fechaNacimiento
                    ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES', {
                        timeZone: 'UTC',
                      })
                    : 'N/A'
                }}
              </td>
              <td>{{ paciente.direccion || 'N/A' }}</td>
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
              <td v-for="j in 6" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
            <tr v-if="pacientesFiltrados.length === 0 && !isLoadingData">
              <td colspan="6" class="no-results-cell">NO SE ENCONTRARON PACIENTES</td>
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
import type { Paciente } from '@/types/adminPortal'
import apiClient from '@/services/api'

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

const busquedaGeneral = ref('')
const currentPage = ref(1)

// Filtra la lista completa de pacientes según la búsqueda general
const pacientesFiltrados = computed(() => {
  const busqueda = busquedaGeneral.value.trim().toLowerCase()
  if (!busqueda) {
    return pacientes.value.slice().sort((a, b) => a.apellido.localeCompare(b.apellido))
  }
  return pacientes.value
    .filter(
      (p) =>
        p.cedula.includes(busqueda) ||
        p.nombre.toLowerCase().includes(busqueda) ||
        p.apellido.toLowerCase().includes(busqueda),
    )
    .sort((a, b) => a.apellido.localeCompare(b.apellido))
})

// Calcula el número total de páginas
const totalPages = computed(() =>
  Math.max(1, Math.ceil(pacientesFiltrados.value.length / ITEMS_PER_PAGE_DEFAULT)),
)

// Obtiene los pacientes para la página actual
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
watch(busquedaGeneral, () => {
  currentPage.value = 1
})

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) {
    currentPage.value = newTotalPages
  }
})
</script>
