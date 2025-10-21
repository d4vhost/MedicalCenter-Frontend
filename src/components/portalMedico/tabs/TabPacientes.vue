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
        @input="$emit('update:busquedaPacienteCedula', ($event.target as HTMLInputElement).value)"
        placeholder="BUSCAR POR CEDULA..."
      />
    </div>
    <div class="table-wrapper">
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
                  ? new Date(paciente.fechaNacimiento)
                      .toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC',
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
            v-for="i in Math.max(0, 7 - paginatedPacientes.length)"
            :key="'empty-paciente-' + i"
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
