<template>
  <Transition name="modal-fade">
    <div v-if="show && paciente" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>HISTORIAL DE {{ paciente.nombre }} {{ paciente.apellido }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <div class="historial-section">
            <div class="upcoming-header">
              <h4>CONSULTAS ANTERIORES</h4>
              <div class="pagination-compact" v-if="totalPagesHistorial > 1">
                <button
                  @click="$emit('prevPage', 'historial')"
                  :disabled="currentPageHistorial === 1"
                >
                  ANTERIOR
                </button>
                <span>{{ currentPageHistorial }} DE {{ totalPagesHistorial }}</span>
                <button
                  @click="$emit('nextPage', 'historial')"
                  :disabled="currentPageHistorial === totalPagesHistorial"
                >
                  SIGUIENTE
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
                  $emit(
                    'update:busquedaEnfermedad',
                    ($event.target as HTMLInputElement).value.toUpperCase(),
                  )
                "
                placeholder="BUSCAR POR ENFERMEDAD O MOTIVO..."
              />
            </div>

            <ul class="item-list historial-list">
              <li v-for="item in paginatedHistorial" :key="item.id">
                <div class="item-main-info">
                  <span class="item-title">{{ new Date(item.fechaHora).toLocaleString() }}</span>
                  <span class="item-subtitle">MOTIVO: {{ item.motivo }}</span>
                </div>
                <div class="chip diagnostico-chip">
                  {{ item.enfermedadNombre }}
                </div>
              </li>
              <li v-if="paginatedHistorial.length === 0">
                NO SE ENCONTRARON CONSULTAS CON LOS FILTROS ACTUALES.
              </li>
            </ul>
          </div>
          <hr />
          <h4>EDITAR INFORMACIÓN DEL PACIENTE</h4>
          <form @submit.prevent="$emit('submitUpdatePaciente')">
            <div class="form-row">
              <div class="form-group">
                <label for="cedula-edit">CÉDULA</label>
                <input
                  type="text"
                  id="cedula-edit"
                  :value="pacienteEditable.cedula"
                  @input="handleCedulaInput"
                  required
                  maxlength="10"
                />
              </div>
              <div class="form-group">
                <label for="nombre-edit">NOMBRE</label>
                <input
                  type="text"
                  id="nombre-edit"
                  :value="pacienteEditable.nombre"
                  @input="handleLettersInputWrapper($event, 'nombre')"
                  required
                  maxlength="50"
                  placeholder="SOLO LETRAS"
                />
              </div>
              <div class="form-group">
                <label for="apellido-edit">APELLIDO</label>
                <input
                  type="text"
                  id="apellido-edit"
                  :value="pacienteEditable.apellido"
                  @input="handleLettersInputWrapper($event, 'apellido')"
                  required
                  maxlength="50"
                  placeholder="SOLO LETRAS"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="fecha-nacimiento-edit">FECHA DE NACIMIENTO</label>
                <input
                  type="date"
                  id="fecha-nacimiento-edit"
                  :value="pacienteEditable.fechaNacimiento"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      fechaNacimiento: ($event.target as HTMLInputElement).value || undefined,
                    })
                  "
                />
              </div>
              <div class="form-group">
                <label for="direccion-edit">DIRECCIÓN</label>
                <input
                  type="text"
                  id="direccion-edit"
                  :value="pacienteEditable.direccion"
                  @input="
                    $emit('update:pacienteEditable', {
                      ...pacienteEditable,
                      // Convertir a mayúsculas
                      direccion:
                        ($event.target as HTMLInputElement).value.toUpperCase() || undefined,
                    })
                  "
                  maxlength="50"
                />
              </div>
            </div>
            <div class="modal-actions">
              <button
                type="button"
                @click="$emit('eliminarPaciente', pacienteEditable.id)"
                class="btn-danger"
              >
                ELIMINAR PACIENTE
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">CERRAR</button>
              <button type="submit" class="btn-primary">GUARDAR CAMBIOS</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue' // Importar ref
import type { Paciente, PacienteEditable, HistorialItem } from '@/types/medicoPortal'
import { useMedicoValidations } from '@/composables/portalMedico/useMedicoValidations' // Importar composable

const props = defineProps<{
  show: boolean
  paciente: Paciente | null
  pacienteEditable: PacienteEditable
  paginatedHistorial: HistorialItem[]
  currentPageHistorial: number
  totalPagesHistorial: number
  busquedaFecha: string
  busquedaEnfermedad: string
}>()

const emit = defineEmits([
  'close',
  'submitUpdatePaciente',
  'eliminarPaciente',
  'update:pacienteEditable',
  'update:busquedaFecha',
  'update:busquedaEnfermedad',
  'prevPage',
  'nextPage',
])

// Usar el composable para las funciones de manejo de input
const { handleNumericInput, handleLettersInput } = useMedicoValidations(ref(undefined)) // ref dummy

const handleCedulaInput = (event: Event) => {
  const newValue = handleNumericInput(event, 10)
  emit('update:pacienteEditable', { ...props.pacienteEditable, cedula: newValue })
}

const handleLettersInputWrapper = (event: Event, field: 'nombre' | 'apellido') => {
  const lettersOnly = handleLettersInput(event)
  const upperCaseValue = lettersOnly.toUpperCase()
  // Forza actualización del input
  const input = event.target as HTMLInputElement
  if (input.value !== upperCaseValue) {
    input.value = upperCaseValue
  }
  emit('update:pacienteEditable', { ...props.pacienteEditable, [field]: upperCaseValue })
}
</script>
