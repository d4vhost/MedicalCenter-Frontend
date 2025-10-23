<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>GESTIÓN DE ESPECIALIDADES</h2>
      <button @click="$emit('abrirModalEspecialidad', null)" class="btn-primary">
        AGREGAR ESPECIALIDAD
      </button>
    </div>

    <div class="filters">
      <input
        :value="busquedaEspecialidad"
        @input="$emit('update:busquedaEspecialidad', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="BUSCAR ESPECIALIDAD..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="especialidad in paginatedEspecialidades" :key="especialidad.id">
              <td>{{ especialidad.nombre }}</td>
              <td class="action-cell">
                <button
                  class="btn-view"
                  @click.stop="$emit('abrirModalEspecialidad', especialidad)"
                >
                  VER / EDITAR
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedEspecialidades.length)"
              :key="'empty-esp-' + i"
              class="empty-row"
            >
              <td v-for="j in 2" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button
        @click="$emit('prevPage', 'especialidades')"
        :disabled="currentPageEspecialidades === 1"
      >
        ANTERIOR
      </button>
      <span>PÁGINA {{ currentPageEspecialidades }} DE {{ totalPagesEspecialidades }}</span>
      <button
        @click="$emit('nextPage', 'especialidades')"
        :disabled="currentPageEspecialidades === totalPagesEspecialidades"
      >
        SIGUIENTE
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Especialidad } from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 5)

defineProps<{
  paginatedEspecialidades: Especialidad[]
  currentPageEspecialidades: number
  totalPagesEspecialidades: number
  busquedaEspecialidad: string
  especialidadesFiltradas: Especialidad[]
}>()

defineEmits<{
  (e: 'abrirModalEspecialidad', especialidad: Especialidad | null): void
  (e: 'prevPage', pageType: 'especialidades'): void
  (e: 'nextPage', pageType: 'especialidades'): void
  (e: 'update:busquedaEspecialidad', value: string): void
}>()
</script>

<style scoped>
/* Estilos existentes */
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
