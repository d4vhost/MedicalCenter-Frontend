<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nueva Consulta</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitConsulta')">
            <div class="form-group">
              <label for="paciente-search">Buscar Paciente por Cédula</label>
              <div class="search-group">
                <input
                  type="text"
                  id="paciente-search"
                  :value="busquedaCedula"
                  @input="handleCedulaInputProxy"
                  maxlength="10"
                  placeholder="Ingrese la cédula del paciente..."
                  :disabled="!!consultaData.pacienteId"
                />
                <button
                  type="button"
                  class="btn-secondary"
                  @click="$emit('buscarPaciente')"
                  :disabled="!!consultaData.pacienteId || !isCedulaValida"
                >
                  Buscar
                </button>
              </div>
              <p v-if="busquedaCedula && !isCedulaValida" class="error-text-small">
                Cédula inválida. Debe tener 10 dígitos numéricos.
              </p>
            </div>

            <div v-if="pacienteNoEncontradoMsg" class="search-result-message error">
              {{ pacienteNoEncontradoMsg }}
            </div>

            <div v-if="consultaData.pacienteId" class="selected-patient-info">
              <strong>Paciente:</strong> {{ pacienteSearchText }}
            </div>

            <div class="form-group">
              <label for="motivo">Motivo de Consulta</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.04 12.13c.23.5.02 1.09-.49 1.32l-3.33 1.49c-.3.13-.5.37-.59.67l-1.5 5.02c-.2.66-.92 1.05-1.59.85s-1.05-.92-.85-1.59l1.5-5.02c.22-.73.73-1.36 1.39-1.74l3.33-1.49c.67-.3 1.39.09 1.59.75M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.86 0 1.68-.13 2.45-.35c.32-.1.55-.41.55-.75V20c0-4.41 3.59-8 8-8h.34c.34 0 .65-.22.75-.55C23.87 10.1 23.9 9 22 4.53C20.74 2.92 18.27 2 15.5 2H12m0 2h3.5c1.75 0 3.61.63 4.65 1.76c.74.8 1.12 2.19.85 4.24H20c-3.31 0-6 2.69-6 6v.44c-3.41-1.08-6-4.26-6-8.19c0-4.41 3.59-8 8-8"
                  />
                </svg>
                <input
                  type="text"
                  id="motivo"
                  :value="consultaData.motivo"
                  @input="
                    $emit('update:consultaData', {
                      ...consultaData,
                      motivo: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="50"
                  :disabled="!consultaData.pacienteId"
                  :placeholder="!consultaData.pacienteId ? 'Seleccione un paciente primero' : ''"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="fecha">Fecha y Hora</label>
              <div class="input-with-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5z"
                  />
                </svg>
                <input
                  type="datetime-local"
                  id="fecha"
                  :value="consultaData.fechaHora"
                  @input="
                    $emit('update:consultaData', {
                      ...consultaData,
                      fechaHora: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  :disabled="!consultaData.pacienteId"
                />
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="!consultaData.pacienteId">
                Crear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ConsultaEditable } from '@/types/medicoPortal'
import { computed } from 'vue' // Import computed

const props = defineProps<{
  show: boolean
  consultaData: ConsultaEditable
  busquedaCedula: string
  pacienteNoEncontradoMsg: string
  pacienteSearchText: string
}>()

const emit = defineEmits([
  'close',
  'submitConsulta',
  'buscarPaciente',
  'update:consultaData',
  'update:busquedaCedula',
  'handleCedulaInput', // Emite el evento para que el padre lo maneje
])

// Re-calcula isCedulaValida basado en la prop
const isCedulaValida = computed(() => /^\d{10}$/.test(props.busquedaCedula))

// Llama a la función de validación del padre a través de un emit
const handleCedulaInputProxy = (event: Event) => {
  emit('handleCedulaInput', event) // Pasa el evento al padre
}
</script>
