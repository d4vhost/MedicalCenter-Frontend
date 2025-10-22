<template>
  <div class="tab-content patient-tab-layout">
    <div class="tab-header">
      <h2>Gestión de Pacientes</h2>
    </div>

    <div class="patient-charts-layout">
      <div class="card chart-container">
        <h4>Distribución por Edad</h4>
        <v-chart class="chart" :option="chartDistribucionEdad" autoresize />
      </div>
      <div class="card chart-container">
        <h4>Estado de Diagnóstico</h4>
        <v-chart class="chart" :option="chartPacientesDiagnosticados" autoresize />
      </div>
    </div>

    <div class="patient-lists-grid">
      <div class="patient-list-container">
        <div class="list-header">
          <h4>Diagnosticados</h4>
          <span class="list-counter">{{ pacientesDiagnosticadosFiltrados.length }}</span>
        </div>
        <input
          :value="busquedaDiagnosticados"
          @input="$emit('update:busquedaDiagnosticados', ($event.target as HTMLInputElement).value)"
          type="text"
          placeholder="Buscar por cédula, nombre o apellido..."
          class="mini-search"
        />
        <ul class="patient-list">
          <li v-for="p in pacientesDiagnosticadosFiltrados" :key="p.id">
            <span class="status-dot diagnosed"></span>
            <div class="item-main-info">
              <span class="item-title">{{ p.nombre }} {{ p.apellido }}</span>
              <span class="item-subtitle">{{ p.cedula }}</span>
            </div>
          </li>
          <li v-if="pacientesDiagnosticadosFiltrados.length === 0" class="readonly-item">
            <span class="item-subtitle">No hay pacientes diagnosticados con ese filtro.</span>
          </li>
        </ul>
      </div>

      <div class="patient-list-container">
        <div class="list-header">
          <h4>No Diagnosticados</h4>
          <span class="list-counter">{{ pacientesNoDiagnosticadosFiltrados.length }}</span>
        </div>
        <input
          :value="busquedaNoDiagnosticados"
          @input="
            $emit('update:busquedaNoDiagnosticados', ($event.target as HTMLInputElement).value)
          "
          type="text"
          placeholder="Buscar por cédula, nombre o apellido..."
          class="mini-search"
        />
        <ul class="patient-list">
          <li v-for="p in pacientesNoDiagnosticadosFiltrados" :key="p.id">
            <span class="status-dot not-diagnosed"></span>
            <div class="item-main-info">
              <span class="item-title">{{ p.nombre }} {{ p.apellido }}</span>
              <span class="item-subtitle">{{ p.cedula }}</span>
            </div>
          </li>
          <li v-if="pacientesNoDiagnosticadosFiltrados.length === 0" class="readonly-item">
            <span class="item-subtitle">No hay pacientes sin diagnosticar con ese filtro.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import type { PacienteConEstado } from '@/types/adminPortal'
// Import the specific ECharts type
import type { ECOption } from '@/composables/portalAdmin/useAdminCharts' // Adjust path if needed

defineProps<{
  pacientesDiagnosticadosFiltrados: PacienteConEstado[]
  pacientesNoDiagnosticadosFiltrados: PacienteConEstado[]
  busquedaDiagnosticados: string
  busquedaNoDiagnosticados: string
  chartDistribucionEdad: ECOption // Use ECOption type
  chartPacientesDiagnosticados: ECOption // Use ECOption type
}>()

defineEmits<{
  (e: 'update:busquedaDiagnosticados', value: string): void
  (e: 'update:busquedaNoDiagnosticados', value: string): void
}>()
</script>
