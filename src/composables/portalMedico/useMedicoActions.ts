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
  PrescripcionExistente,
} from '@/types/medicoPortal'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
// 👇 1. IMPORTAMOS EL ESTADO COMPARTIDO
import { useMedicoValidations, cedulaValidationState } from './useMedicoValidations'

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
      logoutAction()
    }
    return token
  }

  const guardarDiagnosticoYPrescripciones = async (
    diagnosticoData: DiagnosticoEditable,
    prescripcionesData: PrescripcionNueva[],
  ) => {
    const token = getToken()
    const diagnosticoTrimmed = diagnosticoData.enfermedadNombre?.trim().toUpperCase()
    const observacionesTrimmed = diagnosticoData.observaciones?.trim().toUpperCase()

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
        consultaId: diagnosticoData.consultaId,
        enfermedadNombre: diagnosticoTrimmed,
        observaciones: observacionesTrimmed || undefined,
      }
      const responseDiag = await apiClient.post('/Diagnosticos', diagnosticoPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const diagnosticoId = responseDiag.data.id

      for (const pres of prescripcionesData) {
        const prescripcionPayload = {
          diagnosticoId: diagnosticoId,
          medicamentoId: pres.medicamentoId,
          indicaciones: pres.indicaciones.trim().toUpperCase(),
        }
        if (prescripcionPayload.indicaciones.length > 100) {
          alert(`LAS INDICACIONES PARA "${pres.nombreMedicamento}" EXCEDEN LOS 100 CARACTERES.`)
          await apiClient.delete(`/Diagnosticos/${diagnosticoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          return
        }
        await apiClient.post('/Prescripciones', prescripcionPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      alert('CONSULTA GUARDADA CON ÉXITO.')
      cerrarModalFinalizarConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL GUARDAR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO GUARDAR LA INFORMACIÓN DE LA CONSULTA.')
      }
    }
  }

  const actualizarDiagnosticoYPrescripciones = async (
    diagnosticoData: DiagnosticoEditable,
    prescripcionesNuevas: PrescripcionNueva[],
    prescripcionesExistentes: PrescripcionExistente[],
    prescripcionesIdsParaEliminar: number[],
  ) => {
    const token = getToken()
    const diagnosticoTrimmed = diagnosticoData.enfermedadNombre?.trim().toUpperCase()
    const observacionesTrimmed = diagnosticoData.observaciones?.trim().toUpperCase()

    if (!token || !diagnosticoData.id || !diagnosticoTrimmed || !diagnosticoData.consultaId) {
      alert('FALTAN DATOS OBLIGATORIOS PARA ACTUALIZAR EL DIAGNÓSTICO.')
      return
    }
    if (prescripcionesNuevas.length === 0 && prescripcionesExistentes.length === 0) {
      alert('DEBE HABER AL MENOS UNA PRESCRIPCIÓN.')
      return
    }
    const wordCount = diagnosticoTrimmed.split(/\s+/).filter(Boolean).length
    if (wordCount > 50) {
      alert('EL DIAGNÓSTICO NO PUEDE EXCEDER LAS 50 PALABRAS.')
      return
    }

    try {
      const diagnosticoPayload = {
        id: diagnosticoData.id,
        consultaId: diagnosticoData.consultaId,
        enfermedadNombre: diagnosticoTrimmed,
        observaciones: observacionesTrimmed || undefined,
      }
      await apiClient.put(`/Diagnosticos/${diagnosticoData.id}`, diagnosticoPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const diagnosticoId = diagnosticoData.id

      for (const presId of prescripcionesIdsParaEliminar) {
        await apiClient.delete(`/Prescripciones/${presId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      for (const pres of prescripcionesNuevas) {
        const prescripcionPayload = {
          diagnosticoId: diagnosticoId,
          medicamentoId: pres.medicamentoId,
          indicaciones: pres.indicaciones.trim().toUpperCase(),
        }
        if (prescripcionPayload.indicaciones.length > 100) {
          alert(`LAS INDICACIONES PARA "${pres.nombreMedicamento}" EXCEDEN LOS 100 CARACTERES.`)
          return
        }
        await apiClient.post('/Prescripciones', prescripcionPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }

      alert('CONSULTA ACTUALIZADA CON ÉXITO.')
      cerrarModalFinalizarConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ACTUALIZAR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO ACTUALIZAR LA INFORMACIÓN DE LA CONSULTA.')
      }
    }
  }

  const eliminarDiagnosticoYPrescripciones = async (diagnosticoId: number | undefined) => {
    if (!diagnosticoId) {
      alert('NO SE PUEDE ELIMINAR PORQUE NO HAY DIAGNÓSTICO ASOCIADO.')
      return
    }
    if (
      !confirm(
        '¿ESTÁ SEGURO DE ELIMINAR ESTE DIAGNÓSTICO Y SUS PRESCRIPCIONES? ESTA ACCIÓN NO SE PUEDE DESHACER.',
      )
    ) {
      return
    }

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/Diagnosticos/${diagnosticoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('DIAGNÓSTICO Y PRESCRIPCIONES ELIMINADOS CON ÉXITO.')
      cerrarModalFinalizarConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ELIMINAR: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO ELIMINAR EL DIAGNÓSTICO.')
      }
    }
  }

  const actualizarPerfil = async (editableData: MedicoEditable) => {
    const token = getToken()
    if (!medico.value.empleadoId || !token) {
      alert('NO SE PUDO IDENTIFICAR AL MÉDICO PARA ACTUALIZAR.')
      return
    }

    const nombreLimpio = editableData.nombre.trim().toUpperCase()
    const apellidoLimpio = editableData.apellido.trim().toUpperCase()
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
        nombre: nombreLimpio,
        apellido: apellidoLimpio,
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
    } catch {
      alert('NO SE PUDO ACTUALIZAR EL PERFIL.')
    }
  }

  const crearPaciente = async (pacienteData: PacienteEditable) => {
    const token = getToken()
    if (!token || !pacienteData.cedula || !pacienteData.nombre || !pacienteData.apellido) {
      alert('LOS CAMPOS CÉDULA, NOMBRE Y APELLIDO SON OBLIGATORIOS.')
      return
    }
    const nombreLimpio = pacienteData.nombre.trim().toUpperCase()
    const apellidoLimpio = pacienteData.apellido.trim().toUpperCase()

    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nombreLimpio) || !/^[A-ZÁÉÍÓÚÑ\s]+$/.test(apellidoLimpio)) {
      alert('EL NOMBRE Y EL APELLIDO SOLO DEBEN CONTENER LETRAS Y ESPACIOS.')
      return
    }

    // 👇 2. CORRECCIÓN AQUÍ: Ejecutamos la validación y leemos el estado compartido
    await validateCedula(pacienteData.cedula)

    // Verificamos el estado (isValidAlgorithm es el nombre nuevo)
    if (!cedulaValidationState.isValidAlgorithm || cedulaValidationState.isInUse) {
      alert(cedulaValidationState.message || 'LA CÉDULA NO ES VÁLIDA O YA ESTÁ EN USO.')
      return
    }

    const payload: Partial<PacienteEditable> = {
      cedula: pacienteData.cedula,
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      fechaNacimiento: pacienteData.fechaNacimiento || undefined,
      direccion: pacienteData.direccion?.trim().toUpperCase() || undefined,
    }

    try {
      await apiClient.post('/Pacientes', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('PACIENTE CREADO CON ÉXITO')
      cerrarModalNuevoPaciente()
      await cargarDatosIniciales()
    } catch (error) {
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
    const nombreLimpio = pacienteData.nombre.trim().toUpperCase()
    const apellidoLimpio = pacienteData.apellido.trim().toUpperCase()
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nombreLimpio) || !/^[A-ZÁÉÍÓÚÑ\s]+$/.test(apellidoLimpio)) {
      alert('EL NOMBRE Y EL APELLIDO SOLO DEBEN CONTENER LETRAS Y ESPACIOS.')
      return
    }

    const payload: Partial<PacienteEditable> = {
      id: pacienteData.id,
      cedula: pacienteData.cedula,
      nombre: nombreLimpio,
      apellido: apellidoLimpio,
      fechaNacimiento: pacienteData.fechaNacimiento || undefined,
      direccion: pacienteData.direccion?.trim().toUpperCase() || undefined,
    }

    try {
      await apiClient.put(`/Pacientes/${pacienteData.id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('PACIENTE ACTUALIZADO CON ÉXITO')
      cerrarModalHistorialPaciente()
      await cargarDatosIniciales()
    } catch (error) {
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
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ELIMINAR: ${error.response.data as string}`)
      } else {
        alert('OCURRIÓ UN ERROR INESPERADO AL INTENTAR ELIMINAR EL PACIENTE.')
      }
    }
  }

  const guardarMedicamento = async (medicamentoData: MedicamentoEditable, esEdicion: boolean) => {
    const token = getToken()
    const nombreGenericoTrimmed = medicamentoData.nombreGenerico?.trim().toUpperCase()
    if (!token || !nombreGenericoTrimmed) {
      alert('EL NOMBRE GENÉRICO DEL MEDICAMENTO ES OBLIGATORIO.')
      return
    }

    const payload: Partial<MedicamentoEditable> = {
      nombreGenerico: nombreGenericoTrimmed,
      nombreComercial: medicamentoData.nombreComercial?.trim().toUpperCase() || undefined,
      laboratorio: medicamentoData.laboratorio?.trim().toUpperCase() || undefined,
    }

    try {
      if (esEdicion) {
        if (!medicamentoData.id) {
          alert('ERROR: NO SE PUDO IDENTIFICAR EL MEDICAMENTO PARA EDITAR.')
          return
        }
        await apiClient.put(`/Medicamentos/${medicamentoData.id}`, payload, {
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
      if (isAxiosError(error) && error.response?.status === 400) {
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
    const motivoTrimmed = consultaData.motivo?.trim().toUpperCase()

    // 1. Validación de datos básicos en frontend
    if (!token) {
      alert('Error de autenticación. Por favor inicie sesión nuevamente.')
      return
    }
    if (!consultaData.pacienteId) {
      alert('Debe seleccionar un paciente válido.')
      return
    }
    if (!motivoTrimmed) {
      alert('El motivo de la consulta es obligatorio.')
      return
    }
    if (!consultaData.fechaHora) {
      alert('La fecha y hora son obligatorias.')
      return
    }

    // 2. Obtener el ID del Médico correctamente
    // medicoInfo.value.id debe ser el ID de la tabla 'medicos', NO de 'empleados'.
    // Si medicoInfo no está cargado, intentamos usar medico.value.id si existe, o lanzamos error.
    const medicoIdReal = medicoInfo.value.id || medico.value.id

    if (!medicoIdReal) {
      alert('ERROR CRÍTICO: No se pudo identificar el ID del médico. Intente recargar la página.')
      console.error('medicoInfo:', medicoInfo.value)
      console.error('medico:', medico.value)
      return
    }

    // 3. Formatear fecha a ISO 8601 completo
    const fechaISO = new Date(consultaData.fechaHora).toISOString()

    // 4. Construir el payload exacto que espera el Backend (ConsultaMedicaCreateDto)
    const payload = {
      pacienteId: consultaData.pacienteId,
      medicoId: medicoIdReal,
      motivo: motivoTrimmed,
      fechaHora: fechaISO,
    }

    console.log('Enviando payload crear consulta:', payload) // Para depuración

    try {
      await apiClient.post('/ConsultasMedicas', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('CONSULTA CREADA CON ÉXITO')
      cerrarModalNuevaConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error creando consulta:', error)
      if (isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data
        // Mostrar detalles de validación del backend si existen
        const msg =
          typeof errorData === 'object' && 'errors' in errorData
            ? JSON.stringify((errorData as Record<string, unknown>).errors)
            : JSON.stringify(errorData)
        alert(`ERROR DE VALIDACIÓN: ${msg}`)
      } else {
        alert('NO SE PUDO CREAR LA CONSULTA.')
      }
    }
  }

  const eliminarConsultaAction = async (consultaId: number) => {
    if (
      !confirm(
        '¿ESTÁ SEGURO DE ELIMINAR ESTA CONSULTA MÉDICA? ESTO TAMBIÉN ELIMINARÁ EL DIAGNÓSTICO Y PRESCRIPCIONES ASOCIADAS SI EXISTEN.',
      )
    ) {
      return
    }

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/ConsultasMedicas/${consultaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('CONSULTA MÉDICA ELIMINADA CON ÉXITO.')
      await cargarDatosIniciales()
    } catch (error) {
      if (isAxiosError(error) && error.response?.data) {
        alert(`ERROR AL ELIMINAR LA CONSULTA: ${error.response.data as string}`)
      } else {
        alert('NO SE PUDO ELIMINAR LA CONSULTA MÉDICA.')
      }
      console.error('Error eliminando consulta:', error)
    }
  }

  const logoutAction = () => {
    localStorage.clear()
    router.push('/login')
  }

  return {
    guardarDiagnosticoYPrescripciones,
    actualizarDiagnosticoYPrescripciones,
    eliminarDiagnosticoYPrescripciones,
    actualizarPerfil,
    crearPaciente,
    actualizarPaciente,
    eliminarPaciente,
    guardarMedicamento,
    eliminarMedicamento,
    crearConsulta,
    eliminarConsultaAction,
    logoutAction,
  }
}
