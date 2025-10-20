<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <button class="hamburger-button" @click="toggleSidebar" aria-label="Toggle Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        <div class="title-container">
          <h1 class="title">Portal del Médico</h1>
          <p class="welcome-message">Bienvenido, Dr. {{ medico.nombreCompleto }}</p>
        </div>
      </div>
      <button class="theme-toggle" @click="toggleTheme" aria-label="Cambiar tema">
        <svg
          v-if="isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 9c1.65 0 3 1.35 3 3s-1.35 3-3 3s-3-1.35-3-3s1.35-3 3-3m0-2c-2.76 0-5 2.24-5 5s2.24 5 5 5s5-2.24 5-5s-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L5.99 4.58zm12.73 12.73a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06zM18.01 4.58a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0zM4.58 18.01a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41l-1.06-1.06a.996.996 0 0 0-1.41 0z"
          />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26a5.403 5.403 0 0 1-5.4-5.4c0-1.81 1-3.35 2.26-4.4A8.995 8.995 0 0 0 12 3z"
          />
        </svg>
      </button>
    </header>

    <main class="content">
      <div
        v-if="isSidebarOpen && isSmallScreen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
      <MedicoSidebar
        :activeTab="activeTab"
        :isOpen="isSidebarOpen"
        :isSmallScreen="isSmallScreen"
        @setActiveTab="setActiveTab"
        @logout="logoutAction"
        @closeSidebar="closeSidebar"
      />

      <div class="main-panel">
        <TabConsultas
          v-if="activeTab === 'consultas'"
          :paginatedConsultas="paginatedConsultas"
          :currentPageConsultas="currentPageConsultas"
          :totalPagesConsultas="totalPagesConsultas"
          v-model:busquedaConsultaCedula="busquedaConsultaCedula"
          v-model:busquedaConsultaFecha="busquedaConsultaFecha"
          @abrirModalNuevaConsulta="abrirModalNuevaConsulta"
          @seleccionarConsulta="abrirModalFinalizarConsulta"
          @prevPage="prevPage('consultas')"
          @nextPage="nextPage('consultas')"
        />
        <TabPacientes
          v-else-if="activeTab === 'pacientes'"
          :paginatedPacientes="paginatedPacientes"
          :currentPagePacientes="currentPagePacientes"
          :totalPagesPacientes="totalPagesPacientes"
          v-model:busquedaPacienteCedula="busquedaPacienteCedula"
          @abrirModalNuevoPaciente="abrirModalNuevoPaciente"
          @seleccionarPaciente="abrirModalHistorialPacienteConCarga"
          @prevPage="prevPage('pacientes')"
          @nextPage="nextPage('pacientes')"
        />
        <TabMedicamentos
          v-else-if="activeTab === 'medicamentos'"
          :paginatedMedicamentos="paginatedMedicamentos"
          :currentPageMedicamentos="currentPageMedicamentos"
          :totalPagesMedicamentos="totalPagesMedicamentos"
          v-model:busquedaMedicamento="busquedaMedicamento"
          @abrirModalMedicamento="abrirModalMedicamento"
          @prevPage="prevPage('medicamentos')"
          @nextPage="nextPage('medicamentos')"
        />
        <TabPerfil
          v-else-if="activeTab === 'perfil'"
          :medicoInfo="medicoInfo"
          :medicoEditable="medicoEditable"
          :passwordStrength="passwordStrength"
          :paginatedConsultasPerfil="paginatedConsultasPerfil"
          :currentPageConsultasPerfil="currentPageConsultasPerfil"
          :totalPagesConsultasPerfil="totalPagesConsultasPerfil"
          :totalConsultasRealizadas="consultasRealizadasPorMedico.length"
          @update:medicoEditable="Object.assign(medicoEditable, $event)"
          @actualizarPerfil="() => actualizarPerfil(medicoEditable)"
          @prevPage="prevPage('consultasPerfil')"
          @nextPage="nextPage('consultasPerfil')"
        />
      </div>
    </main>

    <ModalNuevaConsulta
      :show="showModalNuevaConsulta"
      :consultaData="nuevaConsulta"
      :busquedaCedula="busquedaCedulaPacienteModal"
      :pacienteNoEncontradoMsg="pacienteNoEncontradoMsg"
      :pacienteSearchText="pacienteSearchText"
      @close="cerrarModalNuevaConsulta"
      @submitConsulta="() => crearConsulta(nuevaConsulta)"
      @buscarPaciente="buscarPacientePorCedulaAutoSelect"
      @update:consultaData="Object.assign(nuevaConsulta, $event)"
      @update:busquedaCedula="busquedaCedulaPacienteModal = $event"
      @handleCedulaInput="handleCedulaInput"
    />

    <ModalFinalizarConsulta
      :show="showModalFinalizarConsulta"
      :consulta="consultaSeleccionada"
      :diagnosticoData="nuevoDiagnostico"
      :prescripciones="prescripcionesNuevas"
      @close="cerrarModalFinalizarConsulta"
      @submitFinalizar="
        () => guardarDiagnosticoYPrescripciones(nuevoDiagnostico, prescripcionesNuevas)
      "
      @update:diagnosticoData="Object.assign(nuevoDiagnostico, $event)"
      @abrirAgregarMedicamento="abrirModalAgregarMedicamento"
      @eliminarPrescripcion="eliminarPrescripcionDeLista"
    />

    <ModalAgregarMedicamento
      :show="showModalAgregarMedicamento"
      :searchText="medicamentoSearchTextModal"
      :showOptions="showMedicamentoOptionsModal"
      :filteredMedicamentos="filteredMedicamentosModal"
      :selectedMedicamento="medicamentoSeleccionadoParaAgregar"
      :indicaciones="indicacionesParaAgregar"
      @close="cerrarModalAgregarMedicamento"
      @agregarPrescripcion="agregarPrescripcionALista"
      @update:searchText="medicamentoSearchTextModal = $event"
      @update:showOptions="showMedicamentoOptionsModal = $event"
      @selectMedicamento="selectMedicamentoParaAgregar"
      @update:indicaciones="indicacionesParaAgregar = $event"
      @blurMedicamentoInput="handleMedicamentoBlur"
    />

    <ModalNuevoPaciente
      :show="showModalNuevoPaciente"
      :pacienteData="nuevoPaciente"
      @close="cerrarModalNuevoPaciente"
      @submitPaciente="() => crearPaciente(nuevoPaciente)"
      @update:pacienteData="Object.assign(nuevoPaciente, $event)"
    />

    <ModalHistorialPaciente
      :show="showModalHistorialPaciente"
      :paciente="pacienteSeleccionado"
      :pacienteEditable="pacienteEditable"
      :paginatedHistorial="paginatedHistorial"
      :currentPageHistorial="currentPageHistorial"
      :totalPagesHistorial="totalPagesHistorial"
      v-model:busquedaFecha="historialBusquedaFecha"
      v-model:busquedaEnfermedad="historialBusquedaEnfermedad"
      @close="cerrarModalHistorialPaciente"
      @submitUpdatePaciente="() => actualizarPaciente(pacienteEditable)"
      @eliminarPaciente="eliminarPaciente"
      @update:pacienteEditable="Object.assign(pacienteEditable, $event)"
      @prevPage="prevPage('historial')"
      @nextPage="nextPage('historial')"
    />

    <ModalMedicamento
      :show="showModalMedicamento"
      :esEdicion="modoEdicionMedicamento"
      :medicamentoData="medicamentoEditable"
      @close="cerrarModalMedicamento"
      @submitMedicamento="() => guardarMedicamento(medicamentoEditable, modoEdicionMedicamento)"
      @eliminarMedicamento="eliminarMedicamento"
      @update:medicamentoData="Object.assign(medicamentoEditable, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, watch } from 'vue'
