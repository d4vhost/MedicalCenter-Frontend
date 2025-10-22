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
              />
              <div v-if="cedulaValidationState.loading" class="validation-status status-loading">
                Verificando cédula...
              </div>
              <div
                v-if="!cedulaValidationState.loading && cedulaValidationState.message"
                :class="[
                  'validation-status',
                  cedulaValidationState.isValid && !cedulaValidationState.isInUse
                    ? 'status-success'
                    : cedulaValidationState.isInUse
                      ? 'status-warning'
                      : 'status-error',
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
                  <option value="">Seleccione un centro</option>
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
                  <option value="">Seleccione una especialidad</option>
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
                  !!(
                    cedulaValidationState.loading ||
                    (cedulaValidationState.message &&
                      (!cedulaValidationState.isValid || cedulaValidationState.isInUse))
                  )
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
// Remove PasswordStrength from here if not used for explicit typing
import type { MedicoDetallado, CentroMedico, Especialidad } from '@/types/adminPortal'
import {
  useAdminValidations,
  cedulaValidationState,
} from '@/composables/portalAdmin/useAdminValidations'
// Remove ComputedRef import if not needed for explicit typing
// import type { ComputedRef } from 'vue';

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  empleadoData: Partial<MedicoDetallado & { password?: string }>
  centrosMedicos: CentroMedico[]
  especialidades: Especialidad[]
}>()

const emit = defineEmits(['close', 'submitEmpleado', 'eliminarEmpleado', 'update:empleadoData'])

const passwordRef = computed(() => props.empleadoData.password)
// Remove explicit type annotation
const { validateCedula, passwordStrength } = useAdminValidations(passwordRef)

const updateEmpleadoData = (
  field: keyof (MedicoDetallado & { password?: string }),
  value: string | number | undefined,
) => {
  let processedValue = value
  if (field === 'nombre' || field === 'apellido') {
    processedValue = String(value || '').toUpperCase()
  } else if (field === 'cedula') {
    processedValue = String(value || '')
      .replace(/\D/g, '')
      .slice(0, 10)
    if (String(processedValue).length === 10) {
      validateCedula(String(processedValue), props.esEdicion ? props.empleadoData.id : undefined)
    } else {
      cedulaValidationState.isValid = false
      cedulaValidationState.isInUse = false
      cedulaValidationState.loading = false
      cedulaValidationState.message =
        String(processedValue).length > 0 ? 'La cédula debe tener 10 dígitos.' : ''
    }
  } else if (
    (field === 'centroMedicoId' || field === 'especialidadId') &&
    value !== undefined &&
    value !== null &&
    value !== ''
  ) {
    processedValue = Number(value) // Ensure it's a number
  }
  emit('update:empleadoData', {
    ...props.empleadoData,
    [field]: processedValue,
  })
}

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      cedulaValidationState.isValid = false
      cedulaValidationState.isInUse = false
      cedulaValidationState.loading = false
      cedulaValidationState.message = ''
      // Clear password when closing modal for security/UX
      emit('update:empleadoData', { ...props.empleadoData, password: '' })
    } else if (newVal && props.esEdicion && props.empleadoData.cedula?.length === 10) {
      validateCedula(props.empleadoData.cedula, props.empleadoData.id)
    } else if (newVal && !props.esEdicion) {
      // Clear password for new employee modal
      emit('update:empleadoData', { ...props.empleadoData, password: '' })
    }
  },
)
</script>
