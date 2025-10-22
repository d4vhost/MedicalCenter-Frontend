import { ref, onMounted, watch, provide, computed, type Ref } from 'vue'
import { THEME_KEY } from 'vue-echarts'

export function useAdminUI(
  currentPageMedicos: Ref<number>,
  totalPagesMedicos: Ref<number>,
  currentPageCentros: Ref<number>,
  totalPagesCentros: Ref<number>,
  currentPageEspecialidades: Ref<number>,
  totalPagesEspecialidades: Ref<number>,
  currentPageMedicamentos: Ref<number>,
  totalPagesMedicamentos: Ref<number>,
) {
  const activeTab = ref('dashboard')
  const isDarkMode = ref(false)

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

  const setActiveTab = (tabName: string) => {
    activeTab.value = tabName
    currentPageMedicos.value = 1
    currentPageCentros.value = 1
    currentPageEspecialidades.value = 1
    currentPageMedicamentos.value = 1
  }

  const nextPage = (tab: 'medicos' | 'centros' | 'especialidades' | 'medicamentos') => {
    switch (tab) {
      case 'medicos':
        if (currentPageMedicos.value < totalPagesMedicos.value) currentPageMedicos.value++
        break
      case 'centros':
        if (currentPageCentros.value < totalPagesCentros.value) currentPageCentros.value++
        break
      case 'especialidades':
        if (currentPageEspecialidades.value < totalPagesEspecialidades.value)
          currentPageEspecialidades.value++
        break
      case 'medicamentos':
        if (currentPageMedicamentos.value < totalPagesMedicamentos.value)
          currentPageMedicamentos.value++
        break
    }
  }

  const prevPage = (tab: 'medicos' | 'centros' | 'especialidades' | 'medicamentos') => {
    switch (tab) {
      case 'medicos':
        if (currentPageMedicos.value > 1) currentPageMedicos.value--
        break
      case 'centros':
        if (currentPageCentros.value > 1) currentPageCentros.value--
        break
      case 'especialidades':
        if (currentPageEspecialidades.value > 1) currentPageEspecialidades.value--
        break
      case 'medicamentos':
        if (currentPageMedicamentos.value > 1) currentPageMedicamentos.value--
        break
    }
  }

  onMounted(() => {
    aplicarTema()
  })

  provide(
    THEME_KEY,
    computed(() => (isDarkMode.value ? 'dark' : 'light')),
  )

  watch(isDarkMode, () => {
    provide(
      THEME_KEY,
      computed(() => (isDarkMode.value ? 'dark' : 'light')),
    )
  })

  return {
    activeTab,
    isDarkMode,
    toggleTheme,
    setActiveTab,
    nextPage,
    prevPage,
  }
}
