// src/utils/validationUtils.ts
// The code provided in the previous response is correct for these errors.
// No further changes needed here based on the latest image.

/**
 * Valida una cédula ecuatoriana.
 * Algoritmo basado en módulo 10.
 * @param cedula La cédula a validar (string de 10 dígitos).
 * @returns true si la cédula es válida, false en caso contrario.
 */
export function validarCedulaEcuador(cedula: string): boolean {
  if (typeof cedula !== 'string' || cedula.length !== 10 || !/^\d+$/.test(cedula)) {
    return false
  }

  const provincia = parseInt(cedula.substring(0, 2), 10)
  if (provincia < 1 || provincia > 24) {
    // Ajustar si es necesario
    return false
  }

  // Added ! assertion, TypeScript now knows cedula[2] is not undefined
  const tercerDigito = parseInt(cedula[2]!, 10)
  if (tercerDigito >= 6) {
    return false
  }

  const digitos = cedula.split('').map(Number)
  const verificador = digitos.pop()

  if (verificador === undefined) {
    return false
  }

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let suma = 0

  for (let i = 0; i < 9; i++) {
    const digitoActual = digitos[i]
    if (digitoActual === undefined) return false

    // Added ! assertion, TypeScript now knows digitoActual and coeficientes[i] are not undefined
    let producto = digitoActual * coeficientes[i]!
    if (producto >= 10) {
      producto -= 9
    }
    suma += producto
  }

  const residuo = suma % 10
  const digitoVerificadorCalculado = residuo === 0 ? 0 : 10 - residuo

  return digitoVerificadorCalculado === verificador
}
