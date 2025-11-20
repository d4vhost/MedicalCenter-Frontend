<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'DETALLE DEL MEDICAMENTO' : 'NUEVO MEDICAMENTO' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="!esEdicion ? $emit('submitMedicamento') : null">
            <div class="form-group">
              <label for="nombre-generico">NOMBRE GENÉRICO *</label>
              <input
                type="text"
                id="nombre-generico"
                :value="medicamentoData.nombreGenerico"
                @input="
                  updateMedicamentoData('nombreGenerico', ($event.target as HTMLInputElement).value)
                "
                required
                maxlength="40"
                class="form-input"
                :disabled="esEdicion"
              />
            </div>

            <div class="form-group">
              <label for="nombre-comercial">NOMBRE COMERCIAL</label>
              <input
                type="text"
                id="nombre-comercial"
                :value="medicamentoData.nombreComercial"
                @input="
                  updateMedicamentoData(
                    'nombreComercial',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                maxlength="40"
                class="form-input"
                :disabled="esEdicion"
              />
            </div>

            <div class="form-group">
              <label for="laboratorio">LABORATORIO</label>
              <input
                type="text"
                id="laboratorio"
                :value="medicamentoData.laboratorio"
                @input="
                  updateMedicamentoData('laboratorio', ($event.target as HTMLInputElement).value)
                "
                maxlength="40"
                class="form-input"
                :disabled="esEdicion"
              />
            </div>

            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">
                {{ esEdicion ? 'CERRAR' : 'CANCELAR' }}
              </button>

              <button v-if="!esEdicion" type="submit" class="btn-primary">GUARDAR</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { MedicamentoEditable } from '@/types/medicoPortal'

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  medicamentoData: MedicamentoEditable
}>()

const emit = defineEmits(['close', 'submitMedicamento', 'update:medicamentoData'])

const updateMedicamentoData = (field: keyof MedicamentoEditable, value: string) => {
  // Bloqueamos cambios si es solo lectura
  if (props.esEdicion) return

  emit('update:medicamentoData', {
    ...props.medicamentoData,
    [field]: value.toUpperCase(),
  })
}
</script>
