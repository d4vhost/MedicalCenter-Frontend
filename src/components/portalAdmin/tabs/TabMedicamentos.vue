<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Gestión de Medicamentos</h2>
      <button @click="$emit('abrirModalMedicamento', null)" class="btn-primary">
        Agregar Medicamento
      </button>
    </div>

    <div class="filters">
      <input
        :value="busquedaMedicamento"
        @input="$emit('update:busquedaMedicamento', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Buscar medicamento por nombre genérico, comercial o laboratorio..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>Nombre Genérico</th>
              <th>Nombre Comercial</th>
              <th>Laboratorio</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="medicamento in paginatedMedicamentos"
              :key="medicamento.id"
              @click="$emit('abrirModalMedicamento', medicamento)"
            >
              <td>{{ medicamento.nombreGenerico }}</td>
              <td>{{ medicamento.nombreComercial || 'N/A' }}</td>
              <td>{{ medicamento.laboratorio || 'N/A' }}</td>
              <td class="action-cell">
                <button class="btn-view" @click.stop="$emit('abrirModalMedicamento', medicamento)">
                  Ver / Editar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, 8 - paginatedMedicamentos.length)"
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
        Anterior
      </button>
      <span>Página {{ currentPageMedicamentos }} de {{ totalPagesMedicamentos }}</span>
      <button
        @click="$emit('nextPage', 'medicamentos')"
        :disabled="currentPageMedicamentos === totalPagesMedicamentos"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Medicamento } from '@/types/adminPortal'

defineProps<{
  paginatedMedicamentos: Medicamento[]
  currentPageMedicamentos: number
  totalPagesMedicamentos: number
  busquedaMedicamento: string
}>()

defineEmits<{
  (e: 'abrirModalMedicamento', medicamento: Medicamento | null): void
  (e: 'prevPage', pageType: 'medicamentos'): void
  (e: 'nextPage', pageType: 'medicamentos'): void
  (e: 'update:busquedaMedicamento', value: string): void
}>()
</script>
