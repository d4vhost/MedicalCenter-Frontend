<template>
  <div class="tab-content patient-tab-layout">
    <div class="tab-header">
      <h2>Gestión de Pacientes</h2>
    </div>

    <div class="patient-stats-layout">
      <div class="stat-card">
        <h3>Total Pacientes</h3>
        <p class="stat-number">{{ totalPacientes }}</p>
      </div>
      <div class="stat-card">
        <h3>Pacientes Diagnosticados</h3>
        <p class="stat-number">{{ totalPacientesDiagnosticados }}</p>
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
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PacienteConEstado } from '@/types/adminPortal'

defineProps<{
  pacientesDiagnosticadosFiltrados: PacienteConEstado[]
  pacientesNoDiagnosticadosFiltrados: PacienteConEstado[]
  busquedaDiagnosticados: string
  busquedaNoDiagnosticados: string
  totalPacientes: number // Prop para el total
  totalPacientesDiagnosticados: number // Prop para diagnosticados
}>()

defineEmits<{
  (e: 'update:busquedaDiagnosticados', value: string): void
  (e: 'update:busquedaNoDiagnosticados', value: string): void
}>()
</script>

<style scoped>
.patient-stats-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem; /* Espacio antes de las listas */
}

/* Reutiliza estilos de stat-card si los tienes definidos globalmente */
/* Si no, define aquí estilos básicos para .stat-card */
.stat-card {
  background-color: var(--surface-color);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  text-align: center;
}
.stat-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-muted-color);
}
.stat-card .stat-number {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--headline-color);
}

.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
  height: 220px;
  color: var(--text-muted-color);
  font-style: italic;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 1rem;
}
</style>
