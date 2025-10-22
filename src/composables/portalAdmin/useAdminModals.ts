import { ref, reactive, type Ref } from 'vue'
import type {
  AdminEditable,
  MedicoDetallado,
  CentroMedico,
  Especialidad,
  Medicamento,
  AdminInfo,
} from '@/types/adminPortal'

export function useAdminModals(adminInfo: Ref<Partial<AdminInfo>>) {
  const showModalEmpleado = ref(false)
  const modoEdicion = ref(false)
  const medicoEditable = ref<Partial<MedicoDetallado & { password?: string }>>({})

  const showModalCentro = ref(false)
  const modoEdicionCentro = ref(false)
  const centroEditable = ref<Partial<CentroMedico>>({})

  const showModalEspecialidad = ref(false)
  const modoEdicionEspecialidad = ref(false)
  const especialidadEditable = ref<Partial<Especialidad>>({})

  const showModalMedicamento = ref(false)
  const modoEdicionMedicamento = ref(false)
  const medicamentoEditable = ref<Partial<Medicamento>>({})

  const adminEditable = reactive<AdminEditable>({
    nombre: '',
    apellido: '',
    password: '',
    cedula: '',
    centroMedicoId: undefined,
  })

  const initializeAdminEditable = () => {
    const info = adminInfo.value
    adminEditable.nombre = info.nombreCompleto?.split(' ')[0] || ''
    adminEditable.apellido = info.nombreCompleto?.split(' ').slice(1).join(' ') || ''
    adminEditable.password = ''
    adminEditable.cedula = info.cedula || ''
    adminEditable.centroMedicoId = info.centroMedicoId || undefined
  }

  const abrirModalEmpleado = (medico: MedicoDetallado | null) => {
    if (medico) {
      modoEdicion.value = true
      medicoEditable.value = { ...medico }
      delete medicoEditable.value.password
    } else {
      modoEdicion.value = false
      medicoEditable.value = { rol: 'Medico', centroMedicoId: undefined, especialidadId: undefined }
    }
    showModalEmpleado.value = true
  }
  const cerrarModalEmpleado = () => {
    showModalEmpleado.value = false
    medicoEditable.value = {}
    modoEdicion.value = false
  }

  const abrirModalCentro = (centro: CentroMedico | null) => {
    modoEdicionCentro.value = !!centro
    centroEditable.value = centro ? { ...centro } : { nombre: '', direccion: '' }
    showModalCentro.value = true
  }
  const cerrarModalCentro = () => {
    showModalCentro.value = false
    centroEditable.value = {}
    modoEdicionCentro.value = false
  }

  const abrirModalEspecialidad = (especialidad: Especialidad | null) => {
    modoEdicionEspecialidad.value = !!especialidad
    especialidadEditable.value = especialidad ? { ...especialidad } : { nombre: '' }
    showModalEspecialidad.value = true
  }
  const cerrarModalEspecialidad = () => {
    showModalEspecialidad.value = false
    especialidadEditable.value = {}
    modoEdicionEspecialidad.value = false
  }

  const abrirModalMedicamento = (medicamento: Medicamento | null) => {
    modoEdicionMedicamento.value = !!medicamento
    medicamentoEditable.value = medicamento
      ? { ...medicamento }
      : { nombreGenerico: '', nombreComercial: '', laboratorio: '' }
    showModalMedicamento.value = true
  }
  const cerrarModalMedicamento = () => {
    showModalMedicamento.value = false
    medicamentoEditable.value = {}
    modoEdicionMedicamento.value = false
  }

  return {
    showModalEmpleado,
    modoEdicion,
    medicoEditable,
    showModalCentro,
    modoEdicionCentro,
    centroEditable,
    showModalEspecialidad,
    modoEdicionEspecialidad,
    especialidadEditable,
    showModalMedicamento,
    modoEdicionMedicamento,
    medicamentoEditable,
    adminEditable,
    initializeAdminEditable,
    abrirModalEmpleado,
    cerrarModalEmpleado,
    abrirModalCentro,
    cerrarModalCentro,
    abrirModalEspecialidad,
    cerrarModalEspecialidad,
    abrirModalMedicamento,
    cerrarModalMedicamento,
  }
}
