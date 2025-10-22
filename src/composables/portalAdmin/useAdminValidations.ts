// src/composables/portalAdmin/useAdminValidations.ts
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

    // 1. Basic format check (10 digits)
    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      // *** UPDATED MESSAGE (RED) ***
      cedulaValidationState.message = 'CÉDULA INVÁLIDA' // Consolidated invalid message
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    // 2. Algorithm validation
    const isValidAlgorithm = validarCedulaEcuador(cedula)
    cedulaValidationState.isValid = isValidAlgorithm

    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      // *** UPDATED MESSAGE (RED) ***
      cedulaValidationState.message = 'CÉDULA INVÁLIDA' // Consolidated invalid message
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    // 3. Check if already registered (API call)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No autenticado')

      const response = await apiClient.get<{ id: number }>(`/Empleados/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Check if the cédula exists AND belongs to a *different* employee
      if (response.data && response.data.id !== currentEmpleadoId) {
        cedulaValidationState.isInUse = true
        // *** UPDATED MESSAGE (YELLOW) ***
        cedulaValidationState.message = 'ESTA CÉDULA YA SE ENCUENTRA REGISTRADA'
      } else {
        // Cédula is valid and either doesn't exist OR belongs to the current employee being edited
        cedulaValidationState.isInUse = false
        // *** UPDATED MESSAGE (GREEN) ***
        cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
      }
    } catch (error: unknown) {
      // Handle API errors (like 404 Not Found, which means available)
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = (error as { response?: { status?: number } }).response
        if (responseError && responseError.status === 404) {
          // 404 means the cédula doesn't exist, so it's available
          cedulaValidationState.isInUse = false
          // *** UPDATED MESSAGE (GREEN) ***
          cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
        } else {
          // Other API errors
          cedulaValidationState.isValid = false // Mark as invalid on error
          cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD.'
          console.error('API error checking cedula:', error)
        }
      } else {
        // Non-API errors
        cedulaValidationState.isValid = false // Mark as invalid on error
        cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD.'
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
