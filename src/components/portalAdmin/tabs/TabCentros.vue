<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Gestión de Centros Médicos</h2>
      <button @click="$emit('abrirModalCentro', null)" class="btn-primary">Agregar Centro</button>
    </div>

    <div class="filters">
      <input
        :value="busquedaCentro"
        @input="$emit('update:busquedaCentro', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Buscar centro médico por nombre o dirección..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="centro in paginatedCentros"
              :key="centro.id"
              @click="$emit('abrirModalCentro', centro)"
            >
              <td>{{ centro.nombre }}</td>
              <td>{{ centro.direccion || 'N/A' }}</td>
              <td class="action-cell">
                <button class="btn-view" @click.stop="$emit('abrirModalCentro', centro)">
                  Ver / Editar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedCentros.length)"
              :key="'empty-centro-' + i"
              class="empty-row"
            >
              <td v-for="j in 3" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
            <tr v-if="centrosFiltrados.length === 0 && paginatedCentros.length === 0">
              <td colspan="3" class="no-results-cell">
                No se encontraron centros médicos con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button @click="$emit('prevPage', 'centros')" :disabled="currentPageCentros === 1">
        Anterior
      </button>
      <span>Página {{ currentPageCentros }} de {{ totalPagesCentros }}</span>
      <button
        @click="$emit('nextPage', 'centros')"
        :disabled="currentPageCentros === totalPagesCentros"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { CentroMedico } from '@/types/adminPortal'

const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 5)

defineProps<{
  paginatedCentros: CentroMedico[]
  currentPageCentros: number
  totalPagesCentros: number
  busquedaCentro: string
  centrosFiltrados: CentroMedico[]
}>()

defineEmits<{
  (e: 'abrirModalCentro', centro: CentroMedico | null): void
  (e: 'prevPage', pageType: 'centros'): void
  (e: 'nextPage', pageType: 'centros'): void
  (e: 'update:busquedaCentro', value: string): void
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
