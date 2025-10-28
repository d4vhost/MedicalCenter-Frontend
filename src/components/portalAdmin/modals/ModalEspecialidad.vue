<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR ESPECIALIDAD' : 'AGREGAR ESPECIALIDAD' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitEspecialidad')">
            <div class="form-group">
              <label>Nombre *</label>
              <input
                :value="especialidadData.nombre"
                @input="
                  updateEspecialidadData(
                    $event,
                    'nombre',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
                required
                maxlength="50"
              />
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarEspecialidad', especialidadData.id)"
                class="btn-danger"
              >
                ELIMINAR
              </button>
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

// Modificamos para recibir el evento y usarlo de forma segura
const updateEspecialidadData = (
  event: Event | undefined,
  field: keyof Especialidad,
  value: string | undefined,
) => {
  // MODIFICADO: Añadir event
  let processedValue = value?.toUpperCase() || ''
  if (field === 'nombre' && processedValue.length > 50) {
    processedValue = processedValue.slice(0, 50)
  }

  // Actualizar el valor del input si se cortó, verificando que event y event.target existan
  if (value !== processedValue && event?.target && event.target instanceof HTMLInputElement) {
    // MODIFICADO: Verificar event y event.target
    ;(event.target as HTMLInputElement).value = processedValue
  }

  emit('update:especialidadData', {
    ...props.especialidadData,
    [field]: processedValue,
  })
}
</script>
