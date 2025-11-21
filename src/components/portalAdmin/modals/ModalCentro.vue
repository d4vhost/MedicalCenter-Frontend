<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR CENTRO MÉDICO' : 'AGREGAR CENTRO MÉDICO' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitCentro')">
            <div class="form-group">
              <label>Nombre *</label>
              <input
                :value="centroData.nombre"
                @input="updateCentroData('nombre', ($event.target as HTMLInputElement).value)"
                type="text"
                required
                maxlength="45"
              />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <textarea
                :value="centroData.direccion"
                @input="updateCentroData('direccion', ($event.target as HTMLTextAreaElement).value)"
                maxlength="60"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary">
                {{ esEdicion ? 'ACTUALIZAR' : 'CREAR' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { CentroMedico } from '@/types/adminPortal'

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  centroData: Partial<CentroMedico>
}>()

const emit = defineEmits(['close', 'submitCentro', 'eliminarCentro', 'update:centroData'])

// Modificamos para aplicar el límite en la función, aunque maxlength ya lo hace visualmente
const updateCentroData = (field: keyof CentroMedico, value: string | undefined) => {
  let processedValue = value?.toUpperCase() || ''
  if (field === 'nombre' && processedValue.length > 45) {
    processedValue = processedValue.slice(0, 45)
  } else if (field === 'direccion' && processedValue.length > 60) {
    processedValue = processedValue.slice(0, 60)
  }

  // Actualizar el valor del input si se cortó
  if (value !== processedValue && (event?.target as HTMLInputElement | HTMLTextAreaElement)) {
    ;(event?.target as HTMLInputElement | HTMLTextAreaElement).value = processedValue
  }

  emit('update:centroData', {
    ...props.centroData,
    [field]: processedValue,
  })
}
</script>
