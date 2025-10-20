import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/medicoPortal'
import { validarCedulaEcuador } from '@/utils/validationUtils'
import apiClient from '@/services/api'

export const cedulaValidationState = reactive({
  isValid: false,
  isInUse: false,
  loading: false,
  message: '',
})

export function useMedicoValidations(passwordRef: Ref<string | undefined>) {
  const validateCedula = async (
    cedula: string,
  ): Promise<{ isValid: boolean; isInUse: boolean; message: string }> => {
    cedulaValidationState.loading = true
    cedulaValidationState.message = ''
    cedulaValidationState.isValid = false
    cedulaValidationState.isInUse = false

    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'DEBE TENER 10 DÍGITOS NUMÉRICOS.'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    const isValidAlgorithm = validarCedulaEcuador(cedula)
    cedulaValidationState.isValid = isValidAlgorithm

    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA SEGÚN ALGORITMO.'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')
      await apiClient.get(`/Pacientes/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      cedulaValidationState.isInUse = true
      cedulaValidationState.message = 'CÉDULA YA REGISTRADA.'
    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const response = (error as { response?: { status?: number } }).response
        if (response && response.status === 404) {
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'CÉDULA VÁLIDA Y DISPONIBLE.'
        } else {
          cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD.'
        }
      } else {
        cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD.'
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
    const upperCaseValue = cleanedValue.toUpperCase()
    if (input.value !== upperCaseValue) {
      input.value = upperCaseValue
    }
    return upperCaseValue
  }

  return {
    passwordStrength,
    handleNumericInput,
    handleLettersInput,
    validateCedula,
  }
}
