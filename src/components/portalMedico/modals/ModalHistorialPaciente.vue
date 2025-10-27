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

            <div class="historial-slider-container">
              <button
                @click="prevHistorialItem"
                class="slider-btn prev"
                :disabled="currentHistorialIndex === 0 || paginatedHistorial.length <= 1"
              >
                &#8249;
              </button>
              <div class="historial-list-wrapper">
                <Transition name="slide-fade" mode="out-in">
                  <div
                    v-if="paginatedHistorial.length > 0"
                    :key="currentHistorialIndex"
                    class="historial-item-row"
                  >
                    <span class="historial-item-motivo"
                      >MOTIVO: {{ paginatedHistorial[currentHistorialIndex]?.motivo }}</span
                    >
                    <span class="historial-item-date">{{
                      new Date(
                        paginatedHistorial[currentHistorialIndex]?.fechaHora ?? '',
                      ).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }}</span>
                  </div>
                  <div v-else class="historial-item-row no-historial">
                    NO SE ENCONTRARON CONSULTAS CON LOS FILTROS ACTUALES.
                  </div>
                </Transition>
              </div>
              <button
                @click="nextHistorialItem"
                class="slider-btn next"
                :disabled="
                  currentHistorialIndex >= paginatedHistorial.length - 1 ||
                  paginatedHistorial.length <= 1
                "
              >
                &#8250;
              </button>
            </div>
          </div>
          <hr />
          <h4>EDITAR INFORMACIÓN DEL PACIENTE</h4>
          <form @submit.prevent="handleSubmitUpdatePaciente">
            <div class="form-row">
              <div class="form-group">
                <label for="cedula-edit">CÉDULA</label>
                <input
                  type="text"
                  id="cedula-edit"
                  :value="pacienteEditable.cedula"
                  @input="handleCedulaInput"
                  @blur="validateCedulaOnBlur"
                  required
                  maxlength="10"
                  :class="{
                    /* Verde si pasa algoritmo y NO está en uso */
                    'input-success':
                      cedulaStatus.isValidAlgorithm &&
                      !cedulaStatus.isInUse &&
                      !cedulaStatus.loading &&
                      pacienteEditable.cedula?.length === 10,
                    /* Rojo si falla algoritmo o si no tiene 10 dígitos (después de blur/submit) */
                    'input-error':
                      (!cedulaStatus.isValidAlgorithm &&
                        pacienteEditable.cedula?.length === 10 &&
                        !cedulaStatus.loading) ||
                      (showCedulaErrors &&
                        pacienteEditable.cedula &&
                        pacienteEditable.cedula.length !== 10),
                    /* Amarillo si está en uso */
                    'input-warning': cedulaStatus.isInUse && !cedulaStatus.loading,
                  }"
                />
                <div class="validation-status">
                  <span v-if="cedulaStatus.loading" class="status-loading"> Verificando... </span>
                  <span
                    v-else-if="
                      pacienteEditable.cedula?.length === 10 &&
                      cedulaStatus.isValidAlgorithm &&
                      !cedulaStatus.isInUse
                    "
                    class="status-success"
                  >
                    Cédula disponible
                  </span>
                  <span v-else-if="cedulaStatus.isInUse" class="status-warning">
                    {{ cedulaStatus.message || 'Esa cédula ya está registrada' }}
                  </span>
                  <span
                    v-else-if="
                      pacienteEditable.cedula?.length === 10 &&
                      !cedulaStatus.isValidAlgorithm &&
                      cedulaStatus.message
                    "
                    class="status-error"
                  >
                    {{ cedulaStatus.message }}
                  </span>
                  <span
                    v-else-if="
                      showCedulaErrors &&
                      pacienteEditable.cedula &&
                      pacienteEditable.cedula.length !== 10
                    "
                    class="status-error"
                  >
                    La cédula debe tener 10 dígitos.
                  </span>
                  <span
                    v-else-if="
                      !cedulaStatus.loading &&
                      !cedulaStatus.isInUse &&
                      !cedulaStatus.isValidAlgorithm &&
                      cedulaStatus.message.startsWith('ERROR AL VERIFICAR')
                    "
                    class="status-error"
                  >
                    {{ cedulaStatus.message }}
                  </span>
                </div>
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
              <button
                type="submit"
                class="btn-primary"
                :disabled="!isFormValid || cedulaStatus.loading"
              >
                GUARDAR CAMBIOS
              </button>
            </div>
            <div v-if="errorMessage" class="error-message general-error-message">
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Paciente, PacienteEditable, HistorialItem } from '@/types/medicoPortal'
import {
  useMedicoValidations,
  cedulaValidationState,
} from '@/composables/portalMedico/useMedicoValidations'

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

