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
                :disabled="esEdicion"
              />
              <div v-if="cedulaValidationState.loading" class="validation-status status-loading">
                Verificando cédula...
              </div>
              <div
                v-if="!cedulaValidationState.loading && cedulaValidationState.isInUse"
                class="validation-status status-warning"
              >
                {{ cedulaValidationState.message }}
              </div>
              <div
                v-else-if="
                  !cedulaValidationState.loading &&
                  cedulaValidationState.isValid &&
                  !cedulaValidationState.isInUse &&
                  empleadoData.cedula?.length === 10
                "
                class="validation-status status-success"
              >
                {{ cedulaValidationState.message }}
              </div>
              <div
                v-else-if="
                  !cedulaValidationState.loading &&
                  !cedulaValidationState.isValid &&
                  empleadoData.cedula?.length === 10
                "
                class="validation-status status-error"
              >
                {{ cedulaValidationState.message }}
              </div>
              <div
                v-else-if="
                  !cedulaValidationState.loading &&
                  empleadoData.cedula &&
                  empleadoData.cedula.length !== 10
                "
                class="validation-status status-error"
              >
                La cédula debe tener 10 dígitos.
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
                      10) /* Deshabilitado si es inválida (algoritmo) y tiene 10 dígitos */ ||
                  (!esEdicion &&
                    !cedulaValidationState.isValid) /* FIX: Deshabilitado al CREAR si la cédula no es válida (incl. < 10 dig) */
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
import { computed, watch } from 'vue'
import type { MedicoDetallado, CentroMedico, Especialidad } from '@/types/adminPortal'
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
  // Cedula validation and formatting (ONLY IF NOT EDITING)
  else if (field === 'cedula' && !props.esEdicion) {
    /* FIX: Solo procesar cédula si no es edición */
    processedValue = String(value || '')
      .replace(/\D/g, '') // Remove non-digits
      .slice(0, 10) // Limit to 10 digits

    // Trigger validation only when 10 digits are entered
    if (String(processedValue).length === 10) {
      validateCedula(String(processedValue), props.esEdicion ? props.empleadoData.id : undefined)
    } else {
      // Clear validation state if not 10 digits
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
    value !== ''
  ) {
    const parsedInt = parseInt(String(value), 10)
    if (!isNaN(parsedInt)) {
      processedValue = parsedInt
    } else {
      processedValue = undefined
      console.warn(`Invalid non-numeric value passed for ${field}: ${value}`)
    }
  }

  // FIX: Si el campo es cédula y estamos en modo edición, no actualizamos el valor
  // (ya que está deshabilitado y no debería cambiar), solo mantenemos el valor existente.
  if (field === 'cedula' && props.esEdicion) {
    processedValue = props.empleadoData.cedula // Mantener el valor actual
  }

  // Update the parent component's data
  emit('update:empleadoData', {
    ...props.empleadoData,
    // FIX: Solo actualiza si el campo no es cédula en modo edición, o si es cualquier otro campo
    ...((field !== 'cedula' || !props.esEdicion) && { [field]: processedValue }),
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
      // Al abrir en modo edición, valida la cédula existente (aunque no se pueda cambiar)
      if (props.esEdicion && props.empleadoData.cedula?.length === 10) {
        validateCedula(props.empleadoData.cedula, props.empleadoData.id)
      }
      // Ensure password is blank when opening the modal in either mode
      if (props.empleadoData.password !== '') {
        emit('update:empleadoData', { ...props.empleadoData, password: '' })
      }
    }
  },
  { immediate: true },
)
</script>
