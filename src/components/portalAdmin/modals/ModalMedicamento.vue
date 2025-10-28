<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'EDITAR MEDICAMENTO' : 'AGREGAR MEDICAMENTO' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitMedicamento')">
            <div class="form-group">
              <label>Nombre Genérico *</label>
              <input
                :value="medicamentoData.nombreGenerico"
                @input="
                  updateMedicamentoData(
                    $event,
                    'nombreGenerico',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
                required
                maxlength="50"
              />
            </div>
            <div class="form-group">
              <label>Nombre Comercial</label>
              <input
                :value="medicamentoData.nombreComercial"
                @input="
                  updateMedicamentoData(
                    $event,
                    'nombreComercial',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
                maxlength="50"
              />
            </div>
            <div class="form-group">
              <label>Laboratorio</label>
              <input
                :value="medicamentoData.laboratorio"
                @input="
                  updateMedicamentoData(
                    $event,
                    'laboratorio',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
                maxlength="50"
              />
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarMedicamento', medicamentoData.id)"
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
import type { Medicamento } from '@/types/adminPortal'

const props = defineProps<{
  show: boolean
  esEdicion: boolean
  medicamentoData: Partial<Medicamento>
}>()

const emit = defineEmits([
  'close',
  'submitMedicamento',
  'eliminarMedicamento',
  'update:medicamentoData',
])

// Modificamos para recibir el evento y usarlo de forma segura
const updateMedicamentoData = (
  event: Event | undefined,
  field: keyof Medicamento,
  value: string | undefined,
) => {
  // MODIFICADO: Añadir event
  let processedValue = value?.toUpperCase() || ''
  // Aplicar límite de 50 a todos los campos de texto
  if (processedValue.length > 50) {
    processedValue = processedValue.slice(0, 50)
  }

  // Actualizar el valor del input si se cortó, verificando que event y event.target existan
  if (value !== processedValue && event?.target && event.target instanceof HTMLInputElement) {
    // MODIFICADO: Verificar event y event.target
    ;(event.target as HTMLInputElement).value = processedValue
  }

  emit('update:medicamentoData', {
    ...props.medicamentoData,
    [field]: processedValue,
  })
}
</script>
