<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR MEDICAMENTO' : 'NUEVO MEDICAMENTO' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitMedicamento')">
            <div class="form-group">
              <label for="nombre-generico">NOMBRE GENÉRICO *</label>
              <input
                type="text"
                id="nombre-generico"
                :value="medicamentoData.nombreGenerico"
                @input="
                  $emit('update:medicamentoData', {
                    ...medicamentoData,
                    // Convertir a mayúsculas
                    nombreGenerico: ($event.target as HTMLInputElement).value.toUpperCase(),
                  })
                "
                required
                maxlength="40"
              />
            </div>
            <div class="form-group">
              <label for="nombre-comercial">NOMBRE COMERCIAL</label>
              <input
                type="text"
                id="nombre-comercial"
                :value="medicamentoData.nombreComercial"
                @input="
                  $emit('update:medicamentoData', {
                    ...medicamentoData,
                    // Convertir a mayúsculas
                    nombreComercial: ($event.target as HTMLInputElement).value.toUpperCase(),
                  })
                "
                maxlength="40"
              />
            </div>
            <div class="form-group">
              <label for="laboratorio">LABORATORIO</label>
              <input
                type="text"
                id="laboratorio"
                :value="medicamentoData.laboratorio"
                @input="
                  $emit('update:medicamentoData', {
                    ...medicamentoData,
                    // Convertir a mayúsculas
                    laboratorio: ($event.target as HTMLInputElement).value.toUpperCase(),
                  })
                "
                maxlength="40"
              />
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click.stop="$emit('eliminarMedicamento', medicamentoData.id)"
                class="btn-danger"
              >
                ELIMINAR
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary">GUARDAR</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { MedicamentoEditable } from '@/types/medicoPortal'

defineProps<{
  show: boolean
  esEdicion: boolean
  medicamentoData: MedicamentoEditable
}>()

defineEmits(['close', 'submitMedicamento', 'eliminarMedicamento', 'update:medicamentoData'])
</script>
