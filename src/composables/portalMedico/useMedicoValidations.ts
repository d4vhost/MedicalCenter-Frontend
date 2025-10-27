// src/composables/portalMedico/useMedicoValidations.ts
import { computed, reactive, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/medicoPortal'
import { validarCedulaEcuador } from '@/utils/validationUtils'
import apiClient from '@/services/api' // Asegúrate que la ruta es correcta

// Estado reactivo COMPARTIDO para la validación de cédula
// Lo exportamos para que el componente modal pueda usarlo
export const cedulaValidationState = reactive({
  isValid: false,
  isInUse: false,
  loading: false,
  message: '',
})

export function useMedicoValidations(passwordRef: Ref<string | undefined>) {
  // Función para validar cédula (incluye llamada API)
  // Modifica el estado reactivo compartido 'cedulaValidationState'
  const validateCedula = async (cedula: string, currentPacienteId?: number): Promise<void> => {
    cedulaValidationState.loading = true
    cedulaValidationState.message = ''
    cedulaValidationState.isValid = false
    cedulaValidationState.isInUse = false

    // 1. Verificar formato básico (10 dígitos)
    if (!/^\d{10}$/.test(cedula)) {
      cedulaValidationState.loading = false
      cedulaValidationState.message = 'DEBE TENER 10 DÍGITOS NUMÉRICOS.'
      return
    }

    // 2. Validación de algoritmo
    const isValidAlgorithm = validarCedulaEcuador(cedula)
    if (!isValidAlgorithm) {
      cedulaValidationState.loading = false
      cedulaValidationState.isValid = false
      cedulaValidationState.message = 'CÉDULA INVÁLIDA SEGÚN ALGORITMO.'
      return
    }

    // Si el algoritmo es válido, marcamos como válida,
    // y luego verificamos si está en uso.
    cedulaValidationState.isValid = true

    // 3. Verificar si ya está registrada (llamada API)
    try {
      const token = localStorage.getItem('authToken')
      if (!token) throw new Error('NO AUTENTICADO')

      // Endpoint para verificar si existe un PACIENTE con esa cédula
      // ¡Asegúrate que este endpoint exista en tu backend!
      const response = await apiClient.get<{ id: number }>(`/Pacientes/existe/${cedula}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Si la API encuentra la cédula (response.data existe)
      if (response.data && response.data.id) {
        // Y el ID encontrado es DIFERENTE al del paciente que estamos editando
        if (response.data.id !== currentPacienteId) {
          cedulaValidationState.isInUse = true
          cedulaValidationState.message = 'ESA CÉDULA YA ESTÁ REGISTRADA. INTENTE CON OTRA'
        } else {
          // El ID es el mismo, es la cédula del paciente actual. Está disponible.
          cedulaValidationState.isInUse = false
          cedulaValidationState.message = 'Cédula disponible'
        }
      } else {
        // Esto no debería pasar si la API devuelve 404 en lugar de data vacía,
        // pero por si acaso, la marcamos como disponible.
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula disponible'
      }
    } catch (error: unknown) {
      // Manejar errores de API
      let status = 0
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = (error as { response?: { status?: number } }).response
        status = responseError?.status ?? 0
      }

      if (status === 404) {
        // 404 significa que la cédula NO existe, por lo tanto, está disponible.
        cedulaValidationState.isInUse = false
        cedulaValidationState.message = 'Cédula disponible'
      } else {
        // Otros errores de API (500, red caída, etc.)
        // No podemos confirmar si está en uso, pero la cédula ES válida por algoritmo.
        cedulaValidationState.isInUse = false
        // Mostramos un error genérico de verificación
        cedulaValidationState.message = 'ERROR AL VERIFICAR CÉDULA. INTENTE MÁS TARDE.'
        console.error('API error checking cedula:', error)
      }
    } finally {
      cedulaValidationState.loading = false
    }
  }

  // --- Resto de funciones del composable (sin cambios) ---
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
    validateCedula, // Exportar la función de validación actualizada
  }
}
