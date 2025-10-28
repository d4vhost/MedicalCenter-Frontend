// src/composables/portalMedico/useMedicoValidations.ts
import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/medicoPortal' // Asegúrate que PasswordStrength está exportado aquí
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

    // 2. Validación de algoritmo
    const isValidAlgorithmCheck = validarCedulaEcuador(cedula)
    cedulaValidationState.isValidAlgorithm = isValidAlgorithmCheck // Actualiza estado del algoritmo

    if (!isValidAlgorithmCheck) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA.'
      return
    }

    // 3. Si el algoritmo es válido, verificar si ya está registrada (llamada API)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')

      // CAMBIO AQUÍ: Usamos la ruta que devuelve el ID
      const response = await apiClient.get<{ id: number }>(`/Pacientes/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Cédula encontrada en la BD
      if (response.data && response.data.id) {
        // Pertenece a OTRO paciente?
        if (response.data.id !== currentPacienteId) {
          cedulaValidationState.isInUse = true
          cedulaValidationState.message = 'ESA CÉDULA YA ESTÁ REGISTRADA!'
        } else {
          // Pertenece al paciente actual (en edición), está bien.
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'Cédula disponible' // Mensaje verde
        }
      } else {
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula disponible' // Mensaje verde
      }
    } catch (error: unknown) {
      // Manejar errores de API
      let status = 0
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = (error as { response?: { status?: number } }).response
        status = responseError?.status ?? 0
      }

      if (status === 404) {
        // 404: La cédula NO existe en la BD, está disponible.
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula disponible' // Mensaje verde
      } else {
        // Otros errores de API: No podemos confirmar disponibilidad.
        cedulaValidationState.isInUse = false // No podemos decir que está en uso
        cedulaValidationState.message = 'ERROR AL VERIFICAR CÉDULA. INTENTE MÁS TARDE.' // Mensaje genérico de error
        console.error('API error checking cedula:', error)
      }
    } finally {
      cedulaValidationState.loading = false
    }
  }

  // --- Resto de funciones (passwordStrength, handleNumericInput, handleLettersInput) sin cambios ---
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
