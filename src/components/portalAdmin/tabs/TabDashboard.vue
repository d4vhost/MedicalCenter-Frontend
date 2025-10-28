<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Dashboard</h2>
    </div>

    <div class="stats-grid-full">
      <div class="stat-card">
        <h3>Médicos</h3>
        <p class="stat-number">{{ totalMedicos }}</p>
      </div>
      <div class="stat-card">
        <h3>Pacientes</h3>
        <p class="stat-number">{{ totalPacientes }}</p>
      </div>
      <div class="stat-card">
        <h3>Centros Médicos</h3>
        <p class="stat-number">{{ totalCentros }}</p>
      </div>
      <div class="stat-card">
        <h3>Especialidades</h3>
        <p class="stat-number">{{ totalEspecialidades }}</p>
      </div>
    </div>

    <div class="charts-grid dashboard-charts">
      <div class="card chart-container">
        <h4>Consultas últimos 7 días</h4>
        <div class="chart-placeholder" v-if="isLoadingData">Cargando datos de consultas... ⏳</div>
        <div class="chart-placeholder" v-else-if="!chartOptionsConsultas">
          No hay datos de consultas recientes para mostrar. 📊
        </div>
        <v-chart v-else class="chart" :option="chartOptionsConsultas" autoresize />
      </div>
      <div class="card chart-container">
        <h4>Médicos por Centro</h4>
        <div class="chart-placeholder" v-if="isLoadingData">Cargando datos de médicos... ⏳</div>
        <div class="chart-placeholder" v-else-if="!chartOptionsMedicos">
          No hay datos de médicos para mostrar. 🧑‍⚕️
        </div>
        <v-chart v-else class="chart" :option="chartOptionsMedicos" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ---- CORRECCIÓN: 'provide' ya no es necesario si no usas THEME_KEY ----
// import { ref, provide, inject, computed, type Ref } from 'vue'
import { ref, inject, type Ref } from 'vue'
import VChart /* ---- CORRECCIÓN: THEME_KEY ya no es necesario ---- , { THEME_KEY } */ from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
} from 'echarts/components'
import { useAdminCharts } from '@/composables/portalAdmin/useAdminCharts'
import type { Consulta, MedicoDetallado, CentroMedico } from '@/types/adminPortal'

// Registrar componentes ECharts
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
])

// --- Inyectar datos y estado de carga ---
const consultas = inject<Ref<Consulta[]>>(Symbol.for('adminConsultas'), ref<Consulta[]>([]))
const medicosDetallados = inject<Ref<MedicoDetallado[]>>(
  Symbol.for('adminMedicosDetallados'),
  ref<MedicoDetallado[]>([]),
)
const centrosMedicos = inject<Ref<CentroMedico[]>>(
  Symbol.for('adminCentrosMedicos'),
  ref<CentroMedico[]>([]),
)
const isDarkMode = inject<Ref<boolean>>(Symbol.for('isDarkMode'), ref(false))
const isLoadingData = inject<Ref<boolean>>(Symbol.for('isLoadingAdminData'), ref(true)) // Inyectar estado

// --- Usar el composable de gráficos ---
// ---- NUEVO: Pasar isDarkMode al composable ----
const { chartOptionsConsultas, chartOptionsMedicos } = useAdminCharts(
  consultas,
  medicosDetallados,
  centrosMedicos,
  isDarkMode, // <--- Pasar la referencia
)
// -----------------------------------------

// --- Props ---
defineProps<{
  totalMedicos: number
  totalPacientes: number
  totalCentros: number
  totalEspecialidades: number
}>()

// --- Tema de ECharts (Opcional si ya se maneja en options) ---
// const chartTheme = computed(() => (isDarkMode.value ? 'dark' : 'light'))
// provide(THEME_KEY, chartTheme)
// -------------------------------------------------------------
</script>

<style scoped>
.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  height: 300px;
  color: var(--text-muted-color);
  font-style: italic;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 1rem;
  text-align: center;
  padding: 1rem;
  gap: 0.5rem;
}

.chart {
  min-height: 300px;
  height: 300px;
}
</style>
