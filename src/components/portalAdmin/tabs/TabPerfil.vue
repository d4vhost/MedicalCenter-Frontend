<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Mi Perfil</h2>
    </div>

    <div class="profile-grid">
      <div class="card profile-card">
        <div class="profile-avatar">
          {{ adminInfo.nombreCompleto?.charAt(0).toUpperCase() }}
        </div>
        <h3>{{ adminInfo.nombreCompleto }}</h3>
        <p>{{ adminInfo.rol }}</p>
        <p>{{ adminInfo.nombreCentroMedico }}</p>
      </div>

      <div class="card edit-profile-card">
        <h4>Actualizar Información Personal</h4>
        <form @submit.prevent="$emit('actualizarPerfil', adminEditable)" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre *</label>
              <input
                :value="adminEditable.nombre"
                @input="updateAdminEditable('nombre', ($event.target as HTMLInputElement).value)"
                type="text"
                required
              />
            </div>
            <div class="form-group">
              <label>Apellido *</label>
              <input
                :value="adminEditable.apellido"
                @input="updateAdminEditable('apellido', ($event.target as HTMLInputElement).value)"
                type="text"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label>Cédula *</label>
            <input
              :value="adminEditable.cedula"
              @input="updateAdminEditable('cedula', ($event.target as HTMLInputElement).value)"
              type="text"
              maxlength="10"
              required
            />
          </div>

          <div class="form-group">
            <label>Centro Médico *</label>
            <select
              :value="adminEditable.centroMedicoId"
              @change="
                updateAdminEditable(
                  'centroMedicoId',
                  parseInt(($event.target as HTMLSelectElement).value),
                )
              "
              required
            >
              <option value="">Seleccione un centro</option>
              <option v-for="centro in centrosMedicos" :key="centro.id" :value="centro.id">
                {{ centro.nombre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Nueva Contraseña (opcional)</label>
            <input
              :value="adminEditable.password"
              @input="updateAdminEditable('password', ($event.target as HTMLInputElement).value)"
              type="password"
              placeholder="Dejar en blanco para mantener la actual"
            />
            <div v-if="adminEditable.password" class="password-strength-meter">
              <div class="strength-bar" :class="passwordStrength.className"></div>
            </div>
            <p
              v-if="adminEditable.password"
              class="strength-text"
              :class="passwordStrength.className"
            >
              {{ passwordStrength.text.toUpperCase() }}
            </p>
          </div>

          <button type="submit" class="btn-primary full-width">Actualizar Perfil</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { AdminInfo, AdminEditable, CentroMedico, PasswordStrength } from '@/types/adminPortal' // Keep this import
import { useAdminValidations } from '@/composables/portalAdmin/useAdminValidations'

const props = defineProps<{
  adminInfo: Partial<AdminInfo>
  adminEditable: AdminEditable
  centrosMedicos: CentroMedico[]
}>()

const emit = defineEmits(['update:adminEditable', 'actualizarPerfil'])

const passwordRef = computed(() => props.adminEditable.password)
// Explicitly type passwordStrength here
const { passwordStrength }: { passwordStrength: ComputedRef<PasswordStrength> } =
  useAdminValidations(passwordRef)

const updateAdminEditable = (field: keyof AdminEditable, value: string | number | undefined) => {
  let processedValue = value
  if (field === 'nombre' || field === 'apellido') {
    processedValue = String(value || '').toUpperCase()
  } else if (field === 'cedula') {
    processedValue = String(value || '')
      .replace(/\D/g, '')
      .slice(0, 10)
  } else if (field === 'centroMedicoId' && value !== undefined && value !== null) {
    processedValue = Number(value)
  }
  emit('update:adminEditable', {
    ...props.adminEditable,
    [field]: processedValue,
  })
}

// Need to import ComputedRef
import type { ComputedRef } from 'vue'
</script>
