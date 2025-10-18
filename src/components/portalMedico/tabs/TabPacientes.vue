<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Gestionar Pacientes</h2>
      <button @click="$emit('abrirModalNuevoPaciente')" class="btn-primary">
        Agregar Paciente
      </button>
    </div>
    <div class="filters">
      <input
        type="text"
        :value="busquedaPacienteCedula"
        @input="$emit('update:busquedaPacienteCedula', ($event.target as HTMLInputElement).value)"
        placeholder="Buscar por Cédula..."
      />
    </div>
    <ul class="item-list">
      <li
        v-for="paciente in paginatedPacientes"
        :key="paciente.id"
        @click="$emit('seleccionarPaciente', paciente)"
      >
        <div class="item-main-info">
          <span class="item-title">{{ paciente.nombre }} {{ paciente.apellido }}</span>
          <span class="item-subtitle">C.I: {{ paciente.cedula }}</span>
        </div>
      </li>
      <li v-if="paginatedPacientes.length === 0">No se encontraron pacientes.</li>
    </ul>
    <div class="pagination" v-if="totalPagesPacientes > 1">
      <button @click="$emit('prevPage', 'pacientes')" :disabled="currentPagePacientes === 1">
        Anterior
      </button>
      <span>Página {{ currentPagePacientes }} de {{ totalPagesPacientes }}</span>
      <button
        @click="$emit('nextPage', 'pacientes')"
        :disabled="currentPagePacientes === totalPagesPacientes"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Paciente } from '@/types/medicoPortal'

defineProps<{
  paginatedPacientes: Paciente[]
  currentPagePacientes: number
  totalPagesPacientes: number
  busquedaPacienteCedula: string
}>()

defineEmits([
  'abrirModalNuevoPaciente',
  'seleccionarPaciente',
  'prevPage',
  'nextPage',
  'update:busquedaPacienteCedula',
])
</script>
