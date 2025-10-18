<template>
  <Transition name="modal-fade">
    <div v-if="show && paciente" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>Historial de {{ paciente.nombre }} {{ paciente.apellido }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="historial-section">
            <div class="upcoming-header">
              <h4>Consultas Anteriores</h4>
              <div class="pagination-compact" v-if="totalPagesHistorial > 1">
                <button
                  @click="$emit('prevPage', 'historial')"
                  :disabled="currentPageHistorial === 1"
                >
                  Anterior
                </button>
                <span>{{ currentPageHistorial }} de {{ totalPagesHistorial }}</span>
                <button
                  @click="$emit('nextPage', 'historial')"
                  :disabled="currentPageHistorial === totalPagesHistorial"
                >
                  Siguiente
                </button>
              </div>
            </div>

            <div class="filters">
              <input
                type="date"
                :value="busquedaFecha"
                @input="$emit('update:busquedaFecha', ($event.target as HTMLInputElement).value)"
              />
              <input
                type="text"
                :value="busquedaEnfermedad"
                @input="
                  $emit('update:busquedaEnfermedad', ($event.target as HTMLInputElement).value)
                "
                placeholder="Buscar por enfermedad o motivo..."
              />
            </div>

            <ul class="item-list historial-list">
              <li v-for="item in paginatedHistorial" :key="item.id">
                <div class="item-main-info">
                  <span class="item-title">{{ new Date(item.fechaHora).toLocaleString() }}</span>
                  <span class="item-subtitle">Motivo: {{ item.motivo }}</span>
                </div>
                <div class="chip diagnostico-chip">
                  {{ item.enfermedadNombre }}
                </div>
              </li>
              <li v-if="paginatedHistorial.length === 0">
                No se encontraron consultas con los filtros actuales.
              </li>
            </ul>
          </div>
          <hr />
          <h4>Editar Información del Paciente</h4>
          <form @submit.prevent="$emit('submitUpdatePaciente')">
            <div class="form-row">
              <div class="form-group">
                <label for="cedula-edit">Cédula</label>
                <input
                  type="text"
                  id="cedula-edit"
                  :value="pacienteEditable.cedula"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      cedula: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="10"
                />
              </div>
              <div class="form-group">
                <label for="nombre-edit">Nombre</label>
                <input
                  type="text"
                  id="nombre-edit"
                  :value="pacienteEditable.nombre"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      nombre: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="apellido-edit">Apellido</label>
                <input
                  type="text"
                  id="apellido-edit"
                  :value="pacienteEditable.apellido"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      apellido: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="40"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="fecha-nacimiento-edit">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha-nacimiento-edit"
                  :value="pacienteEditable.fechaNacimiento"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      fechaNacimiento: ($event.target as HTMLInputElement).value,
                    })
                  "
                />
              </div>
              <div class="form-group">
                <label for="direccion-edit">Dirección</label>
                <input
                  type="text"
                  id="direccion-edit"
                  :value="pacienteEditable.direccion"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      direccion: ($event.target as HTMLInputElement).value,
                    })
                  "
                  maxlength="60"
                />
              </div>
            </div>
            <div class="modal-actions">
              <button
                type="button"
                @click="$emit('eliminarPaciente', pacienteEditable.id)"
                class="btn-danger"
              >
                Eliminar Paciente
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">Cerrar</button>
              <button type="submit" class="btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Paciente, PacienteEditable, HistorialItem } from '@/types/medicoPortal'

defineProps<{
  show: boolean
  paciente: Paciente | null // El paciente original seleccionado
  pacienteEditable: PacienteEditable // Los datos que se están editando
  paginatedHistorial: HistorialItem[]
  currentPageHistorial: number
  totalPagesHistorial: number
  busquedaFecha: string
  busquedaEnfermedad: string
}>()

defineEmits([
  'close',
  'submitUpdatePaciente',
  'eliminarPaciente',
  'update:pacienteEditable',
  'update:busquedaFecha',
  'update:busquedaEnfermedad',
  'prevPage',
  'nextPage',
])
</script>
