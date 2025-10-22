<template>
  <div class="tab-content">
    <div class="tab-header">
      <h2>Gestión de Especialidades</h2>
      <button @click="$emit('abrirModalEspecialidad', null)" class="btn-primary">
        Agregar Especialidad
      </button>
    </div>

    <div class="filters">
      <input
        :value="busquedaEspecialidad"
        @input="$emit('update:busquedaEspecialidad', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Buscar especialidad..."
      />
    </div>

    <div class="table-wrapper">
      <div class="table-wrapper-inner">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="especialidad in paginatedEspecialidades"
              :key="especialidad.id"
              @click="$emit('abrirModalEspecialidad', especialidad)"
            >
              <td>{{ especialidad.nombre }}</td>
              <td class="action-cell">
                <button
                  class="btn-view"
                  @click.stop="$emit('abrirModalEspecialidad', especialidad)"
                >
                  Ver / Editar
                </button>
              </td>
            </tr>
            <tr
              v-for="i in Math.max(0, 8 - paginatedEspecialidades.length)"
              :key="'empty-esp-' + i"
              class="empty-row"
            >
              <td v-for="j in 2" :key="'empty-cell-' + i + '-' + j">
                <span class="empty-cell-content">&nbsp;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="pagination">
      <button
        @click="$emit('prevPage', 'especialidades')"
        :disabled="currentPageEspecialidades === 1"
      >
        Anterior
      </button>
      <span>Página {{ currentPageEspecialidades }} de {{ totalPagesEspecialidades }}</span>
      <button
        @click="$emit('nextPage', 'especialidades')"
        :disabled="currentPageEspecialidades === totalPagesEspecialidades"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Especialidad } from '@/types/adminPortal'

defineProps<{
  paginatedEspecialidades: Especialidad[]
  currentPageEspecialidades: number
  totalPagesEspecialidades: number
  busquedaEspecialidad: string
}>()

defineEmits<{
  (e: 'abrirModalEspecialidad', especialidad: Especialidad | null): void
  (e: 'prevPage', pageType: 'especialidades'): void
  (e: 'nextPage', pageType: 'especialidades'): void
  (e: 'update:busquedaEspecialidad', value: string): void
}>()
</script>
