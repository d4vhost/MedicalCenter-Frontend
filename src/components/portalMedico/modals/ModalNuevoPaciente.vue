<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Agregar Nuevo Paciente</h3>
          <button @click="$emit('close')" class="btn-close-modal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="$emit('submitPaciente')">
            <div class="form-row">
              <div class="form-group">
                <label for="cedula-nuevo">Cédula *</label>
                <input
                  type="text"
                  id="cedula-nuevo"
                  :value="pacienteData.cedula"
                  @input="
                    $emit('update:pacienteData', {
                      ...pacienteData,
                      cedula: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="10"
                />
              </div>
              <div class="form-group">
                <label for="nombre-nuevo">Nombre *</label>
                <input
                  type="text"
                  id="nombre-nuevo"
                  :value="pacienteData.nombre"
                  @input="
                    $emit('update:pacienteData', {
                      ...pacienteData,
                      nombre: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="40"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="apellido-nuevo">Apellido *</label>
                <input
                  type="text"
                  id="apellido-nuevo"
                  :value="pacienteData.apellido"
                  @input="
                    $emit('update:pacienteData', {
                      ...pacienteData,
                      apellido: ($event.target as HTMLInputElement).value,
                    })
                  "
                  required
                  maxlength="40"
                />
              </div>
              <div class="form-group">
                <label for="fecha-nacimiento-nuevo">Fecha de Nacimiento</label>
                <input
                  type="date"
                  id="fecha-nacimiento-nuevo"
                  :value="pacienteData.fechaNacimiento"
                  @input="
                    $emit('update:pacienteData', {
                      ...pacienteData,
                      fechaNacimiento: ($event.target as HTMLInputElement).value,
                    })
                  "
                />
              </div>
            </div>
            <div class="form-group">
              <label for="direccion-nuevo">Dirección</label>
              <input
                type="text"
                id="direccion-nuevo"
                :value="pacienteData.direccion"
                @input="
                  $emit('update:pacienteData', {
                    ...pacienteData,
                    direccion: ($event.target as HTMLInputElement).value,
                  })
                "
                maxlength="60"
              />
            </div>
            <div class="modal-actions">
              <button type="button" @click="$emit('close')" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary">Crear Paciente</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { PacienteEditable } from '@/types/medicoPortal'

defineProps<{
  show: boolean
  pacienteData: PacienteEditable // Usa el tipo editable
}>()

defineEmits(['close', 'submitPaciente', 'update:pacienteData'])
</script>
