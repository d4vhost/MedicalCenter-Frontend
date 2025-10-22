import { ref } from 'vue'
import apiClient from '@/services/api'
import { jwtDecode } from 'jwt-decode'
import { isAxiosError } from 'axios'
import { useRouter } from 'vue-router'
import type {
  Empleado,
  Medico,
  Paciente,
  CentroMedico,
  Especialidad,
  Medicamento,
  Consulta,
  Diagnostico,
  DecodedToken,
  AdminInfo,
} from '@/types/adminPortal'

export function useAdminData() {
  const router = useRouter()
  const empleados = ref<Empleado[]>([])
  const medicos = ref<Medico[]>([])
  const pacientes = ref<Paciente[]>([])
  const centrosMedicos = ref<CentroMedico[]>([])
  const especialidades = ref<Especialidad[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const consultas = ref<Consulta[]>([])
  const diagnosticos = ref<Diagnostico[]>([])
  const adminInfo = ref<Partial<AdminInfo>>({})
  const adminEmpleadoId = ref<number>(0)

  const logout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (!token) {
        logout()
        return
      }
      let decodedToken: DecodedToken | null = null
      try {
        decodedToken = jwtDecode<DecodedToken>(token)
        adminEmpleadoId.value = Number(decodedToken.sub)
        if (isNaN(adminEmpleadoId.value)) {
          console.error('Invalid admin ID in token:', decodedToken.sub)
          logout()
          return
        }
      } catch (e) {
        console.error('Failed to decode token:', e)
        logout()
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [
        resEmpleados,
        resMedicos,
        resPacientes,
        resCentros,
        resEspecialidades,
        resMedicamentos,
        resConsultas,
        resDiagnosticos,
      ] = await Promise.all([
        apiClient.get<Empleado[]>('/Empleados', config),
        apiClient.get<Medico[]>('/Medicos', config),
        apiClient.get<Paciente[]>('/Pacientes', config),
        apiClient.get<CentroMedico[]>('/CentrosMedicos', config),
        apiClient.get<Especialidad[]>('/Especialidades', config),
        apiClient.get<Medicamento[]>('/Medicamentos', config),
        apiClient.get<Consulta[]>('/ConsultasMedicas', config),
        apiClient.get<Diagnostico[]>('/Diagnosticos', config),
      ])
      empleados.value = resEmpleados.data
      medicos.value = resMedicos.data
      pacientes.value = resPacientes.data
      centrosMedicos.value = resCentros.data
      especialidades.value = resEspecialidades.data
      medicamentos.value = resMedicamentos.data
      consultas.value = resConsultas.data
      diagnosticos.value = resDiagnosticos.data
      cargarAdminInfo()
    } catch (error) {
      console.error('Error cargando datos:', error)
      if (isAxiosError(error) && error.response?.status === 401) logout()
    }
  }

  const cargarAdminInfo = () => {
    const admin = empleados.value.find((e) => e.id === adminEmpleadoId.value)
    if (admin) {
      const centroMedico = centrosMedicos.value.find((c) => c.id === admin.centroMedicoId)
      adminInfo.value = {
        id: admin.id,
        nombreCompleto: `${admin.nombre} ${admin.apellido}`,
        rol: admin.rol,
        cedula: admin.cedula,
        nombreCentroMedico: centroMedico?.nombre || 'N/A',
        centroMedicoId: admin.centroMedicoId,
      }
    } else {
      console.warn('Admin empleado info not found for ID:', adminEmpleadoId.value)
      adminInfo.value = {}
    }
  }

  return {
    empleados,
    medicos,
    pacientes,
    centrosMedicos,
    especialidades,
    medicamentos,
    consultas,
    diagnosticos,
    adminInfo,
    adminEmpleadoId,
    cargarDatos,
    cargarAdminInfo,
    logout,
  }
}
