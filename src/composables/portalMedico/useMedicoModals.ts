// src/composables/portalMedico/useMedicoModals.ts
import { ref, reactive, watch, type Ref } from 'vue'
import type {
  Consulta,
  Paciente,
  Medicamento,
  MedicoInfo,
  MedicoEditable,
  PacienteEditable,
  ConsultaEditable,
  DiagnosticoEditable,
  MedicamentoEditable,
  PrescripcionNueva,
} from '@/types/medicoPortal'

// Depende de los datos (lista de pacientes, medicamentos) de useMedicoData
export function useMedicoModals(
  pacientes: Ref<Paciente[]>,
  medicamentos: Ref<Medicamento[]>,
  medicoInfo: Ref<Partial<MedicoInfo>>, // Para obtener el ID del médico actual
  medicoBaseEditable: MedicoEditable, // Para inicializar el modal de perfil
) {
  // --- Estado de Visibilidad de Modales ---
  const showModalNuevaConsulta = ref(false)
  const showModalFinalizarConsulta = ref(false) // Usaremos este en lugar de consultaSeleccionada !== null
  const showModalAgregarMedicamento = ref(false)
  const showModalNuevoPaciente = ref(false)
  const showModalHistorialPaciente = ref(false) // Usaremos este en lugar de pacienteSeleccionado !== null
  const showModalMedicamento = ref(false)

  // --- Estado de los Datos en Modales ---
  const consultaSeleccionada = ref<Consulta | null>(null) // Para saber qué consulta finalizar/ver
  const pacienteSeleccionado = ref<Paciente | null>(null) // Para saber qué paciente ver/editar

  const modoEdicionMedicamento = ref(false)

  // Datos reactivos para formularios de modales
  const medicoEditable = reactive<MedicoEditable>({ nombre: '', apellido: '', password: '' })
  const nuevoPaciente = reactive<PacienteEditable>({})
  const pacienteEditable = reactive<PacienteEditable>({})
  const nuevaConsulta = reactive<ConsultaEditable>({
    pacienteId: null,
    medicoId: 0, // Se actualizará al cargar datos
    motivo: '',
    fechaHora: '',
  })
  const nuevoDiagnostico = reactive<DiagnosticoEditable>({
    consultaId: undefined, // Se asigna al abrir el modal
    enfermedadNombre: '',
    observaciones: '',
  })
  const prescripcionesNuevas = ref<PrescripcionNueva[]>([])
  const medicamentoEditable = reactive<MedicamentoEditable>({})

  // Estado específico para modales de búsqueda/selección
  const busquedaCedulaPacienteModal = ref('')
  const pacienteNoEncontradoMsg = ref('')
  const pacienteSearchText = ref('') // Texto a mostrar del paciente seleccionado

  const medicamentoSeleccionadoParaAgregar = ref<Medicamento | null>(null)
  const indicacionesParaAgregar = ref('')
  const medicamentoSearchTextModal = ref('')
  const showMedicamentoOptionsModal = ref(false)

  // --- Funciones para Abrir Modales ---
  const abrirModalNuevaConsulta = () => {
    Object.assign(nuevaConsulta, {
      pacienteId: null,
      medicoId: medicoInfo.value.id ?? 0, // Usa el id del médico logueado
      motivo: '',
      fechaHora: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16),
    })
    busquedaCedulaPacienteModal.value = ''
    pacienteNoEncontradoMsg.value = ''
    pacienteSearchText.value = ''
    showModalNuevaConsulta.value = true
  }

  const abrirModalFinalizarConsulta = (consulta: Consulta) => {
    consultaSeleccionada.value = consulta
    nuevoDiagnostico.consultaId = consulta.id
    nuevoDiagnostico.enfermedadNombre = ''
    nuevoDiagnostico.observaciones = ''
    prescripcionesNuevas.value = [] // Limpia prescripciones anteriores
    // Limpia estado del modal de agregar medicamento
    medicamentoSeleccionadoParaAgregar.value = null
    indicacionesParaAgregar.value = ''
    medicamentoSearchTextModal.value = ''
    showMedicamentoOptionsModal.value = false
    showModalFinalizarConsulta.value = true
  }

  const abrirModalAgregarMedicamento = () => {
    medicamentoSeleccionadoParaAgregar.value = null
    indicacionesParaAgregar.value = ''
    medicamentoSearchTextModal.value = ''
    showMedicamentoOptionsModal.value = false // Asegura que esté cerrado al abrir
    showModalAgregarMedicamento.value = true
  }

  const abrirModalNuevoPaciente = () => {
    Object.assign(nuevoPaciente, {
      cedula: '',
      nombre: '',
      apellido: '',
      fechaNacimiento: '',
      direccion: '',
    })
    showModalNuevoPaciente.value = true
  }

  const abrirModalHistorialPaciente = (paciente: Paciente) => {
    pacienteSeleccionado.value = { ...paciente } // Guarda el paciente completo
    // Formatea la fecha para el input type="date"
    const fechaFormateada = paciente.fechaNacimiento
      ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
      : ''
    // Asigna los datos al objeto reactivo para edición
    Object.assign(pacienteEditable, { ...paciente, fechaNacimiento: fechaFormateada })
    showModalHistorialPaciente.value = true
    // La carga del historial se hace en useMedicoActions o useMedicoData
  }

  const abrirModalMedicamento = (medicamento: Medicamento | null) => {
    modoEdicionMedicamento.value = !!medicamento
    Object.assign(
      medicamentoEditable,
      medicamento
        ? { ...medicamento }
        : { nombreGenerico: '', nombreComercial: '', laboratorio: '' },
    )
    showModalMedicamento.value = true
  }

  // --- Funciones para Cerrar Modales ---
  const cerrarModalNuevaConsulta = () => (showModalNuevaConsulta.value = false)
  const cerrarModalFinalizarConsulta = () => {
    showModalFinalizarConsulta.value = false
    consultaSeleccionada.value = null // Limpia la consulta seleccionada
  }
  const cerrarModalAgregarMedicamento = () => (showModalAgregarMedicamento.value = false)
  const cerrarModalNuevoPaciente = () => (showModalNuevoPaciente.value = false)
  const cerrarModalHistorialPaciente = () => {
    showModalHistorialPaciente.value = false
    pacienteSeleccionado.value = null // Limpia el paciente seleccionado
  }
  const cerrarModalMedicamento = () => (showModalMedicamento.value = false)

  // --- Lógica Específica de Modales ---

  // Nueva Consulta: Búsqueda y Selección Automática
  const buscarPacientePorCedulaAutoSelect = () => {
    pacienteNoEncontradoMsg.value = ''
    const cedulaBuscada = busquedaCedulaPacienteModal.value.trim()
    const encontrado = pacientes.value.find((p) => p.cedula === cedulaBuscada)

    if (encontrado) {
      seleccionarPacienteParaConsulta(encontrado)
    } else {
      pacienteNoEncontradoMsg.value = 'Paciente no encontrado. Regístrelo primero.'
      // No reseteamos pacienteId aquí para mantener deshabilitados los otros campos
    }
  }

  const seleccionarPacienteParaConsulta = (paciente: Paciente) => {
    nuevaConsulta.pacienteId = paciente.id
    pacienteSearchText.value = `${paciente.nombre} ${paciente.apellido} (C.I: ${paciente.cedula})`
    pacienteNoEncontradoMsg.value = '' // Limpia el mensaje de error
    // Opcional: limpiar la búsqueda modal si quieres
    // busquedaCedulaPacienteModal.value = '';
  }

  // Finalizar Consulta: Selección de Medicamento
  const selectMedicamentoParaAgregar = (medicamento: Medicamento) => {
    medicamentoSeleccionadoParaAgregar.value = medicamento
    medicamentoSearchTextModal.value = medicamento.nombreGenerico
    showMedicamentoOptionsModal.value = false // Cierra el dropdown
  }

  const handleMedicamentoBlur = () => {
    // Retraso para permitir clic en opción antes de cerrar
    setTimeout(() => {
      showMedicamentoOptionsModal.value = false
    }, 150)
  }

  const agregarPrescripcionALista = () => {
    if (!medicamentoSeleccionadoParaAgregar.value || !indicacionesParaAgregar.value) {
      alert('Debe seleccionar un medicamento e ingresar las indicaciones.')
      return
    }
    prescripcionesNuevas.value.push({
      medicamentoId: medicamentoSeleccionadoParaAgregar.value.id,
      nombreMedicamento: medicamentoSeleccionadoParaAgregar.value.nombreGenerico,
      indicaciones: indicacionesParaAgregar.value,
    })
    cerrarModalAgregarMedicamento() // Cierra el modal pequeño
  }

  const eliminarPrescripcionDeLista = (index: number) => {
    prescripcionesNuevas.value.splice(index, 1)
  }

  // Perfil: Inicializa el editable cuando medicoInfo cambia
  watch(
    medicoInfo,
    (newInfo) => {
      if (newInfo.nombreCompleto) {
        const [nombre = '', ...apellidoParts] = newInfo.nombreCompleto.split(' ')
        medicoEditable.nombre = nombre
        medicoEditable.apellido = apellidoParts.join(' ')
        medicoEditable.password = '' // Resetea password al cargar
      } else {
        // Si no hay info, resetea el editable también
        medicoEditable.nombre = ''
        medicoEditable.apellido = ''
        medicoEditable.password = ''
      }
    },
    { immediate: true },
  ) // immediate para que se ejecute al inicio

  return {
    // Visibilidad
    showModalNuevaConsulta,
    showModalFinalizarConsulta,
    showModalAgregarMedicamento,
    showModalNuevoPaciente,
    showModalHistorialPaciente,
    showModalMedicamento,
    // Estado de selección
    consultaSeleccionada,
    pacienteSeleccionado,
    modoEdicionMedicamento,
    // Datos editables/nuevos
    medicoEditable,
    nuevoPaciente,
    pacienteEditable,
    nuevaConsulta,
    nuevoDiagnostico,
    prescripcionesNuevas,
    medicamentoEditable,
    // Estado interno de modales
    busquedaCedulaPacienteModal,
    pacienteNoEncontradoMsg,
    pacienteSearchText,
    medicamentoSeleccionadoParaAgregar,
    indicacionesParaAgregar,
    medicamentoSearchTextModal,
    showMedicamentoOptionsModal,
    // Funciones Abrir/Cerrar
    abrirModalNuevaConsulta,
    cerrarModalNuevaConsulta,
    abrirModalFinalizarConsulta,
    cerrarModalFinalizarConsulta,
    abrirModalAgregarMedicamento,
    cerrarModalAgregarMedicamento,
    abrirModalNuevoPaciente,
    cerrarModalNuevoPaciente,
    abrirModalHistorialPaciente,
    cerrarModalHistorialPaciente,
    abrirModalMedicamento,
    cerrarModalMedicamento,
    // Lógica específica
    buscarPacientePorCedulaAutoSelect,
    seleccionarPacienteParaConsulta,
    selectMedicamentoParaAgregar,
    handleMedicamentoBlur,
    agregarPrescripcionALista,
    eliminarPrescripcionDeLista,
  }
}
