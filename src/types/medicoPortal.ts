// Archivo: src/types/medicoPortal.ts

// --- INTERFACES DE DATOS BÁSICOS (Lectura) ---
export interface Medico {
  id: number
  empleadoId: number
  nombreCompleto: string
  especialidadId: number
}

export interface MedicoInfo {
  id: number
  empleadoId: number
  nombreCompleto: string
  especialidad: string
  cedula: string
  nombre: string
  apellido: string
  especialidadId: number
}

export interface Paciente {
  id: number
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento: string
  telefono?: string
  direccion?: string
  email?: string
}

export interface Medicamento {
  id: number
  nombreGenerico: string
  nombreComercial?: string
  laboratorio?: string
}

export interface Consulta {
  id: number
  fechaHora: string
  pacienteId: number
  nombrePaciente: string
  cedulaPaciente: string
  medicoId: number
  nombreMedico: string
  motivo: string
  tieneDiagnostico: boolean
  diagnosticoId?: number
}

export interface Diagnostico {
  id: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
  fechaHora: string
  motivo: string
  prescripciones: PrescripcionGuardada[]
}

export interface PrescripcionGuardada {
  id: number
  diagnosticoId: number
  medicamentoId: number
  nombreMedicamento: string
  indicaciones: string
}

// --- INTERFACES "EDITABLES" (Formularios / Creación / Edición) ---
// Estas son las que te faltaban y causaban el error

export interface PacienteEditable {
  id?: number
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento?: string
  direccion?: string
  telefono?: string
  email?: string
}

export interface MedicoEditable {
  id?: number
  nombre: string
  apellido: string
  password?: string // Opcional, solo si se va a cambiar
}

export interface ConsultaEditable {
  id?: number
  pacienteId: number
  medicoId?: number
  motivo: string
  fechaHora: string
}

export interface DiagnosticoEditable {
  id?: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
}

export interface MedicamentoEditable {
  id?: number
  nombreGenerico: string
  nombreComercial?: string
  laboratorio?: string
}

// --- INTERFACES PARA LÓGICA INTERNA Y COMPONENTES ---

export interface PrescripcionNueva {
  medicamentoId: number
  nombreMedicamento: string
  indicaciones: string
}

// Alias para PrescripcionExistente (usado en ediciones)
export type PrescripcionExistente = PrescripcionGuardada

export interface HistorialPacienteData {
  consultas: Consulta[]
  diagnosticos: Diagnostico[]
  prescripciones: PrescripcionGuardada[]
}

export type HistorialItem = Diagnostico

// --- INTERFAZ DEL TOKEN ---
export interface DecodedToken {
  nameid: string
  given_name: string
  family_name: string
  role: string
  centro_medico_id: string
  [key: string]: string | number | boolean | undefined
}

// --- INTERFAZ PARA VALIDACIÓN DE PASSWORD ---
export interface PasswordStrength {
  text: string
  className: string
}
