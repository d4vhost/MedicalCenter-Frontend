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
  tieneDiagnostico?: boolean
  diagnosticoId?: number
}

export interface Paciente {
  id: number
  nombre: string
  apellido: string
  cedula: string
  fechaNacimiento?: string
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
  prescripciones?: PrescripcionGuardada[]
}

export interface HistorialItem extends Diagnostico {
  fechaHora: string
  motivo: string
}

export interface DecodedToken {
  sub: string
  given_name: string
  role?: string
  centroId?: string
}

export type PacienteEditable = Partial<Paciente>
export interface ConsultaEditable {
  pacienteId: number | null
  medicoId: number
  motivo: string
  fechaHora: string
}
export interface DiagnosticoEditable extends Partial<Omit<Diagnostico, 'consultaId'>> {
  id?: number
  consultaId?: number
}

export type MedicamentoEditable = Partial<Medicamento>

export interface PrescripcionExistente extends PrescripcionNueva {
  id: number
}
