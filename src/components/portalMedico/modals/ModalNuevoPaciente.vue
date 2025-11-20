<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR PACIENTE' : 'AGREGAR NUEVO PACIENTE' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="cedula-nuevo">CÉDULA *</label>
                <input
                  type="text"
                  id="cedula-nuevo"
                  :value="pacienteData.cedula"
                  @input="handleCedulaInput"
                  @blur="validateCedulaOnBlur"
                  required
                  maxlength="10"
                  placeholder="EJ 1234567890"
                  :class="{
                    'input-success':
                      cedulaStatus.isValidAlgorithm &&
                      !cedulaStatus.isInUse &&
                      !cedulaStatus.loading,
                    'input-error':
                      !cedulaStatus.isValidAlgorithm &&
                      pacienteData.cedula?.length === 10 &&
                      !cedulaStatus.loading,
                    'input-warning': cedulaStatus.isInUse && !cedulaStatus.loading,
                  }"
                  autocomplete="off"
                  :disabled="esEdicion"
                />

                <div v-if="pacienteData.cedula || cedulaStatus.message" class="validation-status">
                  <span
                    v-if="
                      cedulaStatus.isValidAlgorithm &&
                      !cedulaStatus.isInUse &&
                      !cedulaStatus.loading
                    "
                    class="status-success"
                  >
                    {{ cedulaStatus.message }}
                  </span>
                  <span
                    v-else-if="
                      !cedulaStatus.isValidAlgorithm &&
                      pacienteData.cedula?.length === 10 &&
                      !cedulaStatus.loading
                    "
                    class="status-error"
                  >
                    {{ cedulaStatus.message || 'CÉDULA INVÁLIDA' }}
                  </span>
                  <span
                    v-else-if="cedulaStatus.isInUse && !cedulaStatus.loading"
                    class="status-warning"
                  >
                    {{ cedulaStatus.message }}
                  </span>
                  <span v-else-if="cedulaStatus.loading" class="status-loading">
                    VERIFICANDO...
                  </span>
                  <span v-else-if="errorMessage && !cedulaStatus.loading" class="status-error">
                    {{ errorMessage }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="nombre-nuevo">NOMBRE *</label>
                <input
                  type="text"
                  id="nombre-nuevo"
                  :value="pacienteData.nombre"
                  @input="handleLettersInputWrapper($event, 'nombre')"
                  required
                  maxlength="50"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="apellido-nuevo">APELLIDO *</label>
                <input
                  type="text"
                  id="apellido-nuevo"
                  :value="pacienteData.apellido"
                  @input="handleLettersInputWrapper($event, 'apellido')"
                  required
                  maxlength="50"
                />
              </div>
              <div class="form-group">
                <label for="fecha-nacimiento-nuevo">FECHA DE NACIMIENTO</label>
                <input
                  type="date"
                  id="fecha-nacimiento-nuevo"
                  :value="pacienteData.fechaNacimiento"
                  @input="
                    $emit('update:pacienteData', {
                      ...pacienteData,
                      fechaNacimiento: ($event.target as HTMLInputElement).value || undefined,
                    })
                  "
                />
              </div>
            </div>

            <div class="form-group">
              <label for="direccion-nuevo">DIRECCIÓN</label>
              <input
                type="text"
                id="direccion-nuevo"
                :value="pacienteData.direccion"
                @input="
                  $emit('update:pacienteData', {
                    ...pacienteData,
                    direccion: ($event.target as HTMLInputElement).value.toUpperCase() || undefined,
                  })
                "
                maxlength="50"
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>

              <button
                type="submit"
                class="btn-primary"
                :disabled="!isFormValid || cedulaStatus.loading"
              >
                {{ esEdicion ? 'GUARDAR CAMBIOS' : 'CREAR PACIENTE' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { PacienteEditable } from '@/types/medicoPortal'
import {
  useMedicoValidations,
  cedulaValidationState,
} from '@/composables/portalMedico/useMedicoValidations'

const props = defineProps<{
  show: boolean
  pacienteData: PacienteEditable
  esEdicion?: boolean
}>()

// Eliminado 'eliminarPaciente' de los emits ya que el médico no puede eliminar
const emit = defineEmits(['close', 'submitPaciente', 'update:pacienteData'])

const errorMessage = ref('')
const cedulaStatus = cedulaValidationState

const {
  handleNumericInput,
  handleLettersInput: baseHandleLettersInput,
  validateCedula,
} = useMedicoValidations(ref(undefined))

const handleCedulaInput = (event: Event) => {
  const newValue = handleNumericInput(event, 10)
  emit('update:pacienteData', { ...props.pacienteData, cedula: newValue })

  cedulaStatus.isValidAlgorithm = false
  cedulaStatus.isInUse = false
  cedulaStatus.loading = false
  cedulaStatus.message = ''
  errorMessage.value = ''

  if (newValue.length === 10) {
    // Si estamos editando, pasamos el ID actual para ignorarlo en la validación de duplicados
    validateCedula(newValue, props.pacienteData.id)
  } else if (newValue.length > 0) {
    cedulaStatus.message = 'DEBE TENER 10 DÍGITOS.'
  }
}

const validateCedulaOnBlur = () => {
  const cedula = props.pacienteData.cedula
  if (cedula && cedula.length === 10 && !cedulaStatus.loading) {
    validateCedula(cedula, props.pacienteData.id)
  } else if (cedula && cedula.length !== 10) {
    cedulaStatus.isValidAlgorithm = false
    cedulaStatus.isInUse = false
    cedulaStatus.loading = false
    cedulaStatus.message = 'DEBE TENER 10 DÍGITOS.'
  } else if (!cedula) {
    cedulaStatus.message = ''
  }
}

const handleLettersInputWrapper = (event: Event, field: 'nombre' | 'apellido') => {
  const lettersOnly = baseHandleLettersInput(event)
  const upperCaseValue = lettersOnly.toUpperCase()
  const input = event.target as HTMLInputElement
  if (input.value !== upperCaseValue) {
    input.value = upperCaseValue
  }
  emit('update:pacienteData', { ...props.pacienteData, [field]: upperCaseValue })
}

const isFormValid = computed(() => {
  const isNombreValid = props.pacienteData.nombre && props.pacienteData.nombre.trim() !== ''
  const isApellidoValid = props.pacienteData.apellido && props.pacienteData.apellido.trim() !== ''

  // Reglas de validación:
  // En edición confiamos si la cédula no ha cambiado o si pasa la validación.
  // En creación requerimos que esté validada y no en uso.
  const cedulaOk =
    props.pacienteData.cedula?.length === 10 &&
    (props.esEdicion ? true : !cedulaStatus.isInUse && cedulaStatus.isValidAlgorithm) &&
    !cedulaStatus.loading

  return cedulaOk && isNombreValid && isApellidoValid && !errorMessage.value
})

const handleSubmit = () => {
  if (!props.pacienteData.cedula || props.pacienteData.cedula.length !== 10) {
    validateCedulaOnBlur()
    errorMessage.value = 'LA CÉDULA DEBE TENER 10 DÍGITOS.'
    return
  }
  // En creación, validar estrictamente
  if (!props.esEdicion) {
    if (cedulaStatus.loading) {
      errorMessage.value = 'ESPERANDO VERIFICACIÓN DE CÉDULA...'
      return
    }
    if (!cedulaStatus.isValidAlgorithm) {
      errorMessage.value = cedulaStatus.message || 'LA CÉDULA INGRESADA ES INVÁLIDA.'
      return
    }
    if (cedulaStatus.isInUse) {
      errorMessage.value = cedulaStatus.message || 'LA CÉDULA INGRESADA YA ESTÁ REGISTRADA.'
      return
    }
  }

  if (!props.pacienteData.nombre?.trim() || !props.pacienteData.apellido?.trim()) {
    errorMessage.value = 'NOMBRE Y APELLIDO SON REQUERIDOS.'
    return
  }

  if (isFormValid.value || props.esEdicion) {
    errorMessage.value = ''
    emit('submitPaciente')
  } else {
    errorMessage.value = 'VERIFIQUE LOS CAMPOS MARCADOS.'
  }
}

watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      cedulaStatus.isValidAlgorithm = false
      cedulaStatus.isInUse = false
      cedulaStatus.loading = false
      cedulaStatus.message = ''
      errorMessage.value = ''
    } else {
      // Si abrimos en modo edición, asumimos que la data cargada es válida inicialmente
      if (props.esEdicion) {
        cedulaStatus.isValidAlgorithm = true
      }
    }
  },
)
</script>
