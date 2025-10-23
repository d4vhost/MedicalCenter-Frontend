<template>
  <div class="sidebar" :class="{ 'is-open': isOpen }">
    <button
      v-if="isOpen && isSmallScreen"
      class="btn-close-sidebar"
      @click="$emit('closeSidebar')"
      aria-label="CERRAR MENÚ"
    >
      <X :size="24" />
    </button>
    <nav class="nav">
      <button
        @click="$emit('setActiveTab', 'dashboard')"
        :class="{ active: activeTab === 'dashboard' }"
      >
        <LayoutDashboard class="sidebar-icon" :size="18" />
        <span>DASHBOARD</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'medicos')"
        :class="{ active: activeTab === 'medicos' }"
      >
        <Stethoscope class="sidebar-icon" :size="18" />
        <span>MÉDICOS</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'pacientes')"
        :class="{ active: activeTab === 'pacientes' }"
      >
        <Users class="sidebar-icon" :size="18" />
        <span>PACIENTES</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'centros')"
        :class="{ active: activeTab === 'centros' }"
      >
        <Building class="sidebar-icon" :size="18" />
        <span>CENTROS MÉDICOS</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'especialidades')"
        :class="{ active: activeTab === 'especialidades' }"
      >
        <Star class="sidebar-icon" :size="18" />
        <span>ESPECIALIDADES</span>
      </button>
      <button
        @click="$emit('setActiveTab', 'medicamentos')"
        :class="{ active: activeTab === 'medicamentos' }"
      >
        <Pill class="sidebar-icon" :size="18" />
        <span>MEDICAMENTOS</span>
      </button>
      <button @click="$emit('goToProfile')" :class="{ active: activeTab === 'perfil' }">
        <UserCircle class="sidebar-icon" :size="18" />
        <span>MI PERFIL</span>
      </button>
    </nav>
    <button @click="$emit('logout')" class="btn-logout-sidebar">
      <LogOut class="sidebar-icon" :size="18" />
      <span>CERRAR SESIÓN</span>
    </button>
  </div>
</template>

<script setup lang="ts">
// IMPORTAMOS TODOS LOS ÍCONOS NECESARIOS DE LUCIDE
import {
  X,
  LayoutDashboard,
  Stethoscope,
  Users,
  Building,
  Star,
  Pill,
  UserCircle,
  LogOut,
} from 'lucide-vue-next'

defineProps<{
  activeTab: string
  isOpen: boolean
  isSmallScreen: boolean
}>()

defineEmits(['setActiveTab', 'logout', 'goToProfile', 'closeSidebar'])
</script>
