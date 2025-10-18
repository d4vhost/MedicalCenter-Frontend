// src/composables/portalMedico/useMedicoUI.ts
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue' // Removed unused 'computed'

// Recibe las refs de paginación desde useMedicoData
export function useMedicoUI(
  currentPageConsultas: Ref<number>,
  totalPagesConsultas: Ref<number>,
  currentPagePacientes: Ref<number>,
  totalPagesPacientes: Ref<number>,
  currentPageMedicamentos: Ref<number>,
  totalPagesMedicamentos: Ref<number>,
  currentPageHistorial: Ref<number>,
  totalPagesHistorial: Ref<number>,
  upcomingAppointmentsPage: Ref<number>,
  totalCitasPages: Ref<number>,
) {
  const isDarkMode = ref(false)
  const isSidebarOpen = ref(false)
  const isSmallScreen = ref(window.innerWidth <= 768)
  const activeTab = ref('consultas') // Estado de la pestaña activa

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
    // Si la pantalla deja de ser pequeña y el sidebar estaba abierto (probablemente por modo responsive), ciérralo.
    if (!isSmallScreen.value && wasSmall && isSidebarOpen.value) {
      isSidebarOpen.value = false
    }
    // Si la pantalla se vuelve pequeña, asegúrate de que el sidebar esté cerrado inicialmente.
    // Esto es útil si se redimensiona a pequeño mientras el sidebar está visible en modo no-responsive.
    else if (isSmallScreen.value && !wasSmall) {
      isSidebarOpen.value = false // Opcional: cierra automáticamente al volverse pequeño
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
    currentPageHistorial.value = 1 // Aunque este se maneja en el modal, no está mal resetearlo
    upcomingAppointmentsPage.value = 1 // Para el perfil
  }

  // --- Lógica de Paginación ---
  const nextPage = (tab: 'consultas' | 'pacientes' | 'medicamentos' | 'historial' | 'citas') => {
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
      case 'citas':
        if (upcomingAppointmentsPage.value < totalCitasPages.value) upcomingAppointmentsPage.value++
        break
    }
  }

  const prevPage = (tab: 'consultas' | 'pacientes' | 'medicamentos' | 'historial' | 'citas') => {
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
      case 'citas':
        if (upcomingAppointmentsPage.value > 1) upcomingAppointmentsPage.value--
        break
    }
  }

  // Resetea paginación cuando cambian los filtros (ejemplo para consultas)
  // Esto debería hacerse en useMedicoData donde están los watchers de filtros
  // watch([busquedaConsultaCedula, busquedaConsultaFecha, mostrarSoloPendientes], () => {
  //     currentPageConsultas.value = 1;
  // });
  // [...] otros watchers para otros filtros

  onMounted(() => {
    aplicarTema()
    window.addEventListener('resize', handleResize)
    handleResize() // Llama inicialmente
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    // Limpia la clase del body si es necesario al salir de la vista
    // document.body.classList.remove('dark-mode');
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
    // No necesita exponer las refs de paginación ya que las recibe
  }
}
