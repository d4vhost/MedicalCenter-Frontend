<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'Editar Especialidad' : 'Agregar Especialidad' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitEspecialidad')">
            <div class="form-group">
              <label>Nombre *</label>
              <input
                :value="especialidadData.nombre"
                @input="updateEspecialidadData('nombre', ($event.target as HTMLInputElement).value)"
                type="text"
                required
              />
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarEspecialidad', especialidadData.id)"
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
import type { Especialidad } from '@/types/adminPortal'

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  especialidadData: Partial<Especialidad>
}>()

const emit = defineEmits([
  'close',
  'submitEspecialidad',
  'eliminarEspecialidad',
  'update:especialidadData',
])

const updateEspecialidadData = (field: keyof Especialidad, value: string | undefined) => {
  emit('update:especialidadData', {
    ...props.especialidadData,
    [field]: value?.toUpperCase() || '',
  })
}
</script>
