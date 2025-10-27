import apiClient from '@/services/api'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type { Ref } from 'vue'
import type {
  AdminEditable,
  MedicoDetallado,
  CentroMedico,
  Especialidad,
  Medicamento,
  Empleado,
  AdminInfo,
  Medico,
} from '@/types/adminPortal'

export function useAdminActions(
  cargarDatos: () => Promise<void>,
  cerrarModalEmpleado: () => void,
  cerrarModalCentro: () => void,
  cerrarModalEspecialidad: () => void,
  cerrarModalMedicamento: () => void,
  adminInfo: Ref<Partial<AdminInfo>>,
) {
  const router = useRouter()

  const getToken = (): string | null => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      logout()
    }
    return token
  }

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const guardarMedico = async (
    medicoData: Partial<MedicoDetallado & { password?: string }>,
    esModoEdicion: boolean,
  ) => {
    const token = getToken()
    if (!token) return
    const { id, nombre, apellido, cedula, password, centroMedicoId, especialidadId } = medicoData

    if (
      !cedula ||
      !nombre ||
      !apellido ||
      !centroMedicoId ||
      !especialidadId ||
      (!esModoEdicion && !password)
    ) {
      alert('Por favor, complete todos los campos obligatorios (*).')
      return
    }
    if (cedula.length !== 10 || !/^\d+$/.test(cedula)) {
      alert('La cédula debe tener 10 dígitos numéricos.')
      return
    }
    if (!esModoEdicion && password && password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    try {
      const empleadoPayload: Partial<Empleado> = {
        cedula: cedula.trim(),
        nombre: nombre.trim().toUpperCase(),
        apellido: apellido.trim().toUpperCase(),
        rol: 'MEDICO',
        centroMedicoId,
        ...(password && { password }),
      }

      if (esModoEdicion) {
        if (!id) throw new Error('ID de empleado faltante para editar.')
        await apiClient.put(`/Empleados/${id}`, empleadoPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (medicoData.medicoId) {
          await apiClient.put(
            `/Medicos/${medicoData.medicoId}`,
            { empleadoId: id, especialidadId },
            { headers: { Authorization: `Bearer ${token}` } },
          )
        } else {
          console.warn('Medico ID faltante para actualizar detalles del médico.')
        }

        alert(`Dr. ${nombre} ${apellido} actualizado con éxito`)
      } else {
        const resEmpleado = await apiClient.post<Empleado>('/Empleados', empleadoPayload, {
          headers: { Authorization: `Bearer ${token}` },
        })
        await apiClient.post(
          '/Medicos',
          { empleadoId: resEmpleado.data.id, especialidadId },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        alert(`Dr. ${nombre} ${apellido} creado con éxito`)
      }
      cerrarModalEmpleado()
      await cargarDatos()
    } catch (error) {
      console.error('Error al guardar médico:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data.message || error.response.data}`)
      } else {
        alert('No se pudo guardar la información del médico.')
      }
    }
  }

  const eliminarMedico = async (empleadoId: number | undefined) => {
    if (!empleadoId) {
      alert('ID de empleado no válido.')
      return
    }
    if (!confirm('¿Está seguro de eliminar este médico? Esta acción no se puede deshacer.')) return

    const token = getToken()
    if (!token) return

    try {
      const medicosResponse = await apiClient.get<Medico[]>('/Medicos', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const medico = medicosResponse.data.find((m) => m.empleadoId === empleadoId)

      if (medico) {
        await apiClient.delete(`/Medicos/${medico.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        console.warn(
          `No se encontró registro de Médico para el Empleado ID: ${empleadoId}. Procediendo a eliminar solo el empleado.`,
        )
      }

      await apiClient.delete(`/Empleados/${empleadoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Médico eliminado con éxito.')
      cerrarModalEmpleado()
      await cargarDatos()
    } catch (error) {
      console.error('Error al eliminar médico:', error)
      if (isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data
        const errorMessage =
          typeof errorData === 'string'
            ? errorData
            : (errorData as { message?: string })?.message || 'Error desconocido.'
        alert(`No se pudo eliminar el médico: ${errorMessage}`)
      } else {
        alert('No se pudo eliminar el médico. Verifique si tiene consultas asociadas.')
      }
    }
  }

  const guardarCentro = async (centroData: Partial<CentroMedico>, esModoEdicion: boolean) => {
    const token = getToken()
    if (!token || !centroData.nombre) {
      alert('El nombre del centro médico es obligatorio.')
      return
    }
    const payload = {
      nombre: centroData.nombre.trim().toUpperCase(),
      direccion: centroData.direccion?.trim().toUpperCase() || undefined,
    }
    try {
      if (esModoEdicion) {
        if (!centroData.id) throw new Error('ID de centro faltante para editar.')
        await apiClient.put(`/CentrosMedicos/${centroData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await apiClient.post('/CentrosMedicos', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      alert(
        `Centro Médico "${payload.nombre}" ${esModoEdicion ? 'actualizado' : 'creado'} con éxito.`,
      )
      cerrarModalCentro()
      await cargarDatos()
    } catch (error) {
      console.error('Error guardando centro:', error)
      alert('Error guardando centro médico.')
    }
  }

  const eliminarCentro = async (id: number | undefined) => {
    if (!id) {
      alert('ID de centro no válido.')
      return
    }
    if (!confirm('¿Eliminar centro médico? Asegúrese de que no haya empleados asignados.')) return
    const token = getToken()
    if (!token) return
    try {
      await apiClient.delete(`/CentrosMedicos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Centro Médico eliminado con éxito.')
      cerrarModalCentro()
      await cargarDatos()
    } catch (error) {
      console.error('Error eliminando centro:', error)
      if (isAxiosError(error) && error.response?.status === 400) {
        alert('No se puede eliminar el centro. Asegúrese de que no haya empleados asignados a él.')
      } else {
        alert('Error eliminando centro médico.')
      }
    }
  }

  const guardarEspecialidad = async (
    especialidadData: Partial<Especialidad>,
    esModoEdicion: boolean,
  ) => {
    const token = getToken()
    if (!token || !especialidadData.nombre) {
      alert('El nombre de la especialidad es obligatorio.')
      return
    }
    const payload = { nombre: especialidadData.nombre.trim().toUpperCase() }
    try {
      if (esModoEdicion) {
        if (!especialidadData.id) throw new Error('ID de especialidad faltante para editar.')
        await apiClient.put(`/Especialidades/${especialidadData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await apiClient.post('/Especialidades', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      alert(
        `Especialidad "${payload.nombre}" ${esModoEdicion ? 'actualizada' : 'creada'} con éxito.`,
      )
      cerrarModalEspecialidad()
      await cargarDatos()
    } catch (error) {
      console.error('Error guardando especialidad:', error)
      alert('Error guardando especialidad.')
    }
  }

  const eliminarEspecialidad = async (id: number | undefined) => {
    if (!id) {
      alert('ID de especialidad no válido.')
      return
    }
    if (!confirm('¿Eliminar especialidad? Asegúrese de que no haya médicos asignados.')) return
    const token = getToken()
    if (!token) return
    try {
      await apiClient.delete(`/Especialidades/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Especialidad eliminada con éxito.')
      cerrarModalEspecialidad()
      await cargarDatos()
    } catch (error) {
      console.error('Error eliminando especialidad:', error)
      if (isAxiosError(error) && error.response?.status === 400) {
        alert(
          'No se puede eliminar la especialidad. Asegúrese de que no haya médicos asignados a ella.',
        )
      } else {
        alert('Error eliminando especialidad.')
      }
    }
  }

  const guardarMedicamento = async (
    medicamentoData: Partial<Medicamento>,
    esModoEdicion: boolean,
  ) => {
    const token = getToken()
    if (!token || !medicamentoData.nombreGenerico) {
      alert('El nombre genérico del medicamento es obligatorio.')
      return
    }

    const payload: Partial<Medicamento> = {
      nombreGenerico: medicamentoData.nombreGenerico.trim().toUpperCase(),
      nombreComercial: medicamentoData.nombreComercial?.trim().toUpperCase() || undefined,
      laboratorio: medicamentoData.laboratorio?.trim().toUpperCase() || undefined,
    }

    try {
      if (esModoEdicion) {
        if (!medicamentoData.id) throw new Error('ID de medicamento faltante para editar.')
        await apiClient.put(`/Medicamentos/${medicamentoData.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await apiClient.post('/Medicamentos', payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      alert(
        `Medicamento "${payload.nombreGenerico}" ${esModoEdicion ? 'actualizado' : 'creado'} con éxito.`,
      )
      cerrarModalMedicamento()
      await cargarDatos()
    } catch (error) {
      console.error('Error guardando medicamento:', error)
      alert('Error guardando medicamento.')
    }
  }

  const eliminarMedicamento = async (id: number | undefined) => {
    if (!id) {
      alert('ID de medicamento no válido.')
      return
    }
    if (!confirm('¿Eliminar medicamento?')) return
    const token = getToken()
    if (!token) return
    try {
      await apiClient.delete(`/Medicamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Medicamento eliminado con éxito.')
      cerrarModalMedicamento()
      await cargarDatos()
    } catch (error) {
      console.error('Error eliminando medicamento:', error)
      if (isAxiosError(error) && error.response?.status === 400) {
        alert(
          'No se puede eliminar el medicamento. Puede estar referenciado en prescripciones existentes.',
        )
      } else {
        alert('Error eliminando medicamento.')
      }
    }
  }

  const actualizarPerfil = async (adminEditableData: AdminEditable) => {
    const token = getToken()
    const adminId = adminInfo.value.id

    if (!adminId || !token) {
      alert('No se pudo identificar al administrador para actualizar.')
      return
    }

    if (
      !adminEditableData.cedula ||
      !adminEditableData.nombre ||
      !adminEditableData.apellido ||
      !adminEditableData.centroMedicoId
    ) {
      alert('Los campos Cédula, Nombre, Apellido y Centro Médico son obligatorios.')
      return
    }
    if (adminEditableData.cedula.length !== 10 || !/^\d+$/.test(adminEditableData.cedula)) {
      alert('La cédula debe tener 10 dígitos numéricos.')
      return
    }
    if (adminEditableData.password && adminEditableData.password.length < 4) {
      alert('La nueva contraseña debe tener al menos 4 caracteres.')
      return
    }

    const payload: Partial<Empleado> = {
      cedula: adminEditableData.cedula.trim(),
      nombre: adminEditableData.nombre.trim().toUpperCase(),
      apellido: adminEditableData.apellido.trim().toUpperCase(),
      rol: adminInfo.value.rol,
      centroMedicoId: adminEditableData.centroMedicoId,
      ...(adminEditableData.password && { password: adminEditableData.password }),
    }

    try {
      await apiClient.put(`/Empleados/${adminId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      alert('Perfil actualizado con éxito')
      if (adminEditableData.password) {
        adminEditableData.password = ''
      }
      await cargarDatos()
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      if (isAxiosError(error) && error.response?.data) {
        alert(`Error: ${error.response.data.message || error.response.data}`)
      } else {
        alert('No se pudo actualizar el perfil.')
      }
    }
  }

  return {
    guardarMedico,
    eliminarMedico,
    guardarCentro,
    eliminarCentro,
    guardarEspecialidad,
    eliminarEspecialidad,
    guardarMedicamento,
    eliminarMedicamento,
    actualizarPerfil,
    logout,
  }
}
