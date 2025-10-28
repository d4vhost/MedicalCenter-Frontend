// src/composables/portalAdmin/useAdminValidations.ts
import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/adminPortal'
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

    // 2. Validación de algoritmo
    const isValidAlgorithm = validarCedulaEcuador(cedula)

    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      cedulaValidationState.isValid = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA'
      return { isValid: false, isInUse: false, message: cedulaValidationState.message }
    }

    // 3. Verificar si ya está registrada (llamada API)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('No autenticado')

      const response = await apiClient.get<{ id: number }>(`/Empleados/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Si la cédula existe Y pertenece a un empleado DIFERENTE
      if (response.data && response.data.id !== currentEmpleadoId) {
        cedulaValidationState.isInUse = true
        cedulaValidationState.isValid = true // La cédula ES válida, pero está en uso
        cedulaValidationState.message = 'ESTA CÉDULA YA SE ENCUENTRA REGISTRADA. INTENTE CON OTRA'
      } else {
        // La cédula es válida y NO existe O pertenece al empleado actual (modo edición)
        cedulaValidationState.isInUse = false
        cedulaValidationState.isValid = true
        cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
      }
    } catch (error: unknown) {
      // Manejar errores de API
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = (error as { response?: { status?: number } }).response
        if (responseError && responseError.status === 404) {
          // 404 significa que la cédula NO existe, está disponible
          cedulaValidationState.isInUse = false
          cedulaValidationState.isValid = true
          cedulaValidationState.message = 'CÉDULA VÁLIDA DISPONIBLE'
        } else {
          // Otros errores de API
          cedulaValidationState.isValid = false
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD'
          console.error('API error checking cedula:', error)
        }
      } else {
        // Errores que no son de API
        cedulaValidationState.isValid = false
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'ERROR AL VERIFICAR DISPONIBILIDAD'
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
    if (pass.length >= 6) score++ // Mínimo 6 caracteres (ya validado en HTML)
    // No limitamos aquí el máximo, se hará en el HTML con maxlength="30"
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

  // Función para manejar entrada numérica (para Cédula)
  const handleNumericInput = (event: Event, maxLength: number): string => {
    const input = event.target as HTMLInputElement
    const digitsOnly = input.value.replace(/\D/g, '') // Elimina no dígitos
    const newValue = digitsOnly.slice(0, maxLength) // Limita a maxLength
    if (input.value !== newValue) {
      input.value = newValue // Actualiza el valor del input si cambió
    }
    return newValue // Retorna el valor procesado
  }

  // NUEVA FUNCIÓN: Manejar entrada de solo letras (para Nombre y Apellido)
  const handleLettersInput = (event: Event, maxLength: number): string => {
    const input = event.target as HTMLInputElement
    // Permite letras, espacios y caracteres acentuados comunes en español
    const lettersOnly = input.value.replace(/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/g, '')
    // Elimina espacios duplicados y espacios al inicio, luego limita la longitud
    const cleanedValue = lettersOnly.replace(/\s+/g, ' ').trimStart().slice(0, maxLength)
    const upperCaseValue = cleanedValue.toUpperCase() // Convertir a mayúsculas
    if (input.value !== upperCaseValue) {
      input.value = upperCaseValue // Actualiza el valor del input si cambió
    }
    return upperCaseValue // Retorna el valor procesado en mayúsculas
  }

  return {
    passwordStrength,
    validateCedula,
    handleNumericInput, // Asegúrate de exportar esta también si no lo estaba
    handleLettersInput, // Exportar la nueva función
  }
}
