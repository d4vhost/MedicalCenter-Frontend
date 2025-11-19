<template>
  <div class="page-container" :class="{ 'dark-mode': isDarkMode }">
    <header class="header">
      <div class="header-content">
        <button class="hamburger-button" @click="toggleSidebar" aria-label="TOGGLE SIDEBAR">
          <Menu :size="24" />
        </button>
        <div class="title-container">
          <h1 class="title">PORTAL ADMINISTRATIVO</h1>
          <p class="welcome-message">BIENVENIDO, {{ adminInfo.nombreCompleto }}</p>
        </div>
      </div>
      <button @click="toggleTheme" class="theme-toggle" aria-label="TOGGLE THEME">
        <Sun v-if="!isDarkMode" :size="20" />
        <Moon v-else :size="20" />
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
          :medicosFiltrados="medicosFiltrados"
          @abrirModalEmpleado="abrirModalEmpleado"
          @prevPage="prevPage('medicos')"
          @nextPage="nextPage('medicos')"
        />

        <TabPacientes v-else-if="activeTab === 'pacientes'" />

        <TabCentros
          v-else-if="activeTab === 'centros'"
          :paginatedCentros="paginatedCentros"
          :currentPageCentros="currentPageCentros"
          :totalPagesCentros="totalPagesCentros"
          v-model:busquedaCentro="busquedaCentro"
          :centrosFiltrados="centrosFiltrados"
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
          :especialidadesFiltradas="especialidadesFiltradas"
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
          :medicamentosFiltrados="medicamentosFiltrados"
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
import { onMounted, watch, provide, ref, computed, type Ref } from 'vue'
import { Menu, Sun, Moon } from 'lucide-vue-next'

// Componentes
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

// Composables
import { useAdminData } from '@/composables/portalAdmin/useAdminData'
import { useAdminModals } from '@/composables/portalAdmin/useAdminModals'
import { useAdminActions } from '@/composables/portalAdmin/useAdminActions'
import { useAdminUI } from '@/composables/portalAdmin/useAdminUI'
import { useAdminTables } from '@/composables/portalAdmin/useAdminTables'

// Tipos
import type {
  Consulta,
  CentroMedico,
  MedicoDetallado,
  Paciente,
  Diagnostico,
  Empleado,
  Medico,
} from '@/types/adminPortal'

// --- 1. FUNCIÓN PARA DECODIFICAR EL TOKEN JWT ---
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

// Estado de carga global
const isLoadingData = ref(true)

const adminDataComposable = useAdminData()

const {
  empleados,
  medicos,
  pacientes,
  centrosMedicos,
  especialidades,
  medicamentos,
  consultas,
  diagnosticos,
  fetchAdminData,
} = adminDataComposable

// --- 2. ESTADO DEL ADMINISTRADOR (Inicializado en 0/Vacio) ---
// Ya no ponemos ID: 1 fijo, sino que esperamos a leer el token
const adminInfo = ref({
  id: 0,
  nombreCompleto: '',
  email: '',
  rol: '',
  centroMedicoId: 0,
})

// Configuración de tablas y paginación
const {
  currentPageMedicos,
  currentPageCentros,
  currentPageEspecialidades,
  currentPageMedicamentos,
  busquedaEmpleado,
  busquedaCentro,
  busquedaEspecialidad,
  busquedaMedicamento,
  medicosFiltrados,
  totalPagesMedicos,
  paginatedMedicos,
  centrosFiltrados,
  totalPagesCentros,
  paginatedCentros,
  especialidadesFiltradas,
  totalPagesEspecialidades,
  paginatedEspecialidades,
  medicamentosFiltrados,
  totalPagesMedicamentos,
  paginatedMedicamentos,
  resetPagination,
  totalPacientes,
  ITEMS_PER_PAGE_DEFAULT,
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

// UI y Navegación
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

// Modales
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

// Acciones (Guardar, Eliminar, Actualizar Perfil)
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
  logout,
} = useAdminActions(
  fetchAdminData,
  cerrarModalEmpleado,
  cerrarModalCentro,
  cerrarModalEspecialidad,
  cerrarModalMedicamento,
  adminInfo,
)

// Propiedad computada para combinar datos de Médico + Empleado + Especialidad
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

// Proveer datos a componentes hijos
provide<Ref<Paciente[]>>(Symbol.for('adminPacientes'), pacientes)
provide<Ref<Diagnostico[]>>(Symbol.for('adminDiagnosticos'), diagnosticos)
provide<Ref<Empleado[]>>(Symbol.for('adminEmpleados'), empleados)
provide<Ref<Medico[]>>(Symbol.for('adminMedicos'), medicos)
provide<Ref<Consulta[]>>(Symbol.for('adminConsultas'), consultas)
provide<Ref<MedicoDetallado[]>>(Symbol.for('adminMedicosDetallados'), medicosDetallados)
provide<Ref<CentroMedico[]>>(Symbol.for('adminCentrosMedicos'), centrosMedicos)
provide<Ref<boolean>>(Symbol.for('isDarkMode'), isDarkMode)
provide<Ref<boolean>>(Symbol.for('isLoadingAdminData'), isLoadingData)
provide<number>('ITEMS_PER_PAGE_DEFAULT', ITEMS_PER_PAGE_DEFAULT)

const goToProfile = () => {
  setActiveTab('perfil')
  initializeAdminEditable()
}

// Observar cambios en adminInfo para actualizar formulario de perfil si es necesario
watch(
  adminInfo,
  (newInfo) => {
    if (newInfo && newInfo.id && activeTab.value === 'perfil') {
      initializeAdminEditable()
    }
  },
  { immediate: true },
)

// --- 3. ONMOUNTED: CARGAR TOKEN, EXTRAER ID Y CARGAR DATOS ---
onMounted(async () => {
  isLoadingData.value = true

  // A) LEER Y DECODIFICAR TOKEN
  const token = localStorage.getItem('authToken')
  if (token) {
    const decoded = parseJwt(token)
    if (decoded) {
      console.log('🔑 Datos del usuario (Token):', decoded)

      // Asignamos los datos REALES al adminInfo
      adminInfo.value = {
        id: parseInt(decoded.nameid) || 0, // ¡ESTO TOMA EL ID 2 CORRECTAMENTE!
        nombreCompleto: `${decoded.given_name} ${decoded.family_name}`,
        email: 'admin@hospital.com', // Email ficticio o vacio si no viene en el token
        rol: decoded.role,
        centroMedicoId: parseInt(decoded.centro_medico_id) || 0,
      }
    }
  } else {
    // Si no hay token, idealmente redirigir a login
    console.warn('No se encontró token en localStorage')
  }

  // B) CARGAR DATOS DE LA API
  try {
    await fetchAdminData()
  } finally {
    isLoadingData.value = false
  }

  // Logs de control
  console.log('CONSULTAS CARGADAS:', consultas.value.length)
  console.log('MÉDICOS CARGADOS:', medicos.value.length)
  console.log('CENTROS MÉDICOS CARGADOS:', centrosMedicos.value.length)
  console.log('PACIENTES CARGADOS:', pacientes.value.length)
})
</script>

<style>
@import '@/styles/portalAdmin.css';
</style>
