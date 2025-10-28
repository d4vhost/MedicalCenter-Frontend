<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>MI PERFIL</h2>
    </div>

    <div class="profile-grid">
      <div class="card profile-card">
        <div class="profile-avatar">
          {{ adminInfo.nombreCompleto?.charAt(0)?.toUpperCase() || '?' }}
        </div>
        <h3>{{ adminInfo.nombreCompleto }}</h3>
        <p>{{ adminInfo.rol }}</p>
        <p>{{ adminInfo.nombreCentroMedico }}</p>
      </div>

      <div class="card edit-profile-card">
        <h4>ACTUALIZAR INFORMACIÓN PERSONAL</h4>
        <form @submit.prevent="$emit('actualizarPerfil', adminEditable)" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre *</label>
              <input
                :value="adminEditable.nombre"
                @input="updateAdminEditable('nombre', handleLettersInput($event, 25))"
                type="text"
                required
                maxlength="25"
              />
            </div>
            <div class="form-group">
              <label>Apellido *</label>
              <input
                :value="adminEditable.apellido"
                @input="updateAdminEditable('apellido', handleLettersInput($event, 25))"
                type="text"
                required
                maxlength="25"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Cédula *</label>
            <input
              :value="adminEditable.cedula"
              @input="updateAdminEditable('cedula', handleNumericInput($event, 10))"
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
              placeholder="DEJAR EN BLANCO PARA MANTENER LA ACTUAL"
              maxlength="30"
              minlength="6"
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

          <button type="submit" class="btn-primary full-width">ACTUALIZAR PERFIL</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import type { AdminInfo, AdminEditable, CentroMedico, PasswordStrength } from '@/types/adminPortal'
// IMPORTAR las funciones de validación
import { useAdminValidations } from '@/composables/portalAdmin/useAdminValidations'

const props = defineProps<{
  adminInfo: Partial<AdminInfo>
  adminEditable: AdminEditable
  centrosMedicos: CentroMedico[]
}>()

const emit = defineEmits(['update:adminEditable', 'actualizarPerfil'])

const passwordRef = computed(() => props.adminEditable.password)
// OBTENER las funciones de validación
const {
  passwordStrength,
  handleNumericInput,
  handleLettersInput,
}: {
  passwordStrength: ComputedRef<PasswordStrength>
  handleNumericInput: (event: Event, maxLength: number) => string
  handleLettersInput: (event: Event, maxLength: number) => string
} = useAdminValidations(passwordRef)

// Función de actualización simplificada, ya que la validación se hace en el @input
const updateAdminEditable = (
  field: keyof AdminEditable,
  processedValue: string | number | undefined,
) => {
  // Lógica para IDs
  if (
    field === 'centroMedicoId' &&
    processedValue !== undefined &&
    processedValue !== null &&
    processedValue !== ''
  ) {
    const parsedInt = parseInt(String(processedValue), 10)
    if (!isNaN(parsedInt)) {
      processedValue = parsedInt
    } else {
      processedValue = undefined
      console.warn(`Invalid non-numeric value passed for ${field}: ${processedValue}`)
    }
  }
  // No necesitamos procesar nombre, apellido o cédula aquí

  emit('update:adminEditable', {
    ...props.adminEditable,
    [field]: processedValue,
  })
}
</script>
