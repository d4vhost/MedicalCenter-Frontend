<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Catálogo de Medicamentos</h2>
      <button @click="$emit('abrirModalMedicamento', null)" class="btn-primary">
        Nuevo Medicamento
      </button>
    </div>
    <div class="filters">
      <input
        type="text"
        :value="busquedaMedicamento"
        @input="$emit('update:busquedaMedicamento', ($event.target as HTMLInputElement).value)"
        placeholder="Buscar por nombre o laboratorio..."
      />
    </div>
    <div class="table-wrapper">
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
            <td>{{ medicamento.nombreComercial || '-' }}</td>
            <td>{{ medicamento.laboratorio || '-' }}</td>
            <td>
              <button class="btn-view" @click.stop="$emit('abrirModalMedicamento', medicamento)">
                Editar
              </button>
            </td>
          </tr>
          <tr v-if="paginatedMedicamentos.length === 0">
            <td colspan="4" class="empty-state">No se encontraron medicamentos.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination" v-if="totalPagesMedicamentos > 1">
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
import type { Medicamento } from '@/types/medicoPortal'

defineProps<{
  paginatedMedicamentos: Medicamento[]
  currentPageMedicamentos: number
  totalPagesMedicamentos: number
  busquedaMedicamento: string
}>()

defineEmits(['abrirModalMedicamento', 'prevPage', 'nextPage', 'update:busquedaMedicamento'])
</script>
