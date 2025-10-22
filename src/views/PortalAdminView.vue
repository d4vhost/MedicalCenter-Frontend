// src/views/PortalAdminView.vue
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
          <h1 class="title">Portal Administrativo</h1>
          <p class="welcome-message">Bienvenido, {{ adminInfo.nombreCompleto }}</p>
        </div>
      </div>
      <button @click="toggleTheme" class="theme-toggle" aria-label="Toggle theme">
        <svg
          v-if="!isDarkMode"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </header>

    <div class="content">
      <div
        v-if="isSidebarOpen && isSmallScreen"
        class="sidebar-overlay"
        @click="closeSidebar"
      ></div>
      <AdminSidebar
        :activeTab="activeTab"
        :isOpen="isSidebarOpen"
        :isSmallScreen="isSmallScreen"
        @setActiveTab="setActiveTab"
        @logout="logout"
        @goToProfile="goToProfile"
        @closeSidebar="closeSidebar"
      />

      <main class="main-panel">
        <TabDashboard
          v-if="activeTab === 'dashboard'"
          :totalMedicos="medicosFiltrados.length"
          :totalPacientes="totalPacientes"
          :totalCentros="centrosFiltrados.length"
          :totalEspecialidades="especialidadesFiltradas.length"
        />

        <TabMedicos
          v-else-if="activeTab === 'medicos'"
          :paginatedMedicos="paginatedMedicos"
          :currentPageMedicos="currentPageMedicos"
          :totalPagesMedicos="totalPagesMedicos"
          v-model:busquedaEmpleado="busquedaEmpleado"
          @abrirModalEmpleado="abrirModalEmpleado"
          @prevPage="prevPage('medicos')"
          @nextPage="nextPage('medicos')"
        />

        <TabPacientes
          v-else-if="activeTab === 'pacientes'"
          :pacientesDiagnosticadosFiltrados="pacientesDiagnosticadosFiltrados"
          :pacientesNoDiagnosticadosFiltrados="pacientesNoDiagnosticadosFiltrados"
          v-model:busquedaDiagnosticados="busquedaDiagnosticados"
          v-model:busquedaNoDiagnosticados="busquedaNoDiagnosticados"
          :totalPacientes="totalPacientes"
          :totalPacientesDiagnosticados="totalPacientesDiagnosticados"
        />

        <TabCentros
          v-else-if="activeTab === 'centros'"
          :paginatedCentros="paginatedCentros"
          :currentPageCentros="currentPageCentros"
          :totalPagesCentros="totalPagesCentros"
          v-model:busquedaCentro="busquedaCentro"
          @abrirModalCentro="abrirModalCentro"
          @prevPage="prevPage('centros')"
          @nextPage="nextPage('centros')"
        />

        <TabEspecialidades
          v-else-if="activeTab === 'especialidades'"
          :paginatedEspecialidades="paginatedEspecialidades"
          :currentPageEspecialidades="currentPageEspecialidades"
          :totalPagesEspecialidades="totalPagesEspecialidades"
          v-model:busquedaEspecialidad="busquedaEspecialidad"
          @abrirModalEspecialidad="abrirModalEspecialidad"
          @prevPage="prevPage('especialidades')"
          @nextPage="nextPage('especialidades')"
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
          :adminInfo="adminInfo"
          :adminEditable="adminEditable"
          :centrosMedicos="centrosMedicos"
          @update:adminEditable="Object.assign(adminEditable, $event)"
          @actualizarPerfil="actualizarPerfil"
        />
      </main>
    </div>

    <ModalEmpleado
      :show="showModalEmpleado"
      :esEdicion="modoEdicion"
      :empleadoData="medicoEditable"
      :centrosMedicos="centrosMedicos"
      :especialidades="especialidades"
      @close="cerrarModalEmpleado"
      @submitEmpleado="() => guardarMedico(medicoEditable, modoEdicion)"
      @eliminarEmpleado="eliminarMedico"
      @update:empleadoData="Object.assign(medicoEditable, $event)"
    />

    <ModalCentro
      :show="showModalCentro"
      :esEdicion="modoEdicionCentro"
      :centroData="centroEditable"
      @close="cerrarModalCentro"
      @submitCentro="() => guardarCentro(centroEditable, modoEdicionCentro)"
      @eliminarCentro="eliminarCentro"
      @update:centroData="Object.assign(centroEditable, $event)"
    />

    <ModalEspecialidad
      :show="showModalEspecialidad"
      :esEdicion="modoEdicionEspecialidad"
      :especialidadData="especialidadEditable"
      @close="cerrarModalEspecialidad"
      @submitEspecialidad="() => guardarEspecialidad(especialidadEditable, modoEdicionEspecialidad)"
      @eliminarEspecialidad="eliminarEspecialidad"
      @update:especialidadData="Object.assign(especialidadEditable, $event)"
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
// src/views/PortalAdminView.vue - SECCIÓN DE SCRIPT ACTUALIZADA
import { onMounted, watch, provide, ref, type Ref } from 'vue'
import AdminSidebar from '@/components/portalAdmin/AdminSidebar.vue'
import TabDashboard from '@/components/portalAdmin/tabs/TabDashboard.vue'
import TabMedicos from '@/components/portalAdmin/tabs/TabMedicos.vue'
import TabPacientes from '@/components/portalAdmin/tabs/TabPacientes.vue'
import TabCentros from '@/components/portalAdmin/tabs/TabCentros.vue'
import TabEspecialidades from '@/components/portalAdmin/tabs/TabEspecialidades.vue'
import TabMedicamentos from '@/components/portalAdmin/tabs/TabMedicamentos.vue'
import TabPerfil from '@/components/portalAdmin/tabs/TabPerfil.vue'
import ModalEmpleado from '@/components/portalAdmin/modals/ModalEmpleado.vue'
import ModalCentro from '@/components/portalAdmin/modals/ModalCentro.vue'
import ModalEspecialidad from '@/components/portalAdmin/modals/ModalEspecialidad.vue'
import ModalMedicamento from '@/components/portalAdmin/modals/ModalMedicamento.vue'

