export interface Empleado {
  id: number
  cedula: string
  nombre: string
  apellido: string
  password?: string
  rol: string
  centroMedicoId: number
  nombreCentroMedico: string
}

export interface Medico {
  id: number
  empleadoId: number
  especialidadId: number
}

export interface Paciente {
  id: number
  cedula: string
  nombre: string
  apellido: string
  fechaNacimiento?: string
  direccion?: string
}

export interface CentroMedico {
  id: number
  nombre: string
  direccion?: string
}

export interface Especialidad {
  id: number
  nombre: string
}

export interface Medicamento {
  id: number
  nombreGenerico: string
  nombreComercial?: string
  laboratorio?: string
}

export interface Consulta {
  id: number
  pacienteId: number
  medicoId: number
  fechaHora: string
  motivo?: string
}

export interface Diagnostico {
  id: number
  consultaId: number
  enfermedadNombre: string
  observaciones?: string
}

export interface DecodedToken {
  sub: string
  role: string
  given_name: string
}

export interface AdminInfo {
  id: number
  nombreCompleto: string
  rol: string
  cedula: string
  nombreCentroMedico: string
  centroMedicoId?: number
}

export interface AdminEditable {
  nombre: string
  apellido: string
  password?: string
  cedula?: string
  centroMedicoId?: number
}

export interface MedicoDetallado extends Empleado {
  medicoId: number
  especialidadId: number
  especialidadNombre: string
}

export interface PacienteConEstado extends Paciente {
  isDiagnosed: boolean
}

export interface PasswordStrength {
  text: string
  className: string
}
