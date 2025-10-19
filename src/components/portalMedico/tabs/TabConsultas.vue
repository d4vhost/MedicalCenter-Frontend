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
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Fecha y Hora</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedConsultas.length > 0">
            <tr
              v-for="consulta in paginatedConsultas"
              :key="consulta.id"
              @click="$emit('seleccionarConsulta', consulta)"
            >
              <td>{{ consulta.nombrePaciente }}</td>
              <td>{{ new Date(consulta.fechaHora).toLocaleString('es-ES') }}</td>
              <td>{{ consulta.motivo }}</td>
              <td>
                <span class="chip danger"> En Espera </span>
              </td>
              <td>
                <button class="btn-view" @click.stop="$emit('seleccionarConsulta', consulta)">
                  Diagnosticar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in 7 - paginatedConsultas.length"
              :key="'empty-consulta-' + i"
              class="empty-row"
            >
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </template>
          <tr v-else class="no-data-row">
            <td colspan="5" class="empty-state">No se encontraron consultas pendientes.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
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
}>()

defineEmits([
  'abrirModalNuevaConsulta',
  'seleccionarConsulta',
  'prevPage',
  'nextPage',
  'update:busquedaConsultaCedula',
  'update:busquedaConsultaFecha',
])
</script>
