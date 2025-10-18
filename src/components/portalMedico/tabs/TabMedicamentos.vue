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
    <ul class="item-list">
      <li
        v-for="medicamento in paginatedMedicamentos"
        :key="medicamento.id"
        @click="$emit('abrirModalMedicamento', medicamento)"
      >
        <div class="item-main-info">
          <span class="item-title">{{ medicamento.nombreGenerico }}</span>
          <span class="item-subtitle">
            {{ medicamento.nombreComercial }}
            {{ medicamento.laboratorio ? `- ${medicamento.laboratorio}` : '' }}
          </span>
        </div>
      </li>
      <li v-if="paginatedMedicamentos.length === 0">No se encontraron medicamentos.</li>
    </ul>
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