import '@/styles/portalMedico.css'

// Importar componentes
import MedicoSidebar from '@/components/portalMedico/MedicoSidebar.vue'
import TabConsultas from '@/components/portalMedico/tabs/TabConsultas.vue'
import TabPacientes from '@/components/portalMedico/tabs/TabPacientes.vue'
import TabMedicamentos from '@/components/portalMedico/tabs/TabMedicamentos.vue'
import TabPerfil from '@/components/portalMedico/tabs/TabPerfil.vue'
import ModalNuevaConsulta from '@/components/portalMedico/modals/ModalNuevaConsulta.vue'
import ModalFinalizarConsulta from '@/components/portalMedico/modals/ModalFinalizarConsulta.vue'
import ModalAgregarMedicamento from '@/components/portalMedico/modals/ModalAgregarMedicamento.vue'
import ModalNuevoPaciente from '@/components/portalMedico/modals/ModalNuevoPaciente.vue'
import ModalHistorialPaciente from '@/components/portalMedico/modals/ModalHistorialPaciente.vue'
import ModalMedicamento from '@/components/portalMedico/modals/ModalMedicamento.vue'

// Importar composables
import { useMedicoData } from '@/composables/portalMedico/useMedicoData'
import { useMedicoUI } from '@/composables/portalMedico/useMedicoUI'
import { useMedicoModals } from '@/composables/portalMedico/useMedicoModals'
import { useMedicoActions } from '@/composables/portalMedico/useMedicoActions'
import { useMedicoValidations } from '@/composables/portalMedico/useMedicoValidations'
import type { Paciente, Medicamento } from '@/types/medicoPortal'

