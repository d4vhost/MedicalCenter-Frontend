<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Consultas Médicas</h2>
      <button @click="$emit('abrirModalNuevaConsulta')" class="btn-primary">Nueva Consulta</button>
    </div>
    <div class="filters">
      <input
        type="text"
        :value="busquedaConsultaCedula"
        @input="$emit('update:busquedaConsultaCedula', ($event.target as HTMLInputElement).value)"
        placeholder="Buscar por Cédula Paciente..."
      />
      <input
        type="date"
        :value="busquedaConsultaFecha"
        @input="$emit('update:busquedaConsultaFecha', ($event.target as HTMLInputElement).value)"
      />
      <div class="filter-toggle">
        <input
          type="checkbox"
          id="mostrar-pendientes"
          :checked="mostrarSoloPendientes"
          @change="
            $emit('update:mostrarSoloPendientes', ($event.target as HTMLInputElement).checked)
          "
        />
        <label for="mostrar-pendientes">Mostrar solo pendientes</label>
      </div>
    </div>
    <ul class="item-list">
      <li
        v-for="consulta in paginatedConsultas"
        :key="consulta.id"
        @click="$emit('seleccionarConsulta', consulta)"
      >
        <div class="item-main-info">
          <span class="item-title">{{ consulta.nombrePaciente }}</span>
          <span class="item-subtitle">{{ new Date(consulta.fechaHora).toLocaleString() }}</span>
        </div>
        <span class="chip">{{ consulta.motivo }}</span>
      </li>
      <li v-if="paginatedConsultas.length === 0">No se encontraron consultas.</li>
    </ul>
    <div class="pagination" v-if="totalPagesConsultas > 1">
      <button @click="$emit('prevPage', 'consultas')" :disabled="currentPageConsultas === 1">
        Anterior
      </button>
      <span>Página {{ currentPageConsultas }} de {{ totalPagesConsultas }}</span>
      <button
        @click="$emit('nextPage', 'consultas')"
        :disabled="currentPageConsultas === totalPagesConsultas"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Consulta } from '@/types/medicoPortal'

defineProps<{
  paginatedConsultas: Consulta[]
  currentPageConsultas: number
  totalPagesConsultas: number
  busquedaConsultaCedula: string
  busquedaConsultaFecha: string
  mostrarSoloPendientes: boolean
}>()

defineEmits([
  'abrirModalNuevaConsulta',
  'seleccionarConsulta',
  'prevPage',
  'nextPage',
  'update:busquedaConsultaCedula',
  'update:busquedaConsultaFecha',
  'update:mostrarSoloPendientes',
])
</script>
