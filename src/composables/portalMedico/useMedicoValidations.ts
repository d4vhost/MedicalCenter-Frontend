// src/composables/portalMedico/useMedicoValidations.ts
import { computed, type Ref } from 'vue'
import type { PasswordStrength } from '@/types/medicoPortal'

export function useMedicoValidations(cedulaRef: Ref<string>, passwordRef: Ref<string | undefined>) {
  const isCedulaValida = computed(() => {
    const cedula = cedulaRef.value
    // Validación básica: 10 dígitos numéricos
    // Puedes añadir aquí la validación ecuatoriana completa si la necesitas
    return /^\d{10}$/.test(cedula)
  })

  const passwordStrength = computed((): PasswordStrength => {
    const pass = passwordRef.value || ''
    let score = 0
    if (pass.length >= 6) score++
    if (pass.length >= 8) score++
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++
    if (/\d/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++ // Caracter especial

    if (score < 2) return { text: 'Muy Débil', className: 'strength-weak' }
    if (score === 2) return { text: 'Débil', className: 'strength-weak' }
    if (score === 3) return { text: 'Aceptable', className: 'strength-medium' }
    if (score === 4) return { text: 'Fuerte', className: 'strength-strong' }
    return { text: 'Muy Fuerte', className: 'strength-strong' }
  })

  // Función para manejar solo números en input de cédula (se usa directo en el template)
  const handleCedulaInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    const digitsOnly = input.value.replace(/\D/g, '')
    // Limita a 10 dígitos y actualiza el valor reactivo
    cedulaRef.value = digitsOnly.slice(0, 10)
    // Si el valor del input no coincide (porque se truncó), actualiza el input
    if (input.value !== cedulaRef.value) {
      input.value = cedulaRef.value
    }
  }

  return {
    isCedulaValida,
    passwordStrength,
    handleCedulaInput,
  }
}
