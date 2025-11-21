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
        @input="
          $emit(
            'update:busquedaConsultaCedula',
            ($event.target as HTMLInputElement).value.toUpperCase(),
          )
        "
        placeholder="BUSCAR POR CEDULA PACIENTE..."
        maxlength="10"
      />
      <input
        type="date"
        :value="busquedaConsultaFecha"
        @input="$emit('update:busquedaConsultaFecha', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="table-wrapper">
      <div class="table-wrapper-inner">
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
              <td>{{ consulta.nombrePaciente }}</td>
              <td>
                {{ formatearFecha(consulta.fechaHora) }}
              </td>
              <td>{{ consulta.motivo }}</td>
              <td>
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
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedConsultas.length)"
              :key="'empty-consulta-' + i"
              class="empty-row"
            >
              <td v-for="j in 5" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
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
import { inject } from 'vue'
import type { Consulta } from '@/types/medicoPortal'

// Inyectar ITEMS_PER_PAGE_DEFAULT con un valor por defecto
const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 9) // <--- ESTA LÍNEA YA ESTABA BIEN

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

// 👇 AGREGA ESTA FUNCIÓN AL FINAL DEL SCRIPT 👇
const formatearFecha = (fechaString: string) => {
  if (!fechaString) return ''

  const fechaAjustada = fechaString.endsWith('Z') ? fechaString : fechaString + 'Z'

  const fecha = new Date(fechaAjustada)

  return fecha
    .toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit', // 01, 02...
      day: '2-digit', // 21, 22...
      hour: '2-digit', // 22, 23...
      minute: '2-digit', // 48, 50...
      hour12: false, // <--- ESTO FUERZA EL FORMATO 24 HORAS
    })
    .toUpperCase()
}
</script>

<style scoped>
/* Estilos adicionales específicos si son necesarios */
</style>
