// src/composables/portalMedico/useMedicoActions.ts
import apiClient from '@/services/api'
import type { Ref } from 'vue'
import type {
  MedicoEditable,
  PacienteEditable,
  ConsultaEditable,
  DiagnosticoEditable,
  PrescripcionNueva,
  MedicamentoEditable,
  MedicoInfo,
  Medico,
  Consulta,
  Paciente,
  Medicamento,
  Diagnostico,
} from '@/types/medicoPortal'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'

// Depende de los datos (useMedicoData) y el estado de los modales (useMedicoModals)
export function useMedicoActions(
  // Refs de datos (para recargar después de una acción)
  medico: Ref<Medico>,
  medicoInfo: Ref<Partial<MedicoInfo>>,
  cargarDatosIniciales: () => Promise<void>, // Función para recargar
  // Refs y funciones de modales
  cerrarModalFinalizarConsulta: () => void,
  cerrarModalNuevoPaciente: () => void,
  cerrarModalHistorialPaciente: () => void,
  cerrarModalMedicamento: () => void,
  cerrarModalNuevaConsulta: () => void,
) {
  const router = useRouter()

  const getToken = (): string | null => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      console.error('Acción API fallida: No hay token.')
      // Opcional: redirigir a login
      // router.push('/login');
    }
    return token
  }

  const guardarDiagnosticoYPrescripciones = async (
    diagnosticoData: DiagnosticoEditable,
    prescripcionesData: PrescripcionNueva[],
  ) => {
    const token = getToken()
    if (!token || !diagnosticoData.enfermedadNombre || !diagnosticoData.consultaId) {
      alert('Datos incompletos para guardar diagnóstico.')
      return
    }
    // Confirmación si no hay prescripciones
    if (prescripcionesData.length === 0) {
      if (!confirm('No ha agregado ninguna prescripción. ¿Desea guardar la consulta igualmente?')) {
        return
      }
    }

    try {
      // 1. Guardar Diagnóstico
      const responseDiag = await apiClient.post('/Diagnosticos', diagnosticoData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const diagnosticoId = responseDiag.data.id

      // 2. Guardar Prescripciones (si existen)
      if (prescripcionesData.length > 0) {
        for (const pres of prescripcionesData) {
          const prescripcionPayload = {
            diagnosticoId: diagnosticoId,
            medicamentoId: pres.medicamentoId,
            indicaciones: pres.indicaciones,
          }
          await apiClient.post('/Prescripciones', prescripcionPayload, {
            headers: { Authorization: `Bearer ${token}` },
          })
        }
      }

      alert('Consulta guardada con éxito.')
      cerrarModalFinalizarConsulta()
      await cargarDatosIniciales() // Recarga los datos generales
    } catch (error) {
      console.error('Error al guardar consulta:', error)
      alert('No se pudo guardar la información.')
    }
  }

  const actualizarPerfil = async (editableData: MedicoEditable) => {
    const token = getToken()
    if (!medico.value.empleadoId || !token) {
      alert('No se pudo identificar al médico para actualizar.')
      return
    }

    if (editableData.password && editableData.password.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      // Obtener datos actuales del empleado para mergear
      const { data: empleadoActual } = await apiClient.get(
        `/Empleados/${medico.value.empleadoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      // Crear payload solo con los campos necesarios y la contraseña si se proporcionó
      const payload: any = {
        cedula: empleadoActual.cedula, // La cédula generalmente no se cambia
        nombre: editableData.nombre,
        apellido: editableData.apellido,
        rol: empleadoActual.rol, // Mantiene el rol actual
        centroMedicoId: empleadoActual.centroMedicoId, // Mantiene el centro actual
      }

      if (editableData.password) {
        payload.password = editableData.password
      }

      await apiClient.put(`/Empleados/${medico.value.empleadoId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Perfil actualizado con éxito')
      // Limpia el campo de contraseña en el composable de modales si es necesario
      // (ya se hace con el watch, pero por si acaso)
      // editableData.password = ''; // O manejar esto en el componente/composable de modales

      await cargarDatosIniciales() // Recarga para reflejar cambios
    } catch (error) {
      console.error('Error al actualizar el perfil:', error)
      alert('No se pudo actualizar el perfil.')
    }
  }

  const crearPaciente = async (pacienteData: PacienteEditable) => {
    const token = getToken()
    if (!token || !pacienteData.cedula || !pacienteData.nombre || !pacienteData.apellido) {
      alert('Los campos Cédula, Nombre y Apellido son obligatorios.')
      return
    }
    // Validación básica de cédula aquí también si es necesario
    if (!/^\d{10}$/.test(pacienteData.cedula)) {
      alert('La cédula debe contener 10 dígitos numéricos.')
      return
    }

    try {
      await apiClient.post('/Pacientes', pacienteData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Paciente creado con éxito')
      cerrarModalNuevoPaciente()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al crear paciente:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`) // Muestra mensaje del backend si existe
      } else {
        alert('No se pudo crear el paciente. Verifique que la cédula no esté duplicada.')
      }
    }
  }

  const actualizarPaciente = async (pacienteData: PacienteEditable) => {
    const token = getToken()
    if (!token || !pacienteData.id) {
      alert('No se pudo identificar al paciente para actualizar.')
      return
    }
    if (!pacienteData.cedula || !pacienteData.nombre || !pacienteData.apellido) {
      alert('Los campos Cédula, Nombre y Apellido son obligatorios.')
      return
    }
    if (!/^\d{10}$/.test(pacienteData.cedula)) {
      alert('La cédula debe contener 10 dígitos numéricos.')
      return
    }

    try {
      await apiClient.put(`/Pacientes/${pacienteData.id}`, pacienteData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Paciente actualizado con éxito')
      cerrarModalHistorialPaciente()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al actualizar paciente:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`)
      } else {
        alert('No se pudo actualizar el paciente.')
      }
    }
  }

  const eliminarPaciente = async (pacienteId: number | undefined) => {
    if (!pacienteId) return
    if (!confirm('¿Está seguro de eliminar a este paciente? Esta acción no se puede deshacer.'))
      return

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/Pacientes/${pacienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Paciente eliminado con éxito.')
      cerrarModalHistorialPaciente() // Cierra el modal si estaba abierto
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al eliminar paciente:', error)
      if (
        isAxiosError(error) &&
        error.response?.status === 400 /* o el código específico de tu API */
      ) {
        alert('No se pudo eliminar el paciente. Es posible que tenga consultas médicas asociadas.')
      } else if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`)
      } else {
        alert('Ocurrió un error inesperado al intentar eliminar el paciente.')
      }
    }
  }

  const guardarMedicamento = async (medicamentoData: MedicamentoEditable, esEdicion: boolean) => {
    const token = getToken()
    if (!token || !medicamentoData.nombreGenerico) {
      alert('El nombre genérico del medicamento es obligatorio.')
      return
    }

    try {
      if (esEdicion) {
        if (!medicamentoData.id) {
          alert('Error: No se pudo identificar el medicamento para editar.')
          return
        }
        await apiClient.put(`/Medicamentos/${medicamentoData.id}`, medicamentoData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert('Medicamento actualizado con éxito.')
      } else {
        await apiClient.post('/Medicamentos', medicamentoData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        alert('Medicamento creado con éxito.')
      }
      cerrarModalMedicamento()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al guardar medicamento:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`)
      } else {
        alert('No se pudo guardar el medicamento.')
      }
    }
  }

  const eliminarMedicamento = async (medicamentoId: number | undefined) => {
    if (!medicamentoId) return
    if (!confirm('¿Está seguro de eliminar este medicamento?')) return

    const token = getToken()
    if (!token) return

    try {
      await apiClient.delete(`/Medicamentos/${medicamentoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Medicamento eliminado con éxito.')
      cerrarModalMedicamento() // Cierra modal si estaba abierto
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al eliminar medicamento:', error)
      if (isAxiosError(error) && error.response?.status === 400 /* o código específico */) {
        alert('No se pudo eliminar el medicamento. Puede estar asociado a prescripciones activas.')
      } else if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`)
      } else {
        alert('Ocurrió un error inesperado al intentar eliminar el medicamento.')
      }
    }
  }

  const crearConsulta = async (consultaData: ConsultaEditable) => {
    const token = getToken()
    if (
      !token ||
      !consultaData.pacienteId ||
      !consultaData.medicoId ||
      !consultaData.motivo ||
      !consultaData.fechaHora
    ) {
      alert('Faltan datos para crear la consulta (Paciente, Médico, Motivo, Fecha).')
      return
    }

    try {
      await apiClient.post('/ConsultasMedicas', consultaData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Consulta creada con éxito')
      cerrarModalNuevaConsulta()
      await cargarDatosIniciales()
    } catch (error) {
      console.error('Error al crear la consulta:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data}`)
      } else {
        alert('No se pudo crear la consulta.')
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
    logoutAction, // Renombrado para evitar conflicto con logout de useMedicoData
  }
}