// --- Lógica del Slider ---
const currentHistorialIndex = ref(0)

watch(
  () => props.paginatedHistorial,
  () => {
    currentHistorialIndex.value = 0
  },
)
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      currentHistorialIndex.value = 0
    }
  },
)

const nextHistorialItem = () => {
  if (currentHistorialIndex.value < props.paginatedHistorial.length - 1) {
    currentHistorialIndex.value++
  }
}

const prevHistorialItem = () => {
  if (currentHistorialIndex.value > 0) {
    currentHistorialIndex.value--
  }
}
// --- Fin Lógica del Slider ---

// --- Lógica Validación Cédula ---
const cedulaStatus = cedulaValidationState
const errorMessage = ref('')
const showCedulaErrors = ref(false)
const { handleNumericInput, handleLettersInput, validateCedula } = useMedicoValidations(
  ref(undefined),
)

const handleCedulaInput = (event: Event) => {
  const newValue = handleNumericInput(event, 10)
  emit('update:pacienteEditable', { ...props.pacienteEditable, cedula: newValue })

  // Resetear estado visualmente al escribir, pero mantener mensaje si es relevante
  cedulaStatus.loading = false
  errorMessage.value = ''
  showCedulaErrors.value = false // Solo mostrar errores de longitud en blur/submit

  // Validar en tiempo real solo si tiene 10 dígitos
  if (newValue.length === 10) {
    validateCedula(newValue, props.pacienteEditable.id) // Validar activamente
  } else {
    // Si no tiene 10 dígitos, resetear estado lógico pero mantener mensaje de longitud si aplica
    cedulaStatus.isValidAlgorithm = false
    cedulaStatus.isInUse = false
    if (newValue.length > 0) {
      cedulaStatus.message = 'La cédula debe tener 10 dígitos.'
    } else {
      cedulaStatus.message = '' // Limpiar si está vacío
    }
  }
}

const validateCedulaOnBlur = () => {
  const cedula = props.pacienteEditable.cedula
  showCedulaErrors.value = true // Activar visibilidad de errores de longitud

  if (cedula && cedula.length === 10 && !cedulaStatus.loading) {
    // Si ya tiene 10 dígitos, la validación (incluida API) ya debería haberse disparado en handleCedulaInput
    // O si no se disparó (ej. se pegó el valor), la disparamos aquí.
    if (!cedulaStatus.message && !cedulaStatus.isInUse && !cedulaStatus.isValidAlgorithm) {
      validateCedula(cedula, props.pacienteEditable.id)
    }
  } else if (cedula && cedula.length !== 10) {
    // Si pierde foco y no tiene 10 dígitos, asegurar estado y mensaje de error
    cedulaStatus.isValidAlgorithm = false
    cedulaStatus.isInUse = false
    cedulaStatus.loading = false
    cedulaStatus.message = 'La cédula debe tener 10 dígitos.'
  } else if (!cedula) {
    // Limpiar mensaje si el campo queda vacío al perder foco
    cedulaStatus.message = ''
  }
}

