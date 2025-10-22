<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'Editar Médico' : 'Agregar Médico' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitEmpleado')">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input
                  :value="empleadoData.nombre"
                  @input="updateEmpleadoData('nombre', ($event.target as HTMLInputElement).value)"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input
                  :value="empleadoData.apellido"
                  @input="updateEmpleadoData('apellido', ($event.target as HTMLInputElement).value)"
                  type="text"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Cédula *</label>
              <input
                :value="empleadoData.cedula"
                @input="updateEmpleadoData('cedula', ($event.target as HTMLInputElement).value)"
                type="text"
                maxlength="10"
                required
                autocomplete="off"
              />
              <div v-if="cedulaValidationState.loading" class="validation-status status-loading">
                Verificando cédula...
              </div>
              <div
                v-if="!cedulaValidationState.loading && cedulaValidationState.message"
                :class="[
                  'validation-status',
                  cedulaValidationState.isValid && !cedulaValidationState.isInUse
                    ? 'status-success' // Verde si es válida y no está en uso
                    : cedulaValidationState.isInUse
                      ? 'status-warning' // Amarillo si está en uso
                      : 'status-error', // Rojo si es inválida (y no está en loading/uso)
                ]"
              >
                {{ cedulaValidationState.message }}
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Centro Médico *</label>
                <select
                  :value="empleadoData.centroMedicoId"
                  @change="
                    updateEmpleadoData(
                      'centroMedicoId',
                      parseInt(($event.target as HTMLSelectElement).value),
                    )
                  "
                  required
                >
                  <option value="" disabled>Seleccione un centro</option>
                  <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                    {{ centro.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Especialidad *</label>
                <select
                  :value="empleadoData.especialidadId"
                  @change="
                    updateEmpleadoData(
                      'especialidadId',
                      parseInt(($event.target as HTMLSelectElement).value),
                    )
                  "
                  required
                >
                  <option value="" disabled>Seleccione una especialidad</option>
                  <option
                    v-for="especialidad in especialidades"
                    :key="especialidad.id"
                    :value="especialidad.id"
                  >
                    {{ especialidad.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group" v-if="!esEdicion">
              <label>Contraseña *</label>
              <input
                :value="empleadoData.password"
                @input="updateEmpleadoData('password', ($event.target as HTMLInputElement).value)"
                type="password"
                :required="!esEdicion"
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <div class="form-group" v-if="esEdicion">
              <label>Nueva Contraseña (opcional)</label>
              <input
                :value="empleadoData.password"
                @input="updateEmpleadoData('password', ($event.target as HTMLInputElement).value)"
                type="password"
                placeholder="Dejar en blanco para mantener la actual"
                minlength="6"
                autocomplete="new-password"
              />
            </div>

            <div
              v-if="empleadoData.password && empleadoData.password.length > 0"
              class="password-strength-meter"
            >
              <div class="strength-bar" :class="passwordStrength.className"></div>
            </div>
            <p
              v-if="empleadoData.password && empleadoData.password.length > 0"
              class="strength-text"
              :class="passwordStrength.className"
            >
              {{ passwordStrength.text.toUpperCase() }}
            </p>

            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarEmpleado', empleadoData.id)"
                class="btn-danger"
              >
                Eliminar
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="
                  cedulaValidationState.loading /* Deshabilitado mientras carga */ ||
                  cedulaValidationState.isInUse /* Deshabilitado si la cédula está en uso */ ||
                  (!cedulaValidationState.isValid &&
                    empleadoData.cedula?.length ===
                      10) /* Deshabilitado si es inválida (y tiene 10 dígitos) */
                "
              >
                {{ esEdicion ? 'Actualizar' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// REMOVED 'Ref' from this import
import { computed, watch } from 'vue'
import type {
  MedicoDetallado,
  CentroMedico,
  Especialidad,
  // REMOVED 'PasswordStrength' from this import
} from '@/types/adminPortal'
import {
  useAdminValidations,
  cedulaValidationState,
} from '@/composables/portalAdmin/useAdminValidations'

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  empleadoData: Partial<MedicoDetallado & { password?: string }>
  centrosMedicos: CentroMedico[]
  especialidades: Especialidad[]
}>()

const emit = defineEmits(['close', 'submitEmpleado', 'eliminarEmpleado', 'update:empleadoData'])

// Password strength logic
const passwordRef = computed(() => props.empleadoData.password)
// The 'passwordStrength' returned here implicitly uses the PasswordStrength type from the composable
const { validateCedula, passwordStrength } = useAdminValidations(passwordRef)

// Update function for form fields
const updateEmpleadoData = (
  field: keyof (MedicoDetallado & { password?: string }),
  value: string | number | undefined,
) => {
  let processedValue = value

  // Uppercase for name and apellido
  if (field === 'nombre' || field === 'apellido') {
    processedValue = String(value || '').toUpperCase()
  }
  // Cedula validation and formatting
  else if (field === 'cedula') {
    processedValue = String(value || '')
      .replace(/\D/g, '') // Remove non-digits
      .slice(0, 10) // Limit to 10 digits

    // Trigger validation only when 10 digits are entered
    if (String(processedValue).length === 10) {
      validateCedula(String(processedValue), props.esEdicion ? props.empleadoData.id : undefined)
    } else {
      // Clear validation state if not 10 digits (or empty)
      cedulaValidationState.isValid = false
      cedulaValidationState.isInUse = false
      cedulaValidationState.loading = false
      // Set message only if input is not empty but less than 10 digits
      cedulaValidationState.message =
        String(processedValue).length > 0 ? 'La cédula debe tener 10 dígitos.' : ''
    }
  }
  // Ensure IDs are numbers
  else if (
    (field === 'centroMedicoId' || field === 'especialidadId') &&
    value !== undefined &&
    value !== null &&
    value !== '' // Check for empty string from select initial state
  ) {
    // Check if the value is parseable as an integer before converting
    const parsedInt = parseInt(String(value), 10)
    if (!isNaN(parsedInt)) {
      processedValue = parsedInt
    } else {
      // Handle cases where the value might not be a number (e.g., initial empty string)
      processedValue = undefined // Or null, depending on your backend expectation
      console.warn(`Invalid non-numeric value passed for ${field}: ${value}`)
    }
  }
  // Update the parent component's data
  emit('update:empleadoData', {
    ...props.empleadoData,
    [field]: processedValue,
  })
}

// Watch for modal visibility changes
watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      // Reset validation state completely when modal closes
      cedulaValidationState.isValid = false
      cedulaValidationState.isInUse = false
      cedulaValidationState.loading = false
      cedulaValidationState.message = ''
      // Also clear the password for security/UX
      emit('update:empleadoData', { ...props.empleadoData, password: '' })
    } else {
      // When opening:
      if (props.esEdicion && props.empleadoData.cedula?.length === 10) {
        // If editing and cedula is complete, re-validate
        validateCedula(props.empleadoData.cedula, props.empleadoData.id)
      } else if (!props.esEdicion) {
        // If adding, ensure password field is clear
        emit('update:empleadoData', { ...props.empleadoData, password: '' })
      }
      // Ensure password is blank when opening the modal in either mode
      if (props.empleadoData.password !== '') {
        emit('update:empleadoData', { ...props.empleadoData, password: '' })
      }
    }
  },
  { immediate: true }, // Run once immediately on component mount/setup
)
</script>
