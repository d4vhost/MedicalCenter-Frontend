<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>GESTIÓN DE MEDICAMENTOS</h2>
      <button @click="$emit('abrirModalMedicamento', null)" class="btn-primary">
        AGREGAR MEDICAMENTO
      </button>
    </div>

    <div class="filters">
      <input
        :value="busquedaMedicamento"
        @input="$emit('update:busquedaMedicamento', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="BUSCAR MEDICAMENTO POR NOMBRE GENÉRICO, COMERCIAL O LABORATORIO..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>NOMBRE GENÉRICO</th>
              <th>NOMBRE COMERCIAL</th>
              <th>LABORATORIO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="medicamento in paginatedMedicamentos" :key="medicamento.id">
              <td>{{ medicamento.nombreGenerico }}</td>
              <td>{{ medicamento.nombreComercial || 'N/A' }}</td>
              <td>{{ medicamento.laboratorio || 'N/A' }}</td>
              <td class="action-cell">
                <button class="btn-view" @click.stop="$emit('abrirModalMedicamento', medicamento)">
                  VER / EDITAR
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedMedicamentos.length)"
              :key="'empty-med-' + i"
              class="empty-row"
            >
              <td v-for="j in 4" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button @click="$emit('prevPage', 'medicamentos')" :disabled="currentPageMedicamentos === 1">
        ANTERIOR
      </button>
      <span>PÁGINA {{ currentPageMedicamentos }} DE {{ totalPagesMedicamentos }}</span>
      <button
        @click="$emit('nextPage', 'medicamentos')"
        :disabled="currentPageMedicamentos === totalPagesMedicamentos"
      >
        SIGUIENTE
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Medicamento } from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 5)

defineProps<{
  paginatedMedicamentos: Medicamento[]
  currentPageMedicamentos: number
  totalPagesMedicamentos: number
  busquedaMedicamento: string
  medicamentosFiltrados: Medicamento[]
}>()

defineEmits<{
  (e: 'abrirModalMedicamento', medicamento: Medicamento | null): void
  (e: 'prevPage', pageType: 'medicamentos'): void
  (e: 'nextPage', pageType: 'medicamentos'): void
  (e: 'update:busquedaMedicamento', value: string): void
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
