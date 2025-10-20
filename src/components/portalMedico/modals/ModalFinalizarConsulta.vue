<template>
  <Transition name="modal-fade">
    <div v-if="show && consulta" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ modoEdicion ? 'EDITAR DIAGNÓSTICO' : 'FINALIZAR CONSULTA' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">
            <strong>PACIENTE:</strong> {{ consulta.nombrePaciente }} | <strong>FECHA:</strong>
            {{ new Date(consulta.fechaHora).toLocaleString('ES-ES').toUpperCase() }}
          </p>
          <form @submit.prevent="handleSubmit" class="form-column">
            <div class="form-column">
              <div class="form-group">
                <label for="enfermedad">DIAGNÓSTICO (ENFERMEDAD) *</label>
                <input
                  type="text"
                  id="enfermedad"
                  :value="diagnosticoData.enfermedadNombre"
                  @input="handleDiagnosticoInput"
                  required
                  placeholder="MÁXIMO 50 PALABRAS"
                  :class="{ 'input-error': diagnosticoError }"
                />
                <p v-if="diagnosticoError" class="error-text-small">{{ diagnosticoError }}</p>
              </div>
              <div class="form-group">
                <label for="observaciones">OBSERVACIONES</label>
                <textarea
                  id="observaciones"
                  :value="diagnosticoData.observaciones"
                  @input="handleObservacionesInput"
                  rows="3"
                  maxlength="250"
                  placeholder="OBSERVACIONES ADICIONALES (OPCIONAL, MÁX 250 CARACTERES)"
                ></textarea>
              </div>
            </div>

            <div class="form-column">
              <h4>PRESCRIPCIONES *</h4>
              <div class="prescripciones-list">
                <div
                  v-for="(pres, index) in prescripcionesExistentes"
                  :key="`exist-${pres.id || index}`"
                  class="prescripcion-item"
                >
                  <div class="prescripcion-info">
                    <strong>{{ pres.nombreMedicamento }}:</strong>
                    <span>{{ pres.indicaciones }}</span>
                  </div>
                  <div>
                    <button
                      type="button"
                      @click="$emit('editarPrescripcionExistente', index)"
                      class="btn-editar-prescripcion"
                      aria-label="EDITAR PRESCRIPCIÓN"
                      style="
                        margin-right: 5px;
                        background: none;
                        border: none;
                        color: var(--primary-color);
                        cursor: pointer;
                        font-size: 0.8rem;
                        padding: 2px;
                      "
                      title="EDITAR"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      @click="$emit('marcarParaEliminarPrescripcion', index)"
                      class="btn-remove-prescripcion"
                      aria-label="ELIMINAR PRESCRIPCIÓN EXISTENTE"
                    >
                      &times;
                    </button>
                  </div>
                </div>
                <div
                  v-for="(pres, index) in prescripcionesNuevas"
                  :key="`new-${index}`"
                  class="prescripcion-item"
                >
                  <div class="prescripcion-info">
                    <strong>{{ pres.nombreMedicamento }}:</strong>
                    <span>{{ pres.indicaciones }}</span>
                  </div>
                  <button
                    type="button"
                    @click="$emit('eliminarPrescripcionNueva', index)"
                    class="btn-remove-prescripcion"
                    aria-label="ELIMINAR NUEVA PRESCRIPCIÓN"
                  >
                    &times;
                  </button>
                </div>
                <p
                  v-if="prescripcionesExistentes.length === 0 && prescripcionesNuevas.length === 0"
                  class="no-prescripciones"
                >
                  AGREGUE AL MENOS UNA PRESCRIPCIÓN.
                </p>
              </div>
              <button
                type="button"
                @click="$emit('abrirAgregarMedicamento')"
                class="btn-secondary btn-add-prescripcion"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                AGREGAR PRESCRIPCIÓN
              </button>
            </div>

            <div class="modal-actions">
              <button
                v-if="modoEdicion"
                type="button"
                @click="$emit('eliminarDiagnostico')"
                class="btn-danger"
              >
                ELIMINAR DIAGNÓSTICO
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary" :disabled="!isFormValid">
                {{ modoEdicion ? 'ACTUALIZAR DIAGNÓSTICO' : 'GUARDAR DIAGNÓSTICO' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type {
  Consulta,
  DiagnosticoEditable,
  PrescripcionNueva,
  PrescripcionExistente,
} from '@/types/medicoPortal'

const props = defineProps<{
  show: boolean
  consulta: Consulta | null
  modoEdicion: boolean
  diagnosticoData: DiagnosticoEditable
  prescripcionesNuevas: PrescripcionNueva[]
  prescripcionesExistentes: PrescripcionExistente[]
}>()

const emit = defineEmits([
  'close',
  'submitFinalizar',
  'submitUpdateConsulta',
  'eliminarDiagnostico',
  'update:diagnosticoData',
  'abrirAgregarMedicamento',
  'eliminarPrescripcionNueva',
  'marcarParaEliminarPrescripcion',
  'editarPrescripcionExistente',
])

const diagnosticoError = ref('')

const countWords = (text: string | undefined): number => {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0
}

const handleDiagnosticoInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const text = target.value.toUpperCase()
  const wordCount = countWords(text)

  if (wordCount > 50) {
    diagnosticoError.value = 'EL DIAGNÓSTICO NO PUEDE EXCEDER LAS 50 PALABRAS.'
  } else {
    diagnosticoError.value = ''
  }

  if (target.value !== text) {
    target.value = text
  }

  emit('update:diagnosticoData', {
    ...props.diagnosticoData,
    enfermedadNombre: text,
  })
}

const handleObservacionesInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  const text = target.value.toUpperCase()
  if (target.value !== text) {
    target.value = text
  }
  emit('update:diagnosticoData', {
    ...props.diagnosticoData,
    observaciones: text,
  })
}

const isFormValid = computed(() => {
  const isDiagnosticoPresent = !!props.diagnosticoData.enfermedadNombre?.trim()
  const isDiagnosticoLengthValid =
    !diagnosticoError.value && countWords(props.diagnosticoData.enfermedadNombre) <= 50
  const hasPrescripcion =
    props.prescripcionesNuevas.length > 0 || props.prescripcionesExistentes.length > 0

  return isDiagnosticoPresent && isDiagnosticoLengthValid && hasPrescripcion
})

const handleSubmit = () => {
  if (props.modoEdicion) {
    emit('submitUpdateConsulta')
  } else {
    emit('submitFinalizar')
  }
}
</script>
