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
        <div class="chart-placeholder">Gráfico de Consultas no disponible.</div>
      </div>
      <div class="card chart-container">
        <h4>Médicos por Centro</h4>
        <div class="chart-placeholder">Gráfico de Médicos no disponible.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalMedicos: number
  totalPacientes: number
  totalCentros: number
  totalEspecialidades: number
}>()
</script>

<style scoped>
.chart-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px; /* Igual a la altura original del gráfico */
  height: 300px;
  color: var(--text-muted-color);
  font-style: italic;
  border: 1px dashed var(--border-color);
  border-radius: var(--radius-md);
  margin-top: 1rem;
}
</style>
