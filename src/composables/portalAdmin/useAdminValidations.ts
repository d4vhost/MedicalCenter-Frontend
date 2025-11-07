// src/composables/portalAdmin/useAdminValidations.ts

import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/adminPortal'
import { validarCedulaEcuador } from '@/utils/validationUtils'
import apiClient from '@/services/api'

// Estado reactivo global para la validación de cédula
export const cedulaValidationState = reactive({
  isValid: false,
  isInUse: false,
  loading: false,
  message: '',
})

export function useAdminValidations(passwordRef: Ref<string | undefined>) {
  const validateCedula = async (
    cedula: string,
    currentEmpleadoId?: number,
  ): Promise<{ isValid: boolean; isInUse: boolean; message: string }> => {
    cedulaValidationState.loading = true
    cedulaValidationState.message = ''
    cedulaValidationState.isValid = false
    cedulaValidationState.isInUse = false

    // 1. Verificar formato básico (10 dígitos)
    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    // 2. Validación de algoritmo ecuatoriano
    const isValidAlgorithm = validarCedulaEcuador(cedula)

    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      cedulaValidationState.isValid = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    // 3. Verificar si ya está registrada (llamada al API seguro)
    try {
      // NOTA: Ya no verificamos manualmente el token aquí.
      // El interceptor de Axios en 'apiClient' se encargará de enviarlo.
      // Si falla por autenticación, el bloque 'catch' lo manejará.

      // Llamamos al nuevo endpoint en AuthController
      const response = await apiClient.get<{ id: number }>(`/Auth/CheckCedula/${cedula}`)

      // Si el API devuelve 200 OK, significa que la cédula EXISTE.
      // Verificamos si pertenece a otro empleado (en caso de edición).
      if (response.data && response.data.id !== currentEmpleadoId) {
        cedulaValidationState.isInUse = true
        cedulaValidationState.isValid = true // Es válida, pero está ocupada
        cedulaValidationState.message = 'ESTA CÉDULA YA SE ENCUENTRA REGISTRADA. INTENTE CON OTRA'
      } else {
        // Si es el mismo ID (edición de propio perfil), está bien.
        cedulaValidationState.isInUse = false
        cedulaValidationState.isValid = true
        cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
      }
    } catch (error: unknown) {
      // Si el API devuelve 404 Not Found, significa que la cédula NO existe (está libre).
      interface AxiosError {
        response?: { status: number }
      }
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as AxiosError).response?.status === 404
      ) {
        cedulaValidationState.isInUse = false
        cedulaValidationState.isValid = true
        cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
      } else {
        // Cualquier otro error (401 Unauthorized, 500 Server Error, error de red)
        cedulaValidationState.isValid = false
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD'
        console.error('Error verificando cédula:', error)
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

  // Calculadora de fortaleza de contraseña
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

  // Manejador de input para solo números
  const handleNumericInput = (event: Event, maxLength: number): string => {
    const input = event.target as HTMLInputElement
    const digitsOnly = input.value.replace(/\D/g, '')
    const newValue = digitsOnly.slice(0, maxLength)
    if (input.value !== newValue) {
      input.value = newValue
    }
    return newValue
  }

  // Manejador de input para solo letras
  const handleLettersInput = (event: Event, maxLength: number): string => {
    const input = event.target as HTMLInputElement
    const lettersOnly = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '')
    const cleanedValue = lettersOnly.replace(/\s+/g, ' ').trimStart().slice(0, maxLength)
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
