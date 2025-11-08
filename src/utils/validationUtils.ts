// Archivo: src/utils/validationUtils.ts
/**
 * Valida una cédula ecuatoriana usando el algoritmo Módulo 10.
 * @param cedula - La cédula de 10 dígitos como string.
 * @returns true si la cédula es válida, false si no.
 */
export function validarCedulaEcuador(cedula: string): boolean {
  // 1. Verificar longitud
  if (cedula.length !== 10) {
    return false
  }
  // 2. Verificar que todos sean dígitos
  if (!/^\d{10}$/.test(cedula)) {
    return false
  }
  // 3. Verificar código de provincia (01-24 o 30)
  const provincia = parseInt(cedula.substring(0, 2))
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
    return false
  }
  // 4. Verificar tercer dígito (0-5 para personas naturales)
  const tercerDigito = parseInt(cedula.charAt(2)) // 👈 CAMBIO AQUÍ
  if (tercerDigito < 0 || tercerDigito > 5) {
    // Nota: 6 (público) y 9 (jurídico) son para RUCs, no cédulas de persona.
    return false
  }
  // 5. Algoritmo Módulo 10
  const digitos = cedula.split('').map(Number)
  const digitoVerificador = digitos.pop() // Obtener el último dígito
  const suma = digitos.reduce((acc, current, index) => {
    // Coeficientes: 2, 1, 2, 1, 2, 1, 2, 1, 2
    let producto = current * (index % 2 === 0 ? 2 : 1)
    // Si el producto es > 9, se resta 9 (o se suman sus dígitos)
    if (producto > 9) {
      producto -= 9
    }
    return acc + producto
  }, 0)
  // 6. Comparación final
  const decenaSuperior = Math.ceil(suma / 10) * 10
  const resultado = decenaSuperior - suma
  const digitoEsperado = resultado === 10 ? 0 : resultado
  return digitoVerificador === digitoEsperado
}
