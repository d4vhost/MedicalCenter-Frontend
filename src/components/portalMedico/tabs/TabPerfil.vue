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
          <p>{{ medicoInfo.especialidad || 'ESPECIALIDAD NO DEFINIDA' }}</p>
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
              <span style="font-weight: bold; color: #2c3e50; margin-right: 10px">
                {{ new Date(consulta.fechaHora).toLocaleDateString('es-ES') }}
              </span>
              <span class="upcoming-patient">{{ consulta.nombrePaciente }}</span>
              <span class="chip success"> FINALIZADA </span>
            </li>
            <li v-if="!paginatedConsultasPerfil.length">NO HA REALIZADO CONSULTAS AÚN.</li>
          </ul>
        </div>
      </div>

      <div class="card edit-profile-card">
        <h4>INFORMACIÓN PERSONAL</h4>
        <form class="profile-form" @submit.prevent>
          <div class="form-group">
            <label>CÉDULA</label>
            <input
              type="text"
              :value="medicoInfo.cedula || '...'"
              disabled
              readonly
              class="readonly-input"
            />
          </div>
          <div class="form-group">
            <label>NOMBRE</label>
            <input
              type="text"
              :value="medicoInfo.nombre"
              disabled
              readonly
              class="readonly-input"
            />
          </div>
          <div class="form-group">
            <label>APELLIDO</label>
            <input
              type="text"
              :value="medicoInfo.apellido"
              disabled
              readonly
              class="readonly-input"
            />
          </div>

          <div class="info-message">
            <p>
              Para actualizar sus datos personales o contraseña, por favor contacte con la
              administración.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MedicoInfo, MedicoEditable, PasswordStrength, Consulta } from '@/types/medicoPortal'

interface ConsultaConEstado extends Consulta {
  pendiente?: boolean
}

// 👇 CORRECCIÓN: Llamamos a defineProps y defineEmits SIN asignarlos a variables
// ya que no los usamos dentro del bloque <script setup>

defineProps<{
  medicoInfo: Partial<MedicoInfo>
  medicoEditable: MedicoEditable
  passwordStrength: PasswordStrength
  paginatedConsultasPerfil: ConsultaConEstado[]
  currentPageConsultasPerfil: number
  totalPagesConsultasPerfil: number
  totalConsultasRealizadas: number
}>()

defineEmits(['prevPage', 'nextPage'])
</script>

<style scoped>
.readonly-input {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  border: 1px solid #dee2e6;
}

.info-message {
  margin-top: 20px;
  padding: 15px;
  background-color: #e9ecef;
  border-radius: 8px;
  text-align: center;
  color: #495057;
  font-size: 0.9rem;
  border: 1px solid #ced4da;
}
</style>
