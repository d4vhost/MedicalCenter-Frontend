// src/composables/portalMedico/useMedicoUI.ts
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export function useMedicoUI(
  currentPageConsultas: Ref<number>,
  totalPagesConsultas: Ref<number>,
  currentPagePacientes: Ref<number>,
  totalPagesPacientes: Ref<number>,
  currentPageMedicamentos: Ref<number>,
  totalPagesMedicamentos: Ref<number>,
  currentPageHistorial: Ref<number>,
  totalPagesHistorial: Ref<number>,
  currentPageConsultasPerfil: Ref<number>, // Renombrado
  totalPagesConsultasPerfil: Ref<number>, // Renombrado
) {
  const isDarkMode = ref(false)
  const isSidebarOpen = ref(false)
  const isSmallScreen = ref(window.innerWidth <= 768)
  const activeTab = ref('consultas')

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    document.body.classList.toggle('dark-mode', isDarkMode.value)
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
  }

  const aplicarTema = () => {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    document.body.classList.toggle('dark-mode', isDarkMode.value)
  }

  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  const closeSidebar = () => {
    isSidebarOpen.value = false
  }

  const handleResize = () => {
    const wasSmall = isSmallScreen.value
    isSmallScreen.value = window.innerWidth <= 768
    if (!isSmallScreen.value && wasSmall && isSidebarOpen.value) {
      isSidebarOpen.value = false
    } else if (isSmallScreen.value && !wasSmall) {
      isSidebarOpen.value = false
    }
  }

  const setActiveTab = (tabName: string) => {
    activeTab.value = tabName
    if (isSmallScreen.value) {
      closeSidebar()
    }
    // Resetea paginación al cambiar de tab
    currentPageConsultas.value = 1
    currentPagePacientes.value = 1
    currentPageMedicamentos.value = 1
    currentPageHistorial.value = 1
    currentPageConsultasPerfil.value = 1 // Resetea paginación del perfil
  }

  const nextPage = (
    tab: 'consultas' | 'pacientes' | 'medicamentos' | 'historial' | 'consultasPerfil',
  ) => {
    // Añadido 'consultasPerfil'
    switch (tab) {
      case 'consultas':
        if (currentPageConsultas.value < totalPagesConsultas.value) currentPageConsultas.value++
        break
      case 'pacientes':
        if (currentPagePacientes.value < totalPagesPacientes.value) currentPagePacientes.value++
        break
      case 'medicamentos':
        if (currentPageMedicamentos.value < totalPagesMedicamentos.value)
          currentPageMedicamentos.value++
        break
      case 'historial':
        if (currentPageHistorial.value < totalPagesHistorial.value) currentPageHistorial.value++
        break
      case 'consultasPerfil': // Nuevo caso
        if (currentPageConsultasPerfil.value < totalPagesConsultasPerfil.value)
          currentPageConsultasPerfil.value++
        break
    }
  }

  const prevPage = (
    tab: 'consultas' | 'pacientes' | 'medicamentos' | 'historial' | 'consultasPerfil',
  ) => {
    // Añadido 'consultasPerfil'
    switch (tab) {
      case 'consultas':
        if (currentPageConsultas.value > 1) currentPageConsultas.value--
        break
      case 'pacientes':
        if (currentPagePacientes.value > 1) currentPagePacientes.value--
        break
      case 'medicamentos':
        if (currentPageMedicamentos.value > 1) currentPageMedicamentos.value--
        break
      case 'historial':
        if (currentPageHistorial.value > 1) currentPageHistorial.value--
        break
      case 'consultasPerfil': // Nuevo caso
        if (currentPageConsultasPerfil.value > 1) currentPageConsultasPerfil.value--
        break
    }
  }

  onMounted(() => {
    aplicarTema()
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
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
  }
}
