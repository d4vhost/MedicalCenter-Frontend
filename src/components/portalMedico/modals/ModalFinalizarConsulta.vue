<template>
  <Transition name="modal-fade">
    <div v-if="show && consulta" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm modal-compact-content">
        <div class="modal-header">
          <h3 class="compact-modal-title">
            {{ modoEdicion ? 'EDITAR DIAGNÓSTICO' : 'FINALIZAR CONSULTA' }}
          </h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body compact-modal-body">
          <p class="modal-subtitle compact-modal-subtitle">
            <strong>PACIENTE:</strong> {{ consulta.nombrePaciente }} | <strong>FECHA:</strong>
            {{ new Date(consulta.fechaHora).toLocaleString('ES-ES').toUpperCase() }}
          </p>
          <p class="modal-subtitle compact-modal-subtitle">
            <strong>MOTIVO CONSULTA:</strong> {{ consulta.motivo }}
          </p>

          <form @submit.prevent="handleSubmit" class="form-column">
            <div class="form-column">
              <div class="form-group compact-form-group">
                <label for="enfermedad">DIAGNÓSTICO (ENFERMEDAD) *</label>
                <input
                  type="text"
                  id="enfermedad"
                  :value="diagnosticoData.enfermedadNombre"
                  @input="handleDiagnosticoInput"
                  required
                  :class="{ 'input-error': diagnosticoError }"
                  class="compact-input"
                />
                <p v-if="diagnosticoError" class="error-text-small">{{ diagnosticoError }}</p>
              </div>
              <div class="form-group compact-form-group">
                <label for="observaciones">OBSERVACIONES</label>
                <textarea
                  id="observaciones"
                  :value="diagnosticoData.observaciones"
                  @input="handleObservacionesInput"
                  rows="2"
                  maxlength="250"
                  placeholder="OBSERVACIONES ADICIONALES..."
                  class="compact-textarea"
                ></textarea>
              </div>
            </div>

            <div class="form-column">
              <h4 class="compact-section-title">PRESCRIPCIONES *</h4>
              <div class="prescripciones-list compact-prescripciones-list">
                <div
                  v-for="(pres, index) in prescripcionesExistentes"
                  :key="`exist-${pres.id || index}`"
                  class="prescripcion-item compact-prescripcion-item"
                >
                  <div class="prescripcion-info compact-prescripcion-info">
                    <strong>{{ pres.nombreMedicamento }}:</strong>
                    <span>{{ pres.indicaciones }}</span>
                  </div>
                  <div class="prescripcion-actions">
                    <button
                      type="button"
                      @click="$emit('editarPrescripcionExistente', index)"
                      class="btn-icon-action btn-edit"
                      aria-label="EDITAR PRESCRIPCIÓN"
                      title="EDITAR"
                    >
                      <Pencil :size="14" />
                    </button>
                    <button
                      type="button"
                      @click="$emit('marcarParaEliminarPrescripcion', index)"
                      class="btn-icon-action btn-delete"
                      aria-label="ELIMINAR PRESCRIPCIÓN EXISTENTE"
                      title="ELIMINAR"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </div>
                <div
                  v-for="(pres, index) in prescripcionesNuevas"
                  :key="`new-${index}`"
                  class="prescripcion-item compact-prescripcion-item"
                >
                  <div class="prescripcion-info compact-prescripcion-info">
                    <strong>{{ pres.nombreMedicamento }}:</strong>
                    <span>{{ pres.indicaciones }}</span>
                  </div>
                  <button
                    type="button"
                    @click="$emit('eliminarPrescripcionNueva', index)"
                    class="btn-icon-action btn-delete"
                    aria-label="ELIMINAR NUEVA PRESCRIPCIÓN"
                    title="ELIMINAR"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
                <p
                  v-if="prescripcionesExistentes.length === 0 && prescripcionesNuevas.length === 0"
                  class="no-prescripciones compact-no-prescripciones"
                >
                  AGREGUE AL MENOS UNA PRESCRIPCIÓN.
                </p>
              </div>
              <button
                type="button"
                @click="$emit('abrirAgregarMedicamento')"
                class="btn-secondary btn-add-prescripcion compact-btn"
              >
                <Plus :size="14" /> AGREGAR PRESCRIPCIÓN
              </button>
            </div>

            <div class="modal-actions compact-modal-actions">
              <button
                v-if="modoEdicion"
                type="button"
                @click="$emit('eliminarDiagnostico')"
                class="btn-danger compact-btn"
              >
                ELIMINAR DIAGNÓSTICO
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary compact-btn">
                CANCELAR
              </button>
              <button type="submit" class="btn-primary compact-btn" :disabled="!isFormValid">
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
// Importar iconos necesarios de lucide-vue-next
import { Pencil, Trash2, Plus } from 'lucide-vue-next'
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
