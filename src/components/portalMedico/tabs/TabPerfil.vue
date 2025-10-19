<template>
  <div class="tab-content">
    <div class="tab-header"><h2>Panel de Médico</h2></div>
    <div class="profile-grid">
      <div class="profile-left-column">
        <div class="card profile-card">
          <div class="profile-avatar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
              <path d="M12 8v4l2 2" />
              <path d="M9.5 16h5" />
              <path d="M12 18v2" />
              <path d="M16 11h2" />
              <path d="M6 11h2" />
            </svg>
          </div>
          <h3>{{ medicoInfo.nombreCompleto || 'Cargando...' }}</h3>
          <p>{{ medicoInfo.nombreEspecialidad || '...' }}</p>
          <span v-if="medicoInfo.nombreCentroMedico" class="chip">{{
            medicoInfo.nombreCentroMedico
          }}</span>
        </div>
        <div class="card upcoming-card">
          <div class="upcoming-header">
            <h4>Consultas Realizadas ({{ totalConsultasRealizadas }})</h4>
            <div class="pagination-compact" v-if="totalPagesConsultasPerfil > 1">
              <button
                @click="$emit('prevPage', 'consultasPerfil')"
                :disabled="currentPageConsultasPerfil === 1"
              >
                Anterior
              </button>
              <span>{{ currentPageConsultasPerfil }} de {{ totalPagesConsultasPerfil }}</span>
              <button
                @click="$emit('nextPage', 'consultasPerfil')"
                :disabled="currentPageConsultasPerfil === totalPagesConsultasPerfil"
              >
                Siguiente
              </button>
            </div>
          </div>
          <ul class="upcoming-list">
            <li v-for="consulta in paginatedConsultasPerfil" :key="consulta.id">
              <span class="upcoming-time">
                {{
                  new Date(consulta.fechaHora).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                  })
                }}
              </span>
              <span class="upcoming-patient">{{ consulta.nombrePaciente }}</span>
              <span class="chip success"> Finalizada </span>
            </li>
            <li v-if="!paginatedConsultasPerfil.length">No ha realizado consultas aún.</li>
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

// Interfaz extendida para incluir estado pendiente
interface ConsultaConEstado extends Consulta {
  pendiente?: boolean
}

defineProps<{
  medicoInfo: Partial<MedicoInfo>
  medicoEditable: MedicoEditable
  passwordStrength: PasswordStrength
  paginatedConsultasPerfil: ConsultaConEstado[] // Cambiado de paginatedCitas
  currentPageConsultasPerfil: number // Cambiado de currentPageCitas
  totalPagesConsultasPerfil: number // Cambiado de totalCitasPages
  totalConsultasRealizadas: number // Prop para el contador
}>()

defineEmits(['update:medicoEditable', 'actualizarPerfil', 'prevPage', 'nextPage'])
</script>
