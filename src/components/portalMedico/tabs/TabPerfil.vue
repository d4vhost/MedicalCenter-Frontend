<template>
  <div class="tab-content">
    <div class="tab-header"><h2>Panel de Médico</h2></div>
    <div class="profile-grid">
      <div class="profile-left-column">
        <div class="card profile-card">
          <div class="profile-avatar">Dr.</div>
          <h3>{{ medicoInfo.nombreCompleto || 'Cargando...' }}</h3>
          <p>{{ medicoInfo.nombreEspecialidad || '...' }}</p>
          <span v-if="medicoInfo.nombreCentroMedico" class="chip">{{
            medicoInfo.nombreCentroMedico
          }}</span>
        </div>
        <div class="card upcoming-card">
          <div class="upcoming-header">
            <h4>Consultas Pendientes de Diagnóstico</h4>
            <div class="pagination-compact" v-if="totalCitasPages > 1">
              <button @click="$emit('prevPage', 'citas')" :disabled="currentPageCitas === 1">
                Anterior
              </button>
              <span>{{ currentPageCitas }} de {{ totalCitasPages }}</span>
              <button
                @click="$emit('nextPage', 'citas')"
                :disabled="currentPageCitas === totalCitasPages"
              >
                Siguiente
              </button>
            </div>
          </div>
          <ul class="upcoming-list">
            <li v-for="cita in paginatedCitas" :key="cita.id">
              <span class="upcoming-time">
                {{
                  new Date(cita.fechaHora).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
              </span>
              <span class="upcoming-patient">{{ cita.nombrePaciente }}</span>
            </li>
            <li v-if="!paginatedCitas.length">No hay consultas pendientes.</li>
          </ul>
        </div>
      </div>

      <div class="card edit-profile-card">
        <h4>Actualizar Información Personal</h4>
        <form @submit.prevent="$emit('actualizarPerfil')" class="profile-form">
          <div class="form-group">
            <label>Cédula</label>
            <p class="readonly-field">{{ medicoInfo.cedula || '...' }}</p>
          </div>
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              :value="medicoEditable.nombre"
              @input="
                $emit('update:medicoEditable', {
                  ...medicoEditable,
                  nombre: ($event.target as HTMLInputElement).value,
                })
              "
              required
              maxlength="40"
            />
          </div>
          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              :value="medicoEditable.apellido"
              @input="
                $emit('update:medicoEditable', {
                  ...medicoEditable,
                  apellido: ($event.target as HTMLInputElement).value,
                })
              "
              required
              maxlength="40"
            />
          </div>
          <div class="form-group">
            <label for="password">Nueva Contraseña</label>
            <input
              type="password"
              id="password"
              :value="medicoEditable.password"
              @input="
                $emit('update:medicoEditable', {
                  ...medicoEditable,
                  password: ($event.target as HTMLInputElement).value,
                })
              "
              placeholder="Mínimo 6 caracteres"
            />
            <div v-if="medicoEditable.password" class="password-strength-meter">
              <div class="strength-bar" :class="passwordStrength.className"></div>
            </div>
            <p
              v-if="medicoEditable.password"
              class="strength-text"
              :class="passwordStrength.className"
            >
              {{ passwordStrength.text }}
            </p>
          </div>
          <button type="submit" class="btn-primary full-width">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MedicoInfo, MedicoEditable, PasswordStrength, Consulta } from '@/types/medicoPortal'

defineProps<{
  medicoInfo: Partial<MedicoInfo>
  medicoEditable: MedicoEditable
  passwordStrength: PasswordStrength
  paginatedCitas: Consulta[]
  currentPageCitas: number
  totalCitasPages: number
}>()

defineEmits(['update:medicoEditable', 'actualizarPerfil', 'prevPage', 'nextPage'])
</script>
