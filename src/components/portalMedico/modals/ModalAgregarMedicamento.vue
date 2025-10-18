<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>Agregar Medicamento</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('agregarPrescripcion')">
            <div class="form-group">
              <label for="medicamento-selector">Medicamento *</label>
              <div class="combobox">
                <input
                  type="text"
                  id="medicamento-selector"
                  :value="searchText"
                  @input="$emit('update:searchText', ($event.target as HTMLInputElement).value)"
                  placeholder="Buscar medicamento..."
                  @focus="$emit('update:showOptions', true)"
                  @blur="$emit('blurMedicamentoInput')"
                  required
                />
                <ul v-if="showOptions" class="combobox-options">
                  <li
                    v-for="med in filteredMedicamentos"
                    :key="med.id"
                    @mousedown="$emit('selectMedicamento', med)"
                  >
                    {{ med.nombreGenerico }}
                  </li>
                  <li v-if="filteredMedicamentos.length === 0">No se encontraron medicamentos.</li>
                </ul>
              </div>
              <p v-if="selectedMedicamento" class="selected-medicamento-text">
                Seleccionado: {{ selectedMedicamento.nombreGenerico }}
              </p>
            </div>
            <div class="form-group">
              <label for="indicaciones-agregar">Indicaciones *</label>
              <textarea
                id="indicaciones-agregar"
                :value="indicaciones"
                @input="$emit('update:indicaciones', ($event.target as HTMLTextAreaElement).value)"
                rows="4"
                maxlength="250"
                required
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="!selectedMedicamento">
                Agregar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Medicamento } from '@/types/medicoPortal'

defineProps<{
  show: boolean
  searchText: string
  showOptions: boolean
  filteredMedicamentos: Medicamento[]
  selectedMedicamento: Medicamento | null
  indicaciones: string
}>()

defineEmits([
  'close',
  'agregarPrescripcion',
  'update:searchText',
  'update:showOptions',
  'selectMedicamento',
  'update:indicaciones',
  'blurMedicamentoInput', // Emit para manejar el blur
])
</script>
