<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>CONSULTAS MEDICAS</h2>
      <button @click="$emit('abrirModalNuevaConsulta')" class="btn-primary">NUEVA CONSULTA</button>
    </div>
    <div class="filters">
      <input
        type="text"
        :value="busquedaConsultaCedula"
        @input="$emit('update:busquedaConsultaCedula', ($event.target as HTMLInputElement).value)"
        placeholder="BUSCAR POR CEDULA PACIENTE..."
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
            <th>PACIENTE</th>
            <th>FECHA Y HORA</th>
            <th>MOTIVO</th>
            <th>ESTADO</th>
            <th>ACCION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="consulta in paginatedConsultas" :key="consulta.id">
            <td @click="$emit('seleccionarConsulta', consulta)">{{ consulta.nombrePaciente }}</td>
            <td @click="$emit('seleccionarConsulta', consulta)">
              {{ new Date(consulta.fechaHora).toLocaleString('es-ES').toUpperCase() }}
            </td>
            <td @click="$emit('seleccionarConsulta', consulta)">{{ consulta.motivo }}</td>
            <td @click="$emit('seleccionarConsulta', consulta)">
              <span v-if="consulta.tieneDiagnostico" class="chip success"> FINALIZADA </span>
              <span v-else class="chip danger"> EN ESPERA </span>
            </td>
            <td class="action-buttons">
              <button
                v-if="!consulta.tieneDiagnostico"
                class="btn-diagnosticar"
                @click.stop="$emit('seleccionarConsulta', consulta)"
                aria-label="Diagnosticar Consulta"
              >
                DIAGNOSTICAR
              </button>
              <button
                v-else
                class="btn-historial"
                @click.stop="$emit('seleccionarConsulta', consulta)"
                aria-label="Ver o Editar Diagnóstico"
              >
                VER / EDITAR
              </button>
              <button
                class="btn-danger-small"
                @click.stop="$emit('eliminarConsulta', consulta.id)"
                aria-label="Eliminar Consulta"
                title="Eliminar Consulta"
              >
                ELIMINAR
              </button>
            </td>
          </tr>
          <tr
            v-for="i in Math.max(0, 7 - paginatedConsultas.length)"
            :key="'empty-consulta-' + i"
            class="empty-row"
          >
            <td><span class="empty-cell-content">&nbsp;</span></td>
            <td><span class="empty-cell-content">&nbsp;</span></td>
            <td><span class="empty-cell-content">&nbsp;</span></td>
            <td><span class="empty-cell-content">&nbsp;</span></td>
            <td><span class="empty-cell-content">&nbsp;</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
      <button @click="$emit('prevPage', 'consultas')" :disabled="currentPageConsultas === 1">
        ANTERIOR
      </button>
      <span>PÁGINA {{ currentPageConsultas }} DE {{ totalPagesConsultas }}</span>
      <button
        @click="$emit('nextPage', 'consultas')"
        :disabled="currentPageConsultas === totalPagesConsultas"
      >
        SIGUIENTE
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
  'eliminarConsulta',
  'prevPage',
  'nextPage',
  'update:busquedaConsultaCedula',
  'update:busquedaConsultaFecha',
])
</script>
