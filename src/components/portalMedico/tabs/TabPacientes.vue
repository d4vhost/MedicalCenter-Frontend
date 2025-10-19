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
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha Nacimiento</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="paginatedPacientes.length > 0">
            <tr
              v-for="paciente in paginatedPacientes"
              :key="paciente.id"
              @click="$emit('seleccionarPaciente', paciente)"
            >
              <td>{{ paciente.cedula }}</td>
              <td>{{ paciente.nombre }}</td>
              <td>{{ paciente.apellido }}</td>
              <td>
                {{
                  paciente.fechaNacimiento
                    ? new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })
                    : 'N/A'
                }}
              </td>
              <td>
                <button class="btn-view" @click.stop="$emit('seleccionarPaciente', paciente)">
                  Ver Historial / Editar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in 7 - paginatedPacientes.length"
              :key="'empty-paciente-' + i"
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
            <td colspan="5" class="empty-state">No se encontraron pacientes.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination">
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
