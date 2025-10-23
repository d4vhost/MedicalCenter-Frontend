<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>GESTIÓN DE CENTROS MÉDICOS</h2>
      <button @click="$emit('abrirModalCentro', null)" class="btn-primary">AGREGAR CENTRO</button>
    </div>

    <div class="filters">
      <input
        :value="busquedaCentro"
        @input="$emit('update:busquedaCentro', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="BUSCAR CENTRO MÉDICO POR NOMBRE O DIRECCIÓN..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>DIRECCIÓN</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="centro in paginatedCentros" :key="centro.id">
              <td>{{ centro.nombre }}</td>
              <td>{{ centro.direccion || 'N/A' }}</td>
              <td class="action-cell">
                <button class="btn-view" @click.stop="$emit('abrirModalCentro', centro)">
                  VER / EDITAR
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
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button @click="$emit('prevPage', 'centros')" :disabled="currentPageCentros === 1">
        ANTERIOR
      </button>
      <span>PÁGINA {{ currentPageCentros }} DE {{ totalPagesCentros }}</span>
      <button
        @click="$emit('nextPage', 'centros')"
        :disabled="currentPageCentros === totalPagesCentros"
      >
        SIGUIENTE
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