const handleLettersInputWrapper = (event: Event, field: 'nombre' | 'apellido') => {
  const lettersOnly = handleLettersInput(event)
  const upperCaseValue = lettersOnly.toUpperCase()
  const input = event.target as HTMLInputElement
  if (input.value !== upperCaseValue) {
    input.value = upperCaseValue
  }
  emit('update:pacienteEditable', { ...props.pacienteEditable, [field]: upperCaseValue })
}

const isFormValid = computed(() => {
  const isNombreValid = props.pacienteEditable.nombre && props.pacienteEditable.nombre.trim() !== ''
  const isApellidoValid =
    props.pacienteEditable.apellido && props.pacienteEditable.apellido.trim() !== ''

  // Para que el formulario sea válido:
  // - Cédula debe tener 10 dígitos
  // - Nombre y Apellido no deben estar vacíos
  // - Debe pasar la validación del algoritmo de cédula
  // - No debe estar en uso por OTRO paciente
  // - No debe estar cargando la validación
  return (
    props.pacienteEditable.cedula?.length === 10 &&
    isNombreValid &&
    isApellidoValid &&
    cedulaStatus.isValidAlgorithm && // Usa el estado específico del algoritmo
    !cedulaStatus.isInUse &&
    !cedulaStatus.loading
  )
})

const handleSubmitUpdatePaciente = () => {
  errorMessage.value = '' // Limpiar error general
  showCedulaErrors.value = true // Asegurar que se muestren errores de cédula

  // Ejecutar validación de blur por si el usuario no quitó el foco
  validateCedulaOnBlur()

  // --- Verificaciones explícitas antes de emitir ---
  if (!props.pacienteEditable.cedula || props.pacienteEditable.cedula.length !== 10) {
    errorMessage.value = 'La cédula debe tener 10 dígitos.'
    return
  }
  if (cedulaStatus.loading) {
    errorMessage.value = 'Esperando verificación de cédula...' // O un mensaje más genérico
    return
  }
  if (!cedulaStatus.isValidAlgorithm) {
    // Comprobar validez del algoritmo
    errorMessage.value = cedulaStatus.message || 'La cédula ingresada es inválida.'
    return
  }
  if (cedulaStatus.isInUse) {
    // Comprobar si está en uso
    errorMessage.value = cedulaStatus.message || 'La cédula ya está registrada por otro paciente.'
    return
  }
  if (!props.pacienteEditable.nombre?.trim() || !props.pacienteEditable.apellido?.trim()) {
    errorMessage.value = 'Nombre y Apellido son requeridos.'
    return
  }
  // Si todas las validaciones pasan (incluyendo las comprobaciones explícitas y `isFormValid`)
  if (isFormValid.value) {
    emit('submitUpdatePaciente')
  } else {
    // Si llega aquí, es un caso inesperado, pero mostramos un error genérico
    errorMessage.value = 'Por favor, corrija los errores en el formulario.'
  }
}

// Limpiar estado de cédula y errores al cerrar el modal
watch(
  () => props.show,
  (newValue) => {
    if (!newValue) {
      cedulaStatus.isValidAlgorithm = false
      cedulaStatus.isInUse = false
      cedulaStatus.loading = false
      cedulaStatus.message = ''
      errorMessage.value = ''
      showCedulaErrors.value = false
    } else {
      // Al abrir, si hay cédula, validarla (sin mostrar error de longitud aún)
      if (props.pacienteEditable.cedula?.length === 10) {
        validateCedula(props.pacienteEditable.cedula, props.pacienteEditable.id)
      } else {
        // Si no tiene 10 dígitos al abrir, limpiar el estado
        cedulaStatus.isValidAlgorithm = false
        cedulaStatus.isInUse = false
        cedulaStatus.loading = false
        cedulaStatus.message = '' // No mostrar mensaje de longitud al inicio
      }
    }
  },
  { immediate: true }, // Ejecutar al inicio también
)
// --- Fin Lógica Validación Cédula ---
</script>