import { useAdminData } from '@/composables/portalAdmin/useAdminData'
import { useAdminModals } from '@/composables/portalAdmin/useAdminModals'
import { useAdminActions } from '@/composables/portalAdmin/useAdminActions'
import { useAdminUI } from '@/composables/portalAdmin/useAdminUI'
import { useAdminTables } from '@/composables/portalAdmin/useAdminTables'
import type { Consulta, CentroMedico, MedicoDetallado } from '@/types/adminPortal'

// Estado de carga
const isLoadingData = ref(true)

const {
  empleados,
  medicos,
  pacientes,
  centrosMedicos,
  especialidades,
  medicamentos,
  consultas,
  diagnosticos,
  adminInfo,
  cargarDatos,
  logout,
} = useAdminData()

const {
  currentPageMedicos,
  currentPageCentros,
  currentPageEspecialidades,
  currentPageMedicamentos,
  busquedaEmpleado,
  busquedaCentro,
  busquedaEspecialidad,
  busquedaMedicamento,
  busquedaDiagnosticados,
  busquedaNoDiagnosticados,
  medicosFiltrados,
  totalPagesMedicos,
  paginatedMedicos,
  pacientesDiagnosticadosFiltrados,
  pacientesNoDiagnosticadosFiltrados,
  centrosFiltrados,
  totalPagesCentros,
  paginatedCentros,
  especialidadesFiltradas,
  totalPagesEspecialidades,
  paginatedEspecialidades,
  totalPagesMedicamentos,
  paginatedMedicamentos,
  resetPagination,
  totalPacientes,
  totalPacientesDiagnosticados,
} = useAdminTables(
  empleados,
  medicos,
  pacientes,
  centrosMedicos,
  especialidades,
  medicamentos,
  consultas,
  diagnosticos,
)

const {
  activeTab,
  isDarkMode,
  isSidebarOpen,
  isSmallScreen,
  toggleTheme,
  toggleSidebar,
  closeSidebar,
  setActiveTab,
  nextPage,
  prevPage,
} = useAdminUI(
  currentPageMedicos,
  totalPagesMedicos,
  currentPageCentros,
  totalPagesCentros,
  currentPageEspecialidades,
  totalPagesEspecialidades,
  currentPageMedicamentos,
  totalPagesMedicamentos,
  resetPagination,
)

const {
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
} = useAdminModals(adminInfo)

const {
  guardarMedico,
  eliminarMedico,
  guardarCentro,
  eliminarCentro,
  guardarEspecialidad,
  eliminarEspecialidad,
  guardarMedicamento,
  eliminarMedicamento,
  actualizarPerfil,
} = useAdminActions(
  cargarDatos,
  cerrarModalEmpleado,
  cerrarModalCentro,
  cerrarModalEspecialidad,
  cerrarModalMedicamento,
  adminInfo,
)

// IMPORTANTE: Crear un computed para medicosDetallados
// Este computed viene de useAdminTables pero necesitas exportarlo
// Por ahora, vamos a calcular medicosDetallados aquí directamente
import { computed } from 'vue'

const medicosDetallados = computed((): MedicoDetallado[] => {
  const empleadosMap = new Map(empleados.value.map((e) => [e.id, e]))
  const especialidadesMap = new Map(especialidades.value.map((e) => [e.id, e.nombre]))
  const centrosMap = new Map(centrosMedicos.value.map((c) => [c.id, c.nombre]))

  return medicos.value
    .map((medico) => {
      const empleado = empleadosMap.get(medico.empleadoId)
      if (!empleado) return null

      return {
        ...empleado,
        id: empleado.id,
        medicoId: medico.id,
        especialidadId: medico.especialidadId,
        especialidadNombre: especialidadesMap.get(medico.especialidadId) || 'N/A',
        nombreCentroMedico: centrosMap.get(empleado.centroMedicoId) || 'N/A',
      } as MedicoDetallado
    })
    .filter((m): m is MedicoDetallado => m !== null)
    .sort((a, b) => a.apellido.localeCompare(b.apellido))
})

// Proveer datos necesarios para componentes hijos
provide<Ref<Consulta[]>>(Symbol.for('adminConsultas'), consultas)
provide<Ref<MedicoDetallado[]>>(Symbol.for('adminMedicosDetallados'), medicosDetallados)
provide<Ref<CentroMedico[]>>(Symbol.for('adminCentrosMedicos'), centrosMedicos)
provide<Ref<boolean>>(Symbol.for('isDarkMode'), isDarkMode)
provide<Ref<boolean>>(Symbol.for('isLoadingAdminData'), isLoadingData)

const goToProfile = () => {
  setActiveTab('perfil')
  initializeAdminEditable()
}

watch(
  adminInfo,
  (newInfo) => {
    if (newInfo.id && activeTab.value === 'perfil') {
      initializeAdminEditable()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  isLoadingData.value = true
  try {
    await cargarDatos()
  } finally {
    isLoadingData.value = false
  }

  // Logs para debugging
  console.log('Consultas cargadas:', consultas.value.length)
  console.log('Médicos cargados:', medicos.value.length)
  console.log('Centros médicos cargados:', centrosMedicos.value.length)
})
</script>

<style>
@import '@/styles/portalAdmin.css';
</style>
