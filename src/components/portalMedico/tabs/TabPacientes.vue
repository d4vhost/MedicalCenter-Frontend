<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>GESTIONAR PACIENTES</h2>
      <button @click="$emit('abrirModalNuevoPaciente')" class="btn-primary">
        AGREGAR PACIENTE
      </button>
    </div>
    <div class="filters">
      <input
        type="text"
        :value="busquedaPacienteCedula"
        @input="
          $emit(
            'update:busquedaPacienteCedula',
            ($event.target as HTMLInputElement).value.toUpperCase(),
          )
        "
        placeholder="BUSCAR POR CEDULA..."
        maxlength="10"
      />
    </div>
    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>CEDULA</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>FECHA NACIMIENTO</th>
              <th>ACCION</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in paginatedPacientes" :key="paciente.id">
              <td>{{ paciente.cedula }}</td>
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.apellido }}</td>
              <td>
                {{
                  paciente.fechaNacimiento
                    ? new Date(paciente.fechaNacimiento)
                        .toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          timeZone: 'UTC', // Asegura consistencia de fecha
                        })
                        .toUpperCase()
                    : 'N/A'
                }}
              </td>
              <td class="action-cell">
                <button
                  class="btn-historial"
                  @click.stop="$emit('seleccionarPaciente', paciente)"
                  aria-label="Ver Historial o Editar Paciente"
                >
                  VER / EDITAR
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, ITEMS_PER_PAGE_DEFAULT - paginatedPacientes.length)"
              :key="'empty-paciente-' + i"
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
      <button @click="$emit('prevPage', 'pacientes')" :disabled="currentPagePacientes === 1">
        ANTERIOR
      </button>
      <span>PÁGINA {{ currentPagePacientes }} DE {{ totalPagesPacientes }}</span>
      <button
        @click="$emit('nextPage', 'pacientes')"
        :disabled="currentPagePacientes === totalPagesPacientes"
      >
        SIGUIENTE
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type { Paciente } from '@/types/medicoPortal'

// Inyectar ITEMS_PER_PAGE_DEFAULT con un valor por defecto
const ITEMS_PER_PAGE_DEFAULT = inject<number>('ITEMS_PER_PAGE_DEFAULT', 9) // <--- ESTA LÍNEA YA ESTABA BIEN

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

<style scoped>
/* Estilos adicionales específicos si son necesarios */
/* Puedes añadir un estilo para quitar el cursor:pointer de las filas si lo deseas */
tbody tr:not(.empty-row) {
  cursor: default; /* Cambia el cursor para indicar que la fila no es clickeable */
}
</style>
