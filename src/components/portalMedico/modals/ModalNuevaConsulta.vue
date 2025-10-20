<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>REGISTRAR NUEVA CONSULTA</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitConsulta')">
            <div class="form-group">
              <label for="paciente-search">BUSCAR PACIENTE POR CÉDULA</label>
              <div class="search-group">
                <input
                  type="text"
                  id="paciente-search"
                  :value="busquedaCedula"
                  @input="handleCedulaInputProxy"
                  maxlength="10"
                  placeholder="INGRESE LA CÉDULA DEL PACIENTE..."
                  :disabled="!!consultaData.pacienteId"
                  autocomplete="off"
                />
                <button
                  type="button"
                  class="btn-secondary"
                  @click="$emit('buscarPaciente')"
                  :disabled="!!consultaData.pacienteId || busquedaCedula.length !== 10"
                >
                  BUSCAR
                </button>
              </div>
              <p
                v-if="busquedaCedula && busquedaCedula.length !== 10 && !consultaData.pacienteId"
                class="error-text-small"
              >
                LA CÉDULA DEBE TENER 10 DÍGITOS NUMÉRICOS PARA BUSCAR.
              </p>
            </div>

            <div v-if="pacienteNoEncontradoMsg" class="search-result-message error">
              {{ pacienteNoEncontradoMsg }}
            </div>

            <div v-if="consultaData.pacienteId" class="selected-patient-info">
              <strong>PACIENTE:</strong> {{ pacienteSearchText }}
            </div>

            <div class="form-group">
              <label for="motivo">MOTIVO DE CONSULTA *</label>
              <input
                type="text"
                id="motivo"
                :value="consultaData.motivo"
                @input="
                  $emit('update:consultaData', {
                    ...consultaData,
                    // Convertir a mayúsculas
                    motivo: ($event.target as HTMLInputElement).value.toUpperCase(),
                  })
                "
                required
                maxlength="50"
                :disabled="!consultaData.pacienteId"
                :placeholder="!consultaData.pacienteId ? 'SELECCIONE UN PACIENTE PRIMERO' : ''"
              />
            </div>
            <div class="form-group">
              <label for="fecha">FECHA Y HORA *</label>
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
              <button type="button" @click="$emit('close')" class="btn-secondary">CANCELAR</button>
              <button type="submit" class="btn-primary" :disabled="!consultaData.pacienteId">
                CREAR
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  'handleCedulaInput',
])

const handleCedulaInputProxy = (event: Event) => {
  emit('handleCedulaInput', event)
}
</script>
