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
        <v-chart class="chart" :option="chartConsultasPorDia" autoresize />
      </div>
      <div class="card chart-container">
        <h4>Médicos por Centro</h4>
        <v-chart class="chart" :option="chartMedicosPorCentro" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
// Import the specific ECharts type
import type { ECOption } from '@/composables/portalAdmin/useAdminCharts' // Adjust path if needed

defineProps<{
  totalMedicos: number
  totalPacientes: number
  totalCentros: number
  totalEspecialidades: number
  chartConsultasPorDia: ECOption // Use ECOption type
  chartMedicosPorCentro: ECOption // Use ECOption type
}>()
</script>
