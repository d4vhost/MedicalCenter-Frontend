<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Gestión de Médicos</h2>
      <button @click="$emit('abrirModalEmpleado', null)" class="btn-primary">Agregar Médico</button>
    </div>

    <div class="filters">
      <input
        :value="busquedaEmpleado"
        @input="$emit('update:busquedaEmpleado', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Buscar por nombre, apellido, cédula, especialidad o centro..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Especialidad</th>
              <th>Centro Médico</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="medico in paginatedMedicos"
              :key="medico.id"
              @click="$emit('abrirModalEmpleado', medico)"
            >
              <td>{{ medico.cedula }}</td>
              <td>{{ medico.nombre }}</td>
              <td>{{ medico.apellido }}</td>
              <td>
                <span class="chip">{{ medico.especialidadNombre }}</span>
              </td>
              <td>{{ medico.nombreCentroMedico }}</td>
              <td class="action-cell">
                <button class="btn-view" @click.stop="$emit('abrirModalEmpleado', medico)">
                  Ver / Editar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedMedicos.length)"
              :key="'empty-medico-' + i"
              class="empty-row"
            >
              <td v-for="j in 6" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
            <tr v-if="medicosFiltrados.length === 0 && paginatedMedicos.length === 0">
              <td colspan="6" class="no-results-cell">
                No se encontraron médicos con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button @click="$emit('prevPage', 'medicos')" :disabled="currentPageMedicos === 1">
        Anterior
      </button>
      <span>Página {{ currentPageMedicos }} de {{ totalPagesMedicos }}</span>
      <button
        @click="$emit('nextPage', 'medicos')"
        :disabled="currentPageMedicos === totalPagesMedicos"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { MedicoDetallado } from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 5)

defineProps<{
  paginatedMedicos: MedicoDetallado[]
  currentPageMedicos: number
  totalPagesMedicos: number
  busquedaEmpleado: string
  medicosFiltrados: MedicoDetallado[]
}>()

defineEmits<{
  (e: 'abrirModalEmpleado', medico: MedicoDetallado | null): void
  (e: 'prevPage', pageType: 'medicos'): void
  (e: 'nextPage', pageType: 'medicos'): void
  (e: 'update:busquedaEmpleado', value: string): void
}>()
</script>

<style scoped>
.no-results-cell {
  text-align: center;
  color: var(--text-muted-color);
  font-style: italic;
  cursor: default;
}
tbody tr:hover .no-results-cell {
  background-color: transparent;
}
</style>
