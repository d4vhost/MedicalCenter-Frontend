<template>
  <div class="tab-content">
    <div class="tab-header"><h2>PANEL DE MÉDICO</h2></div>
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
          <h3>{{ medicoInfo.nombreCompleto || 'CARGANDO...' }}</h3>
          <p>{{ medicoInfo.nombreEspecialidad || '...' }}</p>
          <span v-if="medicoInfo.nombreCentroMedico" class="chip">{{
            medicoInfo.nombreCentroMedico
          }}</span>
        </div>
        <div class="card upcoming-card">
          <div class="upcoming-header">
            <h4>CONSULTAS REALIZADAS ({{ totalConsultasRealizadas }})</h4>
            <div class="pagination-compact" v-if="totalPagesConsultasPerfil > 1">
              <button
                @click="$emit('prevPage', 'consultasPerfil')"
                :disabled="currentPageConsultasPerfil === 1"
              >
                &lt;
              </button>
              <span>{{ currentPageConsultasPerfil }} DE {{ totalPagesConsultasPerfil }}</span>
              <button
                @click="$emit('nextPage', 'consultasPerfil')"
                :disabled="currentPageConsultasPerfil === totalPagesConsultasPerfil"
              >
                &gt;
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
              <span class="chip success"> FINALIZADA </span>
            </li>
            <li v-if="!paginatedConsultasPerfil.length">NO HA REALIZADO CONSULTAS AÚN.</li>
          </ul>
        </div>
      </div>

      <div class="card edit-profile-card">
        <h4>ACTUALIZAR INFORMACIÓN PERSONAL</h4>
        <form @submit.prevent="$emit('actualizarPerfil')" class="profile-form">
          <div class="form-group">
            <label>CÉDULA</label>
            <p class="readonly-field">{{ medicoInfo.cedula || '...' }}</p>
          </div>
          <div class="form-group">
            <label for="nombre">NOMBRE</label>
            <input
              type="text"
              id="nombre"
              :value="medicoEditable.nombre"
              @input="handleLettersInputWrapper($event, 'nombre')"
              required
              maxlength="50"
              placeholder="SOLO LETRAS"
            />
          </div>
          <div class="form-group">
            <label for="apellido">APELLIDO</label>
            <input
              type="text"
              id="apellido"
              :value="medicoEditable.apellido"
              @input="handleLettersInputWrapper($event, 'apellido')"
              required
              maxlength="50"
              placeholder="SOLO LETRAS"
            />
          </div>
          <div class="form-group">
            <label for="password">NUEVA CONTRASEÑA</label>
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
              placeholder="MÍNIMO 6 CARACTERES"
              autocomplete="new-password"
            />
            <div v-if="medicoEditable.password" class="password-strength-meter">
              <div class="strength-bar" :class="passwordStrength.className"></div>
            </div>
            <p
              v-if="medicoEditable.password"
              class="strength-text"
              :class="passwordStrength.className"
            >
              {{ passwordStrength.text.toUpperCase() }}
            </p>
          </div>
          <button type="submit" class="btn-primary full-width">GUARDAR CAMBIOS</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MedicoInfo, MedicoEditable, PasswordStrength, Consulta } from '@/types/medicoPortal'
import { useMedicoValidations } from '@/composables/portalMedico/useMedicoValidations'
import { computed } from 'vue'

interface ConsultaConEstado extends Consulta {
  pendiente?: boolean
}

const props = defineProps<{
  medicoInfo: Partial<MedicoInfo>
  medicoEditable: MedicoEditable
  passwordStrength: PasswordStrength
  paginatedConsultasPerfil: ConsultaConEstado[]
  currentPageConsultasPerfil: number
  totalPagesConsultasPerfil: number
  totalConsultasRealizadas: number
}>()

const emit = defineEmits(['update:medicoEditable', 'actualizarPerfil', 'prevPage', 'nextPage'])

const passwordRef = computed(() => props.medicoEditable.password)
const { handleLettersInput } = useMedicoValidations(passwordRef) // Solo necesitamos handleLettersInput

// Wrapper que también convierte a mayúsculas
const handleLettersInputWrapper = (event: Event, field: 'nombre' | 'apellido') => {
  const lettersOnly = handleLettersInput(event)
  const upperCaseValue = lettersOnly.toUpperCase()
  const input = event.target as HTMLInputElement
  if (input.value !== upperCaseValue) {
    input.value = upperCaseValue
  }
  emit('update:medicoEditable', {
    ...props.medicoEditable,
    [field]: upperCaseValue,
  })
}
</script>
