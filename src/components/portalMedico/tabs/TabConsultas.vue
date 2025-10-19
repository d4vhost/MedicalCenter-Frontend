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
          <tr
            v-for="consulta in paginatedConsultas"
            :key="consulta.id"
            @click="$emit('seleccionarConsulta', consulta)"
          >
            <td>{{ consulta.nombrePaciente }}</td>
            <td>{{ new Date(consulta.fechaHora).toLocaleString() }}</td>
            <td>{{ consulta.motivo }}</td>
            <td>
              <span class="chip" :class="consulta.pendiente ? 'warning' : 'success'">
                {{ consulta.pendiente ? 'Pendiente' : 'Finalizada' }}
              </span>
            </td>
            <td>
              <button class="btn-view" @click.stop="$emit('seleccionarConsulta', consulta)">
                {{ consulta.pendiente ? 'Finalizar' : 'Ver Detalle' }}
              </button>
            </td>
          </tr>
          <tr v-if="paginatedConsultas.length === 0">
            <td colspan="5" class="empty-state">No se encontraron consultas.</td>
          </tr>
        </tbody>
      </table>
    </div>
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

interface ConsultaConEstado extends Consulta {
  pendiente?: boolean
}

defineProps<{
  paginatedConsultas: ConsultaConEstado[] // Usar el tipo extendido
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
