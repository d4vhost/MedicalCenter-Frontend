<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>AGREGAR NUEVO PACIENTE</h3>
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
                      cedulaStatus.isValid && !cedulaStatus.isInUse && !cedulaStatus.loading,
                    'input-error':
                      !cedulaStatus.isValid &&
                      pacienteData.cedula?.length === 10 &&
                      !cedulaStatus.loading,
                    'input-warning': cedulaStatus.isInUse && !cedulaStatus.loading,
                  }"
                  autocomplete="off"
                />
                <div v-if="pacienteData.cedula || cedulaStatus.message" class="validation-status">
                  <span
                    v-if="cedulaStatus.isValid && !cedulaStatus.isInUse && !cedulaStatus.loading"
                    class="status-success"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="m9 16.17l-3.59-3.59L4 14l5 5l10-10l-1.41-1.42z"
                      />
                    </svg>
                    {{ cedulaStatus.message }}
                  </span>
                  <span
                    v-else-if="
                      !cedulaStatus.isValid &&
                      pacienteData.cedula?.length === 10 &&
                      !cedulaStatus.loading
                    "
                    class="status-error"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
                      />
                    </svg>
                    {{ cedulaStatus.message || 'CÉDULA INVÁLIDA' }}
                  </span>
                  <span
                    v-else-if="cedulaStatus.isInUse && !cedulaStatus.loading"
                    class="status-warning"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z" />
                    </svg>
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
                    // Convertir a mayúsculas
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
                CREAR PACIENTE
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
}>()

const emit = defineEmits(['close', 'submitPaciente', 'update:pacienteData'])

const errorMessage = ref('')
const cedulaStatus = cedulaValidationState

// Ajustar useMedicoValidations para que maneje mayúsculas
const {
  handleNumericInput,
  handleLettersInput: baseHandleLettersInput,
  validateCedula,
} = useMedicoValidations(ref(undefined))

const handleCedulaInput = (event: Event) => {
  const newValue = handleNumericInput(event, 10)
  emit('update:pacienteData', { ...props.pacienteData, cedula: newValue })
  cedulaStatus.isValid = false
  cedulaStatus.isInUse = false
  cedulaStatus.loading = false
  cedulaStatus.message = ''
  errorMessage.value = ''
  if (newValue.length === 10) {
    validateCedula(newValue)
  } else if (newValue.length > 0) {
    cedulaStatus.message = 'DEBE TENER 10 DÍGITOS.'
  }
}

const validateCedulaOnBlur = () => {
  const cedula = props.pacienteData.cedula
  if (cedula && cedula.length === 10 && !cedulaStatus.loading) {
    validateCedula(cedula)
  } else if (cedula && cedula.length !== 10) {
    cedulaStatus.isValid = false
    cedulaStatus.isInUse = false
    cedulaStatus.loading = false
    cedulaStatus.message = 'DEBE TENER 10 DÍGITOS.'
  } else if (!cedula) {
    cedulaStatus.message = ''
  }
}

// Wrapper que también convierte a mayúsculas
const handleLettersInputWrapper = (event: Event, field: 'nombre' | 'apellido') => {
  const lettersOnly = baseHandleLettersInput(event) // Aplica filtro de letras
  const upperCaseValue = lettersOnly.toUpperCase() // Convierte a mayúsculas
  // Forza la actualización del input si el valor cambió a mayúsculas
  const input = event.target as HTMLInputElement
  if (input.value !== upperCaseValue) {
    input.value = upperCaseValue
  }
  emit('update:pacienteData', { ...props.pacienteData, [field]: upperCaseValue })
}

const isFormValid = computed(() => {
  const isNombreValid = props.pacienteData.nombre && props.pacienteData.nombre.trim() !== ''
  const isApellidoValid = props.pacienteData.apellido && props.pacienteData.apellido.trim() !== ''

  return (
    props.pacienteData.cedula?.length === 10 &&
    isNombreValid &&
    isApellidoValid &&
    cedulaStatus.isValid &&
    !cedulaStatus.isInUse &&
    !cedulaStatus.loading &&
    !errorMessage.value
  )
})

const handleSubmit = () => {
  if (!props.pacienteData.cedula || props.pacienteData.cedula.length !== 10) {
    validateCedulaOnBlur()
    errorMessage.value = 'LA CÉDULA DEBE TENER 10 DÍGITOS.'
    return
  }
  if (cedulaStatus.loading) {
    errorMessage.value = 'ESPERANDO VERIFICACIÓN DE CÉDULA...'
    return
  }
  if (!cedulaStatus.isValid) {
    errorMessage.value = cedulaStatus.message || 'LA CÉDULA INGRESADA ES INVÁLIDA.'
    return
  }
  if (cedulaStatus.isInUse) {
    errorMessage.value = cedulaStatus.message || 'LA CÉDULA INGRESADA YA ESTÁ REGISTRADA.'
    return
  }
  if (!props.pacienteData.nombre?.trim() || !props.pacienteData.apellido?.trim()) {
    errorMessage.value = 'NOMBRE Y APELLIDO SON REQUERIDOS.'
    return
  }

  if (isFormValid.value) {
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
      cedulaStatus.isValid = false
      cedulaStatus.isInUse = false
      cedulaStatus.loading = false
      cedulaStatus.message = ''
      errorMessage.value = ''
    }
  },
)
</script>
