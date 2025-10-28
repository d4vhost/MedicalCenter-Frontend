// src/composables/portalAdmin/useAdminData.ts

import { ref, onMounted } from 'vue'
import apiClient from '@/services/api'
import type {
  CentroMedico,
  Especialidad,
  Medico,
  Empleado,
  Medicamento,
  Paciente, // Asegúrate que Paciente esté importado
  Consulta,
  Diagnostico,
} from '@/types/adminPortal' // Asegúrate que los tipos estén correctos

/**
 * Gestiona la carga y el estado de todos los datos necesarios para el Portal de Administración.
 */
export function useAdminData() {
  // --- Refs para los datos ---
  const centrosMedicos = ref<CentroMedico[]>([])
  const especialidades = ref<Especialidad[]>([])
  const medicos = ref<Medico[]>([])
  const empleados = ref<Empleado[]>([])
  const medicamentos = ref<Medicamento[]>([])
  const pacientes = ref<Paciente[]>([]) // El Ref ya existía, pero no se llenaba
  const consultas = ref<Consulta[]>([])
  const diagnosticos = ref<Diagnostico[]>([])
  const isLoadingData = ref(true)

  /**
   * Carga todos los datos maestros de la API en paralelo.
   */
  const fetchAdminData = async () => {
    isLoadingData.value = true
    try {
      // Hacemos todas las llamadas en paralelo
      const [
        centrosResult,
        especialidadesResult,
        empleadosResult,
        medicosResult,
        medicamentosResult,
        pacientesResult, // <-- AÑADIDO
        consultasResult,
        diagnosticosResult,
      ] = await Promise.allSettled([
        apiClient.get<CentroMedico[]>('/CentrosMedicos'),
        apiClient.get<Especialidad[]>('/Especialidades'),
        apiClient.get<Empleado[]>('/Empleados'),
        apiClient.get<Medico[]>('/Medicos'),
        apiClient.get<Medicamento[]>('/Medicamentos'),
        apiClient.get<Paciente[]>('/Pacientes'), // <-- LÍNEA AÑADIDA
        apiClient.get<Consulta[]>('/ConsultasMedicas'),
        apiClient.get<Diagnostico[]>('/Diagnosticos'),
      ])

      // --- Procesamos los resultados ---
      if (centrosResult.status === 'fulfilled' && centrosResult.value.data) {
        centrosMedicos.value = centrosResult.value.data
      } else if (centrosResult.status === 'rejected') {
        console.error('Error fetching centros médicos:', centrosResult.reason)
      }

      if (especialidadesResult.status === 'fulfilled' && especialidadesResult.value.data) {
        especialidades.value = especialidadesResult.value.data
      } else if (especialidadesResult.status === 'rejected') {
        console.error('Error fetching especialidades:', especialidadesResult.reason)
      }

      if (empleadosResult.status === 'fulfilled' && empleadosResult.value.data) {
        empleados.value = empleadosResult.value.data
      } else if (empleadosResult.status === 'rejected') {
        console.error('Error fetching empleados:', empleadosResult.reason)
      }

      if (medicosResult.status === 'fulfilled' && medicosResult.value.data) {
        medicos.value = medicosResult.value.data
      } else if (medicosResult.status === 'rejected') {
        console.error('Error fetching medicos:', medicosResult.reason)
      }

      if (medicamentosResult.status === 'fulfilled' && medicamentosResult.value.data) {
        medicamentos.value = medicamentosResult.value.data
      } else if (medicamentosResult.status === 'rejected') {
        console.error('Error fetching medicamentos:', medicamentosResult.reason)
      }

      // --- BLOQUE AÑADIDO ---
      if (pacientesResult.status === 'fulfilled' && pacientesResult.value.data) {
        pacientes.value = pacientesResult.value.data
      } else if (pacientesResult.status === 'rejected') {
        console.error('Error fetching pacientes:', pacientesResult.reason)
      }
      // --- FIN BLOQUE AÑADIDO ---

      if (consultasResult.status === 'fulfilled' && consultasResult.value.data) {
        consultas.value = consultasResult.value.data
      } else if (consultasResult.status === 'rejected') {
        console.error('Error fetching consultas:', consultasResult.reason)
      }

      if (diagnosticosResult.status === 'fulfilled' && diagnosticosResult.value.data) {
        diagnosticos.value = diagnosticosResult.value.data
      } else if (diagnosticosResult.status === 'rejected') {
        console.error('Error fetching diagnosticos:', diagnosticosResult.reason)
      }
    } catch (error) {
      console.error('Error fatal durante la carga de datos maestros:', error)
    } finally {
      isLoadingData.value = false
    }
  }

  // --- Carga inicial al montar ---
  onMounted(fetchAdminData)

  // --- Retornamos los datos y el estado ---
  return {
    centrosMedicos,
    especialidades,
    medicos,
    empleados,
    medicamentos,
    pacientes, // Ahora 'pacientes' contendrá datos
    consultas,
    diagnosticos,
    isLoadingData,
    fetchAdminData, // Exponemos la función por si se necesita recargar
  }
}
