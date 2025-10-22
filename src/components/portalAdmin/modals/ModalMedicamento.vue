<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>{{ esEdicion ? 'Editar Medicamento' : 'Agregar Medicamento' }}</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitMedicamento')">
            <div class="form-group">
              <label>Nombre Genérico *</label>
              <input
                :value="medicamentoData.nombreGenerico"
                @input="
                  updateMedicamentoData('nombreGenerico', ($event.target as HTMLInputElement).value)
                "
                type="text"
                required
              />
            </div>
            <div class="form-group">
              <label>Nombre Comercial</label>
              <input
                :value="medicamentoData.nombreComercial"
                @input="
                  updateMedicamentoData(
                    'nombreComercial',
                    ($event.target as HTMLInputElement).value,
                  )
                "
                type="text"
              />
            </div>
            <div class="form-group">
              <label>Laboratorio</label>
              <input
                :value="medicamentoData.laboratorio"
                @input="
                  updateMedicamentoData('laboratorio', ($event.target as HTMLInputElement).value)
                "
                type="text"
              />
            </div>
            <div class="modal-actions">
              <button
                v-if="esEdicion"
                type="button"
                @click="$emit('eliminarMedicamento', medicamentoData.id)"
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

const updateMedicamentoData = (field: keyof Medicamento, value: string | undefined) => {
  emit('update:medicamentoData', {
    ...props.medicamentoData,
    [field]: value?.toUpperCase() || '',
  })
}
</script>
