<template>
  <Transition name="modal-fade">
    <div v-if="show && consulta" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-lg">
        <div class="modal-header">
          <h3>Finalizar Consulta</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-subtitle">
            <strong>Paciente:</strong> {{ consulta.nombrePaciente }} | <strong>Fecha:</strong>
            {{ new Date(consulta.fechaHora).toLocaleString() }}
          </p>
          <form @submit.prevent="$emit('submitFinalizar')" class="form-grid">
            <div class="form-column">
              <div class="form-group">
                <label for="enfermedad">Diagnóstico (Enfermedad) *</label>
                <input
                  type="text"
                  id="enfermedad"
                  :value="diagnosticoData.enfermedadNombre"
                  @input="
                    $emit('update:diagnosticoData', {
                      ...diagnosticoData,
                      enfermedadNombre: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="250"
                />
              </div>
              <div class="form-group">
                <label for="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  :value="diagnosticoData.observaciones"
                  @input="
                    $emit('update:diagnosticoData', {
                      ...diagnosticoData,
                      observaciones: ($event.target as HTMLTextAreaElement).value,
                    })
                  "
                  rows="4"
                  maxlength="250"
                ></textarea>
              </div>
            </div>

            <div class="form-column">
              <h4>Prescripciones</h4>
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
                  >
                    &times;
                  </button>
                </div>
                <p v-if="prescripciones.length === 0" class="no-prescripciones">
                  Aún no se han agregado prescripciones.
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
                Agregar Prescripción
              </button>
            </div>

            <div class="modal-actions full-width">
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar Consulta</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Consulta, DiagnosticoEditable, PrescripcionNueva } from '@/types/medicoPortal'

defineProps<{
  show: boolean
  consulta: Consulta | null // Recibe la consulta seleccionada
  diagnosticoData: DiagnosticoEditable
  prescripciones: PrescripcionNueva[]
}>()

defineEmits([
  'close',
  'submitFinalizar',
  'update:diagnosticoData',
  'abrirAgregarMedicamento',
  'eliminarPrescripcion',
])
</script>
