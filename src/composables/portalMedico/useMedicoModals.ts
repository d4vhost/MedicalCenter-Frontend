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
  Diagnostico,
  PrescripcionExistente,
} from '@/types/medicoPortal'
import { useMedicoData } from './useMedicoData'
import apiClient from '@/services/api'

export function useMedicoModals(
  pacientes: Ref<Paciente[]>,
  medicamentos: Ref<Medicamento[]>,
  medicoInfo: Ref<Partial<MedicoInfo>>,
) {
  const showModalNuevaConsulta = ref(false)
  const showModalFinalizarConsulta = ref(false)
  const showModalAgregarMedicamento = ref(false)
  const showModalNuevoPaciente = ref(false)
  const showModalHistorialPaciente = ref(false)
  const showModalMedicamento = ref(false)

  const consultaSeleccionada = ref<Consulta | null>(null)
  const pacienteSeleccionado = ref<Paciente | null>(null)
  const modoEdicionConsulta = ref(false)
  const modoEdicionMedicamento = ref(false)

  const medicoEditable = reactive<MedicoEditable>({ nombre: '', apellido: '', password: '' })
  const nuevoPaciente = reactive<PacienteEditable>({})
  const pacienteEditable = reactive<PacienteEditable>({})
  const nuevaConsulta = reactive<ConsultaEditable>({
    pacienteId: null,
    medicoId: 0,
    motivo: '',
    fechaHora: '',
  })
  const nuevoDiagnostico = reactive<DiagnosticoEditable>({
    id: undefined,
    consultaId: undefined,
    enfermedadNombre: '',
    observaciones: '',
  })
  const prescripcionesNuevas = ref<PrescripcionNueva[]>([])
  const prescripcionesExistentes = ref<PrescripcionExistente[]>([])
  const prescripcionesParaEliminar = ref<number[]>([])
  const medicamentoEditable = reactive<MedicamentoEditable>({})

  const busquedaCedulaPacienteModal = ref('')
  const pacienteNoEncontradoMsg = ref('')
  const pacienteSearchText = ref('')

  const medicamentoSeleccionadoParaAgregar = ref<Medicamento | null>(null)
  const indicacionesParaAgregar = ref('')
  const medicamentoSearchTextModal = ref('')
  const showMedicamentoOptionsModal = ref(false)

  const { cargarPrescripciones } = useMedicoData()

  const abrirModalNuevaConsulta = () => {
    Object.assign(nuevaConsulta, {
      pacienteId: null,
      medicoId: medicoInfo.value.id ?? 0,
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

  const abrirModalFinalizarConsulta = async (consulta: Consulta) => {
    consultaSeleccionada.value = consulta
    prescripcionesNuevas.value = []
    prescripcionesExistentes.value = []
    prescripcionesParaEliminar.value = []
    medicamentoSeleccionadoParaAgregar.value = null
    indicacionesParaAgregar.value = ''
    medicamentoSearchTextModal.value = ''
    showMedicamentoOptionsModal.value = false

    if (consulta.tieneDiagnostico && consulta.diagnosticoId) {
      modoEdicionConsulta.value = true
      try {
        const token = localStorage.getItem('authToken')
        if (!token) throw new Error('NO AUTENTICADO')
        const config = { headers: { Authorization: `Bearer ${token}` } }
        const { data: diagnosticoExistente } = await apiClient.get<Diagnostico>(
          `/Diagnosticos/${consulta.diagnosticoId}`,
          config,
        )

        if (diagnosticoExistente) {
          Object.assign(nuevoDiagnostico, {
            id: diagnosticoExistente.id,
            consultaId: consulta.id,
            enfermedadNombre: diagnosticoExistente.enfermedadNombre.toUpperCase(),
            observaciones: diagnosticoExistente.observaciones?.toUpperCase() || '',
          })
          prescripcionesExistentes.value = await cargarPrescripciones(diagnosticoExistente.id)
        } else {
          modoEdicionConsulta.value = false
          Object.assign(nuevoDiagnostico, {
            id: undefined,
            consultaId: consulta.id,
            enfermedadNombre: '',
            observaciones: '',
          })
        }
      } catch {
        alert('NO SE PUDIERON CARGAR LOS DATOS PARA EDITAR.')
        cerrarModalFinalizarConsulta()
        return
      }
    } else {
      modoEdicionConsulta.value = false
      Object.assign(nuevoDiagnostico, {
        id: undefined,
        consultaId: consulta.id,
        enfermedadNombre: '',
        observaciones: '',
      })
    }

    showModalFinalizarConsulta.value = true
  }

  const abrirModalAgregarMedicamento = () => {
    medicamentoSeleccionadoParaAgregar.value = null
    indicacionesParaAgregar.value = ''
    medicamentoSearchTextModal.value = ''
    showMedicamentoOptionsModal.value = false
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
    pacienteSeleccionado.value = { ...paciente }
    const fechaFormateada = paciente.fechaNacimiento
      ? new Date(paciente.fechaNacimiento).toISOString().split('T')[0]
      : ''
    Object.assign(pacienteEditable, { ...paciente, fechaNacimiento: fechaFormateada })
    showModalHistorialPaciente.value = true
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

  const cerrarModalNuevaConsulta = () => (showModalNuevaConsulta.value = false)
  const cerrarModalFinalizarConsulta = () => {
    showModalFinalizarConsulta.value = false
    consultaSeleccionada.value = null
    modoEdicionConsulta.value = false
    Object.assign(nuevoDiagnostico, {
      id: undefined,
      consultaId: undefined,
      enfermedadNombre: '',
      observaciones: '',
    })
    prescripcionesNuevas.value = []
    prescripcionesExistentes.value = []
    prescripcionesParaEliminar.value = []
  }
  const cerrarModalAgregarMedicamento = () => (showModalAgregarMedicamento.value = false)
  const cerrarModalNuevoPaciente = () => (showModalNuevoPaciente.value = false)
  const cerrarModalHistorialPaciente = () => {
    showModalHistorialPaciente.value = false
    pacienteSeleccionado.value = null
  }
  const cerrarModalMedicamento = () => (showModalMedicamento.value = false)

  const buscarPacientePorCedulaAutoSelect = () => {
    pacienteNoEncontradoMsg.value = ''
    const cedulaBuscada = busquedaCedulaPacienteModal.value.trim()
    const encontrado = pacientes.value.find((p) => p.cedula === cedulaBuscada)

    if (encontrado) {
      seleccionarPacienteParaConsulta(encontrado)
    } else {
      pacienteNoEncontradoMsg.value = 'PACIENTE NO ENCONTRADO. REGÍSTRELO PRIMERO.'
    }
  }

  const seleccionarPacienteParaConsulta = (paciente: Paciente) => {
    nuevaConsulta.pacienteId = paciente.id
    pacienteSearchText.value = `${paciente.nombre} ${paciente.apellido} (C.I: ${paciente.cedula})`
    pacienteNoEncontradoMsg.value = ''
  }

  const selectMedicamentoParaAgregar = (medicamento: Medicamento) => {
    medicamentoSeleccionadoParaAgregar.value = medicamento
    medicamentoSearchTextModal.value = medicamento.nombreGenerico
    showMedicamentoOptionsModal.value = false
  }

  const handleMedicamentoBlur = () => {
    setTimeout(() => {
      showMedicamentoOptionsModal.value = false
    }, 150)
  }

  const agregarPrescripcionALista = () => {
    if (!medicamentoSeleccionadoParaAgregar.value || !indicacionesParaAgregar.value) {
      alert('DEBE SELECCIONAR UN MEDICAMENTO E INGRESAR LAS INDICACIONES.')
      return
    }
    prescripcionesNuevas.value.push({
      medicamentoId: medicamentoSeleccionadoParaAgregar.value.id,
      nombreMedicamento: medicamentoSeleccionadoParaAgregar.value.nombreGenerico.toUpperCase(),
      indicaciones: indicacionesParaAgregar.value.toUpperCase(),
    })
    cerrarModalAgregarMedicamento()
  }

  const eliminarPrescripcionNuevaDeLista = (index: number) => {
    prescripcionesNuevas.value.splice(index, 1)
  }

  const marcarPrescripcionExistenteParaEliminar = (index: number) => {
    const prescripcionAEliminar = prescripcionesExistentes.value[index]
    if (prescripcionAEliminar?.id) {
      if (!prescripcionesParaEliminar.value.includes(prescripcionAEliminar.id)) {
        prescripcionesParaEliminar.value.push(prescripcionAEliminar.id)
      }
      prescripcionesExistentes.value.splice(index, 1)
    }
  }

  const editarPrescripcionExistente = (index: number) => {
    const prescripcionAEditar = prescripcionesExistentes.value[index]
    if (!prescripcionAEditar) return

    const medicamento = medicamentos.value.find((m) => m.id === prescripcionAEditar.medicamentoId)
    if (medicamento) {
      selectMedicamentoParaAgregar(medicamento)
    }
    indicacionesParaAgregar.value = prescripcionAEditar.indicaciones

    marcarPrescripcionExistenteParaEliminar(index)
    abrirModalAgregarMedicamento()
  }

  watch(
    medicoInfo,
    (newInfo) => {
      if (newInfo.nombreCompleto) {
        const [nombre = '', ...apellidoParts] = newInfo.nombreCompleto.split(' ')
        medicoEditable.nombre = nombre.toUpperCase()
        medicoEditable.apellido = apellidoParts.join(' ').toUpperCase()
        medicoEditable.password = ''
      } else {
        medicoEditable.nombre = ''
        medicoEditable.apellido = ''
        medicoEditable.password = ''
      }
    },
    { immediate: true },
  )

  return {
    showModalNuevaConsulta,
    showModalFinalizarConsulta,
    showModalAgregarMedicamento,
    showModalNuevoPaciente,
    showModalHistorialPaciente,
    showModalMedicamento,
    consultaSeleccionada,
    pacienteSeleccionado,
    modoEdicionConsulta,
    modoEdicionMedicamento,
    medicoEditable,
    nuevoPaciente,
    pacienteEditable,
    nuevaConsulta,
    nuevoDiagnostico,
    prescripcionesNuevas,
    prescripcionesExistentes,
    prescripcionesParaEliminar,
    medicamentoEditable,
    busquedaCedulaPacienteModal,
    pacienteNoEncontradoMsg,
    pacienteSearchText,
    medicamentoSeleccionadoParaAgregar,
    indicacionesParaAgregar,
    medicamentoSearchTextModal,
    showMedicamentoOptionsModal,
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
    buscarPacientePorCedulaAutoSelect,
    seleccionarPacienteParaConsulta,
    selectMedicamentoParaAgregar,
    handleMedicamentoBlur,
    agregarPrescripcionALista,
    eliminarPrescripcionNuevaDeLista,
    marcarPrescripcionExistenteParaEliminar,
    editarPrescripcionExistente,
  }
}
