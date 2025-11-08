// Archivo: src/types/medicoPortal.ts
// --- INTERFACES DE DATOS BÁSICOS ---
export interface Medico {
  empleadoId: number
  nombreCompleto: string
}

export interface MedicoInfo {
  id: number
  empleadoId: number
  nombreCompleto: string
  especialidad: string
  // Asegúrate de que estos campos coincidan con tu DTO de /Medicos
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
  // Añade cualquier otro campo que venga de tu API
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
  // Estos se usan en el historial combinado
  fechaHora: string
  motivo: string
  prescripciones: PrescripcionGuardada[]
}

// --- INTERFACES PARA MODALES Y LÓGICA INTERNA ---
export interface PrescripcionNueva {
  medicamentoId: number
  nombreMedicamento: string
  indicaciones: string
}

export interface PrescripcionGuardada {
  id: number
  diagnosticoId: number
  medicamentoId: number
  nombreMedicamento: string
  indicaciones: string
}

export interface HistorialPacienteData {
  consultas: Consulta[]
  diagnosticos: Diagnostico[]
  prescripciones: PrescripcionGuardada[]
}

export type HistorialItem = Diagnostico // El historial combinado se basa en el Diagnostico

// --- ✨ CORRECCIÓN CRÍTICA DE LA INTERFAZ DEL TOKEN ---
// Esta es la estructura que coincide con tu token real
export interface DecodedToken {
  nameid: string // <-- ✨ ESTE ES EL CAMBIO (de 'sub' a 'nameid')
  given_name: string // (Nombre: NOELIA)
  family_name: string // (Apellido: CRUZ)
  role: string // (Rol: MEDICO)
  centro_medico_id: string // (ID del Centro: 2)
  [key: string]: string | number | boolean | undefined // 👈 CAMBIO AQUÍ
}
