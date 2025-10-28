<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR MÉDICO' : 'AGREGAR MÉDICO' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitEmpleado')">
            <div class="form-row">
              <div class="form-group">
                <label>Nombre *</label>
                <input
                  :value="empleadoData.nombre"
                  @input="updateEmpleadoData('nombre', handleLettersInput($event, 30))"
                  type="text"
                  required
                  maxlength="30"
                />
              </div>
              <div class="form-group">
                <label>Apellido *</label>
                <input
                  :value="empleadoData.apellido"
                  @input="updateEmpleadoData('apellido', handleLettersInput($event, 30))"
                  type="text"
                  required
                  maxlength="30"
                />
              </div>
            </div>

            <div class="form-group">
              <label>Cédula *</label>
              <input
                :value="empleadoData.cedula"
                @input="updateEmpleadoData('cedula', handleNumericInput($event, 10))"
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
                maxlength="30"
                autocomplete="new-password"
              />
            </div>

            <div class="form-group" v-if="esEdicion">
              <label>Nueva Contraseña (opcional)</label>
              <input
                :value="empleadoData.password"
                @input="updateEmpleadoData('password', ($event.target as HTMLInputElement).value)"
                type="password"
                placeholder="DEJAR EN BLANCO PARA MANTENER LA ACTUAL"
                minlength="6"
                maxlength="30"
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
                ELIMINAR
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button
                type="submit"
                class="btn-primary"
                :disabled="
                  cedulaValidationState.loading ||
                  cedulaValidationState.isInUse ||
                  (!cedulaValidationState.isValid && empleadoData.cedula?.length === 10) ||
                  (!esEdicion && !cedulaValidationState.isValid)
                "
              >
                {{ esEdicion ? 'ACTUALIZAR' : 'CREAR' }}
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
// IMPORTAR las funciones de validación
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
// OBTENER las funciones de validación del composable
const { validateCedula, passwordStrength, handleNumericInput, handleLettersInput } =
  useAdminValidations(passwordRef)

// Update function for form fields
const updateEmpleadoData = (
  field: keyof (MedicoDetallado & { password?: string }),
  // MODIFICADO: El valor ya viene procesado por las funciones handle*
  processedValue: string | number | undefined,
) => {
  // Ya no necesitamos procesar nombre, apellido y cédula aquí
  // porque se hace directamente en el @input con handleLettersInput y handleNumericInput

  // Mantenemos la lógica para IDs
  if (
    (field === 'centroMedicoId' || field === 'especialidadId') &&
    processedValue !== undefined &&
    processedValue !== null &&
    processedValue !== ''
  ) {
    const parsedInt = parseInt(String(processedValue), 10)
    if (!isNaN(parsedInt)) {
      processedValue = parsedInt
    } else {
      processedValue = undefined
      console.warn(`Invalid non-numeric value passed for ${field}: ${processedValue}`)
    }
  }

  // Lógica para no actualizar cédula en modo edición
  if (field === 'cedula' && props.esEdicion) {
    processedValue = props.empleadoData.cedula // Mantener el valor actual
  }

  // Disparar validación de cédula cuando tiene 10 dígitos y no es edición
  if (field === 'cedula' && !props.esEdicion && String(processedValue).length === 10) {
    validateCedula(String(processedValue), undefined) // currentEmpleadoId es undefined al crear
  } else if (field === 'cedula' && !props.esEdicion) {
    // Limpiar estado de validación si la cédula no tiene 10 dígitos (o está vacía) al crear
    cedulaValidationState.isValid = false
    cedulaValidationState.isInUse = false
    cedulaValidationState.loading = false
    cedulaValidationState.message =
      String(processedValue).length > 0 ? 'LA CÉDULA DEBE TENER 10 DÍGITOS.' : ''
  }

  // Emitir la actualización
  emit('update:empleadoData', {
    ...props.empleadoData,
    [field]: processedValue,
  })
}

// Watch para el modal (sin cambios relevantes, pero se incluye completo)
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
      // FIX: Asegúrate de que empleadoData no sea null o undefined antes de propagar
      if (props.empleadoData) {
        emit('update:empleadoData', { ...props.empleadoData, password: '' })
      }
    } else {
      // When opening:
      // Al abrir en modo edición, valida la cédula existente (aunque no se pueda cambiar)
      if (props.esEdicion && props.empleadoData.cedula?.length === 10) {
        validateCedula(props.empleadoData.cedula, props.empleadoData.id)
      }
      // Ensure password is blank when opening the modal in either mode
      // FIX: Asegúrate de que empleadoData no sea null o undefined antes de propagar
      if (props.empleadoData && props.empleadoData.password !== '') {
        emit('update:empleadoData', { ...props.empleadoData, password: '' })
      }
      // Limpiar estado de cédula al abrir en modo CREACIÓN
      if (!props.esEdicion) {
        cedulaValidationState.isValid = false
        cedulaValidationState.isInUse = false
        cedulaValidationState.loading = false
        cedulaValidationState.message = ''
      }
    }
  },
  { immediate: true },
)
</script>
