<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content modal-sm">
        <div class="modal-header">
          <h3>AGREGAR MEDICAMENTO A LA RECETA</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('agregarPrescripcion')">
            <div class="form-group">
              <label for="medicamento-selector">BUSCAR MEDICAMENTO *</label>
              <div class="combobox">
                <input
                  type="text"
                  id="medicamento-selector"
                  :value="searchText"
                  @input="
                    $emit(
                      'update:searchText',
                      ($event.target as HTMLInputElement).value.toUpperCase(),
                    )
                  "
                  placeholder="ESCRIBA EL NOMBRE..."
                  @focus="$emit('update:showOptions', true)"
                  @blur="$emit('blurMedicamentoInput')"
                  required
                  autocomplete="off"
                  class="form-input"
                />

                <ul v-if="showOptions" class="combobox-options">
                  <li
                    v-for="med in filteredMedicamentos"
                    :key="med.id"
                    @mousedown="$emit('selectMedicamento', med)"
                  >
                    {{ med.nombreGenerico }}
                    <span v-if="med.nombreComercial">({{ med.nombreComercial }})</span>
                  </li>
                  <li v-if="filteredMedicamentos.length === 0" class="no-results">
                    NO SE ENCONTRARON MEDICAMENTOS.
                  </li>
                </ul>
              </div>

              <p v-if="selectedMedicamento" class="selected-medicamento-text">
                <strong>SELECCIONADO:</strong> {{ selectedMedicamento.nombreGenerico }}
              </p>
            </div>

            <div class="form-group">
              <label for="indicaciones-agregar">INDICACIONES *</label>
              <textarea
                id="indicaciones-agregar"
                :value="indicaciones"
                @input="
                  $emit(
                    'update:indicaciones',
                    ($event.target as HTMLTextAreaElement).value.toUpperCase(),
                  )
                "
                rows="4"
                maxlength="100"
                required
                class="form-input"
                placeholder="EJ: TOMAR UNA TABLETA CADA 8 HORAS..."
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary" :disabled="!selectedMedicamento">
                AGREGAR
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

// Definimos EXACTAMENTE las props que usa este modal
// Al no incluir 'esEdicion', Vue ya no lanzará la advertencia.
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
  'blurMedicamentoInput',
])
</script>
