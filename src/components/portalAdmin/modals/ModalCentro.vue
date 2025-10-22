<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'Editar Centro Médico' : 'Agregar Centro Médico' }}</h3>
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
              />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <textarea
                :value="centroData.direccion"
                @input="updateCentroData('direccion', ($event.target as HTMLTextAreaElement).value)"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarCentro', centroData.id)"
                class="btn-danger"
              >
                Eliminar
              </button>
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">
                {{ esEdicion ? 'Actualizar' : 'Crear' }}
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

const updateCentroData = (field: keyof CentroMedico, value: string | undefined) => {
  emit('update:centroData', {
    ...props.centroData,
    [field]: value?.toUpperCase() || '',
  })
}
</script>
