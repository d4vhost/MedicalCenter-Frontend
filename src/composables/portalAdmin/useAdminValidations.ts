import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/adminPortal' // Importar desde adminPortal
import { validarCedulaEcuador } from '@/utils/validationUtils'
import apiClient from '@/services/api'

export const cedulaValidationState = reactive({
  isValid: false,
  isInUse: false,
  loading: false,
  message: '',
})

export function useAdminValidations(passwordRef: Ref<string | undefined>) {
  const validateCedula = async (
    cedula: string,
    currentEmpleadoId?: number, // Opcional: ID del empleado actual si se está editando
  ): Promise<{ isValid: boolean; isInUse: boolean; message: string }> => {
    cedulaValidationState.loading = true
    cedulaValidationState.message = ''
    cedulaValidationState.isValid = false
    cedulaValidationState.isInUse = false

    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'Debe tener 10 dígitos numéricos.'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    const isValidAlgorithm = validarCedulaEcuador(cedula)
    cedulaValidationState.isValid = isValidAlgorithm

    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'Cédula inválida según algoritmo.'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No autenticado')

      const response = await apiClient.get<{ id: number }>(`/Empleados/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data && response.data.id !== currentEmpleadoId) {
        cedulaValidationState.isInUse = true
        cedulaValidationState.message = 'Cédula ya registrada para otro empleado.'
      } else {
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula válida y disponible.'
      }
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = (error as { response?: { status?: number } }).response
        if (responseError && responseError.status === 404) {
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'Cédula válida y disponible.'
        } else {
          cedulaValidationState.message = 'Error al verificar disponibilidad.'
          console.error('API error checking cedula:', error)
        }
      } else {
        cedulaValidationState.message = 'Error al verificar disponibilidad.'
        console.error('Non-API error checking cedula:', error)
      }
    } finally {
      cedulaValidationState.loading = false
    }

    return {
      isValid: cedulaValidationState.isValid,
      isInUse: cedulaValidationState.isInUse,
      message: cedulaValidationState.message,
    }
  }

  const passwordStrength = computed((): PasswordStrength => {
    const pass = passwordRef.value || ''
    let score = 0
    if (pass.length >= 6) score++ // Mínimo 6 caracteres
    if (pass.length >= 8) score++ // Mejor si tiene 8
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++ // Mayúsculas y minúsculas
    if (/\d/.test(pass)) score++ // Números
    if (/[^A-Za-z0-9]/.test(pass)) score++ // Símbolos

    if (score < 2) return { text: 'MUY DÉBIL', className: 'strength-weak' }
    if (score === 2) return { text: 'DÉBIL', className: 'strength-weak' }
    if (score === 3) return { text: 'ACEPTABLE', className: 'strength-medium' }
    if (score === 4) return { text: 'FUERTE', className: 'strength-strong' }
    return { text: 'MUY FUERTE', className: 'strength-strong' } // score = 5
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
    const upperCaseValue = cleanedValue.toUpperCase()
    if (input.value !== upperCaseValue) {
      input.value = upperCaseValue
    }
    return upperCaseValue
  }

  return {
    passwordStrength,
    validateCedula,
    handleNumericInput,
    handleLettersInput,
  }
}
