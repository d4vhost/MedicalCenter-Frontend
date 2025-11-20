// src/composables/portalMedico/useMedicoValidations.ts
import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/medicoPortal'
import { validarCedulaEcuador } from '@/utils/validationUtils'
import apiClient from '@/services/api'

// Estado reactivo COMPARTIDO para la validación de cédula
export const cedulaValidationState = reactive({
  isValidAlgorithm: false,
  isInUse: false,
  loading: false,
  message: '',
})

export function useMedicoValidations(passwordRef: Ref<string | undefined>) {
  // Función para validar cédula (incluye llamada API)
  const validateCedula = async (cedula: string, currentPacienteId?: number): Promise<void> => {
    // Resetear estado antes de validar
    cedulaValidationState.loading = true
    cedulaValidationState.message = ''
    cedulaValidationState.isValidAlgorithm = false
    cedulaValidationState.isInUse = false

    // 1. Verificar formato básico (10 dígitos)
    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'DEBE TENER 10 DÍGITOS NUMÉRICOS.'
      return
    }

    // 2. Validación de algoritmo (Ecuador)
    const isValidAlgorithmCheck = validarCedulaEcuador(cedula)
    cedulaValidationState.isValidAlgorithm = isValidAlgorithmCheck

    if (!isValidAlgorithmCheck) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA.'
      return
    }

    // 3. Si el algoritmo es válido, verificar si ya está registrada en BD
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')

      // Hacemos la petición. Ahora esperamos { id: number } O null
      const response = await apiClient.get<{ id: number } | null>(`/Pacientes/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Analizamos la respuesta (Backend devuelve 200 OK en ambos casos)

      // CASO A: El paciente EXISTE (response.data tiene un objeto con ID)
      if (response.data && response.data.id) {
        // Verificamos si pertenece a OTRO paciente (conflicto) o al mismo que editamos
        if (response.data.id !== currentPacienteId) {
          cedulaValidationState.isInUse = true
          cedulaValidationState.message = 'ESA CÉDULA YA ESTÁ REGISTRADA!'
        } else {
          // Es el mismo paciente (estamos editando su propio perfil), todo bien.
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'Cédula disponible'
        }
      }
      // CASO B: El paciente NO EXISTE (response.data es null)
      else {
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula disponible'
      }
    } catch (error: unknown) {
      // CASO C: Error real (Servidor caído, sin internet, etc.)
      console.error('Error verificando cédula:', error)
      cedulaValidationState.isInUse = false
      // Mensaje corto para no romper el diseño
      cedulaValidationState.message = 'ERROR DE CONEXIÓN.'
    } finally {
      cedulaValidationState.loading = false
    }
  }

  // --- Resto de funciones auxiliares (sin cambios) ---

  const passwordStrength = computed((): PasswordStrength => {
    const pass = passwordRef.value || ''
    let score = 0
    if (pass.length >= 6) score++
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++

    if (score < 2) return { text: 'MUY DÉBIL', className: 'strength-weak' }
    if (score === 2) return { text: 'DÉBIL', className: 'strength-weak' }
    if (score === 3) return { text: 'ACEPTABLE', className: 'strength-medium' }
    if (score === 4) return { text: 'FUERTE', className: 'strength-strong' }
    return { text: 'MUY FUERTE', className: 'strength-strong' }
  })

  const handleNumericInput = (event: Event, maxLength: number): string => {
    const input = event.target as HTMLInputElement
    const digitsOnly = input.value.replace(/\D/g, '')
    const newValue = digitsOnly.slice(0, maxLength)
    if (input.value !== newValue) {
      input.value = newValue
    }
    return newValue
  }

  const handleLettersInput = (event: Event): string => {
    const input = event.target as HTMLInputElement
    // Permite letras y espacios, elimina caracteres especiales
    const lettersOnly = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
    const cleanedValue = lettersOnly.replace(/\s+/g, ' ').trimStart()
    if (input.value !== cleanedValue) {
      input.value = cleanedValue
    }
    return cleanedValue
  }

  return {
    passwordStrength,
    handleNumericInput,
    handleLettersInput,
    validateCedula,
  }
}
