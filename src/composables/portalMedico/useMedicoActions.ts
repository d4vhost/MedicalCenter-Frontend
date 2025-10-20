// src/composables/portalMedico/useMedicoActions.ts
import apiClient from '@/services/api'
import { ref, type Ref } from 'vue'
import type {
  MedicoEditable,
  PacienteEditable,
  ConsultaEditable,
  DiagnosticoEditable,
  PrescripcionNueva,
  MedicamentoEditable,
  MedicoInfo,
  Medico,
} from '@/types/medicoPortal'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { useMedicoValidations } from './useMedicoValidations'

interface EmpleadoUpdatePayload {
  cedula: string
  nombre: string
  apellido: string
  rol: string | undefined | null
  centroMedicoId: number | undefined | null
  password?: string
}

export function useMedicoActions(
  medico: Ref<Medico>,
  medicoInfo: Ref<Partial<MedicoInfo>>,
  cargarDatosIniciales: () => Promise<void>,
  cerrarModalFinalizarConsulta: () => void,
  cerrarModalNuevoPaciente: () => void,
  cerrarModalHistorialPaciente: () => void,
  cerrarModalMedicamento: () => void,
  cerrarModalNuevaConsulta: () => void,
) {
  const router = useRouter()
  const { validateCedula } = useMedicoValidations(ref(undefined))

  const getToken = (): string | null => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('Acción API fallida: No hay token.')
      logoutAction()
    }
    return token
  }

  const guardarDiagnosticoYPrescripciones = async (
    diagnosticoData: DiagnosticoEditable,
    prescripcionesData: PrescripcionNueva[],
  ) => {
    const token = getToken()
    const diagnosticoTrimmed = diagnosticoData.enfermedadNombre?.trim().toUpperCase() // MAYÚSCULAS
    const observacionesTrimmed = diagnosticoData.observaciones?.trim().toUpperCase() // MAYÚSCULAS

    if (!token || !diagnosticoTrimmed || !diagnosticoData.consultaId) {
      alert('EL DIAGNÓSTICO ES OBLIGATORIO Y NO PUEDE ESTAR VACÍO.')
      return
    }
    if (prescripcionesData.length === 0) {
      alert('DEBE AGREGAR AL MENOS UNA PRESCRIPCIÓN.')
      return
    }
    const wordCount = diagnosticoTrimmed.split(/\s+/).filter(Boolean).length
    if (wordCount > 50) {
      alert('EL DIAGNÓSTICO NO PUEDE EXCEDER LAS 50 PALABRAS.')
      return
    }

    try {
      const diagnosticoPayload = {
        ...diagnosticoData,
        enfermedadNombre: diagnosticoTrimmed, // Enviar valor limpio y en mayúsculas
        observaciones: observacionesTrimmed || undefined, // Enviar undefined si está vacío
      }
      const responseDiag = await apiClient.post('/Diagnosticos', diagnosticoPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const diagnosticoId = responseDiag.data.id

      for (const pres of prescripcionesData) {
        const prescripcionPayload = {
          diagnosticoId: diagnosticoId,
          medicamentoId: pres.medicamentoId,
          indicaciones: pres.indicaciones.trim().toUpperCase(), // MAYÚSCULAS
        }
        // Validar longitud indicaciones (ya está en el modal, pero doble check)
        if (prescripcionPayload.indicaciones.length > 100) {
          alert(`Las indicaciones para "${pres.nombreMedicamento}" exceden los 100 caracteres.`)
          return // Detener si una prescripción es inválida
        }
        await apiClient.post('/Prescripciones', prescripcionPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      alert('CONSULTA GUARDADA CON ÉXITO.')
      cerrarModalFinalizarConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al guardar consulta:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL GUARDAR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO GUARDAR LA INFORMACIÓN DE LA CONSULTA.')
      }
    }
  }

  const actualizarPerfil = async (editableData: MedicoEditable) => {
    const token = getToken()
    if (!medico.value.empleadoId || !token) {
      alert('NO SE PUDO IDENTIFICAR AL MÉDICO PARA ACTUALIZAR.')
      return
    }

    const nombreLimpio = editableData.nombre.trim().toUpperCase() // MAYÚSCULAS
    const apellidoLimpio = editableData.apellido.trim().toUpperCase() // MAYÚSCULAS
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nombreLimpio) || !/^[A-ZÁÉÍÓÚÑ\s]+$/.test(apellidoLimpio)) {
      alert('EL NOMBRE Y EL APELLIDO SOLO DEBEN CONTENER LETRAS Y ESPACIOS.')
      return
    }
    if (editableData.password && editableData.password.length < 6) {
      alert('LA NUEVA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES.')
      return
    }

    try {
      const { data: empleadoActual } = await apiClient.get<{
        cedula: string
        rol: string | null
        centroMedicoId: number | null
      }>(`/Empleados/${medico.value.empleadoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const payload: EmpleadoUpdatePayload = {
        cedula: empleadoActual.cedula,
        nombre: nombreLimpio, // Enviar en mayúsculas
        apellido: apellidoLimpio, // Enviar en mayúsculas
        rol: empleadoActual.rol,
        centroMedicoId: empleadoActual.centroMedicoId,
      }
      if (editableData.password) {
        payload.password = editableData.password
      }

      await apiClient.put(`/Empleados/${medico.value.empleadoId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('PERFIL ACTUALIZADO CON ÉXITO')
      editableData.password = ''
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      alert('NO SE PUDO ACTUALIZAR EL PERFIL.')
    }
  }

  const crearPaciente = async (pacienteData: PacienteEditable) => {
    const token = getToken()
    if (!token || !pacienteData.cedula || !pacienteData.nombre || !pacienteData.apellido) {
      alert('LOS CAMPOS CÉDULA, NOMBRE Y APELLIDO SON OBLIGATORIOS.')
      return
    }
    const nombreLimpio = pacienteData.nombre.trim().toUpperCase() // MAYÚSCULAS
    const apellidoLimpio = pacienteData.apellido.trim().toUpperCase() // MAYÚSCULAS
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nombreLimpio) || !/^[A-ZÁÉÍÓÚÑ\s]+$/.test(apellidoLimpio)) {
      alert('EL NOMBRE Y EL APELLIDO SOLO DEBEN CONTENER LETRAS Y ESPACIOS.')
      return
    }
    const { isValid, isInUse, message } = await validateCedula(pacienteData.cedula)
    if (!isValid || isInUse) {
      alert(message || 'LA CÉDULA NO ES VÁLIDA O YA ESTÁ EN USO.')
      return
    }

    const payload: Partial<PacienteEditable> = {
      cedula: pacienteData.cedula,
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      fechaNacimiento: pacienteData.fechaNacimiento || undefined,
      direccion: pacienteData.direccion?.trim().toUpperCase() || undefined, // MAYÚSCULAS
    }

    try {
      await apiClient.post('/Pacientes', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('PACIENTE CREADO CON ÉXITO')
      cerrarModalNuevoPaciente()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al crear paciente:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO CREAR EL PACIENTE. VERIFIQUE LA INFORMACIÓN.')
      }
    }
  }

  const actualizarPaciente = async (pacienteData: PacienteEditable) => {
    const token = getToken()
    if (!token || !pacienteData.id) {
      alert('NO SE PUDO IDENTIFICAR AL PACIENTE PARA ACTUALIZAR.')
      return
    }
    if (!pacienteData.cedula || !pacienteData.nombre || !pacienteData.apellido) {
      alert('LOS CAMPOS CÉDULA, NOMBRE Y APELLIDO SON OBLIGATORIOS.')
      return
    }
    const nombreLimpio = pacienteData.nombre.trim().toUpperCase() // MAYÚSCULAS
    const apellidoLimpio = pacienteData.apellido.trim().toUpperCase() // MAYÚSCULAS
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nombreLimpio) || !/^[A-ZÁÉÍÓÚÑ\s]+$/.test(apellidoLimpio)) {
      alert('EL NOMBRE Y EL APELLIDO SOLO DEBEN CONTENER LETRAS Y ESPACIOS.')
      return
    }
    // Opcional: Validar cédula si cambió...

    const payload: Partial<PacienteEditable> = {
      id: pacienteData.id,
      cedula: pacienteData.cedula,
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      fechaNacimiento: pacienteData.fechaNacimiento || undefined,
      direccion: pacienteData.direccion?.trim().toUpperCase() || undefined, // MAYÚSCULAS
    }

    try {
      await apiClient.put(`/Pacientes/${pacienteData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('PACIENTE ACTUALIZADO CON ÉXITO')
      cerrarModalHistorialPaciente()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al actualizar paciente:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO ACTUALIZAR EL PACIENTE.')
      }
    }
  }

  const eliminarPaciente = async (pacienteId: number | undefined) => {
    if (!pacienteId) return
    if (
      !confirm(
        '¿ESTÁ SEGURO DE ELIMINAR A ESTE PACIENTE? ESTA ACCIÓN ELIMINARÁ TAMBIÉN SUS CONSULTAS, DIAGNÓSTICOS Y PRESCRIPCIONES ASOCIADAS.',
      )
    )
      return

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/Pacientes/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('PACIENTE Y SU HISTORIAL ASOCIADO ELIMINADOS CON ÉXITO.')
      cerrarModalHistorialPaciente()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al eliminar paciente:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ELIMINAR: ${error.response.data as string}`)
      } else {
        alert('OCURRIÓ UN ERROR INESPERADO AL INTENTAR ELIMINAR EL PACIENTE.')
      }
    }
  }

  const guardarMedicamento = async (medicamentoData: MedicamentoEditable, esEdicion: boolean) => {
    const token = getToken()
    const nombreGenericoTrimmed = medicamentoData.nombreGenerico?.trim().toUpperCase() // MAYÚSCULAS
    if (!token || !nombreGenericoTrimmed) {
      alert('EL NOMBRE GENÉRICO DEL MEDICAMENTO ES OBLIGATORIO.')
      return
    }

    const payload = {
      ...medicamentoData,
      nombreGenerico: nombreGenericoTrimmed,
      nombreComercial: medicamentoData.nombreComercial?.trim().toUpperCase() || undefined, // MAYÚSCULAS
      laboratorio: medicamentoData.laboratorio?.trim().toUpperCase() || undefined, // MAYÚSCULAS
    }

    try {
      if (esEdicion) {
        if (!payload.id) {
          alert('ERROR: NO SE PUDO IDENTIFICAR EL MEDICAMENTO PARA EDITAR.')
          return
        }
        await apiClient.put(`/Medicamentos/${payload.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert('MEDICAMENTO ACTUALIZADO CON ÉXITO.')
      } else {
        await apiClient.post('/Medicamentos', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert('MEDICAMENTO CREADO CON ÉXITO.')
      }
      cerrarModalMedicamento()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al guardar medicamento:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO GUARDAR EL MEDICAMENTO.')
      }
    }
  }

  const eliminarMedicamento = async (medicamentoId: number | undefined) => {
    if (!medicamentoId) return
    if (
      !confirm(
        '¿ESTÁ SEGURO DE ELIMINAR ESTE MEDICAMENTO? NO PODRÁ SER USADO EN FUTURAS PRESCRIPCIONES.',
      )
    )
      return

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/Medicamentos/${medicamentoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('MEDICAMENTO ELIMINADO CON ÉXITO.')
      cerrarModalMedicamento()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al eliminar medicamento:', error)
      if (isAxiosError(error) && error.response?.status === 400 /* o 409 */) {
        alert(
          'NO SE PUDO ELIMINAR EL MEDICAMENTO. PUEDE ESTAR REFERENCIADO EN PRESCRIPCIONES EXISTENTES.',
        )
      } else if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ELIMINAR: ${error.response.data as string}`)
      } else {
        alert('OCURRIÓ UN ERROR INESPERADO AL INTENTAR ELIMINAR EL MEDICAMENTO.')
      }
    }
  }

  const crearConsulta = async (consultaData: ConsultaEditable) => {
    const token = getToken()
    const motivoTrimmed = consultaData.motivo?.trim().toUpperCase() // MAYÚSCULAS
    if (!token || !consultaData.pacienteId || !motivoTrimmed || !consultaData.fechaHora) {
      alert('FALTAN DATOS PARA CREAR LA CONSULTA (PACIENTE, MOTIVO, FECHA).')
      return
    }

    const payload: Omit<ConsultaEditable, 'medicoId' | 'motivo'> & {
      medicoId: number
      motivo: string
    } = {
      pacienteId: consultaData.pacienteId,
      motivo: motivoTrimmed, // Enviar limpio y en mayúsculas
      fechaHora: consultaData.fechaHora,
      medicoId: medicoInfo.value.id ?? 0,
    }
    if (payload.medicoId === 0) {
      alert('ERROR: NO SE PUDO IDENTIFICAR AL MÉDICO ACTUAL.')
      return
    }

    try {
      await apiClient.post('/ConsultasMedicas', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('CONSULTA CREADA CON ÉXITO')
      cerrarModalNuevaConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al crear la consulta:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO CREAR LA CONSULTA.')
      }
    }
  }

  const logoutAction = () => {
    localStorage.clear()
    router.push('/login')
  }

  return {
    guardarDiagnosticoYPrescripciones,
    actualizarPerfil,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    guardarMedicamento,
    eliminarMedicamento,
    crearConsulta,
    logoutAction,
  }
}
