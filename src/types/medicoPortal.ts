// src/types/medicoPortal.ts

export interface Medico {
  empleadoId: number
  nombreCompleto: string
}

export interface MedicoInfo {
  id: number
  empleadoId: number
  nombreCompleto: string
  nombreEspecialidad: string
  nombreCentroMedico: string
  cedula: string
}

export interface MedicoEditable {
  nombre: string
  apellido: string
  password?: string
}

export interface Consulta {
  id: number
  fechaHora: string
  pacienteId: number
  nombrePaciente: string
  cedulaPaciente?: string
  medicoId: number
  nombreMedico: string
  motivo: string
}

export interface Paciente {
  id: number
  nombre: string
  apellido: string
  cedula: string
  fechaNacimiento?: string // Mantener como string si viene así del API o ajustar en carga
  direccion?: string
}

export interface Medicamento {
  id: number
  nombreGenerico: string
  nombreComercial?: string
  laboratorio?: string
}

export interface Diagnostico {
  id: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
}

export interface PrescripcionNueva {
  medicamentoId: number
  nombreMedicamento: string
  indicaciones: string
}

export interface PrescripcionGuardada extends PrescripcionNueva {
  id: number
  diagnosticoId: number
}

export interface HistorialPacienteData {
  consultas: Consulta[]
  diagnosticos: Diagnostico[]
  prescripciones?: PrescripcionGuardada[] // Asumiendo que la API devuelve esto
}

export interface HistorialItem extends Diagnostico {
  fechaHora: string
  motivo: string
}

export interface DecodedToken {
  sub: string // User ID (empleadoId o pacienteId)
  given_name: string // Nombre
  role?: string // Rol (si existe)
  centroId?: string // Centro ID (si existe)
}

// Para el estado editable en modales
// Changed interfaces to type aliases to satisfy lint rule
export type PacienteEditable = Partial<Paciente>
export interface ConsultaEditable {
  pacienteId: number | null
  medicoId: number
  motivo: string
  fechaHora: string
}
export interface DiagnosticoEditable extends Partial<Omit<Diagnostico, 'id' | 'consultaId'>> {
  consultaId?: number // Puede ser undefined al inicio
}
// Changed interfaces to type aliases to satisfy lint rule
export type MedicamentoEditable = Partial<Medicamento>

// Para la fuerza de la contraseña
export interface PasswordStrength {
  text: string
  className: string
}