// --- Inicializar Composables ---

const {
  medico,
  medicoInfo,
  pacientes,
  medicamentos,
  busquedaConsultaCedula,
  busquedaConsultaFecha,
  currentPageConsultas,
  busquedaPacienteCedula,
  currentPagePacientes,
  busquedaMedicamento,
  currentPageMedicamentos,
  historialBusquedaFecha,
  historialBusquedaEnfermedad,
  currentPageHistorial,
  currentPageConsultasPerfil,
  paginatedConsultas,
  totalPagesConsultas,
  paginatedPacientes,
  totalPagesPacientes,
  paginatedMedicamentos,
  totalPagesMedicamentos,
  consultasRealizadasPorMedico,
  paginatedConsultasPerfil,
  totalPagesConsultasPerfil,
  paginatedHistorial,
  totalPagesHistorial,
  cargarDatosIniciales,
  cargarHistorialPaciente,
  // ELIMINADO: logout, ya que se usa logoutAction de useMedicoActions
} = useMedicoData()

const {
  isDarkMode,
  isSidebarOpen,
  isSmallScreen,
  activeTab,
  toggleTheme,
  toggleSidebar,
  closeSidebar,
  setActiveTab,
  nextPage,
  prevPage,
} = useMedicoUI(
  currentPageConsultas,
  totalPagesConsultas,
  currentPagePacientes,
  totalPagesPacientes,
  currentPageMedicamentos,
  totalPagesMedicamentos,
  currentPageHistorial,
  totalPagesHistorial,
  currentPageConsultasPerfil,
  totalPagesConsultasPerfil,
)

const {
  showModalNuevaConsulta,
  showModalFinalizarConsulta,
  showModalAgregarMedicamento,
  showModalNuevoPaciente,
  showModalHistorialPaciente,
  showModalMedicamento,
  consultaSeleccionada,
  pacienteSeleccionado,
  modoEdicionMedicamento,
  medicoEditable,
  nuevoPaciente,
  pacienteEditable,
  nuevaConsulta,
  nuevoDiagnostico,
  prescripcionesNuevas,
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
  cerrarModalMedicamento,
  buscarPacientePorCedulaAutoSelect,
  selectMedicamentoParaAgregar,
  handleMedicamentoBlur,
  agregarPrescripcionALista,
  eliminarPrescripcionDeLista,
} = useMedicoModals(pacientes, medicamentos, medicoInfo)

const medicoPasswordRef = computed(() => medicoEditable.password)
const { passwordStrength, handleNumericInput } = useMedicoValidations(medicoPasswordRef)

const {
  guardarDiagnosticoYPrescripciones,
  actualizarPerfil,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
  guardarMedicamento,
  eliminarMedicamento,
  crearConsulta,
  logoutAction,
} = useMedicoActions(
  medico,
  medicoInfo,
  cargarDatosIniciales,
  cerrarModalFinalizarConsulta,
  cerrarModalNuevoPaciente,
  cerrarModalHistorialPaciente,
  cerrarModalMedicamento,
  cerrarModalNuevaConsulta,
)

// --- Lógica Adicional y Watchers ---

const abrirModalMedicamento = (medicamento: Medicamento | null) => {
  modoEdicionMedicamento.value = !!medicamento
  Object.assign(
    medicamentoEditable,
    medicamento ? { ...medicamento } : { nombreGenerico: '', nombreComercial: '', laboratorio: '' },
  )
  showModalMedicamento.value = true
}

const abrirModalHistorialPacienteConCarga = async (paciente: Paciente) => {
  abrirModalHistorialPaciente(paciente)
  await cargarHistorialPaciente(paciente.id)
  currentPageHistorial.value = 1
  historialBusquedaFecha.value = ''
  historialBusquedaEnfermedad.value = ''
}

const filteredMedicamentosModal = computed(() => {
  if (!medicamentoSearchTextModal.value) return medicamentos.value
  const search = medicamentoSearchTextModal.value.toLowerCase()
  return medicamentos.value.filter((m) => m.nombreGenerico.toLowerCase().includes(search))
})

const handleCedulaInput = (event: Event) => {
  const newValue = handleNumericInput(event, 10)
  busquedaCedulaPacienteModal.value = newValue
}

watch([busquedaConsultaCedula, busquedaConsultaFecha], () => {
  currentPageConsultas.value = 1
})
watch(busquedaPacienteCedula, () => {
  currentPagePacientes.value = 1
})
watch(busquedaMedicamento, () => {
  currentPageMedicamentos.value = 1
})
watch([historialBusquedaFecha, historialBusquedaEnfermedad], () => {
  currentPageHistorial.value = 1
})

onMounted(() => {
  cargarDatosIniciales()
})
</script>
