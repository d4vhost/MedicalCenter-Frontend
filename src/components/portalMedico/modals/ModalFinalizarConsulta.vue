<template>
  <Transition name="modal-fade">
    <div v-if="show && consulta" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>FINALIZAR CONSULTA</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">
            <strong>PACIENTE:</strong> {{ consulta.nombrePaciente }} | <strong>FECHA:</strong>
            {{ new Date(consulta.fechaHora).toLocaleString('es-ES') }}
          </p>
          <form @submit.prevent="$emit('submitFinalizar')" class="form-column">
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
                  @input="
                    $emit('update:diagnosticoData', {
                      ...diagnosticoData,
                      // Convertir a mayúsculas
                      observaciones: ($event.target as HTMLTextAreaElement).value.toUpperCase(),
                    })
                  "
                  rows="3"
                  maxlength="250"
                ></textarea>
              </div>
            </div>

            <div class="form-column">
              <h4>PRESCRIPCIONES *</h4>
              <div class="prescripciones-list">
                <div v-for="(pres, index) in prescripciones" :key="index" class="prescripcion-item">
                  <div class="prescripcion-info">
                    <strong>{{ pres.nombreMedicamento }}:</strong>
                    <span>{{ pres.indicaciones }}</span>
                  </div>
                  <button
                    type="button"
                    @click="$emit('eliminarPrescripcion', index)"
                    class="btn-remove-prescripcion"
                    aria-label="Eliminar prescripción"
                  >
                    &times;
                  </button>
                </div>
                <p v-if="prescripciones.length === 0" class="no-prescripciones">
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
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary" :disabled="!isFormValid">
                GUARDAR CONSULTA
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
import type { Consulta, DiagnosticoEditable, PrescripcionNueva } from '@/types/medicoPortal'

const props = defineProps<{
  show: boolean
  consulta: Consulta | null
  diagnosticoData: DiagnosticoEditable
  prescripciones: PrescripcionNueva[]
}>()

const emit = defineEmits([
  'close',
  'submitFinalizar',
  'update:diagnosticoData',
  'abrirAgregarMedicamento',
  'eliminarPrescripcion',
])

const diagnosticoError = ref('')

const countWords = (text: string | undefined): number => {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0
}

const handleDiagnosticoInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const text = target.value.toUpperCase() // Convertir a mayúsculas aquí
  const wordCount = countWords(text)

  if (wordCount > 50) {
    diagnosticoError.value = 'EL DIAGNÓSTICO NO PUEDE EXCEDER LAS 50 PALABRAS.'
  } else {
    diagnosticoError.value = ''
  }

  // Actualizar el valor del input si cambió por toUpperCase
  if (target.value !== text) {
    target.value = text
  }

  emit('update:diagnosticoData', {
    ...props.diagnosticoData,
    enfermedadNombre: text, // Emitir valor en mayúsculas
  })
}

const isFormValid = computed(() => {
  const isDiagnosticoPresent = !!props.diagnosticoData.enfermedadNombre?.trim()
  const isDiagnosticoLengthValid =
    !diagnosticoError.value && countWords(props.diagnosticoData.enfermedadNombre) <= 50
  const hasPrescripcion = props.prescripciones.length > 0

  return isDiagnosticoPresent && isDiagnosticoLengthValid && hasPrescripcion
})
</script>
